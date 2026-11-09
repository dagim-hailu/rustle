defmodule Gateway.Presence do
  @moduledoc """
  Aggregated presence fan-out.

  - Every authenticated connection is a session in `presence:sessions:<user>`.
  - `presence:<user>` stores the status with a sliding 45 second TTL.
  - Heartbeats every 15 seconds refresh both keys.
  - Last session disconnect deletes the presence key and publishes Offline.
  - KeyDB `__keyevent@0__:expired` pub/sub events publish Offline when a client
    goes silent, so there are no deletion jobs or presence sweepers.
  - Presence transitions are published on
    `presence.guild.<guild_id>.user.<user_id>` and re-broadcast locally by the
    same NATS wildcard subscriber.
  """
  use GenServer
  require Logger
  alias Gateway.Presence.Status

  @ttl_key :presence_ttl_seconds

  def start_link(opts \\ []), do: GenServer.start_link(__MODULE__, opts, name: __MODULE__)

  @spec session_started(String.t(), String.t(), [String.t()], atom()) :: :ok | {:error, term()}
  def session_started(user_id, session_id, guild_ids, status \\ :online) do
    GenServer.call(__MODULE__, {:session_started, user_id, session_id, guild_ids, status})
  catch
    :exit, _ -> {:error, :presence_unavailable}
  end

  @spec heartbeat(String.t(), String.t(), atom(), [String.t()]) ::
          {:ok, atom()} | {:error, term()}
  def heartbeat(user_id, session_id, status, guild_ids) do
    GenServer.call(__MODULE__, {:heartbeat, user_id, session_id, status, guild_ids})
  catch
    :exit, _ -> {:error, :presence_unavailable}
  end

  @spec set_status(String.t(), String.t(), atom(), [String.t()]) ::
          {:ok, atom()} | {:error, term()}
  def set_status(user_id, session_id, status, guild_ids) do
    GenServer.call(__MODULE__, {:heartbeat, user_id, session_id, status, guild_ids})
  catch
    :exit, _ -> {:error, :presence_unavailable}
  end

  @spec session_ended(String.t(), String.t(), [String.t()]) :: :ok
  def session_ended(user_id, session_id, guild_ids) do
    GenServer.call(__MODULE__, {:session_ended, user_id, session_id, guild_ids})
  catch
    :exit, _ -> :ok
  end

  @spec session_ended_async(String.t(), String.t(), [String.t()]) :: :ok
  def session_ended_async(user_id, session_id, guild_ids) do
    GenServer.cast(__MODULE__, {:session_ended, user_id, session_id, guild_ids})
  catch
    :exit, _ -> :ok
  end

  @spec snapshot(list()) :: [Chat.V1.PresenceEvent.t()]
  def snapshot(guilds) when is_list(guilds) do
    GenServer.call(__MODULE__, {:snapshot, guilds}, 10_000)
  catch
    :exit, _ -> []
  end

  @impl true
  def init(opts) do
    kv =
      Keyword.get(opts, :kv) ||
        Application.get_env(:gateway, :presence_kv, Gateway.Presence.KeyDB)

    pub =
      Keyword.get(opts, :pub) ||
        Application.get_env(:gateway, :presence_pub, Gateway.Presence.NatsPub)

    gnat =
      if Keyword.get(opts, :network, Application.get_env(:gateway, :start_network, true)) do
        connect_nats!()
      else
        nil
      end

    {:ok, %{kv: kv, pub: pub, gnat: gnat, user_guilds: %{}}}
  end

  @impl true
  def handle_call({:session_started, user_id, session_id, guild_ids, status}, _from, state) do
    status = normalize_status(status)
    ttl = ttl()

    with :ok <- state.kv.touch_session(user_id, session_id, ttl),
         {:ok, previous} <- state.kv.put_presence(user_id, status, ttl) do
      state = remember_guilds(state, user_id, guild_ids)

      if previous != Status.to_string(status),
        do: publish_status(state, user_id, guild_ids, status)

      {:reply, :ok, state}
    else
      {:error, reason} -> {:reply, {:error, reason}, state}
    end
  end

  def handle_call({:heartbeat, user_id, session_id, status, guild_ids}, _from, state) do
    status = normalize_status(status)
    ttl = ttl()

    with :ok <- state.kv.touch_session(user_id, session_id, ttl),
         {:ok, previous} <- state.kv.put_presence(user_id, status, ttl) do
      state = remember_guilds(state, user_id, guild_ids)

      if previous != Status.to_string(status),
        do: publish_status(state, user_id, guild_ids, status)

      {:reply, {:ok, status}, state}
    else
      {:error, reason} -> {:reply, {:error, reason}, state}
    end
  end

  def handle_call({:session_ended, user_id, session_id, guild_ids}, _from, state) do
    {:reply, :ok, end_session(state, user_id, session_id, guild_ids)}
  end

  def handle_call({:snapshot, guilds}, _from, state) do
    member_ids =
      guilds
      |> Enum.flat_map(fn guild -> Enum.map(guild.members, & &1.user_id) end)
      |> Enum.uniq()

    statuses =
      case state.kv.get_presence_many(member_ids) do
        {:ok, values} -> Enum.zip(member_ids, values) |> Map.new()
        {:error, _} -> %{}
      end

    now = System.system_time(:millisecond)

    events =
      for guild <- guilds,
          member <- guild.members do
        status = Status.from_string(Map.get(statuses, member.user_id))

        %Chat.V1.PresenceEvent{
          guild_id: guild.id,
          user_id: member.user_id,
          status: Status.to_proto(status),
          updated_at_ms: now
        }
      end

    {:reply, events, state}
  end

  @impl true
  def handle_cast({:session_ended, user_id, session_id, guild_ids}, state) do
    {:noreply, end_session(state, user_id, session_id, guild_ids)}
  end

  @impl true
  def handle_info({:msg, %{topic: "presence." <> _ = topic, body: body}}, state) do
    payload = IO.iodata_to_binary(body)
    Gateway.Fanout.dispatch_presence(topic, payload)
    state = remember_from_presence_event(state, payload)
    {:noreply, state}
  end

  def handle_info(
        {:redix_pubsub, _pid, _ref, :pmessage,
         %{channel: "__keyevent@0__:expired", payload: key}},
        state
      ) do
    case to_string(key) do
      "presence:" <> user_id ->
        {:noreply, handle_expiry(state, user_id)}

      _ ->
        {:noreply, state}
    end
  end

  def handle_info({:redix_pubsub, _pid, _ref, :disconnected, %{error: error}}, state) do
    Logger.warning("presence pub/sub disconnected: #{inspect(error)}")
    {:noreply, state}
  end

  def handle_info(_msg, state), do: {:noreply, state}

  defp end_session(state, user_id, session_id, guild_ids) do
    guild_ids = guild_ids_for(state, user_id, guild_ids)

    with {:ok, remaining} <- state.kv.remove_session(user_id, session_id) do
      if remaining == 0 do
        case state.kv.delete_presence(user_id) do
          {:ok, 1} -> publish_status(state, user_id, guild_ids, :offline)
          _ -> :ok
        end
      end
    else
      {:error, reason} ->
        Logger.warning("presence session cleanup failed", reason: inspect(reason))
    end

    state
  end

  defp handle_expiry(state, user_id) do
    if Gateway.IDs.valid_uuid?(user_id) do
      case state.kv.get_presence(user_id) do
        {:ok, nil} ->
          guild_ids = state.user_guilds |> Map.get(user_id, []) |> fallback_guilds(user_id)
          publish_status(state, user_id, guild_ids, :offline)
          state

        _ ->
          # A heartbeat raced the expiry notification; the user is still online.
          state
      end
    else
      state
    end
  end

  defp fallback_guilds([], user_id) do
    if Application.get_env(:gateway, :start_network, true) do
      case Gateway.ApiClient.user_guilds(user_id) do
        {:ok, ids} -> ids
        _ -> []
      end
    else
      []
    end
  end

  defp fallback_guilds(ids, _user_id), do: ids

  defp remember_from_presence_event(state, payload) do
    case safe_presence_decode(payload) do
      {:ok, event} -> remember_guilds(state, event.user_id, [event.guild_id])
      _ -> state
    end
  rescue
    _ -> state
  end

  defp safe_presence_decode(payload) do
    {:ok, Chat.V1.PresenceEvent.decode(payload)}
  rescue
    _ -> :error
  end

  defp remember_guilds(state, user_id, guild_ids) do
    current = Map.get(state.user_guilds, user_id, [])
    merged = Enum.uniq(current ++ guild_ids)
    %{state | user_guilds: Map.put(state.user_guilds, user_id, merged)}
  end

  defp guild_ids_for(state, user_id, guild_ids) do
    Enum.uniq(Map.get(state.user_guilds, user_id, []) ++ guild_ids)
  end

  defp publish_status(_state, _user_id, [], _status), do: :ok

  defp publish_status(state, user_id, guild_ids, status) do
    now = System.system_time(:millisecond)

    Enum.each(Enum.uniq(guild_ids), fn guild_id ->
      event = %Chat.V1.PresenceEvent{
        guild_id: guild_id,
        user_id: user_id,
        status: Status.to_proto(status),
        updated_at_ms: now
      }

      subject = "presence.guild.#{guild_id}.user.#{user_id}"

      case state.pub.publish(subject, Chat.V1.PresenceEvent.encode(event)) do
        :ok -> :ok
        {:error, reason} -> Logger.warning("presence publish failed: #{inspect(reason)}")
      end
    end)
  end

  defp normalize_status(status) do
    if Status.valid?(status), do: status, else: :online
  end

  defp ttl, do: Application.get_env(:gateway, @ttl_key, 45)

  defp connect_nats! do
    settings = %{
      host: String.to_charlist(Application.get_env(:gateway, :nats_host, "nats")),
      port: Application.get_env(:gateway, :nats_port, 4222),
      name: "rustle-gateway-presence"
    }

    {:ok, gnat} = Gnat.start_link(settings, name: :gateway_presence_nats)
    {:ok, _} = Gnat.sub(gnat, self(), "presence.>")

    # KeyDB keyspace notifications are Redis pub/sub messages, not NATS
    # messages. Redix.PubSub re-subscribes automatically after a reconnect.
    {:ok, _ref} =
      Redix.PubSub.psubscribe(
        Gateway.KeyDB.PubSub,
        "__keyevent@0__:expired",
        self()
      )

    gnat
  end
end
