import asyncio

from dotenv import load_dotenv
from fastapi import FastAPI, Depends
from pony.orm.core import db_session, commit

from .api import SmartHydrationSession, fetch_all_registered_jugs, get_all_jug_ids
from .auth import auth_user
from .models import connect_to_database, Jug
from .notifications import send_drink_reminders
from .routers import community, jug_user, user, data, jug, websocket_tunnel
from .pushertest import pusher_init


load_dotenv()

connect_to_database()

app = FastAPI()

app.include_router(jug_user.router)
app.include_router(user.router)
app.include_router(data.router)
app.include_router(jug.router)
app.include_router(community.router)
app.include_router(websocket_tunnel.router)


@app.on_event('startup')
async def init():
    asyncio.create_task(pusher_init())
    asyncio.create_task(send_drink_reminders())

    jugs = await fetch_all_registered_jugs()

    with db_session:
        for jug in jugs:
            # if it already exists in the table, do nothing
            if Jug.get(smart_hydration_id=jug['sh_id']) is not None:
                continue
            Jug(smart_hydration_id=jug['sh_id'], system_id=jug['sys_id'], name=f"Jug #{jug['sh_id'][-3:]}")
            print(f"added new jug {jug['sh_id']} to database")
        commit()


@app.get("/")
async def root():
    return {"message": "Hello World"}


# Temporary for MVP
@app.get("/get-all-jugs")
async def get_all_jugs(user_id: str = Depends(auth_user)):
    async with SmartHydrationSession() as session:
        return await get_all_jug_ids(user_id, session)
