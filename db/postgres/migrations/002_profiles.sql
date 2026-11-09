-- Rich user profiles. Image references stay on the local uploads volume for the
-- same reasons documented for message attachments; no external URL is trusted.
ALTER TABLE users
    ADD COLUMN bio text NOT NULL DEFAULT ''
        CHECK (char_length(bio) <= 190),
    ADD COLUMN pronouns text NOT NULL DEFAULT ''
        CHECK (char_length(pronouns) <= 40),
    ADD COLUMN avatar_url text
        CHECK (avatar_url IS NULL OR avatar_url ~ '^/uploads/[A-Za-z0-9._-]+$'),
    ADD COLUMN banner_url text
        CHECK (banner_url IS NULL OR banner_url ~ '^/uploads/[A-Za-z0-9._-]+$'),
    ADD COLUMN banner_color text NOT NULL DEFAULT '#0F4C5C'
        CHECK (banner_color ~ '^#[0-9A-Fa-f]{6}$');
