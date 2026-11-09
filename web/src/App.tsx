import { useEffect, useRef } from "react";
import i18n from "./i18n";
import { AuthScreen } from "./components/AuthScreen";
import { ErrorToast } from "./components/ErrorToast";
import { Workspace } from "./components/Workspace";
import { BrandMark } from "./components/Brand";
import { useAuthStore } from "./store/authStore";
import { useChatStore } from "./store/chatStore";
import { useSettingsStore } from "./store/settingsStore";
import { chatSocket } from "./socket/chatSocket";
import type { Locale } from "./types";

const RTL_LOCALES: Locale[] = [];

function useThemeSync() {
  const themeMode = useSettingsStore((state) => state.themeMode);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const resolved =
        themeMode === "system" ? (media.matches ? "dark" : "light") : themeMode;
      document.documentElement.dataset.theme = resolved;
    };

    apply();
    if (themeMode === "system") media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [themeMode]);
}

function useLocaleSync() {
  const locale = useSettingsStore((state) => state.locale);

  useEffect(() => {
    void i18n.changeLanguage(locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = RTL_LOCALES.includes(locale) ? "rtl" : "ltr";
  }, [locale]);
}

function useActivityPresence(enabled: boolean) {
  const lastActivity = useRef(Date.now());

  useEffect(() => {
    if (!enabled) return;

    const markActive = () => {
      const now = Date.now();
      lastActivity.current = now;
      const status = useChatStore.getState().selfStatus;
      if (status === "idle") chatSocket.setPresence("online");
    };

    const events: Array<keyof WindowEventMap> = [
      "pointerdown",
      "keydown",
      "touchstart",
      "wheel"
    ];

    for (const event of events) {
      window.addEventListener(event, markActive, { passive: true });
    }

    const interval = setInterval(() => {
      if (useChatStore.getState().socketStatus !== "connected") return;
      const status = useChatStore.getState().selfStatus;
      if (status === "online" && Date.now() - lastActivity.current > 60_000) {
        chatSocket.setPresence("idle");
      }
    }, 5_000);

    return () => {
      for (const event of events) window.removeEventListener(event, markActive);
      clearInterval(interval);
    };
  }, [enabled]);
}

export function App() {
  useThemeSync();
  useLocaleSync();

  const token = useAuthStore((state) => state.token);
  const bootstrap = useAuthStore((state) => state.bootstrap);
  const status = useAuthStore((state) => state.status);
  const error = useAuthStore((state) => state.error);
  const user = useAuthStore((state) => state.user);
  const restore = useAuthStore((state) => state.restore);
  const logout = useAuthStore((state) => state.logout);

  useActivityPresence(Boolean(token && bootstrap));

  useEffect(() => {
    if (token && status === "idle") void restore();
  }, [token, status, restore]);

  useEffect(() => {
    if (!token) {
      chatSocket.disconnect();
      useChatStore.getState().reset();
    }
  }, [token]);

  useEffect(() => {
    if (token && status === "ready" && bootstrap) {
      chatSocket.connect(token);
      useChatStore.getState().initialize(bootstrap);
      chatSocket.subscribeToChannels(
        bootstrap.guilds.flatMap((guild) =>
          guild.channels
            .filter((channel) => channel.kind === "text")
            .map((channel) => channel.id)
        )
      );
    }
  }, [token, status, bootstrap]);

  useEffect(() => {
    if (!token || status !== "ready") return;
    const interval = setInterval(() => {
      chatSocket.heartbeat(useChatStore.getState().selfStatus);
    }, 15_000);
    return () => clearInterval(interval);
  }, [token, status]);

  useEffect(() => {
    const handleAuthExpired = () => logout();
    window.addEventListener("rustle:auth-expired", handleAuthExpired);
    return () => window.removeEventListener("rustle:auth-expired", handleAuthExpired);
  }, [logout]);

  if (!token) return <AuthScreen />;

  if (status === "error" && !bootstrap) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bg p-6">
        <div className="panel w-full max-w-md p-8 text-center">
          <BrandMark className="mx-auto size-12" />
          <h1 className="mt-5 text-xl font-bold">{i18n.t("errors.loadWorkspace")}</h1>
          <p className="mt-2 text-sm text-muted">
            {i18n.t(error === "NETWORK" ? "errors.network" : "errors.generic")}
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <button type="button" className="btn-primary" onClick={() => void restore()}>
              {i18n.t("common.retry")}
            </button>
            <button type="button" className="btn-secondary" onClick={logout}>
              {i18n.t("settings.signOut")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!bootstrap || !user) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-bg text-muted">
        <BrandMark className="size-12 animate-pulse-dot" />
        <p className="text-sm">{i18n.t("common.loading")}</p>
      </div>
    );
  }

  return (
    <>
      <Workspace />
      <ErrorToast />
    </>
  );
}
