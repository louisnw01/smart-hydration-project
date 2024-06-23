import os
import json
from fastapi import FastAPI, Query, HTTPException, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from dotenv import load_dotenv
from typing import Optional

from .services import create_user, get_user_by_id, get_user_hash, get_auth_token, user_exists, get_community_jug_data, find_user
from .models import db
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


@app.get("/community-jug-status/")
async def get_community_jug_status(user_id: str = Query(...)):
    print(user_id)
    data = get_community_jug_data(user_id)
    return json.dumps(data)

# example of using a protected route; the Depends(auth_user) part should be added to all protected routes
@app.get("/protected")
async def protected(user_id: str = Depends(auth_user)):

    user = get_user_by_id(user_id)

    return f"name={user.name} email={user.email}"

