import os
import pprint
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pony.orm.core import db_session, commit, select
from starlette.middleware.cors import CORSMiddleware

from .routers import community
from .api import login_and_get_session, get_jug_latest, get_hydration_events, get_all_jug_ids, get_todays_intake
from .auth import get_hash, decode_auth_token, generate_auth_token
from .models import db, User, JugUser, Jug, OtherDrink, connect_to_database
from .schemas import LinkJugsForm, UserLogin, UserRegister, JugLink, UpdateJugForm, JugUserUpdate, AddDrinkForm, \
    AddJugUserForm
from .services import (create_user, get_user_hash, user_exists, get_user_by_email, get_user_by_id,
                       unlink_jug_from_user_s,
                       link_jugs_to_user_s, get_user_name, get_users_jugs, update_jug_name_s, create_jug_user,
                       update_jug_user_data, create_jug_user_no_owner)

load_dotenv()

connect_to_database()

app = FastAPI()
app.include_router(community.router)

get_bearer_token = HTTPBearer(auto_error=False)


async def auth_user(
        auth: Optional[HTTPAuthorizationCredentials] = Depends(get_bearer_token),
) -> str:
    if auth is None:
        raise HTTPException(status_code=401, detail='unauthorized token')

    user_id = decode_auth_token(auth.credentials)

    if user_id is None or not get_user_by_id(user_id):
        raise HTTPException(status_code=401, detail='unauthorized token')

    return user_id


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post('/link-jug-to-user')
async def link_jug_to_user(body: LinkJugsForm, user_id: str = Depends(auth_user)):
    link_jugs_to_user_s(user_id, body.jugIds)


@app.post('/unlink-jug-from-user')
async def unlink_jug_from_user(body: JugLink, user_id: str = Depends(auth_user)):
    unlink_jug_from_user_s(user_id, body.jugId)


@app.post("/register")
async def register(form: UserRegister):
    if user_exists(form.email):
        raise HTTPException(status_code=400, detail="email already registered")
    hashed_password = get_hash(form.password)
    with db_session:
        user = create_user(form.name, form.email, hashed_password)
        if not user.jug_user:
            create_jug_user(user)
            jug_user_id = user.jug_user.id
            if form.dob:
                update_jug_user_data(jug_user_id, "dob", form.dob)
    token = generate_auth_token(user.id)
    return {"access_token": token, "token_type": "bearer"}


# Endpoint for updating jug user data
# Currently unused, but keeping this for when we need to edit jug user data (e.g. weight) via settings
@app.post("/update")
async def update(form: JugUserUpdate, user_id: str = Depends(auth_user)):
    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=400, detail='user not found')
    update_jug_user_data(form.id, form.key, form.value)
    return {"message": "Jug user data updated successfully"}


@app.post("/login")
async def login(form: UserLogin):
    if not user_exists(form.email):
        raise HTTPException(status_code=400, detail="incorrect email or password")

    hashed_password = get_user_hash(form.email)
    given_hash = get_hash(form.password)

    if hashed_password != given_hash:
        raise HTTPException(status_code=400, detail="incorrect email or password")

    user = get_user_by_email(form.email)
    token = generate_auth_token(user.id)
    return {"access_token": token, "token_type": "bearer"}


@app.get("/community-jug-status")
async def get_community_jug_status(user_id: str = Depends(auth_user)):
    # TODO perhaps this logic should be in auth_user, and it returns user rather than user_id

    with db_session:
        # community = user.community
        user = User.get(id=user_id)
        if not user or not user.jug_user:
            raise HTTPException(status_code=400, detail='user not found')
        jugs = user.jug_user.jugs
        devices_info = []
        session = login_and_get_session()
        for jug in jugs:
            jug_data = get_jug_latest(session, jug.smart_hydration_id)
            if jug_data is None:
                continue
            jug_data['name'] = jug.name
            jug_data['id'] = jug.smart_hydration_id
            devices_info.append(jug_data)
        return devices_info


@app.post("/check-token")
async def check_token(user_id: str = Depends(auth_user)):
    return {"status": "success"}


# Temporary for MVP
@app.get("/get-all-jugs")
async def get_all_jugs(user_id: str = Depends(auth_user)):
    session = login_and_get_session()
    return get_all_jug_ids(user_id, session)


@app.get("/user")
async def get_user(user_id: str = Depends(auth_user)):
    return get_user_name(user_id)


# example of using a protected route; the Depends(auth_user) part should be added to all protected routes
# @app.get("/protected")
# async def protected(user_id: str = Depends(auth_user)):

#     user = get_user_by_id(user_id)

#     return f"name={user.name} email={user.email}"

@app.get("/historical-jug-data")
async def get_historical_jug_data(timestamp: int, user_id: str = Depends(auth_user)):
    # atm only works for one jug per user
    # check if the user_id OWNS or follows the jugusers community

    with db_session:
        user = User.get(id=user_id)
        juguser = user.jug_user
        # if user.community != juguser.community:
            # raise HTTPException(status_code=400, detail='unauthorized')
        if not juguser:
            return []
        jugs = juguser.jugs

        session = login_and_get_session()

        big_list = []
        for jug in jugs:
            big_list.extend(get_hydration_events(session, jug, timestamp))

        other_drinks = select(o for o in OtherDrink if (o.juguser == juguser))

        for drink in other_drinks:
            print(drink.timestamp , " " , drink.capacity)
            big_list.append({"time": drink.timestamp, "value": drink.capacity})

        return sorted(big_list, key=lambda x: x['time'])


@app.get("/todays-total-intake")
async def get_todays_total_intake(user_id: str = Depends(auth_user)):
    with db_session:
        jugs = get_users_jugs(user_id)

        session = login_and_get_session()

        intake_total = 0

        for jug in jugs:
            intake_total += get_todays_intake(session, jug.smart_hydration_id)

    return intake_total


@app.post("/update-jug-name")
async def update_jug_name(form: UpdateJugForm, user_id: str = Depends(auth_user)):
    with db_session:
        jugs = get_users_jugs(user_id)

        jug = Jug.get(smart_hydration_id=form.jugId)

        if jug not in jugs:
            raise HTTPException(status_code=401, detail='Unauthorized')

        update_jug_name_s(form.jugId, form.name)


@app.get("/user-exists")
async def email_exists(email: str):
    return user_exists(email)


@app.post("/add-drink-event")
async def add_drink_event(form: AddDrinkForm, user_id: str = Depends(auth_user)):
    with db_session:
        user = User.get(id=user_id)
        juguser = user.jug_user
        print(AddDrinkForm)
        OtherDrink(juguser=juguser, timestamp=form.timestamp, name=form.name, capacity=form.capacity)
        commit()


@app.post("/jug-user/create")
async def add_jug_user(form: AddJugUserForm, user_id: str = Depends(auth_user)):
    with db_session:
        community = User.get(id=user_id).community
        create_jug_user_no_owner(community, form)
