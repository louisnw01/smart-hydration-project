import os
from models import User, Jug
from pony.orm.core import commit, select, db_session


@db_session
def create_user(name, email, hash):
    user = User(name=name, email=email, hash=hash)
    commit()

