import * as Dialog from "@radix-ui/react-dialog";
import { AtSign, LoaderCircle, RefreshCw, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../lib/api";
import { useAuthStore } from "../store/authStore";
import { useChatStore } from "../store/chatStore";
import type { Digest } from "../types";

export function DigestPanel({
  open,
  onOpenChange
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useTranslation();
  const token = useAuthStore((state) => state.token);
  const setActiveChannel = useChatStore((state) => state.setActiveChannel);
  const [digest, setDigest] = useState<Digest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    if (!token) return;
    setLoading(true);
    setError(false);
    void api
      .digest(token)
      .then(setDigest)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  function openChannel(channelId: string, messageId?: string) {
    setActiveChannel(channelId);
    onOpenChange(false);
    if (messageId) {
      requestAnimationFrame(() =>
        document
          .getElementById(`message-${messageId}`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" })
      );
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content max-w-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-xl font-bold">{t("digest.title")}</Dialog.Title>
              <Dialog.Description className="mt-1.5 text-sm leading-6 text-muted">
                {digest
                  ? t("digest.summary", {
                      channels: digest.channels.length,
                      unread: digest.totalUnread,
                      mentions: digest.mentionCount
                    })
                  : t("digest.body")}
              </Dialog.Description>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="icon-button"
                onClick={load}
                aria-label={t("common.reload")}
                title={t("common.reload")}
              >
                <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} aria-hidden="true" />
              </button>
              <Dialog.Close asChild>
                <button type="button" className="icon-button" aria-label={t("common.close")}>
                  <X className="size-4" aria-hidden="true" />
                </button>
              </Dialog.Close>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            {loading && !digest && (
              <div className="flex items-center gap-2 py-6 text-sm text-muted">
                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                {t("common.loading")}
              </div>
            )}

            {error && (
              <p role="alert" className="text-sm font-medium text-danger">
                {t("errors.generic")}
              </p>
            )}

            {!loading && !error && digest && digest.channels.length === 0 && (
              <p className="rounded-xl border border-dashed border-border p-4 text-center text-sm text-muted">
                {t("digest.empty")}
              </p>
            )}

            {digest?.channels.map((entry) => (
              <div key={entry.channelId} className="rounded-xl border border-border bg-surface-2 p-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="text-sm font-bold text-text hover:text-accent"
                    onClick={() => openChannel(entry.channelId)}
                  >
                    #{entry.channelName}
                  </button>
                  <span className="badge">{entry.truncated ? "50+" : entry.unreadCount}</span>
                  {entry.mentions.length > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-bold text-primary">
                      <AtSign className="size-3" aria-hidden="true" />
                      {entry.mentions.length}
                    </span>
                  )}
                </div>

                {entry.mentions.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {entry.mentions.map((mention) => (
                      <li key={mention.id}>
                        <button
                          type="button"
                          className="w-full truncate rounded-md px-2 py-1 text-left text-xs text-muted hover:bg-surface-3 hover:text-text"
                          onClick={() => openChannel(entry.channelId, mention.id)}
                        >
                          {mention.content}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <button
                  type="button"
                  className="mt-2 text-xs font-semibold text-accent hover:underline"
                  onClick={() => openChannel(entry.channelId)}
                >
                  {t("digest.open")}
                </button>
              </div>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
