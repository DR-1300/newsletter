import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import TiptapRenderer from "@/components/TiptapRenderer";
import { getArticle } from "@/lib/api";
import type { Article } from "@/lib/types";
import CommentList from "@/components/CommentList";
import CommentForm from "@/components/CommentForm";

type Props = { params: Promise<{ slug: string }> };

export default function ArticlePage({ params }: Props) {
  return (
    <main className="mx-auto min-h-screen max-w-2xl p-10">
      <Link href="/articles" className="text-xs text-muted transition hover:text-paper">
        - All issues
      </Link>

      <Suspense fallback={<p className="mt-12 text-xs text-muted">Loading, hollup</p>}>
        <ArticleContent params={params} />
      </Suspense>
    </main>
  );
}
async function ArticleContent({ params }: Props) {
  const { slug } = await params;

  let article: Article | null;
  try {
    article = await getArticle(slug);
  } catch {
    return (
      <p className="mt-12 text-xs text-alert">
      is ts backend even running
    </p>
    )
  }

  if (!article) notFound();

  const date = article.published_at ? new Date(article.published_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }) : "Unpublished";

    return (
    <article className="mt-12">
      <p className="text-[10px] uppercase tracking-widest text-muted">
        {date} · {article.estimated_read_time} min read
      </p>
      <h1 className="mt-3 font-display text-5xl leading-tight">{article.title}</h1>
      <p className="mt-4 text-sm text-muted">{article.description}</p>

      <ul className="mt-4 flex flex-wrap gap-2">
        {article.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full border border-muted/40 px-3 py-0.5 text-[10px] uppercase tracking-widest text-muted"
          >
            {tag}
          </li>
        ))}
      </ul>

      <div className="mt-10 border-t border-muted/30 pt-8">
        <TiptapRenderer content={article.contents} />
      </div>

      <section className="mt-16 border-t border-muted/30 pt-8">
      <h2 className="font-display text-3xl">Comments</h2>
      <CommentForm articleId={article.id} />
      <Suspense fallback={
        <p className="mt-6 text-xs text-muted">hollup comments loading..</p>
      }>
        <CommentList articleId={article.id} />
      </Suspense>
      </section>
    </article>
  ); 
}