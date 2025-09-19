import Section from '../../components/Section';
export default function AboutPage() {
  return (
    <Section title="About overmnd" subtitle="Simple outcomes without the big footprint.">
      <div className="prose prose-invert max-w-none text-white/80">
        <p>
          overmnd focuses on two outcomes: safer sharing and smaller license bills. We find
          dangerous SharePoint and OneDrive links and fix them with one click. We detect safe
          downgrades and reclaim leaver licenses with a clear preview and full rollback.
        </p>
        <p className="mt-4">
          Read-only by default; fixes require explicit consent. Every action is recorded with before
          and after states in an immutable remediation ledger. Multi-tenant aware for MSPs.
          We do not read file content.
        </p>
        <p className="mt-4">
          This is all example data. Still in development :).
        </p>
      </div>
    </Section>
  );
}