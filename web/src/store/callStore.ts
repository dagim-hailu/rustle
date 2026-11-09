import { create } from "zustand";
import type { CallParticipant, CallState, CallStatus } from "../types";

export function initialCallState(): CallState {
  return {
    channelId: null,
    guildId: null,
    status: "idle",
    selfSessionId: null,
    participants: [],
    muted: false,
    video: false,
    screenSharing: false,
    deafened: false,
    error: null,
    mediaVersion: 0
  };
}

interface CallStore extends CallState {
  beginJoining: (channelId: string, guildId: string | null, video: boolean) => void;
  applySnapshot: (
    channelId: string,
    selfSessionId: string,
    participants: CallParticipant[]
  ) => void;
  upsertParticipant: (participant: CallParticipant) => void;
  updateParticipant: (sessionId: string, patch: Partial<CallParticipant>) => void;
  removeParticipant: (sessionId: string) => void;
  setLocalMedia: (patch: Partial<Pick<CallState, "muted" | "video" | "screenSharing" | "deafened">>) => void;
  bumpMedia: () => void;
  setStatus: (status: CallStatus) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useCallStore = create<CallStore>((set) => ({
  ...initialCallState(),

  beginJoining: (channelId, guildId, video) =>
    set({
      ...initialCallState(),
      channelId,
      guildId,
      status: "joining",
      video
    }),

  applySnapshot: (channelId, selfSessionId, participants) =>
    set((state) => ({
      channelId,
      status: "active",
      selfSessionId,
      participants,
      mediaVersion: state.mediaVersion + 1
    })),

  upsertParticipant: (participant) =>
    set((state) => {
      const index = state.participants.findIndex(
        (entry) => entry.sessionId === participant.sessionId
      );
      const participants = [...state.participants];
      if (index >= 0) participants[index] = participant;
      else participants.push(participant);
      return { participants, mediaVersion: state.mediaVersion + 1 };
    }),

  updateParticipant: (sessionId, patch) =>
    set((state) => ({
      participants: state.participants.map((entry) =>
        entry.sessionId === sessionId ? { ...entry, ...patch } : entry
      ),
      mediaVersion: state.mediaVersion + 1
    })),

  removeParticipant: (sessionId) =>
    set((state) => ({
      participants: state.participants.filter(
        (entry) => entry.sessionId !== sessionId
      ),
      mediaVersion: state.mediaVersion + 1
    })),

  setLocalMedia: (patch) => set((state) => ({ ...state, ...patch })),

  bumpMedia: () => set((state) => ({ mediaVersion: state.mediaVersion + 1 })),

  setStatus: (status) => set({ status }),

  setError: (error) => set({ error, status: error ? "error" : "active" }),

  reset: () => set(initialCallState())
}));
