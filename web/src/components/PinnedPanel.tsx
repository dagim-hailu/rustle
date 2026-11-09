import * as Dialog from "@radix-ui/react-dialog";
import { LoaderCircle, Pin, PinOff, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../lib/api";
import { useAuthStore } from "../store/authStore";
import { useChatStore } from "../store/chatStore";
import type { Channel, PinMessage } from "../types";

export function PinnedPanel({
  channel,
  canManage,
  open,
  onOpenChange
}: {
  channel: Channel;
  canManage: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useTranslation();
  const token = useAuthStore((state) => state.token);
  const applyChannelEvent = useChatStore((state) => state.applyChannelEvent);
  const [pins, setPins] = useState<PinMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!open || !token) return;
    let cancelled = false;
    setLoading(true);
    setError(false);

    void api
      .pins(token, channel.id)
      .then((result) => {
        if (!cancelled) setPins(result.pins);
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
  }, [open, token, channel.id]);

  async function unpin(messageId: string) {
    if (!token) return;
    setPins((current) => current.filter((pin) => pin.messageId !== messageId));
    try {
      await api.unpinMessage(token, channel.id, messageId);
      applyChannelEvent({ type: "pin", channelId: channel.id, messageId, pinned: false });
    } catch {
      // ignore; the list refreshes next time it opens
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-xl font-bold">
                {t("pins.title", { channel: channel.name })}
              </Dialog.Title>
              <Dialog.Description className="mt-1.5 text-sm leading-6 text-muted">
                {t("pins.body")}
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

            {!loading && !error && pins.length === 0 && (
              <p className="rounded-xl border border-dashed border-border p-4 text-center text-sm text-muted">
                {t("pins.empty")}
              </p>
            )}

            {pins.map((pin) => (
              <div
                key={pin.messageId}
                className="rounded-xl border border-border bg-surface-2 p-3"
              >
                <div className="flex items-center gap-2 text-xs text-muted">
                  <Pin className="size-3.5 text-accent" aria-hidden="true" />
                  <span className="font-semibold text-text">{pin.authorName}</span>
                  <span>·</span>
                  <time>
                    {new Date(pin.createdAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short"
                    })}
                  </time>
                  {canManage && (
                    <button
                      type="button"
                      className="ms-auto inline-flex items-center gap-1 font-semibold text-muted hover:text-danger"
                      onClick={() => void unpin(pin.messageId)}
                    >
                      <PinOff className="size-3.5" aria-hidden="true" />
                      {t("chat.unpin")}
                    </button>
                  )}
                </div>
                {pin.content && (
                  <p dir="auto" className="mt-1.5 whitespace-pre-wrap break-words text-sm text-text">
                    {pin.content}
                  </p>
                )}
                <button
                  type="button"
                  className="mt-2 text-xs font-semibold text-accent hover:underline"
                  onClick={() => {
                    onOpenChange(false);
                    requestAnimationFrame(() =>
                      document
                        .getElementById(`message-${pin.messageId}`)
                        ?.scrollIntoView({ behavior: "smooth", block: "center" })
                    );
                  }}
                >
                  {t("pins.jump")}
                </button>
              </div>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
