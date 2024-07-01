import os
from typing import Optional
from pony.orm.core import db_session

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from starlette.middleware.cors import CORSMiddleware

from .api import login_and_get_session, fetch_data_for_jug, get_jug_data, get_all_jug_ids
from .auth import get_hash, decode_auth_token, generate_auth_token
from .models import db, User, JugUser
from .schemas import LinkJugsForm, UserLogin, UserRegister, JugLink, JugUserUpdate
from .services import (create_user, get_jug_ids_by_community, get_user_hash, user_exists, get_jug_name_by_id,
                       get_user_by_email, get_user_by_id,
                       unlink_jug_from_user_s,
                       link_jugs_to_user_s, update_jug_user_data)

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db.bind(
    provider='postgres',
    user=os.getenv("DB_USERNAME"),
    password=os.getenv("DB_PASSWORD"),
    host=os.getenv("DB_HOST"),
    database='postgres'
)
db.generate_mapping(create_tables=True)

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
    user = create_user(form.name, form.email, hashed_password)
    token = generate_auth_token(user.id)
    return {"access_token": token, "token_type": "bearer"}


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
    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=400, detail='user not found')

    community = user.community
    jug_ids = get_jug_ids_by_community(community)
    devices_info = []
    session = login_and_get_session()
    for jug_id in jug_ids:
        jug_data = fetch_data_for_jug(session, jug_id)
        if jug_data is None:
            continue
        jug_data['name'] = get_jug_name_by_id(jug_id)
        jug_data['id'] = jug_id
        devices_info.append(jug_data)
    return devices_info

@app.post("/check-token")
async def check_token(user_id: str = Depends(auth_user)):
    return {"status": "success"}

# Temporary for MVP
@app.get("/get-all-jugs")
async def get_all_jugs(user_id: str = Depends(auth_user)):
    session = login_and_get_session()
    return get_all_jug_ids(session)

# example of using a protected route; the Depends(auth_user) part should be added to all protected routes
# @app.get("/protected")
# async def protected(user_id: str = Depends(auth_user)):

#     user = get_user_by_id(user_id)

#     return f"name={user.name} email={user.email}"

@app.get("/historical-jug-data")
async def get_historical_jug_data(juguser_id: int, timestamp: int):

    # atm only works for one jug per user
    # check if the user_id OWNS or follows the jugusers community

    with db_session:
        juguser = JugUser.get(id=juguser_id)
        user = juguser.community.followers.order_by(User.id).first() # TODO fix
        if user.community != juguser.community:
            raise HTTPException(status_code=400, detail='unauthorized')
        jugs = juguser.jugs

        session = login_and_get_session()
        # sorry neill

        big_list = []
        for jug in jugs:
            big_list.extend(get_jug_data(session, jug, timestamp))


        return sorted(big_list, key=lambda x: x['time'])

# Endpoint for updating jug user data
@app.post("/update")
async def update(form: JugUserUpdate, user_id: str = Depends(auth_user)):
    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=400, detail='user not found')
    update_jug_user_data(form.id, form.key, form.value)
    return {"message": "Jug user data updated successfully"}
