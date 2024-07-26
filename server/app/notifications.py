from exponent_server_sdk import (
    DeviceNotRegisteredError,
    PushClient,
    PushMessage,
    PushServerError,
    PushTicketError,
)
import os
import requests
from requests.exceptions import ConnectionError, HTTPError

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


# Basic arguments. You should extend this function with the push features you
# want to use, or simply pass in a `PushMessage` object.
def send_push_message(self, token, message, extra=None):
    try:
        response = PushClient(session=session).publish(
            PushMessage(to=token,
                        body=message,
                        data=extra))
    except PushServerError as exc:
        # Encountered some likely formatting/validation error.
        print(exc)
        raise
    except (ConnectionError, HTTPError) as exc:
        # Encountered some Connection or HTTP error - retry a few times in
        # case it is transient.
        raise self.retry(exc=exc)
    try:
        # We got a response back, but we don't know whether it's an error yet.
        # This call raises errors so we can handle them with normal exception
        # flows.
        response.validate_response()
    except DeviceNotRegisteredError:
        # Mark the push token as inactive
        from .models import User
        User.get()
    except PushTicketError as exc:
        # Encountered some other per-notification error.
        print(exc)
        raise self.retry(exc=exc)
