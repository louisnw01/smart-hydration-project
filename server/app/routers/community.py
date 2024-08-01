from typing import Optional
import datetime as dt
from fastapi import APIRouter, Depends, HTTPException
import pprint
from pony.orm.core import commit, db_session, delete
from ..api import get_hydration_events
from ..routers import jug_user
from ..services import get_user_by_id, try_get_users_community, try_get_users_community
from ..models import Community, CommunityMember, InviteLink, Jug, User, JugUser
from ..schemas import CreateCommunityForm, CreateInvitationForm, AddJugsToMemberForm, DeleteCommunityMemberForm, VerifyEmailForm
from ..auth import auth_user, generate_invite_link
import pprint
from starlette.responses import RedirectResponse

router = APIRouter(
    prefix="/community",
    tags=["community"],
    responses={404: {"description": "Not found"}},
)


@router.get("/info")
async def community_info(user_id: str = Depends(auth_user)):
    with db_session:
        user = User.get(id=user_id)
        member = user.community_member

        if not member:
            raise HTTPException(400, 'user is not part of a community')

        community = member.community

        return {"name": community.name, "is_owner": member.is_owner}


@router.get("/name-from-link")
async def community_info(code: str, user_id: str = Depends(auth_user)):
    with db_session:
        link = InviteLink.get(id=code)

        if link is None:
            raise HTTPException(400, 'This link is invalid. Please try another link')

        if link.expire_time < dt.datetime.now().timestamp():
            link.delete()
            raise HTTPException(403, 'This link has expired. Please get a new one')

        community_name = link.community.name

        return community_name


@router.get("/patient-info")
async def patient_info(user_id: str = Depends(auth_user)):
    with db_session:
        community = try_get_users_community(user_id)

        # get targets for users
        patient_info = []
        for juguser in community.jug_users:
            patient_info.append({
                "id": juguser.id,
                "name": juguser.name,
                "jugs": [{"name": jug.name, "id": jug.smart_hydration_id} for jug in juguser.jugs],
                "target": juguser.target or 2200,
                "drank_today": juguser.drank_today,
            })

        return patient_info


@router.get("/users")
async def community_users(user_id: str = Depends(auth_user)):
    with db_session:
        community = try_get_users_community(user_id)
        data = []
        for member in community.followers:
            data.append({
                "name": member.user.name,
                "owner": member.is_owner,
                "id": member.id,
            })

        return data


@router.post("/create")
async def create_community(form: CreateCommunityForm, user_id: str = Depends(auth_user)):
    with db_session:
        user = User.get(id=user_id)
        if user.community_member is not None:
            raise HTTPException(400, 'user is already a member of a community')
        community = Community(name=form.name)
        member = CommunityMember(user=user, community=community, is_owner=True)
        commit()


@router.post("/update")
async def update_community_info(form: CreateCommunityForm, user_id: str = Depends(auth_user)):
    with db_session:
        user = User.get(id=user_id)
        member = user.community_member
        if member is None:
            raise HTTPException(400, 'user is not associated with a community')
        member.community.name = form.name


@router.post("/delete")
async def delete_community(user_id: str = Depends(auth_user)):
    with db_session:
        user = User.get(id=user_id)

        member = user.community_member
        if member is None:
            raise HTTPException(400, 'user is not associated with a community')

        if member.is_owner is None:
            raise HTTPException(400, 'user does not have permissions to delete this community')
        community = member.community
        delete(m for m in CommunityMember if m.community == community)
        community.delete()


@router.post("/delete-member")
async def delete_community_member(form: DeleteCommunityMemberForm, user_id: str = Depends(auth_user)):
    with db_session:
        user = User.get(id=user_id)

        member = user.community_member
        if member is None:
            raise HTTPException(400, 'user is not associated with a community')

        if member.is_owner is None:
            raise HTTPException(400, 'user does not have permissions to remove members')
        community = member.community

        member_to_delete = CommunityMember.get(id=form.id, community=community)

        if member_to_delete is None:
            raise HTTPException(400, 'member does not exist in this community')
        if member_to_delete.is_owner:
            raise HTTPException(400, "member is the owner of this community")

        member_to_delete.delete()


@router.get("/redirect_invite/{code}")
async def redirect_verify(code: str):
    return RedirectResponse("smarthydration://(modals)/confirm-join-community-modal?code=" + code)


@router.post("/join")
async def join_community(form: VerifyEmailForm, user_id: str = Depends(auth_user)):
    with db_session:
        user = User.get(id=user_id)
        link = InviteLink.get(id=form.code)

        if link is None:
            raise HTTPException(400, 'This link is invalid. Please try another link')

        if link.expire_time < dt.datetime.now().timestamp():
            link.delete()
            raise HTTPException(403, 'This link has expired. Please get a new one')

        if user.community_member is not None:
            raise HTTPException(400, "You're already in a community")

        if user.jug_user:
            user.jug_user.community = link.community

        CommunityMember(user=user, is_owner=False, community=link.community)
        link.delete()

        commit()


@router.get("/generate-invite")
async def create_invitation(user_id: str = Depends(auth_user)):
    with db_session:
        user = User.get(id=user_id)
        member = user.community_member
        if member is None:
            raise HTTPException(400, 'user is not a part of a community')
        if not member.is_owner:
            raise HTTPException(400, 'user does not have permission')

        for link in member.community.invite_links:
            link.delete()

        TIME_TO_EXPIRE = dt.timedelta(days=1)

        expire_time = (dt.datetime.now() + TIME_TO_EXPIRE).timestamp()

        link = InviteLink(
            id=generate_invite_link(),
            expire_time=int(expire_time),
            community=member.community
        )

        return link.id

@router.post("/link-jug-to-member")
async def link_jugs_to_community_member(form: AddJugsToMemberForm, user_id: str = Depends(auth_user)):
    pprint.pprint(form)
    with db_session:
        user = User.get(id=user_id)
        user_juser = JugUser.get(user = user)
        user_community = user_juser.community
        juguser = JugUser.get(id = form.communityMember)
        juser_community = juguser.community
        if user_community != juser_community:
            return HTTPException(400, 'user is not part of the same community')

        for jug in form.jugIds:
            jug_to_add = Jug.get(smart_hydration_id = jug)
            juguser.jugs.add(jug_to_add)

        return {"message": "Jugs successfully linked to community member"}
