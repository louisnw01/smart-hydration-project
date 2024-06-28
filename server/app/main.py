import os
import json
from fastapi import FastAPI, Query, HTTPException, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from dotenv import load_dotenv
from typing import Optional

from .services import create_user, get_jug_ids_by_community, get_user_hash, get_auth_token,\
                        user_exists, get_jug_name_by_id, find_user, get_user_by_id, get_user_by_email
from .api import login_and_get_session, fetch_data_for_jug, get_all_jug_ids
from .models import db
from .schemas import UserLogin, UserRegister
from .auth import get_hash, decode_auth_token, generate_auth_token


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
