defmodule Gateway.Call.Store do
  @moduledoc """
  Ephemeral call roster in KeyDB. Each participant owns a short-lived JSON key
  and a channel set indexes the sessions for snapshot reads. Expiry is handled
  by `Gateway.Call` using keyspace notifications.
  """

  @session_ttl 45
  @set_ttl 90

  @spec join(String.t(), map()) :: {:ok, [map()]} | {:error, term()}
  def join(channel_id, participant) do
    with :ok <- put_participant(channel_id, participant),
         {:ok, _} <- Redix.command(Gateway.Redix, ["EXPIRE", set_key(channel_id), @set_ttl]) do
      snapshot(channel_id)
    end
  end

  @spec snapshot(String.t()) :: {:ok, [map()]} | {:error, term()}
  def snapshot(channel_id) do
    key = set_key(channel_id)

    with {:ok, session_ids} <- Redix.command(Gateway.Redix, ["SMEMBERS", key]) do
      session_ids = Enum.filter(session_ids, &is_binary/1)

      if session_ids == [] do
        {:ok, []}
      else
        keys = Enum.map(session_ids, &session_key(channel_id, &1))

        case Redix.command(Gateway.Redix, ["MGET" | keys]) do
          {:ok, values} ->
            stale =
              session_ids
              |> Enum.zip(values)
              |> Enum.filter(fn {_session_id, value} -> is_nil(value) end)
              |> Enum.map(fn {session_id, _} -> session_id end)

            if stale != [] do
              Redix.command(Gateway.Redix, ["SREM", key | stale])
            end

            participants =
              session_ids
              |> Enum.zip(values)
              |> Enum.flat_map(fn
                {_session_id, nil} -> []
                {_session_id, json} -> decode(json)
              end)

            {:ok, participants}

          error ->
            normalize(error)
        end
      end
    end
  end

  @spec heartbeat(String.t(), map()) :: :ok | {:error, term()}
  def heartbeat(channel_id, participant) do
    with :ok <- put_participant(channel_id, participant),
         {:ok, _} <- Redix.command(Gateway.Redix, ["EXPIRE", set_key(channel_id), @set_ttl]) do
      :ok
    end
  end

  @spec leave(String.t(), String.t()) :: :ok | {:error, term()}
  def leave(channel_id, session_id) do
    key = set_key(channel_id)

    case Redix.pipeline(Gateway.Redix, [
           ["DEL", session_key(channel_id, session_id)],
           ["SREM", key, session_id],
           ["SCARD", key]
         ]) do
      {:ok, [%Redix.Error{}, _, _]} = error ->
        normalize(error)

      {:ok, [_deleted, _removed, 0]} ->
        Redix.command(Gateway.Redix, ["DEL", key])
        :ok

      {:ok, _} ->
        :ok

      error ->
        normalize(error)
    end
  end

  @spec expire(String.t(), String.t()) :: :ok | {:error, term()}
  def expire(channel_id, session_id) do
    leave(channel_id, session_id)
  end

  def ttl, do: @session_ttl

  defp put_participant(channel_id, participant) do
    Redix.command(Gateway.Redix, [
      "SET",
      session_key(channel_id, participant.session_id),
      Jason.encode!(participant),
      "EX",
      @session_ttl
    ])
    |> case do
      {:ok, "OK"} ->
        Redix.command(Gateway.Redix, ["SADD", set_key(channel_id), participant.session_id])
        |> case do
          {:ok, _} -> :ok
          error -> normalize(error)
        end

      error ->
        normalize(error)
    end
  end

  defp decode(json) do
    case Jason.decode(json) do
      {:ok, value} when is_map(value) ->
        [
          %{
            session_id: value["session_id"] || value["sessionId"] || "",
            user_id: value["user_id"] || value["userId"] || "",
            display_name: value["display_name"] || value["displayName"] || "Participant",
            avatar_url: value["avatar_url"] || value["avatarUrl"] || "",
            avatar_color: value["avatar_color"] || value["avatarColor"] || "#B7410E",
            video: value["video"] == true,
            muted: value["muted"] == true,
            deafened: value["deafened"] == true,
            screen_sharing: value["screen_sharing"] == true
          }
        ]

      _ ->
        []
    end
  end

  defp set_key(channel_id), do: "call:#{channel_id}:sessions"
  defp session_key(channel_id, session_id), do: "call:#{channel_id}:session:#{session_id}"

  defp normalize({:error, _} = error), do: error
  defp normalize({:ok, value}), do: {:error, {:unexpected_redis_reply, value}}
  defp normalize(other), do: {:error, other}
end
