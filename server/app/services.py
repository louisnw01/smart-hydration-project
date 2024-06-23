import os
from dotenv import load_dotenv
from .models import db, User, Jug, JugUser
from pony.orm.core import commit, get, select, raw_sql, db_session, set_sql_debug, show
from .api import login_and_get_session, headers
import json


@db_session
def find_user(name):
    result = get(u for u in User if u.name == name)
    return result


@db_session
def has_access_to_jug(user, sh_jug_id):
    relevant_jug = getattr(get(j for j in Jug if j.smart_hydration_id == sh_jug_id), 'owner')
    jug_community = relevant_jug.community
    user_community = find_user(user).community
    if (jug_community == user_community):
        return True
    return False

@db_session
def get_jug_list_by_community(community_member):
    jug_community = community_member.community
    juglist = select(j.smart_hydration_id for j in Jug if (j.owner.community == jug_community))[:]
    return juglist

def fetch_data_for_jug(sh_jug_id):
    session = login_and_get_session()
    response = session.get("https://www.smarthydration.online/data/device/" + sh_jug_id + "/events/hydration", headers=headers)
    if not response.ok:
        return { sh_jug_id : "Jug Not Found" }
    else:
        return { get_jug_name_by_id(sh_jug_id) : response.json()[-1] }

@db_session
def get_jug_name_by_id(sh_jug_id):
    jug = get(j for j in Jug if j.smart_hydration_id == sh_jug_id)
    name = jug.name
    return name

def get_community_jug_data(user_id):
    print('Getting data for ' + user_id)
    juglist = get_jug_list_by_community(find_user(user_id))
    responses = []
    for j in juglist:
        print('Trying: ' + j)
        responses.append(fetch_data_for_jug(j))
    return responses



