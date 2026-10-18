package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

type Greeting struct {
	Message string `json:"message"`
	Version int `json:"version"`
}

func Hello(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "application/json")
	g := Greeting{Message: "hi lol", Version: 1}
	if err:= json.NewEncoder(w).Encode(g); err != nil {
		log.Println("couldnt say hi :( :" ,err)
	}
}

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

	mux := http.NewServeMux()
	mux.HandleFunc("GET /hello", Hello)

	log.Println("listening on :8000 :p")
	log.Fatal(http.ListenAndServe(":8000", mux))
}