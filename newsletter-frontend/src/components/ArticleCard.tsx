import Link from "next/link";
import type {Article} from "@/lib/types"

type Props = {
    article: Article;
    tilt?: string;
}

export default function ArticleCard({ article, tilt=" "}: Props) {
    const date = article.published_at ? new Date(article.published_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    })
    : "Unpublished";

    return (
    <Link
      href={`/articles/${article.slug}`}
      className={`relative block w-64 bg-paper p-6 text-ink shadow-xl shadow-black/50 transition duration-300 hover:z-10 hover:rotate-0 hover:scale-110 ${tilt}`}
    >
      <p className="text-[10px] uppercase tracking-widest text-ink/60">{date}</p>
      <h2 className="mt-3 font-display text-3xl leading-tight">{article.title}</h2>
      <p className="mt-3 text-xs leading-relaxed">{article.description}</p>
      <p className="mt-6 text-[10px] uppercase tracking-widest">
        {article.estimated_read_time} min read
      </p>
    </Link>
    );
}