#!/bin/bash

set -e # Stop on any error, useful for catching issues immediately

echo "Changing directory to /home/ubuntu/containers/app/frontend/angular/app001-frontend/docker"
cd /home/ubuntu/containers/app/frontend/angular/app001-frontend/docker || (echo "Directory navigation failed" && exit 1)

echo "Contents of directory:"
ls -la

echo "Building and starting containers..."
docker-compose up -d --build
