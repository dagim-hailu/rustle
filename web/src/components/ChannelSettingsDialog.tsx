import * as Dialog from "@radix-ui/react-dialog";
import { Check, LoaderCircle, ShieldCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../lib/api";
import { useAuthStore } from "../store/authStore";
import type { Channel } from "../types";

interface Override {
  role: "admin" | "member";
  canView: boolean;
  canSend: boolean;
}

export function ChannelSettingsDialog({
  channel,
  open,
  onOpenChange
}: {
  channel: Channel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useTranslation();
  const token = useAuthStore((state) => state.token);
  const [overrides, setOverrides] = useState<Override[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!open || !token || !channel) return;
    let cancelled = false;
    setLoading(true);
    setError(false);
    setSaved(false);

    void api
      .channelPermissions(token, channel.id)
      .then((state) => {
        if (cancelled) return;
        const byRole = new Map(state.overrides.map((entry) => [entry.role, entry]));
        setOverrides([
          byRole.get("admin") ?? { role: "admin", canView: true, canSend: true },
          byRole.get("member") ?? { role: "member", canView: true, canSend: true }
        ]);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, token, channel]);

  function toggle(role: Override["role"], key: "canView" | "canSend") {
    setSaved(false);
    setOverrides((current) =>
      current.map((entry) =>
        entry.role === role
          ? {
              ...entry,
              [key]: !entry[key],
              // Turning off view also turns off send; send requires view.
              ...(key === "canView" && entry.canView ? { canSend: false } : {}),
              ...(key === "canSend" && !entry.canView ? { canView: true } : {})
            }
          : entry
      )
    );
  }

  async function save() {
    if (!token || !channel) return;
    setBusy(true);
    setError(false);
    try {
      await api.updateChannelPermissions(token, channel.id, overrides);
      setSaved(true);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-xl font-bold">
                {t("permissions.title", { channel: channel?.name ?? "" })}
              </Dialog.Title>
              <Dialog.Description className="mt-1.5 text-sm leading-6 text-muted">
                {t("permissions.body")}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button type="button" className="icon-button" aria-label={t("common.close")}>
                <X className="size-4" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 py-8 text-sm text-muted">
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
              {t("common.loading")}
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {overrides.map((entry) => (
                <div
                  key={entry.role}
                  className="rounded-xl border border-border bg-surface-2 p-4"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
                    <span className="text-sm font-bold text-text">
                      {t(entry.role === "admin" ? "guild.roleAdmin" : "guild.roleMember")}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-4">
                    <Toggle
                      label={t("permissions.canView")}
                      checked={entry.canView}
                      onChange={() => toggle(entry.role, "canView")}
                    />
                    <Toggle
                      label={t("permissions.canSend")}
                      checked={entry.canSend}
                      onChange={() => toggle(entry.role, "canSend")}
                    />
                  </div>
                </div>
              ))}

              <p className="text-xs leading-6 text-muted">{t("permissions.hint")}</p>

              {error && (
                <p role="alert" className="text-sm font-medium text-danger">
                  {t("errors.generic")}
                </p>
              )}

              <div className="flex items-center gap-2">
                <button type="button" className="btn-primary" disabled={busy} onClick={() => void save()}>
                  {busy ? t("common.loading") : t("common.save")}
                </button>
                {saved && (
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-success">
                    <Check className="size-4" aria-hidden="true" />
                    {t("permissions.saved")}
                  </span>
                )}
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Toggle({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-text">
      <input
        type="checkbox"
        className="size-4 accent-[var(--primary)]"
        checked={checked}
        onChange={onChange}
      />
      {label}
    </label>
  );
}
