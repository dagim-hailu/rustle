import type {
  ApiAuthResponse,
  Bootstrap,
  Channel,
  ChannelPermissionState,
  Digest,
  HistoryPage,
  Invite,
  InvitePreview,
  Locale,
  Member,
  PinMessage,
  ProfileResponse,
  PublicProfile,
  SavedMessage,
  UploadKind,
  UploadResult
} from "../types";

export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const configuredBase = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

export function apiUrl(path: string): string {
  return `${configuredBase}${path}`;
}

export function attachmentUrl(reference: string): string {
  if (/^https?:\/\//i.test(reference)) return reference;
  return `${configuredBase}${reference}`;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
  timeoutMs = 12_000
): Promise<T> {
  const headers = new Headers(options.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;
  try {
    response = await fetch(apiUrl(path), {
      ...options,
      headers,
      signal: AbortSignal.timeout(timeoutMs)
    });
  } catch {
    throw new ApiError("NETWORK", "The server is unreachable", 0);
  }

  const type = response.headers.get("content-type") ?? "";
  const body = type.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    const code = typeof body?.code === "string" ? body.code : "REQUEST_FAILED";
    const message = typeof body?.message === "string" ? body.message : response.statusText;
    throw new ApiError(code, message, response.status);
  }

  return body as T;
}

export const api = {
  login(email: string, password: string): Promise<ApiAuthResponse> {
    return request<ApiAuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
  },

  register(input: {
    email: string;
    password: string;
    displayName: string;
    locale: Locale;
  }): Promise<ApiAuthResponse> {
    return request<ApiAuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(input)
    });
  },

  bootstrap(token: string): Promise<Bootstrap> {
    return request<Bootstrap>("/api/bootstrap", {}, token);
  },

  updateProfile(
    token: string,
    input: {
      displayName?: string;
      pronouns?: string;
      bio?: string;
      avatarColor?: string;
      bannerColor?: string;
      avatarUrl?: string | null;
      bannerUrl?: string | null;
      locale?: Locale;
      statusText?: string;
      quietHoursEnabled?: boolean;
      quietHoursStart?: number;
      quietHoursEnd?: number;
    }
  ): Promise<ProfileResponse> {
    return request("/api/me/profile", {
      method: "PATCH",
      body: JSON.stringify(input)
    }, token);
  },

  changePassword(
    token: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    return request(
      "/api/me/password",
      {
        method: "PUT",
        body: JSON.stringify({ currentPassword, newPassword })
      },
      token
    );
  },

  publicProfile(token: string, userId: string): Promise<{ profile: PublicProfile }> {
    return request(`/api/users/${encodeURIComponent(userId)}/profile`, {}, token);
  },

  history(
    token: string,
    channelId: string,
    before: string | null,
    limit = 50
  ): Promise<HistoryPage> {
    const params = new URLSearchParams({ limit: String(limit) });
    if (before) params.set("before", before);
    return request<HistoryPage>(
      `/api/channels/${encodeURIComponent(channelId)}/messages?${params.toString()}`,
      {},
      token
    );
  },

  createGuild(token: string, name: string): Promise<{ guildId: string; channelId: string }> {
    return request("/api/guilds", { method: "POST", body: JSON.stringify({ name }) }, token);
  },

  createChannel(
    token: string,
    guildId: string,
    input: { name: string; topic: string; kind: "text" | "voice" }
  ): Promise<Channel> {
    return request(
      `/api/guilds/${encodeURIComponent(guildId)}/channels`,
      { method: "POST", body: JSON.stringify(input) },
      token
    );
  },

  addMember(token: string, guildId: string, email: string): Promise<Member> {
    return request(
      `/api/guilds/${encodeURIComponent(guildId)}/members`,
      { method: "POST", body: JSON.stringify({ email }) },
      token
    );
  },

  billing(
    token: string,
    guildId: string
  ): Promise<{
    guildId: string;
    plan: string;
    seats: number;
    status: string;
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
    updatedAt: string | null;
  }> {
    return request(`/api/guilds/${encodeURIComponent(guildId)}/billing`, {}, token);
  },

  updateBilling(
    token: string,
    guildId: string,
    input: { plan: string; seats: number; status: string }
  ): Promise<unknown> {
    return request(
      `/api/guilds/${encodeURIComponent(guildId)}/billing`,
      { method: "PUT", body: JSON.stringify(input) },
      token
    );
  },

  upload(token: string, file: File, kind: UploadKind): Promise<UploadResult> {
    const form = new FormData();
    form.append("file", file);
    return request<UploadResult>(
      `/api/uploads?kind=${kind}`,
      { method: "POST", body: form },
      token,
      60_000
    );
  },

  // --- Community: reactions, edits, replies, pins --------------------------
  react(
    token: string,
    channelId: string,
    messageId: string,
    emoji: string
  ): Promise<{ messageId: string; emoji: string; count: number; mine: boolean }> {
    return request(
      `/api/channels/${encodeURIComponent(channelId)}/messages/${encodeURIComponent(
        messageId
      )}/reactions`,
      { method: "POST", body: JSON.stringify({ emoji }) },
      token
    );
  },

  unreact(
    token: string,
    channelId: string,
    messageId: string,
    emoji: string
  ): Promise<{ messageId: string; emoji: string; count: number; mine: boolean }> {
    const params = new URLSearchParams({ emoji });
    return request(
      `/api/channels/${encodeURIComponent(channelId)}/messages/${encodeURIComponent(
        messageId
      )}/reactions?${params.toString()}`,
      { method: "DELETE" },
      token
    );
  },

  editMessage(
    token: string,
    channelId: string,
    messageId: string,
    content: string
  ): Promise<{ messageId: string; content: string; editedAt: number }> {
    return request(
      `/api/channels/${encodeURIComponent(channelId)}/messages/${encodeURIComponent(messageId)}`,
      { method: "PATCH", body: JSON.stringify({ content }) },
      token
    );
  },

  deleteMessage(token: string, channelId: string, messageId: string): Promise<void> {
    return request(
      `/api/channels/${encodeURIComponent(channelId)}/messages/${encodeURIComponent(messageId)}`,
      { method: "DELETE" },
      token
    );
  },

  replyMessage(
    token: string,
    channelId: string,
    messageId: string,
    input: { replyToId: string; previewAuthor: string; previewContent: string }
  ): Promise<{ messageId: string; replyTo: { id: string; authorName: string; content: string } }> {
    return request(
      `/api/channels/${encodeURIComponent(channelId)}/messages/${encodeURIComponent(
        messageId
      )}/reply`,
      { method: "POST", body: JSON.stringify(input) },
      token
    );
  },

  pins(token: string, channelId: string): Promise<{ pins: PinMessage[] }> {
    return request(`/api/channels/${encodeURIComponent(channelId)}/pins`, {}, token);
  },

  pinMessage(
    token: string,
    channelId: string,
    messageId: string,
    snapshot: { authorName: string; content: string; attachments: string[] }
  ): Promise<{ messageId: string; pinned: boolean }> {
    return request(
      `/api/channels/${encodeURIComponent(channelId)}/messages/${encodeURIComponent(
        messageId
      )}/pin`,
      { method: "POST", body: JSON.stringify(snapshot) },
      token
    );
  },

  unpinMessage(token: string, channelId: string, messageId: string): Promise<void> {
    return request(
      `/api/channels/${encodeURIComponent(channelId)}/messages/${encodeURIComponent(
        messageId
      )}/pin`,
      { method: "DELETE" },
      token
    );
  },

  markChannelRead(token: string, channelId: string, messageId: string): Promise<void> {
    return request(
      `/api/channels/${encodeURIComponent(channelId)}/read`,
      { method: "POST", body: JSON.stringify({ messageId }) },
      token
    );
  },

  // --- Community: saved messages -------------------------------------------
  savedMessages(token: string): Promise<{ saved: SavedMessage[] }> {
    return request("/api/me/saved", {}, token);
  },

  saveMessage(
    token: string,
    input: {
      channelId: string;
      messageId: string;
      authorName: string;
      content: string;
      attachments: string[];
    }
  ): Promise<{ messageId: string; saved: boolean }> {
    return request("/api/me/saved", { method: "POST", body: JSON.stringify(input) }, token);
  },

  unsaveMessage(token: string, messageId: string): Promise<void> {
    return request(
      `/api/me/saved/${encodeURIComponent(messageId)}`,
      { method: "DELETE" },
      token
    );
  },

  // --- Community: permissions, roles, invites ------------------------------
  channelPermissions(token: string, channelId: string): Promise<ChannelPermissionState> {
    return request(`/api/channels/${encodeURIComponent(channelId)}/permissions`, {}, token);
  },

  updateChannelPermissions(
    token: string,
    channelId: string,
    overrides: Array<{ role: "admin" | "member"; canView: boolean; canSend: boolean }>
  ): Promise<{ overrides: ChannelPermissionState["overrides"] }> {
    return request(
      `/api/channels/${encodeURIComponent(channelId)}/permissions`,
      { method: "PUT", body: JSON.stringify({ overrides }) },
      token
    );
  },

  updateMemberRole(
    token: string,
    guildId: string,
    userId: string,
    role: "admin" | "member"
  ): Promise<{ userId: string; role: "owner" | "admin" | "member" }> {
    return request(
      `/api/guilds/${encodeURIComponent(guildId)}/members/${encodeURIComponent(userId)}`,
      { method: "PATCH", body: JSON.stringify({ role }) },
      token
    );
  },

  createInvite(
    token: string,
    guildId: string,
    input: { maxUses: number; expiresInHours: number }
  ): Promise<Invite> {
    return request(
      `/api/guilds/${encodeURIComponent(guildId)}/invites`,
      { method: "POST", body: JSON.stringify(input) },
      token
    );
  },

  listInvites(token: string, guildId: string): Promise<{ invites: Invite[] }> {
    return request(`/api/guilds/${encodeURIComponent(guildId)}/invites`, {}, token);
  },

  revokeInvite(token: string, guildId: string, code: string): Promise<void> {
    return request(
      `/api/guilds/${encodeURIComponent(guildId)}/invites/${encodeURIComponent(code)}`,
      { method: "DELETE" },
      token
    );
  },

  invitePreview(token: string, code: string): Promise<InvitePreview> {
    return request(`/api/invites/${encodeURIComponent(code)}`, {}, token);
  },

  acceptInvite(
    token: string,
    code: string
  ): Promise<{ guildId: string; alreadyMember: boolean }> {
    return request(
      `/api/invites/${encodeURIComponent(code)}`,
      { method: "POST" },
      token
    );
  },

  // --- Community: catch-up digest ------------------------------------------
  digest(token: string): Promise<Digest> {
    return request("/api/digest", {}, token, 30_000);
  },

  messageMeta(
    token: string,
    channelId: string,
    ids: string[]
  ): Promise<{
    reactions: Record<string, Array<{ emoji: string; count: number; mine: boolean }>>;
    overrides: Record<string, { content: string | null; deleted: boolean; editedAt: number }>;
    replies: Record<string, { id: string; authorName: string; content: string }>;
    pinned: string[];
  }> {
    const params = new URLSearchParams({ ids: ids.join(",") });
    return request(
      `/api/channels/${encodeURIComponent(channelId)}/meta?${params.toString()}`,
      {},
      token
    );
  }
};
