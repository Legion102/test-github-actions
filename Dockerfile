FROM node:16-alpine

WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm ci -q

FROM node-package AS build

WORKDIR /app
COPY tsconfig.build.json tsconfig.build.json
COPY tsconfig.json tsconfig.json
COPY src src
RUN npm run build
RUN npm prune --production

FROM node:16-alpine

ENV NODE_ENV=production

WORKDIR /app
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
COPY versions.json /app/versions.json
COPY package.json /app

EXPOSE 3000
CMD npm run start:prod
