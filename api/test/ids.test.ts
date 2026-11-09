import { describe, expect, it } from "vitest";
import {
  bytesToSnowflake,
  bytesToUuid,
  parseCursor,
  snowflakeTimestampMs,
  snowflakeToBytes,
  uuidToBytes
} from "../src/ids.js";

describe("identifier boundaries", () => {
  it("round-trips UUIDs through 16-byte Scylla blobs", () => {
    const uuid = "ef2f66a9-e2b3-49cc-a5de-d8d0dc316bb8";
    expect(bytesToUuid(uuidToBytes(uuid))).toBe(uuid);
    expect(uuidToBytes(uuid)).toHaveLength(16);
  });

  it("round-trips 64-bit Snowflake cursors without JS number loss", () => {
    const id = 9_000_000_000_000_123n;
    const bytes = snowflakeToBytes(id);
    expect(bytes).toHaveLength(8);
    expect(bytesToSnowflake(bytes)).toBe(id.toString());
    expect(snowflakeTimestampMs(id)).toBeGreaterThan(1_704_067_200_000);
  });

  it("rejects offset-like and malformed cursors", () => {
    expect(parseCursor("42")).toBe(42n);
    expect(parseCursor("0")).toBeNull();
    expect(parseCursor("-1")).toBeNull();
    expect(parseCursor("1e3")).toBeNull();
    expect(parseCursor("not-a-cursor")).toBeNull();
  });
});
