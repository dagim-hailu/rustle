import type { Pool } from "pg";

export interface ProfileFields {
  displayName: string;
  avatarColor: string;
  avatarUrl: string | null;
  bannerUrl: string | null;
  bannerColor: string;
  bio: string;
  pronouns: string;
  statusText: string;
  createdAt: string;
}

export interface BootstrapChannel {
  id: string;
  guildId: string;
  name: string;
  topic: string;
  kind: "text" | "voice";
  position: number;
}

export interface BootstrapMember extends ProfileFields {
  userId: string;
  role: "owner" | "admin" | "member";
}

export interface BootstrapGuild {
  id: string;
  name: string;
  iconColor: string;
  role: "owner" | "admin" | "member";
  channels: BootstrapChannel[];
  members: BootstrapMember[];
}

export interface BootstrapUser extends ProfileFields {
  id: string;
  email: string;
  locale: "en" | "am";
  quietHoursEnabled: boolean;
  quietHoursStart: number;
  quietHoursEnd: number;
}

export interface Bootstrap {
  user: BootstrapUser;
  guilds: BootstrapGuild[];
}

export interface UserRow {
  id: string;
  email: string;
  display_name: string;
  avatar_color: string;
  avatar_url: string | null;
  banner_url: string | null;
  banner_color: string;
  bio: string;
  pronouns: string;
  status_text: string;
  quiet_hours_enabled: boolean;
  quiet_hours_start: number;
  quiet_hours_end: number;
  locale: "en" | "am";
  created_at: Date | string;
}

interface GuildRow {
  id: string;
  name: string;
  icon_color: string;
  role: "owner" | "admin" | "member";
}

interface ChannelRow {
  id: string;
  guild_id: string;
  name: string;
  topic: string;
  kind: "text" | "voice";
  position: number;
}

interface MemberRow {
  guild_id: string;
  user_id: string;
  display_name: string;
  avatar_color: string;
  avatar_url: string | null;
  banner_url: string | null;
  banner_color: string;
  bio: string;
  pronouns: string;
  status_text: string;
  created_at: Date | string;
  role: "owner" | "admin" | "member";
}

export const USER_COLUMNS = `id, email, display_name, avatar_color, avatar_url, banner_url,
  banner_color, bio, pronouns, status_text, quiet_hours_enabled, quiet_hours_start,
  quiet_hours_end, locale, created_at`;

function iso(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

export function profileFromUserRow(row: UserRow): BootstrapUser {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    avatarColor: row.avatar_color,
    avatarUrl: row.avatar_url,
    bannerUrl: row.banner_url,
    bannerColor: row.banner_color,
    bio: row.bio,
    pronouns: row.pronouns,
    statusText: row.status_text,
    quietHoursEnabled: row.quiet_hours_enabled,
    quietHoursStart: row.quiet_hours_start,
    quietHoursEnd: row.quiet_hours_end,
    locale: row.locale,
    createdAt: iso(row.created_at)
  };
}

export function profileFromMemberRow(row: MemberRow): BootstrapMember {
  return {
    userId: row.user_id,
    displayName: row.display_name,
    avatarColor: row.avatar_color,
    avatarUrl: row.avatar_url,
    bannerUrl: row.banner_url,
    bannerColor: row.banner_color,
    bio: row.bio,
    pronouns: row.pronouns,
    statusText: row.status_text,
    role: row.role,
    createdAt: iso(row.created_at)
  };
}

export async function loadBootstrap(pool: Pool, userId: string): Promise<Bootstrap | null> {
  const userResult = await pool.query<UserRow>(
    `SELECT ${USER_COLUMNS} FROM users WHERE id = $1`,
    [userId]
  );
  const userRow = userResult.rows[0];
  if (!userRow) return null;
  const user = profileFromUserRow(userRow);

  const guildsResult = await pool.query<GuildRow>(
    `SELECT g.id, g.name, g.icon_color, gm.role
     FROM guilds g
     JOIN guild_members gm ON gm.guild_id = g.id
     WHERE gm.user_id = $1
     ORDER BY g.created_at, g.id`,
    [userId]
  );

  const guildIds = guildsResult.rows.map((guild) => guild.id);
  if (guildIds.length === 0) return { user, guilds: [] };

  const [channelsResult, membersResult] = await Promise.all([
    pool.query<ChannelRow>(
      `SELECT id, guild_id, name, topic, kind, position
       FROM channels
       WHERE guild_id = ANY($1::uuid[])
       ORDER BY guild_id, position, created_at`,
      [guildIds]
    ),
    pool.query<MemberRow>(
      `SELECT gm.guild_id, u.id AS user_id, u.display_name, u.avatar_color,
              u.avatar_url, u.banner_url, u.banner_color, u.bio, u.pronouns,
              u.created_at, gm.role
       FROM guild_members gm
       JOIN users u ON u.id = gm.user_id
       WHERE gm.guild_id = ANY($1::uuid[])
       ORDER BY gm.guild_id, u.display_name`,
      [guildIds]
    )
  ]);

  const channelsByGuild = new Map<string, BootstrapChannel[]>();
  for (const row of channelsResult.rows) {
    const list = channelsByGuild.get(row.guild_id) ?? [];
    list.push({
      id: row.id,
      guildId: row.guild_id,
      name: row.name,
      topic: row.topic,
      kind: row.kind,
      position: row.position
    });
    channelsByGuild.set(row.guild_id, list);
  }

  const membersByGuild = new Map<string, BootstrapMember[]>();
  for (const row of membersResult.rows) {
    const list = membersByGuild.get(row.guild_id) ?? [];
    list.push(profileFromMemberRow(row));
    membersByGuild.set(row.guild_id, list);
  }

  return {
    user,
    guilds: guildsResult.rows.map((guild) => ({
      id: guild.id,
      name: guild.name,
      iconColor: guild.icon_color,
      role: guild.role,
      channels: channelsByGuild.get(guild.id) ?? [],
      members: membersByGuild.get(guild.id) ?? []
    }))
  };
}

export async function guildRole(
  pool: Pool,
  guildId: string,
  userId: string
): Promise<"owner" | "admin" | "member" | null> {
  const result = await pool.query<{ role: "owner" | "admin" | "member" }>(
    "SELECT role FROM guild_members WHERE guild_id = $1 AND user_id = $2",
    [guildId, userId]
  );
  return result.rows[0]?.role ?? null;
}

export async function channelAccess(
  pool: Pool,
  channelId: string,
  userId: string
): Promise<
  | {
      id: string;
      guildId: string;
      name: string;
      role: "owner" | "admin" | "member";
    }
  | null
> {
  const result = await pool.query<{
    id: string;
    guild_id: string;
    name: string;
    role: "owner" | "admin" | "member";
  }>(
    `SELECT c.id, c.guild_id, c.name, gm.role
     FROM channels c
     JOIN guild_members gm ON gm.guild_id = c.guild_id
     WHERE c.id = $1 AND gm.user_id = $2`,
    [channelId, userId]
  );

  const row = result.rows[0];
  if (!row) return null;
  return { id: row.id, guildId: row.guild_id, name: row.name, role: row.role };
}

export async function loadUserProfile(pool: Pool, userId: string): Promise<BootstrapUser | null> {
  const result = await pool.query<UserRow>(
    `SELECT ${USER_COLUMNS} FROM users WHERE id = $1`,
    [userId]
  );
  const row = result.rows[0];
  return row ? profileFromUserRow(row) : null;
}
