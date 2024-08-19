from fastapi import APIRouter, Depends, HTTPException
from pony.orm.core import db_session, commit
from starlette.responses import RedirectResponse

from ..auth import auth_user, generate_auth_token, get_hash, generate_invite_link, auth_user_no_email_verified
from ..mail import send_email_with_ses
from ..models import User, VerifyEmail, Jug, JugUser, Notifications
from ..schemas import UserRegister, UserLogin, VerifyEmailForm, TargetUpdate, PushTokenForm, \
    ToggleNotificationsForm, ChangeModeForm
from ..services import delete_user, get_users_community, user_exists
import datetime as dt
import re

router = APIRouter(
    prefix="/user",
    tags=["user"],
    responses={404: {"description": "Not found"}},
)



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
        user = User(name=form.name, email=form.email, hash=hashed_password, email_verified=False, mode=form.mode, height=form.height, weight=form.weight, unit=form.unit, medication=form.medication)
        juguser = JugUser(name=user.name, user=user)
        if form.dob:
            juguser.dob = form.dob
        commit()
        token = generate_auth_token(user.id)
    return {"access_token": token, "token_type": "bearer"}


@router.post("/login")
async def login(form: UserLogin):
    if not user_exists(form.email):
        raise HTTPException(status_code=400, detail="incorrect email or password")

    given_hash = get_hash(form.password)
    with db_session:
        user = User.get(email=form.email)

        if user.hash != given_hash:
            raise HTTPException(status_code=400, detail="incorrect email or password")

        token = generate_auth_token(user.id)
    return {"access_token": token, "token_type": "bearer"}


@router.post("/check-token")
async def check_token(user_id: str = Depends(auth_user)):
    return {"status": "success"}


@router.get("/info")
async def get_user(user_id: str = Depends(auth_user)):
    with db_session:
        user = User.get(id=user_id)
        return {
            "name": user.name,
            "juguser": user.jug_user.id if user.jug_user else None,
            "has_community": user.community_member is not None and user.community_member.community is not None,
            "target": user.jug_user.target if user.jug_user else None
        }


@router.get("/exists")
async def email_exists(email: str):
    if email is None:
        raise HTTPException(status_code=400, detail="You must enter your email")
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
    return RedirectResponse("smarthydration://onboarding/email-verification?code=" + code)


def generate_verification_link(user_id):
    with db_session:
        user = User.get(id=user_id)

        time_to_expire = dt.timedelta(days=1)

        expire_time = (dt.datetime.now() + time_to_expire).timestamp()

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

        return "https://hydrationapi.louisnw.com/user/redirect_verify/" + link.id


@router.post("/add-push-token")
async def add_push_token(form: PushTokenForm, user_id: str = Depends(auth_user)):
    time_to_send = dt.timedelta(hours=1)

    send_time = (dt.datetime.now() + time_to_send).timestamp()

    with db_session:
        user = User.get(id=user_id)
        if Notifications.get(expo_token=form.pushToken, user=user) is None:
            Notifications(expo_token=form.pushToken,
                          active=True,
                          frequency=60 * 60,
                          send_time=int(send_time),
                          user=user
                          )
            commit()


@router.post("/remove-push-token")
async def delete_push_token(form: PushTokenForm, user_id: str = Depends(auth_user)):
    if not form.pushToken:
        return
    with db_session:
        token = Notifications.get(expo_token=form.pushToken, user=user_id)
        if token is not None:
            token.delete()
            commit()


@router.post("/toggle-notifications")
async def toggle_notifications(form: ToggleNotificationsForm, user_id: str = Depends(auth_user)):
    if form.pushToken == '':
        raise HTTPException(status_code=400, detail="Modifying notification settings has no effect in simulators")

    with db_session:
        token = Notifications.get(expo_token=form.pushToken, user=user_id)
        if form.notificationSelection == "On":
            token.active = True
            token.send_time = token.frequency + int(dt.datetime.now().timestamp())
        elif form.notificationSelection == "Off":
            token.active = False
        commit()


@router.post("/toggle-notifications-frequency")
async def toggle_notifications_frequency(form: ToggleNotificationsForm, user_id: str = Depends(auth_user)):
    if form.pushToken == '':
        raise HTTPException(status_code=400, detail="Modifying notification settings has no effect in simulators")

    hours = extract_number_from_string(form.notificationSelection)

    if hours is None:
        raise

    time_to_send = dt.timedelta(hours=hours)

    send_time = (dt.datetime.now() + time_to_send).timestamp()

    with db_session:
        token = Notifications.get(expo_token=form.pushToken, user=user_id)
        token.send_time = int(send_time)
        token.frequency = 60 * 60 * hours
        commit()


@router.post("/change-mode")
async def change_mode(form: ChangeModeForm, user_id: str = Depends(auth_user)):
    with db_session:
        user = User.get(id=user_id)
        user.mode = form.mode

        community = get_users_community(user_id)

        if not community:
            return

        if form.mode == 'Carer':
            community.jug_users.remove(user.jug_user)
        elif form.mode == 'Standard':
            community.jug_users.add(user.jug_user)


def extract_number_from_string(s):
    # Define the regex pattern to match one or more digits followed by a space and the word "hours"
    pattern = r'(\d+)\s+hour(s)?'

    # Search the string for the pattern
    match = re.search(pattern, s)

    # If a match is found, return the number as an integer
    if match:
        return int(match.group(1))
    else:
        return None
