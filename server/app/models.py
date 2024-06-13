import os
from dotenv import load_dotenv
from pony.orm.core import *


load_dotenv()

db = Database();

class User(db.Entity):
    id = PrimaryKey(int, auto=True)
    name = Required(str)
    email = Required(str)
    hash = Required(str)


class Jug(db.Entity):
    id = PrimaryKey(int, auto=True)
    name = Required(str)


db.bind(
    provider='postgres',
    user=os.getenv("DB_USERNAME"),
    password=os.getenv("DB_PASSWORD"),
    host=os.getenv("DB_HOST"),
    database='postgres'
)

db.generate_mapping(create_tables=True)