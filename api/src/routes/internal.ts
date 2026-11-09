import { timingSafeEqual } from "node:crypto";
import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { loadBootstrap } from "../queries.js";

function tokensMatch(provided: string | undefined, expected: string): boolean {
  if (!provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

async function requireInternal(
  request: FastifyRequest,
  reply: FastifyReply,
  expected: string
): Promise<void> {
  const token = request.headers["x-internal-token"];
  if (typeof token !== "string" || !tokensMatch(token, expected)) {
    await reply.code(401).send({ code: "INTERNAL_UNAUTHORIZED", message: "Invalid service token" });
  }
}

export const internalRoutes: FastifyPluginAsync = async (app) => {
  app.get("/internal/session/:userId", { config: { rateLimit: false } }, async (request, reply) => {
    await requireInternal(request, reply, app.config.internalToken);
    if (reply.sent) return;

    const { userId } = z.object({ userId: z.string().uuid() }).parse(request.params);
    const session = await loadBootstrap(app.pool, userId);
    if (!session) {
      return reply.code(404).send({ code: "USER_NOT_FOUND", message: "User not found" });
    }
    return session;
  });

  app.get("/internal/users/:userId/guilds", { config: { rateLimit: false } }, async (request, reply) => {
    await requireInternal(request, reply, app.config.internalToken);
    if (reply.sent) return;

    const { userId } = z.object({ userId: z.string().uuid() }).parse(request.params);
    const result = await app.pool.query<{ guild_id: string }>(
      "SELECT guild_id FROM guild_members WHERE user_id = $1 ORDER BY guild_id",
      [userId]
    );

    return { guildIds: result.rows.map((row) => row.guild_id) };
  });
};
