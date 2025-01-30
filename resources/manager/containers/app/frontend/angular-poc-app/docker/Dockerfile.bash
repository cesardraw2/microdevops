# Use a imagem oficial do Node.js como base
FROM node:latest

# Cria o diretório de trabalho no container
WORKDIR /app

# Copia os arquivos de configuração do Angular e instala as dependências
COPY package*.json ./
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Expõe a porta 4200
EXPOSE 4200

# Comando padrão para iniciar o servidor de desenvolvimento do Angular
CMD ["npm", "start"]
