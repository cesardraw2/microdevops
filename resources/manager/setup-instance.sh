#!/bin/bash

# Corrigir o fuso horário
sudo apt-get update
sudo apt-get install -y tzdata
sudo timedatectl list-timezones | grep Sao_Paulo
sudo timedatectl set-timezone America/Sao_Paulo

sudo mkdir /tmp/unused_timezones
sudo find /usr/share/zoneinfo -type f ! -name 'Sao_Paulo' ! -name 'New_York' -exec mv {} /tmp/unused_timezones/ \;

# Criar um arquivo de swap com permissões seguras
sudo fallocate -l 10G /swapfile
sudo chmod 0600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Desabilitar a configuração de rede do cloud-init
echo "network: {config: disabled}" | sudo tee /etc/cloud/cloud.cfg.d/99-disable-network-config.cfg

# Atualizar os pacotes e instalar dependências necessárias
sudo apt-get update
sudo apt-get -y install \
    curl \
    jq \
    apt-transport-https \
    ca-certificates \
    gnupg-agent \
    software-properties-common

# Adicionar a chave GPG do repositório oficial do Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg


# Adicionar o repositório do Docker
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar o Docker
echo "3 - Instalando o Docker..."

sudo apt-get update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin



# Configurar o Docker para iniciar durante o boot
sudo groupadd docker || true  # Ignora se o grupo já existe
sudo usermod -aG docker ${USER}
sudo systemctl enable docker
sudo systemctl is-active docker

# Instalar o Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Instalar o NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

# Pull Docker Slim image
docker pull dslim/docker-slim

sudo apt install git -y

sudo apt install nodejs npm -y
npm -v
sudo npm install express ws dockerode

sudo npm install -g pm2
pm2 start /home/ubuntu/app/server.js --name wsserver

#pm2 status
#pm2 stop wsserver
#pm2 logs wsserver
#pm2 restart wsserver
#pm2 delete wsserver







curl -fsSL https://ollama.com/install.sh | sh

curl --output localstack-cli-3.5.0-linux-amd64-onefile.tar.gz \
    --location https://github.com/localstack/localstack-cli/releases/download/v3.5.0/localstack-cli-3.5.0-linux-amd64-onefile.tar.gz
