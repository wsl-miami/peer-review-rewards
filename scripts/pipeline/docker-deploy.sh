#!/bin/bash

# Stop any image that is running
sudo docker stop derp

# Remove the old image
sudo docker rm derp

# Build the Docker image
sudo docker build -t derp:latest .

# Run the image
sudo docker run -d -p 80:80 --name derp derp:latest

# Clean up old waste
sudo docker system prune -a