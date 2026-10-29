import Link from "next/link";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/subscribers", label: "Subscribers" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-5 md:p-10">
      <nav className="flex flex-wrap items-center gap-6 border-b border-muted/20 pb-4 text-[10px] uppercase tracking-widest">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="text-muted transition hover:text-paper"
          >
            {l.label}
          </Link>
        ))}
        <Link
          href="/admin/articles/new"
          className="ml-auto rounded-full bg-highlight px-4 py-1.5 font-medium text-ink transition hover:scale-105"
        >
          New article
        </Link>
      </nav>

      <div className="mt-8">{children}</div>
    </div>
  );
}