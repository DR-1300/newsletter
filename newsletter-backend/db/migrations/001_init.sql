CREATE TABLE categories(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT
);

CREATE TABLE articles(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    contents JSONB NOT NULL,
    cover_image TEXT,
    published_at TIMESTAMPTZ,
    tags TEXT[] NOT NULL DEFAULT '{}',
    category_id         UUID REFERENCES categories(id) ON DELETE SET NULL,
    status              TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    type                TEXT NOT NULL DEFAULT 'newsletter',
    estimated_read_time INTEGER NOT NULL DEFAULT 1,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE subscribers (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email             TEXT NOT NULL UNIQUE,
    subscribed_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    is_verified       BOOLEAN NOT NULL DEFAULT false,
    unsubscribe_token TEXT
);

CREATE TABLE comments (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id  UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    author_name TEXT,
    content     TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);