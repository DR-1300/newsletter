package api

import (
	"errors"
	"net/http"
	"strings"
	"unicode/utf8"
	
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"newsletter-backend/internal/db"
)

const maxCL = 2000

type commentInput struct {
	AuthorName *string `json:"author_name"`
	Content string `json:"content"`
}

func (s *Server) registerCommentRoutes(mux *http.ServeMux) {
	mux.HandleFunc("GET /articles/{id}/comments", s.listComments)
	mux.HandleFunc("POST /articles/{id}/comments", s.createComment)
}

func (s *Server) listComments(w http.ResponseWriter, r *http.Request) {
	articleID , err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid article id")
		return
	}

	if _, err := s.q.GetArticleByID(r.Context(), articleID); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			writeError(w, http.StatusNotFound, "article not found")
			return
		}
		serverError(w, err)
		return
	}
	comments, err := s.q.ListCommentsByArticle(r.Context(), articleID)
	if err!=nil{
		serverError(w,err)
		return
	}
	writeJson(w, http.StatusOK, comments)
}

func (s *Server) createComment(w http.ResponseWriter, r *http.Request) {
	articleID, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusBadGateway, "invalid article id")
		return
	}

	var in commentInput
	if !decodeJson(w, r, &in){
		return
	}
	in.Content = strings.TrimSpace(in.Content)
	if in.Content == "" {
		writeError(w, http.StatusBadRequest, "content is required")
		return
	}
	if utf8.RuneCountInString(in.Content) > maxCL {
		writeError(w, http.StatusBadGateway, "content is too long")
		return
	}

	if in.AuthorName != nil {
		name:= strings.TrimSpace(*in.AuthorName)
		if name == "" {
			in.AuthorName = nil
		} else {
			in.AuthorName = &name
		}
	}

	comment, err := s.q.CreateComment(r.Context(), db.CreateCommentParams{
		ArticleID: articleID,
		AuthorName: in.AuthorName,
		Content: in.Content,
	})
	if err != nil {
		if isPgError(err, pgFKV) {
			writeError(w, http.StatusNotFound, "article not found")
			return
		}
		serverError(w, err)
		return
	}

	writeJson(w, http.StatusCreated, comment)
}