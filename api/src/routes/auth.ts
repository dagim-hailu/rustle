import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { currentUser, requireAuth, signToken } from "../auth.js";
import { HttpError } from "../http.js";
import { hashPassword, verifyPassword } from "../password.js";
import { loadBootstrap, profileFromUserRow, type UserRow } from "../queries.js";
import { createStarterGuild } from "../seed.js";

const registerSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(10, "Password must be at least 10 characters").max(128),
  displayName: z.string().trim().min(2, "Display name is too short").max(48),
  locale: z.enum(["en", "am"]).default("en")
});

const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(128)
});

const RETURNING_USER = `id, email, display_name, avatar_color, avatar_url, banner_url,
  banner_color, bio, pronouns, locale, created_at`;

export const authRoutes: FastifyPluginAsync = async (app) => {
  app.post(
    "/api/auth/register",
    { config: { rateLimit: { max: 10, timeWindow: "1 minute" } } },
    async (request, reply) => {
      const input = registerSchema.parse(request.body);
      const email = input.email.toLowerCase();

      const duplicate = await app.pool.query(
        "SELECT 1 FROM users WHERE lower(email) = lower($1)",
        [email]
      );
      if (duplicate.rowCount) {
        throw new HttpError(409, "EMAIL_TAKEN", "An account with that email already exists");
      }

      const passwordHash = await hashPassword(input.password);
      const client = await app.pool.connect();

      try {
        await client.query("BEGIN");
        const inserted = await client.query<UserRow>(
          `INSERT INTO users (email, password_hash, display_name, locale)
           VALUES ($1, $2, $3, $4)
           RETURNING ${RETURNING_USER}`,
          [email, passwordHash, input.displayName, input.locale]
        );
        const user = profileFromUserRow(inserted.rows[0]!);
        await createStarterGuild(client, user.id, `${user.displayName}'s Workspace`);
        await client.query("COMMIT");

        const token = signToken(user, app.config.jwtSecret, app.config.jwtTtlSeconds);

        reply.code(201);
        return { token, user };
      } catch (error) {
        await client.query("ROLLBACK");
        if ((error as { code?: string }).code === "23505") {
          throw new HttpError(409, "EMAIL_TAKEN", "An account with that email already exists");
        }
        throw error;
      } finally {
        client.release();
      }
    }
  );

  app.post(
    "/api/auth/login",
    {
      config: {
        rateLimit: { max: 10, timeWindow: "1 minute" }
      }
    },
    async (request, reply) => {
      const input = loginSchema.parse(request.body);
      const result = await app.pool.query<UserRow & { password_hash: string }>(
        `SELECT ${RETURNING_USER}, password_hash
         FROM users WHERE lower(email) = lower($1)`,
        [input.email]
      );

      const row = result.rows[0];
      const valid = row ? await verifyPassword(input.password, row.password_hash) : false;

      if (!row || !valid) {
        return reply.code(401).send({
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password"
        });
      }

      const user = profileFromUserRow(row);
      const token = signToken(user, app.config.jwtSecret, app.config.jwtTtlSeconds);
      return { token, user };
    }
  );

  app.get("/api/me", { preHandler: requireAuth }, async (request) => {
    const user = currentUser(request);
    const bootstrap = await loadBootstrap(app.pool, user.id);
    if (!bootstrap) throw new HttpError(401, "UNAUTHORIZED", "Account no longer exists");
    return bootstrap;
  });
};
