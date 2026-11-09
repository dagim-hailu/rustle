import Long from "long";
import protobuf from "protobufjs/minimal";
import { chat } from "./chat.generated";
import type { Bootstrap, Guild, PresenceStatus } from "../types";

protobuf.util.Long = Long;
protobuf.configure();

// Static codegen is deliberate: protobufjs's reflection fallback generates
// encoders with `new Function`, which a strict `script-src 'self'` CSP blocks.
const ClientFrame = chat.v1.ClientFrame;
const ServerFrame = chat.v1.ServerFrame;

export interface WireUser {
  id: string;
  displayName: string;
  avatarColor: string;
  avatarUrl?: string;
  bio?: string;
  pronouns?: string;
  bannerUrl?: string;
  bannerColor?: string;
  createdAt?: string;
  locale: "en" | "am";
  presence?: string;
}

export interface WireChannel {
  id: string;
  guildId: string;
  name: string;
  topic: string;
  kind: string;
  position: number;
}

export interface WireMember {
  userId: string;
  displayName: string;
  avatarColor: string;
  avatarUrl?: string;
  bio?: string;
  pronouns?: string;
  bannerUrl?: string;
  bannerColor?: string;
  createdAt?: string;
  presence?: string;
  role: "owner" | "admin" | "member";
}

export interface WireGuild {
  id: string;
  name: string;
  iconColor: string;
  channels: WireChannel[];
  members: WireMember[];
  currentUserRole: string;
}

export interface WireAuthenticated {
  user: WireUser;
  guilds: WireGuild[];
  sessionId: string;
}

export interface WireChatMessage {
  id: string;
  channelId: string;
  guildId: string;
  authorId: string;
  authorName: string;
  authorColor: string;
  content: string;
  attachments: string[];
  timestampMs: string;
  clientId: string;
  authorAvatarUrl?: string;
}

export interface WireAck {
  channelId: string;
  clientId: string;
  messageId: string;
  status: string;
  timestampMs: string;
  error: string;
  retryable: boolean;
}

export interface WirePresence {
  guildId: string;
  userId: string;
  status: string;
  updatedAtMs: string;
}

export interface WirePresenceSnapshot {
  statuses: WirePresence[];
}

export interface WireTyping {
  channelId: string;
  userId: string;
  displayName: string;
  active: boolean;
}

export interface WireServerError {
  code: string;
  message: string;
  retryable: boolean;
}

export interface WireCallParticipant {
  sessionId: string;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  avatarColor: string;
  video: boolean;
  muted: boolean;
  deafened: boolean;
  screenSharing: boolean;
}

export interface WireCallSnapshot {
  channelId: string;
  selfSessionId: string;
  participants: WireCallParticipant[];
}

export interface WireCallEvent {
  channelId: string;
  fromSessionId: string;
  fromUserId?: string;
  fromDisplayName?: string;
  fromAvatarUrl?: string;
  fromAvatarColor?: string;
  targetSessionId?: string;
  type: string;
  sdp?: string;
  candidate?: string;
  video: boolean;
  muted: boolean;
  deafened: boolean;
  screenSharing: boolean;
}

export interface DecodedServerFrame {
  requestId?: string;
  payload?: string;
  authenticated?: WireAuthenticated;
  message?: WireChatMessage;
  ack?: WireAck;
  presence?: WirePresence;
  presenceSnapshot?: WirePresenceSnapshot;
  error?: WireServerError;
  pong?: { serverTimeMs: string; status: string };
  typing?: WireTyping;
  callSnapshot?: WireCallSnapshot;
  callEvent?: WireCallEvent;
}

// Enum fields are encoded as numeric values. protobufjs `create()` leaves
// enum-name strings at the zero value rather than resolving them, which would
// silently turn DND/Idle into UNSPECIFIED on the wire.
export const PRESENCE_TO_WIRE: Record<PresenceStatus, number> = {
  online: 1,
  idle: 2,
  dnd: 3,
  offline: 4
};

export function wireToPresence(status: string | undefined): PresenceStatus {
  switch (status) {
    case "PRESENCE_STATUS_ONLINE":
      return "online";
    case "PRESENCE_STATUS_IDLE":
      return "idle";
    case "PRESENCE_STATUS_DO_NOT_DISTURB":
      return "dnd";
    default:
      return "offline";
  }
}

export function wireToBootstrap(auth: WireAuthenticated): Bootstrap {
  const guilds: Guild[] = (auth.guilds ?? []).map((guild) => ({
    id: guild.id,
    name: guild.name,
    iconColor: guild.iconColor,
    role: normalizeRole(guild.currentUserRole),
    channels: (guild.channels ?? []).map((channel) => ({
      id: channel.id,
      guildId: channel.guildId,
      name: channel.name,
      topic: channel.topic,
      kind: channel.kind === "CHANNEL_KIND_VOICE" ? "voice" : "text",
      position: channel.position
    })),
    members: (guild.members ?? []).map((member) => ({
      userId: member.userId,
      displayName: member.displayName,
      avatarColor: member.avatarColor,
      avatarUrl: member.avatarUrl || null,
      bannerUrl: member.bannerUrl || null,
      bannerColor: member.bannerColor || "#0F4C5C",
      bio: member.bio || "",
      pronouns: member.pronouns || "",
      statusText: "",
      createdAt: member.createdAt || "",
      role: member.role as "owner" | "admin" | "member"
    }))
  }));

  return {
    user: {
      id: auth.user.id,
      email: "",
      displayName: auth.user.displayName,
      avatarColor: auth.user.avatarColor,
      avatarUrl: auth.user.avatarUrl || null,
      bannerUrl: auth.user.bannerUrl || null,
      bannerColor: auth.user.bannerColor || "#0F4C5C",
      bio: auth.user.bio || "",
      pronouns: auth.user.pronouns || "",
      statusText: "",
      createdAt: auth.user.createdAt || "",
      locale: auth.user.locale,
      quietHoursEnabled: false,
      quietHoursStart: 22,
      quietHoursEnd: 7
    },
    guilds
  };
}

function normalizeRole(value: string): "owner" | "admin" | "member" {
  if (value === "owner" || value === "admin") return value;
  return "member";
}

export function encodeClientFrame(payload: object, requestId: string): Uint8Array {
  const message = ClientFrame.create({ requestId, ...payload } as Record<string, unknown>);
  return ClientFrame.encode(message).finish();
}

export function decodeClientFrame(data: ArrayBuffer | Uint8Array): {
  requestId?: string;
  payload?: string;
  authenticate?: { token?: string };
  sendMessage?: { clientId?: string; channelId?: string; content?: string };
  setPresence?: { status?: string };
  heartbeat?: { status?: string };
  joinCall?: { channelId?: string; video?: boolean; muted?: boolean; deafened?: boolean };
  callSignal?: { channelId?: string; targetSessionId?: string; type?: string; sdp?: string; candidate?: string };
} {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
  const message = ClientFrame.decode(bytes);
  return ClientFrame.toObject(message, {
    longs: String,
    enums: String,
    oneofs: true,
    arrays: true,
    defaults: false
  }) as never;
}

export function decodeServerFrame(data: ArrayBuffer | Uint8Array): DecodedServerFrame {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
  const message = ServerFrame.decode(bytes);
  return ServerFrame.toObject(message, {
    longs: String,
    enums: String,
    oneofs: true,
    arrays: true,
    defaults: false
  }) as unknown as DecodedServerFrame;
}

export interface OutboundAuth {
  authenticate: { token: string; clientVersion: string };
}

export interface OutboundSubscribe {
  subscribe: { channelIds: string[] };
}

export interface OutboundSendMessage {
  sendMessage: {
    channelId: string;
    content: string;
    attachments: string[];
    clientId: string;
  };
}

export interface OutboundHeartbeat {
  heartbeat: { status: number };
}

export interface OutboundSetPresence {
  setPresence: { status: number };
}

export interface OutboundTyping {
  typing: { channelId: string; active: boolean };
}

export interface OutboundJoinCall {
  joinCall: { channelId: string; video: boolean; muted: boolean; deafened: boolean };
}

export interface OutboundLeaveCall {
  leaveCall: { channelId: string };
}

export interface OutboundCallSignal {
  callSignal: {
    channelId: string;
    targetSessionId: string;
    type: number;
    sdp?: string;
    candidate?: string;
  };
}

export interface OutboundCallMedia {
  callMedia: {
    channelId: string;
    video: boolean;
    muted: boolean;
    deafened: boolean;
    screenSharing: boolean;
  };
}

export const CALL_EVENT_TO_WIRE = {
  join: 1,
  leave: 2,
  offer: 3,
  answer: 4,
  ice: 5,
  media: 6
} as const;

export type OutboundPayload =
  | OutboundAuth
  | OutboundSubscribe
  | OutboundSendMessage
  | OutboundHeartbeat
  | OutboundSetPresence
  | OutboundTyping
  | OutboundJoinCall
  | OutboundLeaveCall
  | OutboundCallSignal
  | OutboundCallMedia;
