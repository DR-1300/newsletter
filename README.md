## Newsletter

Created a small archive page for newsletters for first mttn taskl
i think u cana ffigure out how to download and all

### create DB:


```bash
psql -U postgres -c "CREATE DATABASE newsletter;"
psql -U postgres -d newsletter -f newsletter-backend/db/migrations/001_init.sql
```

pls use .env.example and dont forget to create .env lol 

### Running:

- Backend:
```bash
cd newsletter-backend
go run ./cmd/server
```

- Frontend:
```bash
cd newsletter-frontend
npm run dev
```