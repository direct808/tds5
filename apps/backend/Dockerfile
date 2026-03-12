FROM node:22-alpine as builder

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . .

ENV DATABASE_URL=postgres://fake

RUN yarn run cicd:build

FROM node:24-alpine

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --prod

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:${PORT:-3000}/api/health || exit 1

CMD [ "yarn", "run", "cicd:start" ]
