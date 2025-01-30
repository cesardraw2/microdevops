#!/bin/bash
docker volume create --name=portainer_data
cd /home/ubuntu/containers/tools/system/orchestration/portainer/docker || exit
#cd docker || exit
#mvn clean package
docker-compose up -d --build
