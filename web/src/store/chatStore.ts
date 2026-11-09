import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { api } from "../lib/api";
import { compareSnowflakes, timestampFromSnowflake } from "../lib/snowflake";
import type {
  Bootstrap,
  ChannelEvent,
  ChatMessageView,
  Guild,
  HistoryMessage,
  HistoryState,
  PresenceStatus,
  ReactionGroup,
  ReplyPreview,
  SocketStatus,
  TypingEntry
} from "../types";

export const FLUSH_INTERVAL_MS = 60;

export type IncomingEvent =
  | { type: "message"; message: ChatMessageView }
  | { type: "presence"; guildId: string; userId: string; status: PresenceStatus };

interface ChatState {
  guilds: Guild[];
  currentUserId: string | null;
  activeGuildId: string | null;
  activeChannelId: string | null;
  messages: Record<string, ChatMessageView[]>;
  history: Record<string, HistoryState>;
  unread: Record<string, number>;
  presences: Record<string, Record<string, PresenceStatus>>;
  typing: Record<string, TypingEntry[]>;
  incomingBuffer: IncomingEvent[];
  socketStatus: SocketStatus;
  selfStatus: PresenceStatus;
  lastError: string | null;

  initialize: (bootstrap: Bootstrap) => void;
  setActiveGuild: (guildId: string) => void;
  setActiveChannel: (channelId: string) => void;
  markChannelRead: (channelId: string) => void;
  loadInitialHistory: (channelId: string, token: string) => Promise<void>;
  loadOlderHistory: (channelId: string, token: string) => Promise<void>;
  syncLatestHistory: (channelId: string, token: string) => Promise<void>;
  addPendingMessage: (message: ChatMessageView) => void;
  enqueueMessage: (message: ChatMessageView) => void;
  flushIncoming: () => void;
  reconcileAck: (ack: {
    channelId: string;
    clientId: string;
    messageId: string;
    status: "committed" | "failed";
    timestampMs?: number;
    error?: string;
  }) => void;
  markMessageFailed: (channelId: string, clientId: string, error: string) => void;
  markMessagePending: (channelId: string, clientId: string) => void;
  failAllPending: (error: string) => void;
  setTyping: (input: { channelId: string; userId: string; displayName: string; active: boolean }) => void;
  pruneTyping: () => void;
  applyPresence: (event: { guildId: string; userId: string; status: PresenceStatus }) => void;
  applyPresenceSnapshot: (
    events: Array<{ guildId: string; userId: string; status: PresenceStatus }>
  ) => void;
  setSocketStatus: (status: SocketStatus) => void;
  setSelfStatus: (status: PresenceStatus) => void;
  setError: (code: string | null) => void;
  savedIds: Record<string, true>;
  setSavedIds: (ids: string[]) => void;
  setSaved: (messageId: string, saved: boolean) => void;
  applyMessageMeta: (
    channelId: string,
    meta: {
      reactions: Record<string, ReactionGroup[]>;
      overrides: Record<string, { content: string | null; deleted: boolean; editedAt: number }>;
      replies: Record<string, ReplyPreview>;
      pinned: string[];
    }
  ) => void;
  replyTarget: ReplyTarget | null;
  setReplyTarget: (target: ReplyTarget | null) => void;
  applyChannelEvent: (event: ChannelEvent) => void;
  reset: () => void;
}

export interface ReplyTarget {
  channelId: string;
  messageId: string;
  authorName: string;
  content: string;
}

export function initialState() {
  return {
    guilds: [] as Guild[],
    currentUserId: null as string | null,
    activeGuildId: null as string | null,
    activeChannelId: null as string | null,
    messages: {} as Record<string, ChatMessageView[]>,
    history: {} as Record<string, HistoryState>,
    unread: {} as Record<string, number>,
    presences: {} as Record<string, Record<string, PresenceStatus>>,
    typing: {} as Record<string, TypingEntry[]>,
    incomingBuffer: [] as IncomingEvent[],
    socketStatus: "idle" as SocketStatus,
    selfStatus: "online" as PresenceStatus,
    lastError: null as string | null,
    savedIds: {} as Record<string, true>,
    replyTarget: null as ReplyTarget | null
  };
}

function ensureHistory(state: { history: Record<string, HistoryState> }, channelId: string): HistoryState {
  state.history[channelId] ??= {
    cursor: null,
    hasMore: true,
    loaded: false,
    loading: false,
    loadingOlder: false,
    error: null
  };
  return state.history[channelId]!;
}

function ensureMessages(
  state: { messages: Record<string, ChatMessageView[]> },
  channelId: string
): ChatMessageView[] {
  state.messages[channelId] ??= [];
  return state.messages[channelId]!;
}

function sortMessages(messages: ChatMessageView[]): void {
  messages.sort((a, b) => {
    if (a.timestampMs !== b.timestampMs) return a.timestampMs - b.timestampMs;
    return compareSnowflakes(a.id, b.id);
  });
}

function historyToView(message: HistoryMessage): ChatMessageView {
  return {
    ...message,
    reactions: message.reactions ?? [],
    replyTo: message.replyTo ?? null,
    pinned: message.pinned ?? false,
    deleted: message.deleted ?? false,
    status: "COMMITTED"
  };
}

function chooseChannel(guilds: Guild[], guildId: string | null): string | null {
  if (!guildId) return null;
  const guild = guilds.find((entry) => entry.id === guildId);
  return guild?.channels.find((channel) => channel.kind === "text")?.id ?? null;
}

export const useChatStore = create<ChatState>()(
  immer((set, get) => ({
    ...initialState(),

    initialize: (bootstrap) =>
      set((state) => {
        state.guilds = bootstrap.guilds;
        state.currentUserId = bootstrap.user.id;

        const stillHasGuild = state.activeGuildId
          ? bootstrap.guilds.some((guild) => guild.id === state.activeGuildId)
          : false;
        if (!stillHasGuild) {
          state.activeGuildId = bootstrap.guilds[0]?.id ?? null;
        }

        const allChannels = bootstrap.guilds.flatMap((guild) => guild.channels);
        const stillHasChannel = state.activeChannelId
          ? allChannels.some((channel) => channel.id === state.activeChannelId)
          : false;
        if (!stillHasChannel) {
          state.activeChannelId = chooseChannel(bootstrap.guilds, state.activeGuildId);
        }
      }),

    setActiveGuild: (guildId) =>
      set((state) => {
        state.activeGuildId = guildId;
        state.activeChannelId = chooseChannel(state.guilds, guildId);
      }),

    setActiveChannel: (channelId) =>
      set((state) => {
        state.activeChannelId = channelId;
        state.unread[channelId] = 0;
        state.replyTarget = null;
        const guild = state.guilds.find((entry) =>
          entry.channels.some((channel) => channel.id === channelId)
        );
        if (guild) state.activeGuildId = guild.id;
      }),

    markChannelRead: (channelId) =>
      set((state) => {
        state.unread[channelId] = 0;
      }),

    loadInitialHistory: async (channelId, token) => {
      const meta = get().history[channelId];
      if (meta?.loaded || meta?.loading) return;

      set((state) => {
        const history = ensureHistory(state, channelId);
        history.loading = true;
        history.error = null;
      });

      try {
        const page = await api.history(token, channelId, null, 50);
        set((state) => {
          const list = ensureMessages(state, channelId);
          const existingIds = new Set(list.map((message) => message.id));

          for (const message of page.messages) {
            if (!existingIds.has(message.id)) {
              list.push(historyToView(message));
              existingIds.add(message.id);
            }
          }

          sortMessages(list);
          const history = ensureHistory(state, channelId);
          history.cursor = page.nextCursor;
          history.hasMore = page.hasMore;
          history.loaded = true;
          history.loading = false;
          history.error = null;
        });
      } catch {
        set((state) => {
          const history = ensureHistory(state, channelId);
          history.loading = false;
          history.error = "HISTORY_FAILED";
          state.lastError = "HISTORY_FAILED";
        });
      }
    },

    loadOlderHistory: async (channelId, token) => {
      const meta = get().history[channelId];
      if (
        !meta ||
        !meta.loaded ||
        !meta.hasMore ||
        meta.loadingOlder ||
        !meta.cursor
      ) {
        return;
      }

      set((state) => {
        const history = ensureHistory(state, channelId);
        history.loadingOlder = true;
      });

      try {
        const page = await api.history(token, channelId, meta.cursor, 50);
        set((state) => {
          const list = ensureMessages(state, channelId);
          const existingIds = new Set(list.map((message) => message.id));

          for (const message of page.messages) {
            if (!existingIds.has(message.id)) {
              list.push(historyToView(message));
              existingIds.add(message.id);
            }
          }

          sortMessages(list);
          const history = ensureHistory(state, channelId);
          history.cursor = page.nextCursor;
          history.hasMore = page.hasMore;
          history.loadingOlder = false;
        });
      } catch {
        set((state) => {
          const history = ensureHistory(state, channelId);
          history.loadingOlder = false;
          history.error = "HISTORY_FAILED";
          state.lastError = "HISTORY_FAILED";
        });
      }
    },

    syncLatestHistory: async (channelId, token) => {
      try {
        const page = await api.history(token, channelId, null, 50);
        set((state) => {
          const list = ensureMessages(state, channelId);
          const existingIds = new Set(list.map((message) => message.id));

          for (const message of page.messages) {
            if (!existingIds.has(message.id)) {
              list.push(historyToView(message));
              existingIds.add(message.id);
            }
          }

          sortMessages(list);
          const history = ensureHistory(state, channelId);
          if (!history.loaded) {
            history.cursor = page.nextCursor;
            history.hasMore = page.hasMore;
            history.loaded = true;
          }
        });
      } catch {
        set((state) => {
          state.lastError = "HISTORY_FAILED";
        });
      }
    },

    addPendingMessage: (message) =>
      set((state) => {
        const list = ensureMessages(state, message.channelId);
        list.push(message);
        sortMessages(list);
      }),

    enqueueMessage: (message) =>
      set((state) => {
        state.incomingBuffer.push({ type: "message", message });
      }),

    flushIncoming: () =>
      set((state) => {
        if (state.incomingBuffer.length === 0) return;

        const touched = new Set<string>();

        for (const event of state.incomingBuffer) {
          if (event.type !== "message") continue;
          const incoming = event.message;
          const list = ensureMessages(state, incoming.channelId);
          const byId = list.findIndex((message) => message.id === incoming.id);
          const byClient = incoming.clientId
            ? list.findIndex(
                (message) =>
                  message.clientId === incoming.clientId &&
                  message.status !== "COMMITTED" &&
                  message.id !== incoming.id
              )
            : -1;

          const committed: ChatMessageView = { ...incoming, status: "COMMITTED" };

          if (byId >= 0) {
            list[byId] = committed;
            if (byClient >= 0) list.splice(byClient, 1);
          } else if (byClient >= 0) {
            list[byClient] = committed;
          } else {
            list.push(committed);
            if (
              incoming.channelId !== state.activeChannelId &&
              incoming.authorId !== state.currentUserId
            ) {
              state.unread[incoming.channelId] =
                (state.unread[incoming.channelId] ?? 0) + 1;
            }
          }

          touched.add(incoming.channelId);
        }

        for (const channelId of touched) {
          sortMessages(ensureMessages(state, channelId));
        }

        state.incomingBuffer = [];
      }),

    reconcileAck: (ack) =>
      set((state) => {
        const list = ensureMessages(state, ack.channelId);
        const pendingIndex = list.findIndex(
          (message) =>
            message.clientId === ack.clientId && message.status !== "COMMITTED"
        );

        if (ack.status === "failed") {
          if (pendingIndex >= 0) {
            const pending = list[pendingIndex]!;
            pending.status = "FAILED";
            pending.error = ack.error ?? "SEND_FAILED";
          }
          return;
        }

        const committedIndex = list.findIndex((message) => message.id === ack.messageId);

        if (pendingIndex >= 0) {
          const pending = list[pendingIndex]!;
          pending.id = ack.messageId;
          pending.status = "COMMITTED";
          pending.error = undefined;
          pending.timestampMs =
            ack.timestampMs ?? timestampFromSnowflake(ack.messageId) ?? pending.timestampMs;

          if (committedIndex >= 0 && committedIndex !== pendingIndex) {
            list.splice(pendingIndex, 1);
          }
        }

        sortMessages(list);
      }),

    markMessageFailed: (channelId, clientId, error) =>
      set((state) => {
        const list = state.messages[channelId];
        const message = list?.find(
          (entry) => entry.clientId === clientId && entry.status !== "COMMITTED"
        );
        if (message) {
          message.status = "FAILED";
          message.error = error;
        }
      }),

    markMessagePending: (channelId, clientId) =>
      set((state) => {
        const list = state.messages[channelId];
        const message = list?.find((entry) => entry.clientId === clientId);
        if (message && message.status !== "COMMITTED") {
          message.status = "PENDING";
          message.error = undefined;
        }
      }),

    failAllPending: (error) =>
      set((state) => {
        for (const list of Object.values(state.messages)) {
          for (const message of list) {
            if (message.status === "PENDING") {
              message.status = "FAILED";
              message.error = error;
            }
          }
        }
      }),

    setTyping: ({ channelId, userId, displayName, active }) =>
      set((state) => {
        if (userId === state.currentUserId) return;
        const list = (state.typing[channelId] ??= []);
        const index = list.findIndex((entry) => entry.userId === userId);

        if (!active) {
          if (index >= 0) list.splice(index, 1);
          return;
        }

        const entry = { userId, displayName, expiresAt: Date.now() + 6_000 };
        if (index >= 0) list[index] = entry;
        else list.push(entry);
      }),

    pruneTyping: () =>
      set((state) => {
        const now = Date.now();
        for (const [channelId, entries] of Object.entries(state.typing)) {
          const live = entries.filter((entry) => entry.expiresAt > now);
          if (live.length !== entries.length) state.typing[channelId] = live;
        }
      }),

    applyPresence: (event) =>
      set((state) => {
        (state.presences[event.guildId] ??= {})[event.userId] = event.status;
      }),

    applyPresenceSnapshot: (events) =>
      set((state) => {
        for (const event of events) {
          (state.presences[event.guildId] ??= {})[event.userId] = event.status;
        }
      }),

    setSocketStatus: (status) =>
      set((state) => {
        state.socketStatus = status;
      }),

    setSelfStatus: (status) =>
      set((state) => {
        state.selfStatus = status;
      }),

    setError: (code) =>
      set((state) => {
        state.lastError = code;
      }),

    setSavedIds: (ids) =>
      set((state) => {
        state.savedIds = Object.fromEntries(ids.map((id) => [id, true as const]));
      }),

    setSaved: (messageId, saved) =>
      set((state) => {
        if (saved) state.savedIds[messageId] = true;
        else delete state.savedIds[messageId];
      }),

    applyMessageMeta: (channelId, meta) =>
      set((state) => {
        const list = state.messages[channelId];
        if (!list) return;
        for (const message of list) {
          const override = meta.overrides[message.id];
          if (override) {
            message.deleted = override.deleted;
            if (override.deleted) {
              message.content = "";
              message.attachments = [];
              message.reactions = [];
              message.replyTo = null;
            } else if (override.content !== null) {
              message.content = override.content;
              message.editedAt = override.editedAt;
            }
          }
          const reactions = meta.reactions[message.id];
          if (reactions) message.reactions = reactions;
          const reply = meta.replies[message.id];
          if (reply) message.replyTo = reply;
          message.pinned = meta.pinned.includes(message.id);
        }
      }),

    setReplyTarget: (target) =>
      set((state) => {
        state.replyTarget = target;
      }),

    applyChannelEvent: (event) =>
      set((state) => {
        const list = state.messages[event.channelId];
        if (!list) return;
        const message = list.find((entry) => entry.id === event.messageId);
        if (!message) return;

        switch (event.type) {
          case "reaction": {
            const reactions = [...(message.reactions ?? [])];
            const index = reactions.findIndex((group) => group.emoji === event.emoji);
            const mine =
              event.userId === state.currentUserId
                ? event.added
                : index >= 0
                  ? reactions[index]!.mine
                  : false;

            if (event.count <= 0) {
              if (index >= 0) reactions.splice(index, 1);
            } else if (index >= 0) {
              reactions[index] = { emoji: event.emoji, count: event.count, mine };
            } else {
              reactions.push({ emoji: event.emoji, count: event.count, mine });
            }
            message.reactions = reactions;
            break;
          }
          case "edit":
            message.content = event.content;
            message.editedAt = event.editedAt;
            break;
          case "delete":
            message.deleted = true;
            message.content = "";
            message.attachments = [];
            message.reactions = [];
            message.replyTo = null;
            break;
          case "reply":
            message.replyTo = event.replyTo;
            break;
          case "pin":
            message.pinned = event.pinned;
            break;
        }
      }),

    reset: () => set(initialState())
  }))
);

export function presenceFor(
  presences: Record<string, Record<string, PresenceStatus>>,
  guildId: string | null,
  userId: string
): PresenceStatus {
  if (!guildId) return "offline";
  return presences[guildId]?.[userId] ?? "offline";
}
