import os
from pony.orm.core import *

db = Database();


class User(db.Entity):
    id = PrimaryKey(int, auto=True)
    email = Required(str)
    name = Required(str)
    community = Required('Community')
    hash = Required(str)

class JugUser(db.Entity):
    id = PrimaryKey(int, auto=True)
    name = Required(str)
    dob = Required(str)
    weight = Optional(str)
    height = Optional(str)
    sex = Optional(str)
    ethnicity = Optional(str)
    jugs = Set('Jug')
    community = Required('Community')

class Jug(db.Entity):
    id = PrimaryKey(int, auto=True)
    smart_hydration_id = Required(str)
    qr_hash = Required(str)
    name = Optional(str)
    owner = Optional(JugUser)

class Community(db.Entity):
    id = PrimaryKey(int, auto=True)
    name = Required(str)
    jug_users = Set(JugUser, reverse="community")
    followers = Set(User)

class Medication(db.Entity):
    id = PrimaryKey(int, auto=True)
    name = Required(str)
