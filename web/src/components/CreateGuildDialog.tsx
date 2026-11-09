import * as Dialog from "@radix-ui/react-dialog";
import { LoaderCircle, Plus, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../lib/api";
import { apiErrorKey } from "../lib/errors";
import { useAuthStore } from "../store/authStore";
import { useChatStore } from "../store/chatStore";

export function CreateGuildDialog({
  open,
  onOpenChange,
  onCreated
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (guildId: string) => void;
}) {
  const { t } = useTranslation();
  const token = useAuthStore((state) => state.token);
  const refresh = useAuthStore((state) => state.refresh);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName("");
      setError(null);
      setBusy(false);
    }
  }, [open]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!token || !name.trim()) return;

    setBusy(true);
    setError(null);

    try {
      const result = await api.createGuild(token, name.trim());
      await refresh();
      const bootstrap = useAuthStore.getState().bootstrap;
      if (bootstrap) useChatStore.getState().initialize(bootstrap);
      useChatStore.getState().setActiveGuild(result.guildId);
      onCreated(result.guildId);
      onOpenChange(false);
    } catch (caught) {
      setError(apiErrorKey(caught, "errors.createServer"));
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
              <Dialog.Title className="text-xl font-bold">{t("guild.createTitle")}</Dialog.Title>
              <Dialog.Description className="mt-1.5 text-sm leading-6 text-muted">
                {t("guild.createBody")}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button type="button" className="icon-button" aria-label={t("common.close")}>
                <X className="size-4" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>

          <form className="mt-6 space-y-4" onSubmit={(event) => void submit(event)}>
            <label className="block">
              <span className="field-label">{t("guild.name")}</span>
              <input
                className="field"
                value={name}
                maxLength={80}
                onChange={(event) => setName(event.target.value)}
                placeholder={t("guild.namePlaceholder")}
                autoFocus
                required
              />
            </label>

            {error && (
              <p role="alert" className="text-sm font-medium text-danger">
                {t(error)}
              </p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Dialog.Close asChild>
                <button type="button" className="btn-secondary">
                  {t("common.cancel")}
                </button>
              </Dialog.Close>
              <button type="submit" className="btn-primary" disabled={busy || !name.trim()}>
                {busy ? (
                  <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Plus className="size-4" aria-hidden="true" />
                )}
                {t("guild.create")}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
