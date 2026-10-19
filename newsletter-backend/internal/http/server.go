package api

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"

	"github.com/jackc/pgx/v5/pgconn"

	"newsletter-backend/internal/db"
)

const (
	pgUV = "23505"
	pgFKV = "23503"
)

type Server struct {
	q db.Querier
	frontendOrigin string
}

func NewServer(q db.Querier, frontendOrigin string) *Server {
	return &Server{q:q, frontendOrigin: frontendOrigin}
}


func (s *Server) Routes() http.Handler{
	mux := http.NewServeMux()
	s.registerCategoryRoutes(mux)
	s.registerSubscriberRoutes(mux)
	s.registerArticleRoutes(mux)
	s.registerCommentRoutes(mux)
	return s.withCORS(mux)
}

func writeJson(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err:= json.NewEncoder(w).Encode(v) ; err != nil {
		log.Println("Error: ", err)
	}
}

func writeError(w http.ResponseWriter, status int, msg string) {
	writeJson(w, status, map[string]string{"error": msg})
}

func serverError(w http.ResponseWriter, err error) {
	log.Println("internal error:", err)
	writeError(w, http.StatusInternalServerError, "internal server error")
}

func decodeJson(w http.ResponseWriter, r *http.Request, dst any) bool {
	r.Body = http.MaxBytesReader(w, r.Body, 1<<20)
	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()
	if err:= dec.Decode(dst) ; err != nil {
		writeError(w, http.StatusBadRequest, "invalid JSON body")
		return false
	}
	return true
}

func isPgError(err error, code string) bool {
	var pgErr *pgconn.PgError
	return errors.As(err, &pgErr) && pgErr.Code == code
}

func (s *Server) withCORS(next http.Handler) http.Handler{
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", s.frontendOrigin)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}