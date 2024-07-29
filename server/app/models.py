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
    email_verified = Required(bool)
    email_link = Optional('VerifyEmail')
    notifications = Set('Notifications')


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
    target = Optional(int)
    last_drank = Optional(int)


class Jug(db.Entity):
    id = PrimaryKey(int, auto=True)
    smart_hydration_id = Required(str)
    qr_hash = Required(str)
    name = Optional(str)
    owners = Set('JugUser')
    system_id = Required(int)


class Community(db.Entity):
    id = PrimaryKey(int, auto=True)
    name = Required(str)
    jug_users = Set(JugUser)
    followers = Set('CommunityMember')
    invite_links = Set('InviteLink')


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


class VerifyEmail(db.Entity):
    id = PrimaryKey(str)
    expire_time = Required(int)
    user = Required(User)


class InviteLink(db.Entity):
    id = PrimaryKey(str)            # the id is the code at the end of the link.
    expire_time = Required(int)     # unix timestamp
    permission = Optional(str)
    community = Required(Community)


class Notifications(db.Entity):
    expo_token = PrimaryKey(str)
    active = Required(bool)
    frequency = Required(int)
    send_time = Required(int)
    user = Required(User)

