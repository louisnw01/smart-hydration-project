from typing import List
from fastapi import APIRouter, Depends, HTTPException
from pony.orm.core import db_session, select, commit
from pydantic import BaseModel
import datetime as dt

from .data import get_device_info_dict

from ..api import SmartHydrationSession, get_hydration_events, get_jug_latest
from ..auth import auth_user
from ..models import JugUser, User, Jug, ConnectionWindow
from ..schemas import UpdateJugForm
from ..services import get_users_community, try_get_users_community, user_exists

router = APIRouter(
    prefix="/jug",
    tags=["jug"],
    responses={404: {"description": "Not found"}},
)


@router.post("/update-name")
async def update_jug_name(form: UpdateJugForm, user_id: str = Depends(auth_user)):
    valid_jugs = []
    with db_session:
        jug = Jug.get(smart_hydration_id=form.jugId)
        if jug is None:
            raise HTTPException(400, 'jug does not exist')

        user = User.get(id=user_id)
        juguser = user.jug_user
        valid_jugs.extend([j for j in juguser.jugs])

        if community := get_users_community(user_id):
            valid_jugs.extend([j for j in community.unassigned_jugs])
            valid_jugs.extend([j for j in juguser.jugs for juguser in community.jug_users])

        if jug not in valid_jugs:
            raise HTTPException(status_code=401, detail='Unauthorized')

        jug.name = form.name


def check_user_is_associated_with_juguser(user, juguser):
    if juguser is None:
        raise HTTPException(400, 'juguser does not exist')

    if user.jug_user.id != juguser.id:
        member = user.community_member
        community = member.community
        if community is None:
            return HTTPException(400, 'user is not part of a community')
        if community != juguser.community:
            return HTTPException(400, 'user is not part of the same community')


class LinkJugs(BaseModel):
    jugIds: List[str]
    jugUserId: int | None

@router.post("/link")
async def link_jugs(form: LinkJugs, user_id: str = Depends(auth_user)):
    time_now = int(dt.datetime.now().timestamp())
    with db_session:

        # add this one as unassigned
        if form.jugUserId is None:
            community = try_get_users_community(user_id)

            for jug_id in form.jugIds:
                jug = Jug.get(smart_hydration_id=jug_id)
                community.unassigned_jugs.add(jug)

                # unlink the jug from all others
                for juguser in community.jug_users:
                    juguser.jugs.remove(jug)
                    cw = ConnectionWindow.get(jug=jug, jug_user=juguser)
                    if cw:
                        cw.end = time_now
            commit()
            return

        user = User.get(id=user_id)
        juguser_to_link = JugUser.get(id=form.jugUserId)
        check_user_is_associated_with_juguser(user, juguser_to_link)

        community = get_users_community(user_id)

        for jug_id in form.jugIds:
            jug_to_add = Jug.get(smart_hydration_id=jug_id)

            if community:
                # remove from unassigned, and remove from any other jug users
                community.unassigned_jugs.remove(jug_to_add)
                for juguser in community.jug_users:
                    cw = ConnectionWindow.get(jug=jug_to_add, jug_user=juguser)
                    if cw:
                        cw.end = int(time_now)
                    juguser.jugs.remove(jug_to_add)

            juguser_to_link.jugs.add(jug_to_add)
            connection_window = ConnectionWindow(jug=jug_to_add, jug_user=juguser_to_link, start=time_now)
            commit()


class UnlinkJug(BaseModel):
    jugId: str
    jugUserId: int | None

@router.post('/unlink')
async def unlink_jug_from_user(form: UnlinkJug, user_id: str = Depends(auth_user)):
    time_now = int(dt.datetime.now().timestamp())
    with db_session:
        if form.jugUserId is None:
            community = try_get_users_community(user_id)
            community.unassigned_jugs.remove(Jug.get(smart_hydration_id=form.jugId))
            return

        user = User.get(id=user_id)
        juguser = JugUser.get(id=form.jugUserId)
        check_user_is_associated_with_juguser(user, juguser)

        jug = Jug.get(smart_hydration_id=form.jugId)
        if jug is None:
            raise HTTPException(400, 'jug does not exist')

        juguser.jugs.remove(jug)
        ConnectionWindow.get(jug=jug, jug_user=juguser).end = time_now
        commit()


class CheckQR(BaseModel):
    qr: str

@router.post('/qr')
async def check_qr(form: CheckQR, user_id: str = Depends(auth_user)):
    with db_session:
        jug = Jug.get(qr_hash=form.qr)
        if jug is None:
            raise HTTPException(400, 'Invalid QR code')

    async with SmartHydrationSession() as session:
        jug_data = await get_jug_latest(session, jug.smart_hydration_id)
    if not jug_data:
        raise HTTPException(400, 'Jug not found')

    jug_info = get_device_info_dict(jug, None)
    jug_info['ssid'] = jug_data['ssid']
    return jug_info
