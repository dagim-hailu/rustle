import * as Dialog from "@radix-ui/react-dialog";
import { Check, Copy, LoaderCircle, Trash2, UserPlus, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api, ApiError } from "../lib/api";
import { useAuthStore } from "../store/authStore";
import type { Guild, Invite, InvitePreview } from "../types";

export function InviteDialog({
  guild,
  open,
  onOpenChange
}: {
  guild: Guild | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useTranslation();
  const token = useAuthStore((state) => state.token);
  const refresh = useAuthStore((state) => state.refresh);
  const canManage = guild?.role === "owner" || guild?.role === "admin";

  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<Invite | null>(null);

  const [maxUses, setMaxUses] = useState(0);
  const [expiresInHours, setExpiresInHours] = useState(24 * 7);
  const [joinCode, setJoinCode] = useState("");
  const [preview, setPreview] = useState<InvitePreview | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);

  const loadInvites = useCallback(() => {
    if (!token || !guild || !canManage) return;
    setLoading(true);
    void api
      .listInvites(token, guild.id)
      .then((result) => setInvites(result.invites))
      .catch(() => setError("errors.generic"))
      .finally(() => setLoading(false));
  }, [token, guild, canManage]);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setCreated(null);
    setJoined(false);
    setPreview(null);
    setPreviewError(null);
    loadInvites();
  }, [open, loadInvites]);

  async function create() {
    if (!token || !guild) return;
    setBusy(true);
    setError(null);
    try {
      const invite = await api.createInvite(token, guild.id, { maxUses, expiresInHours });
      setCreated(invite);
      await loadInvites();
    } catch (createError) {
      setError(createError instanceof ApiError ? createError.code : "errors.generic");
    } finally {
      setBusy(false);
    }
  }

  async function revoke(code: string) {
    if (!token || !guild) return;
    setInvites((current) => current.filter((invite) => invite.code !== code));
    try {
      await api.revokeInvite(token, guild.id, code);
    } catch {
      void loadInvites();
    }
  }

  function copy(code: string) {
    void navigator.clipboard
      ?.writeText(`${window.location.origin}/invite/${code}`)
      .catch(() => undefined);
  }

  function normalizeCode(value: string): string {
    const trimmed = value.trim();
    const match = trimmed.match(/invite\/([A-Za-z0-9]+)/);
    return match ? match[1]! : trimmed;
  }

  async function checkCode() {
    if (!token) return;
    const code = normalizeCode(joinCode);
    if (!code) return;
    setPreviewError(null);
    setPreview(null);
    try {
      setPreview(await api.invitePreview(token, code));
    } catch {
      setPreviewError("invite.invalid");
    }
  }

  async function accept() {
    if (!token) return;
    const code = normalizeCode(joinCode);
    if (!code) return;
    setBusy(true);
    setError(null);
    try {
      await api.acceptInvite(token, code);
      await refresh();
      setJoined(true);
      setPreview(null);
      setJoinCode("");
    } catch (acceptError) {
      setError(acceptError instanceof ApiError ? acceptError.code : "errors.generic");
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
              <Dialog.Title className="text-xl font-bold">{t("invite.title")}</Dialog.Title>
              <Dialog.Description className="mt-1.5 text-sm leading-6 text-muted">
                {t("invite.body")}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button type="button" className="icon-button" aria-label={t("common.close")}>
                <X className="size-4" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>

          <section className="mt-5 rounded-xl border border-border bg-surface-2 p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-text">
              <UserPlus className="size-4 text-primary" aria-hidden="true" />
              {t("invite.joinTitle")}
            </h3>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                className="field flex-1"
                value={joinCode}
                dir="ltr"
                placeholder={t("invite.joinPlaceholder")}
                onChange={(event) => setJoinCode(event.target.value)}
              />
              <button type="button" className="btn-secondary" onClick={() => void checkCode()}>
                {t("invite.check")}
              </button>
            </div>
            {previewError && (
              <p role="alert" className="mt-2 text-sm font-medium text-danger">
                {t(previewError)}
              </p>
            )}
            {preview && (
              <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-3 py-2">
                <span className="text-sm">
                  <span className="font-semibold text-text">{preview.guildName}</span>
                  <span className="ms-2 text-xs text-muted">
                    {t("guild.memberCount", { count: preview.memberCount })}
                  </span>
                </span>
                {preview.alreadyMember ? (
                  <span className="text-xs font-medium text-muted">{t("invite.alreadyMember")}</span>
                ) : (
                  <button type="button" className="btn-primary" disabled={busy} onClick={() => void accept()}>
                    {busy && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
                    {t("invite.accept")}
                  </button>
                )}
              </div>
            )}
            {joined && (
              <p role="status" className="mt-2 inline-flex items-center gap-1.5 text-sm text-success">
                <Check className="size-4" aria-hidden="true" />
                {t("invite.joined")}
              </p>
            )}
          </section>

          {canManage && guild && (
            <section className="mt-4 rounded-xl border border-border bg-surface-2 p-4">
              <h3 className="text-sm font-bold text-text">{t("invite.manageTitle")}</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label>
                  <span className="field-label">{t("invite.maxUses")}</span>
                  <input
                    className="field"
                    type="number"
                    min={0}
                    max={1000}
                    value={maxUses}
                    onChange={(event) => setMaxUses(Number.parseInt(event.target.value, 10) || 0)}
                  />
                  <span className="mt-1 block text-[10px] text-faint">{t("invite.maxUsesHint")}</span>
                </label>
                <label>
                  <span className="field-label">{t("invite.expiresIn")}</span>
                  <select
                    className="field"
                    value={expiresInHours}
                    onChange={(event) => setExpiresInHours(Number.parseInt(event.target.value, 10))}
                  >
                    <option value={1}>{t("invite.hours1")}</option>
                    <option value={24}>{t("invite.hours24")}</option>
                    <option value={24 * 7}>{t("invite.days7")}</option>
                    <option value={0}>{t("invite.never")}</option>
                  </select>
                </label>
              </div>
              <button type="button" className="btn-primary mt-3" disabled={busy} onClick={() => void create()}>
                {busy && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
                {t("invite.create")}
              </button>

              {created && (
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
                  <code className="min-w-0 flex-1 truncate text-xs" dir="ltr">
                    {window.location.origin}/invite/{created.code}
                  </code>
                  <button
                    type="button"
                    className="icon-button size-8"
                    onClick={() => copy(created.code)}
                    aria-label={t("common.copy")}
                    title={t("common.copy")}
                  >
                    <Copy className="size-3.5" aria-hidden="true" />
                  </button>
                </div>
              )}

              {error && (
                <p role="alert" className="mt-2 text-sm font-medium text-danger">
                  {t(`errors.${error}`, { defaultValue: t("errors.generic") })}
                </p>
              )}

              <div className="mt-4 space-y-1.5">
                {loading && (
                  <div className="flex items-center gap-2 py-3 text-sm text-muted">
                    <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                    {t("common.loading")}
                  </div>
                )}
                {!loading && invites.length === 0 && (
                  <p className="text-xs text-muted">{t("invite.none")}</p>
                )}
                {invites.map((invite) => (
                  <div
                    key={invite.code}
                    className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-xs"
                  >
                    <code className="min-w-0 flex-1 truncate" dir="ltr">
                      {invite.code}
                    </code>
                    <span className="shrink-0 text-muted">
                      {t("invite.uses", {
                        uses: invite.uses,
                        max: invite.maxUses === 0 ? "∞" : invite.maxUses
                      })}
                    </span>
                    <button
                      type="button"
                      className="icon-button size-7"
                      onClick={() => copy(invite.code)}
                      aria-label={t("common.copy")}
                    >
                      <Copy className="size-3.5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="icon-button size-7 hover:text-danger"
                      onClick={() => void revoke(invite.code)}
                      aria-label={t("invite.revoke")}
                    >
                      <Trash2 className="size-3.5" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
