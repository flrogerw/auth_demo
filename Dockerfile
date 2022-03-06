FROM node:16-alpine3.14
RUN apk add --no-cache --virtual .build-deps-full git python3 npm make curl bash
WORKDIR /usr/app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY scripts .
RUN chmod +x *.sh

COPY . .

ENTRYPOINT ./startup.sh
