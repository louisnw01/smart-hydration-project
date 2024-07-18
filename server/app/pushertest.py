from os import getenv
import hmac
import hashlib
import datetime as dt
from asyncpusher.channel import Channel
from asyncpusher.pusher import Pusher
from pony.orm.core import db_session

from .api import get_jug_latest, login_and_get_session
from .routers.websocket_tunnel import tunnel
from .models import Jug, User


async def fire_jug_info(data):
    system_id = data['device']
    jug_data = get_jug_latest(login_and_get_session(), system_id);

    if jug_data is None:
        return

    await tunnel.fire(f'jug-latest', jug_data['id'], jug_data)


async def on_telemetry_change(data):
    print(f'[{dt.datetime.now()}] telemetry changed', data)
    await fire_jug_info(data)

async def on_waterlevel_change(data):
    print(f'[{dt.datetime.now()}] waterlevel changed', data)
    await fire_jug_info(data)



async def auth_channel(values):
    message = f"{values['socket_id']}:{values['channel_name']}"
    secret_key_bytes = getenv("PUSHER_APP_SECRET").encode('utf-8')
    message_bytes = message.encode('utf-8')
    hmac_sha256 = hmac.new(secret_key_bytes, message_bytes, hashlib.sha256)
    return {"auth": f'{getenv("PUSHER_APP_KEY")}:{hmac_sha256.hexdigest()}'}


async def pusher_init():
    pusher = Pusher(getenv("PUSHER_APP_KEY"), 'eu', channel_authenticator=auth_channel)
    await pusher.connect()

    channel = await pusher.subscribe("private-organisation.5.devices")
    channel.bind('device-telemetry-updated', on_telemetry_change)
    channel.bind('device-waterlevel-updated', on_waterlevel_change)
