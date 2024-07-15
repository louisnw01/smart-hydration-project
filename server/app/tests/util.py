import os
from fastapi.testclient import TestClient
from dotenv import load_dotenv

from app.auth import generate_auth_token
from app.main import app

load_dotenv()

USER_ID = os.getenv("TESTING_USER_ID")
if not USER_ID:
    raise Exception('you are missing the TESTING_USER_ID .env var')

# creates the fastapi test client, and adds the test auth token as a header
def get_test_client():
    client = TestClient(app)
    token = generate_auth_token(USER_ID)
    client.headers['Authorization'] = f'Bearer {token}'
    return client
