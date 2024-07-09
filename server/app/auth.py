import hashlib
import os
import time
from uuid import UUID

import jwt

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
