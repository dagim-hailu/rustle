defmodule Gateway.Presence.Pub do
  @moduledoc false

  @callback publish(String.t(), binary()) :: :ok | {:error, term()}
end
