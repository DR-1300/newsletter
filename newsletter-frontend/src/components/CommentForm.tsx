"use client";

import { useState, type SyntheticEvent } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function CommentForm({ articleId }: { articleId: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/articles/${articleId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author_name: name.trim() || null, content }),
      });

      if (res.ok) {
        setContent("");
        router.refresh();
      } else {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Something went wrong. Try again.");
      }
    } catch {
      setError("Could not reach the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  const field =
    "w-full border border-muted/40 bg-transparent px-3 py-2 text-xs text-paper placeholder:text-muted/60 focus:border-highlight focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="mt-6 max-w-md space-y-3">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name (optional)"
        maxLength={60}
        className={field}
      />
      <textarea
        required
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment"
        maxLength={2000}
        rows={3}
        className={field}
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-highlight px-5 py-2 text-[10px] font-medium uppercase tracking-widest text-ink transition hover:scale-105 disabled:opacity-50"
      >
        {loading ? "Posting…" : "Post comment"}
      </button>

      {error && (
        <p aria-live="polite" className="text-xs text-alert">
          {error}
        </p>
      )}
    </form>
  );
}