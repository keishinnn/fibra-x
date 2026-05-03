import Link from "next/link";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/methodology", label: "Methodology" },
  { href: "/backtest", label: "Backtest" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  return (
    <header className="border-b border-zinc-900/80 bg-black/80 backdrop-blur">
      <div className="fx-container flex items-center justify-between gap-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-zinc-100">
          FibraX
        </Link>

        <nav className="flex flex-wrap items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-2.5 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
