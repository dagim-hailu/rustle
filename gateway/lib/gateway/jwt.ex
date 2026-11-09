defmodule Gateway.JWT do
  @moduledoc "Minimal, strict HS256 JWT verification for the gateway edge."

  require Logger

  @spec verify(String.t(), String.t()) :: {:ok, map()} | {:error, atom()}
  def verify(token, secret) when is_binary(token) and is_binary(secret) do
    with [header_b64, payload_b64, signature_b64] <- String.split(token, "."),
         {:ok, header_json} <- Base.url_decode64(header_b64, padding: false),
         {:ok, payload_json} <- Base.url_decode64(payload_b64, padding: false),
         {:ok, signature} <- Base.url_decode64(signature_b64, padding: false),
         {:ok, header} <- Jason.decode(header_json),
         true <- header["alg"] == "HS256",
         expected = :crypto.mac(:hmac, :sha256, secret, header_b64 <> "." <> payload_b64),
         true <- secure_compare(expected, signature),
         {:ok, claims} <- Jason.decode(payload_json),
         :ok <- validate_claims(claims) do
      {:ok, claims}
    else
      _ -> {:error, :invalid_token}
    end
  rescue
    _ -> {:error, :invalid_token}
  end

  def verify(_, _), do: {:error, :invalid_token}

  defp validate_claims(%{
         "sub" => sub,
         "exp" => exp,
         "iss" => "rustle-api",
         "aud" => "rustle-client"
       })
       when is_binary(sub) and is_integer(exp) do
    now = System.system_time(:second)

    cond do
      exp <= now -> {:error, :expired}
      Gateway.IDs.valid_uuid?(sub) -> :ok
      true -> {:error, :invalid_subject}
    end
  end

  defp validate_claims(_), do: {:error, :invalid_claims}

  defp secure_compare(a, b) when byte_size(a) == byte_size(b) do
    :crypto.hash_equals(a, b)
  end

  defp secure_compare(_, _), do: false
end
