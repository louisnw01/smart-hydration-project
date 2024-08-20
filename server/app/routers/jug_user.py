from fastapi import APIRouter, Depends, HTTPException
from pony.orm.core import db_session, commit

from ..auth import auth_user
from ..models import User, OtherDrink, JugUser, Tag
from ..schemas import AddJugUserForm, JugUserUpdate, AddDrinkForm, AddTagsPatientForm
from ..services import try_get_users_community

router = APIRouter(
    prefix="/jug-user",
    tags=["jug-user"],
    responses={404: {"description": "Not found"}},
)


@router.post("/create")
async def add_jug_user(form: AddJugUserForm, user_id: str = Depends(auth_user)):
    with db_session:
        community = try_get_users_community(user_id)
        juguser = JugUser(name=form.name, community=community, dob=form.dob, room=form.room)
        commit()


# Endpoint for updating jug user data
# Currently unused, but keeping this for when we need to edit jug user data (e.g. weight) via settings
@router.post("/update")
async def update(form: JugUserUpdate, user_id: str = Depends(auth_user)):
    with db_session:
        user = User[user_id]
        if user is None:
            raise HTTPException(status_code=400, detail='user not found')
        if user.jug_user is None:
            raise HTTPException(status_code=400, detail='jug user not found')
        setattr(user.jug_user, form.key, form.value)
    return {"message": "Jug user data updated successfully"}


@router.post("/add-drink-event")
async def add_drink_event(form: AddDrinkForm, user_id: str = Depends(auth_user)):
    with db_session:
        user = User[user_id]
        juguser = user.jug_user
        OtherDrink(juguser=juguser, timestamp=form.timestamp, name=form.name, capacity=form.capacity)
        commit()


@router.post("/add-tags-patient")
async def add_tags_patient(form: AddTagsPatientForm, user_id: str = Depends(auth_user)):
    with db_session:
        user = User[user_id]
        if not user:
            raise HTTPException(status_code=400, detail='user not found')
        juguser = JugUser.get(id=form.memberID)

        juguser.tags = [Tag[id] for id in form.memberTags]
        commit()
