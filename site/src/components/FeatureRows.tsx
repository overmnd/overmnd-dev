import { Link2, ShieldCheck, Undo2, Wallet, Mail, Users } from 'lucide-react';
export default function FeatureRows() {
  const rows = [
    { icon: Link2, title: 'Sharing Guard', desc: 'Find “Anyone with the link” and external-domain shares. One click to revoke or rescope to “People in your organization.”' },
    { icon: Wallet, title: 'License Optimizer', desc: 'Detect safe downgrades and reclaim leaver licenses based on real usage and sign‑ins. Preview before applying.' },
    { icon: ShieldCheck, title: 'Read‑only by Default', desc: 'Nothing writes until you enable Overmnd‑Fix. SharePoint write is limited with Sites.Selected and scoped only to approved sites.' },
    { icon: Undo2, title: 'Undo Everything', desc: 'Every change writes a remediation ledger entry with before and after state, and a rollback path.' },
    { icon: Mail, title: 'Weekly Digest', desc: 'Counts and deep links back to the exact items that need attention. No babysitting required.' },
    { icon: Users, title: 'Built for MSPs', desc: 'Multi‑tenant switcher, consolidated digests, and exportable ledgers. Seat and tenant limits enforced in‑app.' }
  ];
  return (
    <div className="mx-auto w-full max-w-6xl px-4">
      <div className="grid gap-6 md:grid-cols-2">
        {rows.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card p-6">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 outline-muted gradient-ring">
              <Icon className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-white/70">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}