import os
from models import User, Jug, Community
from pony.orm.core import commit, select, db_session, set_sql_debug, show


@db_session
def create_user(name, email, hash,community):
    user = User(name=name, email=email, hash=hash, community=community)
    commit()

@db_session
def delete_user(user_name):#email,hash)
    user = User.get(name=user_name)
    user_id = user.id
    community = Community.get(id=user_id)
    #email = User.get(email=email)
    #hash = User.get(hash=hash)
    #if user: #and email and hash:
    #    user.delete()
    show(community)
    return community


@db_session
def find_user(name):
    result = select(u for u in User if u.name == name)
    show(result)
    return result

@db_session
def create_community(name):
    community = Community(name=name)
    commit()

@db_session
def find_community(name):
    result = select(c for c in Community if c.name == name)
    show(result)
    return result
