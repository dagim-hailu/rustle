import { describe, expect, it } from "vitest";
import {
  compareSnowflakes,
  nextLocalSnowflake,
  SNOWFLAKE_EPOCH_MS,
  timestampFromSnowflake
} from "./snowflake";

describe("client-side temporary Snowflakes", () => {
  it("are positive, increasing 64-bit values", () => {
    const a = nextLocalSnowflake(1_750_000_000_000);
    const b = nextLocalSnowflake(1_750_000_000_000);
    const c = nextLocalSnowflake(1_750_000_000_001);

    expect(BigInt(a)).toBeGreaterThan(0n);
    expect(BigInt(a)).toBeLessThan(1n << 63n);
    expect(compareSnowflakes(a, b)).toBe(-1);
    expect(compareSnowflakes(b, c)).toBe(-1);
  });

  it("encode a timestamp that the gateway can use for ordering", () => {
    const ts = 1_750_000_123_456;
    const id = nextLocalSnowflake(ts);
    expect(timestampFromSnowflake(id)).toBe(ts);
    expect(ts).toBeGreaterThan(SNOWFLAKE_EPOCH_MS);
  });
});
