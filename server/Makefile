IMAGE_NAME=smart-hydration-backend
CONTAINER_NAME=smart-hydration-server
SHELL := /bin/bash

dev:
	source .venv/bin/activate && fastapi dev --port 8085 app/main.py

test:
	source .venv/bin/activate && pytest

run:
	docker run -d --name $(CONTAINER_NAME) -p 8000:8000 $(IMAGE_NAME)

build:
	docker build -t $(IMAGE_NAME) .

clean:
	docker rm $(CONTAINER_NAME); docker rmi $(IMAGE_NAME)
