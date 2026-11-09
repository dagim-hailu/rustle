defmodule Gateway.IDs do
  @moduledoc """
  Conversions at storage boundaries.

  Messages use an 8-byte big-endian Snowflake blob. Users, guilds and channels
  are PostgreSQL UUIDs stored in Scylla as their 16 raw bytes. Big-endian bytes
  keep CQL's `blob < ?` ordering identical to numeric Snowflake ordering.
  """

  @uuid_regex ~r/\A[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\z/

  @spec uuid_to_blob(String.t()) :: {:ok, <<_::128>>} | {:error, :invalid_uuid}
  def uuid_to_blob(id) when is_binary(id) do
    if Regex.match?(@uuid_regex, id) do
      id
      |> String.replace("-", "")
      |> Base.decode16!(case: :mixed)
      |> then(&{:ok, &1})
    else
      {:error, :invalid_uuid}
    end
  end

  @spec uuid_to_blob!(String.t()) :: <<_::128>>
  def uuid_to_blob!(id) do
    case uuid_to_blob(id) do
      {:ok, blob} -> blob
      {:error, :invalid_uuid} -> raise ArgumentError, "invalid UUID: #{inspect(id)}"
    end
  end

  @spec blob_to_uuid(<<_::128>>) :: String.t()
  def blob_to_uuid(<<_::128>> = blob) do
    hex = Base.encode16(blob, case: :lower)
    <<a::binary-8, b::binary-4, c::binary-4, d::binary-4, e::binary-12>> = hex
    Enum.join([a, b, c, d, e], "-")
  end

  @spec valid_uuid?(term()) :: boolean()
  def valid_uuid?(id), do: is_binary(id) and Regex.match?(@uuid_regex, id)

  @spec snowflake_to_blob(integer()) :: <<_::64>>
  def snowflake_to_blob(id) when is_integer(id) and id > 0, do: <<id::unsigned-big-64>>

  @spec blob_to_snowflake(<<_::64>>) :: integer()
  def blob_to_snowflake(<<id::unsigned-big-64>>), do: id

  @spec maybe_snowflake_blob(String.t() | nil) :: {:ok, binary()} | {:error, :invalid_cursor}
  def maybe_snowflake_blob(nil), do: {:ok, <<>>}
  def maybe_snowflake_blob(""), do: {:ok, <<>>}

  def maybe_snowflake_blob(value) when is_binary(value) do
    case Integer.parse(value) do
      {id, ""} when id > 0 and id < 9_223_372_036_854_775_808 ->
        {:ok, snowflake_to_blob(id)}

      _ ->
        {:error, :invalid_cursor}
    end
  end

  def maybe_snowflake_blob(_), do: {:error, :invalid_cursor}
end
