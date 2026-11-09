# Architecture

Rustle deliberately separates four concerns:

1. **Connection state and fan-out** live on the BEAM.
2. **Durable message history** lives in ScyllaDB.
3. **Coordination signals** live in NATS JetStream (messages) and core NATS (presence/typing).
4. **Cold paths** (authentication, metadata, history reads) live in a conventional HTTP API and a coalescing Rust gRPC read service.

## Runtime topology

```
                          ┌────────────────────────────┐
   browser ──WebSocket──▶ │ Elixir gateway node A      │
     (protobuf)           │  Cowboy, 1 process/socket  │
                          └───────┬─────────┬──────────┘
                                  │         │
                                  │         ├── Xandra ──▶ ScyllaDB (writes)
                                  │         │
                                  │         ├── JetStream publish `CHAT`
                                  │         │        └── `guild.<gid>.channel.<cid>`
                                  │         │
                                  │         └── KeyDB presence keys / session sets
                                  │                    ▲
                                  │                    └── Redix.PubSub expiry events
                                  │
                                  └── NATS core presence/typing fan-out
                                  ▲
                                  │ durable pull consumer (per node)
                               NATS JetStream
                                  ▲
                                  │ durable pull consumer (per node)
                          ┌───────┴─────────┐
   browser ──WebSocket──▶ │ Elixir gateway  │
     (protobuf)           │ node B          │
                          └─────────────────┘

   browser ──HTTP──────▶ Fastify API ──SQL──▶ PostgreSQL
                             │
                             └──gRPC──▶ Rust read shield ──CQL reads──▶ ScyllaDB
```

The gateway and API share an HMAC JWT secret, but the API is the only service that issues tokens. The gateway calls the API over an internal HTTP service token to load the authorization snapshot used for guild/channel membership.

## Why each process boundary exists

### Gateway: one process per socket

The Cowboy handler process owns the socket state for exactly one connection: authentication state, rate-limit tokens, subscriptions, heartbeat timer and pending responses. A malformed frame, Scylla error or handler bug can terminate that one process without touching any other socket. The connection registry monitors each process and cleans ETS entries on `DOWN`.

The registry is intentionally local-only. Cross-node delivery is NATS' job; the gateway does not gossip connection routes.

### NATS JetStream: durable fan-out, not a queue group

Each gateway node has its own **durable pull consumer** on the `CHAT` stream (`gateway-1`, `gateway-2`, …). A queue group would distribute each message to only one gateway, which is wrong: every node needs every message so it can route to its own local subscribers. Each consumer acknowledges only after enqueueing the frame into local socket mailboxes.

Subjects:

| Subject | Transport | Purpose |
| --- | --- | --- |
| `guild.<guild_id>.channel.<channel_id>` | JetStream `CHAT` stream | Durable chat message fan-out. |
| `presence.guild.<guild_id>.user.<user_id>` | Core NATS | Ephemeral presence transitions and snapshots. |
| `typing.channel.<channel_id>` | Core NATS | Ephemeral typing indicator events. |
| `call.channel.<channel_id>` | Core NATS | Ephemeral call roster, media flags and targeted SDP/ICE signals; filtered locally to joined call subscribers. |

`CHAT` is configured in code (`Gateway.Broker`) with:
- file storage;
- 7-day max age;
- 512 MiB max bytes;
- discard old;
- one replica locally (set `num_replicas` higher in a clustered NATS deployment);
- per-node durable consumers with `max_ack_pending: 512`, `max_batch: 64`, explicit ack, `deliver_policy: new`.

Backpressure is layered:

1. The server consumer stops delivery after 512 unacknowledged messages.
2. The pull consumer fetches at most 32 messages per batch and works through them in order.
3. The gateway closes a websocket whose mailbox exceeds 250 messages; it can reconnect and read history.

### ScyllaDB: writes on the gateway, reads through the shield

The gateway writes to Scylla itself because it must not acknowledge a message until it has a durable row and an authoritative id. The API never writes messages. Reads go through the Rust shield, preserving the required API → shield → Scylla separation.

Write consistency is `QUORUM` against the required RF=3 keyspace. The local three-node Compose cluster represents one `us-east` data center.

### KeyDB: expiry is the offline mechanism

Presence writes use:
- `presence:<user_id>` — a string status with `EX 45`;
- `presence:sessions:<user_id>` — a set of connection session ids with `EX 45`.

Each heartbeat refreshes both with the same TTL. This avoids explicit deletion jobs. KeyDB is configured with `KEx` keyspace notifications; `Redix.PubSub` subscribes to `__keyevent@0__:expired` inside the gateway. On expiry, the gateway re-checks `presence:<user_id>` to suppress a race with a concurrent heartbeat, then publishes Offline on the guild's presence subject.

Last-session disconnect goes through the faster path: `SREM`, `SCARD`, then `DEL` and Offline publish if no sessions remain.

### Calls and profiles

Calls use a separate ephemeral path from chat:

- each voice-call participant has `call:<channel_id>:session:<session_id>` in KeyDB with a 45s TTL and a JSON value containing identity + media flags;
- `call:<channel_id>:sessions` indexes the roster; the gateway refreshes it on presence heartbeats and KeyDB key-expiry removes silent participants;
- join/leave/media and targeted SDP/ICE messages use core NATS subject `call.channel.<channel_id>`;
- every gateway keeps a local ETS call-subscriber set, so a signal is only delivered to sockets that joined that call and, for a targeted signal, only to the matching session;
- WebRTC media is peer-to-peer. There is no SFU/TURN in the repo; STUN is configured by default and TURN is a build setting.

Profiles are PostgreSQL data. `PATCH /api/me/profile` validates a local `/uploads` image URL and updates name, pronouns, bio, colors and locale; the response reissues the JWT and the browser refreshes its gateway session. Avatar/banner files are ordinary uploads served by the API. Other connected users see profile changes after their next bootstrap because there is no profile event stream yet.

### Rust read shield: latency collapse for hot reads

Hot-channel first pages produce identical CQL queries from many clients at once. The shield maps a query key `(channel_id, before_message_id, limit)` to one in-flight `broadcast` result. All concurrent callers receive the same `HistoryPage`; a `Drop` guard removes the in-flight entry even if the leader future is dropped. The wait and upstream query are both deadline-bounded.

The shield is stateless apart from that in-flight map. It can be horizontally scaled; each instance coalesces its own concurrent calls.

### PostgreSQL: source of truth for identity and metadata

Users, password hashes, guilds, memberships, channels and billing configuration live in PostgreSQL. API startup runs idempotent, advisory-locked migrations and optionally seeds the demo account.

The gateway never connects to PostgreSQL. It fetches the user's guild/channel/member snapshot from the API's internal session endpoint at authentication time. That keeps metadata authorization in one service and avoids a second SQL authorization path.

## Authorization model

- JWT subject is a PostgreSQL user UUID.
- The gateway verifies signature, algorithm allowlist, expiry and UUID subject, then fetches the API's session snapshot.
- A channel id is accepted for subscribe/send only if it appears in the authenticated snapshot.
- Voice channels are rejected for message writes.
- API route access is based on `guild_members.role`:
  - `owner`: billing changes, invites, channel management.
  - `admin`: invites and channel management.
  - `member`: read channels and post messages.
- Uploads are authenticated; files are served under an unguessable random path. That is intentionally not authenticated media delivery (see README limitation).

## Message write path in detail

```
client              gateway                    KeyDB              Scylla              NATS
  | SendMessage       |                          |                   |                  |
  |------------------>| validate membership     |                   |                  |
  |                   | reserve dedupe NX EX 24h |                   |                  |
  |                   |------------------------->|                   |                  |
  |                   | generate Snowflake      |                   |                  |
  |                   | bucket = floor(ts/10d)  |                   |                  |
  |                   | INSERT row, quorum      |                   |                  |
  |                   |--------------------------------------------->|                  |
  |                   | publish bytes           |                   |                  |
  |                   |--------------------------------------------------------------->|
  |   ACK COMMITTED   |                          |                   |                  |
  |<------------------|                          |                   |                  |
  |                   |                          |    JetStream consumer per gateway → local sockets
```

The client can observe the committed message twice: as an ack and as a fanned-out `ChatMessage` carrying the same `clientId`. The SPA treats both idempotently and replaces the pending row.

If the KeyDB reservation exists, a retry uses the original message id and republishes, so the ack can recover from a lost response. If the Scylla insert fails, the reservation is released.

### Failure behavior

| Failure | Behavior |
| --- | --- |
| KeyDB unavailable | Send fails with a retryable `FAILED` ack; presence heartbeat returns a retryable error. No message is written. |
| Scylla write fails | Dedupe key released; retryable `FAILED` ack. |
| NATS publish fails after write | Message is committed and acknowledged; local fallback fan-out runs; remote nodes see it on history reload (outbox limitation). |
| Gateway socket process crashes | Only that connection dies. Presence falls back to the 45s TTL if terminate/registry cleanup cannot run. |
| Gateway node crashes | Its durable JetStream consumer resumes from the last ack. Local clients reconnect; the UI backfills the active channel. |
| Slow client | Mailbox cap closes the connection instead of consuming unbounded memory. |
| Duplicate/retried send | KeyDB idempotency returns the original Snowflake; duplicate fan-out is deduped by id in the SPA. |

## History read path

```
GET /api/channels/:id/messages?before=<decimal snowflake>&limit=50
  → API verifies guild membership
  → decimal → 8-byte big-endian cursor
  → gRPC GetHistory(channel_id, before_message_id, limit)
  → coalescer (same key)
  → start bucket = floor(cursor_timestamp / 10d)
  → SELECT ... WHERE channel_id=? AND bucket_day=? AND message_id < ? ORDER BY message_id DESC LIMIT ?
  → if fewer than limit+1, bucket_day -= 10d, query older partitions (no cursor)
  → newest-first rows + next_cursor
  → API reverses to oldest-first and returns JSON
```

No offset or page cursor exists anywhere in the path. `nextCursor` is the oldest returned message id. The UI loads older pages when the user scrolls near the top.

### Bucket walk termination

The shield is capped by `MAX_BUCKET_LOOKBACK` (default 1000 partitions, ~27 years). The exact required schema provides no channel-bucket index; adding one would remove the cold-start bound. This is called out in the README limitations.

## Frontend state model

- `useChatStore` is Zustand + Immer. The socket client calls `enqueueMessage`/`reconcileAck` directly; it never dispatches through React context.
- Incoming chat events accumulate in `incomingBuffer`. The socket runs a 60ms metered interval that calls `flushIncoming`, sorts only touched channels, replaces pending rows by `clientId`, deduplicates by authoritative id, and updates unread counters in one React state commit.
- Messages are sorted by `(timestamp_ms, Decimal(Snowflake))`, not arrival order. Pending optimistic rows sit at the send timestamp.
- History merges are idempotent by message id, so a late history page, live fan-out and ack can all race safely.
- The virtualizer uses dynamic measurement and keyset pagination; older page prepends restore `scrollTop` by the measured height delta.

## Scaling notes

- **Gateways**: assign a unique `GATEWAY_NODE_ID` and stable node name. Each node's durable consumer is independent; all nodes see all messages. This is intentionally a fan-out workload, so broker egress scales with node count, not just clients.
- **Shield**: stateless; scale behind a gRPC load balancer. Coalescing is per instance.
- **API**: stateless except for local uploads; for multiple instances use shared/object storage and a gRPC load balancer.
- **ScyllaDB**: RF 3 in one DC locally; production should use actual racks, `NetworkTopologyStrategy` per data center, repair, monitoring and a capacity plan. Write path uses quorum; tune read consistency separately.
- **KeyDB**: session/presence keys are ephemeral. A KeyDB primary/replica deployment requires client failover or a cluster-aware client; current gateway uses a single Redix URL.
- **NATS**: local stream has one replica. Production should run a 3-node JetStream cluster and set stream replicas to 3.
- **PostgreSQL**: add read replicas if metadata reads dominate; use a managed HA setup and migration job.
