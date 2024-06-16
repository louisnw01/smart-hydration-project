import os
from models import User, Jug
from pony.orm.core import commit, select, db_session, set_sql_debug, show


@db_session
def create_user(name, email, hash):
    user = User(name=name, email=email, hash=hash)
    commit()

    
@db_session
def find_user(name):
    result = select(u for u in User if u.name == name)
    show(result)
    return result
