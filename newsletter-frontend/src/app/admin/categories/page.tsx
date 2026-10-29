import { Suspense } from "react";
import CategoryForm from "@/components/CategoryForm";
import { getCategories } from "@/lib/api";
import type { Category } from "@/lib/types";

export default function CategoriesPage() {
  return (
    <>
      <h1 className="font-display text-5xl">Categories</h1>
      <CategoryForm />
      <Suspense fallback={<p className="mt-8 text-xs text-muted">Loading…</p>}>
        <CategoryList />
      </Suspense>
    </>
  );
}

async function CategoryList() {
  let categories: Category[];
  try {
    categories = await getCategories();
  } catch {
    return (
      <p className="mt-8 text-xs text-alert">
        What is wrong w the backend vro
      </p>
    );
  }

  if (categories.length === 0) {
    return <p className="mt-8 text-xs text-muted">No categories yet.</p>;
  }

  return (
    <ul className="mt-8 max-w-md divide-y divide-muted/20 border-y border-muted/20">
      {categories.map((c) => (
        <li key={c.id} className="flex justify-between py-3 text-xs">
          <span className="font-display text-xl">{c.name}</span>
          <span className="text-muted">{c.slug ?? "no slug"}</span>
        </li>
      ))}
    </ul>
  );
}