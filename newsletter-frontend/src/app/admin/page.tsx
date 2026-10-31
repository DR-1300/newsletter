import { Suspense } from "react";
import Link from "next/link";
import { getArticles } from "@/lib/api";
import type { Article } from "@/lib/types";
import DeleteButton from "@/components/DeleteButton";

const statusStyle: Record<Article["status"], string> = {
  published: "border-highlight text-highlight",
  draft: "border-muted/50 text-muted",
  archived: "border-alert text-alert",
};

export default function AdminPage() {
  return (
    <>
      <h1 className="font-display text-5xl">Dashboard</h1>
      <Suspense fallback={<p className="mt-8 text-xs text-muted">Loading…</p>}>
        <ArticleTable />
      </Suspense>
    </>
  );
}

async function ArticleTable() {
  let articles: Article[];
  try {
    articles = await getArticles();
  } catch {
    return (
      <p className="mt-8 text-xs text-alert">
        API tripping, is the backend alive?
      </p>
    );
  }

  const count = (s: Article["status"]) =>
    articles.filter((a) => a.status === s).length;

  return (
    <>
      <div className="mt-8 grid grid-cols-3 gap-4 md:max-w-md">
        {(["published", "draft", "archived"] as const).map((s) => (
          <div key={s} className="border border-muted/30 p-4">
            <p className="font-display text-4xl">{count(s)}</p>
            <p className="mt-1 text-[10px] uppercase tracking-widest text-muted">
              {s}
            </p>
          </div>
        ))}
      </div>

      {articles.length === 0 ? (
        <p className="mt-8 text-xs text-muted">Emptier than them dms</p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left text-xs">
            <thead className="text-[10px] uppercase tracking-widest text-muted">
              <tr>
                <th className="pb-3 font-normal">Title</th>
                <th className="pb-3 font-normal">Status</th>
                <th className="pb-3 font-normal">Created</th>
                <th className="pb-3 text-right font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.id} className="border-t border-muted/20">
                  <td className="py-3 pr-4 font-display text-xl">{a.title}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`rounded-full border px-3 py-0.5 text-[10px] uppercase tracking-widest ${statusStyle[a.status]}`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-muted">
                    {new Date(a.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3 text-right">
                    <Link
                      href={`/articles/${a.slug}`}
                      className="text-muted transition hover:text-paper"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/articles/${a.id}/edit`}
                      className="ml-4 text-muted transition hover:text-paper"
                    >
                      Edit
                    </Link>
                    <DeleteButton id={a.id} title={a.title} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}