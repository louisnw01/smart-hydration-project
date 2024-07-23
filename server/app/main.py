from dotenv import load_dotenv
from fastapi import FastAPI, Depends

from .api import login_and_get_session, get_all_jug_ids
from .auth import auth_user
from .models import connect_to_database
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
    await pusher_init()

@app.get("/")
async def root():
    return {"message": "Hello World"}


# Temporary for MVP
@app.get("/get-all-jugs")
async def get_all_jugs(user_id: str = Depends(auth_user)):
    session = login_and_get_session()
    return get_all_jug_ids(user_id, session)
