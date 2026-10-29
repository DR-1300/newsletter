"use client";

import { useState, type SyntheticEvent } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import type { JSONContent } from "@tiptap/react";
import type { Article, Category } from "@/lib/types";

const TiptapEditor = dynamic(() => import("@/components/TiptapEditor"), {
  ssr: false,
  loading: () => <p className="text-xs text-muted">Loading editor…</p>,
});

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const emptyDoc: JSONContent = { type: "doc", content: [{ type: "paragraph" }] };

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const field =
  "mt-2 w-full border border-muted/40 bg-transparent px-3 py-2 text-xs text-paper placeholder:text-muted/60 focus:border-highlight focus:outline-none";
const labelText = "text-[10px] uppercase tracking-widest text-muted";

type Props = {
  categories: Category[];
  article?: Article;
};

export default function ArticleForm({ categories, article }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(article));
  const [description, setDescription] = useState(article?.description ?? "");
  const [coverImage, setCoverImage] = useState(article?.cover_image ?? "");
  const [tags, setTags] = useState(article?.tags.join(", ") ?? "");
  const [categoryId, setCategoryId] = useState(article?.category_id ?? "");
  const [status, setStatus] = useState<Article["status"]>(
    article?.status ?? "draft",
  );
  const [type, setType] = useState(article?.type ?? "newsletter");
  const [readTime, setReadTime] = useState(
    String(article?.estimated_read_time ?? 1),
  );
  const [contents, setContents] = useState<JSONContent>(
    (article?.contents as JSONContent) ?? emptyDoc,
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!JSON.stringify(contents).includes('"type":"text"')) {
      setError("Write some content first.");
      return;
    }

    setLoading(true);

    const body = {
      slug: slug.trim(),
      title: title.trim(),
      description: description.trim(),
      contents,
      cover_image: coverImage.trim() || null,
      published_at: article?.published_at ?? null,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      category_id: categoryId || null,
      status,
      type,
      estimated_read_time: Number(readTime) || 1,
    };

    const url = article
      ? `${API_URL}/articles/${article.id}`
      : `${API_URL}/articles`;
    const method = article ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
        return;
      }

      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Something went wrong. Try again.");
    } catch {
      setError("Could not reach the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-6">
      <label className="block">
        <span className={labelText}>Title</span>
        <input
          required
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Is it too late?"
          className={field}
        />
      </label>

      <label className="block">
        <span className={labelText}>Slug (the web address)</span>
        <input
          required
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          placeholder="is-it-too-late"
          className={field}
        />
      </label>

      <label className="block">
        <span className={labelText}>Description</span>
        <input
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="One line that appears on the card"
          className={field}
        />
      </label>

      <div>
        <span className={labelText}>Content</span>
        <div className="mt-2">
          <TiptapEditor initialContent={contents} onChange={setContents} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <label className="block">
          <span className={labelText}>Category</span>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={field}
          >
            <option value="">No category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className={labelText}>Status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Article["status"])}
            className={field}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </label>

        <label className="block">
          <span className={labelText}>Type</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={field}
          >
            <option value="newsletter">Newsletter</option>
            <option value="update">Update</option>
          </select>
        </label>

        <label className="block">
          <span className={labelText}>Read time (minutes)</span>
          <input
            type="number"
            min={1}
            value={readTime}
            onChange={(e) => setReadTime(e.target.value)}
            className={field}
          />
        </label>
      </div>

      <label className="block">
        <span className={labelText}>Tags (separated by commas pls)</span>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="midsems, cgpa"
          className={field}
        />
      </label>

      <label className="block">
        <span className={labelText}>Cover image URL (optional)</span>
        <input
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          placeholder="https://…"
          className={field}
        />
      </label>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-highlight px-6 py-2 text-[10px] font-medium uppercase tracking-widest text-ink transition hover:scale-105 disabled:opacity-50"
        >
          {loading ? "Saving…" : article ? "Save changes" : "Create article"}
        </button>

        {error && (
          <p aria-live="polite" className="text-xs text-alert">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}