import { useVirtualizer } from "@tanstack/react-virtual";
import { ArrowDown, LoaderCircle } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useChatStore } from "../store/chatStore";
import type { Channel, ChatMessageView, HistoryState } from "../types";
import { MessageRow } from "./MessageRow";

interface Props {
  channel: Channel;
  messages: ChatMessageView[];
  history: HistoryState;
  token: string;
  canManage: boolean;
}

export function MessageList({ channel, messages, history, token, canManage }: Props) {
  const { t } = useTranslation();
  const parentRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);
  const initialized = useRef(false);
  const previousCount = useRef(0);
  const restoreRef = useRef<{ height: number; top: number } | null>(null);
  const loadingOlderRef = useRef(false);
  const [showJump, setShowJump] = useState(false);
  const currentUserId = useChatStore((state) => state.currentUserId);
  const loadOlderHistory = useChatStore((state) => state.loadOlderHistory);

  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 92,
    overscan: 8,
    getItemKey: (index) => messages[index]?.id ?? index
  });

  const scrollToBottom = useCallback(() => {
    const element = parentRef.current;
    if (!element) return;

    element.scrollTop = element.scrollHeight;
    requestAnimationFrame(() => {
      if (!parentRef.current) return;
      parentRef.current.scrollTop = parentRef.current.scrollHeight;
    });
  }, []);

  useEffect(() => {
    const element = parentRef.current;
    if (!element) return;

    if (!initialized.current && messages.length > 0) {
      initialized.current = true;
      stickToBottom.current = true;
      requestAnimationFrame(scrollToBottom);
    } else if (messages.length > previousCount.current) {
      if (stickToBottom.current) requestAnimationFrame(scrollToBottom);
      else setShowJump(true);
    }

    previousCount.current = messages.length;
  }, [messages.length, scrollToBottom]);

  useEffect(() => {
    if (history.error) restoreRef.current = null;
  }, [history.error]);

  const totalSize = virtualizer.getTotalSize();

  useLayoutEffect(() => {
    const restore = restoreRef.current;
    const element = parentRef.current;
    if (!restore || !element) return;

    const delta = element.scrollHeight - restore.height;
    if (delta > 0) {
      element.scrollTop = restore.top + delta;
      restoreRef.current = null;
    }
  }, [messages.length, totalSize]);

  useEffect(() => {
    if (initialized.current && stickToBottom.current) {
      requestAnimationFrame(scrollToBottom);
    }
  }, [totalSize, scrollToBottom]);

  const loadOlder = useCallback(() => {
    if (loadingOlderRef.current || !history.hasMore || history.loadingOlder) return;
    const element = parentRef.current;
    if (!element) return;

    loadingOlderRef.current = true;
    restoreRef.current = { height: element.scrollHeight, top: element.scrollTop };

    const timer = setTimeout(() => {
      if (restoreRef.current) restoreRef.current = null;
    }, 8_000);

    void loadOlderHistory(channel.id, token).finally(() => {
      clearTimeout(timer);
      loadingOlderRef.current = false;
    });
  }, [channel.id, history.hasMore, history.loadingOlder, loadOlderHistory, token]);

  function handleScroll() {
    const element = parentRef.current;
    if (!element) return;

    const distance = element.scrollHeight - element.scrollTop - element.clientHeight;
    const atBottom = distance < 100;
    stickToBottom.current = atBottom;
    setShowJump(!atBottom);

    if (element.scrollTop < 120) loadOlder();
  }

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div className="relative min-h-0 flex-1">
      <div
        ref={parentRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto scrollbar-thin"
        role="log"
        aria-label={channel.name}
        aria-live="polite"
        aria-relevant="additions text"
      >
        {messages.length === 0 && history.loading && <MessageSkeleton />}

        {messages.length === 0 && !history.loading && (
          <div className="flex min-h-full items-center justify-center p-6">
            <div className="max-w-md py-16 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-border bg-surface-2 text-2xl font-bold text-primary">
                #
              </div>
              <h2 className="mt-5 text-xl font-bold text-text">
                {t("chat.emptyTitle", { channel: channel.name })}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">{t("chat.emptyBody")}</p>
            </div>
          </div>
        )}

        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            position: "relative",
            width: "100%"
          }}
        >
          {virtualItems.map((virtualItem) => {
            const message = messages[virtualItem.index];
            if (!message) return null;

            return (
              <div
                key={virtualItem.key}
                data-index={virtualItem.index}
                ref={virtualizer.measureElement}
                style={{
                  position: "absolute",
                  top: 0,
                  insetInlineStart: 0,
                  width: "100%",
                  transform: `translateY(${virtualItem.start}px)`
                }}
              >
                <MessageRow
                  message={message}
                  previous={messages[virtualItem.index - 1]}
                  currentUserId={currentUserId}
                  canManage={canManage}
                />
              </div>
            );
          })}
        </div>

        <div className="h-4" aria-hidden="true" />
      </div>

      {history.loadingOlder && (
        <div className="pointer-events-none absolute inset-x-0 top-2 z-10 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted shadow-soft">
            <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" />
            {t("chat.loadingOlder")}
          </span>
        </div>
      )}

      {showJump && messages.length > 0 && (
        <button
          type="button"
          onClick={() => {
            stickToBottom.current = true;
            setShowJump(false);
            scrollToBottom();
          }}
          className="absolute inset-x-0 bottom-4 z-10 mx-auto flex w-fit items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-text shadow-panel transition-transform hover:-translate-y-0.5"
        >
          <ArrowDown className="size-3.5" aria-hidden="true" />
          {t("chat.newMessages")}
        </button>
      )}
    </div>
  );
}

function MessageSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-5 py-8" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((row) => (
        <div key={row} className="flex gap-3">
          <div className="size-9 animate-pulse rounded-full bg-skeleton" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-32 animate-pulse rounded bg-skeleton" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-skeleton" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-skeleton" />
          </div>
        </div>
      ))}
    </div>
  );
}
