defmodule Gateway.MixProject do
  use Mix.Project

  def project do
    [
      app: :gateway,
      version: "0.1.0",
      elixir: "~> 1.17",
      elixirc_paths: elixirc_paths(Mix.env()),
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  def application do
    [
      extra_applications: [:logger, :crypto, :inets, :ssl],
      mod: {Gateway.Application, []}
    ]
  end

  defp elixirc_paths(:test), do: ["lib", "test/support"]
  defp elixirc_paths(_), do: ["lib"]

  defp deps do
    [
      {:cowboy, "~> 2.13"},
      {:jason, "~> 1.4"},
      {:gnat, "~> 1.18"},
      {:redix, "~> 1.6"},
      {:xandra, "~> 0.20"},
      {:decimal, "~> 2.3"},
      {:protobuf, "~> 0.17"},
      {:telemetry, "~> 1.3"},
      {:mox, "~> 1.2", only: :test}
    ]
  end
end
