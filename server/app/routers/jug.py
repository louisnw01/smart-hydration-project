from typing import List
from fastapi import APIRouter, Depends, HTTPException
from pony.orm.core import db_session, select
from pydantic import BaseModel

from ..api import get_hydration_events
from ..auth import auth_user
from ..models import JugUser, User, Jug
from ..schemas import UpdateJugForm
from ..services import get_users_community, try_get_users_community, user_exists, update_jug_name_s, get_users_jugs

router = APIRouter(
    prefix="/jug",
    tags=["jug"],
    responses={404: {"description": "Not found"}},
)


@router.post("/update-name")
async def update_jug_name(form: UpdateJugForm, user_id: str = Depends(auth_user)):
    with db_session:
        jugs = get_users_jugs(user_id)

        jug = Jug.get(smart_hydration_id=form.jugId)

        if jug not in jugs:
            raise HTTPException(status_code=401, detail='Unauthorized')

        update_jug_name_s(form.jugId, form.name)


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
    with db_session:

        # add this one as unassigned
        if form.jugUserId is None:
            community = try_get_users_community(user_id)
            for jug_id in form.jugIds:
                community.unassigned_jugs.add(Jug.get(smart_hydration_id=jug_id))
            return

        user = User.get(id=user_id)
        juguser = JugUser.get(id=form.jugUserId)
        check_user_is_associated_with_juguser(user, juguser)

        community = get_users_community(user_id)

        for jug in form.jugIds:
            jug_to_add = Jug.get(smart_hydration_id=jug)
            juguser.jugs.add(jug_to_add)

            print('linked', jug, 'to', juguser.id)

            if community:
                community.unassigned_jugs.remove(jug_to_add)


class UnlinkJug(BaseModel):
    jugId: str
    jugUserId: int | None

@router.post('/unlink')
async def unlink_jug_from_user(form: UnlinkJug, user_id: str = Depends(auth_user)):
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
