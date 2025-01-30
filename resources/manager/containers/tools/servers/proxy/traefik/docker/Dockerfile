# Use a imagem base do Traefik
FROM traefik:v2.5

# Copie os arquivos de configuração para a imagem
#COPY traefik.yml /etc/traefik/traefik.yml
#COPY acme.json /letsencrypt/acme.json

# Defina as permissões dos arquivos
RUN chmod 600 /letsencrypt/acme.json && \
    chmod 644 /etc/traefik/traefik.yml

# Comando para iniciar o Traefik
CMD ["traefik"]
