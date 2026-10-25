## Running the backend

Requirements: Go, PostgreSQL, sqlc.

1. Create the database: `CREATE DATABASE newsletter;`
2. Copy `.env.example` to `.env` and put in your real password.
3. Run the migrations in ts order:
   `psql -U postgres -d newsletter -f db/migrations/001_init.sql`
   `psql -U postgres -d newsletter -f db/migrations/002_rename_content_to_contents.sql`
4. Start the server: `go run ./cmd/server` (listens on port 8000)

- `GET /subscribers` is unauthenticated becuz i aint doing auth system lol. In a real app it would need auth.
- migration files are plain SQL files run in order
