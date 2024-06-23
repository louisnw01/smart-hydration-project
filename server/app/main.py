import os
import json
from fastapi import FastAPI, Query, HTTPException
from dotenv import load_dotenv

from .services import create_user, get_jug_ids_by_community, get_user_hash, get_auth_token,\
                        user_exists, get_jug_name_by_id, find_user
from .api import login_and_get_session, fetch_data_for_jug
from .models import db
from .schemas import UserLogin, UserRegister
from .util import get_hash


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

