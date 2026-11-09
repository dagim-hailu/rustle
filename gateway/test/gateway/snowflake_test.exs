defmodule Gateway.SnowflakeTest do
  use ExUnit.Case, async: false

  test "generates strictly increasing 64-bit time-sortable ids" do
    {:ok, pid} = Gateway.Snowflake.start_link(node_id: 42, name: :snowflake_test)

    ids = for _ <- 1..2_000, do: Gateway.Snowflake.next_id(pid)

    assert ids == Enum.sort(ids)
    assert ids == Enum.uniq(ids)
    assert Enum.all?(ids, &(&1 > 0 and &1 < 9_223_372_036_854_775_808))

    decoded = Gateway.Snowflake.decode(List.last(ids))
    assert decoded.worker_id == 42
    assert abs(decoded.timestamp_ms - System.system_time(:millisecond)) < 5_000
  end

  test "ids preserve chronological ordering when encoded big-endian" do
    {:ok, pid} = Gateway.Snowflake.start_link(node_id: 7, name: :snowflake_blob_test)
    a = Gateway.Snowflake.next_id(pid)
    b = Gateway.Snowflake.next_id(pid)

    assert Gateway.IDs.snowflake_to_blob(a) < Gateway.IDs.snowflake_to_blob(b)
  end
end
