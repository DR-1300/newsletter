-- name: CreateArticle :one
INSERT INTO articles (
    slug, title, description, contents, cover_image, published_at,
    tags, category_id, status, type, estimated_read_time
) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
)
RETURNING *;

-- name: GetArticleBySlug :one
SELECT * FROM articles
WHERE slug = $1;

-- name: GetArticleByID :one
SELECT * FROM articles
WHERE id = $1;

-- name: ListPublishedArticles :many
SELECT * FROM articles
WHERE status = 'published'
ORDER BY published_at DESC NULLS LAST, created_at DESC;

-- name: ListAllArticles :many
SELECT * FROM articles
ORDER BY created_at DESC;

-- name: UpdateArticle :one
UPDATE articles SET
    slug                = $1,
    title               = $2,
    description         = $3,
    contents            = $4,
    cover_image         = $5,
    published_at        = $6,
    tags                = $7,
    category_id         = $8,
    status              = $9,
    type                = $10,
    estimated_read_time = $11
WHERE id = $12
RETURNING *;

-- name: DeleteArticle :execrows
DELETE FROM articles
WHERE id = $1;