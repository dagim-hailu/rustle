defmodule Gateway.Presence.NatsPub do
  @moduledoc false
  @behaviour Gateway.Presence.Pub

  @impl true
  def publish(subject, payload) do
    Gnat.pub(:gateway_presence_nats, subject, payload)
  catch
    kind, reason -> {:error, {kind, reason}}
  end
end
