defmodule GatewayWeb.HealthHandler do
  @moduledoc false
  @behaviour :cowboy_handler

  @impl true
  def init(req, state) do
    body =
      Jason.encode!(%{
        status: "ok",
        service: "gateway",
        node_id: Application.get_env(:gateway, :gateway_node_id, 1),
        time: DateTime.utc_now() |> DateTime.to_iso8601()
      })

    req =
      :cowboy_req.reply(
        200,
        %{"content-type" => "application/json", "cache-control" => "no-store"},
        body,
        req
      )

    {:ok, req, state}
  end
end
