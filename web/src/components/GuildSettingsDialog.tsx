import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { Check, CreditCard, LoaderCircle, UserCog, UserPlus, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../lib/api";
import { apiErrorKey } from "../lib/errors";
import { useAuthStore } from "../store/authStore";
import type { Guild } from "../types";

interface Billing {
  plan: string;
  seats: number;
  status: string;
}

const PLANS = [
  { value: "free", label: "guild.planFree" },
  { value: "pro", label: "guild.planPro" },
  { value: "enterprise", label: "guild.planEnterprise" }
];

const BILLING_STATUSES = [
  { value: "active", label: "guild.statusActive" },
  { value: "trialing", label: "guild.statusTrialing" },
  { value: "past_due", label: "guild.statusPastDue" },
  { value: "canceled", label: "guild.statusCanceled" }
];

export function GuildSettingsDialog({
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
  const isOwner = guild?.role === "owner";

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteBusy, setInviteBusy] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);

  const [billing, setBilling] = useState<Billing>({
    plan: "free",
    seats: 10,
    status: "active"
  });
  const [billingLoading, setBillingLoading] = useState(false);
  const [billingBusy, setBillingBusy] = useState(false);
  const [billingError, setBillingError] = useState<string | null>(null);
  const [billingSuccess, setBillingSuccess] = useState(false);

  const [roleBusy, setRoleBusy] = useState<string | null>(null);
  const [roleError, setRoleError] = useState<string | null>(null);

  async function changeRole(userId: string, role: "admin" | "member") {
    if (!token || !guild) return;
    setRoleBusy(userId);
    setRoleError(null);
    try {
      await api.updateMemberRole(token, guild.id, userId, role);
      await refresh();
    } catch (error) {
      setRoleError(apiErrorKey(error, "errors.generic"));
    } finally {
      setRoleBusy(null);
    }
  }

  useEffect(() => {
    if (!open) return;
    setInviteEmail("");
    setInviteError(null);
    setInviteSuccess(null);
    setBillingError(null);
    setBillingSuccess(false);
  }, [open]);

  useEffect(() => {
    if (!open || !guild || !canManage || !token) return;
    let cancelled = false;
    setBillingLoading(true);

    void api
      .billing(token, guild.id)
      .then((result) => {
        if (cancelled) return;
        setBilling({
          plan: result.plan,
          seats: result.seats,
          status: result.status
        });
      })
      .catch((error) => {
        if (!cancelled) setBillingError(apiErrorKey(error, "errors.billing"));
      })
      .finally(() => {
        if (!cancelled) setBillingLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, guild, canManage, token]);

  async function invite(event: FormEvent) {
    event.preventDefault();
    if (!token || !guild || !inviteEmail.trim()) return;

    setInviteBusy(true);
    setInviteError(null);
    setInviteSuccess(null);

    try {
      const member = await api.addMember(token, guild.id, inviteEmail.trim());
      await refresh();
      setInviteEmail("");
      setInviteSuccess(t("guild.inviteSuccess", { name: member.displayName }));
    } catch (error) {
      setInviteError(apiErrorKey(error, "errors.invite"));
    } finally {
      setInviteBusy(false);
    }
  }

  async function saveBilling(event: FormEvent) {
    event.preventDefault();
    if (!token || !guild || !isOwner) return;

    setBillingBusy(true);
    setBillingError(null);
    setBillingSuccess(false);

    try {
      await api.updateBilling(token, guild.id, billing);
      setBillingSuccess(true);
      await refresh();
    } catch (error) {
      setBillingError(apiErrorKey(error, "errors.billing"));
    } finally {
      setBillingBusy(false);
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
                {t("guild.settingsTitle")}
              </Dialog.Title>
              <Dialog.Description className="mt-1.5 text-sm leading-6 text-muted">
                {t("guild.settingsBody")}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button type="button" className="icon-button" aria-label={t("common.close")}>
                <X className="size-4" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>

          {guild && (
            <div className="mt-5 rounded-xl border border-border bg-surface-2 px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-text">{guild.name}</span>
                <span className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-[11px] font-semibold text-muted">
                  {t(
                    guild.role === "owner"
                      ? "guild.roleOwner"
                      : guild.role === "admin"
                        ? "guild.roleAdmin"
                        : "guild.roleMember"
                  )}
                </span>
              </div>
            </div>
          )}

          {!canManage || !guild ? (
            <p className="mt-5 text-sm text-muted">{t("guild.managerOnly")}</p>
          ) : (
            <Tabs.Root defaultValue="invite" className="mt-5">
              <Tabs.List className="grid grid-cols-3 gap-1 rounded-xl border border-border bg-surface-2 p-1">
                <Tabs.Trigger
                  value="invite"
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-muted data-[state=active]:bg-surface data-[state=active]:text-text data-[state=active]:shadow-sm"
                >
                  <UserPlus className="size-4" aria-hidden="true" />
                  {t("guild.inviteTitle")}
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="members"
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-muted data-[state=active]:bg-surface data-[state=active]:text-text data-[state=active]:shadow-sm"
                >
                  <UserCog className="size-4" aria-hidden="true" />
                  {t("guild.membersTitle")}
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="billing"
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-muted data-[state=active]:bg-surface data-[state=active]:text-text data-[state=active]:shadow-sm"
                >
                  <CreditCard className="size-4" aria-hidden="true" />
                  {t("guild.billingTitle")}
                </Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="invite" className="pt-5 focus:outline-none">
                <p className="mb-4 text-sm leading-6 text-muted">{t("guild.inviteBody")}</p>
                <form className="flex flex-col gap-2 sm:flex-row" onSubmit={(event) => void invite(event)}>
                  <label className="flex-1">
                    <span className="sr-only">{t("guild.inviteEmail")}</span>
                    <input
                      className="field"
                      type="email"
                      required
                      value={inviteEmail}
                      onChange={(event) => setInviteEmail(event.target.value)}
                      placeholder={t("guild.inviteEmail")}
                      dir="ltr"
                    />
                  </label>
                  <button type="submit" className="btn-primary" disabled={inviteBusy}>
                    {inviteBusy && (
                      <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                    )}
                    {t("guild.invite")}
                  </button>
                </form>
                {inviteError && (
                  <p role="alert" className="mt-3 text-sm font-medium text-danger">
                    {t(inviteError)}
                  </p>
                )}
                {inviteSuccess && (
                  <p role="status" className="mt-3 inline-flex items-center gap-1.5 text-sm text-success">
                    <Check className="size-4" aria-hidden="true" />
                    {inviteSuccess}
                  </p>
                )}
              </Tabs.Content>

              <Tabs.Content value="members" className="pt-5 focus:outline-none">
                <p className="mb-4 text-sm leading-6 text-muted">{t("guild.membersBody")}</p>
                {roleError && (
                  <p role="alert" className="mb-3 text-sm font-medium text-danger">
                    {t(roleError)}
                  </p>
                )}
                <div className="space-y-1.5">
                  {guild.members.map((member) => (
                    <div
                      key={member.userId}
                      className="flex items-center gap-3 rounded-lg border border-border bg-surface-2 px-3 py-2"
                    >
                      <span
                        className="size-7 shrink-0 rounded-full"
                        style={{ backgroundColor: member.avatarColor }}
                        aria-hidden="true"
                      />
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-text">
                        {member.displayName}
                      </span>
                      {member.role === "owner" || !isOwner ? (
                        <span className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-[11px] font-semibold text-muted">
                          {t(
                            member.role === "owner"
                              ? "guild.roleOwner"
                              : member.role === "admin"
                                ? "guild.roleAdmin"
                                : "guild.roleMember"
                          )}
                        </span>
                      ) : (
                        <select
                          className="field w-auto py-1.5 text-xs"
                          value={member.role}
                          disabled={roleBusy === member.userId}
                          onChange={(event) =>
                            void changeRole(member.userId, event.target.value as "admin" | "member")
                          }
                        >
                          <option value="member">{t("guild.roleMember")}</option>
                          <option value="admin">{t("guild.roleAdmin")}</option>
                        </select>
                      )}
                    </div>
                  ))}
                </div>
              </Tabs.Content>

              <Tabs.Content value="billing" className="pt-5 focus:outline-none">
                <p className="mb-4 text-sm leading-6 text-muted">{t("guild.billingBody")}</p>

                {billingLoading ? (
                  <div className="flex items-center gap-2 py-6 text-sm text-muted">
                    <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                    {t("common.loading")}
                  </div>
                ) : (
                  <form className="grid gap-4 sm:grid-cols-2" onSubmit={(event) => void saveBilling(event)}>
                    <label>
                      <span className="field-label">{t("guild.billingPlan")}</span>
                      <select
                        className="field"
                        value={billing.plan}
                        disabled={!isOwner}
                        onChange={(event) =>
                          setBilling((current) => ({ ...current, plan: event.target.value }))
                        }
                      >
                        {PLANS.map((plan) => (
                          <option key={plan.value} value={plan.value}>
                            {t(plan.label)}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label>
                      <span className="field-label">{t("guild.billingSeats")}</span>
                      <input
                        className="field"
                        type="number"
                        min={1}
                        max={100000}
                        value={billing.seats}
                        disabled={!isOwner}
                        onChange={(event) =>
                          setBilling((current) => ({
                            ...current,
                            seats: Number.parseInt(event.target.value, 10) || 1
                          }))
                        }
                      />
                    </label>

                    <label>
                      <span className="field-label">{t("guild.billingStatus")}</span>
                      <select
                        className="field"
                        value={billing.status}
                        disabled={!isOwner}
                        onChange={(event) =>
                          setBilling((current) => ({ ...current, status: event.target.value }))
                        }
                      >
                        {BILLING_STATUSES.map((status) => (
                          <option key={status.value} value={status.value}>
                            {t(status.label)}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className="flex items-end">
                      {isOwner && (
                        <button type="submit" className="btn-primary w-full" disabled={billingBusy}>
                          {billingBusy && (
                            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                          )}
                          {t("guild.saveBilling")}
                        </button>
                      )}
                    </div>

                    {billingError && (
                      <p role="alert" className="text-sm font-medium text-danger sm:col-span-2">
                        {t(billingError)}
                      </p>
                    )}
                    {billingSuccess && (
                      <p
                        role="status"
                        className="inline-flex items-center gap-1.5 text-sm text-success sm:col-span-2"
                      >
                        <Check className="size-4" aria-hidden="true" />
                        {t("guild.billingSaved")}
                      </p>
                    )}
                  </form>
                )}
              </Tabs.Content>
            </Tabs.Root>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
