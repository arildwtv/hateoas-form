FROM node:8.5.0-alpine
RUN mkdir /app
WORKDIR /app
COPY package.json /app
RUN npm install
COPY src /app
EXPOSE 3001