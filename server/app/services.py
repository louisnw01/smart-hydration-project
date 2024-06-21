import os
from models import User, Jug, JugUser
from pony.orm.core import commit, select, db_session, set_sql_debug, show
from api import login_and_get_session, headers
import json
import pprint


@db_session
def create_user(name, email, hash):
    user = User(name=name, email=email, hash=hash)
    commit()


@db_session
def find_user(name):
    result = select(u for u in User if u.name == name)
    show(result)
    return result

@db_session
def get_jug_data(sh_jug_id):
    session = login_and_get_session()
    response = session.get("https://www.smarthydration.online/data/device/" + sh_jug_id + "/events/hydration", headers=headers)
    return response.json()

@db_session
def get_jug_owner(sh_jug_id):
    print("Trying to get data for jug " + sh_jug_id)
    result = select(j for j in Jug if j.smart_hydration_id == sh_jug_id)
    show(result)
    return True

def get_most_recent_event(sh_jug_id):
    if (is_jug_owner(user_id, sh_jug_id) == False):
        return "User does not own the jug"
    session = login_and_get_session()
    response = session.get("https://www.smarthydration.online/data/device/" + sh_jug_id + "/events/hydration", headers=headers)
    print("last event:")
    return response.json()[-1]



#get_most_recent_event("jug001053")
find_user('Neill')
get_jug_owner("jug001053")


