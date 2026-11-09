import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Copy,
  Ellipsis,
  Pencil,
  Pin,
  PinOff,
  Reply,
  SmilePlus,
  Trash2
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../lib/api";
import { useAuthStore } from "../store/authStore";
import { useChatStore } from "../store/chatStore";
import type { ChatMessageView } from "../types";

const REACTION_EMOJIS = [
  "👍",
  "❤️",
  "😂",
  "🎉",
  "😮",
  "😢",
  "🔥",
  "✅",
  "👀",
  "🙏",
  "💯",
  "🚀"
];

export function MessageActions({
  message,
  canManage,
  onEditStart
}: {
  message: ChatMessageView;
  canManage: boolean;
  onEditStart: () => void;
}) {
  const { t } = useTranslation();
  const token = useAuthStore((state) => state.token);
  const currentUserId = useChatStore((state) => state.currentUserId);
  const saved = useChatStore((state) => state.savedIds[message.id] === true);
  const setReplyTarget = useChatStore((state) => state.setReplyTarget);
  const applyChannelEvent = useChatStore((state) => state.applyChannelEvent);
  const setSaved = useChatStore((state) => state.setSaved);
  const [confirming, setConfirming] = useState(false);

  const isOwn = message.authorId === currentUserId;
  const canDelete = isOwn || canManage;
  const isDeleted = Boolean(message.deleted);

  async function react(emoji: string) {
    if (!token) return;
    try {
      const result = await api.react(token, message.channelId, message.id, emoji);
      applyChannelEvent({
        type: "reaction",
        channelId: message.channelId,
        messageId: message.id,
        emoji,
        count: result.count,
        userId: currentUserId ?? "",
        added: true
      });
    } catch {
      // Best effort; the stream reconciles on the next event.
    }
  }

  function reply() {
    setReplyTarget({
      channelId: message.channelId,
      messageId: message.id,
      authorName: message.authorName,
      content: message.content.slice(0, 180)
    });
  }

  async function togglePin() {
    if (!token) return;
    try {
      if (message.pinned) {
        await api.unpinMessage(token, message.channelId, message.id);
        applyChannelEvent({
          type: "pin",
          channelId: message.channelId,
          messageId: message.id,
          pinned: false
        });
      } else {
        await api.pinMessage(token, message.channelId, message.id, {
          authorName: message.authorName,
          content: message.content,
          attachments: message.attachments
        });
        applyChannelEvent({
          type: "pin",
          channelId: message.channelId,
          messageId: message.id,
          pinned: true
        });
      }
    } catch {
      // ignore
    }
  }

  async function toggleSave() {
    if (!token) return;
    try {
      if (saved) {
        await api.unsaveMessage(token, message.id);
        setSaved(message.id, false);
      } else {
        await api.saveMessage(token, {
          channelId: message.channelId,
          messageId: message.id,
          authorName: message.authorName,
          content: message.content,
          attachments: message.attachments
        });
        setSaved(message.id, true);
      }
    } catch {
      // ignore
    }
  }

  async function remove() {
    if (!token) return;
    setConfirming(false);
    try {
      await api.deleteMessage(token, message.channelId, message.id);
      applyChannelEvent({
        type: "delete",
        channelId: message.channelId,
        messageId: message.id
      });
    } catch {
      // ignore
    }
  }

  function copy() {
    void navigator.clipboard
      ?.writeText(`${message.authorName}: ${message.content}`)
      .catch(() => undefined);
  }

  if (isDeleted || message.status !== "COMMITTED") return null;

  return (
    <div className="message-actions absolute -top-3 end-1.5 z-10 items-center gap-0.5 rounded-lg border border-border bg-surface p-0.5 shadow-panel">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button type="button" className="message-action" aria-label={t("chat.addReaction")} title={t("chat.addReaction")}>
            <SmilePlus className="size-4" aria-hidden="true" />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content sideOffset={6} align="end" className="z-[60] rounded-xl border border-border bg-surface p-2 shadow-panel">
            <DropdownMenu.Label className="px-1 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted">
              {t("chat.addReaction")}
            </DropdownMenu.Label>
            <div className="grid grid-cols-6 gap-0.5">
              {REACTION_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className="flex size-8 items-center justify-center rounded-md text-lg hover:bg-surface-2"
                  onClick={() => void react(emoji)}
                >
                  <span aria-hidden="true">{emoji}</span>
                  <span className="sr-only">{emoji}</span>
                </button>
              ))}
            </div>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <button type="button" className="message-action" onClick={reply} aria-label={t("chat.reply")} title={t("chat.reply")}>
        <Reply className="size-4 rtl:-scale-x-100" aria-hidden="true" />
      </button>

      {confirming ? (
        <>
          <button
            type="button"
            className="message-action text-danger"
            onClick={() => void remove()}
            aria-label={t("chat.confirmDelete")}
            title={t("chat.delete")}
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="rounded-md px-1.5 text-[10px] font-semibold text-muted hover:bg-surface-2"
            onClick={() => setConfirming(false)}
          >
            {t("common.cancel")}
          </button>
        </>
      ) : (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button type="button" className="message-action" aria-label={t("chat.moreActions")} title={t("chat.moreActions")}>
              <Ellipsis className="size-4" aria-hidden="true" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content sideOffset={6} align="end" className="menu-content">
              {isOwn && (
                <DropdownMenu.Item className="menu-item" onSelect={onEditStart}>
                  <Pencil className="size-4 text-muted" aria-hidden="true" />
                  {t("chat.edit")}
                </DropdownMenu.Item>
              )}
              <DropdownMenu.Item className="menu-item" onSelect={() => void toggleSave()}>
                <Copy className="size-4 text-muted" aria-hidden="true" />
                {saved ? t("chat.unsave") : t("chat.save")}
              </DropdownMenu.Item>
              <DropdownMenu.Item className="menu-item" onSelect={copy}>
                <Copy className="size-4 text-muted" aria-hidden="true" />
                {t("chat.copyText")}
              </DropdownMenu.Item>
              {canManage && (
                <DropdownMenu.Item className="menu-item" onSelect={() => void togglePin()}>
                  {message.pinned ? (
                    <PinOff className="size-4 text-muted" aria-hidden="true" />
                  ) : (
                    <Pin className="size-4 text-muted" aria-hidden="true" />
                  )}
                  {message.pinned ? t("chat.unpin") : t("chat.pin")}
                </DropdownMenu.Item>
              )}
              {canDelete && (
                <DropdownMenu.Item
                  className="menu-item text-danger data-[highlighted]:bg-danger-soft"
                  onSelect={() => setConfirming(true)}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                  {t("chat.delete")}
                </DropdownMenu.Item>
              )}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      )}
    </div>
  );
}
