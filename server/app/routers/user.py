from fastapi import APIRouter, Depends, HTTPException
from pony.orm.core import db_session, commit
from starlette.responses import RedirectResponse

from ..auth import auth_user, generate_auth_token, get_hash, generate_invite_link, auth_user_no_email_verified
from ..mail import send_email_with_ses
from ..models import User, VerifyEmail, Jug, JugUser
from ..schemas import LinkJugsForm, JugLink, UserRegister, UserLogin, VerifyEmailForm, TargetUpdate
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

  
@router.post("/update-user-target")
async def update_user_hydration_target(form: TargetUpdate, user_id: str = Depends(auth_user)):
    with db_session:
        user = JugUser.get(user=user_id)
        if user:
            user.target = form.newValue
            return {"status": "success"}
        else:
            raise HTTPException(status_code=404, detail="User not found")

            
@router.get("/get-user-target")
async def get_user_target(user_id: str = Depends(auth_user)):
    with db_session:
        user = JugUser.get(user=user_id)
        if user:
            target = user.target
            return {"target": target}
        else:
            raise HTTPException(status_code=404, detail="User not found")


@router.post("/send-verification-email")
async def send_verification_link(user_id: str = Depends(auth_user_no_email_verified)):
    link = generate_verification_link(user_id)
    with db_session:
        user = User.get(id=user_id)
        email = user.email
        name = user.name
        send_email_with_ses(name, email, "verify", link)


@router.post("/verify")
async def verify_email(form: VerifyEmailForm, user_id: str = Depends(auth_user_no_email_verified)):
    with db_session:
        email_table = User.get(id=user_id).email_link
        if email_table.id != form.code:
            raise HTTPException(status_code=404, detail="This link is not valid for the current user")
        elif email_table.expire_time < dt.datetime.now().timestamp():
            raise HTTPException(status_code=403, detail="Your link has expired. Press resend email for a new link.")
    # delete validated link
        User.get(id=user_id).email_verified = True
        email_table.delete()
        commit()


@router.get("/redirect_verify/{code}")
async def redirect_verify(code: str):
    return RedirectResponse("smarthydration://onboarding/email-verification?code="+ code)


def generate_verification_link(user_id):
    with db_session:
        user = User.get(id=user_id)

        time_to_expire = dt.timedelta(days=1)

        expire_time = (dt.datetime.now()+time_to_expire).timestamp()

        old_link = VerifyEmail.get(user=user)
        if old_link is not None:
            time_since_last_request = expire_time - old_link.expire_time
            if time_since_last_request < 60:
                raise HTTPException(status_code=403, detail="Too many requests")
            old_link.delete()

        link = VerifyEmail(
            id=generate_invite_link(),
            expire_time=int(expire_time),
            user=user
        )
        commit()

        return "https://hydrationapi.louisnw.com/user/redirect_verify/"+link.id
