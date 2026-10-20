import ArticleCard  from "@/components/ArticleCard";
import type { Article } from "@/lib/types"

const tilts = ["-rotate-3", "rotate-2", "-rotate-1"];

const sample: Article[] = [
  {
    id: "1",
    slug: "hi-lol",
    title: "hi lol",
    description: "hi? igs",
    contents: {},
    cover_image: null,
    published_at: "2026-10-19T11:40:00+05:30",
    tags: ["hi"],
    category_id: null,
    status: "published",
    type: "newsletter",
    estimated_read_time: 2,
    created_at: "2026-10-19T11:40:00+05:30",
  },
    {
    id: "2",
    slug: "what-is-this",
    title: "what even is this",
    description: "maybe i should create a CTF (FUCK NO)",
    contents: {},
    cover_image: null,
    published_at: "2026-10-20T09:00:00+05:30",
    tags: ["contemplation"],
    category_id: null,
    status: "published",
    type: "update",
    estimated_read_time: 4,
    created_at: "2026-10-20T09:00:00+05:30",
  },
]

export default function Home() {
  return (
    <main className="min-h-screen p-10">
      <h1 className="font-display text-6x1">Newsletter</h1>
      <p className="mt-4 max-w-md text-xs leading-relaxed text-muted">
        A collection of issues, updates and notes, filed in the order they were written.
      </p>

      <div className="mt-12 flex flex-wrap gap-8">
        {sample.map((article, i) => (
          <ArticleCard
            key={article.id}
            article={article}
            tilt={tilts[i % tilts.length]}
          />
        ))}
      </div>
    </main>
  )
}