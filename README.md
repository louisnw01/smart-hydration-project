# smart-hydration-project
Smart Hydration UoB Final Project

## App setup

1. Install yarn

```
brew install yarn
```

(probably different on windows)

2. Install dependencies

```
cd apps/smart-hydration-app
yarn
```

3. Start dev server with

```
yarn start
```


## Server/Backend setup

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

3. Update `.env`


3. Run the dev server with the makefile

```
make dev
```
4. If using an Android simulator:

Make sure the TCP port of the Android simulator is the same as displayed when running:
```
make dev
```
By running
```
adb reverse --list
```
If the ports are different, you can change the Android TCP port as follows:
```
adb reverse tcp:[FastAPI port] tcp:[FastAPI port]
```
