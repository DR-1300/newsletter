package api

import (
	"crypto/rand"
	"encoding/hex"
	"net/http"
	"net/mail"
	"strings"

	"newsletter-backend/internal/db"
)

type subscribeInput struct {
	Email string `json:"email"`
}

func (s *Server) registerSubscriberRoutes(mux *http.ServeMux) {
	mux.HandleFunc("POST /subscribe", s.subscribe)
	mux.HandleFunc("GET /subscribers", s.listSubscribers)
}

func newToken() (string, error) {
	b:= make([]byte, 16)
	if _,err := rand.Read(b); err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}

func (s *Server) subscribe(w http.ResponseWriter, r *http.Request) {
	var in subscribeInput
	if !decodeJson(w, r, &in) {
		return
	}

	email := strings.ToLower(strings.TrimSpace(in.Email))
	addr, err := mail.ParseAddress(email)
	if err != nil || addr.Address != email {
		writeError(w, http.StatusBadRequest, "a valid email is required")
		return
	}

	token , err := newToken()
	if err != nil {
		serverError(w, err)
		return
	}

	subscriber, err := s.q.CreateSubscriber(r.Context(), db.CreateSubscriberParams{
		Email: email,
		UnsubscribeToken: &token,
	})
	if err != nil {
		if isPgError(err, pgUV) {
			writeError(w, http.StatusConflict, "this email is already subscribed")
			return
		}
		serverError(w, err)
		return
	}

	writeJson(w, http.StatusCreated, subscriber)
}

func (s *Server) listSubscribers(w http.ResponseWriter, r *http.Request) {
	subscribers, err := s.q.ListSubscribers(r.Context())
	if err != nil {
		serverError(w, err)
		return
	}
	writeJson(w, http.StatusOK, subscribers)
}