from fastapi import APIRouter
from fastapi.websockets import WebSocket
from enum import Enum
from pony.orm.core import db_session

from ..auth import decode_auth_token
from ..services import get_users_community, user_exists
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
    if user_id is None:
        return []

    with db_session:
        user = User.get(id=user_id)
        if not user:
            return []
        valid_jug_ids = []
        if user.jug_user:
            valid_jug_ids.extend([jug.smart_hydration_id for jug in user.jug_user.jugs])

        if community := get_users_community(user_id):
            for ju in community.jug_users:
                valid_jug_ids.extend([jug.smart_hydration_id for jug in ju.jugs])
            valid_jug_ids.extend([jug.smart_hydration_id for jug in community.unassigned_jugs])

    return valid_jug_ids


def subscribe_to_all_community_info(client_key):
    # client key is auth token
    # get all jugs associated with auth token
    user_id = decode_auth_token(client_key)
    if user_id is None:
        return []

    with db_session:
        user = User.get(id=user_id)
        if not user:
            return []
        community = get_users_community(user_id);
        if not community:
            return []
        valid_juguser_ids = [juguser.id for juguser in community.jug_users]

    return valid_juguser_ids


def auth_key(key):
    user_id = decode_auth_token(key)
    if user_id is None:
        return False
    with db_session:
        if User[user_id] is None:
            return False
    return True


tunnel = TunnelServer(auth_key)
tunnel.create_event('jug-latest', private=True)
tunnel.create_event('all-jugs-latest',
    deriver_function=subscribe_to_all_jug_latest, derived_event='jug-latest')

tunnel.create_event('patient-info', private=True)
tunnel.create_event('all-community-info',
    deriver_function=subscribe_to_all_community_info, derived_event='patient-info')

@router.websocket('/')
async def websocket_endpoint(ws: WebSocket):
    await tunnel.handle_connect(ws)
