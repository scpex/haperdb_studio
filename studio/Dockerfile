FROM node:10

WORKDIR /usr/src

RUN git clone https://github.com/HarperDB/HarperDB_Studio.git \
    cd HarperDB_Studio && npm install

EXPOSE 8080

WORKDIR /usr/src/HarperDB_Studio

CMD [ "node", "hdb_studio.js" ]
