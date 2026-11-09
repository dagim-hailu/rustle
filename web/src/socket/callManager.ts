import { CALL_EVENT_TO_WIRE, type WireCallEvent, type WireCallParticipant } from "../lib/protocol";
import { chatSocket } from "../socket/chatSocket";
import { useCallStore } from "../store/callStore";
import { useChatStore } from "../store/chatStore";
import type { CallParticipant, Channel } from "../types";

interface Peer {
  pc: RTCPeerConnection;
  polite: boolean;
  audioSender: RTCRtpSender;
  videoSender: RTCRtpSender;
  ready: Promise<void>;
  pendingIce: RTCIceCandidateInit[];
  remoteStream: MediaStream;
}

function iceServers(): RTCIceServer[] {
  const stun = (import.meta.env.VITE_STUN_URLS || "stun:stun.l.google.com:19302")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean)
    .map((urls) => ({ urls }));

  const turnUrl = import.meta.env.VITE_TURN_URL?.trim();
  if (!turnUrl) return stun;

  return [
    ...stun,
    {
      urls: turnUrl,
      username: import.meta.env.VITE_TURN_USERNAME || "",
      credential: import.meta.env.VITE_TURN_CREDENTIAL || ""
    }
  ];
}

function participantFromWire(
  sessionId: string,
  value: Partial<WireCallParticipant> & {
    fromDisplayName?: string;
    fromAvatarUrl?: string;
    fromAvatarColor?: string;
  },
  event?: WireCallEvent
): CallParticipant {
  return {
    sessionId,
    userId: event?.fromUserId ?? value.userId ?? "",
    displayName: event?.fromDisplayName ?? value.displayName ?? "Participant",
    avatarUrl: (event?.fromAvatarUrl ?? value.avatarUrl) || null,
    avatarColor: event?.fromAvatarColor ?? value.avatarColor ?? "#B7410E",
    video: Boolean(event?.video ?? value.video),
    muted: Boolean(event?.muted ?? value.muted),
    deafened: Boolean(event?.deafened ?? value.deafened),
    screenSharing: Boolean(event?.screenSharing ?? value.screenSharing)
  };
}

function userErrorName(error: unknown): string {
  if (error instanceof DOMException) {
    if (error.name === "NotAllowedError") return "CALL_PERMISSION_DENIED";
    if (error.name === "NotFoundError") return "CALL_DEVICE_NOT_FOUND";
    if (error.name === "NotReadableError") return "CALL_DEVICE_BUSY";
  }
  return "CALL_FAILED";
}

class CallManager {
  private localStream: MediaStream | null = null;
  private screenStream: MediaStream | null = null;
  private peers = new Map<string, Peer>();
  private remoteStreams = new Map<string, MediaStream>();
  private selfSessionId: string | null = null;
  private joinTimer: ReturnType<typeof setTimeout> | null = null;
  private generation = 0;

  async join(channel: Channel, withVideo: boolean): Promise<void> {
    if (useChatStore.getState().socketStatus !== "connected") {
      useCallStore.getState().setError("CALL_OFFLINE");
      return;
    }

    const current = useCallStore.getState();
    if (current.channelId === channel.id && (current.status === "active" || current.status === "joining")) {
      return;
    }

    if (current.channelId) {
      if (
        current.channelId !== channel.id &&
        useChatStore.getState().socketStatus === "connected"
      ) {
        chatSocket.leaveCall(current.channelId);
      }
      this.cleanup();
    }

    const generation = ++this.generation;
    useCallStore.getState().beginJoining(channel.id, channel.guildId, withVideo);

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: withVideo
          ? { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" }
          : false
      });
    } catch (error) {
      if (withVideo) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
          useChatStore.getState().setError("CAMERA_UNAVAILABLE");
        } catch (audioError) {
          if (generation === this.generation) {
            useCallStore.getState().setError(userErrorName(audioError));
          }
          return;
        }
      } else {
        if (generation === this.generation) {
          useCallStore.getState().setError(userErrorName(error));
        }
        return;
      }
    }

    if (generation !== this.generation) {
      stream.getTracks().forEach((track) => track.stop());
      return;
    }

    this.localStream = stream;
    const hasVideo = stream.getVideoTracks().length > 0;
    useCallStore.getState().setLocalMedia({ video: hasVideo, muted: false, deafened: false, screenSharing: false });

    if (!chatSocket.joinCall(channel.id, hasVideo, false, false)) {
      this.cleanup();
      useCallStore.getState().setError("CALL_OFFLINE");
      return;
    }

    if (this.joinTimer) clearTimeout(this.joinTimer);
    this.joinTimer = setTimeout(() => {
      if (useCallStore.getState().status === "joining") {
        this.leave();
        useCallStore.getState().setError("CALL_TIMEOUT");
      }
    }, 15_000);
  }

  leave(): void {
    const channelId = useCallStore.getState().channelId;
    if (channelId && useChatStore.getState().socketStatus === "connected") {
      chatSocket.leaveCall(channelId);
    }
    this.cleanup();
  }

  toggleMute(): void {
    if (!this.localStream) return;
    const muted = !useCallStore.getState().muted;
    this.localStream.getAudioTracks().forEach((track) => {
      track.enabled = !muted;
    });
    useCallStore.getState().setLocalMedia({ muted });
    this.updateSelf({ muted });
    this.publishMedia();
  }

  toggleDeafen(): void {
    const deafened = !useCallStore.getState().deafened;
    useCallStore.getState().setLocalMedia({ deafened });
    this.updateSelf({ deafened });
    this.publishMedia();
  }

  async toggleVideo(): Promise<void> {
    if (!this.localStream) return;
    const enabled = useCallStore.getState().video;

    if (enabled) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.stop();
        this.localStream.removeTrack(videoTrack);
      }
      if (!useCallStore.getState().screenSharing) {
        await this.replaceVideoTrack(null);
      }
      useCallStore.getState().setLocalMedia({ video: false });
      this.updateSelf({ video: false });
      this.publishMedia();
      useCallStore.getState().bumpMedia();
      return;
    }

    try {
      const camera = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" }
      });
      const track = camera.getVideoTracks()[0];
      if (!track) return;
      this.localStream.addTrack(track);
      if (!useCallStore.getState().screenSharing) await this.replaceVideoTrack(track);
      useCallStore.getState().setLocalMedia({ video: true });
      this.updateSelf({ video: true });
      this.publishMedia();
      useCallStore.getState().bumpMedia();
    } catch (error) {
      useCallStore.getState().setError(userErrorName(error));
      useCallStore.getState().setStatus("active");
    }
  }

  async toggleScreen(): Promise<void> {
    if (!this.localStream) return;

    if (this.screenStream) {
      this.stopScreenShare();
      return;
    }

    try {
      const screen = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      const track = screen.getVideoTracks()[0];
      if (!track) return;
      this.screenStream = screen;
      track.addEventListener("ended", () => this.stopScreenShare());
      await this.replaceVideoTrack(track);
      useCallStore.getState().setLocalMedia({ screenSharing: true });
      this.updateSelf({ screenSharing: true });
      this.publishMedia();
      useCallStore.getState().bumpMedia();
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "NotAllowedError")) {
        useCallStore.getState().setError(userErrorName(error));
        useCallStore.getState().setStatus("active");
      }
    }
  }

  getLocalStream(): MediaStream | null {
    return this.screenStream ?? this.localStream;
  }

  getRemoteStream(sessionId: string): MediaStream | null {
    return this.remoteStreams.get(sessionId) ?? null;
  }

  handleSnapshot(snapshot: {
    channelId: string;
    selfSessionId: string;
    participants: WireCallParticipant[];
  }): void {
    const store = useCallStore.getState();
    if (store.channelId !== snapshot.channelId) return;
    if (this.joinTimer) clearTimeout(this.joinTimer);
    this.joinTimer = null;
    this.selfSessionId = snapshot.selfSessionId;

    const participants = snapshot.participants.map((entry) =>
      participantFromWire(entry.sessionId, entry)
    );

    useCallStore.getState().applySnapshot(
      snapshot.channelId,
      snapshot.selfSessionId,
      participants
    );
    useCallStore.getState().setError(null);

    for (const participant of participants) {
      if (participant.sessionId !== snapshot.selfSessionId) {
        void this.offerTo(participant.sessionId);
      }
    }
  }

  handleEvent(event: WireCallEvent): void {
    const store = useCallStore.getState();
    if (!store.channelId || store.channelId !== event.channelId) return;
    if (!event.fromSessionId || event.fromSessionId === store.selfSessionId) return;

    switch (event.type) {
      case "CALL_EVENT_TYPE_JOIN": {
        useCallStore
          .getState()
          .upsertParticipant(participantFromWire(event.fromSessionId, {}, event));
        break;
      }

      case "CALL_EVENT_TYPE_LEAVE": {
        this.closePeer(event.fromSessionId);
        useCallStore.getState().removeParticipant(event.fromSessionId);
        break;
      }

      case "CALL_EVENT_TYPE_MEDIA": {
        useCallStore.getState().updateParticipant(event.fromSessionId, {
          video: Boolean(event.video),
          muted: Boolean(event.muted),
          deafened: Boolean(event.deafened),
          screenSharing: Boolean(event.screenSharing)
        });
        break;
      }

      case "CALL_EVENT_TYPE_OFFER":
      case "CALL_EVENT_TYPE_ANSWER":
      case "CALL_EVENT_TYPE_ICE":
        if (event.targetSessionId && event.targetSessionId !== store.selfSessionId) {
          return;
        }
        void this.handleSignal(event);
        break;

      default:
        break;
    }
  }

  disconnected(): void {
    if (useCallStore.getState().channelId) {
      this.cleanup();
    }
  }

  handleCallError(code: string): void {
    const state = useCallStore.getState();
    if (state.status === "joining") {
      this.cleanup();
      useCallStore.getState().setError(code);
    } else {
      useChatStore.getState().setError(code);
    }
  }

  private async handleSignal(event: WireCallEvent): Promise<void> {
    const peer = this.ensurePeer(event.fromSessionId);
    if (!peer) return;
    await peer.ready;

    if (event.type === "CALL_EVENT_TYPE_ICE") {
      if (!event.candidate) return;
      let candidate: RTCIceCandidateInit = { candidate: event.candidate };
      try {
        const parsed = JSON.parse(event.candidate) as RTCIceCandidateInit;
        if (parsed && typeof parsed.candidate === "string") candidate = parsed;
      } catch {
        // Older clients may send only the candidate string.
      }
      if (peer.pc.remoteDescription) {
        await peer.pc.addIceCandidate(candidate).catch(() => undefined);
      } else {
        peer.pendingIce.push(candidate);
      }
      return;
    }

    if (event.type === "CALL_EVENT_TYPE_OFFER") {
      if (!event.sdp) return;

      if (peer.pc.signalingState !== "stable") {
        if (!peer.polite) return;
        await peer.pc.setLocalDescription({ type: "rollback" }).catch(() => undefined);
      }

      await peer.pc.setRemoteDescription({ type: "offer", sdp: event.sdp });
      await this.flushIce(peer);
      for (const transceiver of peer.pc.getTransceivers()) {
        transceiver.direction = "sendrecv";
      }
      const answer = await peer.pc.createAnswer();
      await peer.pc.setLocalDescription(answer);
      chatSocket.sendCallSignal(
        event.channelId,
        event.fromSessionId,
        CALL_EVENT_TO_WIRE.answer,
        { sdp: answer.sdp ?? "" }
      );
      return;
    }

    if (event.type === "CALL_EVENT_TYPE_ANSWER" && event.sdp) {
      if (peer.pc.signalingState === "have-local-offer") {
        await peer.pc.setRemoteDescription({ type: "answer", sdp: event.sdp });
        await this.flushIce(peer);
      }
    }
  }

  private async offerTo(sessionId: string): Promise<void> {
    const peer = this.ensurePeer(sessionId);
    const channelId = useCallStore.getState().channelId;
    if (!peer || !channelId) return;
    await peer.ready;
    if (peer.pc.signalingState !== "stable") return;

    try {
      for (const transceiver of peer.pc.getTransceivers()) {
        transceiver.direction = "sendrecv";
      }
      const offer = await peer.pc.createOffer();
      await peer.pc.setLocalDescription(offer);
      chatSocket.sendCallSignal(channelId, sessionId, CALL_EVENT_TO_WIRE.offer, {
        sdp: offer.sdp ?? ""
      });
    } catch {
      // The connection-state handler reports the failure in the call UI.
    }
  }

  private ensurePeer(sessionId: string): Peer | null {
    const existing = this.peers.get(sessionId);
    if (existing) return existing;

    const pc = new RTCPeerConnection({ iceServers: iceServers() });
    const audioTransceiver = pc.addTransceiver("audio", { direction: "sendrecv" });
    const videoTransceiver = pc.addTransceiver("video", { direction: "sendrecv" });

    const audio = this.localStream?.getAudioTracks()[0] ?? null;
    const video = useCallStore.getState().screenSharing
      ? this.screenStream?.getVideoTracks()[0] ?? null
      : this.localStream?.getVideoTracks()[0] ?? null;

    const ready = Promise.all([
      audioTransceiver.sender.replaceTrack(audio).catch(() => undefined),
      videoTransceiver.sender.replaceTrack(video).catch(() => undefined)
    ]).then(() => undefined);

    const remoteStream = new MediaStream();
    const peer: Peer = {
      pc,
      polite: Boolean(this.selfSessionId && this.selfSessionId < sessionId),
      audioSender: audioTransceiver.sender,
      videoSender: videoTransceiver.sender,
      ready,
      pendingIce: [],
      remoteStream
    };

    pc.ontrack = (event) => {
      const stream = event.streams[0] ?? remoteStream;
      if (!stream.getTracks().includes(event.track)) {
        stream.addTrack(event.track);
      }
      this.remoteStreams.set(sessionId, stream);
      useCallStore.getState().bumpMedia();
    };

    pc.onicecandidate = (event) => {
      if (!event.candidate) {
        return;
      }
      const channelId = useCallStore.getState().channelId;
      if (!channelId) return;
      chatSocket.sendCallSignal(channelId, sessionId, CALL_EVENT_TO_WIRE.ice, {
        candidate: JSON.stringify(event.candidate.toJSON())
      });
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "failed") {
        useChatStore.getState().setError("CALL_CONNECTION_FAILED");
      }
    };

    this.peers.set(sessionId, peer);
    return peer;
  }

  private async replaceVideoTrack(track: MediaStreamTrack | null): Promise<void> {
    await Promise.all(
      [...this.peers.values()].map((peer) =>
        peer.videoSender.replaceTrack(track).catch(() => undefined)
      )
    );
  }

  private async flushIce(peer: Peer): Promise<void> {
    const pending = peer.pendingIce.splice(0);
    for (const candidate of pending) {
      await peer.pc.addIceCandidate(candidate).catch(() => undefined);
    }
  }

  private stopScreenShare(): void {
    this.screenStream?.getTracks().forEach((track) => track.stop());
    this.screenStream = null;
    const camera = useCallStore.getState().video
      ? this.localStream?.getVideoTracks()[0] ?? null
      : null;
    void this.replaceVideoTrack(camera);
    useCallStore.getState().setLocalMedia({ screenSharing: false });
    this.updateSelf({ screenSharing: false });
    this.publishMedia();
    useCallStore.getState().bumpMedia();
  }

  private updateSelf(patch: Partial<CallParticipant>): void {
    const { selfSessionId } = useCallStore.getState();
    if (selfSessionId) useCallStore.getState().updateParticipant(selfSessionId, patch);
  }

  private publishMedia(): void {
    const state = useCallStore.getState();
    if (!state.channelId || useChatStore.getState().socketStatus !== "connected") return;
    chatSocket.sendCallMedia(state.channelId, {
      video: state.video,
      muted: state.muted,
      deafened: state.deafened,
      screenSharing: state.screenSharing
    });
  }

  private closePeer(sessionId: string): void {
    const peer = this.peers.get(sessionId);
    if (!peer) return;
    peer.pc.onicecandidate = null;
    peer.pc.ontrack = null;
    peer.pc.close();
    this.peers.delete(sessionId);
    this.remoteStreams.delete(sessionId);
    useCallStore.getState().bumpMedia();
  }

  private cleanup(): void {
    if (this.joinTimer) clearTimeout(this.joinTimer);
    this.joinTimer = null;
    this.generation += 1;
    this.selfSessionId = null;

    for (const peer of this.peers.values()) {
      peer.pc.close();
    }
    this.peers.clear();
    this.remoteStreams.clear();

    this.localStream?.getTracks().forEach((track) => track.stop());
    this.screenStream?.getTracks().forEach((track) => track.stop());
    this.localStream = null;
    this.screenStream = null;
    useCallStore.getState().reset();
  }
}

export const callManager = new CallManager();

chatSocket.setCallHandler({
  onSnapshot: (snapshot) => callManager.handleSnapshot(snapshot),
  onEvent: (event) => callManager.handleEvent(event),
  onDisconnected: () => callManager.disconnected(),
  onError: (code) => callManager.handleCallError(code)
});
