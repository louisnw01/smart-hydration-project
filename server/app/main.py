import os
from fastapi import FastAPI, Query
from .services import get_community_jug_data
from .models import db
from dotenv import load_dotenv
import json

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

@app.get("/community-jug-status/")
async def get_community_jug_status(user_id: str = Query(...)):
    print(user_id)
    data = get_community_jug_data(user_id)
    return json.dumps(data)

