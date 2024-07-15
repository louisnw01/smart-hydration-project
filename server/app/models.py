import os
from uuid import UUID
from pony.orm.core import *
from dotenv import load_dotenv

load_dotenv()

db = Database()


def connect_to_database():
    if os.getenv('USE_PRODUCTION_DB'):
        user = os.getenv('PROD_DB_USERNAME')
        password = os.getenv('PROD_DB_PASSWORD')
        host = os.getenv('PROD_DB_HOST')
    else:
        user = os.getenv('STAGING_DB_USERNAME')
        password = os.getenv('STAGING_DB_PASSWORD')
        host = os.getenv('STAGING_DB_HOST')



    db.bind(
        provider='postgres',
        user=user,
        password=password,
        host=host,
        database='postgres'
    )
    db.generate_mapping(create_tables=True)


class User(db.Entity):
    id = PrimaryKey(UUID, auto=True)
    email = Required(str)
    name = Required(str)
    community_member = Optional('CommunityMember')
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
    otherdrinks = Set('OtherDrink')


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
    followers = Set('CommunityMember')


class CommunityMember(db.Entity):
    id = PrimaryKey(int, auto=True)
    community = Required(Community)
    user = Required(User)
    is_owner = Required(bool)


class OtherDrink(db.Entity):
    id = PrimaryKey(int, auto=True)
    juguser = Required('JugUser')
    timestamp = Required(int)
    name = Required(str)
    capacity = Required(int)


class Medication(db.Entity):
    id = PrimaryKey(int, auto=True)
    name = Required(str)
