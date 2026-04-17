declare module '@cashfreepayments/cashfree-js' {
  interface CashfreeInstance {
    checkout(options: {
      paymentSessionId: string;
      returnUrl?: string;
      redirectTarget?: string;
    }): Promise<void>;
  }

  export function load(options: {
    mode: 'sandbox' | 'production';
  }): Promise<CashfreeInstance>;
}
