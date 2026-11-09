CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text NOT NULL,
    password_hash text NOT NULL,
    display_name text NOT NULL CHECK (char_length(display_name) BETWEEN 2 AND 48),
    avatar_color text NOT NULL DEFAULT '#B7410E',
    locale text NOT NULL DEFAULT 'en' CHECK (locale IN ('en', 'am')),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX users_email_lower_key ON users (lower(email));

CREATE TABLE guilds (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 80),
    owner_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    icon_color text NOT NULL DEFAULT '#B7410E',
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE guild_members (
    guild_id uuid NOT NULL REFERENCES guilds(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role text NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    joined_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (guild_id, user_id)
);

CREATE INDEX guild_members_user_idx ON guild_members (user_id);

CREATE TABLE channels (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    guild_id uuid NOT NULL REFERENCES guilds(id) ON DELETE CASCADE,
    name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 80),
    topic text NOT NULL DEFAULT '',
    kind text NOT NULL DEFAULT 'text' CHECK (kind IN ('text', 'voice')),
    position integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (guild_id, name)
);

CREATE INDEX channels_guild_position_idx ON channels (guild_id, position, created_at);

CREATE TABLE billing_configs (
    guild_id uuid PRIMARY KEY REFERENCES guilds(id) ON DELETE CASCADE,
    plan text NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
    seats integer NOT NULL DEFAULT 10 CHECK (seats BETWEEN 1 AND 100000),
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'canceled', 'trialing')),
    stripe_customer_id text,
    stripe_subscription_id text,
    updated_at timestamptz NOT NULL DEFAULT now()
);
