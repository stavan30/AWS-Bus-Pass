FROM --platform=linux/amd64 python:3.9.15-alpine3.16
ENV PYTHONUNBUFFERED 1
RUN mkdir /code
WORKDIR /code
COPY requirements.txt /code/
RUN apk update
RUN apk upgrade
RUN apk add bash
RUN apk add mysql mysql-client mariadb-connector-c-dev gcc
RUN apk add --no-cache libffi-dev
RUN apk add --no-cache --virtual .build-deps gcc musl-dev
RUN python -m pip install --upgrade pip
RUN pip install -r requirements.txt --no-cache-dir
RUN apk --purge del .build-deps
COPY . /code/

EXPOSE 8000

CMD daphne -b 0.0.0.0 -p 8000 bus_ticketing_app.asgi:application