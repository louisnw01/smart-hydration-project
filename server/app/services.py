import os
from models import User, Jug, JugUser, Community
from pony.orm.core import commit, select, db_session, set_sql_debug, show


@db_session
def create_user(name, email, hash):
    User(name=name, email=email, hash=hash)
    commit()


@db_session
def find_user(name):
    result = select(u for u in User if u.name == name)
    show(result)
    return result


@db_session
def create_jug_user(name, dob, community):
    JugUser(name=name, dob=dob, community=community)
    commit()


@db_session
def create_community(name):
    Community(name=name)
    commit()


@db_session
def get_community_id(name):
    return Community.get(name=name).id


@db_session
def create_jug(sh_id, qr_hash, name):
    Jug(smart_hydration_id=sh_id, qr_hash=qr_hash, name=name)
    commit()


@db_session
def link_jug_to_user(user_id, jug_id):
    user = User.get(id=user_id)
    if not user.jug_user:
        create_jug_user(user.name, user.dob, user.community)

    jug_user = user.jug_user
    link_jug_to_jug_user(jug_user.id, jug_id)


def unlink_jug_from_user(user_id, jug_id):
    jug_user = User.get(id=user_id).jug_user
    unlink_jug_from_jug_user(jug_user.id, jug_id)


@db_session
def link_jug_to_jug_user(jug_id, jug_user_id):
    jug = Jug.get(id=jug_id)
    JugUser.get(id=jug_user_id).jugs.add(jug)
    commit()


@db_session
def unlink_jug_from_jug_user(jug_id, jug_user_id):
    jug = Jug.get(id=jug_id)
    JugUser.get(id=jug_user_id).jugs.remove(jug)
    commit()


@db_session
def get_jug_id(name):
    return Jug.get(name=name).id


@db_session
def get_jug_user_id(name):
    return JugUser.get(name=name).id
