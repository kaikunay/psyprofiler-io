/**
 * ═══════════════════════════════════════════════════════════════
 * PAYMENT CONFIGURATION — Credit Pricing & Gateway Config
 * ═══════════════════════════════════════════════════════════════
 */

// ── Credit Plans ──────────────────────────────────────────────

export interface CreditPlan {
  id: string;
  name: string;
  credits: number;
  priceINR: number;
  priceUSD: number;
  description: string;
  features: string[];
  badge?: string;
  popular?: boolean;
}

export const CREDIT_PLANS: CreditPlan[] = [
  {
    id: 'personal',
    name: 'Personal',
    credits: 75,
    priceINR: 4999,
    priceUSD: 59.99,
    description: 'For individual researchers & professionals',
    features: [
      '15 Deep Analyses / Month',
      'OCEAN + Dark Triad Profiling',
      'PDF Report Delivery',
      'Email Support',
    ],
    popular: true,
    badge: 'Early Adopter Pricing',
  },
  {
    id: 'pro',
    name: 'Pro',
    credits: 300,
    priceINR: 9999,
    priceUSD: 119.99,
    description: 'For small teams & agencies',
    features: [
      '60 Analyses / Month',
      'Team Dashboard Access',
      'API + Webhook Integration',
      'Priority Support (24h)',
    ],
    badge: 'Most Popular',
  },
  {
    id: 'organization',
    name: 'Organization',
    credits: 1250,
    priceINR: 59999,
    priceUSD: 719.99,
    description: 'For enterprises & large-scale intelligence operations',
    features: [
      '250 Analyses / Month',
      'White-Label Option',
      'Dedicated Account Manager',
      'On-Premise Available',
    ],
    badge: 'Enterprise',
  },
  {
    id: 'adhoc',
    name: 'Ad-hoc Intelligence Report',
    credits: 5,
    priceINR: 750,
    priceUSD: 9.00,
    description: 'One-time ad-hoc intelligence scan',
    features: [
      'Get a single report',
      'Full OSINT discovery',
      'PDF export',
    ],
  },
];

// ── Report Depth Config ───────────────────────────────────────

export const REPORT_COSTS = {
  scout: 1,        // Quick surface scan
  investigator: 3, // In-depth multi-platform
  oracle: 5,       // Maximum depth + Vedic
} as const;

export type ReportTier = keyof typeof REPORT_COSTS;

// ── Gateway Types ─────────────────────────────────────────────

export type PaymentGateway = 'cashfree' | 'razorpay' | 'paypal';

export interface PaymentOrder {
  orderId: string;
  gateway: PaymentGateway;
  planId: string;
  amount: number;
  currency: 'INR' | 'USD';
  userId: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
  paymentSessionId?: string;
  checkoutUrl?: string;
  createdAt: string;
}
