# Smart Hydration App: A hydration monitoring app for carers and standard consumers (University of Bristol Final Project)



Small introduction here



## Getting Started

### React Native setup

1. Install yarn

On Mac:

```
brew install yarn
```

For Windows and Linux, see [here](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable).


2. Install dependencies

```
cd smart-hydration-app
yarn
```

3. Start dev server with

```
yarn start
```


### Server/Backend setup

1. Create a virtual environment (venv)

```
cd server
python3 -m venv .venv
```

2. Install dependencies

```
source .venv/bin/activate
pip install -r requirements.txt
```

3. Update `.env` file

Please contact us for these, or you can [add your own](#using-your-own-infrastructure).


3. Run the dev server with the makefile

```
cd server
make dev
```


4. If using an Android simulator:

Make sure the TCP port of the Android simulator is the same as displayed when running `make dev` by running:
```
adb reverse --list
```
If the ports are different, you can change the Android TCP port as follows:
```
adb reverse tcp:[FastAPI port] tcp:[FastAPI port]
```

### Architecture Diagram

![Architecture diagram](architecture-diagram.png)

### Walkthrough video

LINK HERE

### Using your own infrastructure

You can run this project by using your own database and API keys. You will require the following `.env` variables:

Database environment: we used Supabase for this.
* `PROD_DB_USERNAME`
* `PROD_DB_PASSWORD`
* `PROD_DB_HOST`
* `STAGING_DB_USERNAME`
* `STAGING_DB_PASSWORD`
* `STAGING_DB_HOST`

Smart Hydration login: please contact Smart Hydration for this:
* `SMART_HYDRATION_EMAIL`
* `SMART_HYDRATION_PASSWORD`

JWT Tokens + algorithm: you can generate these in python:
* `JWT_SECRET`
* `JWT_ALGORITHM`

* `TESTING_USER_ID`: you can create a dedicated test account and get the accounts UUID from the database:
* `USE_PRODUCTION_DB`: Toggle this depending on which database you would like to use.

Pusher environment; please contact Smart Hydration for this:
* `PUSHER_APP_KEY`
* `PUSHER_APP_SECRET`
* `PUSHER_APP_CLUSTER`

Email API environment:
* `SES_USER_ID`
* `SES_PASSWORD`
* `SES_HOST_ADDRESS`
