import os
from dotenv import load_dotenv
from models import db, User, Jug, JugUser
from pony.orm.core import commit, get, select, db_session, set_sql_debug, show
from api import login_and_get_session, headers
import json
import pprint

load_dotenv()

db.bind(
    provider='postgres',
    user=os.getenv("DB_USERNAME"),
    password=os.getenv("DB_PASSWORD"),
    host=os.getenv("DB_HOST"),
    database='postgres'
)
db.generate_mapping(create_tables=True)

@db_session
def create_user(name, email, hash):
    user = User(name=name, email=email, hash=hash)
    commit()


@db_session
def find_user(name):
    result = get(u for u in User if u.name == name)
    return result

@db_session
def get_jug_data(user_id, sh_jug_id):

    session = login_and_get_session()
    response = session.get("https://www.smarthydration.online/data/device/" + sh_jug_id + "/events/hydration", headers=headers)
    return response.json()


@db_session
def get_community_by_user(user_id):
    result = getattr(user_id, "community")
    return result

@db_session
def get_user_by_jug_user(jug_user_id):
    print("Getting user for juguser " )
    print(jug_user_id)


def get_most_recent_event(sh_jug_id):
    if (is_jug_owner(user_id, sh_jug_id) == False):
        return "User does not own the jug"
    session = login_and_get_session()
    response = session.get("https://www.smarthydration.online/data/device/" + sh_jug_id + "/events/hydration", headers=headers)
    print("last event:")
    return response.json()[-1]

@db_session
def has_access_to_jug(user, sh_jug_id):
    relevant_jug = getattr(get(j for j in Jug if j.smart_hydration_id == sh_jug_id), 'owner')
    jug_community = getattr(relevant_jug, "community")
    user_community = getattr(find_user(user), "community")
    if (jug_community == user_community):
        print('The user can access the jug')
        return True
    return False


#get_most_recent_event("jug001053")
test_user = find_user('Neill')
#test if the current user is neill, and he owns the jug, can he add it?
print(has_access_to_jug('Neill', "jug001053"))
