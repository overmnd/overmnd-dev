import { ShieldCheck, Undo2, Link2, Users, Mail, Wallet } from 'lucide-react';
export default function FeatureGrid() {
  const items = [
    { icon: Link2, title: 'Sharing Guard', text: 'Find “Anyone with the link” and external-domain shares. One click to revoke or rescope.' },
    { icon: Wallet, title: 'License Optimizer', text: 'Detect safe downgrades and reclaim leavers based on real usage.' },
    { icon: ShieldCheck, title: 'Read-only First', text: 'Nothing writes until you enable fixes. Sites.Selected for SharePoint.' },
    { icon: Undo2, title: 'Undo Everything', text: 'Every action logged with pre and post state and a rollback path.' },
    { icon: Users, title: 'Multi-tenant Aware', text: 'Built for MSP workflows; clean tenant switcher and consolidated digests.' },
    { icon: Mail, title: 'Weekly Digest', text: 'Counts and deep links back to the exact items that need attention.' }
  ];
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(({ icon: Icon, title, text }) => (
        <div key={title} className="card p-6">
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 outline-muted gradient-ring">
            <Icon className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="mt-2 text-white/70">{text}</p>
        </div>
      ))}
    </div>
  );
}