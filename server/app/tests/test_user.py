import pytest
from app.models import User
from fastapi import HTTPException
from pony.orm.core import db_session, select
from .util import get_test_client, USER_ID
from ..models import VerifyEmail, Notifications
from ..routers.user import generate_verification_link

client = get_test_client()


def test_email_link_generation():
    with db_session:
        user = User.get(id=USER_ID)
        link = VerifyEmail.get(user=user)
        link.delete() if link is not None else None
    assert generate_verification_link(USER_ID) is not None

    with db_session:
        user = User.get(id=USER_ID)
        assert user.email_link is not None
        assert user.email_link.expire_time is not None
        with pytest.raises(HTTPException) as err:
            generate_verification_link(USER_ID)
            assert err.value.status_code == 403
            assert err.value.detail == 'Too many requests'
        links = select(link for link in VerifyEmail if link.user == user)
        assert len(links) == 1


def test_notification_endpoints():
    token = "test_token"
    response = client.post('user/add-push-token', json={'pushToken': token})
    assert response.status_code == 200

    with db_session:
        notification = Notifications.get(expo_token=token, user=USER_ID)
        assert notification
        assert notification.active
        assert notification.send_time is not None
        assert notification.frequency == 60 * 60 * 24

    with db_session:
        response = client.post('user/toggle-notifications', json={'notificationSelection': 'Off', 'pushToken': ''})
        notification = Notifications.get(expo_token=token, user=USER_ID)
        assert response.status_code == 400
        assert notification.active is True

    with db_session:
        response = client.post('user/toggle-notifications', json={'notificationSelection': 'Off', 'pushToken': token})
        notification = Notifications.get(expo_token=token, user=USER_ID)
        assert response.status_code == 200
        assert notification.active is False

    with db_session:
        response = client.post('user/toggle-notifications-frequency', json={'notificationSelection': '3 hours', 'pushToken': token})
        notification = Notifications.get(expo_token=token, user=USER_ID)
        assert response.status_code == 200
        assert notification.frequency == 60 * 60 * 24 * 3

    response = client.post('user/remove-push-token', json={'pushToken': token})
    assert response.status_code == 200

    with db_session:
        assert Notifications.get(expo_token=token, user=USER_ID) is None


