import asyncio
from os import getenv
import hmac
import hashlib
import datetime as dt
from asyncpusher.channel import Channel
from asyncpusher.pusher import Pusher
from pony.orm.core import db_session, select

from .api import SmartHydrationSession, get_hydration_events, get_jug_latest
from .routers.websocket_tunnel import tunnel
from .models import Jug, OtherDrink, User


async def fire_jug_info(sys_id):
    async with SmartHydrationSession() as session:
        jug_data = await get_jug_latest(session, sys_id);

    if jug_data is None:
        return

    await tunnel.fire(f'jug-latest', jug_data['id'], jug_data)


async def fire_last_drank(sys_id):
    with db_session:
        jug = Jug.get(system_id=sys_id)
        if jug is None:
            return

    async with SmartHydrationSession() as session:
        jug_data_today = await get_hydration_events(session, jug.smart_hydration_id, jug.name, 0, last_day=True)
        if len(jug_data_today) == 0:
            return

    with db_session:
        latest = jug_data_today[-1]
        jug = Jug.get(system_id=sys_id)
        for juguser in jug.owners:
            if not juguser.last_drank or latest['time'] > juguser.last_drank:
                juguser.last_drank = int(latest['time'])
            # await tunnel.fire('last_drank', juguser.id, latest['time'])


async def fire_drank_today(sys_id):
    with db_session:
        jug = Jug.get(system_id=sys_id)
        if jug is None:
            return

        async with SmartHydrationSession() as session:

            for juguser in jug.owners:
                tasks = []
                for jug in juguser.jugs:
                    tasks.append(get_hydration_events(session, jug.smart_hydration_id, jug.name, 0, True))

                individual_jug_events = await asyncio.gather(*tasks)

                events = []
                for jug_events in individual_jug_events:
                    events.extend(jug_events)

                today_timestamp = dt.datetime.combine(dt.date.today(), dt.time()).timestamp()
                drinks_today = OtherDrink.select(lambda drink: drink.juguser == juguser and drink.timestamp > today_timestamp)

                events.extend([{"time": d.timestamp, "value": d.capacity, "name": "OTHERDRINK"} for d in drinks_today])
                juguser.drank_today = sum(map(lambda e: e['value'], events), 0)


async def on_telemetry_change(data):
    print(f'[{dt.datetime.now()}] telemetry changed', data)
    asyncio.gather(
        fire_jug_info(data['device']),
    )

async def on_waterlevel_change(data):
    print(f'[{dt.datetime.now()}] waterlevel changed', data)
    await fire_jug_info(data)
    asyncio.gather(
        fire_jug_info(data['device']),
        fire_last_drank(data['device']),
        fire_drank_today(data['device'])
    )


async def auth_channel(values):
    message = f"{values['socket_id']}:{values['channel_name']}"
    secret_key_bytes = getenv("PUSHER_APP_SECRET").encode('utf-8')
    message_bytes = message.encode('utf-8')
    hmac_sha256 = hmac.new(secret_key_bytes, message_bytes, hashlib.sha256)
    return {"auth": f'{getenv("PUSHER_APP_KEY")}:{hmac_sha256.hexdigest()}'}


async def pusher_init():
    pusher = Pusher(getenv("PUSHER_APP_KEY"), 'eu', channel_authenticator=auth_channel)
    await pusher.connect()

    for org in (5, 2):
        channel = await pusher.subscribe(f"private-organisation.{org}.devices")
        channel.bind('device-telemetry-updated', on_telemetry_change)
        channel.bind('device-waterlevel-updated', on_waterlevel_change)
