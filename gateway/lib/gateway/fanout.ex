defmodule Gateway.Fanout do
  @moduledoc """
  Converts broker deliveries into one encoded `ServerFrame` and copies it to
  local subscribers. Slow websocket mailboxes are closed rather than growing
  without bound; clients can reconnect and backfill from history.
  """
  require Logger

  @spec deliver_chat_message(Chat.V1.ChatMessage.t()) :: :ok
  def deliver_chat_message(%Chat.V1.ChatMessage{} = message) do
    frame = Chat.V1.ServerFrame.encode(%Chat.V1.ServerFrame{payload: {:message, message}})
    deliver_channel(message.channel_id, frame)
  end

  @spec dispatch_from_nats(String.t(), binary()) :: :ok | :invalid
  def dispatch_from_nats(subject, payload) do
    case String.split(subject, ".") do
      ["guild", guild_id, "channel", channel_id] ->
        with {:ok, message} <- safe_decode(payload),
             true <- message.guild_id == guild_id,
             true <- message.channel_id == channel_id do
          frame = Chat.V1.ServerFrame.encode(%Chat.V1.ServerFrame{payload: {:message, message}})
          deliver_channel(channel_id, frame)
        else
          _ -> :invalid
        end

      _ ->
        :invalid
    end
  end

  @spec dispatch_presence(String.t(), binary()) :: :ok | :invalid
  def dispatch_presence(subject, payload) do
    case String.split(subject, ".") do
      ["presence", "guild", guild_id, "user", user_id] ->
        with {:ok, event} <- safe_decode_presence(payload),
             true <- event.guild_id == guild_id,
             true <- event.user_id == user_id do
          frame = Chat.V1.ServerFrame.encode(%Chat.V1.ServerFrame{payload: {:presence, event}})
          deliver_guild(guild_id, frame)
        else
          _ -> :invalid
        end

      _ ->
        :invalid
    end
  end

  @spec dispatch_typing(String.t(), binary()) :: :ok | :invalid
  def dispatch_typing(subject, payload) do
    case String.split(subject, ".") do
      ["typing", "channel", channel_id] ->
        with {:ok, event} <- safe_decode_typing(payload),
             true <- event.channel_id == channel_id do
          frame = Chat.V1.ServerFrame.encode(%Chat.V1.ServerFrame{payload: {:typing, event}})
          deliver_channel(channel_id, frame)
        else
          _ -> :invalid
        end

      _ ->
        :invalid
    end
  end

  @spec dispatch_call(String.t(), binary()) :: :ok | :invalid
  def dispatch_call(subject, payload) do
    case String.split(subject, ".") do
      ["call", "channel", channel_id] ->
        with {:ok, event} <- safe_decode_call(payload),
             true <- event.channel_id == channel_id do
          frame = Chat.V1.ServerFrame.encode(%Chat.V1.ServerFrame{payload: {:call_event, event}})
          deliver_call(channel_id, event.target_session_id, frame)
        else
          _ -> :invalid
        end

      _ ->
        :invalid
    end
  end

  @spec deliver_channel(String.t(), binary()) :: :ok
  def deliver_channel(channel_id, binary) do
    channel_id
    |> Gateway.ConnectionRegistry.channel_pids()
    |> deliver(binary)
  end

  @spec deliver_guild(String.t(), binary()) :: :ok
  def deliver_guild(guild_id, binary) do
    guild_id
    |> Gateway.ConnectionRegistry.guild_pids()
    |> deliver(binary)
  end

  defp deliver_call(channel_id, target_session_id, binary) do
    channel_id
    |> Gateway.ConnectionRegistry.call_pids(target_session_id)
    |> deliver(binary)
  end

  defp deliver(pids, binary) do
    max_mailbox = Application.get_env(:gateway, :max_mailbox, 250)

    Enum.each(pids, fn pid ->
      case Process.info(pid, :message_queue_len) do
        {:message_queue_len, length} when length > max_mailbox ->
          Logger.warning("closing slow websocket consumer",
            connection: inspect(pid),
            message_queue_len: length
          )

          send(pid, {:gateway_close, :slow_consumer})

        {:message_queue_len, _} ->
          send(pid, {:gateway_deliver, binary})

        nil ->
          :ok
      end
    end)

    :ok
  end

  defp safe_decode(payload) do
    {:ok, Chat.V1.ChatMessage.decode(payload)}
  rescue
    _ -> :error
  end

  defp safe_decode_presence(payload) do
    {:ok, Chat.V1.PresenceEvent.decode(payload)}
  rescue
    _ -> :error
  end

  defp safe_decode_typing(payload) do
    {:ok, Chat.V1.TypingEvent.decode(payload)}
  rescue
    _ -> :error
  end

  defp safe_decode_call(payload) do
    {:ok, Chat.V1.CallEvent.decode(payload)}
  rescue
    _ -> :error
  end
end
