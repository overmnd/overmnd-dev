import { Server, MousePointer, CheckCircle2 } from 'lucide-react';
export default function HowItWorksRail() {
  const steps = [
    { icon: Server, title: 'Connect', text: 'Grant Overmnd‑Read for discovery (application permissions).' },
    { icon: MousePointer, title: 'Discover', text: 'We rank risky links and license opportunities. Read‑only by default.' },
    { icon: CheckCircle2, title: 'Fix', text: 'Enable Overmnd‑Fix, run one‑click actions, and undo as needed.' }
  ];
  return (
    <div className="mx-auto w-full max-w-6xl px-4">
      <ol className="grid gap-6 md:grid-cols-3">
        {steps.map(({ icon: Icon, title, text }, idx) => (
          <li key={title} className="card p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm">{idx + 1}</span>
              <h3 className="text-lg font-semibold">{title}</h3>
            </div>
            <div className="mt-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 outline-muted gradient-ring">
              <Icon className="h-5 w-5 text-white" />
            </div>
            <p className="mt-2 text-white/70">{text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}