#!/bin/bash

set -e # Stop on any error, useful for catching issues immediately

cd /home/ubuntu/containers/app/frontend/angular/poc-plataforma-frontend || (echo "Directory navigation failed" && exit 1)


#
#DIRECTORY="node_modules"
#
## Verifica se o diretório não existe
#if [ ! -d "$DIRECTORY" ]; then
#  # Se não existir, cria o diretório
#  mkdir "$DIRECTORY"
#  echo "Diretório '$DIRECTORY' criado com sucesso."
#else
#  rm -rf node_modules/*
#  # Caso já exista, imprime uma mensagem
#  echo "Diretório '$DIRECTORY' já existe."
#fi
#
#sudo chmod 777 -R ./src

cd /home/ubuntu/containers/app/frontend/angular/poc-plataforma-frontend/docker || (echo "Directory navigation failed" && exit 1)
echo "Contents of directory:"
ls -la

echo "Building and starting containers..."
docker-compose up -d --build
