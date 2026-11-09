import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  ChevronDown,
  Hash,
  Plus,
  Settings,
  UserPlus,
  Volume2,
  X
} from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useChatStore } from "../store/chatStore";
import type { Guild, User } from "../types";
import { CallDock } from "./CallDock";
import { UserPanel } from "./UserPanel";

interface Props {
  guild: Guild | null;
  user: User;
  activeChannelId: string | null;
  onSelectChannel: (channelId: string) => void;
  onCreateChannel: () => void;
  onOpenSettings: () => void;
  onOpenInvite: () => void;
  onOpenProfile: () => void;
  onClose?: () => void;
}

export function ChannelSidebar({
  guild,
  user,
  activeChannelId,
  onSelectChannel,
  onCreateChannel,
  onOpenSettings,
  onOpenInvite,
  onOpenProfile,
  onClose
}: Props) {
  const { t } = useTranslation();
  const unread = useChatStore((state) => state.unread);
  const canManage = guild?.role === "owner" || guild?.role === "admin";

  const textChannels = guild?.channels.filter((channel) => channel.kind === "text") ?? [];
  const voiceChannels = guild?.channels.filter((channel) => channel.kind === "voice") ?? [];

  return (
    <div className="flex h-full w-full flex-col bg-surface-2">
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-3">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild disabled={!guild}>
            <button
              type="button"
              className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-1.5 text-start transition-colors hover:bg-surface-3 disabled:opacity-60"
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold text-text">
                  {guild?.name ?? t("nav.servers")}
                </span>
                {guild && (
                  <span className="block text-[11px] font-medium text-muted">
                    {t(
                      guild.role === "owner"
                        ? "guild.roleOwner"
                        : guild.role === "admin"
                          ? "guild.roleAdmin"
                          : "guild.roleMember"
                    )}
                  </span>
                )}
              </span>
              <ChevronDown className="size-4 shrink-0 text-muted" aria-hidden="true" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content align="start" sideOffset={6} className="menu-content">
              {canManage && (
                <DropdownMenu.Item
                  className="menu-item"
                  onSelect={onCreateChannel}
                >
                  <Plus className="size-4 text-muted" aria-hidden="true" />
                  {t("nav.addChannel")}
                </DropdownMenu.Item>
              )}
              {canManage && (
                <DropdownMenu.Item className="menu-item" onSelect={onOpenInvite}>
                  <UserPlus className="size-4 text-muted" aria-hidden="true" />
                  {t("guild.inviteTitle")}
                </DropdownMenu.Item>
              )}
              <DropdownMenu.Item className="menu-item" onSelect={onOpenSettings}>
                <Settings className="size-4 text-muted" aria-hidden="true" />
                {t("guild.settingsTitle")}
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {onClose && (
          <button
            type="button"
            className="icon-button md:hidden"
            onClick={onClose}
            aria-label={t("common.close")}
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin px-2 py-3">
        {guild && textChannels.length > 0 && (
          <ChannelGroup label={t("nav.channels")}>
            {textChannels.map((channel) => {
              const active = activeChannelId === channel.id;
              const count = unread[channel.id] ?? 0;

              return (
                <button
                  key={channel.id}
                  type="button"
                  onClick={() => onSelectChannel(channel.id)}
                  aria-current={active ? "page" : undefined}
                  className={`group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-start text-sm transition-colors ${
                    active
                      ? "bg-surface text-text shadow-sm"
                      : count > 0
                        ? "text-text hover:bg-surface-3"
                        : "text-muted hover:bg-surface-3 hover:text-text"
                  }`}
                >
                  <Hash className="size-4 shrink-0 opacity-70" aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate font-medium">{channel.name}</span>
                  {count > 0 && !active && (
                    <span className="badge" aria-label={`${count}`}>
                      {count > 99 ? "99+" : count}
                    </span>
                  )}
                </button>
              );
            })}
          </ChannelGroup>
        )}

        {guild && voiceChannels.length > 0 && (
          <ChannelGroup label={t("channel.typeVoice")}>
            {voiceChannels.map((channel) => {
              const active = activeChannelId === channel.id;
              return (
                <button
                  key={channel.id}
                  type="button"
                  onClick={() => onSelectChannel(channel.id)}
                  aria-current={active ? "page" : undefined}
                  className={`group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-start text-sm transition-colors ${
                    active
                      ? "bg-surface text-text shadow-sm"
                      : "text-muted hover:bg-surface-3 hover:text-text"
                  }`}
                >
                  <Volume2 className="size-4 shrink-0 opacity-80" aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate font-medium">{channel.name}</span>
                  <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[9px] font-bold uppercase text-faint opacity-0 transition-opacity group-hover:opacity-100">
                    {t("call.join")}
                  </span>
                </button>
              );
            })}
          </ChannelGroup>
        )}

        {guild && textChannels.length === 0 && voiceChannels.length === 0 && (
          <div className="mx-2 rounded-lg border border-dashed border-border p-3 text-center text-xs text-muted">
            {t("channel.empty")}
          </div>
        )}

        {canManage && guild && (
          <button
            type="button"
            onClick={onCreateChannel}
            className="mt-3 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-start text-sm text-muted transition-colors hover:bg-surface-3 hover:text-text"
          >
            <Plus className="size-4" aria-hidden="true" />
            {t("nav.addChannel")}
          </button>
        )}
      </div>

      <CallDock />
      <div className="shrink-0 border-t border-border p-2">
        <UserPanel user={user} onOpenProfile={onOpenProfile} />
      </div>
    </div>
  );
}

function ChannelGroup({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-4">
      <h2 className="px-2 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted">
        {label}
      </h2>
      <div className="space-y-0.5">{children}</div>
    </section>
  );
}
