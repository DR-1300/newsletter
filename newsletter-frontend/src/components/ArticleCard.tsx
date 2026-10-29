"use client";

import Link from "next/link";
import type { Article } from "@/lib/types";
import type { MouseEvent } from "react";

const fallback = "./fall-back.jpg";

const variants = [
  { box: "bg-paper text-ink", muted: "text-ink/60" },
  { box: "bg-index text-ink ruled", muted: "text-ink/60" },
  { box: "bg-manila text-ink rounded-tr-3xl", muted: "text-ink/60" },
  { box: "bg-instrument text-paper rounded-lg border border-paper/25", muted: "text-paper/60" },
];


type Props = {
  article: Article;
  className?: string;
  selected?: boolean;
  onSelect?: () => void;
  variant?: number;
};

export default function ArticleCard({ article, className = "", selected= false, onSelect, variant=0, }: Props) {
  const v = variants[variant % variants.length];
  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Unpublished";

    function handleClick(e: MouseEvent<HTMLAnchorElement>) {
      if (!onSelect) return;
      e.preventDefault();
      onSelect();
    }

  return (
    <Link
      href={`/articles/${article.slug}`} onClick={handleClick}
      className={`relative block w-64 bg-paper p-6 text-ink shadow-xl shadow-black/50 transition duration-300 hover:z-30 hover:rotate-0 hover:scale-110 ${className}`}
    >
      <img src={article.cover_image ?? fallback}
      alt = ""
      className="-mx-6 -mt-6 mb-5 h-32 w-[calc(100%+3rem)] max-w-none object-cover transition duration-300 group-hover:grayscale-0"
      />
      <p className="text-[10px] uppercase tracking-widest text-ink/60">{date}</p>
      <h2 className="mt-3 font-display text-3xl leading-tight">{article.title}</h2>
      <p className="mt-3 text-xs leading-relaxed">{article.description}</p>
      <p className="mt-6 text-[10px] uppercase tracking-widest">
        {article.estimated_read_time} min read
      </p>
    </Link>
  );
}