FROM node:22-alpine as builder

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . .

RUN yarn run build

FROM node:24-alpine

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --prod

COPY --from=builder /app/dist ./dist

CMD [ "yarn", "run", "start:prod" ]