
# PRODUCTION DOCKERFILE
# ---------------------
# This Dockerfile allows to build a Docker image of the NestJS application
# and based on a NodeJS 16 image. The multi-stage mechanism allows to build
# the application in a "builder" stage and then create a lightweight production
# image containing the required dependencies and the JS build files.
#
# Dockerfile best practices
# https://docs.docker.com/develop/develop-images/dockerfile_best-practices/
# Dockerized NodeJS best practices
# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md
# https://www.bretfisher.com/node-docker-good-defaults/
# http://goldbergyoni.com/checklist-best-practice-of-node-js-in-production/
FROM node:16-alpine as builder

ENV NODE_ENV build


WORKDIR /home/app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

#---
FROM node:16-alpine

COPY --from=builder /home/app/package*.json ./
COPY --from=builder /home/app/node_modules/ ./node_modules/
COPY --from=builder /home/app/dist/ ./dist/
COPY --from=builder /home/app/src/utils/. ./dist/utils/.

ENV DATABASE_HOST=host.docker.internal
ENV MONGO_DB_HOST=host.docker.internal
ENV REDIS_HOST=host.docker.internal

EXPOSE 3000

CMD ["node","dist/main.js"]
