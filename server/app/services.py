import os
from dotenv import load_dotenv
from .models import db, User, Jug, JugUser, Community
from pony.orm.core import commit, get, select, db_session, set_sql_debug, show
import json


@db_session
def create_user(name, email, hash):
    user = User(name=name, email=email, hash=hash)
    commit()
    return user


@db_session
def create_jug_user(
        name: str,
        user_id: int | None = None,
        **kwargs
):
    # if community_id is None and user_id is None:
    # raise Exception("jug user must be assigned to a community or a user")

    user = User[user_id]
    # elif community_id:
    # community = Community[community_id]

    jug_user = JugUser(name=name, user=user, **kwargs)
    commit()
    return jug_user.id


@db_session
def get_user_hash(email: str):
    user = User.get(email=email)
    return user.hash


@db_session
def user_exists(email):
    return True if User.get(email=email) else False


@db_session
def get_auth_token(email):
    pass


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
def get_jug_ids_by_community(community):
    juglist = select(j.smart_hydration_id for j in Jug if (j.owner.community == community))[:]
    return juglist


@db_session
def get_jug_name_by_id(sh_jug_id):
    jug = get(j for j in Jug if j.smart_hydration_id == sh_jug_id)
    name = jug.name
    return name


# def get_community_jug_data(user_id):
#     print('Getting data for ' + user_id)
#     community = find_user(user_id).community
#     jug_ids = get_jug_ids_by_community(community)
#     responses = []
#     session = login_and_get_session()
#     for jug_id in jug_ids:
#         print('Trying: ' + jug_id)
#         responses.append(fetch_data_for_jug(session, jug_id))
#     return responses


@db_session
def get_user_by_id(user_id):
    return User.get(id=user_id)


@db_session
def get_user_by_email(email):
    return User.get(email=email)


# Key is column heading in JugUser table e.g. "dob"
@db_session
def update_jug_user_data(user_id: int, key: str, new_value: str):
    jug_user = JugUser.get(id=user_id)
    if jug_user is None:
        return False
    setattr(jug_user, key, new_value)
    return getattr(jug_user, key) == new_value
