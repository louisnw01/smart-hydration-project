import json
import os
import requests
import re
from dotenv import load_dotenv


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
