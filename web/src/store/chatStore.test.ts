import { beforeEach, describe, expect, it } from "vitest";
import type { Bootstrap, ChatMessageView } from "../types";
import { useChatStore } from "./chatStore";

const USER_ID = "11111111-1111-4111-8111-111111111111";
const GUILD_ID = "22222222-2222-4222-8222-222222222222";
const CHANNEL_A = "33333333-3333-4333-8333-333333333333";
const CHANNEL_B = "44444444-4444-4444-8444-444444444444";

const bootstrap: Bootstrap = {
  user: {
    id: USER_ID,
    email: "test@example.com",
    displayName: "Test User",
    avatarColor: "#B7410E",
    locale: "en"
  },
  guilds: [
    {
      id: GUILD_ID,
      name: "Test Guild",
      iconColor: "#B7410E",
      role: "owner",
      channels: [
        {
          id: CHANNEL_A,
          guildId: GUILD_ID,
          name: "general",
          topic: "",
          kind: "text",
          position: 0
        },
        {
          id: CHANNEL_B,
          guildId: GUILD_ID,
          name: "random",
          topic: "",
          kind: "text",
          position: 1
        }
      ],
      members: [
        {
          userId: USER_ID,
          displayName: "Test User",
          avatarColor: "#B7410E",
          role: "owner"
        }
      ]
    }
  ]
};

function pending(overrides: Partial<ChatMessageView> = {}): ChatMessageView {
  return {
    id: "1700000000000000001",
    channelId: CHANNEL_A,
    authorId: USER_ID,
    authorName: "Test User",
    authorColor: "#B7410E",
    content: "hello",
    attachments: [],
    timestampMs: 1_700_000_000_000,
    clientId: "1700000000000000001",
    status: "PENDING",
    ...overrides
  };
}

function committed(
  id: string,
  timestampMs: number,
  overrides: Partial<ChatMessageView> = {}
): ChatMessageView {
  return {
    id,
    channelId: CHANNEL_A,
    authorId: "55555555-5555-4555-8555-555555555555",
    authorName: "Other",
    authorColor: "#0F6B6B",
    content: `message ${id}`,
    attachments: [],
    timestampMs,
    status: "COMMITTED",
    ...overrides
  };
}

describe("chat store optimistic send reconciliation", () => {
  beforeEach(() => {
    useChatStore.getState().reset();
    useChatStore.getState().initialize(bootstrap);
    useChatStore.getState().setActiveChannel(CHANNEL_A);
  });

  it("moves a pending message to COMMITTED and swaps in the server Snowflake", () => {
    const message = pending();
    useChatStore.getState().addPendingMessage(message);

    expect(useChatStore.getState().messages[CHANNEL_A]?.[0]?.status).toBe("PENDING");

    useChatStore.getState().reconcileAck({
      channelId: CHANNEL_A,
      clientId: message.clientId!,
      messageId: "1900000000000000999",
      status: "committed",
      timestampMs: 1_700_000_000_123
    });

    const stored = useChatStore.getState().messages[CHANNEL_A]!;
    expect(stored).toHaveLength(1);
    expect(stored[0]?.id).toBe("1900000000000000999");
    expect(stored[0]?.status).toBe("COMMITTED");
    expect(stored[0]?.timestampMs).toBe(1_700_000_000_123);
  });

  it("marks a message FAILED, allows retry, and accepts a late commit", () => {
    const message = pending();
    useChatStore.getState().addPendingMessage(message);

    useChatStore.getState().markMessageFailed(CHANNEL_A, message.clientId!, "SEND_TIMEOUT");

    let stored = useChatStore.getState().messages[CHANNEL_A]![0]!;
    expect(stored.status).toBe("FAILED");
    expect(stored.error).toBe("SEND_TIMEOUT");

    useChatStore.getState().markMessagePending(CHANNEL_A, message.clientId!);
    stored = useChatStore.getState().messages[CHANNEL_A]![0]!;
    expect(stored.status).toBe("PENDING");

    useChatStore.getState().reconcileAck({
      channelId: CHANNEL_A,
      clientId: message.clientId!,
      messageId: "1900000000000001000",
      status: "committed",
      timestampMs: 1_700_000_000_500
    });

    expect(useChatStore.getState().messages[CHANNEL_A]![0]?.status).toBe("COMMITTED");
  });

  it("fails all in-flight sends when the gateway disconnects", () => {
    useChatStore.getState().addPendingMessage(pending({ clientId: "a", id: "a" }));
    useChatStore
      .getState()
      .addPendingMessage(pending({ clientId: "b", id: "b", timestampMs: 1_700_000_000_001 }));

    useChatStore.getState().failAllPending("CONNECTION_LOST");

    const stored = useChatStore.getState().messages[CHANNEL_A]!;
    expect(stored.every((message) => message.status === "FAILED")).toBe(true);
    expect(stored.every((message) => message.error === "CONNECTION_LOST")).toBe(true);
  });

  it("reconciles a pending send from the fanned-out message before the ack arrives", () => {
    const message = pending();
    useChatStore.getState().addPendingMessage(message);

    useChatStore.getState().enqueueMessage(
      committed("1900000000000002000", 1_700_000_000_200, {
        clientId: message.clientId,
        authorId: USER_ID,
        authorName: "Test User"
      })
    );
    useChatStore.getState().flushIncoming();

    const stored = useChatStore.getState().messages[CHANNEL_A]!;
    expect(stored).toHaveLength(1);
    expect(stored[0]?.id).toBe("1900000000000002000");
    expect(stored[0]?.status).toBe("COMMITTED");
  });
});

describe("chat store batching and ordering", () => {
  beforeEach(() => {
    useChatStore.getState().reset();
    useChatStore.getState().initialize(bootstrap);
    useChatStore.getState().setActiveChannel(CHANNEL_A);
  });

  it("queues WS messages until the metered flush", () => {
    useChatStore.getState().enqueueMessage(committed("1900000000000003000", 1_700_000_003_000));
    useChatStore.getState().enqueueMessage(committed("1900000000000003001", 1_700_000_003_001));

    expect(useChatStore.getState().messages[CHANNEL_A] ?? []).toHaveLength(0);
    expect(useChatStore.getState().incomingBuffer).toHaveLength(2);

    useChatStore.getState().flushIncoming();

    expect(useChatStore.getState().messages[CHANNEL_A]).toHaveLength(2);
    expect(useChatStore.getState().incomingBuffer).toHaveLength(0);
  });

  it("sorts out-of-order network arrivals by timestamp and Snowflake id", () => {
    useChatStore.getState().enqueueMessage(committed("1900000000000004002", 1_700_000_004_002));
    useChatStore.getState().enqueueMessage(committed("1900000000000004000", 1_700_000_004_000));
    useChatStore.getState().enqueueMessage(committed("1900000000000004001", 1_700_000_004_001));

    useChatStore.getState().flushIncoming();

    const ids = useChatStore.getState().messages[CHANNEL_A]!.map((message) => message.id);
    expect(ids).toEqual([
      "1900000000000004000",
      "1900000000000004001",
      "1900000000000004002"
    ]);
  });

  it("deduplicates repeated fan-out deliveries and counts unread background channels", () => {
    const message = committed("1900000000000005000", 1_700_000_005_000, {
      channelId: CHANNEL_B
    });
    useChatStore.getState().enqueueMessage(message);
    useChatStore.getState().enqueueMessage(message);

    useChatStore.getState().flushIncoming();

    expect(useChatStore.getState().messages[CHANNEL_B]).toHaveLength(1);
    expect(useChatStore.getState().unread[CHANNEL_B]).toBe(1);

    useChatStore.getState().setActiveChannel(CHANNEL_B);
    expect(useChatStore.getState().unread[CHANNEL_B]).toBe(0);
  });
});

describe("chat store message actions", () => {
  const MESSAGE_ID = "1900000000000006000";

  beforeEach(() => {
    useChatStore.getState().reset();
    useChatStore.getState().initialize(bootstrap);
    useChatStore.getState().setActiveChannel(CHANNEL_A);
    useChatStore
      .getState()
      .enqueueMessage(committed(MESSAGE_ID, 1_700_000_006_000));
    useChatStore.getState().flushIncoming();
  });

  function message() {
    return useChatStore.getState().messages[CHANNEL_A]![0]!;
  }

  it("adds a reaction and removes it when the count reaches zero", () => {
    useChatStore.getState().applyChannelEvent({
      type: "reaction",
      channelId: CHANNEL_A,
      messageId: MESSAGE_ID,
      emoji: "👍",
      count: 2,
      userId: USER_ID,
      added: true
    });
    expect(message().reactions).toEqual([{ emoji: "👍", count: 2, mine: true }]);

    useChatStore.getState().applyChannelEvent({
      type: "reaction",
      channelId: CHANNEL_A,
      messageId: MESSAGE_ID,
      emoji: "👍",
      count: 0,
      userId: USER_ID,
      added: false
    });
    expect(message().reactions).toHaveLength(0);
  });

  it("edits then soft-deletes a message, clearing its body and attachments", () => {
    useChatStore.getState().applyChannelEvent({
      type: "edit",
      channelId: CHANNEL_A,
      messageId: MESSAGE_ID,
      content: "edited body",
      editedAt: 1_700_000_009_000
    });
    expect(message().content).toBe("edited body");
    expect(message().editedAt).toBe(1_700_000_009_000);

    useChatStore.getState().applyChannelEvent({
      type: "delete",
      channelId: CHANNEL_A,
      messageId: MESSAGE_ID
    });
    expect(message().deleted).toBe(true);
    expect(message().content).toBe("");
    expect(message().reactions).toHaveLength(0);
  });

  it("toggles the pinned flag", () => {
    useChatStore.getState().applyChannelEvent({
      type: "pin",
      channelId: CHANNEL_A,
      messageId: MESSAGE_ID,
      pinned: true
    });
    expect(message().pinned).toBe(true);

    useChatStore.getState().applyChannelEvent({
      type: "pin",
      channelId: CHANNEL_A,
      messageId: MESSAGE_ID,
      pinned: false
    });
    expect(message().pinned).toBe(false);
  });

  it("merges reload metadata (overrides, reactions, replies, pins) onto loaded history", () => {
    useChatStore.getState().applyMessageMeta(CHANNEL_A, {
      overrides: {
        [MESSAGE_ID]: { content: "reconciled", deleted: false, editedAt: 1_700_000_010_000 }
      },
      reactions: { [MESSAGE_ID]: [{ emoji: "🔥", count: 3, mine: false }] },
      replies: {
        [MESSAGE_ID]: { id: "1900000000000000001", authorName: "Other", content: "parent" }
      },
      pinned: [MESSAGE_ID]
    });

    expect(message().content).toBe("reconciled");
    expect(message().editedAt).toBe(1_700_000_010_000);
    expect(message().reactions).toEqual([{ emoji: "🔥", count: 3, mine: false }]);
    expect(message().replyTo?.content).toBe("parent");
    expect(message().pinned).toBe(true);
  });

  it("tracks saved ids and clears the reply target when the channel changes", () => {
    useChatStore.getState().setSavedIds(["a", MESSAGE_ID]);
    expect(useChatStore.getState().savedIds[MESSAGE_ID]).toBe(true);
    expect(useChatStore.getState().savedIds["a"]).toBe(true);

    useChatStore.getState().setSaved(MESSAGE_ID, false);
    expect(useChatStore.getState().savedIds[MESSAGE_ID]).toBeUndefined();

    useChatStore.getState().setReplyTarget({
      channelId: CHANNEL_A,
      messageId: MESSAGE_ID,
      authorName: "Other",
      content: "hi"
    });
    expect(useChatStore.getState().replyTarget?.messageId).toBe(MESSAGE_ID);

    useChatStore.getState().setActiveChannel(CHANNEL_B);
    expect(useChatStore.getState().replyTarget).toBeNull();
  });
});
