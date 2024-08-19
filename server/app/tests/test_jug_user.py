from app.models import User, Community, db
from pony.orm.core import db_session
from .util import get_test_client
from ..models import JugUser

client = get_test_client()


def test_jug_user_endpoints():
    # first create a community for them to be part of
    client.post('/community/create', json={'name': "MyTestCommunity"})
    # test creating a community
    response = client.post('/jug-user/create', json={'name': "MyTestJugUser", 'dob': '11/9/2001', 'room': "Room 3"})
    assert response.status_code == 200
    with db_session:
        jug_user = JugUser.get(name="MyTestJugUser")
        assert jug_user
        assert jug_user.dob == "11/9/2001"
        assert jug_user.room == "Room 3"
        assert jug_user.community
        assert jug_user.community.name == "MyTestCommunity"
        # clean up
        jug_user.delete()
    # delete community
    client.post('/community/delete')

