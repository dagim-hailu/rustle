defmodule Gateway.Broker do
  @moduledoc """
  NATS JetStream setup and publishing.

  Chat messages are stored in the `CHAT` stream with subjects
  `guild.<guild_id>.channel.<channel_id>`. Each gateway owns a durable pull
  consumer named after its node so that every node receives every message and
  locally routes it to its own websocket subscribers. Presence and typing use
  core NATS subjects because they are ephemeral signals.
  """
  require Logger
  alias Gnat.Jetstream.API.{Consumer, Stream}

  @stream_name "CHAT"
  @consumer_prefix "gateway-"

  def stream_name, do: @stream_name

  @spec ensure_topology() :: :ok | {:error, term()}
  def ensure_topology do
    with :ok <- ensure_stream(),
         :ok <- ensure_consumer() do
      :ok
    end
  end

  @spec publish_message(String.t(), String.t(), binary()) :: :ok | {:error, term()}
  def publish_message(guild_id, channel_id, payload) do
    Gnat.pub(
      :gateway_nats,
      "guild.#{guild_id}.channel.#{channel_id}",
      payload
    )
  catch
    kind, reason -> {:error, {kind, reason}}
  end

  defp ensure_stream do
    stream = %Stream{
      name: @stream_name,
      subjects: ["guild.*.channel.*"],
      storage: :file,
      retention: :limits,
      discard: :old,
      max_age: 7 * 24 * 60 * 60 * 1_000_000_000,
      max_bytes: 512 * 1024 * 1024,
      num_replicas: 1,
      description: "Rustle chat fan-out stream"
    }

    case Stream.create(:gateway_nats, stream) do
      {:ok, _} ->
        :ok

      {:error, reason} ->
        case Stream.info(:gateway_nats, @stream_name) do
          {:ok, _} -> :ok
          _ -> {:error, {:stream_create_failed, reason}}
        end
    end
  end

  defp ensure_consumer do
    consumer = %Consumer{
      stream_name: @stream_name,
      durable_name: consumer_name(),
      filter_subject: "guild.*.channel.*",
      ack_policy: :explicit,
      ack_wait: 30_000_000_000,
      deliver_policy: :new,
      max_ack_pending: 512,
      max_batch: 64,
      max_waiting: 512,
      inactive_threshold: 60 * 60 * 1_000_000_000,
      description: "Rustle gateway #{consumer_name()}"
    }

    case Consumer.create(:gateway_nats, consumer) do
      {:ok, _} ->
        :ok

      {:error, reason} ->
        case Consumer.info(:gateway_nats, @stream_name, consumer_name()) do
          {:ok, _} -> :ok
          _ -> {:error, {:consumer_create_failed, reason}}
        end
    end
  end

  @spec consumer_name() :: String.t()
  def consumer_name do
    @consumer_prefix <> Integer.to_string(Application.get_env(:gateway, :gateway_node_id, 1))
  end
end
