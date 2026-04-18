'use client';

/**
 * ═══════════════════════════════════════════════════════════════
 * PURCHASE MODAL — Credit Purchase UI
 * ═══════════════════════════════════════════════════════════════
 * 
 * Premium credit purchase experience with triple gateway support:
 * - Cashfree (INR primary)
 * - Razorpay (INR backup)
 * - PayPal (international USD)
 */

import React, { useState } from 'react';
import { CREDIT_PLANS, type CreditPlan, type PaymentGateway } from '@/lib/payments/config';
import { useAuth } from '@/context/AuthContext';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (credits: number) => void;
}

// ── Gateway Configurations ────────────────────────────────────

const GATEWAYS: { id: PaymentGateway; name: string; icon: string; currencies: string }[] = [
  { id: 'cashfree', name: 'Cashfree', icon: '🏦', currencies: 'INR' },
  { id: 'razorpay', name: 'Razorpay', icon: '⚡', currencies: 'INR (UPI/Cards)' },
  { id: 'paypal', name: 'PayPal', icon: '🌐', currencies: 'USD (International)' },
];

export default function PurchaseModal({ isOpen, onClose, onSuccess }: PurchaseModalProps) {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<CreditPlan | null>(null);
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>('cashfree');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'plans' | 'gateway' | 'processing'>('plans');

  if (!isOpen) return null;

  // ── Payment Handlers ────────────────────────────────────────

  const handleSelectPlan = (plan: CreditPlan) => {
    setSelectedPlan(plan);
    setStep('gateway');
    setError(null);
  };

  const handlePayment = async () => {
    if (!selectedPlan || !user) return;
    
    setIsProcessing(true);
    setError(null);
    setStep('processing');

    try {
      const { createOrder } = await import('@/lib/api');
      const data = await createOrder({
        tier: selectedPlan.id as 'personal' | 'pro' | 'organization' | 'adhoc',
        email: user.email,
        gateway: selectedGateway,
      });

      if (selectedGateway === 'razorpay') {
        // Load Razorpay SDK dynamically
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        document.body.appendChild(script);
        
        await new Promise(resolve => { script.onload = resolve; });
        
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_SeWtXeZ4mEpi7y',
          amount: data.amount,
          currency: 'INR',
          name: 'PsyProfiler.io',
          description: `${selectedPlan.name} Plan - ${selectedPlan.credits} Credits`,
          order_id: data.order_id,
          prefill: {
            email: user.email,
            name: user.name,
          },
          theme: { color: '#a855f7' },
          handler: async (response: any) => {
            console.log('[RAZORPAY] Payment success:', response);
            setIsProcessing(true);
            try {
              const res = await fetch('/api/payments/razorpay-verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  ...response,
                  planId: selectedPlan.id,
                  userId: user.id || user.email,
                }),
              });
              
              if (!res.ok) throw new Error('Verification failed');
              
              onSuccess?.(selectedPlan.credits);
              onClose();
            } catch (e) {
              console.error('Verify error:', e);
              setError('Payment verified but credit assignment failed. Please contact support.');
              setIsProcessing(false);
              setStep('gateway');
            }
          },
          modal: {
            ondismiss: () => {
              setIsProcessing(false);
              setStep('gateway');
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        return; // Don't close modal — Razorpay handles it

      } else if (selectedGateway === 'cashfree') {
        if (!data.payment_session_id) throw new Error("Missing Cashfree Session ID");
        const { load } = await import('@cashfreepayments/cashfree-js');
        const cashfree = await load({ mode: process.env.NEXT_PUBLIC_CASHFREE_ENV === 'PRODUCTION' ? 'production' : 'sandbox' });
        await cashfree.checkout({
          paymentSessionId: data.payment_session_id,
          returnUrl: `${window.location.origin}/dashboard?payment=success&credits=${selectedPlan.credits}`,
        });
      } else if (selectedGateway === 'paypal') {
        if (!data.checkout_url) throw new Error("Missing PayPal Checkout URL");
        window.location.href = data.checkout_url;
        return;
      }

    } catch (err) {
      console.error('[PURCHASE] Payment error:', err);
      setError((err as Error).message || 'Payment initiation failed. Please try again.');
      setStep('gateway');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    if (step === 'gateway') {
      setStep('plans');
      setSelectedPlan(null);
    } else if (step === 'processing') {
      setStep('gateway');
    }
  };

  // ── Render ──────────────────────────────────────────────────

  return (
    <div className="purchase-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="purchase-modal">
        {/* ── Header ────────────────────────────────────── */}
        <div className="purchase-modal__header">
          <div className="purchase-modal__header-content">
            {step !== 'plans' && (
              <button className="purchase-modal__back" onClick={handleBack}>
                ← Back
              </button>
            )}
            <h2 className="purchase-modal__title">
              {step === 'plans' ? '⚡ Upgrade Your Intelligence' : 
               step === 'gateway' ? '💳 Select Payment Method' :
               '🔄 Processing Payment...'}
            </h2>
          </div>
          <button className="purchase-modal__close" onClick={onClose}>✕</button>
        </div>

        {/* ── Step 1: Plan Selection ─────────────────────── */}
        {step === 'plans' && (
          <div className="purchase-modal__plans">
            {CREDIT_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`plan-card ${plan.popular ? 'plan-card--popular' : ''}`}
                onClick={() => handleSelectPlan(plan)}
              >
                {plan.badge && (
                  <span className="plan-card__badge">{plan.badge}</span>
                )}
                <h3 className="plan-card__name">{plan.name}</h3>
                <div className="plan-card__price">
                  <span className="plan-card__currency">₹</span>
                  <span className="plan-card__amount">{plan.priceINR.toLocaleString('en-IN')}</span>
                </div>
                <p className="plan-card__credits">{plan.credits} credits</p>
                <p className="plan-card__description">{plan.description}</p>
                <ul className="plan-card__features">
                  {plan.features.map((f, i) => (
                    <li key={i}>✓ {f}</li>
                  ))}
                </ul>
                <button className="plan-card__select">Select Plan →</button>
              </div>
            ))}
          </div>
        )}

        {/* ── Step 2: Gateway Selection ──────────────────── */}
        {step === 'gateway' && selectedPlan && (
          <div className="purchase-modal__gateway">
            <div className="gateway-summary">
              <h3>{selectedPlan.name} Plan</h3>
              <p className="gateway-summary__price">
                ₹{selectedPlan.priceINR.toLocaleString('en-IN')} 
                <span className="gateway-summary__usd"> / ${selectedPlan.priceUSD}</span>
              </p>
              <p className="gateway-summary__credits">{selectedPlan.credits} intelligence credits</p>
            </div>

            <div className="gateway-options">
              {GATEWAYS.map((gw) => (
                <button
                  key={gw.id}
                  className={`gateway-btn ${selectedGateway === gw.id ? 'gateway-btn--active' : ''}`}
                  onClick={() => setSelectedGateway(gw.id)}
                >
                  <span className="gateway-btn__icon">{gw.icon}</span>
                  <span className="gateway-btn__name">{gw.name}</span>
                  <span className="gateway-btn__currencies">{gw.currencies}</span>
                </button>
              ))}
            </div>

            {error && (
              <div className="purchase-modal__error">
                ⚠️ {error}
              </div>
            )}

            <button
              className="purchase-modal__pay-btn"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : `Pay with ${GATEWAYS.find(g => g.id === selectedGateway)?.name}`}
            </button>
          </div>
        )}

        {/* ── Step 3: Processing ─────────────────────────── */}
        {step === 'processing' && (
          <div className="purchase-modal__processing">
            <div className="processing-spinner" />
            <p>Connecting to payment gateway...</p>
            <p className="processing-note">Do not close this window.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .purchase-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .purchase-modal {
          background: linear-gradient(145deg, #1a1028, #0d0a14);
          border: 1px solid rgba(168, 85, 247, 0.2);
          border-radius: 20px;
          width: 100%;
          max-width: 900px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(168, 85, 247, 0.1);
        }

        .purchase-modal__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid rgba(168, 85, 247, 0.1);
        }

        .purchase-modal__header-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .purchase-modal__back {
          background: rgba(168, 85, 247, 0.1);
          border: 1px solid rgba(168, 85, 247, 0.3);
          color: #c4b5fd;
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.2s;
        }

        .purchase-modal__back:hover {
          background: rgba(168, 85, 247, 0.2);
        }

        .purchase-modal__title {
          color: #f3f0ff;
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0;
        }

        .purchase-modal__close {
          background: rgba(255, 255, 255, 0.05);
          border: none;
          color: #a0a0a0;
          font-size: 1.25rem;
          cursor: pointer;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .purchase-modal__close:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        /* ── Plans Grid ──────────────────────────────────── */

        .purchase-modal__plans {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          padding: 1.5rem 2rem 2rem;
        }

        .plan-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(168, 85, 247, 0.15);
          border-radius: 16px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .plan-card:hover {
          border-color: rgba(168, 85, 247, 0.5);
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(168, 85, 247, 0.15);
        }

        .plan-card--popular {
          border-color: rgba(168, 85, 247, 0.4);
          background: rgba(168, 85, 247, 0.05);
        }

        .plan-card__badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: linear-gradient(135deg, #a855f7, #7c3aed);
          color: white;
          padding: 0.2rem 0.6rem;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .plan-card__name {
          color: #e2d8f5;
          font-size: 1.1rem;
          font-weight: 700;
          margin: 0 0 0.75rem;
        }

        .plan-card__price {
          display: flex;
          align-items: baseline;
          gap: 2px;
          margin-bottom: 0.25rem;
        }

        .plan-card__currency {
          color: #a855f7;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .plan-card__amount {
          color: #f3f0ff;
          font-size: 2rem;
          font-weight: 800;
          line-height: 1;
        }

        .plan-card__credits {
          color: #a78bfa;
          font-size: 0.9rem;
          margin: 0.25rem 0 0.75rem;
          font-weight: 500;
        }

        .plan-card__description {
          color: #8b7fa8;
          font-size: 0.8rem;
          margin: 0 0 1rem;
          line-height: 1.4;
        }

        .plan-card__features {
          list-style: none;
          padding: 0;
          margin: 0 0 1.25rem;
        }

        .plan-card__features li {
          color: #b8a8d0;
          font-size: 0.78rem;
          padding: 0.3rem 0;
          border-bottom: 1px solid rgba(168, 85, 247, 0.05);
        }

        .plan-card__select {
          width: 100%;
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(124, 58, 237, 0.2));
          border: 1px solid rgba(168, 85, 247, 0.3);
          color: #c4b5fd;
          padding: 0.6rem;
          border-radius: 10px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 600;
          transition: all 0.3s;
        }

        .plan-card__select:hover {
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(124, 58, 237, 0.3));
          color: #f3f0ff;
        }

        /* ── Gateway Selection ───────────────────────────── */

        .purchase-modal__gateway {
          padding: 1.5rem 2rem 2rem;
        }

        .gateway-summary {
          text-align: center;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(168, 85, 247, 0.1);
          margin-bottom: 1.5rem;
        }

        .gateway-summary h3 {
          color: #e2d8f5;
          font-size: 1.2rem;
          margin: 0 0 0.5rem;
        }

        .gateway-summary__price {
          color: #a855f7;
          font-size: 1.8rem;
          font-weight: 800;
          margin: 0;
        }

        .gateway-summary__usd {
          color: #7c6c94;
          font-size: 0.9rem;
          font-weight: 400;
        }

        .gateway-summary__credits {
          color: #8b7fa8;
          font-size: 0.9rem;
          margin: 0.25rem 0 0;
        }

        .gateway-options {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .gateway-btn {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.25rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(168, 85, 247, 0.15);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          width: 100%;
        }

        .gateway-btn:hover {
          background: rgba(168, 85, 247, 0.05);
          border-color: rgba(168, 85, 247, 0.3);
        }

        .gateway-btn--active {
          background: rgba(168, 85, 247, 0.1);
          border-color: #a855f7;
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.1);
        }

        .gateway-btn__icon {
          font-size: 1.5rem;
        }

        .gateway-btn__name {
          color: #e2d8f5;
          font-weight: 600;
          font-size: 1rem;
        }

        .gateway-btn__currencies {
          color: #7c6c94;
          font-size: 0.8rem;
          margin-left: auto;
        }

        .purchase-modal__error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          margin-bottom: 1rem;
          font-size: 0.85rem;
        }

        .purchase-modal__pay-btn {
          width: 100%;
          background: linear-gradient(135deg, #a855f7, #7c3aed);
          border: none;
          color: white;
          padding: 1rem;
          border-radius: 12px;
          font-size: 1.05rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(168, 85, 247, 0.3);
        }

        .purchase-modal__pay-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(168, 85, 247, 0.4);
        }

        .purchase-modal__pay-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* ── Processing ──────────────────────────────────── */

        .purchase-modal__processing {
          padding: 3rem 2rem;
          text-align: center;
        }

        .processing-spinner {
          width: 48px;
          height: 48px;
          border: 3px solid rgba(168, 85, 247, 0.2);
          border-top-color: #a855f7;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 1.5rem;
        }

        .purchase-modal__processing p {
          color: #c4b5fd;
          font-size: 1rem;
          margin: 0 0 0.5rem;
        }

        .processing-note {
          color: #7c6c94 !important;
          font-size: 0.8rem !important;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .purchase-modal__plans {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
