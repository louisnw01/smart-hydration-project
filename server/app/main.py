import os
from fastapi import FastAPI
from .models import db
from dotenv import load_dotenv

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


@app.get("/api/data")
def get_data():
    return {"message": "Hello from FastAPI!"}
