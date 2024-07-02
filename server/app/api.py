import json
import os
import requests
import re
from dotenv import load_dotenv
import json
import datetime as dt

load_dotenv()


def login_and_get_session():
    session = requests.Session()

    response = session.get('https://www.smarthydration.online/login')

    csrf_token_pattern = re.compile(r'name="_token" value="(.*?)"')
    match = csrf_token_pattern.search(response.text)

    if not match:
        return None

    token = match.group(1)

    response = session.post('https://www.smarthydration.online/login', data={
        '_token': token,
        'email': os.getenv('SMART_HYDRATION_EMAIL'),
        'password': os.getenv('SMART_HYDRATION_PASSWORD'),
    })

    if response.status_code != 200:
        raise Exception(f"could not login to smart hydration (status code {response.status_code})")

    return session


headers = {
    'Accept': 'application/json',
}


def query(session, endpoint):
    response = session.get(f'https://www.smarthydration.online{endpoint}', headers=headers)
    return response.json() if response.ok else None


def fetch_data_for_jug(session, jug_id):
    result = query(session, f'/data/device/{jug_id}')
    if result is None:
        return None

    return {
        'capacity': result['device_model']['capacity_ml'],
        'charging': result['telemetry']['charging'],
        'battery': result['telemetry']['battery'],
        'temperature': round(result['telemetry']['temperature'], 3),
        'water_level': result['water_level']['d'],
    }


# Temporary for MVP
def get_all_jug_ids(session):
    real_id = 5
    fake_id = 2

    real_jugs = query(session, f'/data/organisation/{real_id}/device/list')
    fake_jugs = query(session, f'/data/organisation/{fake_id}/device/list')

    if real_jugs is None or fake_jugs is None:
        return

    print(json.dumps(real_jugs, indent=4))

    return {
        "real": [x['identifier'] for x in real_jugs],
        "fake": [x['identifier'] for x in fake_jugs]
    }


def get_jug_data(session, jug, start_timestamp):
    # get a list of all hydration events for the jug for the past year
    # TODO convert start_timestamp to datetime. fromTimestamp
    start_date = dt.datetime.fromtimestamp(start_timestamp)

    data = query(session, f'/data/device/{jug.smart_hydration_id}/events/hydration?maxCount=1000')
    if data is None:
        return []
    # 2024-06-21T12:09:32.476000
    # split the array

    #  iso_date = dt.datetime.fromisoformat(row['timestamp'])
    # ValueError: Invalid isoformat string: '2023-07-06T06:43:04.000000Z'

    aggs = []
    for row in data:
        if row['type'] != 'DRINK':
            continue
        iso_date = dt.datetime.fromisoformat(row['timestamp'].replace('Z', ''))

        aggs.append({
            'time': iso_date.timestamp(),
            'value': -row['water_delta'],
            'name': jug.name,
        })
    return aggs


def get_todays_intake(session, jug):
    dt.date.today()

    data = query(session, f'/data/device/{jug}/events/hydration?maxCount=1000')
    if data is None:
        return []

    total_intake = 0
    for row in data:
        if ((row['type'] != 'DRINK') |
                (dt.datetime.fromisoformat(row['timestamp'].replace('Z', '')).date() < dt.datetime.today().date())):
            continue

        total_intake -= row['water_delta']

    return total_intake

