import {
  decodeServerFrame,
  encodeClientFrame,
  PRESENCE_TO_WIRE,
  wireToBootstrap,
  wireToPresence
} from "../lib/protocol";
import { nextLocalSnowflake, timestampFromSnowflake } from "../lib/snowflake";
import { api } from "../lib/api";
import { useAuthStore } from "../store/authStore";
import { FLUSH_INTERVAL_MS, useChatStore } from "../store/chatStore";
import type { ChatMessageView, PresenceStatus } from "../types";
import { ChannelEventStream } from "./channelEvents";

const SEND_TIMEOUT_MS = 12_000;
const AUTH_TIMEOUT_MS = 12_000;
const MAX_RECONNECT_DELAY_MS = 15_000;

export interface CallFrameHandler {
  onSnapshot: (snapshot: NonNullable<ReturnType<typeof decodeServerFrame>["callSnapshot"]>) => void;
  onEvent: (event: NonNullable<ReturnType<typeof decodeServerFrame>["callEvent"]>) => void;
  onDisconnected: () => void;
  onError: (code: string) => void;
}

function gatewayUrl(): string {
  const configured = import.meta.env.VITE_GATEWAY_URL?.trim();
  if (configured) return configured;
  const scheme = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${scheme}//${window.location.hostname}:4000/ws`;
}

class ChatSocket {
  private socket: WebSocket | null = null;
  private token: string | null = null;
  private manualClose = false;
  private reconnectAttempt = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private authTimer: ReturnType<typeof setTimeout> | null = null;
  private flushTimer: ReturnType<typeof setInterval> | null = null;
  private flushTicks = 0;
  private hasAuthenticated = false;
  private timeouts = new Map<string, ReturnType<typeof setTimeout>>();
  private pendingReplies = new Map<
    string,
    { replyToId: string; previewAuthor: string; previewContent: string }
  >();
  private networkListenersAttached = false;
  private callHandler: CallFrameHandler | null = null;
  private channelEvents = new ChannelEventStream((event) =>
    useChatStore.getState().applyChannelEvent(event)
  );

  setCallHandler(handler: CallFrameHandler | null): void {
    this.callHandler = handler;
  }

  /** Follow live community events (reactions, edits, replies, pins) for a channel. */
  openChannelEvents(channelId: string): void {
    if (!this.token) return;
    this.channelEvents.open(this.token, channelId);
  }

  closeChannelEvents(): void {
    this.channelEvents.stop();
  }

  refreshSession(token?: string): void {
    if (token) this.token = token;
    if (!this.token) return;
    this.callHandler?.onDisconnected();
    useChatStore.getState().failAllPending("SESSION_REFRESH");
    this.disconnectInternal(false);
    this.manualClose = false;
    this.hasAuthenticated = false;
    this.open();
  }

  connect(token: string): void {
    if (this.token === token && this.socket && this.socket.readyState <= WebSocket.OPEN) {
      return;
    }

    this.disconnectInternal(false);
    this.token = token;
    this.manualClose = false;
    this.attachNetworkListeners();
    this.open();
  }

  disconnect(): void {
    this.manualClose = true;
    this.closeChannelEvents();
    this.disconnectInternal(true);
    useChatStore.getState().setSocketStatus("disconnected");
    this.callHandler?.onDisconnected();
  }

  private disconnectInternal(clearToken: boolean): void {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.authTimer) clearTimeout(this.authTimer);
    this.stopFlushLoop();
    this.reconnectTimer = null;
    this.authTimer = null;

    if (this.socket) {
      this.socket.onopen = null;
      this.socket.onmessage = null;
      this.socket.onerror = null;
      this.socket.onclose = null;
      try {
        this.socket.close(1000, "client disconnect");
      } catch {
        // already closed
      }
    }

    this.socket = null;
    for (const timer of this.timeouts.values()) clearTimeout(timer);
    this.timeouts.clear();

    if (clearToken) {
      this.token = null;
      this.hasAuthenticated = false;
      this.channelEvents.stop();
    }
  }

  private open(): void {
    if (!this.token) return;

    useChatStore.getState().setSocketStatus(
      this.reconnectAttempt > 0 ? "reconnecting" : "connecting"
    );

    const socket = new WebSocket(gatewayUrl());
    socket.binaryType = "arraybuffer";
    this.socket = socket;

    socket.onopen = () => {
      if (this.socket !== socket) return;
      useChatStore.getState().setSocketStatus("authenticating");
      this.sendFrame({
        authenticate: {
          token: this.token ?? "",
          clientVersion: "web/0.1.0"
        }
      });
      this.authTimer = setTimeout(() => {
        if (useChatStore.getState().socketStatus !== "connected") {
          this.emitAuthExpired();
          socket.close(4002, "auth timeout");
        }
      }, AUTH_TIMEOUT_MS);
    };

    socket.onmessage = (event) => {
      if (this.socket !== socket) return;
      try {
        const frame = decodeServerFrame(event.data as ArrayBuffer);
        this.handleFrame(frame);
      } catch (error) {
        console.error("Could not decode a gateway frame", error);
      }
    };

    socket.onerror = () => {
      // onclose owns reconnection.
    };

    socket.onclose = () => {
      if (this.socket !== socket) return;
      this.socket = null;
      this.callHandler?.onDisconnected();
      if (this.authTimer) clearTimeout(this.authTimer);
      this.authTimer = null;
      this.stopFlushLoop();
      useChatStore.getState().flushIncoming();

      for (const timer of this.timeouts.values()) clearTimeout(timer);
      this.timeouts.clear();
      useChatStore.getState().failAllPending("CONNECTION_LOST");

      if (this.manualClose) {
        useChatStore.getState().setSocketStatus("disconnected");
        return;
      }

      useChatStore.getState().setSocketStatus("reconnecting");
      this.scheduleReconnect();
    };
  }

  private scheduleReconnect(): void {
    if (!this.token || this.manualClose) return;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);

    this.reconnectAttempt += 1;
    const base = Math.min(1_000 * 2 ** (this.reconnectAttempt - 1), MAX_RECONNECT_DELAY_MS);
    const delay = base + Math.random() * 500;

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.open();
    }, delay);
  }

  private emitAuthExpired(): void {
    this.manualClose = true;
    window.dispatchEvent(new CustomEvent("rustle:auth-expired"));
  }

  private handleFrame(frame: ReturnType<typeof decodeServerFrame>): void {
    if (frame.callSnapshot) {
      this.callHandler?.onSnapshot(frame.callSnapshot);
      return;
    }

    if (frame.callEvent) {
      this.callHandler?.onEvent(frame.callEvent);
      return;
    }

    if (frame.authenticated) {
      if (this.authTimer) clearTimeout(this.authTimer);
      this.authTimer = null;
      this.reconnectAttempt = 0;
      const isReconnect = this.hasAuthenticated;
      this.hasAuthenticated = true;

      const bootstrap = wireToBootstrap(frame.authenticated);
      useChatStore.getState().initialize(bootstrap);
      useChatStore.getState().setSocketStatus("connected");
      this.startFlushLoop();
      this.subscribeAll();
      this.heartbeat(useChatStore.getState().selfStatus);

      const activeEvents = useChatStore.getState().activeChannelId;
      if (activeEvents) this.openChannelEvents(activeEvents);

      if (isReconnect) {
        const activeChannel = useChatStore.getState().activeChannelId;
        const token = this.token;
        if (activeChannel && token) {
          void useChatStore.getState().syncLatestHistory(activeChannel, token);
        }
      }
      return;
    }

    if (frame.presenceSnapshot) {
      useChatStore.getState().applyPresenceSnapshot(
        (frame.presenceSnapshot.statuses ?? []).map((entry) => ({
          guildId: entry.guildId,
          userId: entry.userId,
          status: wireToPresence(entry.status)
        }))
      );
      return;
    }

    if (frame.presence) {
      useChatStore.getState().applyPresence({
        guildId: frame.presence.guildId,
        userId: frame.presence.userId,
        status: wireToPresence(frame.presence.status)
      });
      return;
    }

    if (frame.message) {
      const message = frame.message;
      const view: ChatMessageView = {
        id: message.id,
        channelId: message.channelId,
        authorId: message.authorId,
        authorName: message.authorName,
        authorColor: message.authorColor,
        content: message.content,
        attachments: message.attachments ?? [],
        timestampMs: Number(message.timestampMs) || timestampFromSnowflake(message.id),
        clientId: message.clientId || undefined,
        authorAvatarUrl: message.authorAvatarUrl || null,
        reactions: [],
        replyTo: null,
        pinned: false,
        deleted: false,
        status: "COMMITTED"
      };
      useChatStore.getState().enqueueMessage(view);
      return;
    }

    if (frame.ack) {
      this.handleAck(frame.ack);
      return;
    }

    if (frame.typing) {
      useChatStore.getState().setTyping({
        channelId: frame.typing.channelId,
        userId: frame.typing.userId,
        displayName: frame.typing.displayName,
        active: frame.typing.active
      });
      return;
    }

    if (frame.error) {
      if (frame.error.code.startsWith("CALL_")) {
        this.callHandler?.onError(frame.error.code);
        return;
      }
      if (
        frame.error.code === "AUTH_FAILED" ||
        frame.error.code === "AUTH_TIMEOUT" ||
        frame.error.code === "AUTH_REQUIRED"
      ) {
        this.emitAuthExpired();
        this.socket?.close(1008, "authentication failed");
        return;
      }

      if (frame.error.code === "RATE_LIMITED") {
        useChatStore.getState().setError("RATE_LIMITED");
      }
      return;
    }

    if (frame.pong) {
      // Pong doubles as a signed proof the gateway is alive.
      return;
    }
  }

  private handleAck(ack: NonNullable<ReturnType<typeof decodeServerFrame>["ack"]>): void {
    const timeout = this.timeouts.get(ack.clientId);
    if (timeout) {
      clearTimeout(timeout);
      this.timeouts.delete(ack.clientId);
    }

    const committed = ack.status === "ACK_STATUS_COMMITTED";
    const timestamp = Number(ack.timestampMs);
    useChatStore.getState().reconcileAck({
      channelId: ack.channelId,
      clientId: ack.clientId,
      messageId: ack.messageId,
      status: committed ? "committed" : "failed",
      timestampMs: Number.isFinite(timestamp) && timestamp > 0 ? timestamp : undefined,
      error: ack.error || "SEND_FAILED"
    });

    // A reply target is persisted as a metadata overlay once the gateway has
    // committed the message, so the referenced message id already exists.
    const reply = this.pendingReplies.get(ack.clientId);
    if (!reply) return;
    this.pendingReplies.delete(ack.clientId);
    if (!committed || !this.token) return;

    void api
      .replyMessage(this.token, ack.channelId, ack.messageId, reply)
      .catch(() => {
        // Best-effort: the message itself is already delivered.
      });
  }

  sendMessage(channelId: string, content: string, attachments: string[]): void {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const store = useChatStore.getState();
    const replyTarget = store.replyTarget?.channelId === channelId ? store.replyTarget : null;

    const tempId = nextLocalSnowflake();
    const pending: ChatMessageView = {
      id: tempId,
      channelId,
      authorId: user.id,
      authorName: user.displayName,
      authorColor: user.avatarColor,
      authorAvatarUrl: user.avatarUrl,
      content,
      attachments,
      timestampMs: Date.now(),
      clientId: tempId,
      status: "PENDING",
      replyTo: replyTarget
        ? {
            id: replyTarget.messageId,
            authorName: replyTarget.authorName,
            content: replyTarget.content
          }
        : null
    };

    if (replyTarget) {
      this.pendingReplies.set(tempId, {
        replyToId: replyTarget.messageId,
        previewAuthor: replyTarget.authorName,
        previewContent: replyTarget.content
      });
      useChatStore.getState().setReplyTarget(null);
    }

    useChatStore.getState().addPendingMessage(pending);

    if (!this.isOpen()) {
      useChatStore.getState().markMessageFailed(channelId, tempId, "CONNECTION_LOST");
      return;
    }

    this.sendPending(pending);
  }

  retryMessage(channelId: string, clientId: string): void {
    const message = useChatStore
      .getState()
      .messages[channelId]?.find((entry) => entry.clientId === clientId);

    if (!message || message.status === "COMMITTED") return;
    useChatStore.getState().markMessagePending(channelId, clientId);

    if (!this.isOpen()) {
      useChatStore.getState().markMessageFailed(channelId, clientId, "CONNECTION_LOST");
      return;
    }

    this.sendPending({ ...message, status: "PENDING" });
  }

  private sendPending(message: ChatMessageView): void {
    const clientId = message.clientId;
    if (!clientId) return;

    const requestId = crypto.randomUUID();
    const sent = this.sendFrame(
      {
        sendMessage: {
          channelId: message.channelId,
          content: message.content,
          attachments: message.attachments,
          clientId
        }
      },
      requestId
    );

    if (!sent) {
      useChatStore
        .getState()
        .markMessageFailed(message.channelId, clientId, "CONNECTION_LOST");
      return;
    }

    const timer = setTimeout(() => {
      this.timeouts.delete(clientId);
      useChatStore
        .getState()
        .markMessageFailed(message.channelId, clientId, "SEND_TIMEOUT");
    }, SEND_TIMEOUT_MS);

    this.timeouts.set(clientId, timer);
  }

  joinCall(channelId: string, video: boolean, muted: boolean, deafened: boolean): boolean {
    return this.sendFrame({ joinCall: { channelId, video, muted, deafened } });
  }

  leaveCall(channelId: string): boolean {
    return this.sendFrame({ leaveCall: { channelId } });
  }

  sendCallSignal(
    channelId: string,
    targetSessionId: string,
    type: number,
    payload: { sdp?: string; candidate?: string }
  ): boolean {
    return this.sendFrame({
      callSignal: { channelId, targetSessionId, type, ...payload }
    });
  }

  sendCallMedia(
    channelId: string,
    media: { video: boolean; muted: boolean; deafened: boolean; screenSharing: boolean }
  ): boolean {
    return this.sendFrame({ callMedia: { channelId, ...media } });
  }

  heartbeat(status: PresenceStatus): void {
    if (!this.isOpen()) return;
    this.sendFrame({ heartbeat: { status: PRESENCE_TO_WIRE[status] } });
  }

  setPresence(status: PresenceStatus): void {
    useChatStore.getState().setSelfStatus(status);
    if (!this.isOpen() || status === "offline") return;
    this.sendFrame({ setPresence: { status: PRESENCE_TO_WIRE[status] } });
  }

  sendTyping(channelId: string, active: boolean): void {
    if (!this.isOpen()) return;
    this.sendFrame({ typing: { channelId, active } });
  }

  subscribeToChannels(channelIds: string[]): void {
    if (!this.isOpen()) return;
    const unique = [...new Set(channelIds)];
    for (let index = 0; index < unique.length; index += 50) {
      this.sendFrame({ subscribe: { channelIds: unique.slice(index, index + 50) } });
    }
  }

  private subscribeAll(): void {
    const ids = useChatStore
      .getState()
      .guilds.flatMap((guild) =>
        guild.channels.filter((channel) => channel.kind === "text").map((channel) => channel.id)
      );
    this.subscribeToChannels(ids);
  }

  private isOpen(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  private sendFrame(payload: object, requestId = crypto.randomUUID()): boolean {
    if (!this.isOpen()) return false;
    try {
      this.socket!.send(encodeClientFrame(payload, requestId));
      return true;
    } catch {
      return false;
    }
  }

  private startFlushLoop(): void {
    if (this.flushTimer) return;
    this.flushTimer = setInterval(() => {
      useChatStore.getState().flushIncoming();
      this.flushTicks += 1;
      if (this.flushTicks % 16 === 0) useChatStore.getState().pruneTyping();
    }, FLUSH_INTERVAL_MS);
  }

  private stopFlushLoop(): void {
    if (this.flushTimer) clearInterval(this.flushTimer);
    this.flushTimer = null;
  }

  private attachNetworkListeners(): void {
    if (this.networkListenersAttached) return;
    this.networkListenersAttached = true;

    window.addEventListener("offline", () => {
      useChatStore.getState().setSocketStatus("disconnected");
      if (this.socket && this.socket.readyState <= WebSocket.OPEN) {
        this.socket.close(4000, "network offline");
      }
    });

    window.addEventListener("online", () => {
      if (this.token && (!this.socket || this.socket.readyState === WebSocket.CLOSED)) {
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
        this.reconnectAttempt = 0;
        this.open();
      }
    });
  }
}

export const chatSocket = new ChatSocket();

export { ChatSocket };
