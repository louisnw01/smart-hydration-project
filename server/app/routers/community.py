from typing import Optional
import datetime as dt
from fastapi import APIRouter, Depends, HTTPException
from pony.orm.core import commit, db_session, delete
from ..services import get_user_by_id
from ..models import Community, CommunityMember, InviteLink, User
from ..schemas import CreateCommunityForm, CreateInvitationForm
from ..auth import auth_user, generate_invite_link


router = APIRouter(
    prefix="/community",
    tags=["community"],
    responses={404: {"description": "Not found"}},
)


@router.post("/create")
async def create_community(form: CreateCommunityForm, user_id: str = Depends(auth_user)):
    with db_session:
        user = User.get(id=user_id)
        if user.community_member:
            return HTTPException(400, 'user is already a member of a community')

        community = Community(name=form.name)
        member = CommunityMember(user=user, community=community, is_owner=True)
        commit()


@router.post("/update")
async def update_community_info(form: CreateCommunityForm, user_id: str = Depends(auth_user)):
    with db_session:
        user = User.get(id=user_id)
        member = user.community_member
        if member is None:
            return HTTPException(400, 'user is not associated with a community')
        member.community.name = form.name


@router.post("/delete")
async def delete_community(user_id: str = Depends(auth_user)):
    with db_session:
        user = User.get(id=user_id)

        member = user.community_member
        if member is None:
            return HTTPException(400, 'user is not associated with a community')

        if member.is_owner is None:
            return HTTPException(400, 'user does not have permissions to delete this community')
        community = member.community
        delete(m for m in CommunityMember if m.community == community)
        community.delete()


@router.post("/invite/{code}")
async def validate_invitation(code: str, user_id: str = Depends(auth_user)):
    with db_session:
        user = User.get(id=user_id)
        link = InviteLink.get(id=code)

        if link is None or link.expire_time < dt.datetime.now().timestamp():
            link.delete()
            return HTTPException(400, 'invalid link')

        if user.community_member is not None:
            return HTTPException(400, 'user is already within a community')

        if user.jug_user:
            user.jug_user.community = link.community

        CommunityMember(user=user, is_owner=False, community=link.community)
        link.delete()

        commit()

@router.post("/generate-invite")
async def create_invitation(form: CreateInvitationForm, user_id: str = Depends(auth_user)):
    with db_session:
        user = User.get(id=user_id)
        member = user.community_member
        if member is None:
            return HTTPException(400, 'user is not a part of a community')
        if not member.is_owner:
            return HTTPException(400, 'user does not have permission')

        TIME_TO_EXPIRE = dt.timedelta(days=1)

        expire_time = (dt.datetime.now()+TIME_TO_EXPIRE).timestamp()

        link = InviteLink(
            id=generate_invite_link(),
            expire_time=int(expire_time),
            permission=form.permission,
            community=member.community
        )

        return link.id
