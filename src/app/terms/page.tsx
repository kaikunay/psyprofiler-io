import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Terms & Conditions — PSYPROFILER",
  description: "Terms and Conditions governing the use of PsyProfiler.io, the AI-powered psychological intelligence platform by Kunaya Labs.",
};

const toc = [
  { id: "acceptance", label: "1. Acceptance of Terms" },
  { id: "description", label: "2. Service Description" },
  { id: "accounts", label: "3. Account Registration" },
  { id: "subscriptions", label: "4. Subscriptions & Payments" },
  { id: "acceptable-use", label: "5. Acceptable Use" },
  { id: "prohibited", label: "6. Prohibited Uses" },
  { id: "ai-disclaimer", label: "7. AI-Generated Content" },
  { id: "data-handling", label: "8. Data Handling & Processing" },
  { id: "ip", label: "9. Intellectual Property" },
  { id: "liability", label: "10. Limitation of Liability" },
  { id: "indemnification", label: "11. Indemnification" },
  { id: "termination", label: "12. Termination" },
  { id: "governing-law", label: "13. Governing Law" },
  { id: "modifications", label: "14. Modifications" },
  { id: "contact", label: "15. Contact Information" },
];

export default function TermsPage() {
  return (
    <LegalLayout
      title="TERMS & CONDITIONS"
      subtitle="By accessing or using PsyProfiler.io, you agree to be bound by these Terms. Please read them carefully before using our services."
      lastUpdated="8 APRIL 2026"
      toc={toc}
    >
      <div className="space-y-10">
        {/* Section 1 */}
        <section id="acceptance" className="legal-section">
          <h2 className="legal-heading">1. ACCEPTANCE OF TERMS</h2>
          <div className="legal-body">
            <p>
              By accessing, browsing, or using the PsyProfiler.io platform (&ldquo;Platform&rdquo;, &ldquo;Service&rdquo;), operated by Kunaya Labs (&ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), a registered Micro, Small & Medium Enterprise (MSME) under the Government of India, you (&ldquo;User&rdquo;, &ldquo;you&rdquo;, &ldquo;your&rdquo;) agree to be bound by these Terms and Conditions (&ldquo;Terms&rdquo;).
            </p>
            <p>
              If you do not agree to all of these Terms, you must immediately discontinue use of the Service. Your continued use of the Platform constitutes acceptance of these Terms and any amendments thereto.
            </p>
            <p>
              These Terms are a legally binding agreement between you and Kunaya Labs, governed by the laws of India, as further described in Section 13.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section id="description" className="legal-section">
          <h2 className="legal-heading">2. SERVICE DESCRIPTION</h2>
          <div className="legal-body">
            <p>
              <strong className="text-ink">2.1</strong> PsyProfiler.io is an AI-powered psychological profiling and behavioral intelligence platform that generates comprehensive personality analysis reports based on publicly available social media data, user-provided questionnaires, and voluntary data submissions.
            </p>
            <p>
              <strong className="text-ink">2.2</strong> The Platform utilizes a multi-agent artificial intelligence system incorporating the following psychological frameworks: Big Five (OCEAN), HEXACO, Dark Triad, D-Factor, Attachment Theory, Jungian Archetypes, RIASEC Holland Codes, Motivational Architecture, and ASIX (Artificial Spiritual Intelligence) Vedic consciousness layer.
            </p>
            <p>
              <strong className="text-ink">2.3</strong> The Service is a <strong className="text-gold">decision-support tool</strong>, NOT a decision-maker. All outputs are AI-generated behavioral pattern analyses of publicly available digital footprints and should never be treated as clinical diagnoses, medical assessments, or definitive character evaluations.
            </p>
            <p>
              <strong className="text-ink">2.4</strong> Reports are generated using Google Gemini AI models and are delivered as downloadable PDF documents through the Platform.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section id="accounts" className="legal-section">
          <h2 className="legal-heading">3. ACCOUNT REGISTRATION</h2>
          <div className="legal-body">
            <p>
              <strong className="text-ink">3.1</strong> To use certain features of the Service, you must create an account. You agree to provide accurate, current, and complete information during registration and to keep your account information updated.
            </p>
            <p>
              <strong className="text-ink">3.2</strong> You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
            <p>
              <strong className="text-ink">3.3</strong> You must be at least 16 years of age to create an account and use the Service. By registering, you represent and warrant that you are at least 16 years old.
            </p>
            <p>
              <strong className="text-ink">3.4</strong> One user account per individual or organization. Account sharing, resale, or transfer is prohibited without prior written consent from Kunaya Labs.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section id="subscriptions" className="legal-section">
          <h2 className="legal-heading">4. SUBSCRIPTIONS & PAYMENTS</h2>
          <div className="legal-body">
            <p>
              <strong className="text-ink">4.1 Pricing Tiers.</strong> The Service is offered in the following tiers:
            </p>
            <ul>
              <li><strong className="text-violet-200">Operative (Level 01):</strong> ₹4,999/month — 15 deep analyses, OCEAN + Dark Triad profiling, PDF report delivery, email support.</li>
              <li><strong className="text-violet-200">Intelligence Firm (Level 02):</strong> ₹9,999/month — 60 analyses, team dashboard, API + webhook integration, priority support (24h).</li>
              <li><strong className="text-violet-200">Classified Partner (Level 03):</strong> ₹59,999/month — 250 analyses, white-label option, dedicated account manager, on-premise available.</li>
              <li><strong className="text-violet-200">Ad-Hoc Report:</strong> ₹750 per single intelligence report.</li>
            </ul>
            <p>
              <strong className="text-ink">4.2</strong> All prices are listed in Indian Rupees (₹ INR) and are inclusive of applicable Goods and Services Tax (GST) at 18%.
            </p>
            <p>
              <strong className="text-ink">4.3</strong> Payments are processed through Cashfree and/or Razorpay payment gateways. Your payment information is handled directly by these PCI-DSS compliant payment processors. Kunaya Labs does not store your credit/debit card details.
            </p>
            <p>
              <strong className="text-ink">4.4</strong> Monthly subscriptions auto-renew at the end of each billing cycle unless cancelled. You may cancel your subscription at any time from your account settings. See our <a href="/refund" className="text-violet-400 hover:text-violet-200 underline underline-offset-4">Refund Policy</a> for details on cancellations and refunds.
            </p>
            <p>
              <strong className="text-ink">4.5</strong> Kunaya Labs reserves the right to modify pricing with 30 days&apos; advance notice. Existing subscribers will be notified via email before any price changes take effect on their accounts.
            </p>
          </div>
        </section>

        {/* Section 5 */}
        <section id="acceptable-use" className="legal-section">
          <h2 className="legal-heading">5. ACCEPTABLE USE</h2>
          <div className="legal-body">
            <p>
              <strong className="text-ink">5.1</strong> The Service may ONLY be used to analyze:
            </p>
            <ul>
              <li>(a) Publicly available social media data</li>
              <li>(b) Data voluntarily provided by the subject (e.g., resume submitted for a job application, self-assessment questionnaires)</li>
              <li>(c) Data where the user has a lawful basis to process under applicable data protection laws</li>
            </ul>
            <p>
              <strong className="text-ink">5.2</strong> User acknowledges that the Service analyzes <strong className="text-gold">PUBLIC ONLINE PERSONAS</strong> and does NOT provide clinical psychological assessments, medical diagnoses, or definitive character evaluations.
            </p>
            <p>
              <strong className="text-ink">5.3</strong> Before initiating any analysis, you must confirm that you have a lawful basis for processing the subject&apos;s data and that the analysis complies with all applicable laws in your jurisdiction.
            </p>
          </div>
        </section>

        {/* Section 6 */}
        <section id="prohibited" className="legal-section">
          <h2 className="legal-heading">6. PROHIBITED USES</h2>
          <div className="legal-body">
            <div className="glass border-danger/30 bg-danger/5 p-4 mb-4">
              <p className="font-mono text-[10px] tracking-[0.18em] text-danger mb-2">⚠ THE FOLLOWING USES ARE STRICTLY PROHIBITED</p>
              <p className="text-muted text-sm">Violation of this section results in immediate account termination with no refund and may result in legal action.</p>
            </div>
            <ul>
              <li><strong className="text-ink">6.1</strong> Making sole hiring, rejection, or termination decisions based exclusively on report outputs.</li>
              <li><strong className="text-ink">6.2</strong> Discrimination on the basis of race, gender, age, religion, disability, sexual orientation, national origin, caste, or any other protected class under the Indian Constitution or applicable laws.</li>
              <li><strong className="text-ink">6.3</strong> Stalking, harassment, intimidation, doxxing, or any form of unauthorized surveillance.</li>
              <li><strong className="text-ink">6.4</strong> Analyzing private or non-public data without the subject&apos;s explicit consent.</li>
              <li><strong className="text-ink">6.5</strong> Processing data of persons under 16 years of age.</li>
              <li><strong className="text-ink">6.6</strong> Using the Service for law enforcement, criminal profiling, or national security purposes without proper legal authorization.</li>
              <li><strong className="text-ink">6.7</strong> Creating &ldquo;social scores&rdquo; or credit-worthiness assessments as defined by the EU AI Act or similar legislation.</li>
              <li><strong className="text-ink">6.8</strong> Any use that violates applicable GDPR, CCPA, DPDPA (Digital Personal Data Protection Act, 2023), or other data protection regulations.</li>
              <li><strong className="text-ink">6.9</strong> Reverse-engineering, decompiling, or attempting to extract the underlying AI models, prompt engineering methodology, or proprietary algorithms.</li>
              <li><strong className="text-ink">6.10</strong> Using the Service to generate misleading, defamatory, or false information about any individual.</li>
            </ul>
          </div>
        </section>

        {/* Section 7 */}
        <section id="ai-disclaimer" className="legal-section">
          <h2 className="legal-heading">7. AI-GENERATED CONTENT DISCLAIMER</h2>
          <div className="legal-body">
            <div className="glass border-gold/30 bg-gold/5 p-4 mb-4">
              <p className="font-mono text-[10px] tracking-[0.18em] text-gold mb-2">⚡ IMPORTANT DISCLOSURE</p>
              <p className="text-muted text-sm">All report content is generated by artificial intelligence. Read this section carefully.</p>
            </div>
            <p>
              <strong className="text-ink">7.1</strong> ALL report content is generated by artificial intelligence (Google Gemini models). AI outputs:
            </p>
            <ul>
              <li>(a) May contain errors, fabrications, hallucinations, or misinterpretations</li>
              <li>(b) Are based on pattern recognition and statistical correlation, not clinical methodology</li>
              <li>(c) Should NEVER be the sole basis for any decision affecting a person&apos;s rights, livelihood, or well-being</li>
            </ul>
            <p>
              <strong className="text-ink">7.2</strong> Kunaya Labs makes NO WARRANTY regarding the accuracy, completeness, or reliability of AI-generated reports.
            </p>
            <p>
              <strong className="text-ink">7.3</strong> Report scores are INDICATIVE RANGES, not precise measurements. Scores may vary ±10 points between analyses of the same subject due to the non-deterministic nature of AI models.
            </p>
            <p>
              <strong className="text-ink">7.4</strong> Dark Triad and personality disorder indicators are behavioral PATTERNS observed in digital footprints, NOT clinical diagnoses. &ldquo;Elevated&rdquo; scores do not mean the subject has the trait — they indicate behavioral patterns consistent with such traits in public data.
            </p>
          </div>
        </section>

        {/* Section 8 */}
        <section id="data-handling" className="legal-section">
          <h2 className="legal-heading">8. DATA HANDLING & PROCESSING</h2>
          <div className="legal-body">
            <p>
              <strong className="text-ink">8.1</strong> Kunaya Labs processes data as both Data Controller (for user account data) and Data Processor (for analysis subject data) as defined under the Digital Personal Data Protection Act, 2023 (DPDPA).
            </p>
            <p>
              <strong className="text-ink">8.2</strong> Data collected and processed includes:
            </p>
            <ul>
              <li>(a) User account information (name, email, payment records)</li>
              <li>(b) Publicly available social media data of analysis subjects</li>
              <li>(c) Questionnaire responses provided by users or subjects</li>
              <li>(d) Generated reports and analysis outputs</li>
            </ul>
            <p>
              <strong className="text-ink">8.3</strong> Data retention: Analysis input data is automatically purged within 30 days of report delivery. Generated reports are retained in your account for the duration of your subscription. Upon account deletion, all data is permanently purged within 90 days.
            </p>
            <p>
              <strong className="text-ink">8.4</strong> For full details on our data practices, see our <a href="/privacy" className="text-violet-400 hover:text-violet-200 underline underline-offset-4">Privacy Policy</a>.
            </p>
          </div>
        </section>

        {/* Section 9 */}
        <section id="ip" className="legal-section">
          <h2 className="legal-heading">9. INTELLECTUAL PROPERTY</h2>
          <div className="legal-body">
            <p>
              <strong className="text-ink">9.1</strong> The Platform, including its multi-agent architecture, prompt engineering methodology, agent personas, psychological framework integrations, ASIX layer, report templates, UI design, and all related intellectual property, are the exclusive property of Kunaya Labs.
            </p>
            <p>
              <strong className="text-ink">9.2</strong> Generated reports belong to the User who commissioned them. Kunaya Labs claims no ownership over the content of individual reports.
            </p>
            <p>
              <strong className="text-ink">9.3</strong> The Kunaya Labs and PsyProfiler names, logos, and brand elements may NOT be removed from generated reports unless the User has purchased the Classified Partner tier with white-label rights.
            </p>
            <p>
              <strong className="text-ink">9.4</strong> Users are granted a limited, non-exclusive, non-transferable license to use the Service and share generated reports for their intended purpose. This license does not extend to the underlying technology, algorithms, or methodology.
            </p>
          </div>
        </section>

        {/* Section 10 */}
        <section id="liability" className="legal-section">
          <h2 className="legal-heading">10. LIMITATION OF LIABILITY</h2>
          <div className="legal-body">
            <p>
              <strong className="text-ink">10.1</strong> TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, INCLUDING THE INDIAN CONTRACT ACT, 1872, KUNAYA LABS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM THE USE OF THE SERVICE.
            </p>
            <p>
              <strong className="text-ink">10.2</strong> KUNAYA LABS&apos; TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS ARISING FROM OR RELATED TO THE SERVICE SHALL NOT EXCEED THE AMOUNT PAID BY THE USER TO KUNAYA LABS IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
            </p>
            <p>
              <strong className="text-ink">10.3</strong> KUNAYA LABS IS NOT LIABLE FOR:
            </p>
            <ul>
              <li>(a) Decisions made based on AI-generated reports</li>
              <li>(b) Actions taken against profiled individuals based on report content</li>
              <li>(c) Third-party API or service failures</li>
              <li>(d) Inaccurate, incomplete, or misleading AI outputs</li>
              <li>(e) Unauthorized access to your account due to your failure to maintain credential security</li>
              <li>(f) Loss of data beyond our stated retention period</li>
            </ul>
          </div>
        </section>

        {/* Section 11 */}
        <section id="indemnification" className="legal-section">
          <h2 className="legal-heading">11. INDEMNIFICATION</h2>
          <div className="legal-body">
            <p>
              <strong className="text-ink">11.1</strong> You agree to indemnify and hold harmless Kunaya Labs, its founder, employees, agents, and affiliates from any claims, damages, losses, liabilities, costs, and expenses (including reasonable legal fees) arising from or related to:
            </p>
            <ul>
              <li>(a) Your violation of these Terms</li>
              <li>(b) Your violation of any third-party rights</li>
              <li>(c) Your violation of any applicable law or regulation</li>
              <li>(d) Your misuse of AI-generated reports</li>
              <li>(e) Any unauthorized profiling activities conducted through your account</li>
              <li>(f) Content or data you submit through the Service</li>
            </ul>
          </div>
        </section>

        {/* Section 12 */}
        <section id="termination" className="legal-section">
          <h2 className="legal-heading">12. TERMINATION</h2>
          <div className="legal-body">
            <p>
              <strong className="text-ink">12.1</strong> Kunaya Labs may terminate or suspend your account immediately, without prior notice, if you violate these Terms — particularly the Prohibited Uses in Section 6.
            </p>
            <p>
              <strong className="text-ink">12.2</strong> You may terminate your account at any time by contacting support@psyprofiler.io. Termination does not entitle you to a refund except as outlined in our <a href="/refund" className="text-violet-400 hover:text-violet-200 underline underline-offset-4">Refund Policy</a>.
            </p>
            <p>
              <strong className="text-ink">12.3</strong> Upon termination, your right to access the Service ceases immediately. Data will be handled as described in Section 8.3.
            </p>
          </div>
        </section>

        {/* Section 13 */}
        <section id="governing-law" className="legal-section">
          <h2 className="legal-heading">13. GOVERNING LAW & DISPUTE RESOLUTION</h2>
          <div className="legal-body">
            <p>
              <strong className="text-ink">13.1</strong> These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
            </p>
            <p>
              <strong className="text-ink">13.2</strong> Any disputes arising out of or in connection with these Terms shall first be attempted to be resolved through good-faith mediation within 30 days of the dispute arising.
            </p>
            <p>
              <strong className="text-ink">13.3</strong> If mediation fails, any legal proceedings shall be subject to the exclusive jurisdiction of the courts in Nagpur, Maharashtra, India.
            </p>
            <p>
              <strong className="text-ink">13.4</strong> For international users subject to GDPR, you retain your rights under the GDPR, and nothing in these Terms limits those rights.
            </p>
          </div>
        </section>

        {/* Section 14 */}
        <section id="modifications" className="legal-section">
          <h2 className="legal-heading">14. MODIFICATIONS TO TERMS</h2>
          <div className="legal-body">
            <p>
              <strong className="text-ink">14.1</strong> Kunaya Labs reserves the right to modify these Terms at any time. Material changes will be communicated via email to registered users at least 30 days before they take effect.
            </p>
            <p>
              <strong className="text-ink">14.2</strong> Your continued use of the Service after the effective date of modified Terms constitutes acceptance of the updated Terms.
            </p>
            <p>
              <strong className="text-ink">14.3</strong> The &ldquo;Last Updated&rdquo; date at the top of this page reflects the date of the most recent modifications.
            </p>
          </div>
        </section>

        {/* Section 15 */}
        <section id="contact" className="legal-section">
          <h2 className="legal-heading">15. CONTACT INFORMATION</h2>
          <div className="legal-body">
            <div className="glass p-6 space-y-3">
              <p className="font-mono text-[10px] tracking-[0.18em] text-gold">KUNAYA LABS — LEGAL DEPARTMENT</p>
              <p><strong className="text-ink">Business:</strong> Kunaya Labs (MSME Certified)</p>
              <p><strong className="text-ink">Address:</strong> Bhandara, Maharashtra 441904, India</p>
              <p><strong className="text-ink">Email:</strong> <a href="mailto:legal@psyprofiler.io" className="text-violet-400 hover:text-violet-200">legal@psyprofiler.io</a></p>
              <p><strong className="text-ink">Support:</strong> <a href="mailto:support@psyprofiler.io" className="text-violet-400 hover:text-violet-200">support@psyprofiler.io</a></p>
              <p><strong className="text-ink">Grievance Officer:</strong> Kunal Shahare — <a href="mailto:grievance@psyprofiler.io" className="text-violet-400 hover:text-violet-200">grievance@psyprofiler.io</a></p>
              <p className="font-mono text-[10px] text-dim mt-4">For data protection inquiries under DPDPA 2023, contact the Grievance Officer above.</p>
            </div>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
}
