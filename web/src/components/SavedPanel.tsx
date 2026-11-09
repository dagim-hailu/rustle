import * as Dialog from "@radix-ui/react-dialog";
import { BookmarkX, LoaderCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../lib/api";
import { useAuthStore } from "../store/authStore";
import { useChatStore } from "../store/chatStore";
import type { SavedMessage } from "../types";

export function SavedPanel({
  open,
  onOpenChange
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useTranslation();
  const token = useAuthStore((state) => state.token);
  const setSavedIds = useChatStore((state) => state.setSavedIds);
  const setSaved = useChatStore((state) => state.setSaved);
  const setActiveChannel = useChatStore((state) => state.setActiveChannel);
  const [saved, setList] = useState<SavedMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!open || !token) return;
    let cancelled = false;
    setLoading(true);
    setError(false);

    void api
      .savedMessages(token)
      .then((result) => {
        if (cancelled) return;
        setList(result.saved);
        setSavedIds(result.saved.map((entry) => entry.messageId));
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, token, setSavedIds]);

  async function unsave(messageId: string) {
    if (!token) return;
    setList((current) => current.filter((entry) => entry.messageId !== messageId));
    setSaved(messageId, false);
    try {
      await api.unsaveMessage(token, messageId);
    } catch {
      // ignore
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-xl font-bold">{t("saved.title")}</Dialog.Title>
              <Dialog.Description className="mt-1.5 text-sm leading-6 text-muted">
                {t("saved.body")}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button type="button" className="icon-button" aria-label={t("common.close")}>
                <X className="size-4" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>

          <div className="mt-5 space-y-2">
            {loading && (
              <div className="flex items-center gap-2 py-6 text-sm text-muted">
                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                {t("common.loading")}
              </div>
            )}

            {!loading && error && (
              <p role="alert" className="text-sm font-medium text-danger">
                {t("errors.generic")}
              </p>
            )}

            {!loading && !error && saved.length === 0 && (
              <p className="rounded-xl border border-dashed border-border p-4 text-center text-sm text-muted">
                {t("saved.empty")}
              </p>
            )}

            {saved.map((entry) => (
              <div
                key={entry.messageId}
                className="rounded-xl border border-border bg-surface-2 p-3"
              >
                <div className="flex items-center gap-2 text-xs text-muted">
                  <span className="font-semibold text-text">{entry.authorName}</span>
                  <span>#</span>
                  <button
                    type="button"
                    className="font-medium text-accent hover:underline"
                    onClick={() => {
                      setActiveChannel(entry.channelId);
                      onOpenChange(false);
                    }}
                  >
                    {entry.channelName}
                  </button>
                  <time className="ms-auto">
                    {new Date(entry.createdAt).toLocaleDateString(undefined, {
                      dateStyle: "medium"
                    })}
                  </time>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 font-semibold text-muted hover:text-danger"
                    onClick={() => void unsave(entry.messageId)}
                    aria-label={t("saved.remove")}
                  >
                    <BookmarkX className="size-3.5" aria-hidden="true" />
                  </button>
                </div>
                {entry.content && (
                  <p dir="auto" className="mt-1.5 whitespace-pre-wrap break-words text-sm text-text">
                    {entry.content}
                  </p>
                )}
                <button
                  type="button"
                  className="mt-2 text-xs font-semibold text-accent hover:underline"
                  onClick={() => {
                    setActiveChannel(entry.channelId);
                    onOpenChange(false);
                    requestAnimationFrame(() =>
                      document
                        .getElementById(`message-${entry.messageId}`)
                        ?.scrollIntoView({ behavior: "smooth", block: "center" })
                    );
                  }}
                >
                  {t("saved.jump")}
                </button>
              </div>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
