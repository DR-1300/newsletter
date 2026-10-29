"use client";

import { SyntheticEvent, useState, type FromEvent } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type Status = "idle" | "loading" | "success" | "error";

export default function SubscribeForm() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<Status>("idle");
    const [message, setMessage] = useState("");

    async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        setStatus("loading")
        setMessage("");

        try {
            const res = await fetch(`${API_URL}/subscribe`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ email }),
            });
            if (res.ok)  {
                setStatus("success")
                setMessage("u are on the list")
                setEmail("")
                return;
            }

            const data = await res.json().catch(() => null);
            setStatus("error")
            setMessage("try again");
        } catch {
            setStatus("error")
            setMessage("bruh backend trpping check pls")
        }
    }

  return (
    <form onSubmit={handleSubmit} className="max-w-md">
      <label
        htmlFor="subscribe-email"
        className="text-[10px] uppercase tracking-widest text-muted"
      >
        Get new issues by email
      </label>

      <div className="mt-3 flex gap-2">
        <input
          id="subscribe-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="min-w-0 flex-1 border border-muted/40 bg-transparent px-3 py-2 text-xs text-paper placeholder:text-muted/60 focus:border-highlight focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-full bg-highlight px-5 py-2 text-[10px] font-medium uppercase tracking-widest text-ink transition hover:scale-105 disabled:opacity-50"
        >
          {status === "loading" ? "..." : "Subscribe"}
        </button>
      </div>

      {message && (
        <p
          aria-live="polite"
          className={`mt-3 text-xs ${status === "error" ? "text-alert" : "text-paper"}`}
        >
          {message}
        </p>
      )}
    </form>
  );
}