import os
import json
import pprint
from fastapi import FastAPI, Query, HTTPException, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from dotenv import load_dotenv
from typing import Optional
from pony.orm.core import db_session

from .services import create_user, get_jug_ids_by_community, get_user_hash, get_auth_token,\
                        user_exists, get_jug_name_by_id, find_user
from .api import login_and_get_session, fetch_data_for_jug, get_jug_data
from .models import db, User, JugUser
from .schemas import UserLogin, UserRegister
from .auth import get_hash, decode_auth_token


load_dotenv()

app = FastAPI()

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


@app.post("/register")
async def register(form: UserRegister):
    if user_exists(form.email):
        raise HTTPException(status_code=400, detail="email already registered")

    hashed_password = get_hash(form.password)
    create_user(form.name, form.email, hashed_password)
    return {"message": "success"}


@app.post("/login")
async def login(form: UserLogin):
    if not user_exists(form.email):
        raise HTTPException(status_code=400, detail="incorrect email or password")

    hashed_password = get_user_hash(form.email)
    given_hash = get_hash(form.password)

    if hashed_password != given_hash:
        raise HTTPException(status_code=400, detail="incorrect email or password")

    token = get_auth_token(form.email)
    return {"access_token": token, "token_type": "bearer"}


@app.get("/community-jug-status")
async def get_community_jug_status(user_id: str = Query(...)):
    user = find_user(user_id)
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
        devices_info.append(jug_data)
    return devices_info

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
