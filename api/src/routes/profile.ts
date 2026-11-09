import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { currentUser, requireAuth, signToken } from "../auth.js";
import { HttpError } from "../http.js";
import { hashPassword, verifyPassword } from "../password.js";
import { profileUpdateSchema, passwordChangeSchema } from "../profiles.js";
import {
  loadUserProfile,
  profileFromUserRow,
  type UserRow
} from "../queries.js";

const userIdSchema = z.object({ userId: z.string().uuid() });

export const profileRoutes: FastifyPluginAsync = async (app) => {
  app.get("/api/me/profile", { preHandler: requireAuth }, async (request) => {
    const auth = currentUser(request);
    const user = await loadUserProfile(app.pool, auth.id);
    if (!user) throw new HttpError(401, "UNAUTHORIZED", "Account no longer exists");
    return { user };
  });

  app.patch("/api/me/profile", { preHandler: requireAuth }, async (request) => {
    const auth = currentUser(request);
    const update = profileUpdateSchema.parse(request.body);
    const current = await loadUserProfile(app.pool, auth.id);
    if (!current) throw new HttpError(401, "UNAUTHORIZED", "Account no longer exists");

    const next = {
      displayName: update.displayName ?? current.displayName,
      pronouns: update.pronouns ?? current.pronouns,
      bio: update.bio ?? current.bio,
      avatarColor: update.avatarColor ?? current.avatarColor,
      bannerColor: update.bannerColor ?? current.bannerColor,
      avatarUrl: update.avatarUrl === undefined ? current.avatarUrl : update.avatarUrl,
      bannerUrl: update.bannerUrl === undefined ? current.bannerUrl : update.bannerUrl,
      locale: update.locale ?? current.locale,
      statusText: update.statusText ?? current.statusText,
      quietHoursEnabled: update.quietHoursEnabled ?? current.quietHoursEnabled,
      quietHoursStart: update.quietHoursStart ?? current.quietHoursStart,
      quietHoursEnd: update.quietHoursEnd ?? current.quietHoursEnd
    };

    const result = await app.pool.query<UserRow>(
      `UPDATE users
       SET display_name = $2, pronouns = $3, bio = $4, avatar_color = $5,
           banner_color = $6, avatar_url = $7, banner_url = $8, locale = $9,
           status_text = $10, quiet_hours_enabled = $11, quiet_hours_start = $12,
           quiet_hours_end = $13, updated_at = now()
       WHERE id = $1
       RETURNING id, email, display_name, avatar_color, avatar_url, banner_url,
                 banner_color, bio, pronouns, status_text, quiet_hours_enabled,
                 quiet_hours_start, quiet_hours_end, locale, created_at`,
      [
        auth.id,
        next.displayName,
        next.pronouns,
        next.bio,
        next.avatarColor,
        next.bannerColor,
        next.avatarUrl,
        next.bannerUrl,
        next.locale,
        next.statusText,
        next.quietHoursEnabled,
        next.quietHoursStart,
        next.quietHoursEnd
      ]
    );

    const row = result.rows[0];
    if (!row) throw new HttpError(401, "UNAUTHORIZED", "Account no longer exists");
    const user = profileFromUserRow(row);
    const token = signToken(
      {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        locale: user.locale
      },
      app.config.jwtSecret,
      app.config.jwtTtlSeconds
    );

    return { user, token };
  });

  app.put("/api/me/password", { preHandler: requireAuth }, async (request, reply) => {
    const auth = currentUser(request);
    const input = passwordChangeSchema.parse(request.body);
    const result = await app.pool.query<{ password_hash: string }>(
      "SELECT password_hash FROM users WHERE id = $1",
      [auth.id]
    );
    const row = result.rows[0];
    if (!row || !(await verifyPassword(input.currentPassword, row.password_hash))) {
      throw new HttpError(403, "INVALID_CURRENT_PASSWORD", "Current password is incorrect");
    }

    const passwordHash = await hashPassword(input.newPassword);
    await app.pool.query(
      "UPDATE users SET password_hash = $2, updated_at = now() WHERE id = $1",
      [auth.id, passwordHash]
    );
    return reply.code(204).send();
  });

  app.get("/api/users/:userId/profile", { preHandler: requireAuth }, async (request) => {
    const auth = currentUser(request);
    const { userId } = userIdSchema.parse(request.params);

    const shared = await app.pool.query<{ allowed: boolean }>(
      `SELECT EXISTS (
         SELECT 1
         FROM guild_members mine
         JOIN guild_members theirs ON theirs.guild_id = mine.guild_id
         WHERE mine.user_id = $1 AND theirs.user_id = $2
       ) AS allowed`,
      [auth.id, userId]
    );
    if (!shared.rows[0]?.allowed) {
      throw new HttpError(404, "PROFILE_NOT_FOUND", "Profile not found");
    }

    const user = await loadUserProfile(app.pool, userId);
    if (!user) throw new HttpError(404, "PROFILE_NOT_FOUND", "Profile not found");

    return {
      profile: {
        id: user.id,
        displayName: user.displayName,
        avatarColor: user.avatarColor,
        avatarUrl: user.avatarUrl,
        bannerUrl: user.bannerUrl,
        bannerColor: user.bannerColor,
        bio: user.bio,
        pronouns: user.pronouns,
        statusText: user.statusText,
        locale: user.locale,
        createdAt: user.createdAt
      }
    };
  });
};
