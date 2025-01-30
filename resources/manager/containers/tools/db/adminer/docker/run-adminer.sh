#!/bin/bash

cd /home/ubuntu/containers/tools/db/adminer/docker || exit
#cd docker || exit
#mvn clean package
docker-compose up -d --build
