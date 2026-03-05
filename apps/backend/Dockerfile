FROM node:22-alpine as builder

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . .

RUN yarn run cicd:build

FROM node:24-alpine

ARG DATABASE_URL

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --prod

COPY --from=builder /app/dist ./dist
#COPY geo-ip.mmdb ./

CMD [ "yarn", "run", "start:prod" ]
