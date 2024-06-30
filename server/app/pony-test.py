import os
from dotenv import load_dotenv
from models import db
from services import *


load_dotenv()

db.bind(
    provider='postgres',
    user=os.getenv("DB_USERNAME"),
    password=os.getenv("DB_PASSWORD"),
    host=os.getenv("DB_HOST"),
    database='postgres'
)
db.generate_mapping(create_tables=True)


# create_community("Jedi")
# com_id = get_community_id("Jedi")
# create_jug_user("Luke", "10103000", com_id)
# create_jug("jug52", "hash66", "R2D2")
jug_id = get_jug_id("R2D2")
jug_user_id = get_jug_user_id("Luke")
# link_jug_to_jug_user(jug_id, jug_user_id)
unlink_jug_from_jug_user(jug_id, jug_user_id)
