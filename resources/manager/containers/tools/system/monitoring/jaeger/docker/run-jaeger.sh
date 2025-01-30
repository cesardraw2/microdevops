#!/bin/bash

cd /home/ubuntu/containers/tools/system/monitoring/jaeger/docker || exit
#cd docker || exit
#mvn clean package
docker-compose up -d --build
