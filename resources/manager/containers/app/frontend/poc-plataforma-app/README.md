# Angular projeto base

Execute `npm install` para baixar as dependencias

# Dependencias

Instale o concurrently com o comando: `npm i -g concurrently`

Instale o json-server com o comando: `npm i -g json-server`

## Inicie o projeto

Execute `npm run start:dev` .
Acesse o browser na url `http://localhost:4200/`, para visualizar o aplicativo angular. 
Na url `http://localhost:3000` verifique os mocks dos endpoints.

### Start ambiente de desenvolvimento com json-server
npm run start:dev

### Start ambiente de desenvolvimento sem json-server
npm start


## Criando uma funcionalidade de exemplo

ng g @sicoob/schematics:fnc [nome-funcionalidade]

## Configuracao arquivo .npmrc

registry=http://registry.npmjs.org/

@sicoob:registry=http://nexus.sicoob.com.br/repository/npm-sicoob/

proxy=http://[user_name]:[password]@[proxy-ip]:[port]

noproxy=nexus.sicoob.com.br

strict-ssl=false

## Atualizando a versão do @sicoob/ui
npm install @sicoob/ui@latest --save

 



