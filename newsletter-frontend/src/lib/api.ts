import type { Article, Category, Comment, Subscriber } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function getArticles(): Promise<Article[]> {
  const res = await fetch(`${API_URL}/articles`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

export async function getArticle(slug: string): Promise<Article | null> {
  const res = await fetch(`${API_URL}/articles/${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_URL}/categories`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

export async function getComments(article_id: string): Promise<Comment[]> {
  const res = await fetch(`${API_URL}/articles/${article_id}/comments`, {
    cache: "no-store"
  })

  if (!res.ok) {
    throw new Error(`is the api ok: ${res.status}`);
  }
  return res.json();
}

export async function getSubscribers(): Promise<Subscriber[]>{
  const res = await fetch(`${API_URL}/subscribers`, { cache: "no-store"});
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }
  return res.json();
}

export async function getArticleById(id: string): Promise<Article | null>{
  const articles = await getArticles();
  return articles.find((a) => a.id === id) ?? null;
}