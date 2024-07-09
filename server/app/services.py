from pony.orm.core import commit, get, select, db_session

from .models import User, Jug, JugUser, Community


@db_session
def create_user(name, email, hashcode):
    user = User(name=name, email=email, hash=hashcode)
    commit()
    return user


# @db_session
# def create_jug_user(
#     name: str,
#     user_id: int | None = None,
#     **kwargs
# ):
#     # if community_id is None and user_id is None:
#         # raise Exception("jug user must be assigned to a community or a user")


#     user = User[user_id]
#     # elif community_id:
#         # community = Community[community_id]

#     jug_user = JugUser(name=name, user=user, **kwargs)
#     commit()
#     return jug_user.id


@db_session
def get_user_hash(email: str):
    user = User.get(email=email)
    return user.hash


@db_session
def user_exists(email):
    return True if User.get(email=email) else False


@db_session
def get_auth_token(email):
    pass

@db_session
def delete_user(user_id):
    user = User.get(id=user_id)
    #if user is found get community associated with user in user.community
    if user:
        community_id = user.community
        if community_id:
            community = Community.get(id=user.community.id)
            if community:
                jug_user = JugUser.get(id=user.community.id)
                if jug_user:
                    jug_user.delete()
                community.delete()
        user.delete()


@db_session
def find_user(name):
    result = get(u for u in User if u.name == name)
    return result

@db_session
def create_community(name,id):
    community = Community(name=name,id=id)
    commit()
    return community

@db_session
def find_community(name):
    result = select(c for c in Community if c.name == name)
    show(result)
    return result

@db_session
def create_jug_user(user):
    JugUser(name=user.name, user=user, community=user.community)
    commit()


@db_session
def create_community(name):
    Community(name=name)
    commit()


@db_session
def get_community_id(name):
    return Community.get(name=name).id


@db_session
def create_jug(sh_id, qr_hash, name):
    Jug(smart_hydration_id=sh_id, qr_hash=qr_hash, name=name)
    commit()


@db_session
def link_jugs_to_user_s(user_id, jug_ids):
    user = User.get(id=user_id)
    if not user.jug_user:
        create_jug_user(user)

    jug_user = user.jug_user
    link_jugs_to_jug_user(jug_user.id, jug_ids)


@db_session
def unlink_jug_from_user_s(user_id, jug_id):
    jug_user = User.get(id=user_id).jug_user
    unlink_jug_from_jug_user(jug_user.id, jug_id)


@db_session
def link_jugs_to_jug_user(jug_user_id, jug_ids):
    jugs = select(j for j in Jug if j.smart_hydration_id in jug_ids)
    JugUser.get(id=jug_user_id).jugs.add(jugs)
    commit()


@db_session
def unlink_jug_from_jug_user(jug_user_id, jug_id):
    jug = Jug.get(smart_hydration_id=jug_id)
    JugUser.get(id=jug_user_id).jugs.remove(jug)
    commit()


@db_session
def get_jug_id(sh_id):
    return Jug.get(smart_hydration_id=sh_id).id


@db_session
def get_jug_user_id(name):
    return JugUser.get(name=name).id


def has_access_to_jug(user, sh_jug_id):
    relevant_jug = getattr(get(j for j in Jug if j.smart_hydration_id == sh_jug_id), 'owner')
    jug_community = relevant_jug.community
    user_community = find_user(user).community
    if jug_community == user_community:
        return True
    return False


@db_session
def get_jug_ids_by_community(community):
    juglist = select(j.smart_hydration_id for j in Jug if (j.owner.community == community))[:]
    return juglist


@db_session
def get_jug_name_by_id(sh_jug_id):
    jug = get(j for j in Jug if j.smart_hydration_id == sh_jug_id)
    name = jug.name
    return name


# def get_community_jug_data(user_id):
#     print('Getting data for ' + user_id)
#     community = find_user(user_id).community
#     jug_ids = get_jug_ids_by_community(community)
#     responses = []
#     session = login_and_get_session()
#     for jug_id in jug_ids:
#         print('Trying: ' + jug_id)
#         responses.append(fetch_data_for_jug(session, jug_id))
#     return responses


@db_session
def get_user_by_id(user_id):
    return User.get(id=user_id)


@db_session
def get_user_by_email(email):
    return User.get(email=email)


# Key is column heading in JugUser table e.g. "dob"
@db_session
def update_jug_user_data(user_id: int, key: str, new_value: str):
    jug_user = JugUser.get(id=user_id)
    if jug_user is None:
        return False
    setattr(jug_user, key, new_value)
    return getattr(jug_user, key) == new_value


@db_session
def get_user_name(user_id):
    return User.get(id=user_id).name


@db_session
def get_users_jugs(user_id):
    jugs = User.get(id=user_id).jug_user.jugs
    # jug_list = select(j.smart_hydration_id for j in Jug if (jug_user == j.owner))
    return jugs


@db_session
def get_users_jugs_sh_ids(user_id):
    jugs = User.get(id=user_id).jug_user.jugs
    jug_list = set()

    for jug in jugs:
        jug_list.add(jug.smart_hydration_id)
    return jug_list


@db_session
def update_jug_name_s(jug_id, name):
    Jug.get(smart_hydration_id=jug_id).name = name
    commit()
