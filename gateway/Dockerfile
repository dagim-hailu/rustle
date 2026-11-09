# syntax=docker/dockerfile:1
FROM hexpm/elixir:1.18.5-erlang-27.3.4.19-alpine-3.24.2 AS build

ENV MIX_ENV=prod \
    HEX_HTTP_TIMEOUT=120 \
    JWT_SECRET=build-time-placeholder \
    INTERNAL_API_TOKEN=build-time-placeholder
WORKDIR /app

COPY gateway/mix.exs gateway/mix.lock ./
COPY gateway/config ./config
RUN mix local.hex --force \
    && mix local.rebar --force \
    && mix deps.get --only prod \
    && mix deps.compile

COPY gateway/lib ./lib
RUN mix compile && mix release --overwrite

FROM hexpm/elixir:1.18.5-erlang-27.3.4.19-alpine-3.24.2 AS runtime
RUN apk add --no-cache libstdc++ ncurses-libs openssl
WORKDIR /app
COPY --from=build /app/_build/prod/rel/gateway ./
EXPOSE 4000
HEALTHCHECK --interval=15s --timeout=3s --retries=8 CMD wget -qO- http://127.0.0.1:4000/healthz >/dev/null || exit 1
CMD ["/app/bin/gateway", "start"]
