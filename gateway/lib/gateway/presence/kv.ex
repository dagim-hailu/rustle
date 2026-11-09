defmodule Gateway.Presence.KV do
  @moduledoc "Persistence boundary for the KeyDB presence and session keys."

  @callback touch_session(String.t(), String.t(), pos_integer()) :: :ok | {:error, term()}
  @callback put_presence(String.t(), atom(), pos_integer()) ::
              {:ok, String.t() | nil} | {:error, term()}
  @callback get_presence(String.t()) :: {:ok, String.t() | nil} | {:error, term()}
  @callback get_presence_many([String.t()]) :: {:ok, [String.t() | nil]} | {:error, term()}
  @callback remove_session(String.t(), String.t()) :: {:ok, non_neg_integer()} | {:error, term()}
  @callback delete_presence(String.t()) :: {:ok, non_neg_integer()} | {:error, term()}
end
