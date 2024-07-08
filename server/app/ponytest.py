from pony.orm.core import commit, db_session

from .api import login_and_get_session, headers
from .models import User


#
#load_dotenv()

#db.bind(
    #provider='postgres',
    #user=os.getenv("DB_USERNAME"),
    #password=os.getenv("DB_PASSWORD"),
    #host=os.getenv("DB_HOST"),
    #database='postgres'
 #)
#db.generate_mapping(create_tables=True)

@db_session
def create_user(name, email, hashcode):
    User(name=name, email=email, hash=hashcode)
    commit()


@db_session
def get_jug_data(sh_jug_id):
    session = login_and_get_session()
    response = session.get("https://www.smarthydration.online/data/device/" + sh_jug_id + "/events/hydration", headers=headers)
    return response.json()
