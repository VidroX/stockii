FROM python:3.8.0-alpine

RUN mkdir /docker-api
WORKDIR /docker-api

# install psycopg2 dependencies
RUN apk update \
    && apk add postgresql-dev gcc python3-dev musl-dev git

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt /docker-api/requirements.txt
RUN pip install -r requirements.txt

COPY ./docker-entrypoint.sh /docker-api/docker-entrypoint.sh
COPY . /docker-api

ENTRYPOINT ["/docker-api/docker-entrypoint.sh"]
