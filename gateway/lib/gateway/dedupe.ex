defmodule Gateway.Dedupe do
  @moduledoc """
  KeyDB-backed idempotency for retried sends.

  A retry with the same `(author_id, client_id)` returns the original message id
  and republishes it to NATS, allowing a client that timed out to recover.
  """
  require Logger

  @spec reserve(String.t(), String.t(), integer()) ::
          {:ok, :reserved} | {:ok, {:duplicate, integer()}} | {:error, term()}
  def reserve(author_id, client_id, message_id) do
    key = key(author_id, client_id)
    ttl = Application.get_env(:gateway, :dedupe_ttl_seconds, 86_400)

    case Redix.command(Gateway.Redix, [
           "SET",
           key,
           Integer.to_string(message_id),
           "NX",
           "EX",
           Integer.to_string(ttl)
         ]) do
      {:ok, "OK"} ->
        {:ok, :reserved}

      {:ok, nil} ->
        case Redix.command(Gateway.Redix, ["GET", key]) do
          {:ok, nil} ->
            {:error, :dedupe_race}

          {:ok, value} ->
            case Integer.parse(value) do
              {id, ""} -> {:ok, {:duplicate, id}}
              _ -> {:error, :invalid_dedupe_value}
            end

          {:error, reason} ->
            {:error, reason}
        end

      {:error, reason} ->
        {:error, reason}

      other ->
        {:error, other}
    end
  end

  @spec release(String.t(), String.t()) :: :ok
  def release(author_id, client_id) do
    case Redix.command(Gateway.Redix, ["DEL", key(author_id, client_id)]) do
      {:ok, _} ->
        :ok

      {:error, reason} ->
        Logger.warning("failed to release idempotency key", reason: inspect(reason))
        :ok
    end
  end

  defp key(author_id, client_id), do: "dedupe:message:#{author_id}:#{client_id}"
end
