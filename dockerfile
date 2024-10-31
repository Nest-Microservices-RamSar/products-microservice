FROM node:21-alpine3.19

WORKDIR /use/src/app

COPY package*.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3001

