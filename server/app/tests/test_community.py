from app.models import User, Community, InviteLink, db
from pony.orm.core import db_session
from .util import get_test_client, USER_ID

client = get_test_client()


def test_community_endpoints():
    # test creating a community
    client.post("/community/delete")
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


def test_community_invites():
    client.post('/community/create', json={'name': 'MyTestCommunity'})

    response = client.get('/community/generate-invite')

    code = response.json()
    assert code is not None

    with db_session:
        link = InviteLink.get(id=code)
        assert link is not None

        # delete test user in case it already exists
        to_delete = User.get(email='testinvite@gmail.com')
        to_delete.delete() if to_delete else None

    response = client.post('user/register', json={
        'name': 'TestInvite',
        'email': 'testinvite@gmail.com',
        'password': '1',
        'dob': '01-01-2000',
        'mode': 'Standard'
    })
    assert response.status_code == 200

    auth_token = response.json()['access_token']

    # verify email to allow query
    with db_session:
        User.get(email='testinvite@gmail.com').email_verified = True

    response = client.post(f'/community/join', headers={'Authorization': f'Bearer {auth_token}'}, json={'code': code})
    assert response.status_code == 200

    with db_session:
        user = User.get(email='testinvite@gmail.com')

        assert user.community_member is not None
