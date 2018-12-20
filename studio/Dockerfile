FROM node:10

WORKDIR /usr/src/app

COPY . ./
COPY /package*.json ./

RUN npm install

EXPOSE 8080

CMD [ "node", "hdb_studio.js" ]