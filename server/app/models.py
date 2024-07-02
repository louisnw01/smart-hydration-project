import os
from uuid import UUID
from pony.orm.core import *

db = Database()


class User(db.Entity):
    id = PrimaryKey(UUID, auto=True)
    email = Required(str)
    name = Required(str)
    community = Optional('Community')
    hash = Required(str)
    jug_user = Optional('JugUser')


class JugUser(db.Entity):
    id = PrimaryKey(int, auto=True)
    name = Required(str)
    dob = Optional(str)
    weight = Optional(str)
    height = Optional(str)
    sex = Optional(str)
    ethnicity = Optional(str)
    jugs = Set('Jug')
    community = Optional('Community')
    user = Optional(User)


class Jug(db.Entity):
    id = PrimaryKey(int, auto=True)
    smart_hydration_id = Required(str)
    qr_hash = Required(str)
    name = Optional(str)
    owners = Set('JugUser')


class Community(db.Entity):
    id = PrimaryKey(int, auto=True)
    name = Required(str)
    jug_users = Set(JugUser)
    followers = Set(User)


class Medication(db.Entity):
    id = PrimaryKey(int, auto=True)
    name = Required(str)

class Test1(db.Entity):
    id = PrimaryKey(int, auto=True)
    my_test_2s = Set('Test2')

class Test2(db.Entity):
    id = PrimaryKey(int, auto=True)
    my_test_1s = Set('Test1')
