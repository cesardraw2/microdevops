#!/bin/bash
cd /home/ubuntu/containers/app/backend/java/poc/open-liberty || exit
mvn clean package
cd docker || exit
docker-compose up -d --build
