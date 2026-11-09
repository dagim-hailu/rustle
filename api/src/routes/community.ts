import type { FastifyPluginAsync } from "fastify";
import { randomBytes } from "node:crypto";
import type { Pool } from "pg";
import { z } from "zod";
import { currentUser, requireAuth } from "../auth.js";
import {
  canMutateMessage,
  channelPermission,
  deleteSaved,
  listChannelOverrides,
  listPins,
  listSaved,
  loadMessageMeta,
  loadReadMarkers,
  markRead,
  saveMessage,
  setChannelOverride,
  setPinned,
  setReaction,
  setReply,
  upsertOverride,
  type GuildRole
} from "../community.js";
import { HttpError } from "../http.js";
import { bytesToSnowflake, bytesToUuid } from "../ids.js";
import { channelAccess, guildRole } from "../queries.js";
import { ShieldUnavailableError } from "../shield.js";

const uuid = z.string().uuid();
const snowflake = z.string().regex(/^\d{1,19}$/);
const emojiSchema = z.string().min(1).max(32);
const messageParams = z.object({ channelId: uuid, messageId: snowflake });
const channelParams = z.object({ channelId: uuid });

const MAX_DIGEST_CHANNELS = 30;
const DIGEST_SCAN_LIMIT = 50;

function requireManager(role: GuildRole | null): void {
  if (role !== "owner" && role !== "admin") {
    throw new HttpError(403, "FORBIDDEN", "Guild owner or admin permission required");
  }
}

/** Membership + channel view permission. Managers bypass per-channel locks. */
async function requireChannelView(
  pool: Pool,
  channelId: string,
  userId: string
): Promise<{ id: string; guildId: string; name: string; role: GuildRole }> {
  const access = await channelAccess(pool, channelId, userId);
  if (!access) throw new HttpError(404, "CHANNEL_NOT_FOUND", "Channel not found");
  const permission = await channelPermission(pool, channelId, access.role);
  if (!permission.canView) throw new HttpError(404, "CHANNEL_NOT_FOUND", "Channel not found");
  return access;
}

export const communityRoutes: FastifyPluginAsync = async (app) => {
  // --- Reactions ------------------------------------------------------------
  app.post(
    "/api/channels/:channelId/messages/:messageId/reactions",
    { preHandler: requireAuth },
    async (request) => {
      const user = currentUser(request);
      const { channelId, messageId } = messageParams.parse(request.params);
      const { emoji } = z.object({ emoji: emojiSchema }).parse(request.body);
      await requireChannelView(app.pool, channelId, user.id);

      const count = await setReaction(app.pool, channelId, messageId, user.id, emoji, true);
      await app.events.publish({
        type: "reaction",
        channelId,
        messageId,
        emoji,
        count,
        userId: user.id,
        added: true
      });
      return { messageId, emoji, count, mine: true };
    }
  );

  app.delete(
    "/api/channels/:channelId/messages/:messageId/reactions",
    { preHandler: requireAuth },
    async (request) => {
      const user = currentUser(request);
      const { channelId, messageId } = messageParams.parse(request.params);
      const { emoji } = z.object({ emoji: emojiSchema }).parse(request.query);
      await requireChannelView(app.pool, channelId, user.id);

      const count = await setReaction(app.pool, channelId, messageId, user.id, emoji, false);
      await app.events.publish({
        type: "reaction",
        channelId,
        messageId,
        emoji,
        count,
        userId: user.id,
        added: false
      });
      return { messageId, emoji, count, mine: false };
    }
  );

  // --- Edit / delete --------------------------------------------------------
  app.patch(
    "/api/channels/:channelId/messages/:messageId",
    { preHandler: requireAuth },
    async (request) => {
      const user = currentUser(request);
      const { channelId, messageId } = messageParams.parse(request.params);
      const { content } = z.object({ content: z.string().trim().min(1).max(4000) }).parse(request.body);
      const access = await requireChannelView(app.pool, channelId, user.id);

      if (!(await canMutateMessage(app.pool, channelId, messageId, user.id, access.role))) {
        throw new HttpError(403, "FORBIDDEN", "You can only edit your own messages");
      }

      const override = await upsertOverride(app.pool, {
        channelId,
        messageId,
        editorId: user.id,
        content,
        deleted: false
      });
      await app.events.publish({
        type: "edit",
        channelId,
        messageId,
        content,
        editedAt: override.editedAt
      });
      return { messageId, content, editedAt: override.editedAt };
    }
  );

  app.delete(
    "/api/channels/:channelId/messages/:messageId",
    { preHandler: requireAuth },
    async (request, reply) => {
      const user = currentUser(request);
      const { channelId, messageId } = messageParams.parse(request.params);
      const access = await requireChannelView(app.pool, channelId, user.id);

      if (!(await canMutateMessage(app.pool, channelId, messageId, user.id, access.role))) {
        throw new HttpError(403, "FORBIDDEN", "You can only delete your own messages");
      }

      await upsertOverride(app.pool, {
        channelId,
        messageId,
        editorId: user.id,
        content: null,
        deleted: true
      });
      await app.events.publish({ type: "delete", channelId, messageId });
      return reply.code(204).send();
    }
  );

  // --- Replies --------------------------------------------------------------
  app.post(
    "/api/channels/:channelId/messages/:messageId/reply",
    { preHandler: requireAuth },
    async (request) => {
      const user = currentUser(request);
      const { channelId, messageId } = messageParams.parse(request.params);
      await requireChannelView(app.pool, channelId, user.id);

      const input = z
        .object({
          replyToId: snowflake,
          previewAuthor: z.string().trim().max(48).default(""),
          previewContent: z.string().trim().max(280).default("")
        })
        .parse(request.body);

      const preview = await setReply(app.pool, {
        channelId,
        messageId,
        replyToId: input.replyToId,
        authorId: user.id,
        previewAuthor: input.previewAuthor,
        previewContent: input.previewContent
      });
      await app.events.publish({ type: "reply", channelId, messageId, replyTo: preview });
      return { messageId, replyTo: preview };
    }
  );

  // --- Pins -----------------------------------------------------------------
  app.get("/api/channels/:channelId/pins", { preHandler: requireAuth }, async (request) => {
    const user = currentUser(request);
    const { channelId } = channelParams.parse(request.params);
    await requireChannelView(app.pool, channelId, user.id);
    return { pins: await listPins(app.pool, channelId) };
  });

  app.post(
    "/api/channels/:channelId/messages/:messageId/pin",
    { preHandler: requireAuth },
    async (request) => {
      const user = currentUser(request);
      const { channelId, messageId } = messageParams.parse(request.params);
      await requireChannelView(app.pool, channelId, user.id);
      requireManager(await guildRoleForChannel(app.pool, channelId, user.id));

      const input = z
        .object({
          authorName: z.string().trim().max(48).default(""),
          content: z.string().max(4000).default(""),
          attachments: z.array(z.string().max(512)).max(10).default([])
        })
        .parse(request.body ?? {});

      const author = await app.pool.query<{ author_id: string; display_name: string }>(
        `SELECT ma.author_id, u.display_name
         FROM message_authors ma JOIN users u ON u.id = ma.author_id
         WHERE ma.channel_id = $1 AND ma.message_id = $2`,
        [channelId, messageId]
      );

      await setPinned(app.pool, {
        channelId,
        messageId,
        actorId: user.id,
        pinned: true,
        snapshot: {
          authorId: author.rows[0]?.author_id ?? null,
          authorName: author.rows[0]?.display_name ?? input.authorName,
          content: input.content,
          attachments: input.attachments
        }
      });
      await app.events.publish({ type: "pin", channelId, messageId, pinned: true });
      return { messageId, pinned: true };
    }
  );

  app.delete(
    "/api/channels/:channelId/messages/:messageId/pin",
    { preHandler: requireAuth },
    async (request, reply) => {
      const user = currentUser(request);
      const { channelId, messageId } = messageParams.parse(request.params);
      await requireChannelView(app.pool, channelId, user.id);
      requireManager(await guildRoleForChannel(app.pool, channelId, user.id));

      await setPinned(app.pool, { channelId, messageId, actorId: user.id, pinned: false });
      await app.events.publish({ type: "pin", channelId, messageId, pinned: false });
      return reply.code(204).send();
    }
  );

  // --- Read markers ---------------------------------------------------------
  app.post("/api/channels/:channelId/read", { preHandler: requireAuth }, async (request, reply) => {
    const user = currentUser(request);
    const { channelId } = channelParams.parse(request.params);
    const { messageId } = z.object({ messageId: snowflake }).parse(request.body);
    await requireChannelView(app.pool, channelId, user.id);
    await markRead(app.pool, user.id, channelId, messageId);
    return reply.code(204).send();
  });

  // --- Saved messages -------------------------------------------------------
  app.get("/api/me/saved", { preHandler: requireAuth }, async (request) => {
    const user = currentUser(request);
    return { saved: await listSaved(app.pool, user.id) };
  });

  app.post("/api/me/saved", { preHandler: requireAuth }, async (request, reply) => {
    const user = currentUser(request);
    const input = z
      .object({
        channelId: uuid,
        messageId: snowflake,
        authorName: z.string().trim().max(48).default(""),
        content: z.string().max(4000).default(""),
        attachments: z.array(z.string().max(512)).max(10).default([])
      })
      .parse(request.body);

    await requireChannelView(app.pool, input.channelId, user.id);
    await saveMessage(app.pool, {
      userId: user.id,
      channelId: input.channelId,
      messageId: input.messageId,
      authorName: input.authorName,
      content: input.content,
      attachments: input.attachments
    });
    return reply.code(201).send({ messageId: input.messageId, saved: true });
  });

  app.delete("/api/me/saved/:messageId", { preHandler: requireAuth }, async (request, reply) => {
    const user = currentUser(request);
    const { messageId } = z.object({ messageId: snowflake }).parse(request.params);
    await deleteSaved(app.pool, user.id, messageId);
    return reply.code(204).send();
  });

  // --- Channel permission overrides ----------------------------------------
  app.get("/api/channels/:channelId/permissions", { preHandler: requireAuth }, async (request) => {
    const user = currentUser(request);
    const { channelId } = channelParams.parse(request.params);
    const access = await requireChannelView(app.pool, channelId, user.id);
    const effective = await channelPermission(app.pool, channelId, access.role);
    const canManage = access.role === "owner" || access.role === "admin";
    return {
      canView: effective.canView,
      canSend: effective.canSend,
      canManage,
      overrides: canManage ? await listChannelOverrides(app.pool, channelId) : []
    };
  });

  app.put("/api/channels/:channelId/permissions", { preHandler: requireAuth }, async (request) => {
    const user = currentUser(request);
    const { channelId } = channelParams.parse(request.params);
    const access = await requireChannelView(app.pool, channelId, user.id);
    requireManager(access.role);

    const { overrides } = z
      .object({
        overrides: z
          .array(
            z.object({
              role: z.enum(["admin", "member"]),
              canView: z.boolean(),
              canSend: z.boolean()
            })
          )
          .max(2)
      })
      .parse(request.body);

    for (const override of overrides) {
      await setChannelOverride(
        app.pool,
        channelId,
        override.role,
        override.canView,
        override.canSend
      );
    }
    return { overrides: await listChannelOverrides(app.pool, channelId) };
  });

  // --- Member role management ----------------------------------------------
  app.patch(
    "/api/guilds/:guildId/members/:userId",
    { preHandler: requireAuth },
    async (request) => {
      const user = currentUser(request);
      const { guildId, userId } = z
        .object({ guildId: uuid, userId: uuid })
        .parse(request.params);
      const { role } = z.object({ role: z.enum(["admin", "member"]) }).parse(request.body);

      const actorRole = await guildRole(app.pool, guildId, user.id);
      if (actorRole !== "owner") {
        throw new HttpError(403, "FORBIDDEN", "Only the guild owner can change roles");
      }
      if (userId === user.id) {
        throw new HttpError(400, "CANNOT_CHANGE_SELF", "You cannot change your own role");
      }

      const result = await app.pool.query<{ role: GuildRole }>(
        `UPDATE guild_members SET role = $3
         WHERE guild_id = $1 AND user_id = $2 AND role <> 'owner'
         RETURNING role`,
        [guildId, userId, role]
      );
      if (!result.rows[0]) {
        throw new HttpError(404, "MEMBER_NOT_FOUND", "That member cannot be changed");
      }
      return { userId, role: result.rows[0].role };
    }
  );

  // --- Invites --------------------------------------------------------------
  app.post("/api/guilds/:guildId/invites", { preHandler: requireAuth }, async (request, reply) => {
    const user = currentUser(request);
    const { guildId } = z.object({ guildId: uuid }).parse(request.params);
    requireManager(await guildRole(app.pool, guildId, user.id));

    const input = z
      .object({
        maxUses: z.number().int().min(0).max(1000).default(0),
        expiresInHours: z.number().int().min(0).max(24 * 30).default(0)
      })
      .parse(request.body ?? {});

    const code = randomBytes(8).toString("hex");
    const result = await app.pool.query<{
      code: string;
      max_uses: number;
      uses: number;
      expires_at: Date | null;
      created_at: Date;
    }>(
      `INSERT INTO guild_invites (code, guild_id, created_by, max_uses, expires_at)
       VALUES ($1, $2, $3, $4, CASE WHEN $5 > 0 THEN now() + ($5 || ' hours')::interval ELSE NULL END)
       RETURNING code, max_uses, uses, expires_at, created_at`,
      [code, guildId, user.id, input.maxUses, input.expiresInHours]
    );
    const row = result.rows[0]!;
    reply.code(201);
    return {
      code: row.code,
      maxUses: row.max_uses,
      uses: row.uses,
      expiresAt: row.expires_at ? new Date(row.expires_at).toISOString() : null,
      createdAt: new Date(row.created_at).toISOString()
    };
  });

  app.get("/api/guilds/:guildId/invites", { preHandler: requireAuth }, async (request) => {
    const user = currentUser(request);
    const { guildId } = z.object({ guildId: uuid }).parse(request.params);
    requireManager(await guildRole(app.pool, guildId, user.id));

    const result = await app.pool.query<{
      code: string;
      max_uses: number;
      uses: number;
      expires_at: Date | null;
      revoked: boolean;
      created_at: Date;
    }>(
      `SELECT code, max_uses, uses, expires_at, revoked, created_at
       FROM guild_invites WHERE guild_id = $1 ORDER BY created_at DESC`,
      [guildId]
    );
    return {
      invites: result.rows.map((row) => ({
        code: row.code,
        maxUses: row.max_uses,
        uses: row.uses,
        expiresAt: row.expires_at ? new Date(row.expires_at).toISOString() : null,
        revoked: row.revoked,
        createdAt: new Date(row.created_at).toISOString()
      }))
    };
  });

  app.delete(
    "/api/guilds/:guildId/invites/:code",
    { preHandler: requireAuth },
    async (request, reply) => {
      const user = currentUser(request);
      const { guildId, code } = z
        .object({ guildId: uuid, code: z.string().regex(/^[A-Za-z0-9]{6,24}$/) })
        .parse(request.params);
      requireManager(await guildRole(app.pool, guildId, user.id));
      await app.pool.query(
        "UPDATE guild_invites SET revoked = true WHERE guild_id = $1 AND code = $2",
        [guildId, code]
      );
      return reply.code(204).send();
    }
  );

  app.get("/api/invites/:code", { preHandler: requireAuth }, async (request) => {
    const user = currentUser(request);
    const { code } = z.object({ code: z.string().regex(/^[A-Za-z0-9]{6,24}$/) }).parse(request.params);
    const invite = await loadInvite(app.pool, code);
    const memberCount = await app.pool.query<{ count: string }>(
      "SELECT COUNT(*)::text AS count FROM guild_members WHERE guild_id = $1",
      [invite.guildId]
    );
    const alreadyMember = Boolean(await guildRole(app.pool, invite.guildId, user.id));
    return {
      code,
      guildId: invite.guildId,
      guildName: invite.guildName,
      memberCount: Number.parseInt(memberCount.rows[0]?.count ?? "0", 10),
      alreadyMember
    };
  });

  app.post("/api/invites/:code", { preHandler: requireAuth }, async (request, reply) => {
    const user = currentUser(request);
    const { code } = z.object({ code: z.string().regex(/^[A-Za-z0-9]{6,24}$/) }).parse(request.params);
    const invite = await loadInvite(app.pool, code);

    if (await guildRole(app.pool, invite.guildId, user.id)) {
      return { guildId: invite.guildId, alreadyMember: true };
    }

    const client = await app.pool.connect();
    try {
      await client.query("BEGIN");
      const locked = await client.query<{ uses: number; max_uses: number }>(
        `SELECT uses, max_uses FROM guild_invites
         WHERE code = $1 AND revoked = false
           AND (expires_at IS NULL OR expires_at > now())
           AND (max_uses = 0 OR uses < max_uses)
         FOR UPDATE`,
        [code]
      );
      if (!locked.rows[0]) {
        throw new HttpError(410, "INVITE_EXHAUSTED", "This invite is no longer valid");
      }

      const billing = await client.query<{ seats: number }>(
        "SELECT seats FROM billing_configs WHERE guild_id = $1 FOR UPDATE",
        [invite.guildId]
      );
      const seats = billing.rows[0]?.seats ?? 10;
      const count = await client.query<{ count: string }>(
        "SELECT COUNT(*)::text AS count FROM guild_members WHERE guild_id = $1",
        [invite.guildId]
      );
      if (Number.parseInt(count.rows[0]!.count, 10) >= seats) {
        throw new HttpError(402, "SEAT_LIMIT", "This workspace has no seats remaining");
      }

      await client.query(
        "INSERT INTO guild_members (guild_id, user_id, role) VALUES ($1, $2, 'member')",
        [invite.guildId, user.id]
      );
      await client.query("UPDATE guild_invites SET uses = uses + 1 WHERE code = $1", [code]);
      await client.query("COMMIT");

      reply.code(201);
      return { guildId: invite.guildId, alreadyMember: false };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  });

  // --- Catch-up digest ------------------------------------------------------
  app.get("/api/digest", { preHandler: requireAuth }, async (request) => {
    const user = currentUser(request);

    const channels = await app.pool.query<{ id: string; name: string; guild_id: string }>(
      `SELECT c.id, c.name, c.guild_id
       FROM channels c
       JOIN guild_members gm ON gm.guild_id = c.guild_id
       WHERE gm.user_id = $1 AND c.kind = 'text'
       ORDER BY c.guild_id, c.position
       LIMIT $2`,
      [user.id, MAX_DIGEST_CHANNELS]
    );

    const markers = await loadReadMarkers(
      app.pool,
      user.id,
      channels.rows.map((row) => row.id)
    );

    const entries = await Promise.all(
      channels.rows.map(async (channel) => {
        const lastRead = BigInt(markers.get(channel.id) ?? "0");
        let messages;
        try {
          const history = await app.shield.getHistory({
            channelId: channel.id,
            before: null,
            limit: DIGEST_SCAN_LIMIT
          });
          messages = history.messages;
        } catch (error) {
          if (error instanceof ShieldUnavailableError) return null;
          throw error;
        }

        const unread = messages.filter((message) => {
          if (BigInt(bytesToSnowflake(message.message_id)) <= lastRead) return false;
          return bytesToUuid(message.author_id) !== user.id;
        });

        if (unread.length === 0) return null;

        const mentionNeedle = `@${user.displayName}`.toLowerCase();
        const mentions = unread
          .filter((message) => message.content.toLowerCase().includes(mentionNeedle))
          .slice(0, 3)
          .map((message) => ({
            id: bytesToSnowflake(message.message_id),
            authorId: bytesToUuid(message.author_id),
            content: message.content.slice(0, 180),
            timestampMs: message.timestamp_ms
          }));

        return {
          channelId: channel.id,
          channelName: channel.name,
          guildId: channel.guild_id,
          unreadCount: unread.length,
          truncated: unread.length >= DIGEST_SCAN_LIMIT,
          lastMessageMs: unread[unread.length - 1]?.timestamp_ms ?? null,
          mentions
        };
      })
    );

    const digest = entries.filter((entry): entry is NonNullable<typeof entry> => entry !== null);
    digest.sort((a, b) => (b.lastMessageMs ?? 0) - (a.lastMessageMs ?? 0));
    return {
      generatedAt: Date.now(),
      totalUnread: digest.reduce((sum, entry) => sum + entry.unreadCount, 0),
      mentionCount: digest.reduce((sum, entry) => sum + entry.mentions.length, 0),
      channels: digest
    };
  });

  // --- Live channel events (SSE) -------------------------------------------
  app.get("/api/channels/:channelId/events", { preHandler: requireAuth }, async (request, reply) => {
    const user = currentUser(request);
    const { channelId } = channelParams.parse(request.params);
    await requireChannelView(app.pool, channelId, user.id);

    reply.hijack();
    const raw = reply.raw;
    raw.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no"
    });
    raw.write("retry: 3000\n\n");

    const send = (payload: unknown) => {
      try {
        raw.write(`data: ${JSON.stringify(payload)}\n\n`);
      } catch {
        // socket already closed
      }
    };

    send({ type: "ready", channelId });

    const unsubscribe = app.events.subscribe(channelId, (event) => {
      if (event.channelId !== channelId) return;
      send(event);
    });
    const keepAlive = setInterval(() => {
      try {
        raw.write(": ping\n\n");
      } catch {
        // ignore
      }
    }, 25_000);

    const cleanup = () => {
      clearInterval(keepAlive);
      unsubscribe();
    };
    raw.on("close", cleanup);
    raw.on("error", cleanup);
  });

  // --- Message metadata for a live range (used when a page is reloaded) ----
  app.get("/api/channels/:channelId/meta", { preHandler: requireAuth }, async (request) => {
    const user = currentUser(request);
    const { channelId } = channelParams.parse(request.params);
    const ids = z
      .object({ ids: z.string().max(4000).optional() })
      .parse(request.query)
      .ids?.split(",")
      .filter((id) => /^\d{1,19}$/.test(id))
      .slice(0, 200);

    await requireChannelView(app.pool, channelId, user.id);
    if (!ids || ids.length === 0) {
      return { reactions: {}, overrides: {}, replies: {}, pinned: [] };
    }

    const meta = await loadMessageMeta(app.pool, channelId, ids, user.id);
    return {
      reactions: Object.fromEntries(meta.reactions),
      overrides: Object.fromEntries(meta.overrides),
      replies: Object.fromEntries(meta.replies),
      pinned: [...meta.pinned]
    };
  });
};

async function guildRoleForChannel(
  pool: Pool,
  channelId: string,
  userId: string
): Promise<GuildRole | null> {
  const result = await pool.query<{ guild_id: string }>(
    "SELECT guild_id FROM channels WHERE id = $1",
    [channelId]
  );
  const guildId = result.rows[0]?.guild_id;
  if (!guildId) return null;
  return guildRole(pool, guildId, userId);
}

async function loadInvite(
  pool: Pool,
  code: string
): Promise<{ guildId: string; guildName: string }> {
  const result = await pool.query<{ guild_id: string; name: string }>(
    `SELECT i.guild_id, g.name
     FROM guild_invites i JOIN guilds g ON g.id = i.guild_id
     WHERE i.code = $1 AND i.revoked = false
       AND (i.expires_at IS NULL OR i.expires_at > now())
       AND (i.max_uses = 0 OR i.uses < i.max_uses)`,
    [code]
  );
  const row = result.rows[0];
  if (!row) throw new HttpError(404, "INVITE_NOT_FOUND", "This invite is invalid or has expired");
  return { guildId: row.guild_id, guildName: row.name };
}
