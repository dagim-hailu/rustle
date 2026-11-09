defmodule Gateway.MessageConsumer do
  @moduledoc """
  One durable JetStream pull consumer per gateway node. `batch_size` and
  `max_ack_pending` on the server consumer bound unacknowledged deliveries;
  each delivery is acknowledged only after local fan-out has been enqueued.
  """
  use Gnat.Jetstream.PullConsumer
  require Logger

  def start_link(arg) do
    Gnat.Jetstream.PullConsumer.start_link(__MODULE__, arg)
  end

  @impl true
  def init(_) do
    {:ok, nil,
     connection_name: :gateway_nats,
     stream_name: Gateway.Broker.stream_name(),
     consumer_name: Gateway.Broker.consumer_name(),
     batch_size: 32,
     request_expires: 5_000_000_000,
     idle_heartbeat: 2_000_000_000,
     heartbeat_check_interval: 1_000}
  end

  @impl true
  def handle_message(%{topic: topic, body: body}, state) do
    payload = IO.iodata_to_binary(body)

    case Gateway.Fanout.dispatch_from_nats(topic, payload) do
      :ok ->
        {:ack, state}

      :invalid ->
        Logger.warning("discarding invalid JetStream delivery", subject: topic)
        {:term, state}
    end
  end
end
