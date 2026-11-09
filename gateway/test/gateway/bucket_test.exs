defmodule Gateway.BucketTest do
  use ExUnit.Case, async: true

  @day 86_400_000
  @bucket 10 * @day

  test "anchors fixed ten-day windows at the Unix epoch" do
    assert Gateway.Bucket.start_ms(0) == 0
    assert Gateway.Bucket.start_ms(@bucket - 1) == 0
    assert Gateway.Bucket.start_ms(@bucket) == @bucket
    assert Gateway.Bucket.start_ms(@bucket + 1) == @bucket
    assert Gateway.Bucket.previous_start_ms(@bucket) == 0
  end

  test "bucket_day is a UTC midnight at the beginning of the window" do
    datetime = @bucket |> Gateway.Bucket.start_ms() |> Gateway.Bucket.to_datetime()

    assert datetime.time_zone == "Etc/UTC"
    assert datetime.hour == 0
    assert datetime.minute == 0
    assert datetime.second == 0
    assert datetime.day == 11
  end

  test "a snowflake timestamp resolves to its containing bucket" do
    ts = 1_704_067_200_000 + 31 * @day
    bucket = Gateway.Bucket.start_ms(ts)

    assert bucket <= ts
    assert ts - bucket < @bucket
    assert rem(bucket, @bucket) == 0
  end
end
