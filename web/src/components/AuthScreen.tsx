import * as Tabs from "@radix-ui/react-tabs";
import { Eye, EyeOff, Languages, LockKeyhole, Sparkles, Users } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ApiError } from "../lib/api";
import { useAuthStore } from "../store/authStore";
import { useSettingsStore } from "../store/settingsStore";
import { BrandMark } from "./Brand";
import { LanguageMenu } from "./LanguageMenu";
import { ThemeMenu } from "./ThemeMenu";

type Mode = "login" | "register";

function authErrorKey(code: string | null, mode: Mode): string | null {
  if (!code) return null;
  switch (code) {
    case "EMAIL_TAKEN":
      return "auth.emailTaken";
    case "UNAUTHORIZED":
    case "INVALID_CREDENTIALS":
      return "auth.loginFailed";
    case "NETWORK":
      return "errors.network";
    case "VALIDATION_ERROR":
      return "auth.registerFailed";
    default:
      return mode === "login" ? "auth.loginFailed" : "auth.registerFailed";
  }
}

export function AuthScreen() {
  const { t } = useTranslation();
  const locale = useSettingsStore((state) => state.locale);
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const status = useAuthStore((state) => state.status);
  const authError = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const busy = status === "loading";
  const errorMessage = t(authErrorKey(authError, mode) ?? "auth.loginFailed");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    clearError();

    if (!email.includes("@")) {
      setFormError(t("auth.invalidEmail"));
      return;
    }
    if (mode === "register" && displayName.trim().length < 2) {
      setFormError(t("auth.nameTooShort"));
      return;
    }
    if (password.length < (mode === "register" ? 10 : 1)) {
      setFormError(
        mode === "register" ? t("auth.passwordTooShort") : t("auth.loginFailed")
      );
      return;
    }

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register({
          email,
          password,
          displayName: displayName.trim(),
          locale
        });
      }
    } catch (error) {
      if (!(error instanceof ApiError)) setFormError(t("errors.network"));
    }
  }

  function fillDemo() {
    setMode("login");
    setEmail("demo@rustle.local");
    setPassword("DemoPassw0rd!");
    setFormError(null);
    clearError();
  }

  function changeMode(next: string) {
    setMode(next as Mode);
    setFormError(null);
    clearError();
  }

  return (
    <div className="relative grid min-h-dvh overflow-hidden bg-bg lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]">
      <div className="absolute end-4 top-4 z-20 flex items-center gap-1 rounded-full border border-border bg-surface p-1 shadow-soft">
        <LanguageMenu />
        <ThemeMenu />
      </div>

      <section className="relative hidden overflow-hidden bg-rail px-12 py-10 text-rail-text lg:flex lg:flex-col lg:justify-between">
        <div
          className="pointer-events-none absolute -end-40 -top-40 size-[38rem] rounded-full opacity-25 blur-3xl"
          style={{ background: "var(--primary)" }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-56 -start-24 size-[34rem] rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--accent)" }}
          aria-hidden="true"
        />
        <div className="relative flex items-center gap-3">
          <BrandMark className="size-11" />
          <div>
            <p className="text-lg font-bold tracking-tight">{t("app.name")}</p>
            <p className="text-xs text-rail-muted">{t("app.tagline")}</p>
          </div>
        </div>

        <div className="relative max-w-xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-rail-muted">
            <Sparkles className="size-3.5" aria-hidden="true" />
            {t("app.featureBilingual")}
          </div>
          <h1 className="text-balance text-5xl font-bold leading-[1.08] tracking-tight">
            {t("app.heroTitle")}
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-rail-muted">
            {t("app.heroBody")}
          </p>

          <dl className="mt-10 grid gap-4">
            <Feature
              icon={<Users className="size-4" />}
              title={t("app.featureRealtime")}
              body={t("app.featureRealtimeBody")}
            />
            <Feature
              icon={<Languages className="size-4" />}
              title={t("app.featureBilingual")}
              body={t("app.featureBilingualBody")}
            />
            <Feature
              icon={<LockKeyhole className="size-4" />}
              title={t("app.featurePresence")}
              body={t("app.featurePresenceBody")}
            />
          </dl>
        </div>

        <div className="relative flex items-center justify-between text-xs text-rail-muted">
          <span>{t("app.name")} · {t("app.tagline")}</span>
          <span className="font-mono opacity-60">{t("app.stack")}</span>
        </div>
      </section>

      <main className="relative flex items-center justify-center px-5 py-14 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <BrandMark className="size-10" />
            <div>
              <p className="text-lg font-bold">{t("app.name")}</p>
              <p className="text-xs text-muted">{t("app.tagline")}</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold tracking-tight">
            {mode === "login" ? t("auth.signInTitle") : t("auth.signUpTitle")}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            {mode === "login" ? t("auth.signInSubtitle") : t("auth.signUpSubtitle")}
          </p>

          <Tabs.Root value={mode} onValueChange={changeMode} className="mt-7">
            <Tabs.List
              aria-label={t("auth.signIn")}
              className="grid grid-cols-2 rounded-xl border border-border bg-surface-2 p-1"
            >
              <Tabs.Trigger
                value="login"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-muted transition-colors data-[state=active]:bg-surface data-[state=active]:text-text data-[state=active]:shadow-sm"
              >
                {t("auth.signIn")}
              </Tabs.Trigger>
              <Tabs.Trigger
                value="register"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-muted transition-colors data-[state=active]:bg-surface data-[state=active]:text-text data-[state=active]:shadow-sm"
              >
                {t("auth.signUp")}
              </Tabs.Trigger>
            </Tabs.List>

            <form className="mt-6 space-y-4" onSubmit={(event) => void submit(event)}>
              {mode === "register" && (
                <label className="block">
                  <span className="field-label">{t("auth.displayName")}</span>
                  <input
                    className="field"
                    autoComplete="nickname"
                    maxLength={48}
                    placeholder={t("auth.namePlaceholder")}
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    required
                  />
                </label>
              )}

              <label className="block">
                <span className="field-label">{t("auth.email")}</span>
                <input
                  className="field"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  maxLength={254}
                  placeholder={t("auth.emailPlaceholder")}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  dir="ltr"
                />
              </label>

              <label className="block">
                <span className="field-label">{t("auth.password")}</span>
                <span className="relative block">
                  <input
                    className="field pe-11"
                    type={showPassword ? "text" : "password"}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    maxLength={128}
                    placeholder={t("auth.passwordPlaceholder")}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    dir="ltr"
                  />
                  <button
                    type="button"
                    className="absolute end-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted hover:bg-surface-2 hover:text-text"
                    aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
                    onClick={() => setShowPassword((value) => !value)}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" aria-hidden="true" />
                    ) : (
                      <Eye className="size-4" aria-hidden="true" />
                    )}
                  </button>
                </span>
                {mode === "register" && (
                  <span className="mt-1.5 block text-xs text-muted">{t("auth.passwordHint")}</span>
                )}
              </label>

              {(formError || authError) && (
                <p
                  role="alert"
                  className="rounded-lg border border-danger bg-danger-soft px-3 py-2 text-sm text-text"
                >
                  {formError ?? errorMessage}
                </p>
              )}

              <button type="submit" className="btn-primary w-full" disabled={busy}>
                {busy
                  ? t("common.loading")
                  : mode === "login"
                    ? t("auth.signIn")
                    : t("auth.signUp")}
              </button>
            </form>
          </Tabs.Root>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
            <span>
              {mode === "login" ? t("auth.noAccount") : t("auth.haveAccount")}{" "}
              <button
                type="button"
                className="font-semibold text-primary hover:text-primary-hover"
                onClick={() => changeMode(mode === "login" ? "register" : "login")}
              >
                {mode === "login" ? t("auth.signUp") : t("auth.signIn")}
              </button>
            </span>
            <button
              type="button"
              className="font-medium text-accent hover:underline"
              onClick={fillDemo}
            >
              {t("auth.demoFill")}
            </button>
          </div>

          <div className="mt-7 rounded-xl border border-dashed border-border bg-surface-2 px-4 py-3 text-xs text-muted">
            {t("auth.demoHint")}
          </div>
        </div>
      </main>
    </div>
  );
}

function Feature({
  icon,
  title,
  body
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-3.5">
      <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-rail-text">
        {icon}
      </span>
      <div>
        <dt className="text-sm font-semibold">{title}</dt>
        <dd className="mt-0.5 text-sm leading-6 text-rail-muted">{body}</dd>
      </div>
    </div>
  );
}
