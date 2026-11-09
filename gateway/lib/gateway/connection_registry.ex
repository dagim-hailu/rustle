defmodule Gateway.ConnectionRegistry do
  @moduledoc """
  ETS-backed local routing table. The websocket process owns its connection and
  this registry only records subscriptions needed to route NATS deliveries.
  Monitors clean up abruptly killed connections.
  """
  use GenServer

  @connections :gateway_connections
  @channel_subs :gateway_channel_subs
  @guild_subs :gateway_guild_subs
  @call_subs :gateway_call_subs

  def start_link(opts \\ []), do: GenServer.start_link(__MODULE__, opts, name: __MODULE__)

  @spec register(pid(), map()) :: :ok
  def register(pid, data) do
    GenServer.call(__MODULE__, {:register, pid, data})
  end

  @spec subscribe(pid(), [String.t()]) :: :ok
  def subscribe(pid, channel_ids) do
    GenServer.call(__MODULE__, {:subscribe, pid, channel_ids})
  end

  @spec unsubscribe(pid(), [String.t()]) :: :ok
  def unsubscribe(pid, channel_ids) do
    GenServer.call(__MODULE__, {:unsubscribe, pid, channel_ids})
  end

  @spec join_call(pid(), String.t()) :: :ok
  def join_call(pid, channel_id) do
    GenServer.call(__MODULE__, {:join_call, pid, channel_id})
  end

  @spec leave_call(pid(), String.t()) :: :ok
  def leave_call(pid, channel_id) do
    GenServer.call(__MODULE__, {:leave_call, pid, channel_id})
  end

  @spec unregister(pid()) :: :ok
  def unregister(pid) do
    GenServer.cast(__MODULE__, {:unregister, pid})
  end

  @spec get(pid()) :: {:ok, map()} | :error
  def get(pid) do
    case :ets.lookup(@connections, pid) do
      [{^pid, data}] -> {:ok, data}
      [] -> :error
    end
  end

  @spec channel_pids(String.t()) :: [pid()]
  def channel_pids(channel_id) do
    @channel_subs
    |> :ets.lookup(channel_id)
    |> Enum.map(fn {_channel, pid} -> pid end)
    |> Enum.uniq()
  end

  @spec guild_pids(String.t()) :: [pid()]
  def guild_pids(guild_id) do
    @guild_subs
    |> :ets.lookup(guild_id)
    |> Enum.map(fn {_guild, pid} -> pid end)
    |> Enum.uniq()
  end

  @spec call_pids(String.t(), String.t() | nil) :: [pid()]
  def call_pids(channel_id, target_session_id \\ nil) do
    pids =
      @call_subs
      |> :ets.lookup(channel_id)
      |> Enum.map(fn {_channel, pid} -> pid end)
      |> Enum.uniq()

    case target_session_id do
      nil ->
        pids

      "" ->
        pids

      target ->
        Enum.filter(pids, fn pid ->
          case get(pid) do
            {:ok, %{session_id: ^target}} -> true
            _ -> false
          end
        end)
    end
  end

  @impl true
  def init(_opts) do
    :ets.new(@connections, [:named_table, :set, :protected, read_concurrency: true])
    :ets.new(@channel_subs, [:named_table, :bag, :protected, read_concurrency: true])
    :ets.new(@guild_subs, [:named_table, :bag, :protected, read_concurrency: true])
    :ets.new(@call_subs, [:named_table, :bag, :protected, read_concurrency: true])
    {:ok, %{monitors: %{}, pids: %{}}}
  end

  @impl true
  def handle_call({:register, pid, data}, _from, state) do
    state = cleanup(pid, state, false)

    data =
      Map.take(data, [:user_id, :session_id, :guild_ids])
      |> Map.put_new(:guild_ids, [])

    :ets.insert(@connections, {pid, data})
    for guild_id <- data.guild_ids, do: :ets.insert(@guild_subs, {guild_id, pid})
    ref = Process.monitor(pid)

    {:reply, :ok,
     %{
       state
       | monitors: Map.put(state.monitors, ref, pid),
         pids: Map.put(state.pids, pid, ref)
     }}
  end

  def handle_call({:subscribe, pid, channel_ids}, _from, state) do
    if registered?(pid) do
      for channel_id <- Enum.uniq(channel_ids) do
        unless :ets.member(@channel_subs, {channel_id, pid}) do
          :ets.insert(@channel_subs, {channel_id, pid})
        end
      end
    end

    {:reply, :ok, state}
  end

  def handle_call({:unsubscribe, pid, channel_ids}, _from, state) do
    for channel_id <- channel_ids, do: :ets.delete_object(@channel_subs, {channel_id, pid})
    {:reply, :ok, state}
  end

  def handle_call({:join_call, pid, channel_id}, _from, state) do
    if registered?(pid) and is_binary(channel_id) do
      unless :ets.member(@call_subs, {channel_id, pid}) do
        :ets.insert(@call_subs, {channel_id, pid})
      end
    end

    {:reply, :ok, state}
  end

  def handle_call({:leave_call, pid, channel_id}, _from, state) do
    :ets.delete_object(@call_subs, {channel_id, pid})
    {:reply, :ok, state}
  end

  @impl true
  def handle_cast({:unregister, pid}, state) do
    notify_presence(pid)
    {:noreply, cleanup(pid, state, false)}
  end

  @impl true
  def handle_info({:DOWN, ref, :process, pid, _reason}, state) do
    case Map.pop(state.monitors, ref) do
      {nil, _} ->
        {:noreply, state}

      {^pid, monitors} ->
        state = %{state | monitors: monitors, pids: Map.delete(state.pids, pid)}
        notify_presence(pid)
        cleanup(pid, state, false)
        {:noreply, state}
    end
  end

  def handle_info(_msg, state), do: {:noreply, state}

  defp registered?(pid), do: :ets.member(@connections, pid)

  defp cleanup(pid, state, notify?) do
    if notify?, do: notify_presence(pid)

    :ets.delete(@connections, pid)
    :ets.match_delete(@channel_subs, {:_, pid})
    :ets.match_delete(@guild_subs, {:_, pid})
    :ets.match_delete(@call_subs, {:_, pid})

    case Map.pop(state.pids, pid) do
      {nil, _} ->
        state

      {ref, pids} ->
        Process.demonitor(ref, [:flush])
        %{state | pids: pids, monitors: Map.delete(state.monitors, ref)}
    end
  end

  defp notify_presence(pid) do
    case :ets.lookup(@connections, pid) do
      [{^pid, data}] ->
        if Process.whereis(Gateway.Presence) do
          Gateway.Presence.session_ended_async(
            data.user_id,
            data.session_id,
            data.guild_ids
          )
        end

      _ ->
        :ok
    end
  end
end
