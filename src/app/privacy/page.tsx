import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy — PSYPROFILER",
  description: "Privacy Policy for PsyProfiler.io detailing data collection, processing, retention, and your rights under DPDPA 2023, GDPR, and applicable data protection laws.",
};

const toc = [
  { id: "overview", label: "1. Overview" },
  { id: "information-collected", label: "2. Information We Collect" },
  { id: "how-we-use", label: "3. How We Use Information" },
  { id: "data-processing", label: "4. AI Data Processing" },
  { id: "third-party", label: "5. Third-Party Services" },
  { id: "data-retention", label: "6. Data Retention & Deletion" },
  { id: "data-security", label: "7. Data Security" },
  { id: "your-rights", label: "8. Your Rights" },
  { id: "cookies", label: "9. Cookies & Tracking" },
  { id: "children", label: "10. Children's Privacy" },
  { id: "international", label: "11. International Transfers" },
  { id: "grievance", label: "12. Grievance Officer" },
  { id: "changes", label: "13. Changes to This Policy" },
  { id: "contact", label: "14. Contact Us" },
];

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="PRIVACY POLICY"
      subtitle="Your privacy is classified intel — we protect it like state secrets. This policy explains exactly what data we collect, how we process it, and your rights under Indian and international data protection laws."
      lastUpdated="8 APRIL 2026"
      toc={toc}
    >
      <div className="space-y-10">
        {/* Section 1 */}
        <section id="overview" className="legal-section">
          <h2 className="legal-heading">1. OVERVIEW</h2>
          <div className="legal-body">
            <p>
              Kunaya Labs (&ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), a registered MSME operating PsyProfiler.io (&ldquo;Platform&rdquo;, &ldquo;Service&rdquo;), is committed to protecting your personal data.
            </p>
            <p>
              This Privacy Policy is issued in compliance with:
            </p>
            <ul>
              <li><strong className="text-violet-200">Digital Personal Data Protection Act, 2023 (DPDPA)</strong> — India&apos;s primary data protection legislation</li>
              <li><strong className="text-violet-200">Information Technology Act, 2000</strong> and IT (Reasonable Security Practices) Rules, 2011</li>
              <li><strong className="text-violet-200">General Data Protection Regulation (GDPR)</strong> — for users in the European Economic Area</li>
              <li><strong className="text-violet-200">California Consumer Privacy Act (CCPA)</strong> — for users in California, USA</li>
            </ul>
            <p>
              Kunaya Labs acts as the <strong className="text-gold">Data Fiduciary</strong> (Data Controller under GDPR terminology) for personal data processed through the Platform.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section id="information-collected" className="legal-section">
          <h2 className="legal-heading">2. INFORMATION WE COLLECT</h2>
          <div className="legal-body">
            <h3 className="legal-subheading">2.1 Account Data (Directly from You)</h3>
            <ul>
              <li>Full name and email address during registration</li>
              <li>Payment information (processed via Cashfree/Razorpay — we do NOT store card details)</li>
              <li>Subscription tier and transaction history</li>
              <li>Communication records (support emails, contact form submissions)</li>
            </ul>

            <h3 className="legal-subheading">2.2 Analysis Subject Data</h3>
            <ul>
              <li>Social media profile URLs submitted by you for analysis</li>
              <li>Publicly available social media content (posts, bios, engagement patterns, images, tags)</li>
              <li>Questionnaire responses (when subjects self-submit)</li>
              <li>Custom text or image data uploaded by you</li>
            </ul>

            <h3 className="legal-subheading">2.3 Automatically Collected Data</h3>
            <ul>
              <li>IP address and approximate geolocation</li>
              <li>Browser type, device type, operating system</li>
              <li>Pages visited, time spent, referral source</li>
              <li>Cookies and similar tracking technologies (see Section 9)</li>
            </ul>

            <h3 className="legal-subheading">2.4 What We Do NOT Collect</h3>
            <ul>
              <li>Private or direct messages from social media platforms</li>
              <li>Data behind privacy settings or login walls</li>
              <li>Biometric data (fingerprints, facial recognition, voice patterns)</li>
              <li>Financial data of analysis subjects</li>
              <li>Data of persons under 16 years of age</li>
            </ul>
          </div>
        </section>

        {/* Section 3 */}
        <section id="how-we-use" className="legal-section">
          <h2 className="legal-heading">3. HOW WE USE YOUR INFORMATION</h2>
          <div className="legal-body">
            <p>We process personal data for the following purposes:</p>
            <ul>
              <li><strong className="text-ink">Service Delivery:</strong> To generate psychological intelligence reports you request</li>
              <li><strong className="text-ink">Account Management:</strong> To create and maintain your account, process payments, manage subscriptions</li>
              <li><strong className="text-ink">Communication:</strong> To send you report notifications, service updates, security alerts</li>
              <li><strong className="text-ink">Service Improvement:</strong> To analyze aggregate usage patterns and improve our AI models and platform features</li>
              <li><strong className="text-ink">Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes</li>
              <li><strong className="text-ink">Security:</strong> To detect fraud, abuse, and violations of our Terms</li>
            </ul>
            <p>
              <strong className="text-ink">Lawful Basis (DPDPA/GDPR):</strong> We process data based on: (a) your consent (account creation, analysis requests), (b) contractual necessity (service delivery), (c) legal obligations, and (d) legitimate interest (security, fraud prevention, service improvement).
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section id="data-processing" className="legal-section">
          <h2 className="legal-heading">4. AI DATA PROCESSING</h2>
          <div className="legal-body">
            <div className="glass border-gold/30 bg-gold/5 p-4 mb-4">
              <p className="font-mono text-[10px] tracking-[0.18em] text-gold mb-2">⚡ TRANSPARENCY DISCLOSURE — AI PROCESSING</p>
              <p className="text-muted text-sm">Under the EU AI Act and DPDPA transparency requirements, we disclose all AI data processing.</p>
            </div>
            <p>
              <strong className="text-ink">4.1</strong> When you request an analysis, the following occurs:
            </p>
            <ul>
              <li>(a) Subject&apos;s public social media data is collected via automated tools</li>
              <li>(b) Data is processed by our multi-agent AI system (10 specialized AI agents)</li>
              <li>(c) Each agent applies a specific psychological framework to analyze the data</li>
              <li>(d) A synthesis agent combines all analyses into a comprehensive report</li>
              <li>(e) The report is generated as a PDF and made available in your account</li>
            </ul>
            <p>
              <strong className="text-ink">4.2</strong> AI processing involves sending data to Google Vertex AI (Google Cloud Platform) for analysis. Google&apos;s data processing terms apply to this processing. Google does not use your data to train its models.
            </p>
            <p>
              <strong className="text-ink">4.3</strong> Analysis input data is automatically purged from our active systems within 30 days of report delivery.
            </p>
          </div>
        </section>

        {/* Section 5 */}
        <section id="third-party" className="legal-section">
          <h2 className="legal-heading">5. THIRD-PARTY SERVICES</h2>
          <div className="legal-body">
            <p>We use the following third-party services to operate the Platform:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-violet-500/20">
                    <th className="text-left py-2 pr-4 font-mono text-[10px] tracking-widest text-gold">SERVICE</th>
                    <th className="text-left py-2 pr-4 font-mono text-[10px] tracking-widest text-gold">PURPOSE</th>
                    <th className="text-left py-2 font-mono text-[10px] tracking-widest text-gold">DATA SHARED</th>
                  </tr>
                </thead>
                <tbody className="text-muted">
                  <tr className="border-b border-violet-500/10">
                    <td className="py-2 pr-4 text-ink">Google Vertex AI</td>
                    <td className="py-2 pr-4">AI model processing</td>
                    <td className="py-2">Analysis input data</td>
                  </tr>
                  <tr className="border-b border-violet-500/10">
                    <td className="py-2 pr-4 text-ink">Appwrite</td>
                    <td className="py-2 pr-4">Authentication, database, file storage</td>
                    <td className="py-2">Account data, reports</td>
                  </tr>
                  <tr className="border-b border-violet-500/10">
                    <td className="py-2 pr-4 text-ink">Cashfree / Razorpay</td>
                    <td className="py-2 pr-4">Payment processing</td>
                    <td className="py-2">Payment details (PCI-DSS compliant)</td>
                  </tr>
                  <tr className="border-b border-violet-500/10">
                    <td className="py-2 pr-4 text-ink">Cloudflare</td>
                    <td className="py-2 pr-4">CDN, security, DNS</td>
                    <td className="py-2">IP address, traffic data</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4">
              We do NOT sell, rent, or trade your personal data to any third party for marketing purposes.
            </p>
          </div>
        </section>

        {/* Section 6 */}
        <section id="data-retention" className="legal-section">
          <h2 className="legal-heading">6. DATA RETENTION & DELETION</h2>
          <div className="legal-body">
            <ul>
              <li><strong className="text-ink">Account Data:</strong> Retained for the duration of your account + 90 days after deletion</li>
              <li><strong className="text-ink">Analysis Input Data:</strong> Auto-purged within 30 days of report delivery</li>
              <li><strong className="text-ink">Generated Reports:</strong> Retained in your account for the duration of your subscription</li>
              <li><strong className="text-ink">Payment Records:</strong> Retained for 8 years as required by Indian taxation laws (Income Tax Act, GST Act)</li>
              <li><strong className="text-ink">Communication Records:</strong> Retained for 2 years</li>
              <li><strong className="text-ink">Analytics Data:</strong> Anonymized and retained indefinitely for service improvement</li>
            </ul>
            <p>
              Upon account deletion, all personal data is permanently purged within 90 days, except where retention is required by law.
            </p>
          </div>
        </section>

        {/* Section 7 */}
        <section id="data-security" className="legal-section">
          <h2 className="legal-heading">7. DATA SECURITY</h2>
          <div className="legal-body">
            <p>We implement industry-standard security measures including:</p>
            <ul>
              <li>TLS/SSL encryption for all data in transit</li>
              <li>Encryption at rest for stored personal data</li>
              <li>Access controls and authentication for all systems</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Cloudflare Zero Trust for infrastructure protection</li>
              <li>Automated data purging per retention schedule</li>
            </ul>
            <p>
              While we employ robust security measures, no system is 100% secure. In the event of a data breach affecting your personal data, we will notify you within 72 hours as required by DPDPA and GDPR.
            </p>
          </div>
        </section>

        {/* Section 8 */}
        <section id="your-rights" className="legal-section">
          <h2 className="legal-heading">8. YOUR RIGHTS</h2>
          <div className="legal-body">
            <h3 className="legal-subheading">Under DPDPA 2023 (India), you have the right to:</h3>
            <ul>
              <li><strong className="text-ink">Access:</strong> Obtain a summary of your personal data being processed</li>
              <li><strong className="text-ink">Correction:</strong> Request correction of inaccurate or incomplete personal data</li>
              <li><strong className="text-ink">Erasure:</strong> Request deletion of your personal data (subject to legal retention requirements)</li>
              <li><strong className="text-ink">Grievance Redressal:</strong> Lodge complaints with our Grievance Officer (see Section 12)</li>
              <li><strong className="text-ink">Nominate:</strong> Nominate another person to exercise your rights in case of death or incapacity</li>
            </ul>

            <h3 className="legal-subheading">Under GDPR (EU/EEA users), you additionally have:</h3>
            <ul>
              <li><strong className="text-ink">Data Portability:</strong> Receive your data in a structured, machine-readable format</li>
              <li><strong className="text-ink">Restriction:</strong> Request restriction of processing in certain circumstances</li>
              <li><strong className="text-ink">Object:</strong> Object to processing based on legitimate interest</li>
              <li><strong className="text-ink">Automated Decision-Making:</strong> Right not to be subject to solely automated decisions with legal effects</li>
              <li><strong className="text-ink">Supervisory Authority:</strong> Lodge a complaint with your local data protection authority</li>
            </ul>

            <p>
              To exercise any of these rights, email us at <a href="mailto:privacy@psyprofiler.io" className="text-violet-400 hover:text-violet-200 underline underline-offset-4">privacy@psyprofiler.io</a>. We will respond within 30 days.
            </p>
          </div>
        </section>

        {/* Section 9 */}
        <section id="cookies" className="legal-section">
          <h2 className="legal-heading">9. COOKIES & TRACKING</h2>
          <div className="legal-body">
            <p>We use the following types of cookies:</p>
            <ul>
              <li><strong className="text-ink">Essential Cookies:</strong> Required for platform functionality (authentication, security). Cannot be disabled.</li>
              <li><strong className="text-ink">Analytics Cookies:</strong> Help us understand usage patterns. Can be disabled.</li>
            </ul>
            <p>
              We do NOT use third-party advertising cookies or tracking pixels. We do NOT sell cookie data to third parties.
            </p>
          </div>
        </section>

        {/* Section 10 */}
        <section id="children" className="legal-section">
          <h2 className="legal-heading">10. CHILDREN&apos;S PRIVACY</h2>
          <div className="legal-body">
            <p>
              PsyProfiler.io is not intended for use by anyone under the age of 16. We do not knowingly collect personal data from children. If we discover that we have inadvertently collected data from a minor, we will promptly delete it.
            </p>
            <p>
              Analyzing the profile of any person under 16 years of age is strictly prohibited under our <a href="/terms" className="text-violet-400 hover:text-violet-200 underline underline-offset-4">Terms & Conditions</a>.
            </p>
          </div>
        </section>

        {/* Section 11 */}
        <section id="international" className="legal-section">
          <h2 className="legal-heading">11. INTERNATIONAL DATA TRANSFERS</h2>
          <div className="legal-body">
            <p>
              Your data may be processed in the following locations:
            </p>
            <ul>
              <li><strong className="text-ink">India:</strong> Primary data storage and platform operations (Appwrite, application servers)</li>
              <li><strong className="text-ink">United States:</strong> Google Cloud Platform (Vertex AI) for AI processing</li>
            </ul>
            <p>
              For EU/EEA users: International data transfers are conducted under Standard Contractual Clauses (SCCs) as approved by the European Commission, in compliance with GDPR Chapter V requirements.
            </p>
          </div>
        </section>

        {/* Section 12 */}
        <section id="grievance" className="legal-section">
          <h2 className="legal-heading">12. GRIEVANCE OFFICER</h2>
          <div className="legal-body">
            <div className="glass p-6 space-y-3">
              <p className="font-mono text-[10px] tracking-[0.18em] text-gold">DESIGNATED GRIEVANCE OFFICER — DPDPA 2023 COMPLIANCE</p>
              <p><strong className="text-ink">Name:</strong> Kunal Shahare</p>
              <p><strong className="text-ink">Designation:</strong> Founder & Grievance Officer</p>
              <p><strong className="text-ink">Company:</strong> Kunaya Labs</p>
              <p><strong className="text-ink">Email:</strong> <a href="mailto:grievance@psyprofiler.io" className="text-violet-400 hover:text-violet-200">grievance@psyprofiler.io</a></p>
              <p><strong className="text-ink">Address:</strong> Bhandara, Maharashtra 441904, India</p>
              <p className="text-muted text-sm mt-3">
                Grievances will be acknowledged within 48 hours and resolved within 30 days as per the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021.
              </p>
            </div>
          </div>
        </section>

        {/* Section 13 */}
        <section id="changes" className="legal-section">
          <h2 className="legal-heading">13. CHANGES TO THIS POLICY</h2>
          <div className="legal-body">
            <p>
              We may update this Privacy Policy from time to time. Material changes will be communicated via email to registered users at least 30 days prior. The &ldquo;Last Updated&rdquo; date reflects the most recent revision.
            </p>
          </div>
        </section>

        {/* Section 14 */}
        <section id="contact" className="legal-section">
          <h2 className="legal-heading">14. CONTACT US</h2>
          <div className="legal-body">
            <div className="glass p-6 space-y-3">
              <p className="font-mono text-[10px] tracking-[0.18em] text-gold">PRIVACY DEPARTMENT</p>
              <p><strong className="text-ink">Email:</strong> <a href="mailto:privacy@psyprofiler.io" className="text-violet-400 hover:text-violet-200">privacy@psyprofiler.io</a></p>
              <p><strong className="text-ink">Support:</strong> <a href="mailto:support@psyprofiler.io" className="text-violet-400 hover:text-violet-200">support@psyprofiler.io</a></p>
              <p><strong className="text-ink">General:</strong> <a href="mailto:contact@kunayalab.com" className="text-violet-400 hover:text-violet-200">contact@kunayalab.com</a></p>
            </div>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
}
