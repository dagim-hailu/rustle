import type { Pool, PoolClient } from "pg";
import { hashPassword } from "./password.js";

export const DEMO_GUILD_NAME = "Rustle Labs";

export async function seedDemo(
  pool: Pool,
  email: string,
  password: string
): Promise<{ created: boolean; userId: string }> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const existing = await client.query<{ id: string }>(
      "SELECT id FROM users WHERE lower(email) = lower($1)",
      [email]
    );

    let userId: string;
    let created = false;

    if (existing.rows[0]) {
      userId = existing.rows[0].id;
    } else {
      const passwordHash = await hashPassword(password);
      const inserted = await client.query<{ id: string }>(
        `INSERT INTO users (email, password_hash, display_name, avatar_color, locale)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [email, passwordHash, "Rustle Demo", "#B7410E", "en"]
      );
      userId = inserted.rows[0]!.id;
      created = true;
    }

    const owned = await client.query<{ id: string }>(
      "SELECT id FROM guilds WHERE owner_id = $1 AND name = $2",
      [userId, DEMO_GUILD_NAME]
    );

    if (!owned.rows[0]) {
      await createStarterGuild(client, userId, DEMO_GUILD_NAME);
    } else {
      const voice = await client.query(
        "SELECT 1 FROM channels WHERE guild_id = $1 AND kind = 'voice' LIMIT 1",
        [owned.rows[0].id]
      );
      if (!voice.rowCount) {
        await client.query(
          `INSERT INTO channels (guild_id, name, topic, kind, position)
           VALUES ($1, 'Lounge', 'Drop in for a voice or video call.', 'voice', 1)`,
          [owned.rows[0].id]
        );
      }
    }

    await client.query("COMMIT");
    return { created, userId };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function createStarterGuild(
  client: Pool | PoolClient,
  userId: string,
  name: string
): Promise<{ guildId: string; channelId: string }> {
  const guild = await client.query<{ id: string }>(
    `INSERT INTO guilds (name, owner_id, icon_color)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [name, userId, "#B7410E"]
  );
  const guildId = guild.rows[0]!.id;

  await client.query(
    `INSERT INTO guild_members (guild_id, user_id, role) VALUES ($1, $2, 'owner')`,
    [guildId, userId]
  );

  const channel = await client.query<{ id: string }>(
    `INSERT INTO channels (guild_id, name, topic, kind, position)
     VALUES ($1, 'general', $2, 'text', 0)
     RETURNING id`,
    [guildId, "Welcome to your new workspace."]
  );

  await client.query(
    `INSERT INTO channels (guild_id, name, topic, kind, position)
     VALUES ($1, 'Lounge', 'Drop in for a voice or video call.', 'voice', 1)`,
    [guildId]
  );

  await client.query(
    `INSERT INTO billing_configs (guild_id, plan, seats, status)
     VALUES ($1, 'free', 10, 'active')
     ON CONFLICT (guild_id) DO NOTHING`,
    [guildId]
  );

  return { guildId, channelId: channel.rows[0]!.id };
}
