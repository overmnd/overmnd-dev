'use client';
import { useMemo, useState } from 'react';
import Section from '../../components/Section';
type BillingInterval = 'monthly' | 'yearly';
type TierKey = 'ESSENTIALS' | 'GROWTH' | 'MSP' | 'PARTNER';
type Tier = { key: TierKey; name: string; who: string; monthlyUsd?: number; yearlyUsd?: number; description: string; canCheckout: boolean; };
const TIERS: Tier[] = [
  { key: 'ESSENTIALS', name: 'Essentials', who: 'Up to five users, one tenant', monthlyUsd: 50, yearlyUsd: 550,
    description: 'All features included. Read-only first. Ideal for a single tenant that needs predictable cleanup and honest savings visibility.', canCheckout: true },
  { key: 'GROWTH', name: 'Growth', who: 'Up to five users, two tenants', monthlyUsd: 100, yearlyUsd: 1000,
    description: 'All features included. Manage two tenants cleanly. Weekly digests, ledger with undo, and clear downgrade previews.', canCheckout: true },
  { key: 'MSP', name: 'MSP', who: 'Up to ten users, up to five tenants', monthlyUsd: 199, yearlyUsd: 2000,
    description: 'All features included. Built for small MSPs: tenant switcher, consolidated digests, exportable ledgers, simple white-label PDFs.', canCheckout: true },
  { key: 'PARTNER', name: 'Partner', who: 'Custom seats and custom tenants (contract)', description: 'All features included. Contract terms for larger footprints or specific compliance needs. Priority support and tailored onboarding.', canCheckout: false },
];
export default function PricingPage() {
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('monthly');
  const [busyKey, setBusyKey] = useState<TierKey | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const displayedTiers = useMemo(() => TIERS, []);
  async function startCheckout(tierKey: TierKey) {
    setBusyKey(tierKey); setErrorMessage(null);
    try {
      const res = await fetch('/api/checkout/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tier: tierKey, interval: billingInterval }) });
      if (!res.ok) throw new Error(await res.text() || `HTTP ${res.status}`);
      const data = (await res.json()) as { url: string }; window.location.href = data.url;
    } catch (err: any) { setErrorMessage(err?.message || 'Checkout failed.'); setBusyKey(null); }
  }
  return (
    <>
      <Section title="Pricing" subtitle="All features in every plan. Thirty-day read-only trial on Essentials, Growth, and MSP.">
        <div className="mb-6 flex items-center gap-3">
          <button className={`rounded-lg border px-4 py-2 text-sm ${billingInterval==='monthly'?'border-white/20 bg-white/10 text-white':'border-white/10 text-white/70 hover:text-white'}`} onClick={()=>setBillingInterval('monthly')} aria-pressed={billingInterval==='monthly'}>Monthly</button>
          <button className={`rounded-lg border px-4 py-2 text-sm ${billingInterval==='yearly'?'border-white/20 bg-white/10 text-white':'border-white/10 text-white/70 hover:text-white'}`} onClick={()=>setBillingInterval('yearly')} aria-pressed={billingInterval==='yearly'}>Yearly</button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {displayedTiers.map((tier) => {
            const showPrice = tier.monthlyUsd !== undefined;
            const amount = billingInterval === 'monthly' ? tier.monthlyUsd ?? 0 : tier.yearlyUsd ?? 0;
            return (
              <div key={tier.key} className="card p-6 flex flex-col">
                <div>
                  <h3 className="text-xl font-semibold">{tier.name}</h3>
                  <p className="mt-1 text-white/70">{tier.who}</p>
                </div>
                {showPrice ? (
                  <div className="mt-6 flex items-end gap-2">
                    <span className="text-4xl font-bold">${amount}</span>
                    <span className="text-white/60">/ {billingInterval}</span>
                  </div>
                ) : (
                  <div className="mt-6 flex items-end gap-2">
                    <span className="text-4xl font-bold">Custom</span>
                    <span className="text-white/60">/ contract</span>
                  </div>
                )}
                <p className="mt-6 text-white/80">{tier.description}</p>
                <p className="mt-2 text-white/60 text-sm">Seat and tenant limits are enforced in-app. Upgrade anytime.</p>
                <div className="mt-8">
                  {tier.canCheckout ? (
                    <button onClick={()=>startCheckout(tier.key)} disabled={busyKey===tier.key} className="w-full rounded-lg px-5 py-3 font-semibold text-white btn-gradient disabled:opacity-60" title="Proceed to Stripe-hosted checkout">
                      {busyKey===tier.key ? 'Redirecting…' : 'Buy with Stripe'}
                    </button>
                  ) : (
                    <a href="mailto:sales@overmnd.example" className="w-full rounded-lg border border-white/10 px-5 py-3 text-center font-medium text-white/80 hover:text-white block">Contact Sales</a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {errorMessage ? <p className="mt-4 text-red-400">{errorMessage}</p> : null}
        <div className="mt-10 card p-6 text-white/70">
          <p><strong>Trials:</strong> Thirty-day read-only on Essentials, Growth, and MSP. Fixes are disabled until you explicitly enable write access.</p>
          <p className="mt-2"><strong>Billing:</strong> Upgrades or downgrades prorate by Stripe defaults. Annual options include one or two months free as shown.</p>
        </div>
      </Section>
    </>
  );
}