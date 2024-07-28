from fastapi import APIRouter, Depends, HTTPException
from pony.orm.core import db_session, select

from ..api import login_and_get_session, get_jug_latest, get_hydration_events
from ..auth import auth_user
from ..models import User, OtherDrink

router = APIRouter(
    prefix="/data",
    tags=["data"],
    responses={404: {"description": "Not found"}},
)


@router.get("/latest")
async def get_community_jug_status(user_id: str = Depends(auth_user)):
    # TODO perhaps this logic should be in auth_user, and it returns user rather than user_id

    with db_session:
        # community = user.community
        user = User.get(id=user_id)
        if not user or not user.jug_user:
            raise HTTPException(status_code=400, detail='user not found')
        jugs = user.jug_user.jugs
        devices_info = []
        session = login_and_get_session()
        for jug in jugs:
            jug_data = get_jug_latest(session, jug.smart_hydration_id)
            if jug_data is None:
                continue
            jug_data['name'] = jug.name
            jug_data['id'] = jug.smart_hydration_id
            devices_info.append(jug_data)
        return devices_info


@router.get("/historical")
async def get_historical_jug_data(timestamp: int, user_id: str = Depends(auth_user)):
    # atm only works for one jug per user
    # check if the user_id OWNS or follows the jugusers community

    with db_session:
        user = User.get(id=user_id)
        juguser = user.jug_user
        # if user.community != juguser.community:
            # raise HTTPException(status_code=400, detail='unauthorized')
        if not juguser:
            return []
        jugs = juguser.jugs

        session = login_and_get_session()

        big_list = []
        for jug in jugs:
            big_list.extend(get_hydration_events(session, jug, timestamp, False))

        other_drinks = juguser.otherdrinks

        for drink in other_drinks:
            print(drink.timestamp , " " , drink.capacity)
            big_list.append({"time": drink.timestamp, "value": drink.capacity})

        return sorted(big_list, key=lambda x: x['time'])
