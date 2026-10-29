package api

import (
	"encoding/json"
	"errors"
	"net/http"
	"regexp"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"newsletter-backend/internal/db"
)

var (
	slugPattern   = regexp.MustCompile(`^[a-z0-9]+(?:-[a-z0-9]+)*$`)
	validStatuses = map[string]bool{"draft": true, "published": true, "archived": true}
)

type articleInput struct {
	Slug string `json:"slug"`
	Title string `json:"title"`
	Description string `json:"description"`
	Contents json.RawMessage `json:"contents"`
	CoverImage *string `json:"cover_image"`
	PublishedAt *time.Time `json:"published_at"`
	Tags []string `json:"tags"`
	CategoryID *uuid.UUID `json:"category_id"`
	Status string `json:"status"`
	Type string `json:"type"`
	EstimatedReadTime int32 `json:"estimated_read_time"`

}

func (in *articleInput) normalise() error {
	in.Slug = strings.TrimSpace(in.Slug)
	in.Title = strings.TrimSpace(in.Title)
	in.Description = strings.TrimSpace(in.Description)

	switch {
	case in.Slug == "":
		return errors.New("slug is required")
	case !slugPattern.MatchString(in.Slug):
		return errors.New("slug must be lower case, numbers and - only")
	case in.Title == "":
		return errors.New("title is required")
	case in.Description == "":
		return errors.New("description is required")
	case len(in.Contents) == 0 || string(in.Contents) == "null":
		return errors.New("contents are required")
	}
	
	if in.Status == "" {
		in.Status = "draft"
	}
	if !validStatuses[in.Status] {
		return errors.New("status must be draft, published or archived")
	}
	if in.Type == "" {
		in.Type = "newsletter"
	}
	if in.Tags == nil {
		in.Tags = []string{}
	}
	if in.EstimatedReadTime <= 0 {
		in.EstimatedReadTime = 1
	}
	if in.Status == "published" && in.PublishedAt == nil {
		now := time.Now()
		in.PublishedAt = &now
	}
	return nil
}
func (s *Server) registerArticleRoutes(mux *http.ServeMux) {
	mux.HandleFunc("GET /articles", s.listPublishedArticles)
	mux.HandleFunc("GET /articles/all", s.listAllArticles)
	mux.HandleFunc("GET /articles/{slug}", s.getArticleBySlug)
	mux.HandleFunc("POST /articles", s.createArticle)
	mux.HandleFunc("PUT /articles/{id}", s.updateArticle)
	mux.HandleFunc("DELETE /articles/{id}", s.deleteArticle)
}

func (s *Server) listPublishedArticles(w http.ResponseWriter, r *http.Request) {
	articles, err:= s.q.ListPublishedArticles(r.Context())
	if err != nil {
		serverError(w, err)
		return
	}
	writeJson(w, http.StatusOK, articles)
}

func (s *Server) listAllArticles(w http.ResponseWriter, r *http.Request) {
	articles, err := s.q.ListAllArticles(r.Context())
	if err != nil {
		serverError(w, err)
		return
	}
	writeJson(w, http.StatusOK, articles)
}

func (s *Server) getArticleBySlug(w http.ResponseWriter, r *http.Request) {
	slug := r.PathValue("slug")
	article, err := s.q.GetArticleBySlug(r.Context(), slug)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			writeError(w, http.StatusNotFound, "article not found")
			return
		}
		serverError(w, err)
		return
	}
	writeJson(w, http.StatusOK, article)
}

func (s *Server) createArticle(w http.ResponseWriter, r *http.Request) {
	var in articleInput
	if !decodeJson(w, r, &in) {
		return
	}
	if err := in.normalise(); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	article, err := s.q.CreateArticle(r.Context(), db.CreateArticleParams{
		Slug:              in.Slug,
		Title:             in.Title,
		Description:       in.Description,
		Contents:          in.Contents,
		CoverImage:        in.CoverImage,
		PublishedAt:       in.PublishedAt,
		Tags:              in.Tags,
		CategoryID:        in.CategoryID,
		Status:            in.Status,
		Type:              in.Type,
		EstimatedReadTime: in.EstimatedReadTime,
	})
	if err != nil {
		writeArticleDBError(w, err)
		return
	}
	writeJson(w, http.StatusCreated, article)
}

func (s *Server) updateArticle(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid article id")
		return
	}

	var in articleInput
	if !decodeJson(w, r , &in) {
		return
	}
	if err := in.normalise(); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	article, err := s.q.UpdateArticle(r.Context(), db.UpdateArticleParams{
		Slug:              in.Slug,
		Title:             in.Title,
		Description:       in.Description,
		Contents:          in.Contents,
		CoverImage:        in.CoverImage,
		PublishedAt:       in.PublishedAt,
		Tags:              in.Tags,
		CategoryID:        in.CategoryID,
		Status:            in.Status,
		Type:              in.Type,
		EstimatedReadTime: in.EstimatedReadTime,
		ID:                id,
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			writeError(w, http.StatusNotFound, "article not found")
			return
		}
		writeArticleDBError(w, err)
		return
	}
	writeJson(w, http.StatusOK, article)
}

func (s *Server) deleteArticle(w http.ResponseWriter, r *http.Request) {
	id, err:= uuid.Parse(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid article id")
		return
	}
	rows , err := s.q.DeleteArticle(r.Context(), id)
	if err != nil {
		serverError(w, err)
		return
	}
	if rows == 0 {
		writeError(w, http.StatusNotFound, "article not found")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
func writeArticleDBError(w http.ResponseWriter, err error) {
	switch {
	case isPgError(err, pgUV):
		writeError(w, http.StatusConflict, "an article with this slug already exists")
	case isPgError(err, pgFKV):
		writeError(w, http.StatusBadRequest, "category_id does not match any category")
	default:
		serverError(w, err)
	}
}