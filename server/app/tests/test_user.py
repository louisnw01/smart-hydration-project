import pytest
from app.models import User
from fastapi import HTTPException
from pony.orm.core import db_session, select
from .util import get_test_client, USER_ID
from ..models import VerifyEmail
from ..routers.user import generate_verification_link

client = get_test_client()


def test_email_link_generation():
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
