import { Github, Linkedin } from "lucide-react";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-brand-charcoal text-white">
      <div className="page-container py-16">
        <div className="flex flex-col justify-between gap-8 border-b border-white/10 pb-10 md:flex-row md:items-start">
          <nav className="flex flex-wrap gap-6 text-sm text-white/70">
            <Link href="/#features" className="hover:text-white">
              Features
            </Link>
            <Link href="/#performance" className="hover:text-white">
              Performance
            </Link>
            <Link href="/dashboard" className="hover:text-white">
              Dashboard
            </Link>
            <Link href="/#deploy" className="hover:text-white">
              Deploy
            </Link>
            <Link href="https://github.com" className="hover:text-white">
              Docs
            </Link>
          </nav>
          <a
            href="mailto:team@AnuVaani.dev"
            className="text-xl font-normal text-white md:text-2xl"
          >
            team@AnuVaani.dev
          </a>
        </div>

        <div className="flex flex-col justify-between gap-6 py-10 md:flex-row md:items-center">
          <p className="text-sm text-white/50">
            ISRO PS 26172 · Low-Latency Edge Voice Activator
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com"
              aria-label="GitHub"
              className="text-white/60 transition-colors hover:text-white"
            >
              <Github className="h-5 w-5" strokeWidth={1.75} />
            </Link>
            <Link
              href="#"
              aria-label="LinkedIn"
              className="text-white/60 transition-colors hover:text-white"
            >
              <Linkedin className="h-5 w-5" strokeWidth={1.75} />
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="text-4xl font-bold tracking-tight md:text-6xl">AnuVaani</h2>
          <span className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/60">
            ISRO PS 26172 · Open Source
          </span>
        </div>

        <p className="mt-10 text-xs text-white/40">
          © 2026 AnuVaani. MIT License. Privacy · Terms
        </p>
      </div>
    </footer>
  );
}
