const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function uuidToBytes(uuid: string): Buffer {
  if (!UUID_RE.test(uuid)) throw new Error("invalid uuid");
  return Buffer.from(uuid.replaceAll("-", ""), "hex");
}

export function bytesToUuid(bytes: Uint8Array): string {
  if (bytes.length !== 16) throw new Error("uuid must be 16 bytes");
  const hex = Buffer.from(bytes).toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function snowflakeToBytes(id: bigint): Buffer {
  if (id <= 0n || id >= 1n << 64n) throw new Error("snowflake out of range");
  const buffer = Buffer.alloc(8);
  buffer.writeBigUInt64BE(id);
  return buffer;
}

export function bytesToSnowflake(bytes: Uint8Array): string {
  if (bytes.length !== 8) throw new Error("snowflake must be 8 bytes");
  return Buffer.from(bytes).readBigUInt64BE().toString();
}

export function snowflakeTimestampMs(id: bigint): number {
  return Number(id >> 22n) + 1_704_067_200_000;
}

export function parseCursor(value: unknown): bigint | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string" || !/^\d{1,19}$/.test(value)) return null;
  const id = BigInt(value);
  if (id <= 0n || id >= 1n << 63n) return null;
  return id;
}
