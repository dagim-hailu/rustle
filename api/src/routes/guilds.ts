import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { currentUser, requireAuth } from "../auth.js";
import { HttpError } from "../http.js";
import { guildRole, loadBootstrap } from "../queries.js";
import { createStarterGuild } from "../seed.js";

const createGuildSchema = z.object({
  name: z.string().trim().min(1).max(80)
});

const createChannelSchema = z.object({
  name: z.string().trim().min(1).max(80),
  topic: z.string().trim().max(1024).default(""),
  kind: z.enum(["text", "voice"]).default("text")
});

const updateChannelSchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  topic: z.string().trim().max(1024).optional(),
  position: z.number().int().min(0).max(10_000).optional()
});

const addMemberSchema = z.object({
  email: z.string().trim().email().max(254)
});

const billingSchema = z.object({
  plan: z.enum(["free", "pro", "enterprise"]),
  seats: z.number().int().min(1).max(100_000),
  status: z.enum(["active", "past_due", "canceled", "trialing"]).default("active")
});

function normalizeChannelName(name: string): string {
  return name.trim().replace(/\s+/g, "-").toLowerCase();
}

function requireManager(role: "owner" | "admin" | "member" | null): void {
  if (role !== "owner" && role !== "admin") {
    throw new HttpError(403, "FORBIDDEN", "Guild owner or admin permission required");
  }
}

export const guildRoutes: FastifyPluginAsync = async (app) => {
  app.get("/api/bootstrap", { preHandler: requireAuth }, async (request) => {
    const user = currentUser(request);
    const bootstrap = await loadBootstrap(app.pool, user.id);
    if (!bootstrap) throw new HttpError(401, "UNAUTHORIZED", "Account no longer exists");
    return bootstrap;
  });

  app.post("/api/guilds", { preHandler: requireAuth }, async (request, reply) => {
    const user = currentUser(request);
    const input = createGuildSchema.parse(request.body);
    const client = await app.pool.connect();

    try {
      await client.query("BEGIN");
      const starter = await createStarterGuild(client, user.id, input.name);
      await client.query("COMMIT");
      reply.code(201);
      return starter;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  });

  app.post(
    "/api/guilds/:guildId/channels",
    { preHandler: requireAuth },
    async (request, reply) => {
      const user = currentUser(request);
      const { guildId } = z.object({ guildId: z.string().uuid() }).parse(request.params);
      const input = createChannelSchema.parse(request.body);
      requireManager(await guildRole(app.pool, guildId, user.id));

      const name = normalizeChannelName(input.name);
      if (!name) throw new HttpError(400, "INVALID_NAME", "Channel name is empty");

      const client = await app.pool.connect();
      try {
        await client.query("BEGIN");
        const position = await client.query<{ next: number }>(
          "SELECT COALESCE(MAX(position) + 1, 0)::int AS next FROM channels WHERE guild_id = $1",
          [guildId]
        );
        const inserted = await client.query<{
          id: string;
          guild_id: string;
          name: string;
          topic: string;
          kind: "text" | "voice";
          position: number;
        }>(
          `INSERT INTO channels (guild_id, name, topic, kind, position)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id, guild_id, name, topic, kind, position`,
          [guildId, name, input.topic, input.kind, position.rows[0]!.next]
        );
        await client.query("COMMIT");
        const channel = inserted.rows[0]!;
        reply.code(201);
        return {
          id: channel.id,
          guildId: channel.guild_id,
          name: channel.name,
          topic: channel.topic,
          kind: channel.kind,
          position: channel.position
        };
      } catch (error) {
        await client.query("ROLLBACK");
        if ((error as { code?: string }).code === "23505") {
          throw new HttpError(409, "CHANNEL_EXISTS", "A channel with that name already exists");
        }
        throw error;
      } finally {
        client.release();
      }
    }
  );

  app.patch(
    "/api/channels/:channelId",
    { preHandler: requireAuth },
    async (request) => {
      const user = currentUser(request);
      const { channelId } = z.object({ channelId: z.string().uuid() }).parse(request.params);
      const input = updateChannelSchema.parse(request.body);

      const access = await app.pool.query<{ guild_id: string }>(
        "SELECT guild_id FROM channels WHERE id = $1",
        [channelId]
      );
      if (!access.rows[0]) throw new HttpError(404, "CHANNEL_NOT_FOUND", "Channel not found");
      requireManager(await guildRole(app.pool, access.rows[0].guild_id, user.id));

      const updates: string[] = [];
      const values: unknown[] = [];
      if (input.name !== undefined) {
        values.push(normalizeChannelName(input.name));
        updates.push(`name = $${values.length}`);
      }
      if (input.topic !== undefined) {
        values.push(input.topic);
        updates.push(`topic = $${values.length}`);
      }
      if (input.position !== undefined) {
        values.push(input.position);
        updates.push(`position = $${values.length}`);
      }
      if (updates.length === 0) throw new HttpError(400, "NO_CHANGES", "No fields supplied");

      values.push(channelId);
      const updated = await app.pool.query<{
        id: string;
        guild_id: string;
        name: string;
        topic: string;
        kind: "text" | "voice";
        position: number;
      }>(
        `UPDATE channels SET ${updates.join(", ")} WHERE id = $${values.length}
         RETURNING id, guild_id, name, topic, kind, position`,
        values
      );
      const row = updated.rows[0]!;
      return {
        id: row.id,
        guildId: row.guild_id,
        name: row.name,
        topic: row.topic,
        kind: row.kind,
        position: row.position
      };
    }
  );

  app.post(
    "/api/guilds/:guildId/members",
    { preHandler: requireAuth },
    async (request, reply) => {
      const user = currentUser(request);
      const { guildId } = z.object({ guildId: z.string().uuid() }).parse(request.params);
      const input = addMemberSchema.parse(request.body);
      requireManager(await guildRole(app.pool, guildId, user.id));

      const client = await app.pool.connect();
      try {
        await client.query("BEGIN");
        const invitee = await client.query<{
          id: string;
          display_name: string;
          avatar_color: string;
        }>(
          "SELECT id, display_name, avatar_color FROM users WHERE lower(email) = lower($1)",
          [input.email]
        );
        const target = invitee.rows[0];
        if (!target) {
          throw new HttpError(404, "USER_NOT_FOUND", "No registered account uses that email");
        }

        const existing = await client.query(
          "SELECT 1 FROM guild_members WHERE guild_id = $1 AND user_id = $2",
          [guildId, target.id]
        );
        if (existing.rowCount) {
          throw new HttpError(409, "ALREADY_MEMBER", "That user is already a member");
        }

        const billing = await client.query<{ seats: number }>(
          "SELECT seats FROM billing_configs WHERE guild_id = $1 FOR UPDATE",
          [guildId]
        );
        const seats = billing.rows[0]?.seats ?? 10;
        const count = await client.query<{ count: string }>(
          "SELECT COUNT(*)::text AS count FROM guild_members WHERE guild_id = $1",
          [guildId]
        );
        if (Number.parseInt(count.rows[0]!.count, 10) >= seats) {
          throw new HttpError(402, "SEAT_LIMIT", "This workspace has no seats remaining");
        }

        await client.query(
          "INSERT INTO guild_members (guild_id, user_id, role) VALUES ($1, $2, 'member')",
          [guildId, target.id]
        );
        await client.query("COMMIT");

        reply.code(201);
        return {
          userId: target.id,
          displayName: target.display_name,
          avatarColor: target.avatar_color,
          role: "member"
        };
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    }
  );

  app.get(
    "/api/guilds/:guildId/billing",
    { preHandler: requireAuth },
    async (request) => {
      const user = currentUser(request);
      const { guildId } = z.object({ guildId: z.string().uuid() }).parse(request.params);
      requireManager(await guildRole(app.pool, guildId, user.id));

      const result = await app.pool.query<{
        plan: string;
        seats: number;
        status: string;
        stripe_customer_id: string | null;
        stripe_subscription_id: string | null;
        updated_at: Date;
      }>("SELECT * FROM billing_configs WHERE guild_id = $1", [guildId]);

      if (!result.rows[0]) {
        return {
          guildId,
          plan: "free",
          seats: 10,
          status: "active",
          stripeCustomerId: null,
          stripeSubscriptionId: null,
          updatedAt: null
        };
      }

      const row = result.rows[0];
      return {
        guildId,
        plan: row.plan,
        seats: row.seats,
        status: row.status,
        stripeCustomerId: row.stripe_customer_id,
        stripeSubscriptionId: row.stripe_subscription_id,
        updatedAt: row.updated_at
      };
    }
  );

  app.put(
    "/api/guilds/:guildId/billing",
    { preHandler: requireAuth },
    async (request) => {
      const user = currentUser(request);
      const { guildId } = z.object({ guildId: z.string().uuid() }).parse(request.params);
      const role = await guildRole(app.pool, guildId, user.id);
      if (role !== "owner") {
        throw new HttpError(403, "FORBIDDEN", "Only the guild owner can change billing");
      }

      const input = billingSchema.parse(request.body);
      const result = await app.pool.query<{
        plan: string;
        seats: number;
        status: string;
        updated_at: Date;
      }>(
        `INSERT INTO billing_configs (guild_id, plan, seats, status)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (guild_id) DO UPDATE
           SET plan = EXCLUDED.plan, seats = EXCLUDED.seats,
               status = EXCLUDED.status, updated_at = now()
         RETURNING plan, seats, status, updated_at`,
        [guildId, input.plan, input.seats, input.status]
      );

      const row = result.rows[0]!;
      return {
        guildId,
        plan: row.plan,
        seats: row.seats,
        status: row.status,
        updatedAt: row.updated_at
      };
    }
  );

  app.get("/api/guilds/:guildId/members", { preHandler: requireAuth }, async (request) => {
    const user = currentUser(request);
    const { guildId } = z.object({ guildId: z.string().uuid() }).parse(request.params);
    if (!(await guildRole(app.pool, guildId, user.id))) {
      throw new HttpError(403, "FORBIDDEN", "Not a member of this guild");
    }

    const result = await app.pool.query<{
      user_id: string;
      display_name: string;
      avatar_color: string;
      role: string;
    }>(
      `SELECT u.id AS user_id, u.display_name, u.avatar_color, gm.role
       FROM guild_members gm JOIN users u ON u.id = gm.user_id
       WHERE gm.guild_id = $1 ORDER BY u.display_name`,
      [guildId]
    );

    return result.rows.map((row) => ({
      userId: row.user_id,
      displayName: row.display_name,
      avatarColor: row.avatar_color,
      role: row.role
    }));
  });
};
