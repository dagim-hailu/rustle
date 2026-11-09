defmodule Gateway.Call do
  @moduledoc """
  Ephemeral WebRTC call roster and signaling relay.

  The authoritative roster is KeyDB (`Gateway.Call.Store`), which lets a new
  joiner on either gateway discover existing participants. Join/leave/media
  events and targeted SDP/ICE signals travel over core NATS subject
  `call.channel.<channel_id>`.
  """
  use GenServer
  require Logger

  @max_participants 8

  @spec join(map(), String.t(), String.t(), map()) ::
          {:ok, Chat.V1.CallSnapshot.t()} | {:error, term()}
  def join(user, session_id, channel_id, media) do
    GenServer.call(__MODULE__, {:join, user, session_id, channel_id, media}, 10_000)
  catch
    :exit, _ -> {:error, :call_unavailable}
  end

  @spec leave(map(), String.t(), String.t()) :: :ok
  def leave(user, session_id, channel_id) do
    GenServer.call(__MODULE__, {:leave, user, session_id, channel_id}, 5_000)
  catch
    :exit, _ -> :ok
  end

  @spec leave_all(map(), String.t(), [String.t()]) :: :ok
  def leave_all(user, session_id, channel_ids) do
    GenServer.cast(__MODULE__, {:leave_all, user, session_id, channel_ids})
  catch
    :exit, _ -> :ok
  end

  @spec heartbeat(map(), String.t(), [String.t()], map()) :: :ok
  def heartbeat(user, session_id, channel_ids, media) do
    GenServer.cast(__MODULE__, {:heartbeat, user, session_id, channel_ids, media})
  catch
    :exit, _ -> :ok
  end

  @spec update_media(map(), String.t(), String.t(), map()) :: :ok | {:error, term()}
  def update_media(user, session_id, channel_id, media) do
    GenServer.call(__MODULE__, {:media, user, session_id, channel_id, media}, 5_000)
  catch
    :exit, _ -> {:error, :call_unavailable}
  end

  @spec signal(map(), String.t(), String.t(), String.t(), atom(), String.t(), String.t()) ::
          :ok | {:error, term()}
  def signal(user, session_id, channel_id, target_session_id, type, sdp, candidate) do
    GenServer.call(
      __MODULE__,
      {:signal, user, session_id, channel_id, target_session_id, type, sdp, candidate},
      5_000
    )
  catch
    :exit, _ -> {:error, :call_unavailable}
  end

  def start_link(_), do: GenServer.start_link(__MODULE__, [], name: __MODULE__)

  @impl true
  def init(_) do
    settings = %{
      host: String.to_charlist(Application.get_env(:gateway, :nats_host, "nats")),
      port: Application.get_env(:gateway, :nats_port, 4222),
      name: "rustle-gateway-call"
    }

    {:ok, gnat} = Gnat.start_link(settings, name: :gateway_call_nats)
    {:ok, _sid} = Gnat.sub(gnat, self(), "call.>")
    {:ok, _ref} = Redix.PubSub.psubscribe(Gateway.KeyDB.PubSub, "__keyevent@0__:expired", self())

    {:ok, %{gnat: gnat}}
  end

  @impl true
  def handle_call({:join, user, session_id, channel_id, media}, _from, state) do
    participant = participant(user, session_id, media)

    with {:ok, existing} <- Gateway.Call.Store.snapshot(channel_id),
         :ok <- ensure_room(existing, session_id),
         {:ok, participants} <- Gateway.Call.Store.join(channel_id, participant) do
      publish(state, event(:join, channel_id, participant))

      snapshot = %Chat.V1.CallSnapshot{
        channel_id: channel_id,
        self_session_id: session_id,
        participants: Enum.map(participants, &participant_proto/1)
      }

      {:reply, {:ok, snapshot}, state}
    else
      {:error, reason} ->
        Logger.warning("call join failed", reason: inspect(reason))
        {:reply, {:error, reason}, state}
    end
  end

  def handle_call({:leave, user, session_id, channel_id}, _from, state) do
    _ = Gateway.Call.Store.leave(channel_id, session_id)
    publish(state, event(:leave, channel_id, participant(user, session_id, %{})))
    {:reply, :ok, state}
  end

  def handle_call({:media, user, session_id, channel_id, media}, _from, state) do
    participant = participant(user, session_id, media)

    case Gateway.Call.Store.heartbeat(channel_id, participant) do
      :ok ->
        publish(state, event(:media, channel_id, participant))
        {:reply, :ok, state}

      {:error, reason} ->
        {:reply, {:error, reason}, state}
    end
  end

  def handle_call(
        {:signal, user, session_id, channel_id, target_session_id, type, sdp, candidate},
        _from,
        state
      ) do
    participant = participant(user, session_id, %{})

    signal = %{
      event(type, channel_id, participant)
      | target_session_id: target_session_id,
        sdp: sdp,
        candidate: candidate
    }

    publish(state, signal)
    {:reply, :ok, state}
  end

  @impl true
  def handle_cast({:leave_all, user, session_id, channel_ids}, state) do
    Enum.each(Enum.uniq(channel_ids), fn channel_id ->
      _ = Gateway.Call.Store.leave(channel_id, session_id)
      publish(state, event(:leave, channel_id, participant(user, session_id, %{})))
    end)

    {:noreply, state}
  end

  def handle_cast({:heartbeat, user, session_id, channel_ids, media}, state) do
    participant = participant(user, session_id, media)

    Enum.each(Enum.uniq(channel_ids), fn channel_id ->
      case Gateway.Call.Store.heartbeat(channel_id, participant) do
        :ok -> :ok
        {:error, reason} -> Logger.debug("call heartbeat failed: #{inspect(reason)}")
      end
    end)

    {:noreply, state}
  end

  @impl true
  def handle_info({:msg, %{topic: topic, body: body}}, state) do
    Gateway.Fanout.dispatch_call(topic, IO.iodata_to_binary(body))
    {:noreply, state}
  end

  def handle_info(
        {:redix_pubsub, _pid, _ref, :pmessage,
         %{channel: "__keyevent@0__:expired", payload: key}},
        state
      ) do
    case to_string(key) do
      "call:" <> rest ->
        case String.split(rest, ":", parts: 3) do
          [channel_id, "session", session_id] ->
            _ = Gateway.Call.Store.expire(channel_id, session_id)

            publish(state, %Chat.V1.CallEvent{
              channel_id: channel_id,
              from_session_id: session_id,
              type: Chat.V1.CallEventType.value(:CALL_EVENT_TYPE_LEAVE)
            })

          _ ->
            :ok
        end

      _ ->
        :ok
    end

    {:noreply, state}
  end

  def handle_info({:redix_pubsub, _pid, _ref, :disconnected, %{error: error}}, state) do
    Logger.warning("call key-expiry pub/sub disconnected: #{inspect(error)}")
    {:noreply, state}
  end

  def handle_info(_msg, state), do: {:noreply, state}

  @spec ensure_room([map()], String.t()) :: :ok | {:error, :call_full}
  defp ensure_room(existing, session_id) when is_list(existing) do
    if Enum.any?(existing, &(&1.session_id == session_id)) or length(existing) < @max_participants do
      :ok
    else
      {:error, :call_full}
    end
  end

  defp participant(user, session_id, media) do
    %{
      session_id: session_id,
      user_id: user.id,
      display_name: user.display_name,
      avatar_url: Map.get(user, :avatar_url, ""),
      avatar_color: Map.get(user, :avatar_color, "#B7410E"),
      video: Map.get(media, :video, false),
      muted: Map.get(media, :muted, false),
      deafened: Map.get(media, :deafened, false),
      screen_sharing: Map.get(media, :screen_sharing, false)
    }
  end

  defp participant_proto(participant) do
    %Chat.V1.CallParticipant{
      session_id: participant.session_id,
      user_id: participant.user_id,
      display_name: participant.display_name,
      avatar_url: participant.avatar_url,
      avatar_color: participant.avatar_color,
      video: participant.video,
      muted: participant.muted,
      deafened: participant.deafened,
      screen_sharing: participant.screen_sharing
    }
  end

  defp event(type, channel_id, participant) do
    %Chat.V1.CallEvent{
      channel_id: channel_id,
      from_session_id: participant.session_id,
      from_user_id: participant.user_id,
      from_display_name: participant.display_name,
      from_avatar_url: participant.avatar_url,
      from_avatar_color: participant.avatar_color,
      type: Chat.V1.CallEventType.value(event_type(type)),
      video: participant.video,
      muted: participant.muted,
      deafened: participant.deafened,
      screen_sharing: participant.screen_sharing
    }
  end

  defp event_type(:join), do: :CALL_EVENT_TYPE_JOIN
  defp event_type(:leave), do: :CALL_EVENT_TYPE_LEAVE
  defp event_type(:offer), do: :CALL_EVENT_TYPE_OFFER
  defp event_type(:answer), do: :CALL_EVENT_TYPE_ANSWER
  defp event_type(:ice), do: :CALL_EVENT_TYPE_ICE
  defp event_type(:media), do: :CALL_EVENT_TYPE_MEDIA
  defp event_type(_), do: :CALL_EVENT_TYPE_UNSPECIFIED

  defp publish(state, event) do
    subject = "call.channel.#{event.channel_id}"

    Gnat.pub(state.gnat, subject, Chat.V1.CallEvent.encode(event))
  catch
    kind, reason ->
      Logger.warning("call signal publish failed", reason: inspect({kind, reason}))
      {:error, {kind, reason}}
  end
end
