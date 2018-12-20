FROM ubuntu:latest

ENV workdir=/opt/HarperDB/bin \
    datadir=/hdb \
    username=admin \
    password=admin! \
    httpport=9925 \
    httpsport=32183 \
    harperdbfile=HarperDB_2018-12-16-linux.tar

COPY . /opt

RUN cd /opt &&\
    apt-get update &&\
    apt-get install -y curl &&\
    curl -sL https://deb.nodesource.com/setup_10.x | bash - &&\
    apt-get install -y nodejs &&\
    apt-get install -y build-essential &&\
    npm install -g newman &&\
    tar -xvf ${harperdbfile} &&\
    rm ${harperdbfile} &&\
    mkdir -p /hdb &&\
    chown -hR root /opt/HarperDB &&\
    cd ${workdir} &&\
    ./harperdb install --TC_AGREEMENT yes --HDB_ROOT ${datadir} --HTTP_PORT ${httpport} --HTTPS_PORT ${httpsport} --HDB_ADMIN_USERNAME ${username} --HDB_ADMIN_PASSWORD ${password} --HDB_REGISTER false &&\
    sleep 1s && cd /bin &&\
    echo '#!/bin/bash \ncd /opt/HarperDB/bin && ./harperdb start && cd /opt/postman && newman run insert_test_data.json -e environment.json --delay-request 200 && bash' > start_hdb &&\
    chmod +x start_hdb

WORKDIR ${workdir}

CMD [ "start_hdb" ]

EXPOSE 9925