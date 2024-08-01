from fastapi import APIRouter, Depends, HTTPException
from pony.orm.core import db_session, commit

from ..auth import auth_user
from ..models import User, OtherDrink, JugUser, Tag
from ..schemas import AddJugUserForm, JugUserUpdate, AddDrinkForm, AddTagsPatientForm
from ..services import create_jug_user_no_owner, update_jug_user_data, get_user_by_id

router = APIRouter(
    prefix="/jug-user",
    tags=["jug-user"],
    responses={404: {"description": "Not found"}},
)


@router.post("/create")
async def add_jug_user(form: AddJugUserForm, user_id: str = Depends(auth_user)):
    with db_session:
        comm = User.get(id=user_id).community_member.community
        create_jug_user_no_owner(comm, form)


# Endpoint for updating jug user data
# Currently unused, but keeping this for when we need to edit jug user data (e.g. weight) via settings
@router.post("/update")
async def update(form: JugUserUpdate, user_id: str = Depends(auth_user)):
    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=400, detail='user not found')
    update_jug_user_data(form.id, form.key, form.value)
    return {"message": "Jug user data updated successfully"}


@router.post("/add-drink-event")
async def add_drink_event(form: AddDrinkForm, user_id: str = Depends(auth_user)):
    with db_session:
        user = User.get(id=user_id)
        juguser = user.jug_user
        OtherDrink(juguser=juguser, timestamp=form.timestamp, name=form.name, capacity=form.capacity)
        commit()


@router.post("/add-tags-patient")
async def add_tags_patient(form: AddTagsPatientForm, user_id: str = Depends(auth_user)):
    with db_session:
        user = get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=400, detail='user not found')
        juguser = JugUser.get(id=form.memberID)
        tags = [Tag.get(name=name) for name in form.memberTags]
        juguser.tags = tags
        commit()
