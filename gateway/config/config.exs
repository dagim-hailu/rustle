import Config

config :gateway,
  start_runtime: config_env() != :test,
  start_network: config_env() != :test,
  gateway_node_id: 1,
  presence_ttl_seconds: 45,
  heartbeat_interval_seconds: 15,
  max_frame_bytes: 1_048_576,
  max_message_chars: 4_000,
  max_attachments: 10,
  max_mailbox: 250,
  auth_timeout_ms: 10_000,
  dedupe_ttl_seconds: 86_400

config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

import_config "#{config_env()}.exs"
