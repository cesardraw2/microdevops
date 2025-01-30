#!/bin/bash
cd /home/ubuntu/containers/app/backend/java/sicoob/seguro-vida-backend || exit
#mvn clean package
cd docker || exit
docker-compose up -d --build
