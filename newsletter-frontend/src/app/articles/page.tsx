import { Suspense } from "react";
import Link from "next/link";
import ArticleGrid from "@/components/ArticleGrid";

export default function Home() {
  return (
    <main className="p-10">
      <p className="text-[10px] uppercase tracking-widest text-muted">
        Archive / Issues / Latest
      </p>

      <div className="mt-6 grid gap-8 md:grid-cols-[1.2fr_1fr_1fr_auto]">
        <h1 className="font-display text-6xl leading-none md:text-7xl">
          Newsletter Archive
        </h1>
        <p>
          Hi lol welcome to the archive, just a bunch of articles about me rambling about my stupid decisions lOl
        </p>
        <div className="text-[10px] uppercase tracking-widest text-muted md:text-right">
          <p>Open archive</p>
          <p className="mt-1">Oct 2026</p>
        </div>
      </div>

      <Suspense
        fallback={<p className="mt-12 text-xs text-muted">Loading issues…</p>}
      >
        <ArticleGrid layout="desk" />
      </Suspense>

      <Link
        href="/articles"
        className="mt-8 inline-block text-[10px] uppercase tracking-widest text-muted transition hover:text-paper"
      >
        See all issues
      </Link>
    </main>
  );
}