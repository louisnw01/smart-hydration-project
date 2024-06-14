IMAGE_NAME=smart-hydration-backend
CONTAINER_NAME=smart-hydration-server


run:
	docker run -d --name $(CONTAINER_NAME) -p 8085:80 $(IMAGE_NAME)

build:
	docker build -t $(IMAGE_NAME) .

clean:
	docker rmi $(IMAGE_NAME); docker rm $(CONTAINER_NAME)


