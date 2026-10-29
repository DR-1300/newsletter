import Link from "next/link";

export default function SiteHeader() {
    return (
        <header className="border-b border-muted/20 bg-panel">
            <div className="flex items-center justify-between px-10 py-4 text-[10px] uppercase tracking-widest">
                <nav className="flex gap-6 text-muted">
                    <Link href="/articles" className="transition hover:text-paper">
                    Archive
                    </Link>
                </nav>

                <Link href="/" className="font-display text-2xl normal-case tracking-normal text-paper">
                Newsletter
                </Link>

                <Link href="/admin" className="text-muted transition hover:text-paper">
                Admin
                </Link>
            </div>
        </header>
    )
}