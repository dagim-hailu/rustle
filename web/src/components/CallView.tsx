import {
  HeadphoneOff,
  Headphones,
  Mic,
  MicOff,
  MonitorUp,
  PhoneOff,
  ScreenShareOff,
  Video,
  VideoOff,
  Volume2
} from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { callManager } from "../socket/callManager";
import { useCallStore } from "../store/callStore";
import type { CallParticipant, Channel } from "../types";
import { Avatar } from "./Avatar";

export function CallView({ channel }: { channel: Channel }) {
  const { t } = useTranslation();
  const call = useCallStore();
  const active = call.channelId === channel.id && (call.status === "active" || call.status === "joining");
  const mediaVersion = call.mediaVersion;

  if (!active) {
    return (
      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-surface p-6">
        <div className="pointer-events-none absolute -end-24 -top-24 size-72 rounded-full bg-primary-soft blur-3xl" />
        <div className="relative max-w-lg text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-border bg-surface-2 text-primary">
            <Volume2 className="size-7" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-text">{channel.name}</h2>
          <p className="mt-2 text-sm leading-6 text-muted">{t("call.lobbyBody")}</p>
          {call.error && (
            <p role="alert" className="mt-4 rounded-lg border border-danger bg-danger-soft px-3 py-2 text-sm text-text">
              {t(`errors.${call.error}`, { defaultValue: t("errors.generic") })}
            </p>
          )}
          <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row">
            <button
              type="button"
              className="btn-primary w-full sm:w-auto"
              onClick={() => void callManager.join(channel, false)}
              disabled={call.status === "joining"}
            >
              <Mic className="size-4" aria-hidden="true" />
              {t("call.joinAudio")}
            </button>
            <button
              type="button"
              className="btn-secondary w-full sm:w-auto"
              onClick={() => void callManager.join(channel, true)}
              disabled={call.status === "joining"}
            >
              <Video className="size-4" aria-hidden="true" />
              {t("call.joinVideo")}
            </button>
          </div>
          <p className="mt-4 text-xs text-faint">{t("call.lobbyHint")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[var(--rail)]">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-4 text-rail-text sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <Volume2 className="size-5 shrink-0 text-primary" aria-hidden="true" />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">{channel.name}</p>
            <p className="text-[11px] text-rail-muted">
              {call.status === "joining"
                ? t("call.connecting")
                : t("call.participantCount", { count: call.participants.length })}
            </p>
          </div>
        </div>
        <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-rail-muted">
          {t("call.mesh")}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
        <div
          className={`mx-auto grid max-w-6xl gap-3 ${
            call.participants.length <= 1
              ? "max-w-md grid-cols-1"
              : call.participants.length === 2
                ? "sm:grid-cols-2"
                : "sm:grid-cols-2 xl:grid-cols-3"
          }`}
        >
          {call.participants.map((participant) => (
            <ParticipantTile
              key={participant.sessionId}
              participant={participant}
              self={participant.sessionId === call.selfSessionId}
              deafened={call.deafened}
              mediaVersion={mediaVersion}
            />
          ))}
        </div>

        {call.participants.length <= 1 && call.status === "active" && (
          <p className="mx-auto mt-6 max-w-md text-center text-sm text-rail-muted">
            {t("call.waiting")}
          </p>
        )}
      </div>

      {call.error && (
        <p className="px-5 pb-2 text-center text-xs font-medium text-danger">
          {t(`errors.${call.error}`, { defaultValue: t("errors.generic") })}
        </p>
      )}

      <div className="shrink-0 border-t border-white/10 px-4 py-4">
        <div className="mx-auto flex max-w-xl items-center justify-center gap-2">
          <ControlButton
            active={call.muted}
            label={call.muted ? t("call.unmute") : t("call.mute")}
            onClick={() => callManager.toggleMute()}
          >
            {call.muted ? <MicOff className="size-5" /> : <Mic className="size-5" />}
          </ControlButton>

          <ControlButton
            active={!call.video}
            label={call.video ? t("call.cameraOff") : t("call.cameraOn")}
            onClick={() => void callManager.toggleVideo()}
          >
            {call.video ? <Video className="size-5" /> : <VideoOff className="size-5" />}
          </ControlButton>

          <ControlButton
            active={call.screenSharing}
            label={call.screenSharing ? t("call.stopShare") : t("call.share")}
            onClick={() => void callManager.toggleScreen()}
          >
            {call.screenSharing ? (
              <ScreenShareOff className="size-5" />
            ) : (
              <MonitorUp className="size-5" />
            )}
          </ControlButton>

          <ControlButton
            active={call.deafened}
            label={call.deafened ? t("call.undeafen") : t("call.deafen")}
            onClick={() => callManager.toggleDeafen()}
          >
            {call.deafened ? (
              <HeadphoneOff className="size-5" />
            ) : (
              <Headphones className="size-5" />
            )}
          </ControlButton>

          <button
            type="button"
            onClick={() => callManager.leave()}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-danger px-4 text-sm font-semibold text-white transition-colors hover:bg-danger"
            aria-label={t("call.leave")}
          >
            <PhoneOff className="size-5" aria-hidden="true" />
            <span className="hidden sm:inline">{t("call.leave")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ControlButton({
  active,
  label,
  onClick,
  children
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`inline-flex size-11 items-center justify-center rounded-full border transition-colors ${
        active
          ? "border-danger bg-danger text-white hover:bg-danger"
          : "border-white/15 bg-white/10 text-white hover:bg-white/20"
      }`}
    >
      {children}
    </button>
  );
}

function ParticipantTile({
  participant,
  self,
  deafened,
  mediaVersion
}: {
  participant: CallParticipant;
  self: boolean;
  deafened: boolean;
  mediaVersion: number;
}) {
  const { t } = useTranslation();
  const stream = self
    ? callManager.getLocalStream()
    : callManager.getRemoteStream(participant.sessionId);
  const hasVideo = Boolean(
    stream?.getVideoTracks().length && (participant.video || participant.screenSharing)
  );

  return (
    <div
      className="relative aspect-video min-h-40 overflow-hidden rounded-xl border border-white/10 bg-black/35"
      data-media-version={mediaVersion}
    >
      {hasVideo && stream ? (
        <VideoSurface stream={stream} muted={self || deafened} mirror={self && !participant.screenSharing} />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3">
          <Avatar
            name={participant.displayName}
            color={participant.avatarColor}
            src={participant.avatarUrl}
            size="xl"
          />
          <span className="text-sm font-semibold text-white">{participant.displayName}</span>
        </div>
      )}

      {!hasVideo && stream && !self && (
        <RemoteAudio stream={stream} muted={deafened} />
      )}

      <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2.5 pt-8">
        <span className="min-w-0 flex-1 truncate text-xs font-semibold text-white">
          {participant.displayName}
          {self && <span className="ms-1 text-white/60">({t("common.you")})</span>}
        </span>
        {participant.screenSharing && (
          <span className="rounded bg-accent px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
            {t("call.screen")}
          </span>
        )}
        {participant.muted && (
          <MicOff className="size-3.5 text-white/80" aria-label={t("call.muted")} />
        )}
        {participant.deafened && (
          <HeadphoneOff className="size-3.5 text-white/80" aria-label={t("call.deafened")} />
        )}
      </div>
    </div>
  );
}

function VideoSurface({
  stream,
  muted,
  mirror
}: {
  stream: MediaStream;
  muted: boolean;
  mirror: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream;
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted={muted}
      className={`h-full w-full object-cover ${mirror ? "-scale-x-100" : ""}`}
    />
  );
}

function RemoteAudio({ stream, muted }: { stream: MediaStream; muted: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) audioRef.current.srcObject = stream;
  }, [stream]);

  return <audio ref={audioRef} autoPlay muted={muted} className="sr-only" />;
}
