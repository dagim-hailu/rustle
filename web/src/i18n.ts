import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import am from "./locales/am.json";

export function detectInitialLocale(): "en" | "am" {
  const stored = localStorage.getItem("rustle-settings");
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as { state?: { locale?: string } };
      if (parsed.state?.locale === "am" || parsed.state?.locale === "en") {
        return parsed.state.locale;
      }
    } catch {
      // Fall through to browser detection.
    }
  }

  return navigator.language.toLowerCase().startsWith("am") ? "am" : "en";
}

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    am: { translation: am }
  },
  lng: detectInitialLocale(),
  fallbackLng: "en",
  supportedLngs: ["en", "am"],
  interpolation: { escapeValue: false },
  returnNull: false
});

export default i18n;
