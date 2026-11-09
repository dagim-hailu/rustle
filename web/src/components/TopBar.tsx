import { Bookmark, Hash, Menu, Pin, Settings, Sparkles, Users, Volume2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useChatStore } from "../store/chatStore";
import type { Channel, Guild } from "../types";

export function TopBar({
  guild,
  channel,
  canManage,
  onOpenChannels,
  onOpenPins,
  onOpenSaved,
  onOpenDigest,
  onOpenChannelSettings
}: {
  guild: Guild | null;
  channel: Channel | null;
  canManage: boolean;
  onOpenChannels: () => void;
  onOpenPins: () => void;
  onOpenSaved: () => void;
  onOpenDigest: () => void;
  onOpenChannelSettings: () => void;
}) {
  const { t } = useTranslation();
  const socketStatus = useChatStore((state) => state.socketStatus);
  const unread = useChatStore((state) => state.unread);
  const connected = socketStatus === "connected";
  const reconnecting = socketStatus === "reconnecting";
  const totalUnread = Object.values(unread).reduce((sum, count) => sum + count, 0);

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-surface px-3 sm:px-5">
      <button
        type="button"
        className="icon-button md:hidden"
        onClick={onOpenChannels}
        aria-label={t("nav.openChannels")}
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      <div className="flex min-w-0 flex-1 items-center gap-2">
        {channel?.kind === "voice" ? (
          <Volume2 className="size-4 shrink-0 text-muted" aria-hidden="true" />
        ) : (
          <Hash className="size-4 shrink-0 text-muted" aria-hidden="true" />
        )}
        <h1 className="min-w-0 truncate text-sm font-bold text-text">
          {channel?.name ?? guild?.name ?? t("nav.channels")}
        </h1>
        {channel?.topic && (
          <>
            <span className="hidden h-4 w-px bg-border sm:block" aria-hidden="true" />
            <p className="hidden min-w-0 truncate text-xs text-muted sm:block">
              {channel.topic}
            </p>
          </>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <button
          type="button"
          className="icon-button relative"
          onClick={onOpenDigest}
          aria-label={t("digest.title")}
          title={t("digest.title")}
        >
          <Sparkles className="size-4" aria-hidden="true" />
          {totalUnread > 0 && (
            <span className="absolute -end-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-on-primary">
              {totalUnread > 99 ? "99+" : totalUnread}
            </span>
          )}
        </button>
        <button
          type="button"
          className="icon-button"
          onClick={onOpenSaved}
          aria-label={t("saved.title")}
          title={t("saved.title")}
        >
          <Bookmark className="size-4" aria-hidden="true" />
        </button>
        {channel && (
          <button
            type="button"
            className="icon-button"
            onClick={onOpenPins}
            aria-label={t("pins.title", { channel: channel.name })}
            title={t("pins.title", { channel: channel.name })}
          >
            <Pin className="size-4" aria-hidden="true" />
          </button>
        )}
        {channel && canManage && (
          <button
            type="button"
            className="icon-button"
            onClick={onOpenChannelSettings}
            aria-label={t("permissions.title", { channel: channel.name })}
            title={t("permissions.title", { channel: channel.name })}
          >
            <Settings className="size-4" aria-hidden="true" />
          </button>
        )}
        <span
          className={`hidden items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium sm:flex ${
            connected
              ? "border-border text-muted"
              : reconnecting
                ? "border-warning text-warning"
                : "border-danger text-danger"
          }`}
          role="status"
          aria-live="polite"
        >
          <span
            className={`size-1.5 rounded-full ${
              connected ? "bg-online" : reconnecting ? "bg-idle" : "bg-offline"
            }`}
            aria-hidden="true"
          />
          {connected
            ? t("connection.connected")
            : reconnecting
              ? t("connection.reconnecting")
              : t("connection.offlineShort")}
        </span>
        {guild && (
          <span className="hidden items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-muted sm:flex">
            <Users className="size-3.5" aria-hidden="true" />
            {t("guild.memberCount", { count: guild.members.length })}
          </span>
        )}
      </div>
    </header>
  );
}
