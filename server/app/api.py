import asyncio
import datetime as dt
import json
import os
import re
import aiohttp

from .services import get_users_jugs_sh_ids


class SmartHydrationSession:
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()

        async with self.session.get('https://www.smarthydration.online/login') as response:
            text = await response.text()

            csrf_token_pattern = re.compile(r'name="_token" value="(.*?)"')
            match = csrf_token_pattern.search(text)
            if not match:
                return None

            token = match.group(1)

            async with self.session.post('https://www.smarthydration.online/login', data={
                '_token': token,
                'email': os.getenv('SMART_HYDRATION_EMAIL'),
                'password': os.getenv('SMART_HYDRATION_PASSWORD'),
            }) as response:
                if response.status != 200:
                    raise Exception(f"could not login to smart hydration (status code {response.status})")
        return self.session

    async def __aexit__(self, exc_type, exc, tb):
        await self.session.close() if self.session else None


headers = {
    'Accept': 'application/json',
}
async def query(session: aiohttp.ClientSession, endpoint):
    async with session.get(f'https://www.smarthydration.online{endpoint}', headers=headers) as response:
        return await response.json(content_type=None) if response.ok else None


def convert_timestamp(timestamp: str):
    return dt.datetime.fromisoformat(timestamp.replace('Z', '')).timestamp()


async def get_jug_latest(session, jug_id):
    result = await query(session, f'/data/device/{jug_id}')
    if result is None:
        return None

    if not result.get('identifier'):
        return None

    return {
        'id': result['identifier'],
        'capacity': result['device_model']['capacity_ml'],
        'charging': result['telemetry']['charging'],
        'battery': result['telemetry']['battery'],
        'temperature': round(result['telemetry']['temperature'], 3),
        'water_level': result['water_level']['d'],
        'last_seen': convert_timestamp(result['telemetry']['timestamp']),
        'last_refill': convert_timestamp(result['device_latest']['lastRefill']),
    }


# Temporary for MVP
async def get_all_jug_ids(user_id, session):
    real_id = 5
    fake_id = 2

    owned_jugs = get_users_jugs_sh_ids(user_id)

    [real_jugs, fake_jugs] = await asyncio.gather(
        query(session, f'/data/organisation/{real_id}/device/list'),
        query(session, f'/data/organisation/{fake_id}/device/list')
    )

    if real_jugs is None or fake_jugs is None:
        return

    return {
        "real": [x['identifier'] for x in real_jugs if x['identifier'] not in owned_jugs],
        "fake": [x['identifier'] for x in fake_jugs if x['identifier'] not in owned_jugs]
    }



async def get_hydration_events(session, jug_id, jug_name, start_timestamp, last_day=False):
    # get a list of all hydration events for the jug for the past year
    # TODO convert start_timestamp to datetime. fromTimestamp
    start_date = dt.datetime.fromtimestamp(start_timestamp)
    todays_date = dt.date.today().strftime("%Y-%m-%d") if last_day else None
    data = await query(session, f'/data/device/{jug_id}/events/hydration?maxCount=1000{f"&minDate={todays_date}" if last_day else ""}')

    if data is None or (type(data) == list and len(data) == 0):
        return []

    events = []
    for row in data.values():
        if row['type'] != 'DRINK':
            continue
        iso_date = dt.datetime.fromisoformat(row['timestamp'].replace('Z', ''))

        events.append({
            'time': iso_date.timestamp(),
            'value': -row['water_delta'],
            'name': jug_name,
        })

    return events

async def fetch_all_registered_jugs():
    async with SmartHydrationSession() as session:
        real_org_id = 5
        fake_org_id = 2

        [real_jugs, fake_jugs] = await asyncio.gather(
            query(session, f'/data/organisation/{real_org_id}/device/list'),
            query(session, f'/data/organisation/{fake_org_id}/device/list')
        )

    full_jug_list = real_jugs+fake_jugs

    final_jug_list = []
    for jug in full_jug_list:
        final_jug_list.append({
            "sh_id": jug['identifier'],
            "sys_id": jug['id'],
            'capacity': jug['device_model']['capacity_ml'],
            'charging': jug['telemetry']['charging'],
            'battery': jug['telemetry']['battery'],
            'temperature': round(jug['telemetry']['temperature'], 3),
            'water_level': jug['water_level']['d'],
            'last_seen': convert_timestamp(jug['telemetry']['timestamp']),
        })
    return final_jug_list
