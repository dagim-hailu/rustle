# syntax=docker/dockerfile:1
FROM rust:1.89-slim AS build
WORKDIR /app/shield
COPY shield/Cargo.toml shield/Cargo.lock ./
COPY shield/build.rs ./
COPY shield/src ./src
COPY proto /app/proto
RUN cargo build --release --locked

FROM debian:bookworm-slim AS runtime
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates bash \
    && rm -rf /var/lib/apt/lists/*
COPY --from=build /app/shield/target/release/read-shield /usr/local/bin/read-shield
USER 65534:65534
EXPOSE 50051
HEALTHCHECK --interval=10s --timeout=3s --start-period=20s --retries=5 CMD ["bash", "-c", "</dev/tcp/127.0.0.1/50051"]
ENTRYPOINT ["read-shield"]
