import { CornerUpLeft, ImagePlus, LoaderCircle, Mic, Send, Video, X } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent
} from "react";
import { useTranslation } from "react-i18next";
import { api, attachmentUrl } from "../lib/api";
import { mediaKind } from "./MediaAttachment";
import { chatSocket } from "../socket/chatSocket";
import { useAuthStore } from "../store/authStore";
import { useChatStore } from "../store/chatStore";
import type { Channel, UploadKind } from "../types";
import { MediaRecorderDialog } from "./MediaRecorderDialog";

export function Composer({ channel }: { channel: Channel }) {
  const { t } = useTranslation();
  const token = useAuthStore((state) => state.token);
  const replyTarget = useChatStore((state) =>
    state.replyTarget?.channelId === channel.id ? state.replyTarget : null
  );
  const setReplyTarget = useChatStore((state) => state.setReplyTarget);
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recorderOpen, setRecorderOpen] = useState(false);
  const [recordKind, setRecordKind] = useState<"audio" | "video">("audio");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingStopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTypingSent = useRef(0);

  useEffect(() => {
    textareaRef.current?.focus();
    setContent("");
    setAttachments([]);
    setError(null);
  }, [channel.id]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 176)}px`;
  }, [content]);

  useEffect(
    () => () => {
      if (typingStopTimer.current) clearTimeout(typingStopTimer.current);
      chatSocket.sendTyping(channel.id, false);
    },
    [channel.id]
  );

  useEffect(() => {
    if (replyTarget) textareaRef.current?.focus();
  }, [replyTarget]);

  function signalTyping() {
    const now = Date.now();
    if (now - lastTypingSent.current > 2_000) {
      lastTypingSent.current = now;
      chatSocket.sendTyping(channel.id, true);
    }
    if (typingStopTimer.current) clearTimeout(typingStopTimer.current);
    typingStopTimer.current = setTimeout(() => {
      chatSocket.sendTyping(channel.id, false);
    }, 2_800);
  }

  function stopTyping() {
    if (typingStopTimer.current) clearTimeout(typingStopTimer.current);
    lastTypingSent.current = 0;
    chatSocket.sendTyping(channel.id, false);
  }

  function send() {
    const trimmed = content.trimEnd();
    if ((!trimmed.trim() && attachments.length === 0) || uploading) return;

    chatSocket.sendMessage(channel.id, trimmed, attachments);
    setContent("");
    setAttachments([]);
    setError(null);
    stopTyping();
    requestAnimationFrame(() => textareaRef.current?.focus());
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    send();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      send();
    }
  }

  async function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0 || !token) return;

    const remaining = 10 - attachments.length;
    if (files.length > remaining) {
      setError("upload");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      for (const file of files) {
        const kind: UploadKind | null = file.type.startsWith("image/")
          ? "image"
          : file.type.startsWith("audio/")
            ? "audio"
            : file.type.startsWith("video/")
              ? "video"
              : null;
        if (!kind) {
          setError("upload");
          continue;
        }
        const result = await api.upload(token, file, kind);
        setAttachments((current) => [...current, result.url]);
      }
    } catch {
      setError("upload");
      useChatStore.getState().setError("UPLOAD_FAILED");
    } finally {
      setUploading(false);
    }
  }

  const overLimit = content.length > 3_500;

  return (
    <div className="shrink-0 border-t border-border bg-surface px-3 pb-3 pt-2 sm:px-5 sm:pb-4">
      <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
        {replyTarget && (
          <div className="mb-2 flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-2 text-xs">
            <CornerUpLeft className="size-3.5 shrink-0 text-accent" aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate text-muted">
              {t("chat.replyingTo", { name: replyTarget.authorName })}
              <span className="text-faint"> · {replyTarget.content}</span>
            </span>
            <button
              type="button"
              className="icon-button size-7"
              onClick={() => setReplyTarget(null)}
              aria-label={t("chat.cancelReply")}
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          </div>
        )}

        {attachments.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {attachments.map((attachment) => {
              const kind = mediaKind(attachment);
              return (
                <div
                  key={attachment}
                  className="group relative overflow-hidden rounded-lg border border-border bg-surface-2"
                >
                  {kind === "image" ? (
                    <img
                      src={attachmentUrl(attachment)}
                      alt=""
                      className="h-20 w-28 object-cover"
                    />
                  ) : kind === "video" ? (
                    <video
                      src={attachmentUrl(attachment)}
                      muted
                      playsInline
                      preload="metadata"
                      className="h-20 w-28 object-cover"
                    />
                  ) : kind === "audio" ? (
                    <div className="flex h-20 w-40 items-center px-2">
                      <audio
                        src={attachmentUrl(attachment)}
                        controls
                        preload="metadata"
                        className="h-8 w-full"
                      />
                    </div>
                  ) : (
                    <div className="flex h-20 w-28 items-center justify-center px-2 text-center text-[10px] text-muted">
                      {t("chat.openAttachment")}
                    </div>
                  )}
                  <button
                    type="button"
                    className="absolute end-1 top-1 inline-flex size-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                    aria-label={t("chat.removeAttachment")}
                    onClick={() =>
                      setAttachments((current) =>
                        current.filter((item) => item !== attachment)
                      )
                    }
                  >
                    <X className="size-3.5" aria-hidden="true" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {uploading && (
          <p className="mb-1.5 inline-flex items-center gap-1.5 text-xs text-muted">
            <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" />
            {t("chat.uploading")}
          </p>
        )}

        {error && (
          <p className="mb-1.5 text-xs font-medium text-danger">{t(`errors.${error}`)}</p>
        )}

        <div className="flex items-end gap-2 rounded-xl border border-border bg-surface-2 p-1.5 focus-within:border-focus">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/gif,image/webp,audio/*,video/*"
            multiple
            className="sr-only"
            onChange={(event) => void handleFiles(event)}
            aria-label={t("chat.uploadMedia")}
          />
          <button
            type="button"
            className="icon-button mb-0.5"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            aria-label={t("chat.uploadMedia")}
            title={t("chat.uploadMedia")}
          >
            <ImagePlus className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="icon-button mb-0.5"
            onClick={() => {
              setRecordKind("audio");
              setRecorderOpen(true);
            }}
            disabled={uploading}
            aria-label={t("chat.recordVoice")}
            title={t("chat.recordVoice")}
          >
            <Mic className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="icon-button mb-0.5"
            onClick={() => {
              setRecordKind("video");
              setRecorderOpen(true);
            }}
            disabled={uploading}
            aria-label={t("chat.recordVideo")}
            title={t("chat.recordVideo")}
          >
            <Video className="size-5" aria-hidden="true" />
          </button>

          <textarea
            ref={textareaRef}
            rows={1}
            maxLength={4_000}
            value={content}
            dir="auto"
            placeholder={t("chat.placeholder", { channel: channel.name })}
            aria-label={t("chat.messageInput")}
            onChange={(event) => {
              setContent(event.target.value);
              if (event.target.value.trim()) signalTyping();
              else stopTyping();
            }}
            onKeyDown={handleKeyDown}
            onBlur={stopTyping}
            className="max-h-44 min-h-[36px] flex-1 resize-none bg-transparent px-1 py-2 text-sm leading-6 text-text placeholder:text-faint focus:outline-none"
          />

          <button
            type="submit"
            disabled={(!content.trim() && attachments.length === 0) || uploading}
            className="mb-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-on-primary transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={t("chat.send")}
          >
            <Send className="size-4 rtl:-scale-x-100" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-1.5 flex items-center justify-between px-1 text-[10px] text-faint">
          <span>{t("chat.composerHint")}</span>
          {overLimit && (
            <span className={content.length >= 4_000 ? "text-danger" : "text-warning"}>
              {content.length} / 4000
            </span>
          )}
        </div>
      </form>

      <MediaRecorderDialog
        open={recorderOpen}
        kind={recordKind}
        token={token}
        onOpenChange={setRecorderOpen}
        onUploaded={(result) =>
          setAttachments((current) =>
            current.length >= 10 ? current : [...current, result.url]
          )
        }
      />
    </div>
  );
}
