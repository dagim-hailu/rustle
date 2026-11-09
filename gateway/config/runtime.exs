import Config

if config_env() == :prod do
  config :gateway,
    start_runtime: true,
    start_network: true
end

if config_env() != :test do
  port = String.to_integer(System.get_env("GATEWAY_PORT", "4000"))
  node_id = String.to_integer(System.get_env("GATEWAY_NODE_ID", "1"))
  jwt_secret = System.fetch_env!("JWT_SECRET")
  internal_api_url = System.get_env("INTERNAL_API_URL", "http://api:8080")
  internal_api_token = System.fetch_env!("INTERNAL_API_TOKEN")
  allowed_origins = System.get_env("ALLOWED_ORIGINS", "http://localhost:3000")
  scylla_nodes = System.get_env("SCYLLA_NODES", "scylla-1:9042,scylla-2:9042,scylla-3:9042")

  keydb_url =
    System.get_env("KEYDB_URL", "redis://:devkeydb@keydb:6379/0")

  nats_host = System.get_env("NATS_HOST", "nats")
  nats_port = String.to_integer(System.get_env("NATS_PORT", "4222"))

  config :gateway,
    port: port,
    gateway_node_id: node_id,
    jwt_secret: jwt_secret,
    internal_api_url: internal_api_url,
    internal_api_token: internal_api_token,
    allowed_origins: String.split(allowed_origins, ",", trim: true),
    scylla_nodes: String.split(scylla_nodes, ",", trim: true),
    keydb_url: keydb_url,
    nats_host: nats_host,
    nats_port: nats_port

  config :logger, level: :info
end
