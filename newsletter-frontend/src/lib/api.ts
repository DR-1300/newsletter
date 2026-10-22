import type {Article} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function getArticle(slug: string): Promise<Article | null> {
    const res = await fetch(`${API_URL}/articles/${encodeURIComponent(slug)}`, { cache: "no-store" });
    if (res.status == 404) return null;
    if (!res.ok) {
        throw new Error(`API error: ${res.status}`)
    }
    return res.json();
}
