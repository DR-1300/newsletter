"use client";

import { useState } from "react";
import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import type { Article } from "@/lib/types";

const spots = [
  { pos: "md:absolute md:left-[2%] md:top-[6%]", z: "md:z-10", tilt: "-rotate-3 md:-rotate-6", side: "right" },
  { pos: "md:absolute md:left-[21%] md:top-[30%]", z: "md:z-20", tilt: "rotate-2 md:rotate-3", side: "right" },
  { pos: "md:absolute md:left-[41%] md:top-[3%]", z: "md:z-10", tilt: "-rotate-1 md:-rotate-2", side: "right" },
  { pos: "md:absolute md:left-[58%] md:top-[32%]", z: "md:z-20", tilt: "rotate-2 md:rotate-6", side: "left" },
  { pos: "md:absolute md:left-[75%] md:top-[6%]", z: "md:z-10", tilt: "-rotate-3 md:-rotate-3", side: "left" },
] as const;

const panelSide = {
  right: "md:left-full md:right-auto md:ml-4",
  left: "md:right-full md:left-auto md:mr-4",
};

export default function ArticleDesk({ articles }: { articles: Article[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="mt-12 flex flex-wrap gap-8 md:relative md:block md:h-[640px]">
      {articles.map((article, i) => {
        const spot = spots[i % spots.length];
        const isSelected = article.id === selectedId;

        return (
          <div
            key={article.id}
            className={`${spot.pos} ${isSelected ? "md:z-30" : spot.z} md:hover:z-30`}
          >
            <ArticleCard
              article={article}
              className={spot.tilt}
              selected={isSelected}
              onSelect={() => setSelectedId(article.id)}
            />

            {isSelected && (
              <aside
                aria-label="Selected issue"
                className={`fixed bottom-4 left-4 right-4 z-50 bg-signal p-4 text-paper shadow-2xl shadow-black/60 md:absolute md:bottom-auto md:top-4 md:w-56 ${panelSide[spot.side]}`}
              >
                <p className="text-[10px] uppercase tracking-widest text-paper/70">
                  {article.estimated_read_time} min read · {article.type}
                </p>
                <h3 className="mt-2 font-display text-2xl leading-tight">
                  {article.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-paper/80">
                  {article.description}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <Link
                    href={`/articles/${article.slug}`}
                    className="rounded-full bg-highlight px-4 py-1.5 text-[10px] font-medium uppercase tracking-widest text-ink transition hover:scale-105"
                  >
                    Read issue
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSelectedId(null)}
                    aria-label="Close"
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-alert text-xs text-paper transition hover:scale-110"
                  >
                    ×
                  </button>
                </div>
              </aside>
            )}
          </div>
        );
      })}
    </div>
  );
}