import asyncio
from fastapi import APIRouter, Depends, HTTPException
from pony.orm.core import db_session, select

from ..services import get_users_community
from ..api import SmartHydrationSession, get_jug_latest, get_hydration_events
from ..auth import auth_user
from ..models import JugUser, User, OtherDrink

router = APIRouter(
    prefix="/data",
    tags=["data"],
    responses={404: {"description": "Not found"}},
)


def get_device_info_dict(jug, jug_user_id):
    return {
        'name': jug.name,
    'id': jug.smart_hydration_id,
    'jugUserId': jug_user_id,
    'capacity': jug.capacity,
    'charging': jug.is_charging,
    'battery': jug.battery,
    'temperature': jug.temp,
    'water_level': jug.water_level,
    'last_seen': jug.last_connected,
    'warnings': {
        'stale': jug.staleness,
    }
    }


@router.get("/latest")
async def device_info(user_id: str = Depends(auth_user)):
    jugs = []
    with db_session:
        user = User.get(id=user_id)

        # add all jugs that are within the users community
        # this will include the users juguser
        if community := get_users_community(user_id):
            for juguser in community.jug_users:
                jugs.extend([get_device_info_dict(jug, juguser.id) for jug in juguser.jugs])
            jugs.extend([get_device_info_dict(jug, None) for jug in community.unassigned_jugs])
       # if standard we want the users jugs
        elif user.mode == 'Standard':
            jugs.extend([get_device_info_dict(jug, user.jug_user.id) for jug in user.jug_user.jugs])
    return jugs

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
            raise HTTPException(status_code=400, detail='jug user not found')

        other_drinks = juguser.otherdrinks

        for drink in other_drinks:
            big_list.append({"time": drink.timestamp, "value": drink.capacity})

        jugs = [{
            'start': window.start,
            'end': window.end,
            'smart_hydration_id': window.jug.smart_hydration_id,
            'name': window.jug.name,
        } for window in juguser.connection_windows]

    async with SmartHydrationSession() as session:
        tasks = [get_hydration_events(session, jug['smart_hydration_id'], jug['name'], jug['start'], jug['end']) for jug in jugs]
        results = await asyncio.gather(*tasks)
        big_list.extend([event for sublist in results for event in sublist])

        return sorted(big_list, key=lambda x: x['time'])
