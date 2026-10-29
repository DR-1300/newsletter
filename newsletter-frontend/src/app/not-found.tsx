import Link from "next/link";

export default function notFound() {
    return (
        <main className="flex min-h-[60vh] flex-col items-start justify-center p-10">
            <p className="text-[10px] uppercase tracking widest text-muted">
                Error 404
            </p>
            <h1  className="mt-4 font-display text-7xl leading-none">
                wyd here, theres nothing
            </h1>
            <p className="mt-6 text-xs leading-relaxed text-muted">
                the page isnt there (anymore or ever, whatever makes u sleep at night)
            </p>
            <Link href="/articles" className="mt-8 rounded-full bg-highlight px-5 py-2 text-[10px] font-medium tracking-widest text-ink transition hover:scale-105">
            Back to archive
            </Link>
        </main>
    )
}