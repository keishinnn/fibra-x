"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/methodology", label: "Methodology" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="border-b border-zinc-900/80 bg-black/80 backdrop-blur">
      <div className="fx-container py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="text-lg font-semibold tracking-tight text-zinc-100">
            FibraX
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-800 bg-zinc-950 text-zinc-300 transition-colors hover:border-zinc-700 hover:text-zinc-100 sm:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className={`h-4 w-4 transition-transform duration-200 ${mobileOpen ? "rotate-90" : ""}`}
            >
              <path
                d="M4 6h16M4 12h16M4 18h16"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.8"
              />
            </svg>
          </button>

          <nav aria-label="Primary navigation" className="mt-1 hidden items-center gap-1 sm:flex">
            {navLinks.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-md px-2.5 py-1.5 text-sm transition-colors ${active
                    ? "bg-zinc-900 text-zinc-100"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>



        <div
          className={`grid overflow-hidden transition-all duration-200 sm:hidden ${mobileOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
        >
          <nav
            id="mobile-nav"
            aria-label="Mobile navigation"
            className="mt-3 min-h-0 rounded-lg border border-zinc-900 bg-zinc-950/95 p-2"
          >
            {navLinks.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-md px-3 py-2 text-sm transition-colors ${active
                    ? "bg-zinc-900 text-zinc-100"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
