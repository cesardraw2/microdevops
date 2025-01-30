FROM node:16-alpine
USER root

RUN npm install -g @angular/cli@11.0.0

USER node
WORKDIR /usr/src/app

COPY --chown=node:node ../package*.json ../.npmrc ../angular.json ./
COPY --chown=node:node ../*.json ../*.js ./
COPY --chown=node:node ../e2e/ ./e2e/
COPY --chown=node:node ../mock/ ./mock/

RUN npm config set strict-ssl false
RUN npm config set registry https://registry.npmjs.org/
RUN npm config set @sicoob:registry http://nexus.sicoob.com.br/repository/sicoob-npm-releases/


RUN npm install --force --save

COPY --chown=node:node ../src ./src

EXPOSE 4200

CMD ["npm", "start"]
