import asyncio

from fastapi import HTTPException
from pony.orm.core import commit, get, select, db_session

from .mail import send_email_with_ses
from .models import User, Jug, JugUser, Community
from .schemas import AddJugUserForm
from datetime import datetime, time

@db_session
def user_exists(email):
    return True if User.get(email=email.lower()) else False


@db_session
def delete_user(user_id):
    user = User.get(id=user_id)
    community_member = user.community_member
    jug_user = user.jug_user

    if jug_user:
        jug_user.delete()
    if community_member:
        community_member.delete()
    if user:
        email = user.email
        name = user.name
        send_email_with_ses(name, email, "delete")
        user.delete()
    commit()


@db_session
def get_users_jugs_sh_ids(user_id):
    user = User.get(id=user_id)
    if not user.jug_user:
        return []
    jugs = user.jug_user.jugs
    jug_list = set()

    for jug in jugs:
        jug_list.add(jug.smart_hydration_id)
    return jug_list


def get_users_community(user_id):
    user = User.get(id=user_id)
    member = user.community_member
    if not member:
        return None
    return member.community


def try_get_users_community(user_id):
    community = get_users_community(user_id)
    if not community:
        raise HTTPException(400, 'user is not part of a community')
    return community

@db_session
def clear_drank_today():
    for jug_user in select(j for j in JugUser):
        jug_user.drank_today = 0
    commit()

async def reset_drank_today():
    while True:
        now = datetime.now()
        end_of_day_today = datetime.combine(now.date(), time(23, 59, 59))
        time_to_wait = end_of_day_today.timestamp() - now.timestamp()
        await asyncio.sleep(time_to_wait)
        clear_drank_today()
