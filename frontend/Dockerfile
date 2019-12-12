FROM node:lts-alpine

RUN mkdir /docker-frontend
WORKDIR /docker-frontend

COPY package.json /docker-frontend
RUN yarn install

COPY . /docker-frontend
