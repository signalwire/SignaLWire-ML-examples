FROM node:21-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package.json ./
COPY tsconfig.json ./
COPY .env ./
COPY --chown=node:node . .

USER node

RUN npm install
RUN npm install typescript
RUN npm i --save-dev @types/node

RUN npx tsc

EXPOSE 3000

CMD [ "node", "app.js" ]
