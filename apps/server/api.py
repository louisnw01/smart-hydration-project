import json
import requests
import datetime as dt
from dotenv import load_dotenv
import os

load_dotenv()


cookies = {
    'XSRF-TOKEN': os.getenv("XSRF-TOKEN"),
    'smart_hydration_session': os.getenv("smart_hydration_session"),
}

headers = {
    'Accept': 'application/json',
}

response = requests.get("https://www.smarthydration.online/data/device/jug001056/events/hydration", headers=headers, cookies=cookies)

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

