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
    id: 'adhoc',
    name: 'Single Scan',
    credits: 5,
    priceINR: 750,
    priceUSD: 8.99,
    description: 'One-time ad-hoc intelligence scan',
    features: [
      '5 credits (1 Oracle-depth scan)',
      '3 Scout-depth scans',
      'Full OSINT discovery',
      'PDF export',
    ],
  },
  {
    id: 'personal',
    name: 'Personal',
    credits: 50,
    priceINR: 4999,
    priceUSD: 59.99,
    description: 'For individual researchers & professionals',
    features: [
      '50 credits',
      '10 Oracle-depth scans',
      'Priority rendering',
      'Full OSINT + Dark Triad analysis',
      'PDF & JSON export',
      'Vedic ASIX profiling',
    ],
    popular: true,
    badge: 'Most Popular',
  },
  {
    id: 'team',
    name: 'Team',
    credits: 120,
    priceINR: 9999,
    priceUSD: 119.99,
    description: 'For small teams & agencies',
    features: [
      '120 credits',
      '24 Oracle-depth scans',
      'Priority rendering queue',
      'All analysis types',
      'Team sharing (coming soon)',
      'API access (coming soon)',
    ],
    badge: 'Best Value',
  },
  {
    id: 'organization',
    name: 'Organization',
    credits: 750,
    priceINR: 59999,
    priceUSD: 719.99,
    description: 'For enterprises & large-scale intelligence operations',
    features: [
      '750 credits',
      '150 Oracle-depth scans',
      'Dedicated rendering pool',
      'Custom agent prompts',
      'White-label reporting',
      'SLA & priority support',
      'Superset analytics dashboard',
    ],
    badge: 'Enterprise',
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
