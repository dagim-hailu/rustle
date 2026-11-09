import { LoaderCircle, WifiOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useChatStore } from "../store/chatStore";

export function ConnectionBanner() {
  const { t } = useTranslation();
  const socketStatus = useChatStore((state) => state.socketStatus);

  if (socketStatus === "connected" || socketStatus === "idle") return null;

  const reconnecting = socketStatus === "reconnecting" || socketStatus === "connecting";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex shrink-0 items-center justify-center gap-2 border-b px-4 py-1.5 text-xs font-medium ${
        reconnecting
          ? "border-warning bg-warning-soft text-warning"
          : "border-danger bg-danger-soft text-danger"
      }`}
    >
      {reconnecting ? (
        <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" />
      ) : (
        <WifiOff className="size-3.5" aria-hidden="true" />
      )}
      {reconnecting ? t("connection.reconnecting") : t("connection.offline")}
    </div>
  );
}
