import * as Dialog from "@radix-ui/react-dialog";
import { Hash, LoaderCircle, Plus, Volume2, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../lib/api";
import { apiErrorKey } from "../lib/errors";
import { useAuthStore } from "../store/authStore";
import { useChatStore } from "../store/chatStore";
import { chatSocket } from "../socket/chatSocket";

export function CreateChannelDialog({
  guildId,
  open,
  onOpenChange
}: {
  guildId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useTranslation();
  const token = useAuthStore((state) => state.token);
  const refresh = useAuthStore((state) => state.refresh);
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [kind, setKind] = useState<"text" | "voice">("text");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName("");
      setTopic("");
      setKind("text");
      setError(null);
      setBusy(false);
    }
  }, [open]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!token || !guildId || !name.trim()) return;

    setBusy(true);
    setError(null);

    try {
      const channel = await api.createChannel(token, guildId, {
        name: name.trim(),
        topic: topic.trim(),
        kind
      });
      await refresh();
      const bootstrap = useAuthStore.getState().bootstrap;
      if (bootstrap) {
        useChatStore.getState().initialize(bootstrap);
        useChatStore.getState().setActiveChannel(channel.id);
        chatSocket.subscribeToChannels([channel.id]);
      }
      onOpenChange(false);
    } catch (caught) {
      setError(apiErrorKey(caught, "errors.createChannel"));
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
                {t("channel.createTitle")}
              </Dialog.Title>
              <Dialog.Description className="mt-1.5 text-sm leading-6 text-muted">
                {t("channel.createBody")}
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
              <span className="field-label">{t("channel.name")}</span>
              <input
                className="field"
                value={name}
                maxLength={80}
                onChange={(event) => setName(event.target.value)}
                placeholder={t("channel.namePlaceholder")}
                autoFocus
                required
              />
            </label>

            <label className="block">
              <span className="field-label">
                {t("channel.topic")}{" "}
                <span className="font-normal normal-case text-faint">
                  ({t("common.optional")})
                </span>
              </span>
              <input
                className="field"
                value={topic}
                maxLength={1024}
                onChange={(event) => setTopic(event.target.value)}
                placeholder={t("channel.topicPlaceholder")}
              />
            </label>

            <fieldset>
              <legend className="field-label">{t("channel.type")}</legend>
              <div className="grid grid-cols-2 gap-2">
                <label
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm font-medium ${
                    kind === "text"
                      ? "border-primary bg-primary-soft text-text"
                      : "border-border bg-surface text-muted hover:bg-surface-2"
                  }`}
                >
                  <input
                    type="radio"
                    name="channel-kind"
                    value="text"
                    checked={kind === "text"}
                    onChange={() => setKind("text")}
                    className="sr-only"
                  />
                  <Hash className="size-4" aria-hidden="true" />
                  {t("channel.typeText")}
                </label>
                <label
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm font-medium ${
                    kind === "voice"
                      ? "border-primary bg-primary-soft text-text"
                      : "border-border bg-surface text-muted hover:bg-surface-2"
                  }`}
                >
                  <input
                    type="radio"
                    name="channel-kind"
                    value="voice"
                    checked={kind === "voice"}
                    onChange={() => setKind("voice")}
                    className="sr-only"
                  />
                  <Volume2 className="size-4" aria-hidden="true" />
                  {t("channel.typeVoice")}
                </label>
              </div>
              {kind === "voice" && (
                <p className="mt-2 text-xs leading-5 text-warning">
                  {t("channel.voiceUnavailable")}
                </p>
              )}
            </fieldset>

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
                {t("channel.create")}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
