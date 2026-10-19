package api

import (
	"net/http"
	"strings"

	"newsletter-backend/internal/db"
)

type categoryInput struct {
	Name string `json:"name"`
	Slug *string `json:"slug"`
}

func (s *Server) registerCategoryRoutes(mux *http.ServeMux) {
	mux.HandleFunc("GET /categories", s.listCategories)
	mux.HandleFunc("POST /categories", s.createCategory)
}

func (s *Server) listCategories(w http.ResponseWriter, r *http.Request) {
	categories, err := s.q.ListCategories(r.Context())
	if err != nil {
		serverError(w, err)
		return
	}
	writeJson(w, http.StatusOK, categories)
}

func (s *Server) createCategory(w http.ResponseWriter, r *http.Request) {
	var in categoryInput
	if !decodeJson(w, r, &in) {
		return
	}
	
	in.Name = strings.TrimSpace(in.Name)
	if in.Name == "" {
		writeError(w, http.StatusBadRequest, "name is required")
		return
	}

	category , err := s.q.CreateCategory(r.Context(), db.CreateCategoryParams{
		Name: in.Name,
		Slug: in.Slug,
	})
	if err != nil {
		if isPgError(err, pgUV) {
			writeError(w, http.StatusConflict, "a category with this name already exists")
			return
		}
		serverError(w, err)
		return
	}
	writeJson(w, http.StatusCreated, category)
}