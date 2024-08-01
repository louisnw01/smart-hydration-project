from .notifications_utils import (
    DeviceNotRegisteredError,
    MessageRateExceededError,
    validate_response,
)
import requests
from requests.exceptions import ConnectionError, HTTPError
from pony.orm.core import db_session, select, min as pony_min, commit
import time
import asyncio
import datetime as dt

from .models import Notifications

# Optionally providing an access token within a session if you have enabled push security
session = requests.Session()


# session.headers.update(
#     {
#         "Authorization": f"Bearer {os.getenv('EXPO_TOKEN')}",
#         "accept": "application/json",
#         "accept-encoding": "gzip, deflate",
#         "content-type": "application/json",
#     }
# )


# decorator to retry push notifications
def retry_on_failure(max_retries, delay=1, exceptions=(Exception,)):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for _ in range(max_retries):
                try:
                    result = func(*args, **kwargs)
                    return result
                except exceptions as e:
                    print(f"Error occurred: {e}. Retrying...")
                    time.sleep(delay)
            raise Exception("Maximum retries exceeded. Function failed.")

        return wrapper

    return decorator


def determine_wait_time():
    with db_session:
        wait_time = select(pony_min(n.send_time) for n in Notifications if n.active is True)[:][0] - dt.datetime.now().timestamp()
    return wait_time


async def send_drink_reminders():
    while True:
        with db_session:
            tokens = select(t for t in Notifications if
                            t.active is True and (t.send_time < dt.datetime.now().timestamp()))
            for token in tokens:
                token.send_time = int(dt.datetime.now().timestamp()) + token.frequency
                send_push_notification(token=token.expo_token, message="It's time for a drink")
            commit()
        time_to_sleep = determine_wait_time()
        await asyncio.sleep(time_to_sleep)


# TODO investigate expo_sdk to see if I should be doing anything more here
@retry_on_failure(max_retries=5, delay=1, exceptions=(ConnectionError, HTTPError, MessageRateExceededError))
def send_push_notification(token, message):
    headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
    payload = {
        'to': token,
        'sound': 'default',
        'body': message,
    }
    try:
        response = requests.post("https://exp.host/--/api/v2/push/send", json=payload, headers=headers)
    except (ConnectionError, HTTPError):
        # Encountered some Connection or HTTP error - retry a few times in
        # case it is transient.
        raise
    try:
        # We got a response back, but we don't know whether it's an error yet.
        # This call raises errors so we can handle them with normal exception
        # flows.
        validate_response(response)
    except DeviceNotRegisteredError:
        # Delete any tokens which are no longer registered
        from .models import Notifications
        with db_session:
            Notifications.get(expo_token=token).delete()
    except MessageRateExceededError:
        # Encountered some other per-notification error.
        raise
    return
