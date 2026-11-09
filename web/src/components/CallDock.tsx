import { Mic, MicOff, PhoneOff, Signal, Volume2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { callManager } from "../socket/callManager";
import { useCallStore } from "../store/callStore";
import { useChatStore } from "../store/chatStore";

export function CallDock() {
  const { t } = useTranslation();
  const call = useCallStore();
  const guilds = useChatStore((state) => state.guilds);

  if (!call.channelId || (call.status !== "active" && call.status !== "joining")) {
    return null;
  }

  const channel = guilds
    .flatMap((guild) => guild.channels)
    .find((entry) => entry.id === call.channelId);
  if (!channel) return null;

  return (
    <div className="mx-2 mb-2 rounded-lg border border-border bg-surface-2 p-2">
      <div className="flex items-center gap-2 px-1">
        <span className="inline-flex size-6 items-center justify-center rounded-full bg-success-soft text-success">
          <Signal className="size-3.5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-bold text-success">{t("call.voiceConnected")}</p>
          <p className="truncate text-[11px] text-muted">
            {channel.name} · {t("call.participantCount", { count: call.participants.length })}
          </p>
        </div>
        <button
          type="button"
          className="inline-flex size-7 items-center justify-center rounded-md text-muted hover:bg-surface-3 hover:text-text"
          onClick={() => callManager.toggleMute()}
          aria-label={call.muted ? t("call.unmute") : t("call.mute")}
          title={call.muted ? t("call.unmute") : t("call.mute")}
        >
          {call.muted ? <MicOff className="size-4" /> : <Mic className="size-4" />}
        </button>
        <button
          type="button"
          className="inline-flex size-7 items-center justify-center rounded-md text-danger hover:bg-danger-soft"
          onClick={() => callManager.leave()}
          aria-label={t("call.leave")}
          title={t("call.leave")}
        >
          <PhoneOff className="size-4" />
        </button>
      </div>
      <div className="mt-1 flex items-center gap-1.5 px-1 text-[10px] text-faint">
        <Volume2 className="size-3" aria-hidden="true" />
        {call.deafened ? t("call.deafened") : t("call.connected")}
      </div>
    </div>
  );
}
