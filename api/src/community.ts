import type { Pool } from "pg";

/**
 * Data access for the Rustle community layer.
 *
 * Message bytes stay in ScyllaDB untouched. Everything added on top of a message
 * (reactions, edits, soft deletes, replies, pins) is captured as metadata here
 * and applied when a history page is served.
 */

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

export interface MessageOverride {
  content: string | null;
  deleted: boolean;
  editedAt: number;
}

export interface MessageMeta {
  reactions: Map<string, ReactionGroup[]>;
  overrides: Map<string, MessageOverride>;
  replies: Map<string, ReplyPreview>;
  pinned: Set<string>;
}

export interface PinRecord {
  messageId: string;
  channelId: string;
  pinnedBy: string;
  authorId: string | null;
  authorName: string;
  content: string;
  attachments: string[];
  createdAt: string;
}

export interface SavedRecord {
  messageId: string;
  channelId: string;
  channelName: string;
  authorName: string;
  content: string;
  attachments: string[];
  createdAt: string;
}

export interface ChannelPermission {
  canView: boolean;
  canSend: boolean;
}

export type GuildRole = "owner" | "admin" | "member";

export function emptyMeta(): MessageMeta {
  return {
    reactions: new Map(),
    overrides: new Map(),
    replies: new Map(),
    pinned: new Set()
  };
}

function parseAttachments(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string");
  return [];
}

/**
 * Remember (channel, message) -> author for a page of server-verified history.
 * This index is what edit/delete authorization trusts; a client can never
 * assert authorship because it never supplies the author on the request.
 */
export async function recordAuthors(
  pool: Pool,
  channelId: string,
  entries: Array<{ messageId: bigint; authorId: string }>
): Promise<void> {
  if (entries.length === 0) return;
  const ids = entries.map((entry) => entry.messageId.toString());
  const authors = entries.map((entry) => entry.authorId);
  await pool.query(
    `INSERT INTO message_authors (channel_id, message_id, author_id)
     SELECT $1, ids, authors FROM unnest($2::bigint[], $3::uuid[]) AS t(ids, authors)
     ON CONFLICT (channel_id, message_id) DO NOTHING`,
    [channelId, ids, authors]
  );
}

export async function loadMessageMeta(
  pool: Pool,
  channelId: string,
  messageIds: string[],
  viewerId: string
): Promise<MessageMeta> {
  const meta = emptyMeta();
  if (messageIds.length === 0) return meta;

  const [reactions, overrides, replies, pins] = await Promise.all([
    pool.query<{ message_id: string; emoji: string; count: number; mine: boolean }>(
      `SELECT message_id::text AS message_id, emoji, count(*)::int AS count,
              bool_or(user_id = $3) AS mine
       FROM message_reactions
       WHERE channel_id = $1 AND message_id = ANY($2::bigint[])
       GROUP BY message_id, emoji
       ORDER BY min(created_at)`,
      [channelId, messageIds, viewerId]
    ),
    pool.query<{
      message_id: string;
      edited_content: string | null;
      deleted: boolean;
      edited_at: Date;
    }>(
      `SELECT message_id::text AS message_id, edited_content, deleted, edited_at
       FROM message_overrides
       WHERE channel_id = $1 AND message_id = ANY($2::bigint[])`,
      [channelId, messageIds]
    ),
    pool.query<{
      message_id: string;
      reply_to_id: string;
      preview_author: string;
      preview_content: string;
    }>(
      `SELECT message_id::text AS message_id, reply_to_id::text AS reply_to_id,
              preview_author, preview_content
       FROM message_replies
       WHERE channel_id = $1 AND message_id = ANY($2::bigint[])`,
      [channelId, messageIds]
    ),
    pool.query<{ message_id: string }>(
      `SELECT message_id::text AS message_id
       FROM pinned_messages
       WHERE channel_id = $1 AND message_id = ANY($2::bigint[])`,
      [channelId, messageIds]
    )
  ]);

  for (const row of reactions.rows) {
    const list = meta.reactions.get(row.message_id) ?? [];
    list.push({ emoji: row.emoji, count: row.count, mine: row.mine });
    meta.reactions.set(row.message_id, list);
  }

  for (const row of overrides.rows) {
    meta.overrides.set(row.message_id, {
      content: row.edited_content,
      deleted: row.deleted,
      editedAt: new Date(row.edited_at).getTime()
    });
  }

  for (const row of replies.rows) {
    meta.replies.set(row.message_id, {
      id: row.reply_to_id,
      authorName: row.preview_author,
      content: row.preview_content
    });
  }

  for (const row of pins.rows) meta.pinned.add(row.message_id);

  return meta;
}

/** A message is editable/deletable by its author, or by a guild manager. */
export async function canMutateMessage(
  pool: Pool,
  channelId: string,
  messageId: string,
  viewerId: string,
  role: GuildRole
): Promise<boolean> {
  if (role === "owner" || role === "admin") return true;
  const result = await pool.query<{ author_id: string }>(
    "SELECT author_id FROM message_authors WHERE channel_id = $1 AND message_id = $2",
    [channelId, messageId]
  );
  return result.rows[0]?.author_id === viewerId;
}

export async function setReaction(
  pool: Pool,
  channelId: string,
  messageId: string,
  userId: string,
  emoji: string,
  active: boolean
): Promise<number> {
  if (active) {
    await pool.query(
      `INSERT INTO message_reactions (channel_id, message_id, user_id, emoji)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT DO NOTHING`,
      [channelId, messageId, userId, emoji]
    );
  } else {
    await pool.query(
      `DELETE FROM message_reactions
       WHERE channel_id = $1 AND message_id = $2 AND user_id = $3 AND emoji = $4`,
      [channelId, messageId, userId, emoji]
    );
  }

  const result = await pool.query<{ count: number }>(
    `SELECT count(*)::int AS count FROM message_reactions
     WHERE channel_id = $1 AND message_id = $2 AND emoji = $3`,
    [channelId, messageId, emoji]
  );
  return result.rows[0]?.count ?? 0;
}

export async function upsertOverride(
  pool: Pool,
  input: {
    channelId: string;
    messageId: string;
    editorId: string;
    content: string | null;
    deleted: boolean;
  }
): Promise<MessageOverride> {
  const result = await pool.query<{
    edited_content: string | null;
    deleted: boolean;
    edited_at: Date;
  }>(
    `INSERT INTO message_overrides (channel_id, message_id, editor_id, edited_content, deleted, edited_at)
     VALUES ($1, $2, $3, $4, $5, now())
     ON CONFLICT (channel_id, message_id) DO UPDATE
       SET editor_id = EXCLUDED.editor_id,
           edited_content = EXCLUDED.edited_content,
           deleted = EXCLUDED.deleted,
           edited_at = now()
     RETURNING edited_content, deleted, edited_at`,
    [input.channelId, input.messageId, input.editorId, input.content, input.deleted]
  );
  const row = result.rows[0]!;
  return {
    content: row.edited_content,
    deleted: row.deleted,
    editedAt: new Date(row.edited_at).getTime()
  };
}

export async function setReply(
  pool: Pool,
  input: {
    channelId: string;
    messageId: string;
    replyToId: string;
    authorId: string;
    previewAuthor: string;
    previewContent: string;
  }
): Promise<ReplyPreview> {
  await pool.query(
    `INSERT INTO message_replies
       (channel_id, message_id, reply_to_id, author_id, preview_author, preview_content)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (channel_id, message_id) DO UPDATE
       SET reply_to_id = EXCLUDED.reply_to_id,
           preview_author = EXCLUDED.preview_author,
           preview_content = EXCLUDED.preview_content`,
    [
      input.channelId,
      input.messageId,
      input.replyToId,
      input.authorId,
      input.previewAuthor,
      input.previewContent
    ]
  );
  return {
    id: input.replyToId,
    authorName: input.previewAuthor,
    content: input.previewContent
  };
}

export async function setPinned(
  pool: Pool,
  input: {
    channelId: string;
    messageId: string;
    actorId: string;
    pinned: boolean;
    snapshot?: {
      authorId: string | null;
      authorName: string;
      content: string;
      attachments: string[];
    };
  }
): Promise<boolean> {
  if (!input.pinned) {
    await pool.query(
      "DELETE FROM pinned_messages WHERE channel_id = $1 AND message_id = $2",
      [input.channelId, input.messageId]
    );
    return false;
  }

  await pool.query(
    `INSERT INTO pinned_messages
       (channel_id, message_id, pinned_by, snapshot_author_id, snapshot_author,
        snapshot_content, snapshot_attachments)
     VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)
     ON CONFLICT (channel_id, message_id) DO NOTHING`,
    [
      input.channelId,
      input.messageId,
      input.actorId,
      input.snapshot?.authorId ?? null,
      input.snapshot?.authorName ?? "",
      input.snapshot?.content ?? "",
      JSON.stringify(input.snapshot?.attachments ?? [])
    ]
  );
  return true;
}

export async function listPins(pool: Pool, channelId: string): Promise<PinRecord[]> {
  const result = await pool.query<{
    message_id: string;
    channel_id: string;
    pinned_by: string;
    snapshot_author_id: string | null;
    snapshot_author: string;
    snapshot_content: string;
    snapshot_attachments: unknown;
    created_at: Date;
  }>(
    `SELECT message_id::text AS message_id, channel_id, pinned_by, snapshot_author_id,
            snapshot_author, snapshot_content, snapshot_attachments, created_at
     FROM pinned_messages
     WHERE channel_id = $1
     ORDER BY created_at DESC`,
    [channelId]
  );

  return result.rows.map((row) => ({
    messageId: row.message_id,
    channelId: row.channel_id,
    pinnedBy: row.pinned_by,
    authorId: row.snapshot_author_id,
    authorName: row.snapshot_author,
    content: row.snapshot_content,
    attachments: parseAttachments(row.snapshot_attachments),
    createdAt: new Date(row.created_at).toISOString()
  }));
}

export async function saveMessage(
  pool: Pool,
  input: {
    userId: string;
    channelId: string;
    messageId: string;
    authorName: string;
    content: string;
    attachments: string[];
  }
): Promise<void> {
  await pool.query(
    `INSERT INTO saved_messages
       (user_id, channel_id, message_id, author_name, content, attachments)
     VALUES ($1, $2, $3, $4, $5, $6::jsonb)
     ON CONFLICT (user_id, message_id) DO NOTHING`,
    [
      input.userId,
      input.channelId,
      input.messageId,
      input.authorName,
      input.content,
      JSON.stringify(input.attachments)
    ]
  );
}

export async function deleteSaved(
  pool: Pool,
  userId: string,
  messageId: string
): Promise<void> {
  await pool.query("DELETE FROM saved_messages WHERE user_id = $1 AND message_id = $2", [
    userId,
    messageId
  ]);
}

export async function listSaved(pool: Pool, userId: string): Promise<SavedRecord[]> {
  const result = await pool.query<{
    message_id: string;
    channel_id: string;
    channel_name: string | null;
    author_name: string;
    content: string;
    attachments: unknown;
    created_at: Date;
  }>(
    `SELECT s.message_id::text AS message_id, s.channel_id, c.name AS channel_name,
            s.author_name, s.content, s.attachments, s.created_at
     FROM saved_messages s
     LEFT JOIN channels c ON c.id = s.channel_id
     WHERE s.user_id = $1
     ORDER BY s.created_at DESC
     LIMIT 200`,
    [userId]
  );

  return result.rows.map((row) => ({
    messageId: row.message_id,
    channelId: row.channel_id,
    channelName: row.channel_name ?? "",
    authorName: row.author_name,
    content: row.content,
    attachments: parseAttachments(row.attachments),
    createdAt: new Date(row.created_at).toISOString()
  }));
}

export async function markRead(
  pool: Pool,
  userId: string,
  channelId: string,
  messageId: string
): Promise<void> {
  await pool.query(
    `INSERT INTO channel_reads (user_id, channel_id, last_read_message_id, read_at)
     VALUES ($1, $2, $3, now())
     ON CONFLICT (user_id, channel_id) DO UPDATE
       SET last_read_message_id = GREATEST(channel_reads.last_read_message_id, EXCLUDED.last_read_message_id),
           read_at = now()`,
    [userId, channelId, messageId]
  );
}

export async function loadReadMarkers(
  pool: Pool,
  userId: string,
  channelIds: string[]
): Promise<Map<string, string>> {
  const markers = new Map<string, string>();
  if (channelIds.length === 0) return markers;
  const result = await pool.query<{ channel_id: string; last_read_message_id: string }>(
    `SELECT channel_id, last_read_message_id::text AS last_read_message_id
     FROM channel_reads
     WHERE user_id = $1 AND channel_id = ANY($2::uuid[])`,
    [userId, channelIds]
  );
  for (const row of result.rows) markers.set(row.channel_id, row.last_read_message_id);
  return markers;
}

export async function channelPermission(
  pool: Pool,
  channelId: string,
  role: GuildRole
): Promise<ChannelPermission> {
  if (role === "owner" || role === "admin") return { canView: true, canSend: true };
  const result = await pool.query<{ can_view: boolean; can_send: boolean }>(
    "SELECT can_view, can_send FROM channel_role_overrides WHERE channel_id = $1 AND role = $2",
    [channelId, role]
  );
  const row = result.rows[0];
  if (!row) return { canView: true, canSend: true };
  return { canView: row.can_view, canSend: row.can_send };
}

export async function listChannelOverrides(
  pool: Pool,
  channelId: string
): Promise<Array<{ role: "admin" | "member"; canView: boolean; canSend: boolean }>> {
  const result = await pool.query<{
    role: "admin" | "member";
    can_view: boolean;
    can_send: boolean;
  }>(
    "SELECT role, can_view, can_send FROM channel_role_overrides WHERE channel_id = $1 ORDER BY role",
    [channelId]
  );
  return result.rows.map((row) => ({
    role: row.role,
    canView: row.can_view,
    canSend: row.can_send
  }));
}

export async function setChannelOverride(
  pool: Pool,
  channelId: string,
  role: "admin" | "member",
  canView: boolean,
  canSend: boolean
): Promise<void> {
  await pool.query(
    `INSERT INTO channel_role_overrides (channel_id, role, can_view, can_send)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (channel_id, role) DO UPDATE
       SET can_view = EXCLUDED.can_view, can_send = EXCLUDED.can_send`,
    [channelId, role, canView, canSend]
  );
}
