defmodule Gateway.IDsTest do
  use ExUnit.Case, async: true

  test "UUID blobs round-trip" do
    id = "ef2f66a9-e2b3-49cc-a5de-d8d0dc316bb8"
    blob = Gateway.IDs.uuid_to_blob!(id)

    assert byte_size(blob) == 16
    assert Gateway.IDs.blob_to_uuid(blob) == id
    assert {:error, :invalid_uuid} = Gateway.IDs.uuid_to_blob("not-a-uuid")
  end

  test "Snowflake blobs are eight bytes and preserve numeric order" do
    ids = [1, 255, 256, 65_536, 1_700_000_000_000]

    blobs = Enum.map(ids, &Gateway.IDs.snowflake_to_blob/1)
    assert Enum.all?(blobs, &(byte_size(&1) == 8))
    assert blobs == Enum.sort(blobs)
    assert Enum.map(blobs, &Gateway.IDs.blob_to_snowflake/1) == ids
  end

  test "keyset cursor parsing rejects invalid input" do
    assert {:ok, <<>>} = Gateway.IDs.maybe_snowflake_blob(nil)
    assert {:error, :invalid_cursor} = Gateway.IDs.maybe_snowflake_blob("-2")
    assert {:error, :invalid_cursor} = Gateway.IDs.maybe_snowflake_blob("abc")
  end
end
