export const SNOWFLAKE_EPOCH_MS = 1_704_067_200_000;
const WORKER_BITS = 10n;
const SEQUENCE_BITS = 12n;
const MAX_SEQUENCE = (1n << SEQUENCE_BITS) - 1n;

// A browser-local worker id is enough for an optimistic id that never leaves
// the client. The authoritative id always comes from the Elixir gateway.
const workerId = BigInt(Math.floor(Math.random() * 1024));
let sequence = 0n;
let lastMs = 0;

export function nextLocalSnowflake(now = Date.now()): string {
  if (now === lastMs) {
    sequence = (sequence + 1n) & MAX_SEQUENCE;
    if (sequence === 0n) {
      // Extremely unlikely: wait for the next millisecond.
      while (Date.now() <= lastMs) {
        // Busy wait only on sequence exhaustion.
      }
      now = Date.now();
    }
  } else {
    sequence = 0n;
  }

  lastMs = now;
  const timestamp = BigInt(now - SNOWFLAKE_EPOCH_MS);
  const id = (timestamp << (WORKER_BITS + SEQUENCE_BITS)) | (workerId << SEQUENCE_BITS) | sequence;
  return id.toString();
}

export function timestampFromSnowflake(id: string): number {
  return Number(BigInt(id) >> 22n) + SNOWFLAKE_EPOCH_MS;
}

export function compareSnowflakes(a: string, b: string): number {
  const left = BigInt(a);
  const right = BigInt(b);
  return left === right ? 0 : left < right ? -1 : 1;
}
