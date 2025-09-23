import Link from 'next/link';
import Section from '../../components/Section';

export default function SuccessPage() {
  const isDemo = typeof window !== 'undefined' && window.location.search.includes('demo=1');

  return (
    <Section title="Payment successful">
      <div className="card p-6 space-y-4">
        <p className="text-white/80">
          Check your email for an invite from Overmnd. That link takes you to the admin portal to
          set your password and finish onboarding.
        </p>
        {isDemo ? (
          <p className="text-amber-300/90">
            This was a simulated success without a real Stripe session. Replace the sample keys and
            price identifiers to enable real checkout.
          </p>
        ) : null}
        <div className="mt-2 flex gap-4">
          <Link
            href={process.env.NEXT_PUBLIC_ADMIN_PORTAL_URL || 'http://localhost:3000'}
            className="rounded-lg border border-white/10 px-5 py-3 font-medium text-white hover:text-white/90"
          >
            Login
          </Link>
          <Link href="/" className="btn-gradient rounded-lg px-5 py-3 font-semibold text-white">
            Back to Home
          </Link>
        </div>
      </div>
    </Section>
  );
}
