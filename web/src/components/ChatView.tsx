import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../lib/api";
import { useAuthStore } from "../store/authStore";
import { useChatStore } from "../store/chatStore";
import type { Channel, ChatMessageView, HistoryState, TypingEntry } from "../types";
import { CallView } from "./CallView";
import { Composer } from "./Composer";
import { MessageList } from "./MessageList";
import { TypingIndicator } from "./TypingIndicator";

const EMPTY_MESSAGES: ChatMessageView[] = [];
const EMPTY_TYPING: TypingEntry[] = [];
const EMPTY_HISTORY: HistoryState = {
  cursor: null,
  hasMore: false,
  loaded: false,
  loading: false,
  loadingOlder: false,
  error: null
};

export function ChatView({ channel }: { channel: Channel }) {
  const { t } = useTranslation();
  const token = useAuthStore((state) => state.token);
  const messages = useChatStore((state) => state.messages[channel.id] ?? EMPTY_MESSAGES);
  const history = useChatStore((state) => state.history[channel.id] ?? EMPTY_HISTORY);
  const typing = useChatStore((state) => state.typing[channel.id] ?? EMPTY_TYPING);
  const loadInitialHistory = useChatStore((state) => state.loadInitialHistory);
  const markRead = useChatStore((state) => state.markChannelRead);
  const applyMessageMeta = useChatStore((state) => state.applyMessageMeta);
  const canManage = useChatStore((state) => {
    const guild = state.guilds.find((entry) =>
      entry.channels.some((candidate) => candidate.id === channel.id)
    );
    return guild?.role === "owner" || guild?.role === "admin";
  });
  const metaLoaded = useRef<string | null>(null);
  const readPosted = useRef<string | null>(null);

  useEffect(() => {
    if (channel.kind !== "text") return;
    markRead(channel.id);
    if (token) void loadInitialHistory(channel.id, token);
  }, [channel.id, channel.kind, token, loadInitialHistory, markRead]);

  // Refresh reaction/reply/pin metadata for the loaded page once per channel so
  // overlays stay correct after a reload or a missed live event.
  useEffect(() => {
    if (!token || !history.loaded || messages.length === 0) return;
    if (metaLoaded.current === channel.id) return;
    metaLoaded.current = channel.id;
    const ids = messages
      .filter((message) => message.status === "COMMITTED")
      .map((message) => message.id)
      .slice(-200);
    if (ids.length === 0) return;
    void api
      .messageMeta(token, channel.id, ids)
      .then((meta) => applyMessageMeta(channel.id, meta))
      .catch(() => undefined);
  }, [token, history.loaded, messages, channel.id, applyMessageMeta]);

  // Persist the read marker so unread state and the catch-up digest survive a
  // reload.
  useEffect(() => {
    if (!token) return;
    const newest = messages[messages.length - 1];
    if (!newest || newest.status !== "COMMITTED") return;
    if (readPosted.current === newest.id) return;
    readPosted.current = newest.id;
    void api.markChannelRead(token, channel.id, newest.id).catch(() => undefined);
  }, [token, messages, channel.id]);

  if (!token) return null;

  if (channel.kind === "voice") {
    return <CallView channel={channel} />;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-surface">
      <div className="flex min-h-0 flex-1 flex-col">
        <MessageList
          key={channel.id}
          channel={channel}
          messages={messages}
          history={history}
          token={token}
          canManage={canManage}
        />
      </div>

      {history.error && (
        <p className="px-5 pb-1 text-xs font-medium text-danger">
          {t("errors.history")}
        </p>
      )}

      <TypingIndicator entries={typing} />
      <Composer channel={channel} />
    </div>
  );
}
