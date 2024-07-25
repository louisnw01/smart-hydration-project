from fastapi import APIRouter
from fastapi.websockets import WebSocket
from enum import Enum
from pony.orm.core import db_session

from ..auth import decode_auth_token
from ..services import get_user_by_id
from ..models import User
from ..tunnel import MessageType, TunnelServer

router = APIRouter(
    prefix="/tunnel",
    tags=["tunnel"],
    responses={404: {"description": "Not found"}},
)

def subscribe_to_all_jug_latest(client_key):
    # client key is auth token
    # get all jugs associated with auth token
    user_id = decode_auth_token(client_key)
    if user_id is None or not get_user_by_id(user_id):
        return []

    valid_jug_ids = []
    with db_session:
        user = User.get(id=user_id)
        if user.jug_user:
            valid_jug_ids.extend([jug.smart_hydration_id for jug in user.jug_user.jugs])
        if user.community_member:
            community = user.community_member.community
            jug_users = community.jug_users
            for ju in jug_users:
                valid_jug_ids.extend([jug.smart_hydration_id for jug in ju.jugs])

    return valid_jug_ids


def auth_key(key):
    user_id = decode_auth_token(key)
    return user_id is not None and get_user_by_id(user_id)


tunnel = TunnelServer(auth_key)
tunnel.create_event('jug-latest', private=True)
tunnel.create_event('all-jugs-latest', deriver_function=subscribe_to_all_jug_latest)


@router.websocket('/')
async def websocket_endpoint(ws: WebSocket):
    await tunnel.handle_connect(ws)
