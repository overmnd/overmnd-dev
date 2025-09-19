// Centralized environment configuration with explicit, readable property names.
// This prevents silent misconfiguration and keeps all required values in one place.

export const environmentConfiguration = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? '',
  adminPortalUrl: process.env.NEXT_PUBLIC_ADMIN_PORTAL_URL ?? '',
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE ?? '',
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? '',
  priceEssentialsMonthly: process.env.STRIPE_PRICE_ESSENTIALS_MONTHLY ?? '',
  priceEssentialsYearly: process.env.STRIPE_PRICE_ESSENTIALS_YEARLY ?? '',
  priceGrowthMonthly: process.env.STRIPE_PRICE_GROWTH_MONTHLY ?? '',
  priceGrowthYearly: process.env.STRIPE_PRICE_GROWTH_YEARLY ?? '',
  priceMspMonthly: process.env.STRIPE_PRICE_MSP_MONTHLY ?? '',
  priceMspYearly: process.env.STRIPE_PRICE_MSP_YEARLY ?? ''
};

export function hasRealStripeConfiguration(): boolean {
  // If both the secret key and at least one real-looking price identifier are present,
  // we consider Stripe to be configured. This is deliberately simple.
  return Boolean(
    environmentConfiguration.stripeSecretKey &&
      (environmentConfiguration.priceEssentialsMonthly ||
        environmentConfiguration.priceEssentialsYearly ||
        environmentConfiguration.priceGrowthMonthly ||
        environmentConfiguration.priceGrowthYearly ||
        environmentConfiguration.priceMspMonthly ||
        environmentConfiguration.priceMspYearly)
  );
}
