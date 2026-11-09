defmodule Gateway.JWTTest do
  use ExUnit.Case, async: true

  @secret "test-secret-that-is-at-least-32-bytes!!"
  @user_id "5f0c5d2e-0e32-4a8a-a7f4-80dbf71b3ad6"

  test "accepts a valid HS256 token" do
    token = token(%{"sub" => @user_id, "exp" => now() + 60})
    assert {:ok, claims} = Gateway.JWT.verify(token, @secret)
    assert claims["sub"] == @user_id
  end

  test "rejects tampering, expiry, wrong secrets, and wrong service claims" do
    token = token(%{"sub" => @user_id, "exp" => now() + 60})
    [header, payload, signature] = String.split(token, ".")
    tampered = Enum.join([header, payload <> "x", signature], ".")

    assert {:error, _} = Gateway.JWT.verify(tampered, @secret)
    assert {:error, _} = Gateway.JWT.verify(token, "another secret")

    assert {:error, _} =
             Gateway.JWT.verify(token(%{"sub" => @user_id, "exp" => now() - 1}), @secret)

    assert {:error, _} =
             Gateway.JWT.verify(
               token(%{"sub" => @user_id, "exp" => now() + 60, "aud" => "another-service"}),
               @secret
             )
  end

  defp token(claims) do
    claims = Map.merge(%{"iss" => "rustle-api", "aud" => "rustle-client"}, claims)
    header = Base.url_encode64(Jason.encode!(%{"alg" => "HS256", "typ" => "JWT"}), padding: false)
    payload = Base.url_encode64(Jason.encode!(claims), padding: false)
    signature = :crypto.mac(:hmac, :sha256, @secret, header <> "." <> payload)
    Enum.join([header, payload, Base.url_encode64(signature, padding: false)], ".")
  end

  defp now, do: System.system_time(:second)
end
