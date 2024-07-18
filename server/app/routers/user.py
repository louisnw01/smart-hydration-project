from fastapi import APIRouter, Depends, HTTPException
from pony.orm.core import db_session

from ..auth import auth_user, generate_auth_token, get_hash, generate_invite_link
from ..models import User, VerifyEmail
from ..schemas import LinkJugsForm, JugLink, UserRegister, UserLogin
from ..services import link_jugs_to_user_s, unlink_jug_from_user_s, delete_user, user_exists, create_user, \
    create_jug_user, update_jug_user_data, get_user_hash, get_user_by_email, get_user_name
import datetime as dt
router = APIRouter(
    prefix="/user",
    tags=["user"],
    responses={404: {"description": "Not found"}},
)


@router.post("/link-jug")
async def link_jug_to_user(body: LinkJugsForm, user_id: str = Depends(auth_user)):
    link_jugs_to_user_s(user_id, body.jugIds)


@router.post('/unlink-jug')
async def unlink_jug_from_user(body: JugLink, user_id: str = Depends(auth_user)):
    unlink_jug_from_user_s(user_id, body.jugId)


@router.post('/delete')
async def delete_user_s(user_id: str = Depends(auth_user)):
    delete_user(user_id)
    token = generate_auth_token(user_id)
    return {"access_token": token, "token_type": "bearer"}


@router.post("/register")
async def register(form: UserRegister):
    if user_exists(form.email):
        raise HTTPException(status_code=400, detail="email already registered")
    hashed_password = get_hash(form.password)
    with db_session:
        user = create_user(form.name, form.email, hashed_password)
        if not user.jug_user:
            create_jug_user(user)
            jug_user_id = user.jug_user.id
            if form.dob:
                update_jug_user_data(jug_user_id, "dob", form.dob)
    token = generate_auth_token(user.id)
    return {"access_token": token, "token_type": "bearer"}


@router.post("/login")
async def login(form: UserLogin):
    if not user_exists(form.email):
        raise HTTPException(status_code=400, detail="incorrect email or password")

    hashed_password = get_user_hash(form.email)
    given_hash = get_hash(form.password)

    if hashed_password != given_hash:
        raise HTTPException(status_code=400, detail="incorrect email or password")

    user = get_user_by_email(form.email)
    token = generate_auth_token(user.id)
    return {"access_token": token, "token_type": "bearer"}


@router.post("/check-token")
async def check_token(user_id: str = Depends(auth_user)):
    return {"status": "success"}


@router.get("/user-name")
async def get_user(user_id: str = Depends(auth_user)):
    return get_user_name(user_id)


@router.get("/exists")
async def email_exists(email: str):
    return user_exists(email)


@router.post("/send-verification-link")
async def send_verification_link(user_id: str = Depends(auth_user)):
    link = generate_invite_link(user_id)


async def generate_verification_link(user_id):
    with db_session:
        user = User.get(id=user_id)

        time_to_expire = dt.timedelta(days=1)

        expire_time = (dt.datetime.now()+time_to_expire).timestamp()

        link = VerifyEmail(
            id=generate_invite_link(),
            expire_time=int(expire_time),
            user=user
        )

        return link.id
