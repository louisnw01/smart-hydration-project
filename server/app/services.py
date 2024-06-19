import os
from models import User, Jug, Community, JugUser
from pony.orm.core import commit, select, db_session, set_sql_debug, show, get


@db_session
def create_user(name, email, hash):
    user = User(name=name, email=email, hash=hash)
    commit()
    return user.id

@db_session
def find_user(name):
    result = select(u for u in User if u.name == name)
    show(result)

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

