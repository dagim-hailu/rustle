import { apiUrl } from "../lib/api";
import type { ChannelEvent } from "../types";

/**
 * Live community events (reactions, edits, deletes, replies, pins).
 *
 * Message *creation* still travels over the binary gateway WebSocket. These
 * events are API-owned metadata, so they arrive over a Server-Sent Events
 * stream. We read it with `fetch` + a stream reader rather than `EventSource`
 * because `EventSource` cannot attach the `Authorization` header.
 */
const MAX_BACKOFF_MS = 15_000;

export class ChannelEventStream {
  private controller: AbortController | null = null;
  private token: string | null = null;
  private channelId: string | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private attempt = 0;
  private stopped = true;

  constructor(private readonly onEvent: (event: ChannelEvent) => void) {}

  open(token: string, channelId: string): void {
    if (this.token === token && this.channelId === channelId && this.controller) return;
    this.closeInternal();
    this.token = token;
    this.channelId = channelId;
    this.stopped = false;
    this.attempt = 0;
    void this.connect();
  }

  /** Call when the socket/session is torn down. */
  stop(): void {
    this.closeInternal();
    this.stopped = true;
    this.token = null;
    this.channelId = null;
  }

  private closeInternal(): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    if (this.controller) this.controller.abort();
    this.controller = null;
  }

  private async connect(): Promise<void> {
    if (this.stopped || !this.token || !this.channelId) return;

    const controller = new AbortController();
    this.controller = controller;

    try {
      const response = await fetch(
        apiUrl(`/api/channels/${encodeURIComponent(this.channelId)}/events`),
        {
          headers: { Authorization: `Bearer ${this.token}`, Accept: "text/event-stream" },
          signal: controller.signal
        }
      );
      if (!response.ok || !response.body) throw new Error(`stream status ${response.status}`);

      this.attempt = 0;
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let boundary = buffer.indexOf("\n\n");
        while (boundary >= 0) {
          this.handleBlock(buffer.slice(0, boundary));
          buffer = buffer.slice(boundary + 2);
          boundary = buffer.indexOf("\n\n");
        }
      }
    } catch {
      // Aborted or dropped - fall through to reconnect below.
    } finally {
      if (this.controller === controller) this.controller = null;
    }

    if (!this.stopped) this.scheduleReconnect();
  }

  private handleBlock(block: string): void {
    const dataLines = block
      .split("\n")
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trim());
    if (dataLines.length === 0) return;

    try {
      const parsed = JSON.parse(dataLines.join("\n")) as ChannelEvent | { type: "ready" };
      if (parsed.type === "ready") return;
      this.onEvent(parsed as ChannelEvent);
    } catch {
      // ignore malformed frames
    }
  }

  private scheduleReconnect(): void {
    if (this.stopped || this.timer) return;
    this.attempt += 1;
    const base = Math.min(1_000 * 2 ** (this.attempt - 1), MAX_BACKOFF_MS);
    const delay = base + Math.random() * 500;
    this.timer = setTimeout(() => {
      this.timer = null;
      void this.connect();
    }, delay);
  }
}
