import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSettingsStore } from "../store/settingsStore";
import type { Locale } from "../types";

const LANGUAGES: Array<{ locale: Locale; label: string }> = [
  { locale: "en", label: "English" },
  { locale: "am", label: "አማርኛ" }
];

export function LanguageMenu({ align = "end" }: { align?: "start" | "center" | "end" }) {
  const { t } = useTranslation();
  const locale = useSettingsStore((state) => state.locale);
  const setLocale = useSettingsStore((state) => state.setLocale);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button type="button" className="icon-button" aria-label={t("settings.language")}>
          <Languages className="size-4" aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align={align} sideOffset={6} className="menu-content">
          <DropdownMenu.Label className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted">
            {t("settings.language")}
          </DropdownMenu.Label>
          {LANGUAGES.map((language) => (
            <DropdownMenu.Item
              key={language.locale}
              className="menu-item"
              lang={language.locale}
              onSelect={() => setLocale(language.locale)}
            >
              <span className="inline-flex size-7 items-center justify-center rounded-md bg-surface-2 text-xs font-bold">
                {language.locale.toUpperCase()}
              </span>
              <span className="flex-1">{language.label}</span>
              {locale === language.locale && (
                <Check className="size-4 text-primary" aria-hidden="true" />
              )}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
