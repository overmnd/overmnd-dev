export default function LogoCloud() {
  const logos = ['Northwind IT', 'Contoso MSP', 'Fabrikam Group', 'Adventure Works', 'Proseware'];
  return (
    <div className="card p-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {logos.map((name) => (
          <div key={name} className="flex h-14 items-center justify-center rounded-md bg-white/5 text-white/70 outline-muted">
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}