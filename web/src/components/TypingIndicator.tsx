import { useTranslation } from "react-i18next";
import type { TypingEntry } from "../types";

export function TypingIndicator({ entries }: { entries: TypingEntry[] }) {
  const { t } = useTranslation();
  const now = Date.now();
  const active = entries.filter((entry) => entry.expiresAt > now);

  if (active.length === 0) return null;

  const label =
    active.length === 1
      ? t("chat.typingOne", { name: active[0]!.displayName })
      : t("chat.typingMany", { count: active.length });

  return (
    <div
      className="flex h-6 items-center gap-1.5 px-5 text-xs text-muted"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="flex gap-0.5" aria-hidden="true">
        <span className="size-1 animate-pulse-dot rounded-full bg-muted" />
        <span
          className="size-1 animate-pulse-dot rounded-full bg-muted"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="size-1 animate-pulse-dot rounded-full bg-muted"
          style={{ animationDelay: "300ms" }}
        />
      </span>
      {label}
    </div>
  );
}
