# Generated from proto/chat.proto. Keep in sync with the .proto contract.
# Regenerate with protoc-gen-elixir if you change the schema.
defmodule Chat.V1.PresenceStatus do
  @moduledoc false
  use Protobuf, enum: true, protoc_gen_elixir_version: "0.17.0", syntax: :proto3

  field(:PRESENCE_STATUS_UNSPECIFIED, 0)
  field(:PRESENCE_STATUS_ONLINE, 1)
  field(:PRESENCE_STATUS_IDLE, 2)
  field(:PRESENCE_STATUS_DO_NOT_DISTURB, 3)
  field(:PRESENCE_STATUS_OFFLINE, 4)
end

defmodule Chat.V1.ChannelKind do
  @moduledoc false
  use Protobuf, enum: true, protoc_gen_elixir_version: "0.17.0", syntax: :proto3

  field(:CHANNEL_KIND_UNSPECIFIED, 0)
  field(:CHANNEL_KIND_TEXT, 1)
  field(:CHANNEL_KIND_VOICE, 2)
end

defmodule Chat.V1.AckStatus do
  @moduledoc false
  use Protobuf, enum: true, protoc_gen_elixir_version: "0.17.0", syntax: :proto3

  field(:ACK_STATUS_UNSPECIFIED, 0)
  field(:ACK_STATUS_COMMITTED, 1)
  field(:ACK_STATUS_FAILED, 2)
end

defmodule Chat.V1.CallEventType do
  @moduledoc false
  use Protobuf, enum: true, protoc_gen_elixir_version: "0.17.0", syntax: :proto3

  field(:CALL_EVENT_TYPE_UNSPECIFIED, 0)
  field(:CALL_EVENT_TYPE_JOIN, 1)
  field(:CALL_EVENT_TYPE_LEAVE, 2)
  field(:CALL_EVENT_TYPE_OFFER, 3)
  field(:CALL_EVENT_TYPE_ANSWER, 4)
  field(:CALL_EVENT_TYPE_ICE, 5)
  field(:CALL_EVENT_TYPE_MEDIA, 6)
end

defmodule Chat.V1.User do
  @moduledoc false
  use Protobuf, protoc_gen_elixir_version: "0.17.0", syntax: :proto3

  field(:id, 1, type: :string)
  field(:display_name, 2, type: :string)
  field(:avatar_color, 3, type: :string)
  field(:locale, 4, type: :string)
  field(:presence, 5, type: Chat.V1.PresenceStatus, enum: true)
  field(:avatar_url, 6, type: :string)
  field(:bio, 7, type: :string)
  field(:pronouns, 8, type: :string)
  field(:banner_url, 9, type: :string)
  field(:banner_color, 10, type: :string)
  field(:created_at, 11, type: :string)
end

defmodule Chat.V1.GuildMember do
  @moduledoc false
  use Protobuf, protoc_gen_elixir_version: "0.17.0", syntax: :proto3

  field(:user_id, 1, type: :string)
  field(:display_name, 2, type: :string)
  field(:avatar_color, 3, type: :string)
  field(:presence, 4, type: Chat.V1.PresenceStatus, enum: true)
  field(:role, 5, type: :string)
  field(:avatar_url, 6, type: :string)
  field(:bio, 7, type: :string)
  field(:pronouns, 8, type: :string)
  field(:banner_url, 9, type: :string)
  field(:banner_color, 10, type: :string)
  field(:created_at, 11, type: :string)
end

defmodule Chat.V1.Channel do
  @moduledoc false
  use Protobuf, protoc_gen_elixir_version: "0.17.0", syntax: :proto3

  field(:id, 1, type: :string)
  field(:guild_id, 2, type: :string)
  field(:name, 3, type: :string)
  field(:topic, 4, type: :string)
  field(:kind, 5, type: Chat.V1.ChannelKind, enum: true)
  field(:position, 6, type: :int32)
end

defmodule Chat.V1.Guild do
  @moduledoc false
  use Protobuf, protoc_gen_elixir_version: "0.17.0", syntax: :proto3

  field(:id, 1, type: :string)
  field(:name, 2, type: :string)
  field(:icon_color, 3, type: :string)
  field(:channels, 4, repeated: true, type: Chat.V1.Channel)
  field(:members, 5, repeated: true, type: Chat.V1.GuildMember)
  field(:current_user_role, 6, type: :string)
end

defmodule Chat.V1.Authenticate do
  @moduledoc false
  use Protobuf, protoc_gen_elixir_version: "0.17.0", syntax: :proto3

  field(:token, 1, type: :string)
  field(:client_version, 2, type: :string)
end

defmodule Chat.V1.Authenticated do
  @moduledoc false
  use Protobuf, protoc_gen_elixir_version: "0.17.0", syntax: :proto3

  field(:user, 1, type: Chat.V1.User)
  field(:guilds, 2, repeated: true, type: Chat.V1.Guild)
  field(:session_id, 3, type: :string)
end

defmodule Chat.V1.Subscribe do
  @moduledoc false
  use Protobuf, protoc_gen_elixir_version: "0.17.0", syntax: :proto3

  field(:channel_ids, 1, repeated: true, type: :string)
end

defmodule Chat.V1.Unsubscribe do
  @moduledoc false
  use Protobuf, protoc_gen_elixir_version: "0.17.0", syntax: :proto3

  field(:channel_ids, 1, repeated: true, type: :string)
end

defmodule Chat.V1.SendMessage do
  @moduledoc false
  use Protobuf, protoc_gen_elixir_version: "0.17.0", syntax: :proto3

  field(:channel_id, 1, type: :string)
  field(:content, 2, type: :string)
  field(:attachments, 3, repeated: true, type: :string)
  field(:client_id, 4, type: :string)
end

defmodule Chat.V1.Heartbeat do
  @moduledoc false
  use Protobuf, protoc_gen_elixir_version: "0.17.0", syntax: :proto3

  field(:status, 1, type: Chat.V1.PresenceStatus, enum: true)
end

defmodule Chat.V1.SetPresence do
  @moduledoc false
  use Protobuf, protoc_gen_elixir_version: "0.17.0", syntax: :proto3

  field(:status, 1, type: Chat.V1.PresenceStatus, enum: true)
end

defmodule Chat.V1.Typing do
  @moduledoc false
  use Protobuf, protoc_gen_elixir_version: "0.17.0", syntax: :proto3

  field(:channel_id, 1, type: :string)
  field(:active, 2, type: :bool)
end

defmodule Chat.V1.ChatMessage do
  @moduledoc false
  use Protobuf, protoc_gen_elixir_version: "0.17.0", syntax: :proto3

  field(:id, 1, type: :int64)
  field(:channel_id, 2, type: :string)
  field(:guild_id, 3, type: :string)
  field(:author_id, 4, type: :string)
  field(:author_name, 5, type: :string)
  field(:author_color, 6, type: :string)
  field(:content, 7, type: :string)
  field(:attachments, 8, repeated: true, type: :string)
  field(:timestamp_ms, 9, type: :int64)
  field(:client_id, 10, type: :string)
  field(:author_avatar_url, 11, type: :string)
end

defmodule Chat.V1.CallParticipant do
  @moduledoc false
  use Protobuf, protoc_gen_elixir_version: "0.17.0", syntax: :proto3

  field(:session_id, 1, type: :string)
  field(:user_id, 2, type: :string)
  field(:display_name, 3, type: :string)
  field(:avatar_url, 4, type: :string)
  field(:avatar_color, 5, type: :string)
  field(:video, 6, type: :bool)
  field(:muted, 7, type: :bool)
  field(:deafened, 8, type: :bool)
  field(:screen_sharing, 9, type: :bool)
end

defmodule Chat.V1.CallSnapshot do
  @moduledoc false
  use Protobuf, protoc_gen_elixir_version: "0.17.0", syntax: :proto3

  field(:channel_id, 1, type: :string)
  field(:self_session_id, 2, type: :string)
  field(:participants, 3, repeated: true, type: Chat.V1.CallParticipant)
end

defmodule Chat.V1.CallEvent do
  @moduledoc false
  use Protobuf, protoc_gen_elixir_version: "0.17.0", syntax: :proto3

  field(:channel_id, 1, type: :string)
  field(:from_session_id, 2, type: :string)
  field(:from_user_id, 3, type: :string)
  field(:from_display_name, 4, type: :string)
  field(:from_avatar_url, 5, type: :string)
  field(:from_avatar_color, 6, type: :string)
  field(:target_session_id, 7, type: :string)
  field(:type, 8, type: Chat.V1.CallEventType, enum: true)
  field(:sdp, 9, type: :string)
  field(:candidate, 10, type: :string)
  field(:video, 11, type: :bool)
  field(:muted, 12, type: :bool)
  field(:deafened, 13, type: :bool)
  field(:screen_sharing, 14, type: :bool)
end

defmodule Chat.V1.JoinCall do
  @moduledoc false
  use Protobuf, protoc_gen_elixir_version: "0.17.0", syntax: :proto3

  field(:channel_id, 1, type: :string)
  field(:video, 2, type: :bool)
  field(:muted, 3, type: :bool)
  field(:deafened, 4, type: :bool)
end

defmodule Chat.V1.LeaveCall do
  @moduledoc false
  use Protobuf, protoc_gen_elixir_version: "0.17.0", syntax: :proto3

  field(:channel_id, 1, type: :string)
end

defmodule Chat.V1.CallSignal do
  @moduledoc false
  use Protobuf, protoc_gen_elixir_version: "0.17.0", syntax: :proto3

  field(:channel_id, 1, type: :string)
  field(:target_session_id, 2, type: :string)
  field(:type, 3, type: Chat.V1.CallEventType, enum: true)
  field(:sdp, 4, type: :string)
  field(:candidate, 5, type: :string)
end

defmodule Chat.V1.CallMedia do
  @moduledoc false
  use Protobuf, protoc_gen_elixir_version: "0.17.0", syntax: :proto3

  field(:channel_id, 1, type: :string)
  field(:video, 2, type: :bool)
  field(:muted, 3, type: :bool)
  field(:deafened, 4, type: :bool)
  field(:screen_sharing, 5, type: :bool)
end

defmodule Chat.V1.MessageAck do
  @moduledoc false
  use Protobuf, protoc_gen_elixir_version: "0.17.0", syntax: :proto3

  field(:channel_id, 1, type: :string)
  field(:client_id, 2, type: :string)
  field(:message_id, 3, type: :int64)
  field(:status, 4, type: Chat.V1.AckStatus, enum: true)
  field(:timestamp_ms, 5, type: :int64)
  field(:error, 6, type: :string)
  field(:retryable, 7, type: :bool)
end

defmodule Chat.V1.PresenceEvent do
  @moduledoc false
  use Protobuf, protoc_gen_elixir_version: "0.17.0", syntax: :proto3

  field(:guild_id, 1, type: :string)
  field(:user_id, 2, type: :string)
  field(:status, 3, type: Chat.V1.PresenceStatus, enum: true)
  field(:updated_at_ms, 4, type: :int64)
end

defmodule Chat.V1.PresenceSnapshot do
  @moduledoc false
  use Protobuf, protoc_gen_elixir_version: "0.17.0", syntax: :proto3

  field(:statuses, 1, repeated: true, type: Chat.V1.PresenceEvent)
end

defmodule Chat.V1.TypingEvent do
  @moduledoc false
  use Protobuf, protoc_gen_elixir_version: "0.17.0", syntax: :proto3

  field(:channel_id, 1, type: :string)
  field(:user_id, 2, type: :string)
  field(:display_name, 3, type: :string)
  field(:active, 4, type: :bool)
end

defmodule Chat.V1.ServerError do
  @moduledoc false
  use Protobuf, protoc_gen_elixir_version: "0.17.0", syntax: :proto3

  field(:code, 1, type: :string)
  field(:message, 2, type: :string)
  field(:retryable, 3, type: :bool)
end

defmodule Chat.V1.Pong do
  @moduledoc false
  use Protobuf, protoc_gen_elixir_version: "0.17.0", syntax: :proto3

  field(:server_time_ms, 1, type: :int64)
  field(:status, 2, type: Chat.V1.PresenceStatus, enum: true)
end

defmodule Chat.V1.ClientFrame do
  @moduledoc false
  use Protobuf, protoc_gen_elixir_version: "0.17.0", syntax: :proto3

  oneof(:payload, 0)

  field(:request_id, 1, type: :string)
  field(:authenticate, 2, type: Chat.V1.Authenticate, oneof: 0)
  field(:subscribe, 3, type: Chat.V1.Subscribe, oneof: 0)
  field(:unsubscribe, 4, type: Chat.V1.Unsubscribe, oneof: 0)
  field(:send_message, 5, type: Chat.V1.SendMessage, oneof: 0)
  field(:heartbeat, 6, type: Chat.V1.Heartbeat, oneof: 0)
  field(:set_presence, 7, type: Chat.V1.SetPresence, oneof: 0)
  field(:typing, 8, type: Chat.V1.Typing, oneof: 0)
  field(:join_call, 9, type: Chat.V1.JoinCall, oneof: 0)
  field(:leave_call, 10, type: Chat.V1.LeaveCall, oneof: 0)
  field(:call_signal, 11, type: Chat.V1.CallSignal, oneof: 0)
  field(:call_media, 12, type: Chat.V1.CallMedia, oneof: 0)
end

defmodule Chat.V1.ServerFrame do
  @moduledoc false
  use Protobuf, protoc_gen_elixir_version: "0.17.0", syntax: :proto3

  oneof(:payload, 0)

  field(:request_id, 1, type: :string)
  field(:authenticated, 2, type: Chat.V1.Authenticated, oneof: 0)
  field(:message, 3, type: Chat.V1.ChatMessage, oneof: 0)
  field(:ack, 4, type: Chat.V1.MessageAck, oneof: 0)
  field(:presence, 5, type: Chat.V1.PresenceEvent, oneof: 0)
  field(:presence_snapshot, 6, type: Chat.V1.PresenceSnapshot, oneof: 0)
  field(:error, 7, type: Chat.V1.ServerError, oneof: 0)
  field(:pong, 8, type: Chat.V1.Pong, oneof: 0)
  field(:typing, 9, type: Chat.V1.TypingEvent, oneof: 0)
  field(:call_snapshot, 10, type: Chat.V1.CallSnapshot, oneof: 0)
  field(:call_event, 11, type: Chat.V1.CallEvent, oneof: 0)
end
