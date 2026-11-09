# syntax=docker/dockerfile:1
FROM node:22-alpine AS deps
WORKDIR /app/api
COPY api/package.json api/package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM deps AS build
COPY api/ ./
RUN npm run build && npm prune --omit=dev

FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app/api
RUN addgroup -S rustle && adduser -S rustle -G rustle
COPY --from=build /app/api/package.json /app/api/package-lock.json ./
COPY --from=build /app/api/node_modules ./node_modules
COPY --from=build /app/api/dist ./dist
COPY proto /app/proto
COPY db/postgres/migrations /app/db/postgres/migrations
RUN mkdir -p /app/uploads && chown -R rustle:rustle /app/uploads /app/api
USER rustle
EXPOSE 8080
HEALTHCHECK --interval=15s --timeout=3s --retries=10 CMD wget -qO- http://127.0.0.1:8080/healthz >/dev/null || exit 1
CMD ["node", "dist/index.js"]
