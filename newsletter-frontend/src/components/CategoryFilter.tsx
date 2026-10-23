import Link from "next/link"
import { getCategories } from "@/lib/api"
import type { Category } from "@/lib/types"

export default async function CategoryFilter({
    selected,
}: {
    selected?:string;
}) {
    let categories: Category[] = [];
    try {
        categories = await getCategories();
    } catch {
        return null;
    }
    const base = "rounded-full border px-3 py-1 text-[10px] uppercase tracking-widest transition";
    const on = "border-highlight bg-highlight text-ink";
    const off = "border-muted/40 text-muted hover:text-paper";


    return (
        <nav className="mt-8 flex flex-wrap gap-2">
            <Link href = "/articles" className={`${base} ${!selected ? on : off}`}>All
            </Link>
            {categories.map((c) => (
                <Link
                key={c.id} href={`/articles?category=${c.id}`} className={`${base} ${selected === c.id ? on : off}`}>
                    {c.name}
                </Link>
            ))}
        </nav>
    )
}