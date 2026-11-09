import * as Dialog from "@radix-ui/react-dialog";
import {
  Check,
  Camera,
  ChevronRight,
  ImagePlus,
  Languages,
  Laptop,
  LockKeyhole,
  LogOut,
  MessageSquareText,
  Mic,
  Monitor,
  Moon,
  Palette,
  Save,
  Sun,
  UserRound,
  Video,
  X
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent
} from "react";
import { useTranslation } from "react-i18next";
import { api, ApiError, attachmentUrl } from "../lib/api";
import { chatSocket } from "../socket/chatSocket";
import { useAuthStore } from "../store/authStore";
import { useSettingsStore } from "../store/settingsStore";
import type { Locale, ThemeMode, User } from "../types";
import { Avatar } from "./Avatar";
import { ProfileCard } from "./ProfileCard";

type Tab = "account" | "profile" | "status" | "appearance" | "language" | "voice";

const AVATAR_COLORS = [
  "#B7410E",
  "#0F6B6B",
  "#7C3AED",
  "#BE123C",
  "#2563EB",
  "#15803D",
  "#A16207",
  "#475569"
];

const BANNER_COLORS = [
  "#0F4C5C",
  "#B7410E",
  "#4C1D95",
  "#831843",
  "#1E3A8A",
  "#14532D",
  "#713F12",
  "#1F2937"
];

export function ProfileSettingsDialog({
  open,
  onOpenChange,
  user
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
}) {
  const { t } = useTranslation();
  const token = useAuthStore((state) => state.token);
  const applyProfile = useAuthStore((state) => state.applyProfile);
  const logout = useAuthStore((state) => state.logout);
  const locale = useSettingsStore((state) => state.locale);
  const themeMode = useSettingsStore((state) => state.themeMode);
  const setLocale = useSettingsStore((state) => state.setLocale);
  const setThemeMode = useSettingsStore((state) => state.setThemeMode);

  const [tab, setTab] = useState<Tab>("profile");
  const [displayName, setDisplayName] = useState(user.displayName);
  const [pronouns, setPronouns] = useState(user.pronouns);
  const [bio, setBio] = useState(user.bio);
  const [avatarColor, setAvatarColor] = useState(user.avatarColor);
  const [bannerColor, setBannerColor] = useState(user.bannerColor);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user.avatarUrl);
  const [bannerUrl, setBannerUrl] = useState<string | null>(user.bannerUrl);
  const [statusText, setStatusText] = useState(user.statusText);
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(user.quietHoursEnabled);
  const [quietHoursStart, setQuietHoursStart] = useState(user.quietHoursStart);
  const [quietHoursEnd, setQuietHoursEnd] = useState(user.quietHoursEnd);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState<User>(user);
  const avatarInput = useRef<HTMLInputElement>(null);
  const bannerInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setDisplayName(user.displayName);
    setPronouns(user.pronouns);
    setBio(user.bio);
    setAvatarColor(user.avatarColor);
    setBannerColor(user.bannerColor);
    setAvatarUrl(user.avatarUrl);
    setBannerUrl(user.bannerUrl);
    setStatusText(user.statusText);
    setQuietHoursEnabled(user.quietHoursEnabled);
    setQuietHoursStart(user.quietHoursStart);
    setQuietHoursEnd(user.quietHoursEnd);
    setPreview(user);
    setError(null);
    setSaved(false);
  }, [open]);

  useEffect(() => {
    setPreview({
      ...user,
      displayName,
      pronouns,
      bio,
      avatarColor,
      bannerColor,
      avatarUrl,
      bannerUrl,
      statusText
    });
  }, [user, displayName, pronouns, bio, avatarColor, bannerColor, avatarUrl, bannerUrl, statusText]);

  async function uploadImage(event: ChangeEvent<HTMLInputElement>, target: "avatar" | "banner") {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !token) return;
    if (!file.type.startsWith("image/")) {
      setError("PROFILE_IMAGE_ONLY");
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const result = await api.upload(token, file, "image");
      if (target === "avatar") setAvatarUrl(result.url);
      else setBannerUrl(result.url);
      setSaved(false);
    } catch (uploadError) {
      setError(uploadError instanceof ApiError ? uploadError.code : "UPLOAD_FAILED");
    } finally {
      setBusy(false);
    }
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!token) return;
    setBusy(true);
    setError(null);
    setSaved(false);

    try {
      const result = await api.updateProfile(token, {
        displayName,
        pronouns,
        bio,
        avatarColor,
        bannerColor,
        avatarUrl,
        bannerUrl,
        locale,
        statusText,
        quietHoursEnabled,
        quietHoursStart,
        quietHoursEnd
      });
      applyProfile(result.user, result.token);
      chatSocket.refreshSession(result.token);
      setSaved(true);
    } catch (saveError) {
      setError(saveError instanceof ApiError ? saveError.code : "PROFILE_SAVE_FAILED");
    } finally {
      setBusy(false);
    }
  }

  const tabs: Array<{ id: Tab; label: string; icon: typeof UserRound }> = [
    { id: "account", label: t("profile.myAccount"), icon: UserRound },
    { id: "profile", label: t("profile.profile"), icon: ImagePlus },
    { id: "status", label: t("settings.status"), icon: MessageSquareText },
    { id: "appearance", label: t("profile.appearance"), icon: Palette },
    { id: "language", label: t("settings.language"), icon: Languages },
    { id: "voice", label: t("profile.voiceVideo"), icon: Video }
  ];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="fixed inset-0 z-50 flex items-stretch justify-center p-0 focus:outline-none sm:items-center sm:p-6">
          <div className="flex h-full w-full max-w-5xl flex-col overflow-hidden border border-border bg-surface shadow-panel sm:h-[86vh] sm:rounded-2xl">
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-5">
              <div>
                <Dialog.Title className="text-sm font-bold text-text">
                  {t("profile.settingsTitle")}
                </Dialog.Title>
                <Dialog.Description className="text-[11px] text-muted">
                  {t("profile.settingsSubtitle")}
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button type="button" className="icon-button" aria-label={t("common.close")}>
                  <X className="size-5" aria-hidden="true" />
                </button>
              </Dialog.Close>
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)]">
              <nav className="hidden overflow-y-auto border-e border-border bg-surface-2 p-3 md:block">
                <p className="px-2 pb-2 pt-1 text-[10px] font-bold uppercase tracking-wider text-muted">
                  {t("profile.userSettings")}
                </p>
                {tabs.map((entry) => {
                  const Icon = entry.icon;
                  return (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => setTab(entry.id)}
                      className={`mb-0.5 flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-start text-sm font-medium transition-colors ${
                        tab === entry.id
                          ? "bg-surface text-text shadow-sm"
                          : "text-muted hover:bg-surface-3 hover:text-text"
                      }`}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                      <span className="flex-1">{entry.label}</span>
                      <ChevronRight className="size-3.5 opacity-50" aria-hidden="true" />
                    </button>
                  );
                })}
                <div className="my-3 h-px bg-border" />
                <button
                  type="button"
                  onClick={logout}
                  className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-start text-sm font-medium text-danger hover:bg-danger-soft"
                >
                  <LogOut className="size-4" aria-hidden="true" />
                  {t("settings.signOut")}
                </button>
              </nav>

              <div className="min-h-0 overflow-y-auto scrollbar-thin">
                <div className="flex gap-1 overflow-x-auto border-b border-border p-2 md:hidden">
                  {tabs.map((entry) => (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => setTab(entry.id)}
                      className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-semibold ${
                        tab === entry.id ? "bg-surface-3 text-text" : "text-muted"
                      }`}
                    >
                      {entry.label}
                    </button>
                  ))}
                </div>

                <div className="p-5 sm:p-7">
                  {tab === "account" && (
                    <AccountPanel
                      user={user}
                      token={token}
                      error={error}
                      onSignOut={logout}
                      onError={setError}
                    />
                  )}

                  {tab === "profile" && (
                    <form onSubmit={(event) => void save(event)}>
                      <SectionTitle
                        title={t("profile.profile")}
                        body={t("profile.profileBody")}
                      />

                      <div className="relative mb-14">
                        <div
                          className="relative h-32 overflow-hidden rounded-xl border border-border bg-surface-2"
                          style={
                            bannerUrl
                              ? {
                                  backgroundImage: `url(${attachmentUrl(bannerUrl)})`,
                                  backgroundSize: "cover",
                                  backgroundPosition: "center"
                                }
                              : { backgroundColor: bannerColor }
                          }
                        >
                          <button
                            type="button"
                            className="absolute end-2 top-2 inline-flex items-center gap-1.5 rounded-md bg-black/45 px-2.5 py-1.5 text-[11px] font-semibold text-white backdrop-blur hover:bg-black/65"
                            onClick={() => bannerInput.current?.click()}
                          >
                            <ImagePlus className="size-3.5" aria-hidden="true" />
                            {t("profile.changeBanner")}
                          </button>
                          <input
                            ref={bannerInput}
                            type="file"
                            accept="image/png,image/jpeg,image/gif,image/webp"
                            className="sr-only"
                            aria-label={t("profile.changeBanner")}
                            onChange={(event) => void uploadImage(event, "banner")}
                          />
                        </div>

                        <div className="absolute -bottom-10 start-5">
                          <button
                            type="button"
                            className="group relative rounded-full"
                            onClick={() => avatarInput.current?.click()}
                            aria-label={t("profile.changeAvatar")}
                          >
                            <Avatar
                              name={displayName}
                              color={avatarColor}
                              src={avatarUrl}
                              size="xl"
                              className="[&>img]:ring-4 [&>span]:ring-4 [&>img]:ring-surface [&>span]:ring-surface"
                            />
                            <span className="absolute inset-0 inline-flex items-center justify-center rounded-full bg-black/55 text-white opacity-0 transition-opacity group-hover:opacity-100">
                              <Camera className="size-5" aria-hidden="true" />
                            </span>
                          </button>
                          <input
                            ref={avatarInput}
                            type="file"
                            accept="image/png,image/jpeg,image/gif,image/webp"
                            className="sr-only"
                            aria-label={t("profile.changeAvatar")}
                            onChange={(event) => void uploadImage(event, "avatar")}
                          />
                        </div>
                      </div>

                      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
                        <div className="space-y-4">
                          <label className="block">
                            <span className="field-label">{t("auth.displayName")}</span>
                            <input
                              className="field"
                              value={displayName}
                              maxLength={48}
                              minLength={2}
                              required
                              onChange={(event) => setDisplayName(event.target.value)}
                            />
                          </label>

                          <label className="block">
                            <span className="field-label">{t("profile.pronouns")}</span>
                            <input
                              className="field"
                              value={pronouns}
                              maxLength={40}
                              placeholder={t("profile.pronounsPlaceholder")}
                              onChange={(event) => setPronouns(event.target.value)}
                            />
                          </label>

                          <label className="block">
                            <span className="field-label">{t("profile.bio")}</span>
                            <textarea
                              className="field min-h-28 resize-y"
                              value={bio}
                              maxLength={190}
                              dir="auto"
                              placeholder={t("profile.bioPlaceholder")}
                              onChange={(event) => setBio(event.target.value)}
                            />
                            <span className="mt-1 block text-end text-[10px] text-faint">
                              {bio.length} / 190
                            </span>
                          </label>

                          <ColorField
                            label={t("profile.avatarColor")}
                            value={avatarColor}
                            colors={AVATAR_COLORS}
                            onChange={setAvatarColor}
                          />

                          <ColorField
                            label={t("profile.bannerColor")}
                            value={bannerColor}
                            colors={BANNER_COLORS}
                            onChange={setBannerColor}
                          />

                          {(avatarUrl || bannerUrl) && (
                            <div className="flex flex-wrap gap-2">
                              {avatarUrl && (
                                <button
                                  type="button"
                                  className="btn-secondary text-xs"
                                  onClick={() => setAvatarUrl(null)}
                                >
                                  {t("profile.removeAvatar")}
                                </button>
                              )}
                              {bannerUrl && (
                                <button
                                  type="button"
                                  className="btn-secondary text-xs"
                                  onClick={() => setBannerUrl(null)}
                                >
                                  {t("profile.removeBanner")}
                                </button>
                              )}
                            </div>
                          )}

                          {error && (
                            <p role="alert" className="rounded-lg border border-danger bg-danger-soft px-3 py-2 text-sm text-text">
                              {t(`errors.${error}`, { defaultValue: t("errors.generic") })}
                            </p>
                          )}

                          <div className="flex items-center gap-2 pt-1">
                            <button type="submit" className="btn-primary" disabled={busy}>
                              <Save className="size-4" aria-hidden="true" />
                              {busy ? t("common.loading") : t("common.save")}
                            </button>
                            {saved && (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                                <Check className="size-3.5" aria-hidden="true" />
                                {t("profile.saved")}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="lg:pt-1">
                          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted">
                            {t("profile.preview")}
                          </p>
                          <ProfileCard profile={preview} compact />
                        </div>
                      </div>
                    </form>
                  )}

                  {tab === "status" && (
                    <form onSubmit={(event) => void save(event)}>
                      <SectionTitle
                        title={t("settings.status")}
                        body={t("profile.statusBody")}
                      />

                      <div className="space-y-5">
                        <label className="block">
                          <span className="field-label">{t("profile.statusText")}</span>
                          <input
                            className="field"
                            value={statusText}
                            maxLength={128}
                            dir="auto"
                            placeholder={t("profile.statusPlaceholder")}
                            onChange={(event) => setStatusText(event.target.value)}
                          />
                          <span className="mt-1 block text-end text-[10px] text-faint">
                            {statusText.length} / 128
                          </span>
                        </label>

                        <div className="rounded-xl border border-border bg-surface-2 p-4">
                          <label className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              className="mt-0.5 size-4 accent-[var(--primary)]"
                              checked={quietHoursEnabled}
                              onChange={(event) => setQuietHoursEnabled(event.target.checked)}
                            />
                            <span>
                              <span className="block text-sm font-semibold text-text">
                                {t("profile.quietHours")}
                              </span>
                              <span className="mt-1 block text-xs leading-5 text-muted">
                                {t("profile.quietHoursHint")}
                              </span>
                            </span>
                          </label>

                          {quietHoursEnabled && (
                            <div className="mt-4 grid grid-cols-2 gap-3">
                              <label className="block">
                                <span className="field-label">{t("profile.quietStart")}</span>
                                <TimeSelect
                                  value={quietHoursStart}
                                  onChange={setQuietHoursStart}
                                />
                              </label>
                              <label className="block">
                                <span className="field-label">{t("profile.quietEnd")}</span>
                                <TimeSelect value={quietHoursEnd} onChange={setQuietHoursEnd} />
                              </label>
                            </div>
                          )}
                        </div>

                        {error && (
                          <p role="alert" className="rounded-lg border border-danger bg-danger-soft px-3 py-2 text-sm text-text">
                            {t(`errors.${error}`, { defaultValue: t("errors.generic") })}
                          </p>
                        )}

                        <div className="flex items-center gap-2">
                          <button type="submit" className="btn-primary" disabled={busy}>
                            <Save className="size-4" aria-hidden="true" />
                            {busy ? t("common.loading") : t("common.save")}
                          </button>
                          {saved && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                              <Check className="size-3.5" aria-hidden="true" />
                              {t("profile.saved")}
                            </span>
                          )}
                        </div>
                      </div>
                    </form>
                  )}

                  {tab === "appearance" && (
                    <section>
                      <SectionTitle
                        title={t("profile.appearance")}
                        body={t("profile.appearanceBody")}
                      />
                      <div className="grid gap-3 sm:grid-cols-3">
                        {(
                          [
                            ["light", Sun, t("settings.light")],
                            ["dark", Moon, t("settings.dark")],
                            ["system", Monitor, t("settings.system")]
                          ] as Array<[ThemeMode, typeof Sun, string]>
                        ).map(([mode, Icon, label]) => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => setThemeMode(mode)}
                            className={`rounded-xl border p-4 text-start transition-colors ${
                              themeMode === mode
                                ? "border-primary bg-primary-soft"
                                : "border-border bg-surface-2 hover:border-focus"
                            }`}
                          >
                            <Icon className="size-5 text-primary" aria-hidden="true" />
                            <span className="mt-3 block text-sm font-semibold">{label}</span>
                            <span className="mt-1 block text-xs text-muted">
                              {t(`profile.theme_${mode}`)}
                            </span>
                          </button>
                        ))}
                      </div>
                      <div className="mt-6 rounded-xl border border-dashed border-border bg-surface-2 p-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-text">
                          <Laptop className="size-4 text-accent" aria-hidden="true" />
                          {t("profile.themePreview")}
                        </div>
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          <div className="rounded-lg bg-surface p-3 shadow-sm">
                            <span className="text-xs text-muted">{t("profile.surface")}</span>
                            <p className="mt-1 text-sm font-medium">{t("profile.sampleMessage")}</p>
                          </div>
                          <div className="rounded-lg bg-rail p-3 text-rail-text">
                            <span className="text-xs text-rail-muted">{t("profile.rail")}</span>
                            <p className="mt-1 text-sm font-medium">{t("app.name")}</p>
                          </div>
                        </div>
                      </div>
                    </section>
                  )}

                  {tab === "language" && (
                    <section>
                      <SectionTitle
                        title={t("settings.language")}
                        body={t("profile.languageBody")}
                      />
                      <div className="grid gap-3 sm:grid-cols-2">
                        {(
                          [
                            ["en", "English", "English"],
                            ["am", "አማርኛ", "Amharic"]
                          ] as Array<[Locale, string, string]>
                        ).map(([code, label, english]) => (
                          <button
                            key={code}
                            type="button"
                            onClick={() => setLocale(code)}
                            className={`flex items-center justify-between rounded-xl border p-4 text-start transition-colors ${
                              locale === code
                                ? "border-primary bg-primary-soft"
                                : "border-border bg-surface-2 hover:border-focus"
                            }`}
                          >
                            <span>
                              <span className="block text-sm font-bold" lang={code}>
                                {label}
                              </span>
                              <span className="mt-1 block text-xs text-muted">{english}</span>
                            </span>
                            {locale === code && <Check className="size-5 text-primary" />}
                          </button>
                        ))}
                      </div>
                      <p className="mt-4 text-xs leading-6 text-muted">
                        {t("profile.languageHint")}
                      </p>
                    </section>
                  )}

                  {tab === "voice" && <VoiceSettingsPanel />}
                </div>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function SectionTitle({ title, body }: { title: string; body: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-bold text-text">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-muted">{body}</p>
    </div>
  );
}

function TimeSelect({
  value,
  onChange
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const hours = Array.from({ length: 24 }, (_, index) => index);
  return (
    <select
      className="field"
      value={value}
      onChange={(event) => onChange(Number.parseInt(event.target.value, 10))}
    >
      {hours.map((hour) => {
        const label = `${String(hour).padStart(2, "0")}:00`;
        return (
          <option key={hour} value={hour}>
            {label}
          </option>
        );
      })}
    </select>
  );
}

function ColorField({
  label,
  value,
  colors,
  onChange
}: {
  label: string;
  value: string;
  colors: string[];
  onChange: (value: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <div>
      <span className="field-label">{label}</span>
      <div className="flex flex-wrap items-center gap-2">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            className={`size-7 rounded-full border-2 transition-transform hover:scale-110 ${
              value.toLowerCase() === color.toLowerCase()
                ? "border-text ring-2 ring-focus"
                : "border-transparent"
            }`}
            style={{ backgroundColor: color }}
            aria-label={`${label} ${color}`}
            title={`${label} ${color}`}
            onClick={() => onChange(color)}
          />
        ))}
        <label className="ms-1 inline-flex items-center gap-1.5 text-xs font-medium text-muted">
          <input
            type="color"
            value={value}
            className="size-7 cursor-pointer rounded border border-border bg-transparent p-0"
            onChange={(event) => onChange(event.target.value)}
            aria-label={t("profile.customColor")}
          />
          {t("profile.customColor")}
        </label>
      </div>
    </div>
  );
}

function AccountPanel({
  user,
  token,
  error,
  onSignOut,
  onError
}: {
  user: User;
  token: string | null;
  error: string | null;
  onSignOut: () => void;
  onError: (error: string | null) => void;
}) {
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function changePassword(event: FormEvent) {
    event.preventDefault();
    if (!token) return;
    setBusy(true);
    setDone(false);
    onError(null);
    try {
      await api.changePassword(token, currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setDone(true);
    } catch (error) {
      onError(error instanceof ApiError ? error.code : "PROFILE_SAVE_FAILED");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <SectionTitle title={t("profile.myAccount")} body={t("profile.accountBody")} />

      <div className="space-y-4">
        <label className="block">
          <span className="field-label">{t("auth.email")}</span>
          <input className="field bg-surface-2" value={user.email} readOnly dir="ltr" />
        </label>

        <div className="rounded-xl border border-border bg-surface-2 p-4">
          <div className="flex items-center gap-2">
            <LockKeyhole className="size-4 text-primary" aria-hidden="true" />
            <h3 className="text-sm font-bold text-text">{t("profile.changePassword")}</h3>
          </div>
          <form className="mt-3 space-y-3" onSubmit={(event) => void changePassword(event)}>
            <input
              className="field"
              type="password"
              autoComplete="current-password"
              placeholder={t("profile.currentPassword")}
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              required
              dir="ltr"
            />
            <input
              className="field"
              type="password"
              autoComplete="new-password"
              placeholder={t("profile.newPassword")}
              value={newPassword}
              minLength={10}
              maxLength={128}
              onChange={(event) => setNewPassword(event.target.value)}
              required
              dir="ltr"
            />
            {error && (
              <p role="alert" className="rounded-lg border border-danger bg-danger-soft px-3 py-2 text-sm text-text">
                {t(`errors.${error}`, { defaultValue: t("errors.generic") })}
              </p>
            )}
            <div className="flex items-center gap-2">
              <button type="submit" className="btn-primary" disabled={busy}>
                {busy ? t("common.loading") : t("profile.updatePassword")}
              </button>
              {done && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                  <Check className="size-3.5" aria-hidden="true" />
                  {t("profile.passwordChanged")}
                </span>
              )}
            </div>
          </form>
        </div>

        <button type="button" className="btn-secondary text-danger" onClick={onSignOut}>
          <LogOut className="size-4" aria-hidden="true" />
          {t("settings.signOut")}
        </button>
      </div>
    </section>
  );
}

function VoiceSettingsPanel() {
  const { t } = useTranslation();
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream;
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [stream]);

  async function startTest() {
    setError(null);
    try {
      const media = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      stream?.getTracks().forEach((track) => track.stop());
      setStream(media);
    } catch {
      setError("CALL_PERMISSION_DENIED");
    }
  }

  function stopTest() {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
  }

  return (
    <section>
      <SectionTitle title={t("profile.voiceVideo")} body={t("profile.voiceBody")} />
      <div className="overflow-hidden rounded-xl border border-border bg-surface-2">
        <div className="relative flex aspect-video items-center justify-center bg-rail">
          {stream ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="text-center text-rail-muted">
              <Mic className="mx-auto size-8" aria-hidden="true" />
              <p className="mt-2 text-sm">{t("profile.micPreviewIdle")}</p>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 p-4">
          {stream ? (
            <button type="button" className="btn-secondary" onClick={stopTest}>
              <X className="size-4" aria-hidden="true" />
              {t("profile.stopTest")}
            </button>
          ) : (
            <button type="button" className="btn-primary" onClick={() => void startTest()}>
              <Video className="size-4" aria-hidden="true" />
              {t("profile.testMicCamera")}
            </button>
          )}
          {error && <span className="text-xs text-danger">{t(`errors.${error}`)}</span>}
        </div>
      </div>
      <p className="mt-3 text-xs leading-6 text-muted">{t("profile.voiceHint")}</p>
    </section>
  );
}
