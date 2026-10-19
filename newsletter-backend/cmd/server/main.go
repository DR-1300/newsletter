package main

import (
	"context"
	"log"
	"net/http"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"

	"newsletter-backend/internal/db"
	api "newsletter-backend/internal/http"
)


func main() {

	if err:= godotenv.Load(); err != nil {
		log.Println("no .env file bruh go home")
	}

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL is not set")
	}

	ctx := context.Background()

	pool, err := pgxpool.New(ctx, dbURL)

	if err != nil {
		log.Fatal("couldnt create connection pool: ", err)
	}
	defer pool.Close()

	if err := pool.Ping(ctx); err != nil {
		log.Fatalf("could not reach database: %v", err)
	}
	log.Println("connected to database")

	origin := os.Getenv("FRONTEND_ORIGIN")
	if origin == "" {
		origin = "http://localhost:3000"
	}

	server := api.NewServer(db.New(pool), origin)

	log.Println("listening on :8000 :p")
	log.Fatal(http.ListenAndServe(":8000", server.Routes()))
}