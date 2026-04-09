import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy — PSYPROFILER",
  description: "Refund and cancellation policy for PsyProfiler.io subscriptions and services. Compliant with Indian Consumer Protection Act, 2019.",
};

const toc = [
  { id: "overview", label: "1. Overview" },
  { id: "subscription-cancellation", label: "2. Subscription Cancellation" },
  { id: "refund-eligibility", label: "3. Refund Eligibility" },
  { id: "non-refundable", label: "4. Non-Refundable Items" },
  { id: "refund-process", label: "5. How to Request a Refund" },
  { id: "processing-timeline", label: "6. Processing Timeline" },
  { id: "payment-disputes", label: "7. Payment Disputes" },
  { id: "service-credits", label: "8. Service Credits" },
  { id: "grievance", label: "9. Grievance Redressal" },
  { id: "contact", label: "10. Contact Information" },
];

export default function RefundPage() {
  return (
    <LegalLayout
      title="REFUND & CANCELLATION POLICY"
      subtitle="We want you to be confident in your purchase. This policy outlines our fair approach to refunds and cancellations, compliant with the Indian Consumer Protection Act, 2019."
      lastUpdated="8 APRIL 2026"
      toc={toc}
    >
      <div className="space-y-10">
        {/* Section 1 */}
        <section id="overview" className="legal-section">
          <h2 className="legal-heading">1. OVERVIEW</h2>
          <div className="legal-body">
            <p>
              This Refund & Cancellation Policy (&ldquo;Policy&rdquo;) applies to all subscriptions, ad-hoc purchases, and services offered through PsyProfiler.io, operated by Kunaya Lab.
            </p>
            <p>
              This Policy is issued in compliance with:
            </p>
            <ul>
              <li><strong className="text-violet-200">Consumer Protection Act, 2019</strong> (India) — including e-commerce rules</li>
              <li><strong className="text-violet-200">Consumer Protection (E-Commerce) Rules, 2020</strong></li>
              <li><strong className="text-violet-200">Information Technology Act, 2000</strong></li>
            </ul>
            <p>
              We believe in fair and transparent policies. If you&apos;re not satisfied with our service, we&apos;re committed to making it right.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section id="subscription-cancellation" className="legal-section">
          <h2 className="legal-heading">2. SUBSCRIPTION CANCELLATION</h2>
          <div className="legal-body">
            <p>
              <strong className="text-ink">2.1</strong> You may cancel your monthly subscription at any time from your account settings or by contacting support@psyprofiler.io.
            </p>
            <p>
              <strong className="text-ink">2.2</strong> Upon cancellation:
            </p>
            <ul>
              <li>Your subscription will remain active until the end of your current billing period</li>
              <li>You will retain access to all features until the billing period expires</li>
              <li>No further charges will be applied after the current period ends</li>
              <li>Previously generated reports will remain accessible for 30 days after subscription ends</li>
            </ul>
            <p>
              <strong className="text-ink">2.3</strong> Cancellation does not automatically entitle you to a pro-rata refund for the remaining days in the current billing cycle and is subject to the eligibility criteria in Section 3.
            </p>
            <p>
              <strong className="text-ink">2.4</strong> You may re-subscribe at any time. Previous reports may not be available if they were generated more than 30 days before re-subscription.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section id="refund-eligibility" className="legal-section">
          <h2 className="legal-heading">3. REFUND ELIGIBILITY</h2>
          <div className="legal-body">
            <div className="glass border-success/30 bg-success/5 p-4 mb-4">
              <p className="font-mono text-[10px] tracking-[0.18em] text-success mb-2">✓ ELIGIBLE FOR REFUND</p>
              <p className="text-muted text-sm">The following situations qualify for a full or partial refund.</p>
            </div>

            <h3 className="legal-subheading">3.1 Full Refund (100%)</h3>
            <p>Available within <strong className="text-gold">7 days</strong> of purchase if:</p>
            <ul>
              <li>(a) The Service fails to function as described and documented</li>
              <li>(b) No analyses have been initiated or reports generated under your subscription</li>
              <li>(c) Technical failure on our end prevents report delivery within 24 hours of the estimated delivery time</li>
            </ul>

            <h3 className="legal-subheading">3.2 Partial Refund / Service Credit</h3>
            <p>Available within <strong className="text-gold">14 days</strong> of purchase if:</p>
            <ul>
              <li>(a) A report is delivered but is demonstrably incomplete (missing entire framework sections)</li>
              <li>(b) The analysis quality is significantly below our documented standards due to a platform error (not due to limited public data availability)</li>
              <li>(c) Duplicate charges occur due to payment processing errors (full refund of duplicate amount)</li>
            </ul>

            <h3 className="legal-subheading">3.3 Ad-Hoc Single Report Refund</h3>
            <ul>
              <li><strong className="text-ink">Before processing begins:</strong> Full refund (₹750)</li>
              <li><strong className="text-ink">After processing begins but before delivery:</strong> 50% refund (₹375) or full service credit</li>
              <li><strong className="text-ink">After delivery:</strong> Not eligible for refund (see Section 4)</li>
            </ul>
          </div>
        </section>

        {/* Section 4 */}
        <section id="non-refundable" className="legal-section">
          <h2 className="legal-heading">4. NON-REFUNDABLE ITEMS</h2>
          <div className="legal-body">
            <div className="glass border-danger/30 bg-danger/5 p-4 mb-4">
              <p className="font-mono text-[10px] tracking-[0.18em] text-danger mb-2">✗ NOT ELIGIBLE FOR REFUND</p>
              <p className="text-muted text-sm">The following are not eligible for refunds under any circumstances.</p>
            </div>
            <ul>
              <li><strong className="text-ink">4.1</strong> Reports that have been successfully generated and delivered — as digital services, once consumed, they cannot be &ldquo;returned.&rdquo;</li>
              <li><strong className="text-ink">4.2</strong> Subscriptions after 7 days if any analyses have been initiated.</li>
              <li><strong className="text-ink">4.3</strong> Low-quality results caused by limited public data availability of the analysis subject (e.g., the subject has a private social media profile with no public data).</li>
              <li><strong className="text-ink">4.4</strong> Dissatisfaction with AI-generated analysis content where the system functioned as designed. AI outputs are non-deterministic and vary between analyses.</li>
              <li><strong className="text-ink">4.5</strong> Accounts terminated for violation of our <a href="/terms" className="text-violet-400 hover:text-violet-200 underline underline-offset-4">Terms & Conditions</a>, including prohibited uses.</li>
              <li><strong className="text-ink">4.6</strong> Currency exchange rate differences — refunds are processed in the same currency as the original transaction.</li>
            </ul>
          </div>
        </section>

        {/* Section 5 */}
        <section id="refund-process" className="legal-section">
          <h2 className="legal-heading">5. HOW TO REQUEST A REFUND</h2>
          <div className="legal-body">
            <p>To request a refund, follow these steps:</p>
            <div className="space-y-4 my-4">
              <div className="glass p-4 flex items-start gap-4">
                <span className="font-display font-black text-2xl text-violet-400">01</span>
                <div>
                  <p className="text-ink font-bold">Send a Refund Request Email</p>
                  <p className="text-muted text-sm">Email <a href="mailto:support@psyprofiler.io" className="text-violet-400 hover:text-violet-200">support@psyprofiler.io</a> with the subject line: &ldquo;Refund Request — [Your Account Email]&rdquo;</p>
                </div>
              </div>
              <div className="glass p-4 flex items-start gap-4">
                <span className="font-display font-black text-2xl text-violet-400">02</span>
                <div>
                  <p className="text-ink font-bold">Include Required Information</p>
                  <p className="text-muted text-sm">Transaction ID / Order ID, date of purchase, subscription tier or ad-hoc report details, reason for refund request.</p>
                </div>
              </div>
              <div className="glass p-4 flex items-start gap-4">
                <span className="font-display font-black text-2xl text-violet-400">03</span>
                <div>
                  <p className="text-ink font-bold">Review & Resolution</p>
                  <p className="text-muted text-sm">Our team will review your request within 48 hours and respond with a decision. If approved, refund processing begins immediately.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6 */}
        <section id="processing-timeline" className="legal-section">
          <h2 className="legal-heading">6. PROCESSING TIMELINE</h2>
          <div className="legal-body">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-violet-500/20">
                    <th className="text-left py-2 pr-4 font-mono text-[10px] tracking-widest text-gold">STAGE</th>
                    <th className="text-left py-2 font-mono text-[10px] tracking-widest text-gold">TIMELINE</th>
                  </tr>
                </thead>
                <tbody className="text-muted">
                  <tr className="border-b border-violet-500/10">
                    <td className="py-2 pr-4 text-ink">Request Acknowledgment</td>
                    <td className="py-2">Within 48 hours</td>
                  </tr>
                  <tr className="border-b border-violet-500/10">
                    <td className="py-2 pr-4 text-ink">Review & Decision</td>
                    <td className="py-2">3–5 business days</td>
                  </tr>
                  <tr className="border-b border-violet-500/10">
                    <td className="py-2 pr-4 text-ink">Refund Initiation</td>
                    <td className="py-2">Within 48 hours of approval</td>
                  </tr>
                  <tr className="border-b border-violet-500/10">
                    <td className="py-2 pr-4 text-ink">Credit to Bank/Card</td>
                    <td className="py-2">5–7 business days (depends on bank)</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 text-ink font-bold">Total Maximum</td>
                    <td className="py-2 font-bold text-ink">15 business days</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4">
              Refunds are processed to the original payment method used for the transaction. UPI refunds are typically faster (1–3 business days). Credit/debit card refunds may take 5–7 business days to reflect in your statement.
            </p>
          </div>
        </section>

        {/* Section 7 */}
        <section id="payment-disputes" className="legal-section">
          <h2 className="legal-heading">7. PAYMENT DISPUTES</h2>
          <div className="legal-body">
            <p>
              <strong className="text-ink">7.1</strong> If you believe there has been an unauthorized charge on your account, please contact us immediately at <a href="mailto:support@psyprofiler.io" className="text-violet-400 hover:text-violet-200">support@psyprofiler.io</a>.
            </p>
            <p>
              <strong className="text-ink">7.2</strong> We encourage you to contact us directly before initiating a chargeback with your bank. We are committed to resolving payment disputes promptly and fairly.
            </p>
            <p>
              <strong className="text-ink">7.3</strong> Unauthorized chargebacks (where the service was legitimately used) may result in account suspension.
            </p>
          </div>
        </section>

        {/* Section 8 */}
        <section id="service-credits" className="legal-section">
          <h2 className="legal-heading">8. SERVICE CREDITS</h2>
          <div className="legal-body">
            <p>
              <strong className="text-ink">8.1</strong> In cases where a monetary refund is not applicable, we may offer service credits at our discretion.
            </p>
            <p>
              <strong className="text-ink">8.2</strong> Service credits can be used for future analyses and never expire as long as your account is active.
            </p>
            <p>
              <strong className="text-ink">8.3</strong> Service credits are non-transferable and have no cash value.
            </p>
          </div>
        </section>

        {/* Section 9 */}
        <section id="grievance" className="legal-section">
          <h2 className="legal-heading">9. GRIEVANCE REDRESSAL</h2>
          <div className="legal-body">
            <p>
              If you are not satisfied with the resolution of your refund request, you may escalate the matter to our Grievance Officer:
            </p>
            <div className="glass p-6 space-y-3 mt-4">
              <p className="font-mono text-[10px] tracking-[0.18em] text-gold">GRIEVANCE OFFICER</p>
              <p><strong className="text-ink">Name:</strong> Kunal Shahare</p>
              <p><strong className="text-ink">Email:</strong> <a href="mailto:grievance@psyprofiler.io" className="text-violet-400 hover:text-violet-200">grievance@psyprofiler.io</a></p>
              <p><strong className="text-ink">Response Time:</strong> Within 48 hours of acknowledgement</p>
              <p><strong className="text-ink">Resolution Time:</strong> Within 30 days</p>
            </div>
            <p className="mt-4">
              If the grievance remains unresolved, you may file a complaint with the <strong className="text-ink">National Consumer Helpline</strong> (NCH) at 1800-11-4000 or the appropriate Consumer Forum under the Consumer Protection Act, 2019.
            </p>
          </div>
        </section>

        {/* Section 10 */}
        <section id="contact" className="legal-section">
          <h2 className="legal-heading">10. CONTACT INFORMATION</h2>
          <div className="legal-body">
            <div className="glass p-6 space-y-3">
              <p className="font-mono text-[10px] tracking-[0.18em] text-gold">KUNAYA LABS — BILLING & SUPPORT</p>
              <p><strong className="text-ink">Refund Requests:</strong> <a href="mailto:support@psyprofiler.io" className="text-violet-400 hover:text-violet-200">support@psyprofiler.io</a></p>
              <p><strong className="text-ink">Billing Inquiries:</strong> <a href="mailto:billing@psyprofiler.io" className="text-violet-400 hover:text-violet-200">billing@psyprofiler.io</a></p>
              <p><strong className="text-ink">Escalation:</strong> <a href="mailto:grievance@psyprofiler.io" className="text-violet-400 hover:text-violet-200">grievance@psyprofiler.io</a></p>
              <p><strong className="text-ink">Address:</strong> Kunaya Lab, Bhandara, Maharashtra 441904, India</p>
            </div>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
}
