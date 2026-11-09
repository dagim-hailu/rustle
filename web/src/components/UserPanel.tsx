import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, ChevronUp, LogOut, Monitor, Moon, Sun, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Avatar } from "./Avatar";
import { useAuthStore } from "../store/authStore";
import { useChatStore } from "../store/chatStore";
import { useSettingsStore } from "../store/settingsStore";
import { chatSocket } from "../socket/chatSocket";
import type { Locale, PresenceStatus, ThemeMode, User } from "../types";

const STATUSES: Array<{ status: PresenceStatus; label: string }> = [
  { status: "online", label: "presence.online" },
  { status: "idle", label: "presence.idle" },
  { status: "dnd", label: "presence.dnd" }
];

const THEMES: Array<{ mode: ThemeMode; label: string; icon: typeof Sun }> = [
  { mode: "light", label: "settings.light", icon: Sun },
  { mode: "dark", label: "settings.dark", icon: Moon },
  { mode: "system", label: "settings.system", icon: Monitor }
];

const LANGUAGES: Array<{ locale: Locale; label: string }> = [
  { locale: "en", label: "English" },
  { locale: "am", label: "አማርኛ" }
];

export function UserPanel({
  user,
  onOpenProfile
}: {
  user: User;
  onOpenProfile: () => void;
}) {
  const { t } = useTranslation();
  const socketStatus = useChatStore((state) => state.socketStatus);
  const selfStatus = useChatStore((state) => state.selfStatus);
  const locale = useSettingsStore((state) => state.locale);
  const themeMode = useSettingsStore((state) => state.themeMode);
  const setLocale = useSettingsStore((state) => state.setLocale);
  const setThemeMode = useSettingsStore((state) => state.setThemeMode);
  const logout = useAuthStore((state) => state.logout);
  const shownStatus = socketStatus === "connected" ? selfStatus : "offline";

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded-lg border border-transparent px-2 py-2 text-start transition-colors hover:border-border hover:bg-surface-3"
          aria-label={t("settings.account")}
        >
          <Avatar
            name={user.displayName}
            color={user.avatarColor}
            src={user.avatarUrl}
            size="sm"
            presence={shownStatus}
          />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-text">
              {user.displayName}
            </span>
            <span className="block text-[11px] text-muted">
              {t(`presence.${shownStatus}`)}
            </span>
          </span>
          <ChevronUp className="size-4 shrink-0 text-muted" aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content side="top" align="start" sideOffset={8} className="menu-content w-64">
          <DropdownMenu.Item className="menu-item" onSelect={onOpenProfile}>
            <UserRound className="size-4 text-muted" aria-hidden="true" />
            {t("profile.myProfile")}
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="my-1.5 h-px bg-border" />

          <DropdownMenu.Label className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted">
            {t("presence.setStatus")}
          </DropdownMenu.Label>

          {STATUSES.map((entry) => (
            <DropdownMenu.Item
              key={entry.status}
              className="menu-item"
              onSelect={() => chatSocket.setPresence(entry.status)}
            >
              <span
                className={`size-2.5 rounded-full ${
                  entry.status === "online"
                    ? "bg-online"
                    : entry.status === "idle"
                      ? "bg-idle"
                      : "bg-dnd"
                }`}
                aria-hidden="true"
              />
              <span className="flex-1">{t(entry.label)}</span>
              {selfStatus === entry.status && (
                <Check className="size-4 text-primary" aria-hidden="true" />
              )}
            </DropdownMenu.Item>
          ))}

          <DropdownMenu.Separator className="my-1.5 h-px bg-border" />

          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger className="menu-item">
              <span className="flex size-5 items-center justify-center rounded bg-surface-2 text-[10px] font-bold">
                A
              </span>
              <span className="flex-1">{t("settings.language")}</span>
              <span className="text-xs text-muted">{locale.toUpperCase()}</span>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent sideOffset={6} className="menu-content">
                {LANGUAGES.map((language) => (
                  <DropdownMenu.Item
                    key={language.locale}
                    className="menu-item"
                    onSelect={() => setLocale(language.locale)}
                  >
                    <span className="flex-1" lang={language.locale}>
                      {language.label}
                    </span>
                    {locale === language.locale && (
                      <Check className="size-4 text-primary" aria-hidden="true" />
                    )}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>

          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger className="menu-item">
              <Sun className="size-4 text-muted" aria-hidden="true" />
              <span className="flex-1">{t("settings.theme")}</span>
              <span className="text-xs capitalize text-muted">
                {t(
                  themeMode === "light"
                    ? "settings.light"
                    : themeMode === "dark"
                      ? "settings.dark"
                      : "settings.system"
                )}
              </span>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent sideOffset={6} className="menu-content">
                {THEMES.map((theme) => {
                  const Icon = theme.icon;
                  return (
                    <DropdownMenu.Item
                      key={theme.mode}
                      className="menu-item"
                      onSelect={() => setThemeMode(theme.mode)}
                    >
                      <Icon className="size-4 text-muted" aria-hidden="true" />
                      <span className="flex-1">{t(theme.label)}</span>
                      {themeMode === theme.mode && (
                        <Check className="size-4 text-primary" aria-hidden="true" />
                      )}
                    </DropdownMenu.Item>
                  );
                })}
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>

          <DropdownMenu.Separator className="my-1.5 h-px bg-border" />

          <DropdownMenu.Item className="menu-item text-danger" onSelect={() => logout()}>
            <LogOut className="size-4" aria-hidden="true" />
            {t("settings.signOut")}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
