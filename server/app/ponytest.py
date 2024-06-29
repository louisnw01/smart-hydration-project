import os
from dotenv import load_dotenv
from models import db, User, Jug, JugUser, Community
from pony.orm.core import commit, get, select, raw_sql, db_session, set_sql_debug, show
from api import login_and_get_session, headers
import json
import pprint
from services import create_community, create_jug_user, delete_user, create_user

#
#load_dotenv()

#db.bind(
    #provider='postgres',
    #user=os.getenv("DB_USERNAME"),
    #password=os.getenv("DB_PASSWORD"),
    #host=os.getenv("DB_HOST"),
    #database='postgres'
 #)
#db.generate_mapping(create_tables=True)

@db_session
def create_user(name, email, hash):
    user = User(name=name, email=email, hash=hash)
    commit()


@db_session
def get_jug_data(user_id, sh_jug_id):

    session = login_and_get_session()
    response = session.get("https://www.smarthydration.online/data/device/" + sh_jug_id + "/events/hydration", headers=headers)
    return response.json()
