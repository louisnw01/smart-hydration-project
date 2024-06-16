import os
from pony.orm.core import *

db = Database();


class User(db.Entity):
    id = PrimaryKey(int, auto=True)
    name = Required(str)
    email = Required(str)
    hash = Required(str)


class Jug(db.Entity):
    id = PrimaryKey(int, auto=True)
    name = Required(str)
