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

3. Run the dev server with the makefile

```
make dev
```
