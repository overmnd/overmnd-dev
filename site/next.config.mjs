// @ts-check
/** @type {import('next').NextConfig} */

/*
  Security posture:
  - Strict headers and Content Security Policy tuned for a public marketing site.
  - We redirect to Stripe-hosted Checkout (no embedded Stripe).
  - If you add third-party scripts later, explicitly widen CSP below in a controlled way.
*/

const withHeaders = async () => {
  const contentSecurityPolicy = `
    default-src 'self';
    script-src 'self';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data:;
    font-src 'self';
    connect-src 'self' https://api.stripe.com https://m.stripe.network;
    frame-src https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self' https://checkout.stripe.com;
    object-src 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  const headers = [
    { key: 'Content-Security-Policy', value: contentSecurityPolicy },
    { key: 'Referrer-Policy', value: 'no-referrer' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'X-XSS-Protection', value: '0' },
    { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
    { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' }
  ];

  return [{ source: '/:path*', headers }];
};

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  headers: withHeaders
};

export default nextConfig;
