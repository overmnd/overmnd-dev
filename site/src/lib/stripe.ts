import Stripe from 'stripe';
import { environmentConfiguration } from './environment';

/**
 * Initialize Stripe server client only when a real secret key is provided.
 * This keeps local development working with sample placeholders.
 */
export const stripe =
  environmentConfiguration.stripeSecretKey
    ? new Stripe(environmentConfiguration.stripeSecretKey, {
        apiVersion: '2024-06-20',
        typescript: true
      })
    : null;
