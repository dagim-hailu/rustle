defmodule GatewayWeb.Socket do
  @moduledoc """
  One Cowboy process per WebSocket. All state for a connection lives here, so
  malformed frames, database timeouts or crashes are isolated to that connection.
  Frames are protobuf-encoded binary messages (never JSON).
  """
  @behaviour :cowboy_websocket
  require Logger
  alias Gateway.{Call, Dedupe, Fanout, JWT, MessageStore, Presence, Session, Snowflake}

  @rate_capacity 60.0
  @rate_per_second 20.0
  @heartbeat_timeout_ms 45_000
  @auth_timeout_ms 10_000
  @max_frame_bytes 1_048_576
  @heartbeat_close 4001
  @slow_consumer_close 1013

  @impl true
  def init(req, state) do
    origin = :cowboy_req.header("origin", req)
    allowed = Application.get_env(:gateway, :allowed_origins, [])

    if allowed == [] or origin in [nil, :undefined] or origin in allowed do
      opts = %{
        idle_timeout: 90_000,
        max_frame_size: @max_frame_bytes,
        compress: false
      }

      {:cowboy_websocket, req, initial_state(state), opts}
    else
      req =
        :cowboy_req.reply(
          403,
          %{"content-type" => "application/json", "cache-control" => "no-store"},
          Jason.encode!(%{error: "origin_not_allowed"}),
          req
        )

      {:ok, req, state}
    end
  end

  @impl true
  def websocket_init(state) do
    timer = Process.send_after(self(), :auth_timeout, @auth_timeout_ms)
    {:ok, %{state | auth_timer: timer}}
  end

  @impl true
  def websocket_handle({:binary, data}, state) do
    with {:ok, frame} <- decode_frame(data),
         {:ok, state} <- consume_rate(state) do
      dispatch(frame, state)
    else
      :invalid_frame ->
        {:reply, [error_frame("", "INVALID_FRAME", "Malformed protobuf frame", false)], state}

      {:error, state} ->
        {:reply, [error_frame("", "RATE_LIMITED", "Too many frames", true)], state}
    end
  rescue
    exception ->
      Logger.error("websocket frame handler crashed",
        connection: inspect(self()),
        error: Exception.message(exception)
      )

      {:reply, [error_frame("", "INTERNAL", "Unexpected gateway error", true)], state}
  end

  def websocket_handle({:text, _text}, state) do
    frames = [
      error_frame(
        "",
        "BINARY_REQUIRED",
        "This endpoint accepts protobuf binary frames only",
        false
      ),
      {:close, 1003, "binary frames required"}
    ]

    {:reply, frames, state}
  end

  def websocket_handle(_frame, state), do: {:ok, state}

  @impl true
  def websocket_info({:gateway_deliver, binary}, state) do
    {:reply, [{:binary, binary}], state}
  end

  def websocket_info({:gateway_close, reason}, state) do
    Logger.info("closing slow or invalid connection", reason: inspect(reason))
    {:reply, [{:close, @slow_consumer_close, "slow consumer"}], state}
  end

  def websocket_info(:auth_timeout, %{authenticated?: false} = state) do
    frames = [
      error_frame("", "AUTH_TIMEOUT", "Authenticate within 10 seconds", false),
      {:close, 1008, "authentication required"}
    ]

    {:reply, frames, state}
  end

  def websocket_info(:auth_timeout, state), do: {:ok, state}

  def websocket_info(:heartbeat_timeout, %{authenticated?: true} = state) do
    {:reply, [{:close, @heartbeat_close, "heartbeat timeout"}], state}
  end

  def websocket_info(:heartbeat_timeout, state), do: {:ok, state}

  def websocket_info(_info, state), do: {:ok, state}

  @impl true
  def terminate(_reason, _partial_req, state) do
    if state.authenticated? do
      if MapSet.size(state.call_channels) > 0 do
        Call.leave_all(
          state.session.user,
          state.session.session_id,
          MapSet.to_list(state.call_channels)
        )
      end

      Gateway.ConnectionRegistry.unregister(self())
    end

    :ok
  catch
    _, _ -> :ok
  end

  defp initial_state(_opts) do
    %{
      authenticated?: false,
      session: nil,
      auth_timer: nil,
      heartbeat_timer: nil,
      presence_status: :online,
      subscriptions: MapSet.new(),
      call_channels: MapSet.new(),
      call_media: %{video: false, muted: false, deafened: false, screen_sharing: false},
      rate_tokens: @rate_capacity,
      rate_last_ms: monotonic_ms(),
      last_typing_ms: 0
    }
  end

  defp dispatch(%Chat.V1.ClientFrame{payload: {:authenticate, auth}} = frame, state) do
    if state.authenticated? do
      {:reply,
       [error_frame(frame.request_id, "ALREADY_AUTHENTICATED", "Already authenticated", false)],
       state}
    else
      authenticate(auth, frame.request_id, state)
    end
  end

  defp dispatch(%Chat.V1.ClientFrame{request_id: request_id}, %{authenticated?: false} = state) do
    frames = [
      error_frame(request_id, "AUTH_REQUIRED", "Authenticate before sending this frame", false),
      {:close, 1008, "authentication required"}
    ]

    {:reply, frames, state}
  end

  defp dispatch(%Chat.V1.ClientFrame{payload: {:subscribe, subscribe}} = frame, state) do
    handle_subscribe(subscribe, frame.request_id, state)
  end

  defp dispatch(%Chat.V1.ClientFrame{payload: {:unsubscribe, unsubscribe}}, state) do
    ids = Enum.take(unsubscribe.channel_ids, 100)
    Gateway.ConnectionRegistry.unsubscribe(self(), ids)
    {:ok, %{state | subscriptions: MapSet.difference(state.subscriptions, MapSet.new(ids))}}
  end

  defp dispatch(%Chat.V1.ClientFrame{payload: {:send_message, message}} = frame, state) do
    handle_send_message(message, frame.request_id, state)
  end

  defp dispatch(%Chat.V1.ClientFrame{payload: {:heartbeat, heartbeat}} = frame, state) do
    handle_heartbeat(heartbeat.status, frame.request_id, state)
  end

  defp dispatch(%Chat.V1.ClientFrame{payload: {:set_presence, presence}} = frame, state) do
    handle_set_presence(presence.status, frame.request_id, state)
  end

  defp dispatch(%Chat.V1.ClientFrame{payload: {:typing, typing}}, state) do
    handle_typing(typing, state)
  end

  defp dispatch(%Chat.V1.ClientFrame{payload: {:join_call, join}} = frame, state) do
    handle_join_call(join, frame.request_id, state)
  end

  defp dispatch(%Chat.V1.ClientFrame{payload: {:leave_call, leave}}, state) do
    handle_leave_call(leave, state)
  end

  defp dispatch(%Chat.V1.ClientFrame{payload: {:call_signal, signal}} = frame, state) do
    handle_call_signal(signal, frame.request_id, state)
  end

  defp dispatch(%Chat.V1.ClientFrame{payload: {:call_media, media}} = frame, state) do
    handle_call_media(media, frame.request_id, state)
  end

  defp dispatch(%Chat.V1.ClientFrame{request_id: request_id}, state) do
    {:reply, [error_frame(request_id, "INVALID_FRAME", "Frame payload is missing", false)], state}
  end

  defp authenticate(auth, request_id, state) do
    secret = Application.get_env(:gateway, :jwt_secret, "")

    with {:ok, claims} <- JWT.verify(auth.token, secret),
         {:ok, api_session} <- Gateway.ApiClient.fetch_session(claims["sub"]),
         session_id = new_session_id(),
         {:ok, session} <- Session.from_api(api_session, session_id),
         true <- session.user.id == claims["sub"] do
      guild_ids = Session.guild_ids(session)

      :ok =
        Gateway.ConnectionRegistry.register(self(), %{
          user_id: session.user.id,
          session_id: session_id,
          guild_ids: guild_ids
        })

      case Presence.session_started(session.user.id, session_id, guild_ids, :online) do
        :ok -> :ok
        {:error, reason} -> Logger.warning("presence start failed: #{inspect(reason)}")
      end

      snapshot = Presence.snapshot(session.guilds)
      authenticated = Session.authenticated_proto(session)

      frames = [
        {:binary,
         encode(%Chat.V1.ServerFrame{
           request_id: safe_request_id(request_id),
           payload: {:authenticated, authenticated}
         })},
        {:binary,
         encode(%Chat.V1.ServerFrame{
           payload: {:presence_snapshot, %Chat.V1.PresenceSnapshot{statuses: snapshot}}
         })}
      ]

      if state.auth_timer, do: Process.cancel_timer(state.auth_timer)
      heartbeat_timer = Process.send_after(self(), :heartbeat_timeout, @heartbeat_timeout_ms)

      {:reply, frames,
       %{
         state
         | authenticated?: true,
           session: session,
           auth_timer: nil,
           heartbeat_timer: heartbeat_timer,
           subscriptions: MapSet.new()
       }}
    else
      reason ->
        Logger.info("websocket authentication failed", reason: inspect(reason))
        close_auth_error(request_id, "AUTH_FAILED", "Invalid or expired credentials", state)
    end
  end

  defp handle_subscribe(subscribe, request_id, state) do
    ids = Enum.uniq(subscribe.channel_ids) |> Enum.take(100)

    invalid =
      Enum.find(ids, fn channel_id ->
        not Gateway.IDs.valid_uuid?(channel_id) or
          match?({:error, :not_a_member}, Session.channel(state.session, channel_id))
      end)

    if invalid do
      {:reply,
       [error_frame(request_id, "CHANNEL_FORBIDDEN", "Not a member of that channel", false)],
       state}
    else
      Gateway.ConnectionRegistry.subscribe(self(), ids)
      {:ok, %{state | subscriptions: MapSet.union(state.subscriptions, MapSet.new(ids))}}
    end
  end

  defp handle_send_message(message, request_id, state) do
    session = state.session
    author = session.user

    with {:ok, channel} <- Session.channel(session, message.channel_id),
         :ok <- ensure_text_channel(channel),
         :ok <- validate_send(message),
         {:ok, message_id, duplicate?} <-
           reserve_or_duplicate(author.id, message.client_id) do
      timestamp_ms = Snowflake.decode(message_id).timestamp_ms

      chat_message = %Chat.V1.ChatMessage{
        id: message_id,
        channel_id: message.channel_id,
        guild_id: channel.guild_id,
        author_id: author.id,
        author_name: author.display_name,
        author_color: author.avatar_color,
        author_avatar_url: author.avatar_url,
        content: message.content,
        attachments: message.attachments,
        timestamp_ms: timestamp_ms,
        client_id: message.client_id
      }

      result =
        if duplicate? do
          :ok
        else
          MessageStore.insert(%{
            channel_id: chat_message.channel_id,
            author_id: chat_message.author_id,
            message_id: chat_message.id,
            timestamp_ms: chat_message.timestamp_ms,
            content: chat_message.content,
            attachments: chat_message.attachments
          })
        end

      case result do
        :ok ->
          case Gateway.Broker.publish_message(
                 chat_message.guild_id,
                 chat_message.channel_id,
                 Chat.V1.ChatMessage.encode(chat_message)
               ) do
            :ok ->
              :ok

            {:error, reason} ->
              Logger.warning("NATS fan-out publish failed; delivering locally",
                reason: inspect(reason)
              )

              Fanout.deliver_chat_message(chat_message)
          end

          ack = %Chat.V1.MessageAck{
            channel_id: chat_message.channel_id,
            client_id: chat_message.client_id,
            message_id: chat_message.id,
            status: Chat.V1.AckStatus.value(:ACK_STATUS_COMMITTED),
            timestamp_ms: chat_message.timestamp_ms,
            retryable: false
          }

          {:reply,
           [
             {:binary, encode(%Chat.V1.ServerFrame{request_id: request_id, payload: {:ack, ack}})}
           ], state}

        {:error, reason} ->
          Logger.error("message insert failed", reason: inspect(reason))
          unless duplicate?, do: Dedupe.release(author.id, message.client_id)

          {:reply,
           [
             {:binary,
              encode(%Chat.V1.ServerFrame{
                request_id: request_id,
                payload:
                  {:ack,
                   failed_ack(
                     message.channel_id,
                     message.client_id,
                     0,
                     "Message store unavailable",
                     true
                   )}
              })}
           ], state}
      end
    else
      {:error, :not_a_member} ->
        {:reply,
         [
           {:binary,
            encode(%Chat.V1.ServerFrame{
              request_id: request_id,
              payload:
                {:ack,
                 failed_ack(
                   message.channel_id,
                   message.client_id,
                   0,
                   "Channel not found or access denied",
                   false
                 )}
            })}
         ], state}

      {:error, reason} when is_binary(reason) ->
        {:reply,
         [
           {:binary,
            encode(%Chat.V1.ServerFrame{
              request_id: request_id,
              payload: {:ack, failed_ack(message.channel_id, message.client_id, 0, reason, false)}
            })}
         ], state}

      {:error, reason} ->
        Logger.error("send reservation failed", reason: inspect(reason))

        {:reply,
         [
           {:binary,
            encode(%Chat.V1.ServerFrame{
              request_id: request_id,
              payload:
                {:ack,
                 failed_ack(
                   message.channel_id,
                   message.client_id,
                   0,
                   "Message queue unavailable",
                   true
                 )}
            })}
         ], state}
    end
  rescue
    exception ->
      Logger.error("send_message failed", error: Exception.message(exception))

      {:reply,
       [
         {:binary,
          encode(%Chat.V1.ServerFrame{
            request_id: request_id,
            payload:
              {:ack,
               failed_ack(message.channel_id, message.client_id, 0, "Internal send error", true)}
          })}
       ], state}
  end

  defp reserve_or_duplicate(author_id, client_id) do
    candidate = Snowflake.next_id()

    case Dedupe.reserve(author_id, client_id, candidate) do
      {:ok, :reserved} -> {:ok, candidate, false}
      {:ok, {:duplicate, existing}} -> {:ok, existing, true}
      {:error, reason} -> {:error, reason}
    end
  end

  defp handle_heartbeat(proto_status, request_id, state) do
    case heartbeat_status(proto_status) do
      {:ok, status} ->
        refresh_presence(status, request_id, state)

      :invalid ->
        {:reply,
         [error_frame(request_id, "INVALID_STATUS", "Heartbeat cannot set offline", false)],
         state}
    end
  end

  defp handle_set_presence(proto_status, request_id, state) do
    case heartbeat_status(proto_status) do
      {:ok, status} ->
        refresh_presence(status, request_id, state)

      :invalid ->
        {:reply,
         [error_frame(request_id, "INVALID_STATUS", "Unsupported presence status", false)], state}
    end
  end

  defp refresh_presence(status, request_id, state) do
    session = state.session
    guild_ids = Session.guild_ids(session)

    result = Presence.heartbeat(session.user.id, session.session_id, status, guild_ids)

    Call.heartbeat(
      session.user,
      session.session_id,
      MapSet.to_list(state.call_channels),
      state.call_media
    )

    if state.heartbeat_timer, do: Process.cancel_timer(state.heartbeat_timer)
    heartbeat_timer = Process.send_after(self(), :heartbeat_timeout, @heartbeat_timeout_ms)

    state = %{
      state
      | presence_status: status,
        heartbeat_timer: heartbeat_timer
    }

    case result do
      {:ok, status} ->
        {:reply,
         [
           {:binary,
            encode(%Chat.V1.ServerFrame{
              request_id: request_id,
              payload:
                {:pong,
                 %Chat.V1.Pong{
                   server_time_ms: System.system_time(:millisecond),
                   status: Gateway.Presence.Status.to_proto(status)
                 }}
            })}
         ], state}

      {:error, reason} ->
        Logger.warning("presence heartbeat failed: #{inspect(reason)}")

        {:reply,
         [
           {:binary,
            encode(%Chat.V1.ServerFrame{
              request_id: request_id,
              payload:
                {:error,
                 %Chat.V1.ServerError{
                   code: "PRESENCE_UNAVAILABLE",
                   message: "Presence store unavailable",
                   retryable: true
                 }}
            })}
         ], state}
    end
  end

  defp handle_typing(typing, state) do
    now = monotonic_ms()

    if match?({:ok, _}, Session.channel(state.session, typing.channel_id)) and
         now - state.last_typing_ms >= 1_000 do
      event = %Chat.V1.TypingEvent{
        channel_id: typing.channel_id,
        user_id: state.session.user.id,
        display_name: state.session.user.display_name,
        active: typing.active
      }

      case Gateway.Typing.publish(event) do
        :ok -> :ok
        {:error, reason} -> Logger.debug("typing publish failed: #{inspect(reason)}")
      end

      {:ok, %{state | last_typing_ms: now}}
    else
      {:ok, state}
    end
  end

  defp handle_join_call(join, request_id, state) do
    with {:ok, channel} <- Session.channel(state.session, join.channel_id),
         :ok <- ensure_voice_channel(channel) do
      state = leave_other_calls(state, join.channel_id)
      media = join_media(join)

      case Call.join(state.session.user, state.session.session_id, join.channel_id, media) do
        {:ok, snapshot} ->
          Gateway.ConnectionRegistry.join_call(self(), join.channel_id)

          {:reply,
           [
             {:binary,
              encode(%Chat.V1.ServerFrame{
                request_id: request_id,
                payload: {:call_snapshot, snapshot}
              })}
           ],
           %{
             state
             | call_channels: MapSet.put(state.call_channels, join.channel_id),
               call_media: media
           }}

        {:error, reason} ->
          Logger.warning("call join failed", reason: inspect(reason))

          {:reply, [error_frame(request_id, "CALL_UNAVAILABLE", "Could not join the call", true)],
           state}
      end
    else
      {:error, :not_a_member} ->
        {:reply,
         [error_frame(request_id, "CHANNEL_FORBIDDEN", "Not a member of that channel", false)],
         state}

      {:error, message} ->
        {:reply, [error_frame(request_id, "VOICE_CHANNEL_REQUIRED", message, false)], state}
    end
  end

  defp handle_leave_call(leave, state) do
    if MapSet.member?(state.call_channels, leave.channel_id) do
      :ok = Call.leave(state.session.user, state.session.session_id, leave.channel_id)
      Gateway.ConnectionRegistry.leave_call(self(), leave.channel_id)

      {:ok,
       %{
         state
         | call_channels: MapSet.delete(state.call_channels, leave.channel_id)
       }}
    else
      {:ok, state}
    end
  end

  defp handle_call_signal(signal, request_id, state) do
    with true <- MapSet.member?(state.call_channels, signal.channel_id),
         {:ok, type} <- signal_type(signal.type),
         true <- valid_signal?(signal),
         :ok <-
           Call.signal(
             state.session.user,
             state.session.session_id,
             signal.channel_id,
             signal.target_session_id,
             type,
             signal.sdp || "",
             signal.candidate || ""
           ) do
      {:ok, state}
    else
      false ->
        {:reply, [error_frame(request_id, "NOT_IN_CALL", "Join the voice channel first", false)],
         state}

      :invalid ->
        {:reply, [error_frame(request_id, "INVALID_SIGNAL", "Invalid call signal", false)], state}

      {:error, reason} ->
        Logger.warning("call signal failed", reason: inspect(reason))

        {:reply,
         [error_frame(request_id, "CALL_SIGNAL_FAILED", "Could not relay call signal", true)],
         state}
    end
  end

  defp handle_call_media(media, request_id, state) do
    if MapSet.member?(state.call_channels, media.channel_id) do
      normalized = %{
        video: media.video == true,
        muted: media.muted == true,
        deafened: media.deafened == true,
        screen_sharing: media.screen_sharing == true
      }

      case Call.update_media(
             state.session.user,
             state.session.session_id,
             media.channel_id,
             normalized
           ) do
        :ok ->
          {:ok, %{state | call_media: normalized}}

        {:error, reason} ->
          Logger.warning("call media update failed", reason: inspect(reason))

          {:reply,
           [error_frame(request_id, "CALL_MEDIA_FAILED", "Could not update call media", true)],
           state}
      end
    else
      {:reply, [error_frame(request_id, "NOT_IN_CALL", "Join the voice channel first", false)],
       state}
    end
  end

  defp leave_other_calls(state, keep_channel_id) do
    state.call_channels
    |> Enum.reject(&(&1 == keep_channel_id))
    |> Enum.reduce(state, fn channel_id, acc ->
      :ok = Call.leave(state.session.user, state.session.session_id, channel_id)
      Gateway.ConnectionRegistry.leave_call(self(), channel_id)
      %{acc | call_channels: MapSet.delete(acc.call_channels, channel_id)}
    end)
  end

  defp join_media(join) do
    %{
      video: join.video == true,
      muted: join.muted == true,
      deafened: join.deafened == true,
      screen_sharing: false
    }
  end

  defp signal_type(type) do
    case type do
      value when value in [:CALL_EVENT_TYPE_OFFER, 3] -> {:ok, :offer}
      value when value in [:CALL_EVENT_TYPE_ANSWER, 4] -> {:ok, :answer}
      value when value in [:CALL_EVENT_TYPE_ICE, 5] -> {:ok, :ice}
      _ -> :invalid
    end
  end

  defp valid_signal?(signal) do
    is_binary(signal.target_session_id) and byte_size(signal.target_session_id) > 0 and
      byte_size(signal.target_session_id) <= 128 and
      byte_size(signal.sdp || "") <= 65_536 and
      byte_size(signal.candidate || "") <= 8_192 and
      ((signal.type in [:CALL_EVENT_TYPE_OFFER, :CALL_EVENT_TYPE_ANSWER, 3, 4] and
          byte_size(signal.sdp || "") > 0) or
         (signal.type in [:CALL_EVENT_TYPE_ICE, 5] and byte_size(signal.candidate || "") > 0))
  end

  defp ensure_text_channel(%{channel: %{kind: "text"}}), do: :ok
  defp ensure_text_channel(_), do: {:error, "Voice channels do not accept messages"}

  defp ensure_voice_channel(%{channel: %{kind: "voice"}}), do: :ok
  defp ensure_voice_channel(_), do: {:error, "Select a voice channel to start a call"}

  defp validate_send(message) do
    cond do
      not is_binary(message.channel_id) or not Gateway.IDs.valid_uuid?(message.channel_id) ->
        {:error, "Invalid channel"}

      String.length(message.content || "") > 4_000 ->
        {:error, "Message exceeds 4000 characters"}

      String.trim(message.content || "") == "" and message.attachments == [] ->
        {:error, "Message cannot be empty"}

      length(message.attachments) > 10 ->
        {:error, "At most 10 attachments are allowed"}

      not Enum.all?(message.attachments, &valid_attachment?/1) ->
        {:error, "Invalid attachment reference"}

      not Regex.match?(~r/\A\d{1,20}\z/, message.client_id || "") ->
        {:error, "Invalid client id"}

      true ->
        :ok
    end
  end

  defp valid_attachment?(value) when is_binary(value) and byte_size(value) <= 2_048 do
    String.starts_with?(value, "/uploads/") or
      String.starts_with?(value, "https://") or
      String.starts_with?(value, "http://")
  end

  defp valid_attachment?(_), do: false

  defp failed_ack(channel_id, client_id, message_id, error, retryable) do
    %Chat.V1.MessageAck{
      channel_id: channel_id || "",
      client_id: client_id || "",
      message_id: message_id,
      status: Chat.V1.AckStatus.value(:ACK_STATUS_FAILED),
      timestamp_ms: 0,
      error: error,
      retryable: retryable
    }
  end

  defp close_auth_error(request_id, code, message, state) do
    frames = [
      error_frame(request_id, code, message, false),
      {:close, 1008, "authentication failed"}
    ]

    {:reply, frames, state}
  end

  defp decode_frame(data) when is_binary(data) do
    {:ok, Chat.V1.ClientFrame.decode(data)}
  rescue
    _ -> :invalid_frame
  end

  defp consume_rate(state) do
    now = monotonic_ms()
    elapsed = max(now - state.rate_last_ms, 0)
    tokens = min(@rate_capacity, state.rate_tokens + elapsed / 1_000 * @rate_per_second)

    if tokens >= 1.0 do
      {:ok, %{state | rate_tokens: tokens - 1.0, rate_last_ms: now}}
    else
      {:error, %{state | rate_tokens: tokens, rate_last_ms: now}}
    end
  end

  defp heartbeat_status(status) do
    case status do
      value when value in [:PRESENCE_STATUS_ONLINE, :PRESENCE_STATUS_UNSPECIFIED, 0, 1] ->
        {:ok, :online}

      value when value in [:PRESENCE_STATUS_IDLE, 2] ->
        {:ok, :idle}

      value when value in [:PRESENCE_STATUS_DO_NOT_DISTURB, 3] ->
        {:ok, :do_not_disturb}

      _ ->
        :invalid
    end
  end

  defp error_frame(request_id, code, message, retryable) do
    {:binary,
     encode(%Chat.V1.ServerFrame{
       request_id: safe_request_id(request_id),
       payload: {:error, %Chat.V1.ServerError{code: code, message: message, retryable: retryable}}
     })}
  end

  defp encode(%Chat.V1.ServerFrame{} = frame), do: Chat.V1.ServerFrame.encode(frame)

  defp safe_request_id(nil), do: ""
  defp safe_request_id(value) when is_binary(value), do: String.slice(value, 0, 128)
  defp safe_request_id(_), do: ""

  defp new_session_id, do: :crypto.strong_rand_bytes(16) |> Base.url_encode64(padding: false)
  defp monotonic_ms, do: System.monotonic_time(:millisecond)
end
