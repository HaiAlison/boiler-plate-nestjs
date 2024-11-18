FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .
ENV DATABASE_HOST=host.docker.internal
ENV MONGO_DB_HOST=host.docker.internal
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
