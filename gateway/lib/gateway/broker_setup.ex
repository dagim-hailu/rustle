defmodule Gateway.BrokerSetup do
  @moduledoc "Waits for NATS, then guarantees the stream and per-node consumer exist."
  use GenServer
  require Logger

  @retries 60
  @delay 1_000

  def start_link(_), do: GenServer.start_link(__MODULE__, [], name: __MODULE__)

  @impl true
  def init(_) do
    case await_topology(@retries) do
      :ok ->
        Logger.info("NATS JetStream topology ready", consumer: Gateway.Broker.consumer_name())
        {:ok, %{}}

      {:error, reason} ->
        {:stop, {:nats_setup_failed, reason}}
    end
  end

  defp await_topology(0), do: {:error, :timeout}

  defp await_topology(attempts) do
    case safe_ensure() do
      :ok ->
        :ok

      {:error, reason} ->
        if attempts == @retries do
          Logger.info("waiting for NATS JetStream", reason: inspect(reason))
        end

        Process.sleep(@delay)
        await_topology(attempts - 1)
    end
  end

  defp safe_ensure do
    Gateway.Broker.ensure_topology()
  catch
    kind, reason -> {:error, {kind, reason}}
  end
end
