defmodule Gateway.Presence.KeyDB do
  @moduledoc "Redix-backed KeyDB adapter for presence keys."
  @behaviour Gateway.Presence.KV

  @impl true
  def touch_session(user_id, session_id, ttl) do
    sessions_key = sessions_key(user_id)

    case Redix.pipeline(Gateway.Redix, [
           ["SADD", sessions_key, session_id],
           ["EXPIRE", sessions_key, ttl]
         ]) do
      {:ok, [%Redix.Error{}, _]} = error -> normalize(error)
      {:ok, _} -> :ok
      error -> normalize(error)
    end
  end

  @impl true
  def put_presence(user_id, status, ttl) do
    key = presence_key(user_id)
    value = Gateway.Presence.Status.to_string(status)

    case Redix.pipeline(Gateway.Redix, [
           ["GET", key],
           ["SET", key, value, "EX", ttl]
         ]) do
      {:ok, [%Redix.Error{}, _]} = error ->
        normalize(error)

      {:ok, [previous, "OK"]} ->
        {:ok, previous}

      {:ok, _} = error ->
        normalize(error)

      error ->
        normalize(error)
    end
  end

  @impl true
  def get_presence(user_id) do
    Redix.command(Gateway.Redix, ["GET", presence_key(user_id)])
  end

  @impl true
  def get_presence_many([]), do: {:ok, []}

  def get_presence_many(user_ids) do
    Redix.command(Gateway.Redix, ["MGET" | Enum.map(user_ids, &presence_key/1)])
  end

  @impl true
  def remove_session(user_id, session_id) do
    sessions_key = sessions_key(user_id)

    case Redix.pipeline(Gateway.Redix, [
           ["SREM", sessions_key, session_id],
           ["SCARD", sessions_key]
         ]) do
      {:ok, [%Redix.Error{}, _]} = error -> normalize(error)
      {:ok, [_removed, remaining]} -> {:ok, remaining}
      error -> normalize(error)
    end
  end

  @impl true
  def delete_presence(user_id) do
    Redix.command(Gateway.Redix, ["DEL", presence_key(user_id)])
  end

  defp presence_key(user_id), do: "presence:#{user_id}"
  defp sessions_key(user_id), do: "presence:sessions:#{user_id}"

  defp normalize({:error, _} = error), do: error
  defp normalize({:ok, value}) when is_list(value), do: {:error, {:unexpected_redis_reply, value}}
  defp normalize(other), do: {:error, other}
end
