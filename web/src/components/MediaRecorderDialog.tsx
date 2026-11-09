import * as Dialog from "@radix-ui/react-dialog";
import { CircleStop, LoaderCircle, Mic, Square, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { api, ApiError } from "../lib/api";
import type { UploadKind, UploadResult } from "../types";

function recorderMime(kind: "audio" | "video"): string {
  const candidates =
    kind === "video"
      ? ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"]
      : ["audio/webm;codecs=opus", "audio/webm"];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) ?? "";
}

export function MediaRecorderDialog({
  open,
  kind,
  token,
  onOpenChange,
  onUploaded
}: {
  open: boolean;
  kind: "audio" | "video";
  token: string | null;
  onOpenChange: (open: boolean) => void;
  onUploaded: (result: UploadResult) => void;
}) {
  const { t } = useTranslation();
  const [seconds, setSeconds] = useState(0);
  const [starting, setStarting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const cancelledRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!open) return;
    if (!token) return;
    cancelledRef.current = false;
    chunksRef.current = [];
    setSeconds(0);
    setError(null);
    setUploading(false);
    setStarting(true);

    let disposed = false;

    async function start() {
      try {
        const media = await navigator.mediaDevices.getUserMedia(
          kind === "video"
            ? {
                audio: { echoCancellation: true, noiseSuppression: true },
                video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" }
              }
            : { audio: { echoCancellation: true, noiseSuppression: true } }
        );

        if (disposed) {
          media.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = media;
        if (kind === "video" && videoRef.current) videoRef.current.srcObject = media;

        const mimeType = recorderMime(kind);
        const recorder = mimeType
          ? new MediaRecorder(media, { mimeType })
          : new MediaRecorder(media);
        recorderRef.current = recorder;

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) chunksRef.current.push(event.data);
        };

        recorder.onstop = () => {
          const stopped = media;
          stopped.getTracks().forEach((track) => track.stop());
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;
          streamRef.current = null;
          recorderRef.current = null;

          if (cancelledRef.current) return;

          const type = recorder.mimeType || (kind === "video" ? "video/webm" : "audio/webm");
          const blob = new Blob(chunksRef.current, { type });
          if (blob.size === 0) {
            setError("RECORDING_EMPTY");
            setStarting(false);
            setUploading(false);
            return;
          }

          const extension = type.startsWith("video/") ? "webm" : "weba";
          const file = new File(
            [blob],
            `${kind === "video" ? "video" : "voice"}-message-${Date.now()}.${extension}`,
            { type }
          );

          setUploading(true);
          setStarting(false);
          api
            .upload(token!, file, kind as UploadKind)
            .then((result) => {
              onUploaded(result);
              onOpenChange(false);
            })
            .catch((uploadError) => {
              setError(uploadError instanceof ApiError ? uploadError.code : "UPLOAD_FAILED");
            })
            .finally(() => setUploading(false));
        };

        recorder.start(500);
        setStarting(false);
        setSeconds(0);
        timerRef.current = setInterval(() => {
          setSeconds((value) => {
            if (value >= 119) {
              if (recorder.state === "recording") recorder.stop();
              return 120;
            }
            return value + 1;
          });
        }, 1_000);
      } catch (mediaError) {
        setStarting(false);
        const name = mediaError instanceof DOMException ? mediaError.name : "";
        setError(
          name === "NotAllowedError"
            ? "CALL_PERMISSION_DENIED"
            : name === "NotFoundError"
              ? "CALL_DEVICE_NOT_FOUND"
              : "RECORDING_FAILED"
        );
      }
    }

    void start();

    return () => {
      disposed = true;
      cancelledRef.current = true;
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      if (recorderRef.current?.state === "recording") recorderRef.current.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, [open, kind, token]);

  function stop() {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
      setUploading(true);
    }
  }

  function cancel() {
    cancelledRef.current = true;
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    onOpenChange(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && cancel()}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-surface p-5 shadow-panel focus:outline-none">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Dialog.Title className="text-lg font-bold text-text">
                {kind === "video" ? t("chat.recordVideo") : t("chat.recordVoice")}
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-xs text-muted">
                {t("chat.recordHint")}
              </Dialog.Description>
            </div>
            <button
              type="button"
              className="icon-button"
              onClick={cancel}
              aria-label={t("common.close")}
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-border bg-rail">
            {kind === "video" ? (
              <div className="relative aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="h-full w-full -scale-x-100 object-cover"
                />
                <span className="absolute start-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  <span className="size-2 animate-pulse rounded-full bg-danger" />
                  {t("chat.recording")}
                </span>
              </div>
            ) : (
              <div className="flex h-40 flex-col items-center justify-center gap-3">
                <span className="inline-flex size-14 items-center justify-center rounded-full bg-primary-soft text-primary">
                  <Mic className="size-7" aria-hidden="true" />
                </span>
                <div className="flex h-10 items-center gap-1">
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((bar) => (
                    <span
                      key={bar}
                      className="w-1.5 animate-pulse rounded-full bg-primary"
                      style={{
                        height: `${12 + ((bar * 13) % 30)}px`,
                        animationDelay: `${bar * 90}ms`
                      }}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rail-muted">
                  {t("chat.recording")}
                </span>
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="font-mono text-sm font-semibold text-text">
              {String(Math.floor(seconds / 60)).padStart(2, "0")}:
              {String(seconds % 60).padStart(2, "0")}
              <span className="ms-2 text-xs font-normal text-faint">/ 02:00</span>
            </span>

            <div className="flex items-center gap-2">
              <button type="button" className="btn-secondary" onClick={cancel}>
                {t("common.cancel")}
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={stop}
                disabled={starting || uploading || seconds >= 120}
              >
                {starting || uploading ? (
                  <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                ) : kind === "video" ? (
                  <CircleStop className="size-4" aria-hidden="true" />
                ) : (
                  <Square className="size-4" aria-hidden="true" />
                )}
                {uploading ? t("chat.uploading") : t("chat.stopRecording")}
              </button>
            </div>
          </div>

          {error && (
            <p role="alert" className="mt-3 rounded-lg border border-danger bg-danger-soft px-3 py-2 text-sm text-text">
              {t(`errors.${error}`, { defaultValue: t("errors.generic") })}
            </p>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
