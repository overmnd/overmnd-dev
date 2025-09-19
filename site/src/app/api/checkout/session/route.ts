import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '../../../../../lib/stripe';
import { environmentConfiguration, hasRealStripeConfiguration } from '../../../../../lib/environment';

/**
 * POST /api/checkout/session
 * Body: { tier: 'ESSENTIALS' | 'GROWTH' | 'MSP' | 'PARTNER', interval: 'monthly' | 'yearly' }
 *
 * Behavior:
 * - When real Stripe configuration exists: Create a Stripe Checkout Session and return its URL.
 * - When missing (local bootstrap mode): Return a simulated success URL (/success?demo=1).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const requestedTier = String(body?.tier || '').toUpperCase();
    const requestedInterval = String(body?.interval || 'monthly').toLowerCase();

    if (requestedTier === 'PARTNER') {
      // Contract plan is not sold via Checkout. Return a 400 with a clear message.
      return new NextResponse('Partner is contract-only. Contact sales.', { status: 400 });
    }

    // Map the incoming tier + interval to an environment-configured Stripe Price identifier.
    const priceIdentifier = resolvePriceIdentifier(requestedTier, requestedInterval);
    if (!priceIdentifier) {
      // If we cannot resolve a price in either mode, fail loudly.
      return new NextResponse('Unsupported plan or interval.', { status: 400 });
    }

    const successUrl = `${environmentConfiguration.siteUrl || 'http://localhost:3001'}/success`;
    const cancelUrl = `${environmentConfiguration.siteUrl || 'http://localhost:3001'}/cancel`;

    if (!hasRealStripeConfiguration() || !stripe) {
      // Local bootstrap mode: act as if a session was created and redirect to success with a demo flag.
      return NextResponse.json({ url: `${successUrl}?demo=1` });
    }

    // Real Stripe mode: create a hosted Checkout Session.
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceIdentifier, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_creation: 'always',
      billing_address_collection: 'auto',
      allow_promotion_codes: true,
      // Trials are configured on the Price objects in Stripe.
      metadata: {
        application: 'overmnd',
        initiated_from: 'public_site',
        tier: requestedTier,
        interval: requestedInterval
      }
    });

    if (!session.url) {
      return new NextResponse('Stripe did not return a URL.', { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return new NextResponse('Failed to create Checkout Session.', { status: 500 });
  }
}

function resolvePriceIdentifier(tier: string, interval: string): string | null {
  const isMonthly = interval === 'monthly';
  switch (tier) {
    case 'ESSENTIALS':
      return isMonthly
        ? environmentConfiguration.priceEssentialsMonthly
        : environmentConfiguration.priceEssentialsYearly;
    case 'GROWTH':
      return isMonthly
        ? environmentConfiguration.priceGrowthMonthly
        : environmentConfiguration.priceGrowthYearly;
    case 'MSP':
      return isMonthly
        ? environmentConfiguration.priceMspMonthly
        : environmentConfiguration.priceMspYearly;
    default:
      return null;
  }
}
