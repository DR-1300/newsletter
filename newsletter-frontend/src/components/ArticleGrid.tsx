import ArticleCard from "./ArticleCard";
import { getArticles } from "@/lib/api";
import type { Article } from "@/lib/types";
import ArticleDesk from "./ArticleDesk";

const gridTilts = ["-rotate-3", "rotate-2", "-rotate-1"];
const DESK_LIMIT = 5;

type Props = {
    categoryId?:string;
    layout?: "grid" | "desk";
}

export default async function ArticleGrid({
  categoryId,
  layout = "grid",
}: Props) {
  let articles: Article[] = [];
  let failed = false;

  try {
    articles = await getArticles();
  } catch {
    failed = true;
  }

  if (failed) {
    return (
      <p className="mt-12 text-xs text-alert">
        bruh API tripping check on backend pls
      </p>
    );
  }

  if (categoryId) {
    articles = articles.filter((a) => a.category_id === categoryId);
  }

  if (layout === "desk") {
    return <ArticleDesk articles = {articles.slice(0, DESK_LIMIT)} />
  }

  if (articles.length === 0) {
    return <p className="mt-12 text-xs text-muted">emptier than ur dms</p>;
  }

  const container =
    layout === "desk"
      ? "mt-12 flex flex-wrap gap-8 md:relative md:block md:h-[640px]"
      : "mt-12 flex flex-wrap gap-8";

  return (
     <div className="mt-12 flex flex-wrap gap-8">
      {articles.map((article, i) => (
        <ArticleCard
          key={article.id}
          article={article}
          className={gridTilts[i % gridTilts.length]}
        />
      ))}
    </div>
  );
}