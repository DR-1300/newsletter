import { Suspense } from "react";
import ArticleForm from "@/components/ArticleForm";
import { getCategories } from "@/lib/api";
import type { Category } from "@/lib/types";

export default function NewArticlePage() {
  return (
    <>
      <h1 className="font-display text-5xl">New article</h1>
      <Suspense fallback={<p className="mt-8 text-xs text-muted">Loading…</p>}>
        <NewArticleForm />
      </Suspense>
    </>
  );
}

async function NewArticleForm() {
  let categories: Category[] = [];
  try {
    categories = await getCategories();
  } catch {
    categories = [];
  }
  return <ArticleForm categories={categories} />;
}