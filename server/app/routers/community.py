from typing import Optional
import datetime as dt
from fastapi import APIRouter, Depends, HTTPException
import pprint
from pony.orm.core import commit, db_session, delete
from ..api import get_hydration_events, SmartHydrationSession, get_jug_latest
from ..routers import jug_user
from ..services import get_user_by_id, try_get_users_community, try_get_users_community
from ..models import Community, CommunityMember, InviteLink, Jug, User, JugUser, Tag, OtherDrink
from ..schemas import AddCommunityDrinkForm, CreateCommunityForm, CreateInvitationForm, AddJugsToMemberForm, DeleteCommunityMemberForm, VerifyEmailForm, CreateTagForm, UpdateTagForm, DeleteTagForm
from ..auth import auth_user, generate_invite_link
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

        return {"name": community.name, "isOwner": member.is_owner}


@router.get("/name-from-link")
async def name_from_link(code: str, user_id: str = Depends(auth_user)):
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
        user = User.get(id = user_id)

        # get targets for users
        patient_info = []
        for juguser in community.jug_users:
            if juguser.user is not user:
                patient_info.append({
                    "id": juguser.id,
                    "name": juguser.name,
                    "jugs": [{"name": jug.name, "id": jug.smart_hydration_id} for jug in juguser.jugs],
                    "lastDrank": juguser.last_drank,
                    "drankToday": juguser.drank_today,
                    "dailyTarget": juguser.target or 2200,
                    "tags": [{"id": tag.id, "name": tag.name} for tag in juguser.tags]
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
                "isOwner": member.is_owner,
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

        if member.is_owner is False:
            raise HTTPException(400, 'user does not have permissions to remove members')
        community = member.community

        member_to_delete = CommunityMember.get(id=form.id, community=community)

        if member_to_delete is None:
            raise HTTPException(400, 'member does not exist in this community')
        if member_to_delete.is_owner:
            raise HTTPException(400, "member is the owner of this community")

        member_to_delete.delete()


@router.post("/leave")
async def leave_community(user_id: str = Depends(auth_user)):
    with db_session:
        user = User.get(id=user_id)

        member = user.community_member
        if member is None:
            raise HTTPException(400, 'user is not associated with a community')

        if member.is_owner is True:
            raise HTTPException(404, 'You cannot leave a community which you own')

        member.delete()


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
        member = user.community_member
        user_community = member.community
        juguser = JugUser.get(id = form.communityMember)
        juser_community = juguser.community
        if user_community != juser_community or user_community is None or juser_community is None:
            return HTTPException(400, 'user is not part of the same community')

        for jug in form.jugIds:
            jug_to_add = Jug.get(smart_hydration_id=jug)
            juguser.jugs.add(jug_to_add)
        commit()
        return {"message": "Jugs successfully linked to community member"}



@router.post("/create-tag")
async def create_tag(form: CreateTagForm, user_id: str = Depends(auth_user)):
    with db_session:
        user = User.get(id=user_id)
        if not user:
            raise HTTPException(status_code=400, detail="User not found")
        member = user.community_member
        if member is None:
            raise HTTPException(status_code=400, detail="User is not associated with a community")
        community = member.community
        if not community:
            raise HTTPException(status_code=400, detail="Community not found")
        tag = Tag(name=form.tagName, community=community)
        commit()


@router.post("/update-tag")
async def update_tag(form: UpdateTagForm, user_id: str = Depends(auth_user)):
    with db_session:
        user = User.get(id=user_id)
        if not user:
            raise HTTPException(status_code=400, detail="User not found")
        member = user.community_member
        if member is None:
            raise HTTPException(status_code=400, detail="User is not associated with a community")
        tag = Tag.get(name=form.currentName, community=member.community)
        if not tag:
            raise HTTPException(status_code=400, detail="Tag not found or does not belong to the user's community")
        tag.name = form.newName
        commit()


@router.post("/delete-tag")
async def delete_tag(form: DeleteTagForm, user_id: str = Depends(auth_user)):
    with db_session:
        user = User.get(id=user_id)
        if not user:
            raise HTTPException(status_code=400, detail="User not found")
        member = user.community_member
        if member is None:
            raise HTTPException(status_code=400, detail="User is not associated with a community")
        tag = Tag.get(name=form.tagName, community=member.community)
        if not tag:
            raise HTTPException(status_code=400, detail="Tag not found or does not belong to the user's community")
        tag.delete()
        commit()


@router.get("/get-tags")
async def community_tags(user_id: str = Depends(auth_user)):
    print("get tags endpoint hit")
    with db_session:
        community = try_get_users_community(user_id)
        if community is None:
            raise HTTPException(400, "User is not associated with a community")
        data = []
        for tag in community.tags:
            data.append({
                "id": tag.id,
                "name": tag.name,
            })

        return data

@router.get("/get-community-jug-list")
async def get_community_jug_list(user_id: str = Depends(auth_user)):
    with db_session:
        user = User.get(id=user_id)
        juser = JugUser.get(user=user)
        community = juser.community
        jugusers = list(JugUser.select(community=community))
        available_jugs = []
        for juguser in jugusers:
            available_jugs.extend(juguser.jugs)
        unique_jugs = set()
        devices_info = []
        async with SmartHydrationSession() as session:
            for jug in available_jugs:
                if jug.smart_hydration_id in unique_jugs:
                    continue
                unique_jugs.add(jug.smart_hydration_id)
                jug_data = await get_jug_latest(session, jug.smart_hydration_id)
                if jug_data is None:
                    continue
                jug_data['name'] = jug.name
                jug_data['id'] = jug.smart_hydration_id
                devices_info.append(jug_data)
            return devices_info


@router.post("/add-community-drink-event")
async def add_community_drink_event(form: AddCommunityDrinkForm, user_id: str = Depends(auth_user)):
    with db_session:
        user = User.get(id=user_id)

        member = user.community_member
        if member is None:
            raise HTTPException(400, 'user is not associated with a community')

        if member.is_owner is None:
            raise HTTPException(400, 'user does not have permissions to add drinks for this community')
        juguser = JugUser.get(id=form.juser_id)
        OtherDrink(juguser=juguser, timestamp=form.timestamp, name=form.name, capacity=form.capacity)
        if juguser.drank_today == None:
            juguser.drank_today = 0
        juguser.drank_today += form.capacity
        juguser.last_drank = form.timestamp
        commit()
