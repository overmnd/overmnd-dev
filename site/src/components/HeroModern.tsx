'use client';
import Image from 'next/image';
import Link from 'next/link';
import Button from './Button';
export default function HeroModern() {
  return (
    <section className="relative bg-grid">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 bg-hero-halo">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
          Trusted by small businesses and MSPs
        </div>
        <h1 className="mt-6 text-5xl font-semibold leading-tight tracking-tight">
          Operational awareness that actually helps you <span className="text-gradient">act faster</span>.
        </h1>
        <p className="mt-6 max-w-3xl text-lg text-white/80">
          Overmnd finds risky SharePoint and OneDrive links, flags safe license downgrades, and guides
          one‑click fixes with a complete rollback path. Read‑only by default; write access is explicit.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button as="link" href="/pricing" title="View pricing and start checkout">Get Started</Button>
          <Link href="/about" className="rounded-lg border border-white/10 px-5 py-3 font-medium text-white/80 hover:text-white">
            How it works
          </Link>
        </div>
        <div className="relative mt-16 h-[360px]">
          <div className="glass absolute left-1/2 top-0 w-[320px] -translate-x-1/2 rotate-0 p-4">
            <div className="flex items-center justify-between text-xs text-white/70">
              <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400"></span>Top Finding</span>
              <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-emerald-300">Safe to fix</span>
            </div>
            <div className="mt-3 overflow-hidden rounded-lg outline-muted">
              <Image src="/assets/hero-center.jpg" alt="Overmnd example" width={600} height={400} priority />
            </div>
            <p className="mt-3 text-sm text-white/80">External link on Finance folder shared to gmail.com — revoke or rescope.</p>
          </div>
          <div className="glass absolute left-[10%] top-10 w-[280px] -rotate-6 p-4">
            <div className="overflow-hidden rounded-lg outline-muted">
              <Image src="/assets/hero-left.jpg" alt="Share link example" width={540} height={360} />
            </div>
            <div className="mt-3 text-sm text-white/80">Weekly digest: 14 risky links, 3 tenants clean.</div>
          </div>
          <div className="glass absolute right-[10%] top-16 w-[280px] rotate-6 p-4">
            <div className="overflow-hidden rounded-lg outline-muted">
              <Image src="/assets/hero-right.jpg" alt="License example" width={540} height={360} />
            </div>
            <div className="mt-3 text-sm text-white/80">License Optimizer: 9 safe downgrades, $420 monthly savings.</div>
          </div>
        </div>
      </div>
    </section>
  );
}