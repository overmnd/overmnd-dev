import Link from 'next/link';
import Section from '../../components/Section';

export default function CancelPage() {
  return (
    <Section title="Checkout canceled">
      <div className="card p-6">
        <p className="text-white/80">
          You did not complete payment. No charges were made. You can try again any time.
        </p>
        <div className="mt-6 flex gap-4">
          <Link href="/pricing" className="btn-gradient rounded-lg px-5 py-3 font-semibold text-white">
            Return to Pricing
          </Link>
          <Link href="/" className="rounded-lg border border-white/10 px-5 py-3 font-medium text-white">
            Back to Home
          </Link>
        </div>
      </div>
    </Section>
  );
}
