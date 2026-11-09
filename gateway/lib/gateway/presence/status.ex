defmodule Gateway.Presence.Status do
  @moduledoc false

  @statuses %{
    online: {"online", :PRESENCE_STATUS_ONLINE},
    idle: {"idle", :PRESENCE_STATUS_IDLE},
    do_not_disturb: {"dnd", :PRESENCE_STATUS_DO_NOT_DISTURB},
    offline: {"offline", :PRESENCE_STATUS_OFFLINE}
  }

  def valid?(status), do: Map.has_key?(@statuses, status)

  def to_string(status) do
    case Map.fetch(@statuses, status) do
      {:ok, {value, _}} -> value
      :error -> "offline"
    end
  end

  def from_string("online"), do: :online
  def from_string("idle"), do: :idle
  def from_string("dnd"), do: :do_not_disturb
  def from_string("offline"), do: :offline
  def from_string(_), do: :offline

  def to_proto(status) do
    case Map.fetch(@statuses, status) do
      {:ok, {_, enum}} -> Chat.V1.PresenceStatus.value(enum)
      :error -> Chat.V1.PresenceStatus.value(:PRESENCE_STATUS_OFFLINE)
    end
  end
end
