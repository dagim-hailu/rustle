import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { currentUser, requireAuth } from "../auth.js";
import { channelPermission, loadMessageMeta, recordAuthors } from "../community.js";
import { HttpError } from "../http.js";
import { bytesToSnowflake, bytesToUuid } from "../ids.js";
import { channelAccess } from "../queries.js";
import { ShieldUnavailableError } from "../shield.js";

interface AuthorRow {
  id: string;
  display_name: string;
  avatar_color: string;
  avatar_url: string | null;
}

export const channelRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    "/api/channels/:channelId/messages",
    { preHandler: requireAuth },
    async (request) => {
      const user = currentUser(request);
      const { channelId } = z.object({ channelId: z.string().uuid() }).parse(request.params);
      const access = await channelAccess(app.pool, channelId, user.id);
      if (!access) throw new HttpError(404, "CHANNEL_NOT_FOUND", "Channel not found");

      const permission = await channelPermission(app.pool, channelId, access.role);
      if (!permission.canView) throw new HttpError(404, "CHANNEL_NOT_FOUND", "Channel not found");

      const query = z
        .object({
          before: z.string().regex(/^\d{1,19}$/).optional(),
          limit: z.coerce.number().int().min(1).max(100).default(50)
        })
        .parse(request.query);

      let before: bigint | null = null;
      if (query.before) {
        before = BigInt(query.before);
        if (before <= 0n || before >= 1n << 63n) {
          throw new HttpError(400, "INVALID_CURSOR", "Cursor must be a positive Snowflake id");
        }
      }

      let history;
      try {
        history = await app.shield.getHistory({
          channelId,
          before,
          limit: query.limit
        });
      } catch (error) {
        if (error instanceof ShieldUnavailableError) {
          request.log.warn({ err: error }, "shield request failed");
          throw new HttpError(503, "HISTORY_UNAVAILABLE", "Message history is temporarily unavailable");
        }
        throw error;
      }

      const authorIds = [...new Set(history.messages.map((message) => bytesToUuid(message.author_id)))];
      const authors = new Map<string, AuthorRow>();

      if (authorIds.length > 0) {
        const result = await app.pool.query<AuthorRow>(
          "SELECT id, display_name, avatar_color, avatar_url FROM users WHERE id = ANY($1::uuid[])",
          [authorIds]
        );
        for (const row of result.rows) authors.set(row.id, row);
      }

      // Remember authorship for this page so edit/delete can be authorized
      // later without ever trusting a client-supplied author.
      await recordAuthors(
        app.pool,
        channelId,
        history.messages.map((message) => ({
          messageId: BigInt(bytesToSnowflake(message.message_id)),
          authorId: bytesToUuid(message.author_id)
        }))
      );

      const messageIds = history.messages.map((message) => bytesToSnowflake(message.message_id));
      const meta = await loadMessageMeta(app.pool, channelId, messageIds, user.id);

      // Shield returns newest first; the UI renders oldest first.
      const messages = [...history.messages].reverse().map((message) => {
        const authorId = bytesToUuid(message.author_id);
        const author = authors.get(authorId);
        const id = bytesToSnowflake(message.message_id);
        const override = meta.overrides.get(id);
        const deleted = override?.deleted ?? false;
        const editedContent = override && !deleted ? override.content : null;

        return {
          id,
          channelId,
          authorId,
          authorName: author?.display_name ?? "Unknown",
          authorColor: author?.avatar_color ?? "#6B7280",
          authorAvatarUrl: author?.avatar_url ?? null,
          content: deleted ? "" : editedContent ?? message.content,
          attachments: deleted ? [] : message.attachments,
          timestampMs: message.timestamp_ms,
          deleted,
          editedAt: editedContent !== null && override ? override.editedAt : null,
          replyTo: meta.replies.get(id) ?? null,
          reactions: meta.reactions.get(id) ?? [],
          pinned: meta.pinned.has(id)
        };
      });

      return {
        messages,
        nextCursor:
          history.next_cursor.length > 0 ? bytesToSnowflake(history.next_cursor) : null,
        hasMore: history.has_more
      };
    }
  );

  app.get(
    "/api/channels/:channelId/presence",
    { preHandler: requireAuth },
    async (request, reply) => {
      // Presence is served by the gateway over the binary WebSocket. This
      // endpoint exists only to make the ownership check explicit for clients
      // that want to preflight a channel.
      const user = currentUser(request);
      const { channelId } = z.object({ channelId: z.string().uuid() }).parse(request.params);
      const access = await channelAccess(app.pool, channelId, user.id);
      if (!access) throw new HttpError(404, "CHANNEL_NOT_FOUND", "Channel not found");
      return reply.code(204).send();
    }
  );
};
