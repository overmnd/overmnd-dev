import HeroModern from '../components/HeroModern';
import LogosRow from '../components/LogosRow';
import FeatureRows from '../components/FeatureRows';
import HowItWorksRail from '../components/HowItWorksRail';
import CTA from '../components/CTA';
export default function Page() {
  return (
    <>
      <HeroModern />
      <LogosRow />
      <section className="py-12">
        <FeatureRows />
      </section>
      <section className="py-12">
        <HowItWorksRail />
      </section>
      <section className="py-12">
        <CTA />
      </section>
    </>
  );
}