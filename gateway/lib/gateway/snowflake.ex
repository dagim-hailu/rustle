defmodule Gateway.Snowflake do
  @moduledoc """
  A monotonic 64-bit Snowflake generator.

  Layout (signed-positive): 41-bit milliseconds since the shared custom epoch,
  10-bit worker id, 12-bit sequence. IDs sort chronologically and are encoded
  big-endian when stored in Scylla, so the same value doubles as a keyset cursor.
  """
  use GenServer
  import Bitwise

  @epoch_ms 1_704_067_200_000
  @worker_bits 10
  @sequence_bits 12
  @max_worker (1 <<< @worker_bits) - 1
  @max_sequence (1 <<< @sequence_bits) - 1

  def start_link(opts \\ []) do
    name = Keyword.get(opts, :name, __MODULE__)
    GenServer.start_link(__MODULE__, opts, name: name)
  end

  @spec next_id(GenServer.server()) :: integer()
  def next_id(server \\ __MODULE__), do: GenServer.call(server, :next, 5_000)

  @spec epoch_ms() :: integer()
  def epoch_ms, do: @epoch_ms

  @spec decode(integer()) :: %{timestamp_ms: integer(), worker_id: integer(), sequence: integer()}
  def decode(id) when is_integer(id) and id > 0 do
    %{
      timestamp_ms: (id >>> (@worker_bits + @sequence_bits)) + @epoch_ms,
      worker_id: id >>> @sequence_bits &&& @max_worker,
      sequence: id &&& @max_sequence
    }
  end

  @impl true
  def init(opts) do
    worker_id = Keyword.get(opts, :node_id, 1)

    unless is_integer(worker_id) and worker_id in 0..@max_worker do
      raise ArgumentError, "Snowflake node_id must be between 0 and #{@max_worker}"
    end

    {:ok, %{worker_id: worker_id, last_ms: -1, sequence: 0}}
  end

  @impl true
  def handle_call(:next, _from, state) do
    {id, state} = generate(state, System.system_time(:millisecond))
    {:reply, id, state}
  end

  defp generate(state, now_ms) when now_ms <= state.last_ms do
    next_ms = state.last_ms

    case state.sequence do
      sequence when sequence < @max_sequence ->
        id = compose(next_ms, state.worker_id, sequence + 1)
        {id, %{state | sequence: sequence + 1}}

      _ ->
        Process.sleep(1)
        generate(state, max(next_ms + 1, System.system_time(:millisecond)))
    end
  end

  defp generate(state, now_ms) do
    id = compose(now_ms, state.worker_id, 0)
    {id, %{state | last_ms: now_ms, sequence: 0}}
  end

  defp compose(now_ms, worker_id, sequence) do
    timestamp = now_ms - @epoch_ms
    timestamp <<< (@worker_bits + @sequence_bits) ||| worker_id <<< @sequence_bits ||| sequence
  end
end
