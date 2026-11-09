import { create } from "zustand";
import { persist } from "zustand/middleware";
import { detectInitialLocale } from "../i18n";
import type { Locale, ThemeMode } from "../types";

interface SettingsState {
  themeMode: ThemeMode;
  locale: Locale;
  setThemeMode: (mode: ThemeMode) => void;
  setLocale: (locale: Locale) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      themeMode: "system",
      locale: detectInitialLocale(),
      setThemeMode: (themeMode) =>
        set({
          themeMode
        }),
      setLocale: (locale) => set({ locale })
    }),
    {
      name: "rustle-settings",
      partialize: (state) => ({ themeMode: state.themeMode, locale: state.locale })
    }
  )
);

export function resolvedTheme(mode: ThemeMode): "light" | "dark" {
  if (mode === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return mode;
}
