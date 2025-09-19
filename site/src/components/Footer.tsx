import Link from 'next/link';
import React from 'react';
export default function Footer() {
  return (
    <footer className="thin-sep">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 text-sm text-white/70">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 font-semibold text-white">
              <span className="rounded px-2 py-0.5 bg-om-accent">./</span>
              <span className="tracking-tight">overmnd</span>
            </div>
            <p className="mt-3 max-w-sm">Operational awareness for Microsoft 365 tenants. Read-only by default; fixes require explicit consent.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-white/60">Product</p>
              <Link href="/pricing" className="block hover:text-white">Pricing</Link>
              <Link href="/faq" className="block hover:text-white">FAQ</Link>
              <Link href="/about" className="block hover:text-white">About</Link>
            </div>
            <div className="space-y-2">
              <p className="text-white/60">Portals</p>
              <a href={process.env.NEXT_PUBLIC_ADMIN_PORTAL_URL || 'http://localhost:3000'} className="block hover:text-white">Admin Portal</a>
              <a href="mailto:sales@overmnd.example" className="block hover:text-white">Contact Sales</a>
            </div>
          </div>
          <div className="justify-self-end text-right hidden md:block">
            <p>© {new Date().getFullYear()} Overmnd. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}