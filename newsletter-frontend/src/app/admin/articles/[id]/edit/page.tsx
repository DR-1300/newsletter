import { Suspense } from "react";
import { notFound } from "next/navigation";
import ArticleForm from "@/components/ArticleForm";
import { getArticleById, getCategories } from "@/lib/api";
import type { Article, Category } from "@/lib/types"

type Props = { params: Promise<{id:string}> };

export default function EditArticlePage( {params} : Props) {
    return (
        <>
        <h1 className="font-display text-5xl">Edit Article</h1>
        <Suspense fallback = { <p className="mt-8 text-xs text-muted" >
            Loading..
        </p>}>
        <EditArticleForm params={params} />
        </Suspense>
        </>
    )
}

async function EditArticleForm( {params} : Props ) {
    const { id } = await params;
    let article: Article | null;
    let categories: Category[];

    try {
        [article, categories] = await Promise.all([
            getArticleById(id),
            getCategories(),
        ])
    } catch {
        return (
            <p className="mt-8 text-xs text-alert">
                API tripping, pls check on the poor baby :(
            </p>
        );
    }

    if (!article) notFound();
    return (
        <ArticleForm key = {article.id} article = {article} categories={categories} />
    );
}