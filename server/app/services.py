import os
from models import User, Jug
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

pprint.pprint(get_jug_data("jug001052"))
