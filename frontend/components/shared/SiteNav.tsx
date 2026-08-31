"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/#performance", label: "Performance" },
  { href: "/#deploy", label: "Deploy" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-gray-200/80 bg-white/90 backdrop-blur-md shadow-sm" : "bg-white"
      }`}
    >
      <div className="page-container flex h-16 items-center justify-between md:h-[72px]">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-brand-charcoal">AnuVaani</span>
          <span className="rounded bg-brand-teal/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-teal">
            PS 26172
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-brand-body transition-colors hover:text-brand-teal"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link href="/dashboard" className="btn-primary h-10 px-5 text-sm">
            Open Dashboard
          </Link>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5 text-brand-charcoal" />
        </button>
      </div>

      {open && (
        <div className="border-t border-gray-200 bg-white px-5 py-4 lg:hidden">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-brand-body"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/dashboard" className="btn-primary mt-2" onClick={() => setOpen(false)}>
              Open Dashboard
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
