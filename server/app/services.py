import os
from models import User, Jug, Community
from pony.orm.core import commit, select, db_session, set_sql_debug, show


@db_session
def create_user(name, email, hash,community):
    user = User(name=name, email=email, hash=hash, community=community)
    commit()

@db_session
def delete_user(user_name, email,hash):
    user = User.get(name=user_name,email=email,hash=hash)
    #if user is found get community associated with user in user.community
    if user:
        community_id = user.community
        #fetch community object using community's id community_id.id as community in USer model links to Community model 
        community = Community.get(id=community_id.id)
        community.delete()
        user.delete()


@db_session
def find_user(name):
    result = select(u for u in User if u.name == name)
    show(result)
    return result

@db_session
def create_community(name):
    community = Community(name=name)
    commit()
    return community

@db_session
def find_community(name):
    result = select(c for c in Community if c.name == name)
    show(result)
    return result
