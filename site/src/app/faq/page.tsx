import Section from '../../components/Section';
const faqs = [
  { q: 'What happens after I pay?', a: 'Stripe completes payment, then our backend receives a webhook and provisions your tenant and an owner invite. You receive an email with a secure link to the admin portal to finish setup.' },
  { q: 'Do you read content?', a: 'No. We do not read file content. We change link scopes and license assignments only.' },
  { q: 'Is there a trial?', a: 'Yes. A thirty-day read-only trial is included on Essentials, Growth, and MSP. No card required. Discovery and reports run normally; fix actions are disabled until you explicitly enable write access.' },
  { q: 'How do you connect to Microsoft 365?', a: 'Two app registrations: Overmnd-Read (application permissions for discovery) and Overmnd-Fix (only when you enable fixes). SharePoint write uses Sites.Selected so only the sites you approve are touched.' },
  { q: 'How are seats and tenants enforced?', a: 'By policy in the app. Essentials: up to five users, one tenant. Growth: up to five users, two tenants. MSP: up to ten users, up to five tenants. If you exceed a limit, we block the action and provide an upgrade path.' },
  { q: 'Can I cancel any time?', a: 'Yes. You can cancel in the billing portal. Access continues until the end of the current billing period. Upgrades and downgrades follow Stripe proration defaults.' },
  { q: 'Do MSPs get a consolidated view?', a: 'Yes. The MSP plan includes a multi-tenant switcher, consolidated digests, and exportable ledgers.' },
];
export default function FaqPage() {
  return (
    <Section title="Frequently Asked Questions">
      <div className="space-y-4">
        {faqs.map((f) => (
          <div key={f.q} className="card p-5">
            <h3 className="text-lg font-semibold">{f.q}</h3>
            <p className="mt-2 text-white/80">{f.a}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}