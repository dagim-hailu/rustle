# syntax=docker/dockerfile:1
FROM node:22-alpine AS build
ARG VITE_GATEWAY_URL=""
ARG VITE_API_URL=""
ARG VITE_STUN_URLS=""
ARG VITE_TURN_URL=""
ARG VITE_TURN_USERNAME=""
ARG VITE_TURN_CREDENTIAL=""
ENV VITE_GATEWAY_URL=$VITE_GATEWAY_URL \
    VITE_API_URL=$VITE_API_URL \
    VITE_STUN_URLS=$VITE_STUN_URLS \
    VITE_TURN_URL=$VITE_TURN_URL \
    VITE_TURN_USERNAME=$VITE_TURN_USERNAME \
    VITE_TURN_CREDENTIAL=$VITE_TURN_CREDENTIAL
WORKDIR /app
COPY web/package.json web/package-lock.json /app/web/
RUN cd /app/web && npm ci --no-audit --no-fund
COPY web /app/web
COPY proto /app/proto
RUN cd /app/web && npm run build

FROM nginx:1.27-alpine AS runtime
COPY web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/web/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=15s --timeout=3s --retries=5 CMD wget -qO- http://127.0.0.1/healthz >/dev/null || exit 1
