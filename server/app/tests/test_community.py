from app.models import User, Community, db
from pony.orm.core import db_session
from .util import get_test_client, USER_ID

client = get_test_client()


def test_community_endpoints():
    # test creating a community
    response = client.post('/community/create', json={'name': "MyTestCommunity"})
    assert response.status_code == 200
    with db_session:
        user = User.get(id=USER_ID)
        member = user.community_member
        assert member
        assert member.is_owner == True
        assert member.community
        assert member.community.name == "MyTestCommunity"
        community_id = member.community.id

    # test modifying a community
    response = client.post('/community/update', json={'name': "NewNameCommunity"})
    assert response.status_code == 200
    with db_session:
        community = Community[community_id]
        assert community.name == "NewNameCommunity"

    # test deleting a community
    response = client.post('/community/delete')
    assert response.status_code == 200
    with db_session:
        user = User.get(id=USER_ID)
        assert user.community_member is None
        community = Community.get(id=community_id)
        assert community is None
