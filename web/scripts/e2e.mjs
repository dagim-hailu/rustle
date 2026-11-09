import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { setTimeout as sleep } from "node:timers/promises";
import { once } from "node:events";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Long from "long";
import protobuf from "protobufjs";
import WebSocket from "ws";

const here = path.dirname(fileURLToPath(import.meta.url));
const protoPath = path.resolve(here, "..", "..", "proto", "chat.proto");

const API_URL = process.env.API_URL ?? "http://127.0.0.1:8080";
const WS_A = process.env.GATEWAY_A_URL ?? "ws://127.0.0.1:4000/ws";
const WS_B = process.env.GATEWAY_B_URL ?? "ws://127.0.0.1:4001/ws";
const KEYDB_HOST = process.env.KEYDB_HOST ?? "127.0.0.1";
const KEYDB_PORT = Number.parseInt(process.env.KEYDB_PORT ?? "6379", 10);
const KEYDB_PASSWORD = process.env.KEYDB_PASSWORD ?? "devkeydb";

protobuf.util.Long = Long;
protobuf.configure();

const root = protobuf.loadSync(protoPath);
const ClientFrame = root.lookupType("chat.v1.ClientFrame");
const ServerFrame = root.lookupType("chat.v1.ServerFrame");

function encode(payload) {
  const requestId = payload.requestId ?? randomUUID();
  const frame = ClientFrame.create({ requestId, ...payload });
  return { requestId, bytes: ClientFrame.encode(frame).finish() };
}

function decode(buffer) {
  const message = ServerFrame.decode(buffer);
  return ServerFrame.toObject(message, {
    longs: String,
    enums: String,
    oneofs: true,
    defaults: false
  });
}

async function api(pathname, { method = "GET", token, body } = {}) {
  const response = await fetch(`${API_URL}${pathname}`, {
    method,
    headers: {
      ...(body ? { "content-type": "application/json" } : {}),
      ...(token ? { authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(15_000)
  });

  const data = response.headers.get("content-type")?.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new Error(`${method} ${pathname} failed: ${response.status} ${JSON.stringify(data)}`);
  }

  return data;
}

async function keydbCommand(parts) {
  const socket = net.connect(KEYDB_PORT, KEYDB_HOST);
  await once(socket, "connect");
  let buffer = "";
  socket.on("data", (data) => {
    buffer += data.toString("utf8");
  });

  const write = (argumentsList) => {
    const encoded = argumentsList
      .map((part) => `$${Buffer.byteLength(part)}\r\n${part}\r\n`)
      .join("");
    socket.write(`*${argumentsList.length}\r\n${encoded}`);
  };

  write(["AUTH", KEYDB_PASSWORD]);
  await sleep(100);
  buffer = "";
  write(parts);
  await sleep(150);
  socket.end();
  return buffer;
}

class GatewayClient {
  constructor(url) {
    this.url = url;
    this.frames = [];
    this.waiters = new Set();
    this.ws = null;
  }

  async connect(token) {
    this.ws = new WebSocket(this.url);
    this.ws.binaryType = "arraybuffer";

    this.ws.on("message", (data) => {
      const frame = decode(Buffer.from(data));
      this.frames.push(frame);
      for (const waiter of this.waiters) {
        if (waiter.predicate(frame)) {
          this.waiters.delete(waiter);
          clearTimeout(waiter.timer);
          waiter.resolve(frame);
        }
      }
    });

    await once(this.ws, "open");
    const auth = encode({
      authenticate: { token, clientVersion: "e2e/1.0.0" }
    });
    this.ws.send(auth.bytes);

    const authenticated = await this.waitFor((frame) => Boolean(frame.authenticated), 8_000);
    const snapshot = await this.waitFor(
      (frame) => Boolean(frame.presenceSnapshot),
      8_000
    );

    return { authenticated, snapshot };
  }

  send(payload) {
    const result = encode(payload);
    this.ws.send(result.bytes);
    return result.requestId;
  }

  waitFor(predicate, timeoutMs = 8_000) {
    const existing = this.frames.find(predicate);
    if (existing) return Promise.resolve(existing);

    return new Promise((resolve, reject) => {
      const waiter = {
        predicate,
        resolve,
        timer: setTimeout(() => {
          this.waiters.delete(waiter);
          reject(new Error(`Timed out waiting for a gateway frame on ${this.url}`));
        }, timeoutMs)
      };
      this.waiters.add(waiter);
    });
  }

  close() {
    this.ws?.close(1000, "e2e complete");
  }
}

const suffix = `${Date.now()}-${Math.floor(Math.random() * 10_000)}`;
const password = "E2ePassword!123";
const emailA = `rustle-e2e-a-${suffix}@example.com`;
const emailB = `rustle-e2e-b-${suffix}@example.com`;

console.log("Rustle end-to-end check");
console.log(`  API: ${API_URL}`);
console.log(`  gateway A: ${WS_A}`);
console.log(`  gateway B: ${WS_B}`);

const registrationA = await api("/api/auth/register", {
  method: "POST",
  body: {
    email: emailA,
    password,
    displayName: "E2E Hanna",
    locale: "am"
  }
});
const registrationB = await api("/api/auth/register", {
  method: "POST",
  body: {
    email: emailB,
    password,
    displayName: "E2E Dawit",
    locale: "en"
  }
});

const bootstrapA = await api("/api/bootstrap", { token: registrationA.token });
assert.ok(bootstrapA.guilds.length > 0, "registration should create a starter guild");
const guild = bootstrapA.guilds[0];
const channel = guild.channels.find((entry) => entry.kind === "text");
const voice = guild.channels.find((entry) => entry.kind === "voice");
assert.ok(channel, "starter guild should have a text channel");
assert.ok(voice, "starter guild should have a voice channel");

await api(`/api/guilds/${guild.id}/members`, {
  method: "POST",
  token: registrationA.token,
  body: { email: emailB }
});

const bootstrapB = await api("/api/bootstrap", { token: registrationB.token });
assert.ok(
  bootstrapB.guilds.some((entry) => entry.id === guild.id),
  "invited user should see the shared guild"
);

const clientA = new GatewayClient(WS_A);
const clientB = new GatewayClient(WS_B);

try {
  await clientA.connect(registrationA.token);
  await clientB.connect(registrationB.token);

  const snapshotB = clientB.frames.find((frame) => frame.presenceSnapshot);
  assert.ok(snapshotB, "gateway B should send an initial presence snapshot");
  const hannaPresence = snapshotB.presenceSnapshot.statuses.find(
    (entry) => entry.userId === registrationA.user.id && entry.guildId === guild.id
  );
  assert.equal(
    hannaPresence?.status,
    "PRESENCE_STATUS_ONLINE",
    "gateway B should see gateway A's user as online"
  );

  clientA.send({ subscribe: { channelIds: [channel.id] } });
  clientB.send({ subscribe: { channelIds: [channel.id] } });
  await sleep(350);

  const content = "ሰላም ከጌትዌይ አንድ — hello from gateway one";
  const clientId = `${Date.now()}`;
  clientA.send({
    sendMessage: {
      channelId: channel.id,
      content,
      attachments: [],
      clientId
    }
  });

  const ack = await clientA.waitFor(
    (frame) =>
      frame.ack?.clientId === clientId &&
      frame.ack.status === "ACK_STATUS_COMMITTED",
    10_000
  );
  assert.ok(ack.ack.messageId, "gateway should return the authoritative Snowflake id");

  const delivered = await clientB.waitFor(
    (frame) => frame.message?.id === ack.ack.messageId,
    10_000
  );
  assert.equal(delivered.message.content, content);
  assert.equal(delivered.message.clientId, clientId);
  console.log("  ✓ cross-node fan-out and committed ack");

  const history = await api(
    `/api/channels/${channel.id}/messages?limit=50`,
    { token: registrationB.token }
  );
  assert.ok(
    history.messages.some((message) => message.id === ack.ack.messageId),
    "committed message should be readable from the Scylla-backed history API"
  );
  assert.equal(typeof history.nextCursor, "string");
  console.log("  ✓ history read through the Rust shield");

  clientA.send({
    joinCall: { channelId: voice.id, video: false, muted: false, deafened: false }
  });
  const callA = await clientA.waitFor((frame) => Boolean(frame.callSnapshot), 8_000);
  assert.equal(callA.callSnapshot.participants.length, 1);
  const sessionA = callA.callSnapshot.selfSessionId;

  clientB.send({
    joinCall: { channelId: voice.id, video: false, muted: false, deafened: false }
  });
  const callB = await clientB.waitFor((frame) => Boolean(frame.callSnapshot), 8_000);
  assert.equal(callB.callSnapshot.participants.length, 2);
  const sessionB = callB.callSnapshot.selfSessionId;
  assert.ok(callB.callSnapshot.participants.some((entry) => entry.sessionId === sessionA));

  await clientA.waitFor(
    (frame) =>
      frame.callEvent?.type === "CALL_EVENT_TYPE_JOIN" &&
      frame.callEvent.fromSessionId === sessionB,
    8_000
  );

  clientB.send({
    callSignal: {
      channelId: voice.id,
      targetSessionId: sessionA,
      type: 3,
      sdp: "e2e-offer"
    }
  });
  const offer = await clientA.waitFor(
    (frame) =>
      frame.callEvent?.type === "CALL_EVENT_TYPE_OFFER" &&
      frame.callEvent.fromSessionId === sessionB,
    8_000
  );
  assert.equal(offer.callEvent.targetSessionId, sessionA);

  clientA.send({
    callSignal: {
      channelId: voice.id,
      targetSessionId: sessionB,
      type: 4,
      sdp: "e2e-answer"
    }
  });
  await clientB.waitFor(
    (frame) =>
      frame.callEvent?.type === "CALL_EVENT_TYPE_ANSWER" &&
      frame.callEvent.fromSessionId === sessionA,
    8_000
  );

  clientB.send({ leaveCall: { channelId: voice.id } });
  await clientA.waitFor(
    (frame) =>
      frame.callEvent?.type === "CALL_EVENT_TYPE_LEAVE" &&
      frame.callEvent.fromSessionId === sessionB,
    8_000
  );
  console.log("  ✓ cross-gateway call roster, targeted offer/answer and leave");

  const expire = await keydbCommand([
    "EXPIRE",
    `presence:${registrationA.user.id}`,
    "2"
  ]);
  assert.match(expire, /:1/);

  const expired = await clientB.waitFor(
    (frame) =>
      frame.presence?.userId === registrationA.user.id &&
      frame.presence.status === "PRESENCE_STATUS_OFFLINE",
    15_000
  );
  assert.equal(expired.presence.status, "PRESENCE_STATUS_OFFLINE");
  console.log("  ✓ KeyDB TTL expiry publishes Offline without a deletion job");

  clientA.send({ heartbeat: { status: 1 } });
  await clientB.waitFor(
    (frame) =>
      frame.presence?.userId === registrationA.user.id &&
      frame.presence.status === "PRESENCE_STATUS_ONLINE",
    10_000
  );
  console.log("  ✓ heartbeat restores Online");

  clientA.send({ setPresence: { status: 3 } });
  await clientB.waitFor(
    (frame) =>
      frame.presence?.userId === registrationA.user.id &&
      frame.presence.status === "PRESENCE_STATUS_DO_NOT_DISTURB",
    10_000
  );
  console.log("  ✓ explicit DND transition");

  clientA.close();
  const offline = await clientB.waitFor(
    (frame) =>
      frame.presence?.userId === registrationA.user.id &&
      frame.presence.status === "PRESENCE_STATUS_OFFLINE",
    15_000
  );
  assert.equal(offline.presence.status, "PRESENCE_STATUS_OFFLINE");
  console.log("  ✓ explicit disconnect publishes Offline");

  console.log("E2E PASS");
} finally {
  clientA.close();
  clientB.close();
}
