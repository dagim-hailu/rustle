import type { Pool, PoolClient } from "pg";

/**
 * Real-time channel events.
 *
 * Message *creation* flows through the Elixir gateway (binary WebSocket) and is
 * not touched here. Everything the community layer adds on top of a message -
 * reactions, edits, deletes, replies and pins - is metadata the API owns, so it
 * is fanned out over Server-Sent Events instead of the protobuf protocol.
 *
 * Fan-out across API instances rides on PostgreSQL LISTEN/NOTIFY, which the
 * deployment already runs. One dedicated connection LISTENs; every publish is a
 * `pg_notify` on the shared pool. No extra broker is introduced.
 */
export type ChannelEvent =
  | {
      type: "reaction";
      channelId: string;
      messageId: string;
      emoji: string;
      count: number;
      userId: string;
      added: boolean;
    }
  | { type: "edit"; channelId: string; messageId: string; content: string; editedAt: number }
  | { type: "delete"; channelId: string; messageId: string }
  | {
      type: "reply";
      channelId: string;
      messageId: string;
      replyTo: { id: string; authorName: string; content: string };
    }
  | { type: "pin"; channelId: string; messageId: string; pinned: boolean };

const NOTIFY_CHANNEL = "rustle_channel_events";

type Listener = (event: ChannelEvent) => void;

export class ChannelEventBus {
  private pool: Pool | null = null;
  private listener: PoolClient | null = null;
  private readonly listeners = new Map<string, Set<Listener>>();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private stopping = false;

  async start(pool: Pool): Promise<void> {
    this.pool = pool;
    this.stopping = false;
    await this.attach();
  }

  private async attach(): Promise<void> {
    if (!this.pool || this.stopping) return;
    try {
      const client = await this.pool.connect();
      this.listener = client;
      client.on("notification", (message) => {
        if (message.channel !== NOTIFY_CHANNEL || !message.payload) return;
        this.dispatch(message.payload);
      });
      client.on("error", () => this.recover(client));
      await client.query(`LISTEN ${NOTIFY_CHANNEL}`);
    } catch {
      this.scheduleReconnect();
    }
  }

  private recover(client: PoolClient): void {
    if (this.listener === client) this.listener = null;
    try {
      client.release(true);
    } catch {
      // connection is already gone
    }
    this.scheduleReconnect();
  }

  private scheduleReconnect(): void {
    if (this.stopping || this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      void this.attach();
    }, 1_000);
  }

  private dispatch(payload: string): void {
    let event: ChannelEvent;
    try {
      event = JSON.parse(payload) as ChannelEvent;
    } catch {
      return;
    }
    const set = this.listeners.get(event.channelId);
    if (!set) return;
    for (const listener of set) {
      try {
        listener(event);
      } catch {
        // a broken SSE client must not affect the others
      }
    }
  }

  subscribe(channelId: string, listener: Listener): () => void {
    const set = this.listeners.get(channelId) ?? new Set<Listener>();
    set.add(listener);
    this.listeners.set(channelId, set);
    return () => {
      const current = this.listeners.get(channelId);
      if (!current) return;
      current.delete(listener);
      if (current.size === 0) this.listeners.delete(channelId);
    };
  }

  async publish(event: ChannelEvent): Promise<void> {
    if (!this.pool) return;
    try {
      await this.pool.query("SELECT pg_notify($1, $2)", [NOTIFY_CHANNEL, JSON.stringify(event)]);
    } catch {
      // Fan-out is best effort; the HTTP response already succeeded.
    }
  }

  async stop(): Promise<void> {
    this.stopping = true;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = null;
    this.listeners.clear();
    const client = this.listener;
    this.listener = null;
    if (client) {
      try {
        await client.query(`UNLISTEN ${NOTIFY_CHANNEL}`);
      } catch {
        // ignore
      }
      client.removeAllListeners("notification");
      client.removeAllListeners("error");
      client.release(true);
    }
  }
}
