#!/bin/bash

cd /home/ubuntu/containers/tools/system/monitoring/prometheus/docker || exit
#cd docker || exit
#mvn clean package
docker-compose up -d --build
