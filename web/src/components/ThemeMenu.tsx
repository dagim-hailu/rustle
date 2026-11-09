import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSettingsStore } from "../store/settingsStore";
import type { ThemeMode } from "../types";

const OPTIONS: Array<{ mode: ThemeMode; icon: typeof Sun; labelKey: string }> = [
  { mode: "light", icon: Sun, labelKey: "settings.light" },
  { mode: "dark", icon: Moon, labelKey: "settings.dark" },
  { mode: "system", icon: Monitor, labelKey: "settings.system" }
];

export function ThemeMenu({ align = "end" }: { align?: "start" | "center" | "end" }) {
  const { t } = useTranslation();
  const themeMode = useSettingsStore((state) => state.themeMode);
  const setThemeMode = useSettingsStore((state) => state.setThemeMode);
  const CurrentIcon = OPTIONS.find((option) => option.mode === themeMode)?.icon ?? Monitor;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="icon-button"
          aria-label={t("settings.theme")}
        >
          <CurrentIcon className="size-4" aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align={align} sideOffset={6} className="menu-content">
          <DropdownMenu.Label className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted">
            {t("settings.theme")}
          </DropdownMenu.Label>
          {OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <DropdownMenu.Item
                key={option.mode}
                className="menu-item"
                onSelect={() => setThemeMode(option.mode)}
              >
                <Icon className="size-4 text-muted" aria-hidden="true" />
                <span className="flex-1">{t(option.labelKey)}</span>
                {themeMode === option.mode && (
                  <Check className="size-4 text-primary" aria-hidden="true" />
                )}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
