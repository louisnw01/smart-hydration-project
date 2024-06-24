import os
from fastapi import FastAPI
from .models import db, Jug
from dotenv import load_dotenv
from services import *

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


@app.post('/link-jug-to-user')
async def link_jug(body):
    link_jug_to_jug_user(body.userId, body.jugId)



