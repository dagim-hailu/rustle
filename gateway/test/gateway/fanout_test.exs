defmodule Gateway.FanoutTest do
  use ExUnit.Case, async: false

  @guild_id "0e7b3aac-61e9-47df-901f-30e7e9bcab64"
  @channel_id "e7b90078-66b3-4e17-a591-fca581ec8e63"
  @other_channel "a5f9b98e-5f97-41a0-b97e-9ed9bc84c08b"
  @user_id "c9e234b0-bda3-46cb-b5a7-bcf2d2f07862"

  setup do
    on_exit(fn ->
      Gateway.ConnectionRegistry.unregister(self())
    end)

    :ok
  end

  test "routes a channel message to every local subscriber only" do
    subscriber = self()
    other = spawn_subscriber(@other_channel)

    :ok =
      Gateway.ConnectionRegistry.register(self(), %{
        user_id: @user_id,
        session_id: "session-a",
        guild_ids: [@guild_id]
      })

    :ok = Gateway.ConnectionRegistry.subscribe(self(), [@channel_id])

    message = %Chat.V1.ChatMessage{
      id: 8_220_000_000_000_001,
      channel_id: @channel_id,
      guild_id: @guild_id,
      author_id: @user_id,
      author_name: "Hanna",
      author_color: "#B7410E",
      content: "ሰላም!",
      attachments: [],
      timestamp_ms: 1_750_000_000_000,
      client_id: "12345"
    }

    subject = "guild.#{@guild_id}.channel.#{@channel_id}"
    assert :ok = Gateway.Fanout.dispatch_from_nats(subject, Chat.V1.ChatMessage.encode(message))

    assert_receive {:gateway_deliver, binary}

    assert %Chat.V1.ServerFrame{payload: {:message, delivered}} =
             Chat.V1.ServerFrame.decode(binary)

    assert delivered.content == "ሰላም!"
    assert delivered.id == message.id

    refute_receive {:forwarded, ^other, _}, 100
    assert Process.alive?(subscriber)
  end

  test "routes presence events to all guild subscribers" do
    :ok =
      Gateway.ConnectionRegistry.register(self(), %{
        user_id: "9d5f50dd-db06-4d24-b8bb-b62b48cfcc4b",
        session_id: "session-b",
        guild_ids: [@guild_id]
      })

    event = %Chat.V1.PresenceEvent{
      guild_id: @guild_id,
      user_id: @user_id,
      status: Chat.V1.PresenceStatus.value(:PRESENCE_STATUS_DO_NOT_DISTURB),
      updated_at_ms: System.system_time(:millisecond)
    }

    subject = "presence.guild.#{@guild_id}.user.#{@user_id}"

    assert :ok =
             Gateway.Fanout.dispatch_presence(subject, Chat.V1.PresenceEvent.encode(event))

    assert_receive {:gateway_deliver, binary}

    assert %Chat.V1.ServerFrame{payload: {:presence, presence}} =
             Chat.V1.ServerFrame.decode(binary)

    assert presence.user_id == @user_id
    assert presence.status == :PRESENCE_STATUS_DO_NOT_DISTURB
  end

  test "ignores a payload whose subject and message ids disagree" do
    :ok =
      Gateway.ConnectionRegistry.register(self(), %{
        user_id: @user_id,
        session_id: "session-c",
        guild_ids: [@guild_id]
      })

    :ok = Gateway.ConnectionRegistry.subscribe(self(), [@channel_id])

    message = %Chat.V1.ChatMessage{
      id: 1,
      channel_id: "3b0af4f2-95ce-42e8-bc78-4d29af8d477f",
      guild_id: @guild_id,
      author_id: @user_id,
      content: "wrong channel",
      timestamp_ms: 1
    }

    assert :invalid =
             Gateway.Fanout.dispatch_from_nats(
               "guild.#{@guild_id}.channel.#{@channel_id}",
               Chat.V1.ChatMessage.encode(message)
             )

    refute_receive {:gateway_deliver, _}, 100
  end

  defp spawn_subscriber(channel_id) do
    parent = self()

    spawn_link(fn ->
      Gateway.ConnectionRegistry.register(self(), %{
        user_id: "ad3f07c7-8cc0-494f-aac7-a871b4c17846",
        session_id: "session-other",
        guild_ids: [@guild_id]
      })

      Gateway.ConnectionRegistry.subscribe(self(), [channel_id])
      send(parent, {:ready, self()})
      forward_loop(parent)
    end)
    |> tap(fn _pid ->
      receive do
        {:ready, _} -> :ok
      after
        1_000 -> flunk("subscriber did not start")
      end
    end)
  end

  defp forward_loop(parent) do
    receive do
      {:gateway_deliver, binary} ->
        send(parent, {:forwarded, self(), binary})
        forward_loop(parent)

      _ ->
        forward_loop(parent)
    end
  end
end
