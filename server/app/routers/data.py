import asyncio
from fastapi import APIRouter, Depends, HTTPException
from pony.orm.core import db_session, select
from ..api import SmartHydrationSession, get_jug_latest, get_hydration_events
from ..auth import auth_user
from ..models import JugUser, User, OtherDrink

router = APIRouter(
    prefix="/data",
    tags=["data"],
    responses={404: {"description": "Not found"}},
)


@router.get("/latest")
async def get_community_jug_status(jug_user_id: int, user_id: str = Depends(auth_user)):
    # TODO perhaps this logic should be in auth_user, and it returns user rather than user_id

    with db_session:
        # community = user.community
        user = User.get(id=user_id)
        juguser = JugUser.get(id=jug_user_id)
        if not user or not juguser:
            raise HTTPException(status_code=400, detail='user not found')
        jugs = [jug.to_dict() for jug in juguser.jugs]
    devices_info = []
    async with SmartHydrationSession() as session:
        for jug in jugs:
            jug_data = await get_jug_latest(session, jug['smart_hydration_id'])
            if jug_data is None:
                continue
            jug_data['name'] = jug['name']
            jug_data['id'] = jug['smart_hydration_id']
            devices_info.append(jug_data)
        print(devices_info)
        return devices_info


@router.get("/historical")
async def get_historical_jug_data(jug_user_id: int, timestamp: int, user_id: str = Depends(auth_user)):
    # atm only works for one jug per user
    # check if the user_id OWNS or follows the jugusers community

    big_list = []

    with db_session:
        user = User.get(id=user_id)
        juguser = JugUser.get(id=jug_user_id)
        # if user.community != juguser.community:
            # raise HTTPException(status_code=400, detail='unauthorized')
        if not juguser:
            return []

        other_drinks = juguser.otherdrinks

        for drink in other_drinks:
            big_list.append({"time": drink.timestamp, "value": drink.capacity})

        jugs = [jug.to_dict() for jug in juguser.jugs]

    async with SmartHydrationSession() as session:
        tasks = [get_hydration_events(session, jug['smart_hydration_id'], jug['name'], timestamp) for jug in jugs]
        results = await asyncio.gather(*tasks)
        big_list.extend([event for sublist in results for event in sublist])

        print(big_list)

        return sorted(big_list, key=lambda x: x['time'])
