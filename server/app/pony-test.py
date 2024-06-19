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
#create_community('bristol-uni')
#find_('bristol-uni')

#create_user('Tim','something','hash456',2)
#find_user('tim')
#got it working but only when community is optional
delete_user('jasmine')
#how to make sure it works without community
#is that info only stored in the user table
#make sure how community works -> creating user what values can it have -> tried with integer but crashed
