export type Locale = "en" | "am";
export type ThemeMode = "light" | "dark" | "system";

export type PresenceStatus = "online" | "idle" | "dnd" | "offline";
export type MessageStatus = "PENDING" | "COMMITTED" | "FAILED";
export type SocketStatus =
  | "idle"
  | "connecting"
  | "authenticating"
  | "connected"
  | "reconnecting"
  | "disconnected";

export interface ProfileFields {
  avatarColor: string;
  avatarUrl: string | null;
  bannerUrl: string | null;
  bannerColor: string;
  bio: string;
  pronouns: string;
  /** Discord-style short custom status line (Rustle: also drives quiet hours). */
  statusText: string;
  createdAt: string;
}

export interface User extends ProfileFields {
  id: string;
  email: string;
  displayName: string;
  locale: Locale;
  quietHoursEnabled: boolean;
  quietHoursStart: number;
  quietHoursEnd: number;
}

export interface Channel {
  id: string;
  guildId: string;
  name: string;
  topic: string;
  kind: "text" | "voice";
  position: number;
}

export interface Member extends ProfileFields {
  userId: string;
  displayName: string;
  role: "owner" | "admin" | "member";
}

export interface Guild {
  id: string;
  name: string;
  iconColor: string;
  role: "owner" | "admin" | "member";
  channels: Channel[];
  members: Member[];
}

export interface Bootstrap {
  user: User;
  guilds: Guild[];
}

export interface ApiAuthResponse {
  token: string;
  user: User;
}

export interface ProfileResponse {
  user: User;
  token: string;
}

export interface PublicProfile extends ProfileFields {
  id: string;
  displayName: string;
  locale: Locale;
}

export interface ReactionGroup {
  emoji: string;
  count: number;
  mine: boolean;
}

export interface ReplyPreview {
  id: string;
  authorName: string;
  content: string;
}

export interface HistoryMessage {
  id: string;
  channelId: string;
  authorId: string;
  authorName: string;
  authorColor: string;
  authorAvatarUrl: string | null;
  content: string;
  attachments: string[];
  timestampMs: number;
  deleted?: boolean;
  editedAt?: number | null;
  replyTo?: ReplyPreview | null;
  reactions?: ReactionGroup[];
  pinned?: boolean;
}

export interface PinMessage {
  messageId: string;
  channelId: string;
  pinnedBy: string;
  authorId: string | null;
  authorName: string;
  content: string;
  attachments: string[];
  createdAt: string;
}

export interface SavedMessage {
  messageId: string;
  channelId: string;
  channelName: string;
  authorName: string;
  content: string;
  attachments: string[];
  createdAt: string;
}

export interface Invite {
  code: string;
  maxUses: number;
  uses: number;
  expiresAt: string | null;
  revoked: boolean;
  createdAt: string;
}

export interface InvitePreview {
  code: string;
  guildId: string;
  guildName: string;
  memberCount: number;
  alreadyMember: boolean;
}

export interface ChannelPermissionState {
  canView: boolean;
  canSend: boolean;
  canManage: boolean;
  overrides: Array<{ role: "admin" | "member"; canView: boolean; canSend: boolean }>;
}

export interface DigestEntry {
  channelId: string;
  channelName: string;
  guildId: string;
  unreadCount: number;
  truncated: boolean;
  lastMessageMs: number | null;
  mentions: Array<{ id: string; authorId: string; content: string; timestampMs: number }>;
}

export interface Digest {
  generatedAt: number;
  totalUnread: number;
  mentionCount: number;
  channels: DigestEntry[];
}

export type ChannelEvent =
  | {
      type: "reaction";
      channelId: string;
      messageId: string;
      emoji: string;
      count: number;
      userId: string;
      added: boolean;
    }
  | { type: "edit"; channelId: string; messageId: string; content: string; editedAt: number }
  | { type: "delete"; channelId: string; messageId: string }
  | { type: "reply"; channelId: string; messageId: string; replyTo: ReplyPreview }
  | { type: "pin"; channelId: string; messageId: string; pinned: boolean };

export interface HistoryPage {
  messages: HistoryMessage[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface ChatMessageView extends HistoryMessage {
  status: MessageStatus;
  clientId?: string;
  error?: string;
}

export interface TypingEntry {
  userId: string;
  displayName: string;
  expiresAt: number;
}

export interface HistoryState {
  cursor: string | null;
  hasMore: boolean;
  loaded: boolean;
  loading: boolean;
  loadingOlder: boolean;
  error: string | null;
}

export type UploadKind = "image" | "audio" | "video";

export interface UploadResult {
  url: string;
  mimeType: string;
  kind: UploadKind;
  size: number;
}

export interface CallParticipant {
  sessionId: string;
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  avatarColor: string;
  video: boolean;
  muted: boolean;
  deafened: boolean;
  screenSharing: boolean;
}

export type CallStatus = "idle" | "joining" | "active" | "error";

export interface CallState {
  channelId: string | null;
  guildId: string | null;
  status: CallStatus;
  selfSessionId: string | null;
  participants: CallParticipant[];
  muted: boolean;
  video: boolean;
  screenSharing: boolean;
  deafened: boolean;
  error: string | null;
  mediaVersion: number;
}
