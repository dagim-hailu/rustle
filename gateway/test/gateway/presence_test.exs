defmodule Gateway.PresenceTest do
  use ExUnit.Case, async: false
  import Mox

  @user_id "b3f8d81e-c6a4-40d6-a8a4-06328dc03f4b"
  @session_id "session-123"
  @guild_id "62f3f21a-94ea-4cf5-955a-d68922842848"

  setup :set_mox_global
  setup :verify_on_exit!

  setup do
    start_supervised!(
      {Gateway.Presence,
       kv: Gateway.Presence.KVMock, pub: Gateway.Presence.PubMock, network: false}
    )

    :ok
  end

  test "heartbeats use a sliding 45 second TTL and publish only on transition" do
    test_pid = self()

    expect(Gateway.Presence.KVMock, :touch_session, fn @user_id, @session_id, 45 -> :ok end)

    expect(Gateway.Presence.KVMock, :put_presence, fn @user_id, :idle, 45 ->
      {:ok, "online"}
    end)

    expect(Gateway.Presence.PubMock, :publish, fn subject, payload ->
      send(test_pid, {:published, subject, payload})
      :ok
    end)

    assert {:ok, :idle} = Gateway.Presence.heartbeat(@user_id, @session_id, :idle, [@guild_id])
    assert_receive {:published, subject, payload}
    assert subject == "presence.guild.#{@guild_id}.user.#{@user_id}"
    assert Chat.V1.PresenceEvent.decode(payload).status == :PRESENCE_STATUS_IDLE
  end

  test "same status heartbeat refreshes TTL without a presence publication" do
    expect(Gateway.Presence.KVMock, :touch_session, fn @user_id, @session_id, 45 -> :ok end)

    expect(Gateway.Presence.KVMock, :put_presence, fn @user_id, :online, 45 ->
      {:ok, "online"}
    end)

    assert {:ok, :online} =
             Gateway.Presence.heartbeat(@user_id, @session_id, :online, [@guild_id])

    verify!(Gateway.Presence.PubMock)
  end

  test "last session disconnect deletes the key and publishes Offline" do
    test_pid = self()

    expect(Gateway.Presence.KVMock, :remove_session, fn @user_id, @session_id -> {:ok, 0} end)
    expect(Gateway.Presence.KVMock, :delete_presence, fn @user_id -> {:ok, 1} end)

    expect(Gateway.Presence.PubMock, :publish, fn subject, payload ->
      send(test_pid, {:offline, subject, payload})
      :ok
    end)

    assert :ok = Gateway.Presence.session_ended(@user_id, @session_id, [@guild_id])
    assert_receive {:offline, subject, payload}
    assert subject =~ "presence.guild.#{@guild_id}.user.#{@user_id}"
    decoded = Chat.V1.PresenceEvent.decode(payload)
    assert decoded.status == :PRESENCE_STATUS_OFFLINE
  end

  test "KeyDB expiry publishes Offline when the key is actually absent" do
    test_pid = self()

    expect(Gateway.Presence.KVMock, :touch_session, fn @user_id, @session_id, 45 -> :ok end)

    expect(Gateway.Presence.KVMock, :put_presence, fn @user_id, :online, 45 ->
      {:ok, "online"}
    end)

    assert :ok = Gateway.Presence.session_started(@user_id, @session_id, [@guild_id], :online)

    expect(Gateway.Presence.KVMock, :get_presence, fn @user_id -> {:ok, nil} end)

    expect(Gateway.Presence.PubMock, :publish, fn subject, payload ->
      send(test_pid, {:expired, subject, payload})
      :ok
    end)

    send(
      Process.whereis(Gateway.Presence),
      {:redix_pubsub, self(), make_ref(), :pmessage,
       %{channel: "__keyevent@0__:expired", payload: "presence:#{@user_id}"}}
    )

    _ = :sys.get_state(Gateway.Presence)

    assert_receive {:expired, subject, payload}
    assert subject == "presence.guild.#{@guild_id}.user.#{@user_id}"
    assert Chat.V1.PresenceEvent.decode(payload).status == :PRESENCE_STATUS_OFFLINE
  end

  test "expiry is suppressed when a heartbeat raced the key event" do
    expect(Gateway.Presence.KVMock, :get_presence, fn @user_id -> {:ok, "online"} end)

    send(
      Process.whereis(Gateway.Presence),
      {:redix_pubsub, self(), make_ref(), :pmessage,
       %{channel: "__keyevent@0__:expired", payload: "presence:#{@user_id}"}}
    )

    _ = :sys.get_state(Gateway.Presence)
    verify!(Gateway.Presence.PubMock)
  end
end
