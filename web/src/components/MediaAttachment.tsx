import { FileAudio, FileVideo } from "lucide-react";
import { useTranslation } from "react-i18next";
import { attachmentUrl } from "../lib/api";

export type MediaKind = "image" | "audio" | "video" | "file";

export function mediaKind(reference: string): MediaKind {
  const path = reference.split(/[?#]/)[0]?.toLowerCase() ?? "";
  if (/\.(png|jpe?g|gif|webp|avif)$/.test(path)) return "image";
  if (/\.(mp3|wav|ogg|oga|m4a|aac|weba)$/.test(path)) return "audio";
  if (/\.(mp4|webm|mov|ogv|m4v)$/.test(path)) return "video";
  return "file";
}

export function MediaAttachment({
  reference,
  authorName,
  index
}: {
  reference: string;
  authorName: string;
  index: number;
}) {
  const { t } = useTranslation();
  const kind = mediaKind(reference);
  const url = attachmentUrl(reference);

  if (kind === "image") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer noopener"
        className="message-media block overflow-hidden rounded-lg border border-border bg-surface-2"
      >
        <img
          src={url}
          alt={t("chat.attachmentAlt", { name: authorName })}
          loading="lazy"
          decoding="async"
          className="max-h-[26rem] w-full object-cover"
          data-attachment-index={index}
        />
      </a>
    );
  }

  if (kind === "video") {
    return (
      <div className="message-media overflow-hidden rounded-lg border border-border bg-black/90">
        <video
          src={url}
          controls
          preload="metadata"
          playsInline
          className="max-h-[26rem] w-full"
          aria-label={t("chat.videoMessage", { name: authorName })}
        />
      </div>
    );
  }

  if (kind === "audio") {
    return (
      <div className="message-media flex items-center gap-3 rounded-xl border border-border bg-surface-2 p-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
          <FileAudio className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <audio
            src={url}
            controls
            preload="metadata"
            className="h-9 w-full"
            aria-label={t("chat.voiceMessage", { name: authorName })}
          />
        </div>
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      className="flex items-center gap-2 rounded-lg border border-border bg-surface-2 p-3 text-sm font-medium text-accent hover:underline"
    >
      <FileVideo className="size-4" aria-hidden="true" />
      {t("chat.openAttachment")}
    </a>
  );
}
