defmodule Gateway.MessageStore do
  @moduledoc "ScyllaDB write path. History reads go through the Rust read shield."
  require Logger

  @insert """
  INSERT INTO primary_chat_space.messages_by_channel
    (channel_id, bucket_day, message_id, author_id, content, attachments)
  VALUES (?, ?, ?, ?, ?, ?)
  """

  @spec insert(map()) :: :ok | {:error, term()}
  def insert(message) do
    with {:ok, channel_id} <- Gateway.IDs.uuid_to_blob(message.channel_id),
         {:ok, author_id} <- Gateway.IDs.uuid_to_blob(message.author_id) do
      bucket_day =
        message.timestamp_ms
        |> Gateway.Bucket.start_ms()
        |> Gateway.Bucket.to_datetime()

      params = [
        {"blob", channel_id},
        {"timestamp", bucket_day},
        {"blob", Gateway.IDs.snowflake_to_blob(message.message_id)},
        {"blob", author_id},
        {"text", message.content || ""},
        {"list<text>", message.attachments || []}
      ]

      case Xandra.Cluster.execute(Gateway.Scylla, @insert, params,
             consistency: :quorum,
             timeout: 5_000
           ) do
        {:ok, %Xandra.Void{}} ->
          :ok

        {:ok, _} ->
          :ok

        {:error, reason} ->
          Logger.error("Scylla message write failed", reason: inspect(reason))
          {:error, reason}
      end
    else
      {:error, reason} -> {:error, reason}
    end
  end
end
