#!/bin/bash
echo "Atualizando o Linux"
sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get -y install net-tools
sudo apt-get -y install python3
sudo apt-get -y install python3-pip
sudo apt-get -y install python3-venv
sudo apt-get -y install openssl
# Instala o tzdata para dados de fuso horário
sudo apt-get -y install tzdata
# Verifica se o fuso horário 'America/Sao_Paulo' está disponível
if timedatectl list-timezones | grep -q 'America/Sao_Paulo'; then
    sudo timedatectl set-timezone America/Sao_Paulo
else
    echo "Fuso horário 'America/Sao_Paulo' não encontrado. Verifique os fusos horários disponíveis."
fi
# Certifique-se de que o diretório para os certificados existe com as permissões adequadas
sudo mkdir -p /home/ubuntu/containers/certs
sudo chown ubuntu:ubuntu /home/ubuntu/containers/certs
sudo chmod 755 /home/ubuntu/containers/certs
# Agora gere os certificados com as permissões corretas
openssl req -x509 -newkey rsa:4096 -keyout /home/ubuntu/containers/certs/cert.key -out /home/ubuntu/containers/certs/cert.crt -days 3650 -nodes -subj "/CN=desenv.local"
