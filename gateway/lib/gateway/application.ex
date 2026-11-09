defmodule Gateway.Application do
  @moduledoc false
  use Application
  require Logger

  @impl true
  def start(_type, _args) do
    children =
      [
        Gateway.ConnectionRegistry,
        {Gateway.Snowflake, node_id: Application.get_env(:gateway, :gateway_node_id, 1)}
      ] ++ runtime_children()

    Supervisor.start_link(children,
      strategy: :one_for_one,
      name: Gateway.Supervisor,
      max_restarts: 20,
      max_seconds: 30
    )
  end

  defp runtime_children do
    if Application.get_env(:gateway, :start_runtime, true) do
      [
        scylla_child(),
        {Redix, {keydb_url(), [name: Gateway.Redix]}},
        keydb_pubsub_child(),
        gnat_supervisor_child(),
        {Gateway.Presence, []},
        {Gateway.Typing, []},
        {Gateway.Call, []},
        {Gateway.BrokerSetup, []},
        {Gateway.MessageConsumer, []},
        cowboy_child()
      ]
    else
      []
    end
  end

  defp scylla_child do
    {Xandra.Cluster,
     nodes: Application.get_env(:gateway, :scylla_nodes, ["scylla-1:9042"]),
     name: Gateway.Scylla,
     pool_size: 4,
     target_pools: 3,
     token_aware_routing: true,
     shard_awareness: false,
     default_consistency: :quorum,
     queue_checkouts_before_connecting: [timeout: 15_000]}
  end

  defp keydb_pubsub_child do
    %{
      id: Gateway.KeyDB.PubSub,
      start:
        {Redix.PubSub, :start_link,
         [keydb_url(), [name: Gateway.KeyDB.PubSub, sync_connect: false]]},
      type: :worker,
      restart: :permanent,
      shutdown: 5_000
    }
  end

  defp gnat_supervisor_child do
    settings = %{
      name: :gateway_nats,
      backoff_period: 2_000,
      connection_settings: [
        %{
          host: String.to_charlist(Application.get_env(:gateway, :nats_host, "nats")),
          port: Application.get_env(:gateway, :nats_port, 4222),
          name: "rustle-gateway-jetstream"
        }
      ]
    }

    %{
      id: Gnat.ConnectionSupervisor,
      start: {Gnat.ConnectionSupervisor, :start_link, [settings, [name: Gateway.NATS.Supervisor]]}
    }
  end

  defp cowboy_child do
    port = Application.get_env(:gateway, :port, 4000)

    dispatch =
      :cowboy_router.compile([
        {:_,
         [
           {"/healthz", GatewayWeb.HealthHandler, []},
           {"/ws", GatewayWeb.Socket, []}
         ]}
      ])

    %{
      id: :gateway_http,
      start:
        {:cowboy, :start_clear,
         [
           :gateway_http,
           %{
             socket_opts: [{:port, port}],
             num_acceptors: 100,
             max_connections: 100_000
           },
           %{env: %{dispatch: dispatch}}
         ]},
      type: :worker,
      restart: :permanent,
      shutdown: 5_000
    }
  end

  defp keydb_url do
    Application.get_env(:gateway, :keydb_url, "redis://:devkeydb@keydb:6379/0")
  end
end
