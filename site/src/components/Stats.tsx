export default function Stats() {
  const items = [
    { k: 'minutes-to-visibility', label: 'Minutes to first findings', value: '≤ 10' },
    { k: 'undoable', label: 'Actions undoable', value: '100%' },
    { k: 'content-read', label: 'File content read', value: '0 bytes' }
  ];
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {items.map((s) => (
        <div key={s.k} className="card p-6 text-center">
          <div className="text-4xl font-bold">{s.value}</div>
          <div className="mt-2 text-white/70">{s.label}</div>
        </div>
      ))}
    </div>
  );
}