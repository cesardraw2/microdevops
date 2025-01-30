# Use a imagem oficial do Node.js como base
FROM node:18.16.0-alpine

# Cria o diretório de trabalho no container
WORKDIR /app

# Instala a Angular CLI globalmente
RUN npm install -g @angular/cli

# Copia os arquivos de configuração do Angular e instala as dependências
COPY .npmrc ./
COPY package*.json ./
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Corrige as permissões do diretório de trabalho
RUN find /app -not -path "/app/node_modules*" -exec chmod 777 {} \;

# Expõe a porta 4200
EXPOSE 4200

# Comando padrão para iniciar o servidor de desenvolvimento do Angular
CMD ["npm", "start"]
