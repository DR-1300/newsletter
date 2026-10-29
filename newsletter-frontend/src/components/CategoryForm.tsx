"use client";

import { useState, type SyntheticEvent } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function CategoryForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), slug: slug.trim() || null }),
      });

      if (res.ok) {
        setName("");
        setSlug("");
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
    "border border-muted/40 bg-transparent px-3 py-2 text-xs text-paper placeholder:text-muted/60 focus:border-highlight focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <div className="flex flex-wrap gap-2">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          className={field}
        />
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="slug (optional)"
          className={field}
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-highlight px-5 py-2 text-[10px] font-medium uppercase tracking-widest text-ink transition hover:scale-105 disabled:opacity-50"
        >
          {loading ? "Adding…" : "Add category"}
        </button>
      </div>

      {error && (
        <p aria-live="polite" className="mt-3 text-xs text-alert">
          {error}
        </p>
      )}
    </form>
  );
}