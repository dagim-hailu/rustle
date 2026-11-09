import { AlertCircle, CornerUpLeft, Clock3, Pencil, RotateCw } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../lib/api";
import { formatDayLabel, formatFullDate, formatTime, isSameDay } from "../lib/format";
import { chatSocket } from "../socket/chatSocket";
import { useAuthStore } from "../store/authStore";
import { useChatStore } from "../store/chatStore";
import type { ChatMessageView } from "../types";
import { Avatar } from "./Avatar";
import { MediaAttachment } from "./MediaAttachment";
import { MessageActions } from "./MessageActions";
import { MessageContent } from "./MessageContent";
import { ReactionBar } from "./ReactionBar";

export function MessageRow({
  message,
  previous,
  currentUserId,
  canManage
}: {
  message: ChatMessageView;
  previous?: ChatMessageView;
  currentUserId: string | null;
  canManage: boolean;
}) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const token = useAuthStore((state) => state.token);
  const applyChannelEvent = useChatStore((state) => state.applyChannelEvent);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(message.content);
  const [saving, setSaving] = useState(false);

  const grouped =
    Boolean(previous) &&
    !message.replyTo &&
    previous!.authorId === message.authorId &&
    message.timestampMs - previous!.timestampMs < 5 * 60_000 &&
    isSameDay(previous!.timestampMs, message.timestampMs);
  const showDay = !previous || !isSameDay(previous.timestampMs, message.timestampMs);
  const isOwn = message.authorId === currentUserId;
  const deleted = Boolean(message.deleted);

  function jumpToReply(replyId: string) {
    document
      .getElementById(`message-${replyId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function saveEdit() {
    const content = draft.trim();
    if (!token || !content || content === message.content) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      const result = await api.editMessage(token, message.channelId, message.id, content);
      applyChannelEvent({
        type: "edit",
        channelId: message.channelId,
        messageId: message.id,
        content: result.content,
        editedAt: result.editedAt
      });
      setEditing(false);
    } catch {
      // Keep the editor open so the user can retry.
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="px-3 sm:px-6">
      <div className="mx-auto max-w-4xl">
        {showDay && (
          <div className="flex items-center gap-3 py-5" role="separator">
            <span className="h-px flex-1 bg-border" aria-hidden="true" />
            <span className="rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-semibold text-muted">
              {formatDayLabel(message.timestampMs, locale, (key) => t(key))}
            </span>
            <span className="h-px flex-1 bg-border" aria-hidden="true" />
          </div>
        )}

        <article
          id={`message-${message.id}`}
          className={`group relative flex gap-3 rounded-lg px-2 py-1 transition-colors hover:bg-surface-2 ${
            grouped ? "mt-0.5" : "mt-3"
          }`}
          aria-label={`${message.authorName}, ${formatFullDate(
            message.timestampMs,
            locale
          )} ${formatTime(message.timestampMs, locale)}`}
        >
          <div className="w-9 shrink-0 pt-0.5">
            {!grouped && (
              <Avatar
                name={message.authorName}
                color={message.authorColor}
                src={message.authorAvatarUrl}
                size="sm"
              />
            )}
          </div>

          <div className="min-w-0 flex-1">
            {!grouped && (
              <div className="mb-0.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="text-sm font-semibold text-text">
                  {message.authorName}
                </span>
                {isOwn && (
                  <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] font-medium text-muted">
                    {t("common.you")}
                  </span>
                )}
                <time
                  className="text-[11px] text-muted"
                  dateTime={new Date(message.timestampMs).toISOString()}
                  title={formatFullDate(message.timestampMs, locale)}
                >
                  {formatTime(message.timestampMs, locale)}
                </time>
              </div>
            )}

            {message.replyTo && !deleted && (
              <button
                type="button"
                onClick={() => jumpToReply(message.replyTo!.id)}
                className="mb-1 flex max-w-full items-center gap-1.5 text-left text-xs text-muted hover:text-text"
              >
                <CornerUpLeft className="size-3 shrink-0" aria-hidden="true" />
                <span className="font-semibold text-text/90">
                  {message.replyTo.authorName}
                </span>
                <span className="min-w-0 truncate opacity-80">
                  {message.replyTo.content || t("chat.attachmentOnly")}
                </span>
              </button>
            )}

            {editing ? (
              <div className="max-w-2xl">
                <textarea
                  autoFocus
                  value={draft}
                  dir="auto"
                  rows={1}
                  maxLength={4000}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      void saveEdit();
                    }
                    if (event.key === "Escape") {
                      setEditing(false);
                      setDraft(message.content);
                    }
                  }}
                  className="field min-h-[38px] resize-y py-2 text-sm"
                />
                <div className="mt-1 flex items-center gap-2 text-[11px]">
                  <span className="text-muted">{t("chat.editHint")}</span>
                  <button
                    type="button"
                    className="font-semibold text-accent hover:underline"
                    disabled={saving}
                    onClick={() => void saveEdit()}
                  >
                    {saving ? t("common.loading") : t("chat.saveEdit")}
                  </button>
                  <button
                    type="button"
                    className="font-semibold text-muted hover:underline"
                    onClick={() => {
                      setEditing(false);
                      setDraft(message.content);
                    }}
                  >
                    {t("common.cancel")}
                  </button>
                </div>
              </div>
            ) : deleted ? (
              <p className="text-[14px] italic leading-[1.6] text-faint">
                {t("chat.deletedMessage")}
              </p>
            ) : (
              <>
                {message.content && <MessageContent content={message.content} />}
                {message.editedAt != null && (
                  <span className="ms-1 align-baseline text-[10px] text-faint">
                    <Pencil className="inline size-2.5" aria-hidden="true" /> {t("chat.edited")}
                  </span>
                )}
              </>
            )}

            {!deleted && message.attachments.length > 0 && (
              <div className="mt-2 grid max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2">
                {message.attachments.map((attachment, index) => (
                  <div
                    key={`${message.id}-${attachment}`}
                    className={
                      message.attachments.length === 1
                        ? "sm:col-span-2"
                        : "min-w-0"
                    }
                  >
                    <MediaAttachment
                      reference={attachment}
                      authorName={message.authorName}
                      index={index}
                    />
                  </div>
                ))}
              </div>
            )}

            {!deleted && <ReactionBar message={message} />}

            {message.status !== "COMMITTED" && (
              <div className="mt-1.5 flex items-center gap-2 text-[11px]">
                {message.status === "PENDING" ? (
                  <span className="inline-flex items-center gap-1 text-muted">
                    <Clock3 className="size-3" aria-hidden="true" />
                    {t("chat.sending")}
                  </span>
                ) : (
                  <>
                    <span className="inline-flex items-center gap-1 font-medium text-danger">
                      <AlertCircle className="size-3" aria-hidden="true" />
                      {t("chat.failed")}
                    </span>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 font-semibold text-accent hover:underline"
                      onClick={() =>
                        message.clientId &&
                        chatSocket.retryMessage(message.channelId, message.clientId)
                      }
                    >
                      <RotateCw className="size-3" aria-hidden="true" />
                      {t("chat.retry")}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <MessageActions
            message={message}
            canManage={canManage}
            onEditStart={() => {
              setDraft(message.content);
              setEditing(true);
            }}
          />
        </article>
      </div>
    </div>
  );
}
