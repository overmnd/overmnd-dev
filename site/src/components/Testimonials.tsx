export default function Testimonials() {
  const quotes = [
    { body: 'We finally have weekly visibility without babysitting. The ledger gives us confidence to let juniors run fixes.', author: 'MSP Owner, 12 tenants' },
    { body: 'We trimmed our Microsoft 365 bill in the first month. The downgrade preview is honest and reversible.', author: 'COO, 120 seats' }
  ];
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {quotes.map((q) => (
        <figure key={q.body} className="card p-6">
          <blockquote className="text-white/90">“{q.body}”</blockquote>
          <figcaption className="mt-3 text-white/60">— {q.author}</figcaption>
        </figure>
      ))}
    </div>
  );
}