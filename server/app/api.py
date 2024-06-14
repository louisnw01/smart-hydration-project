import json
import requests
import datetime as dt
from dotenv import load_dotenv
import os
import re

load_dotenv()


def login_and_get_session():
    session = requests.Session()

    response = session.get('https://www.smarthydration.online/login')

    csrf_token_pattern = re.compile(r'name="_token" value="(.*?)"')
    match = csrf_token_pattern.search(response.text)

    token = match.group(1)

    response = session.post('https://www.smarthydration.online/login', data={
        '_token': token,
        'email': os.getenv('SMART_HYDRATION_EMAIL'),
        'password': os.getenv('SMART_HYDRATION_PASSWORD'),
    })

    if response.status_code != 200:
        raise Exception(f"could not login to smart hydration (status code {response.status_code})")

    return session



session = login_and_get_session()


# cookies = response.cookies.get_dict()

headers = {
    'Accept': 'application/json',
}

response = session.get("https://www.smarthydration.online/data/device/jug001056/events/hydration", headers=headers)

if (response.status_code != 200):
    print("error")


data = response.json()


print(json.dumps(data, indent=4))





# print(json.dumps(response.json(), indent=4))


hydration_per_day = []

for row in data:
    if row['type'] != 'DRINK':
        continue
    time = dt.datetime.strptime(row['created_at'], '%Y-%m-%dT%H:%M:%S.%fZ')
    date = time.strftime("%Y-%m-%d")

    if len(hydration_per_day) == 0 or hydration_per_day[-1]['time'] != date:
        hydration_per_day.append({
            'time': date,
            'consumed': row['water_delta']
        })
    else:
        hydration_per_day[-1]['consumed'] += row['water_delta']

    # print(f'{time} drank {water_consumed}mls')


for row in hydration_per_day:
    print(row)

