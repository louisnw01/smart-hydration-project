from fastapi import APIRouter, Depends, HTTPException
from pony.orm.core import db_session, commit
from pydantic.main import BaseModel

from ..auth import auth_user
from ..models import User, OtherDrink, JugUser, Tag
from ..schemas import AddJugUserForm, JugUserUpdate, AddTagsPatientForm
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
        juguser = JugUser(name=form.name, community=community, dob=form.dob)
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


class AddDrinkForm(BaseModel):
    juguser_id: int
    timestamp: int
    name: str
    capacity: int
@router.post("/add-drink")
async def add_drink(form: AddDrinkForm, user_id: str = Depends(auth_user)):
    with db_session:
        juguser = JugUser.get(id=form.juguser_id)
        if juguser is None:
            raise HTTPException(400, 'jug user not found')

        if User[user_id].jug_user != juguser:
            community = try_get_users_community(user_id)

            if juguser.community != community:
                raise HTTPException(400, 'jug user is not associated with the same community as the user')

            # dont think this should be here
            # if member.is_owner is None:
            #     raise HTTPException(400, 'user does not have permissions to add drinks for this community')

        OtherDrink(juguser=juguser, timestamp=form.timestamp, name=form.name, capacity=form.capacity)
        if juguser.drank_today == None:
            juguser.drank_today = 0
        juguser.drank_today += form.capacity
        juguser.last_drank = form.timestamp
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
