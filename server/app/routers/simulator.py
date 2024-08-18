from fastapi import APIRouter, Depends, HTTPException
from pony.orm.core import db_session
from pydantic import BaseModel
import datetime as dt

from ..auth import auth_user
from ..models import User, Jug
from .data import get_device_info_dict
from .websocket_tunnel import tunnel

simulated_jug_id = 'jug999999'


router = APIRouter(
    prefix="/simulator",
    tags=["jug"],
    responses={404: {"description": "Not found"}},
)


@router.get("/latest")
async def latest():
    with db_session:
        jug = Jug.get(smart_hydration_id=simulated_jug_id)
        return jug.water_level;


class UpdateLevel(BaseModel):
    level: int

@router.post('/update-level')
async def update_level(form: UpdateLevel):
    await tunnel.fire(f'jug-latest', simulated_jug_id, {
        'id': simulated_jug_id,
        'capacity': 1100,
        'charging': False,
        'battery': 0.55,
        'temperature': 23,
        'water_level': form.level,
        'last_seen': dt.datetime.now().timestamp(),
        'last_refill': dt.datetime.now().timestamp(),
    })

    with db_session:
        jug = Jug.get(smart_hydration_id=simulated_jug_id)
        jug.water_level = form.level
