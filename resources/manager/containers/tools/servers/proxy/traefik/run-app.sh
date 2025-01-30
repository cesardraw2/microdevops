#!/bin/bash

cd /home/ubuntu/containers/tools/servers/proxy/traefik/docker || exit
#cd docker || exit
#mvn clean package
docker-compose up -d --build
