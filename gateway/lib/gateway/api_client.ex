defmodule Gateway.ApiClient do
  @moduledoc "Internal API calls used for session and membership authorization."
  require Logger

  @timeout 5_000

  @spec fetch_session(String.t()) :: {:ok, map()} | {:error, term()}
  def fetch_session(user_id) when is_binary(user_id) do
    get("/internal/session/#{user_id}")
  end

  @spec user_guilds(String.t()) :: {:ok, [String.t()]} | {:error, term()}
  def user_guilds(user_id) when is_binary(user_id) do
    case get("/internal/users/#{user_id}/guilds") do
      {:ok, %{"guildIds" => ids}} when is_list(ids) -> {:ok, ids}
      {:ok, _} -> {:error, :malformed_response}
      error -> error
    end
  end

  @spec healthy?() :: boolean()
  def healthy? do
    case get("/healthz") do
      {:ok, %{"status" => "ok"}} -> true
      _ -> false
    end
  end

  defp get(path) do
    base = Application.get_env(:gateway, :internal_api_url, "http://api:8080")
    token = Application.get_env(:gateway, :internal_api_token, "")
    url = String.to_charlist(String.trim_trailing(base, "/") <> path)
    headers = [{~c"x-internal-token", String.to_charlist(token)}]
    request = {url, headers}

    case :httpc.request(:get, request, [timeout: @timeout, connect_timeout: 2_000],
           body_format: :binary
         ) do
      {:ok, {{_, 200, _}, _headers, body}} ->
        Jason.decode(body)

      {:ok, {{_, status, _}, _headers, body}} ->
        Logger.warning("internal API returned #{status} for #{path}: #{inspect(body)}")
        {:error, {:http_status, status}}

      {:error, reason} ->
        Logger.warning("internal API request to #{path} failed: #{inspect(reason)}")
        {:error, reason}
    end
  end
end
