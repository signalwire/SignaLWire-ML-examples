FROM node:21-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY .env ./

RUN npm install

COPY . .

RUN npm install --save-dev @types/node @types/express
RUN npm run build

EXPOSE 3000

CMD [ "node", "dist/app.js" ]
