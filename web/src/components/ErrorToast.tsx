import { AlertTriangle, X } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { chatErrorKey } from "../lib/errors";
import { useChatStore } from "../store/chatStore";

export function ErrorToast() {
  const { t } = useTranslation();
  const lastError = useChatStore((state) => state.lastError);
  const setError = useChatStore((state) => state.setError);

  useEffect(() => {
    if (!lastError) return;
    const timer = setTimeout(() => setError(null), 7_000);
    return () => clearTimeout(timer);
  }, [lastError, setError]);

  if (!lastError) return null;

  const message = t(chatErrorKey(lastError));

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 end-6 z-[80] flex w-[min(22rem,calc(100vw-3rem))] animate-fade-in items-start gap-3 rounded-xl border border-danger bg-danger-soft p-3.5 text-sm text-text shadow-panel"
    >
      <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <p className="flex-1">{message}</p>
      <button
        type="button"
        className="rounded p-0.5 hover:bg-surface-2"
        aria-label={t("common.close")}
        onClick={() => setError(null)}
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
