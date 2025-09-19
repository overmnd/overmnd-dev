import { Lock, Shield, FileCode2, EyeOff } from 'lucide-react';
export default function Security() {
  const items = [
    { icon: Lock, title: 'Least Privilege', text: 'Separate Read and Fix app registrations. Sites.Selected for SharePoint write.' },
    { icon: EyeOff, title: 'No Content Reading', text: 'We never inspect file content. We adjust link scopes and licenses only.' },
    { icon: Shield, title: 'Hardened Frontend', text: 'Strict CSP, no third-party scripts, frame-ancestors DENY, HTTPS required.' },
    { icon: FileCode2, title: 'Auditable by Design', text: 'Immutable remediation ledger with before/after and rollback.' }
  ];
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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