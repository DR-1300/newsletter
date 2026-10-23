import ArticleCard from "./ArticleCard";
import { getArticles } from "@/lib/api";
import type { Article } from "@/lib/types";

const tilts = ["-rotate-3", "rotate-2", "-rotate-1"];

export default async function ArticleGrid({
    categoryId,
}: {
    categoryId?: string;
}){
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
                bruh api tripping check on backend lol
            </p>
        );
    }

    if (categoryId){
        articles = articles.filter((a) => a.category_id === categoryId);
    }


    if (articles.length==0) {
        return <p className="mt-12 text-xs text-muted">
            emptier than ur dms
        </p>
    }

    return (
        <div className="mt-12 flex flex-wrap gap-8">
            {articles.map((article, i) => (
                <ArticleCard
                key={article.id}
                article = {article}
                tilt={tilts[i % tilts.length]}/>
            ))}
        </div>
    )
}