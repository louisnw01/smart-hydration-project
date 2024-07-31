from fastapi import APIRouter, Depends, HTTPException
from pony.orm.core import db_session, select

from ..api import get_jug_latest, get_hydration_events
from ..auth import auth_user
from ..models import User, Jug
from ..schemas import UpdateJugForm
from ..services import user_exists, update_jug_name_s, get_users_jugs

router = APIRouter(
    prefix="/jug",
    tags=["jug"],
    responses={404: {"description": "Not found"}},
)


@router.post("/update-name")
async def update_jug_name(form: UpdateJugForm, user_id: str = Depends(auth_user)):
    with db_session:
        jugs = get_users_jugs(user_id)

        jug = Jug.get(smart_hydration_id=form.jugId)

        if jug not in jugs:
            raise HTTPException(status_code=401, detail='Unauthorized')

        update_jug_name_s(form.jugId, form.name)
