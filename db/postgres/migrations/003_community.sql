-- Rustle community layer: message actions, membership and personal features.
--
-- This migration is strictly additive. Existing users, guilds, channels and
-- the ScyllaDB-stored messages are untouched: everything below is *metadata*
-- that the API overlays on top of history reads (and live-fans-out over SSE).
-- No existing row is rewritten, so no user or message data is lost.

-- 1. Custom status text and quiet hours on users -----------------------------
-- status_text is the Discord-style "custom status" line; quiet hours let a user
-- schedule automatic Do-Not-Disturb windows (a Rustle-only feature).
ALTER TABLE users
    ADD COLUMN status_text text NOT NULL DEFAULT ''
        CHECK (char_length(status_text) <= 128),
    ADD COLUMN quiet_hours_enabled boolean NOT NULL DEFAULT false,
    ADD COLUMN quiet_hours_start smallint NOT NULL DEFAULT 22
        CHECK (quiet_hours_start BETWEEN 0 AND 23),
    ADD COLUMN quiet_hours_end smallint NOT NULL DEFAULT 7
        CHECK (quiet_hours_end BETWEEN 0 AND 23);

-- 2. Reactions ---------------------------------------------------------------
CREATE TABLE message_reactions (
    channel_id uuid NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
    message_id bigint NOT NULL,
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    emoji text NOT NULL CHECK (char_length(emoji) BETWEEN 1 AND 32),
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (channel_id, message_id, user_id, emoji)
);

CREATE INDEX message_reactions_lookup_idx
    ON message_reactions (channel_id, message_id);

-- 3. Message overrides (edit + soft delete) ----------------------------------
-- The authoritative row stays in ScyllaDB; an edit or delete records an override
-- here. History reads apply the override, so the original bytes are preserved.
CREATE TABLE message_overrides (
    channel_id uuid NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
    message_id bigint NOT NULL,
    editor_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    edited_content text,
    deleted boolean NOT NULL DEFAULT false,
    edited_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (channel_id, message_id)
);

-- 4. Replies -----------------------------------------------------------------
-- A denormalized preview of the quoted message is captured at reply time so a
-- target that predates the feature (or lives in another bucket window) needs no
-- extra ScyllaDB read when rendering.
CREATE TABLE message_replies (
    channel_id uuid NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
    message_id bigint NOT NULL,
    reply_to_id bigint NOT NULL,
    author_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    preview_author text NOT NULL DEFAULT '',
    preview_content text NOT NULL DEFAULT '',
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (channel_id, message_id)
);

-- 5. Pinned messages ---------------------------------------------------------
CREATE TABLE pinned_messages (
    channel_id uuid NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
    message_id bigint NOT NULL,
    pinned_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    snapshot_author_id uuid,
    snapshot_author text NOT NULL DEFAULT '',
    snapshot_content text NOT NULL DEFAULT '',
    snapshot_attachments jsonb NOT NULL DEFAULT '[]'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (channel_id, message_id)
);

CREATE INDEX pinned_messages_channel_idx
    ON pinned_messages (channel_id, created_at DESC);

-- 6. Invites -----------------------------------------------------------------
CREATE TABLE guild_invites (
    code text PRIMARY KEY CHECK (code ~ '^[A-Za-z0-9]{6,24}$'),
    guild_id uuid NOT NULL REFERENCES guilds(id) ON DELETE CASCADE,
    created_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    max_uses integer NOT NULL DEFAULT 0 CHECK (max_uses >= 0),
    uses integer NOT NULL DEFAULT 0 CHECK (uses >= 0),
    expires_at timestamptz,
    revoked boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX guild_invites_guild_idx ON guild_invites (guild_id, created_at DESC);

-- 7. Channel permission overrides (role based) -------------------------------
-- Absence of a row means "inherit the guild default" (view + send allowed).
CREATE TABLE channel_role_overrides (
    channel_id uuid NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
    role text NOT NULL CHECK (role IN ('admin', 'member')),
    can_view boolean NOT NULL DEFAULT true,
    can_send boolean NOT NULL DEFAULT true,
    PRIMARY KEY (channel_id, role)
);

-- 8. Saved messages (per-user personal bookmarks, cross-device) ---------------
CREATE TABLE saved_messages (
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message_id bigint NOT NULL,
    channel_id uuid NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
    author_name text NOT NULL DEFAULT '',
    content text NOT NULL DEFAULT '',
    attachments jsonb NOT NULL DEFAULT '[]'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, message_id)
);

CREATE INDEX saved_messages_user_idx ON saved_messages (user_id, created_at DESC);

-- 9. Message authorship index -------------------------------------------------
-- Message rows live in ScyllaDB and carry the author as a binary column, but the
-- API never reads individual messages by id. Whenever the API serves a history
-- page it records the (channel, message) -> author mapping here from those
-- server-verified rows. Edit/delete then authorize against this index instead of
-- trusting a client-supplied author. A message that has never been read through
-- the API has no index row, so only a guild manager may act on it.
CREATE TABLE message_authors (
    channel_id uuid NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
    message_id bigint NOT NULL,
    author_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    first_seen_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (channel_id, message_id)
);

-- 10. Per-user channel read markers ------------------------------------------
-- Unread state used to live only in browser memory. Persisting the highest read
-- message per (user, channel) makes unread survive reloads, sync across devices
-- and let the catch-up digest count what a member missed while away.
CREATE TABLE channel_reads (
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    channel_id uuid NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
    last_read_message_id bigint NOT NULL DEFAULT 0 CHECK (last_read_message_id >= 0),
    read_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, channel_id)
);
