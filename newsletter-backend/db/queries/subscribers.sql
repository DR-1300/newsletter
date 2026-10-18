-- name: CreateSubscriber :one
INSERT INTO subscribers (email, unsubscribe_token)
VALUES ($1, $2)
RETURNING *;

-- name: ListSubscribers :many
SELECT * FROM subscribers
ORDER BY subscribed_at DESC;