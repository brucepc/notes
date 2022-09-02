FROM node:16-alpine as node

WORKDIR /app

COPY package.json .
RUN yarn
COPY . .
RUN yarn build

FROM nginx:latest
WORKDIR /usr/share/nginx/html
COPY --from=node /app/dist/my-notes ./
