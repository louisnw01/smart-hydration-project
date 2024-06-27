import os
import requests
import re
from dotenv import load_dotenv
import pprint
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

def calculate_hydration_level_for_day(session, jug_id, day):
    # get a list of all hydration events for the jug for the past year
    start_date = dt.datetime.now() - dt.timedelta(days=365)
    start_date_string = start_date.strftime("%Y-%m-%dT%H:%M:%S")

    data = query(session, f'/data/device/{jug_id}/events/hydration?minDate={start_date_string}')
    # 2024-06-21T12:09:32.476000
    # split the array

    daily_aggregate = []
    for row in data:
        if row['type'] != 'DRINK':
            continue
        row['timestamp'] = row['timestamp'][:16]
        row['timestamp'] = dt.datetime.strptime(row['timestamp'], '%Y-%m-%dT%H:%M').timestamp()
        daily_aggregate.append({
            'time': row['timestamp'],
            'amount': (row['water_delta'] * -1)
        })
    return daily_aggregate

