import Link from 'next/link';
export default function CTA() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4">
      <div className="card p-6 md:flex md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-semibold">Start your thirty‑day read‑only trial</h3>
          <p className="mt-1 text-white/70">No card required. Discovery runs. Fixes stay off until you say so.</p>
        </div>
        <Link href="/pricing" className="mt-4 inline-flex rounded-lg px-5 py-3 font-semibold text-white btn-gradient md:mt-0">
          View Pricing
        </Link>
      </div>
    </div>
  );
}