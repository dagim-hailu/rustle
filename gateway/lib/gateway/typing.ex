defmodule Gateway.Typing do
  @moduledoc "Ephemeral typing indicators over core NATS; never persisted."
  use GenServer
  require Logger

  def start_link(_), do: GenServer.start_link(__MODULE__, [], name: __MODULE__)

  @spec publish(Chat.V1.TypingEvent.t()) :: :ok | {:error, term()}
  def publish(%Chat.V1.TypingEvent{} = event) do
    Gnat.pub(
      :gateway_typing_nats,
      "typing.channel.#{event.channel_id}",
      Chat.V1.TypingEvent.encode(event)
    )
  catch
    kind, reason -> {:error, {kind, reason}}
  end

  @impl true
  def init(_) do
    settings = %{
      host: String.to_charlist(Application.get_env(:gateway, :nats_host, "nats")),
      port: Application.get_env(:gateway, :nats_port, 4222),
      name: "rustle-gateway-typing"
    }

    {:ok, gnat} = Gnat.start_link(settings, name: :gateway_typing_nats)
    {:ok, _sid} = Gnat.sub(gnat, self(), "typing.>")
    {:ok, %{gnat: gnat}}
  end

  @impl true
  def handle_info({:msg, %{topic: topic, body: body}}, state) do
    Gateway.Fanout.dispatch_typing(topic, IO.iodata_to_binary(body))
    {:noreply, state}
  end

  def handle_info(_msg, state), do: {:noreply, state}
end
