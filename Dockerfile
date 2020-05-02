# Dockerfile for the app
FROM node:10
WORKDIR /code
COPY src .
RUN npm install
