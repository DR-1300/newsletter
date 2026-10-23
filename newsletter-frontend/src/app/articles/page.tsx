import { Suspense } from "react";
import Link from "next/link";
import ArticleGrid from "@/components/ArticleGrid";
import CategoryFilter from "@/components/CategoryFilter";

type Props = { searchParams: Promise<{ category?: string }> };

export default function ArticlesPage({ searchParams }: Props) {
  return (
    <main className="min-h-screen p-10">
      <Link href="/" className="text-xs text-muted transition hover:text-paper">
        - Home
      </Link>
      <h1 className="mt-8 font-display text-6xl">All issues</h1>

      <Suspense fallback={<p className="mt-12 text-xs text-muted">Loading…</p>}>
        <ArticlesContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function ArticlesContent({ searchParams }: Props) {
  const { category } = await searchParams;

  return (
    <>
      <CategoryFilter selected={category} />
      <ArticleGrid categoryId={category} />
    </>
  );
}