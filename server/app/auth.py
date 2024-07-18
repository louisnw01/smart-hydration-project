import hashlib
import os
import string
import random
import time
from typing import Optional
from uuid import UUID
from dotenv import load_dotenv
from fastapi import HTTPException, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import jwt

from .services import get_user_by_id

load_dotenv()

AUTH_TOKEN_EXPIRATION_SECS = 86_400 * 30


def get_hash(string: str):
    hash_object = hashlib.sha512(string.encode())
    return hash_object.hexdigest()


def generate_auth_token(user_id: UUID):
    payload = {
        "id": str(user_id),
        "expires": time.time() + AUTH_TOKEN_EXPIRATION_SECS
    }
    return jwt.encode(payload, os.getenv('JWT_SECRET'), algorithm=os.getenv('JWT_ALGORITHM'))


def decode_auth_token(token: str):
    result = jwt.decode(token, os.getenv('JWT_SECRET'), algorithms=[os.getenv('JWT_ALGORITHM')])
    return result['id'] if result['expires'] >= time.time() else None


get_bearer_token = HTTPBearer(auto_error=False)

async def auth_user(
        auth: Optional[HTTPAuthorizationCredentials] = Depends(get_bearer_token),
) -> str:
    if auth is None:
        raise HTTPException(status_code=401, detail='unauthorized token')

    user_id = decode_auth_token(auth.credentials)
    user = get_user_by_id(user_id)

    if user_id is None or not user:
        raise HTTPException(status_code=401, detail='unauthorized token')

    if not user.email_verified:
        raise HTTPException(status_code=403, detail='email unverified')

    return user_id


def generate_invite_link(length=10):
    characters = string.ascii_letters + string.digits
    random_string = ''.join(random.choice(characters) for _ in range(length))
    return random_string
