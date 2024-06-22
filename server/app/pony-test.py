import os
from dotenv import load_dotenv
from models import db
from services import find_user, create_user, delete_user, create_community, find_community


load_dotenv()

db.bind(
    provider='postgres',
    user=os.getenv("DB_USERNAME"),
    password=os.getenv("DB_PASSWORD"),
    host=os.getenv("DB_HOST"),
    database='postgres'
)
db.generate_mapping(create_tables=True)

#find_community('bristol-uni')
community = create_community('bristol-uni')

#create_community('bristol-uni23')
#find_('bristol-uni')

create_user('Tim2','something','hash456', community.id)
#create_user('Tim','something','hash4567', 11)

#find_user('Tim')
#delete_user('Tim2','something','hash456')
#delete_user('Tim2')
#got it working but only when community is optional
#delete_user('Tim2')
#how to make sure it works without community
#is that info only stored in the user table
#make sure how community works -> creating user what values can it have -> tried with integer but crashed
