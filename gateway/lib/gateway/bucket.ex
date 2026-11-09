defmodule Gateway.Bucket do
  @moduledoc """
  Fixed 10-day partition windows for `messages_by_channel.bucket_day`.

  Windows are anchored at the Unix epoch, in UTC. The Scylla timestamp is the
  beginning of the window. Cursors use the message Snowflake, whose timestamp
  identifies its window; older windows are walked explicitly.
  """

  @bucket_ms 10 * 24 * 60 * 60 * 1_000

  def bucket_ms, do: @bucket_ms

  @spec start_ms(integer()) :: integer()
  def start_ms(timestamp_ms) when is_integer(timestamp_ms) do
    div(timestamp_ms, @bucket_ms) * @bucket_ms
  end

  @spec previous_start_ms(integer()) :: integer()
  def previous_start_ms(bucket_start_ms), do: bucket_start_ms - @bucket_ms

  @spec to_datetime(integer()) :: DateTime.t()
  def to_datetime(ms) do
    DateTime.from_unix!(ms, :millisecond)
  end

  @spec max_lookback_buckets() :: pos_integer()
  def max_lookback_buckets do
    Application.get_env(:gateway, :max_bucket_lookback, 1_000)
  end
end
