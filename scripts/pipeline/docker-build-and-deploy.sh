#!/bin/bash

# Build the Docker image
/sbin/ifconfig

sudo docker image list
# sudo docker build -t derp:latest .

# Push the Docker image to a registry (e.g. Docker Hub)
# docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD
# docker tag derp:latest $DOCKER_USERNAME/derp:latest
# docker push $DOCKER_USERNAME/derp:latest

# Deploy the Docker image to the host machine
# ssh -i $SSH_PRIVATE_KEY ubuntu@$HOST_IP "docker pull $DOCKER_USERNAME/derp:latest && docker stop derp && docker rm derp && docker run -d -p 80:80 -p 443:443 --name derp $DOCKER_USERNAME/derp:latest"