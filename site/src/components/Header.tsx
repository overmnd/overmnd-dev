'use client';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[rgba(11,18,32,0.6)] backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-white">
          <span className="rounded px-2 py-0.5 bg-om-accent">./</span>
          <span className="tracking-tight">overmnd</span>
        </Link>

        <nav className="hidden gap-8 text-sm font-medium text-white/80 md:flex">
          <Link href="/pricing" className="hover:text-white">Pricing</Link>
          <Link href="/faq" className="hover:text-white">FAQ</Link>
          <Link href="/about" className="hover:text-white">About</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="http://localhost:5173/login"
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/80 hover:text-white"
            title="Login"
          >
            Login
          </Link>

          <Link href="/pricing" className="btn-gradient rounded-lg px-4 py-2 text-sm font-semibold text-white">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
