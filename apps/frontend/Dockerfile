FROM node:24-alpine AS builder

WORKDIR /app

# swagger.json is needed for api:gen (copied from artifact in CI)
COPY apps/backend/swagger.json ./apps/backend/swagger.json

COPY apps/frontend/package.json apps/frontend/yarn.lock ./apps/frontend/

WORKDIR /app/apps/frontend
RUN yarn install --frozen-lockfile

COPY apps/frontend/ .

ENV VITE_API_BASE_URL=""

RUN yarn api:gen && yarn build

FROM nginx:alpine

COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html
COPY apps/frontend/nginx.conf.template /etc/nginx/nginx.conf.template

EXPOSE 80

# envsubst replaces only $BACKEND_URL and $POSTBACK_KEY; nginx vars like $host are preserved
CMD ["/bin/sh", "-c", "envsubst '$BACKEND_URL $POSTBACK_KEY' < /etc/nginx/nginx.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]