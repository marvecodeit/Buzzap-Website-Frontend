'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import './terms.css';

const sections = [
  {
    title: '1. Acceptance of Terms',
    body: `By accessing or using Buzzap Agency's website, services, or any related platforms (collectively, the "Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Services. These Terms apply to all visitors, clients, and others who access the Services.`,
  },
  {
    title: '2. Services Description',
    body: `Buzzap Agency provides AI-powered marketing, lead automation, SEO, brand strategy, CRM integration, and related digital growth services. The specific scope, deliverables, and timelines for each client engagement are governed by a separate Statement of Work or Service Agreement entered into at the time of onboarding. These Terms apply in addition to, and do not replace, any such agreement.`,
  },
  {
    title: '3. Client Obligations',
    body: `You agree to: (a) provide accurate, complete, and current information when requested; (b) maintain the security of any account credentials provided; (c) cooperate in good faith to enable delivery of the agreed services, including providing timely access to ad accounts, CRM systems, and other required platforms; (d) comply with all applicable laws and the terms of third-party platforms we operate on your behalf, including Meta Ads, Google Ads, and WhatsApp Business API.`,
  },
  {
    title: '4. Intellectual Property',
    body: `All deliverables produced by Buzzap Agency — including ad creative, copy, automation workflows, and system architecture — are the property of the client upon full payment of applicable fees, except for proprietary frameworks, tooling, and methodologies developed by Buzzap, which remain the exclusive property of Buzzap Agency. You may not reproduce, distribute, or create derivative works of Buzzap's proprietary systems without prior written consent.`,
  },
  {
    title: '5. Confidentiality',
    body: `Both parties agree to keep confidential all non-public information disclosed in connection with the engagement, including business data, customer lists, pricing, and system architecture. This obligation survives termination of the engagement. Buzzap will not disclose your business information to third parties except as required to deliver the Services (e.g., platform integrations) or as required by law.`,
  },
  {
    title: '6. Payment Terms',
    body: `Fees are billed monthly in advance on the first of each billing period. All invoices are due within 7 days of issuance. Late payments accrue interest at 1.5% per month. Buzzap reserves the right to suspend services without notice if payment is more than 14 days overdue. Setup fees, where applicable, are due in full prior to commencement of work. All fees are non-refundable except as specified in the Service Agreement.`,
  },
  {
    title: '7. Term and Termination',
    body: `Engagements commence on the date specified in the Service Agreement. Minimum commitment periods apply per plan (3 months for Starter and Scale, 6 months for Enterprise). After the minimum period, either party may terminate with 30 days' written notice. Buzzap may terminate immediately if you: breach these Terms, fail to make payment, or engage in activity that violates applicable law or third-party platform policies. Upon termination, Buzzap will transfer all client-owned assets within 10 business days.`,
  },
  {
    title: '8. Limitation of Liability',
    body: `Buzzap Agency's total liability to you for any claim arising from or related to the Services shall not exceed the total fees paid by you in the three months preceding the claim. In no event shall Buzzap be liable for indirect, incidental, consequential, or punitive damages, including loss of revenue, loss of data, or business interruption, even if advised of the possibility of such damages. Buzzap does not guarantee specific results — revenue outcomes depend on factors beyond our control, including market conditions and client-side operations.`,
  },
  {
    title: '9. Third-Party Platforms',
    body: `Our Services involve operating on third-party platforms including but not limited to Meta, Google, WhatsApp, Zoho, HubSpot, and Make.com. Buzzap is not responsible for changes, interruptions, or policy violations by these platforms. You are responsible for compliance with all third-party platform terms. Ad spend budgets allocated to third-party platforms are separate from Buzzap's service fees and are charged directly by those platforms.`,
  },
  {
    title: '10. Data and Privacy',
    body: `Buzzap collects and processes data in accordance with our Privacy Policy, which is incorporated by reference into these Terms. By using our Services, you consent to the collection and processing of data as described. You are responsible for ensuring you have the legal basis to share any customer or lead data with Buzzap for use in automation systems. We comply with GDPR, CCPA, and other applicable data protection regulations.`,
  },
  {
    title: '11. Indemnification',
    body: `You agree to indemnify and hold harmless Buzzap Agency, its officers, employees, and contractors from any claims, damages, losses, or costs (including legal fees) arising from: (a) your use of the Services in violation of these Terms; (b) your content, data, or materials provided to Buzzap; (c) your violation of applicable law; or (d) your breach of any third-party platform terms.`,
  },
  {
    title: '12. Modifications to Terms',
    body: `Buzzap reserves the right to update these Terms at any time. We will notify you of material changes by email or via the website with at least 14 days' notice before the changes take effect. Continued use of the Services after the effective date constitutes acceptance of the revised Terms. If you do not agree to the revised Terms, you may terminate your engagement in accordance with Section 7.`,
  },
  {
    title: '13. Governing Law and Disputes',
    body: `These Terms are governed by the laws of the State of Delaware, United States, without regard to conflict of law principles. Any dispute arising from or relating to these Terms shall first be attempted to be resolved through good-faith negotiation. If negotiation fails, disputes shall be resolved through binding arbitration under the rules of the American Arbitration Association. Nothing in this section prevents either party from seeking injunctive relief in a court of competent jurisdiction.`,
  },
  {
    title: '14. Contact',
    body: `For questions about these Terms, please contact us at legal@buzzaphq.com or through the contact form on our website. Our mailing address is Buzzap Agency, Legal Department, San Francisco, California, United States.`,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] } }),
};

export default function TermsPage() {
  return (
    <main className="terms-page">
      <section className="terms-hero">
        <div className="terms-container">
          <motion.span className="terms-label" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            Legal
          </motion.span>
          <motion.h1 className="terms-title" variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            Terms of Service
          </motion.h1>
          <motion.p className="terms-meta" variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            Last updated: June 17, 2026
          </motion.p>
          <motion.p className="terms-intro" variants={fadeUp} custom={3} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            Please read these terms carefully before using Buzzap Agency&apos;s services.
            If you have questions, email us at <a href="mailto:legal@buzzaphq.com">legal@buzzaphq.com</a>.
          </motion.p>
        </div>
      </section>

      <section className="terms-body">
        <div className="terms-container">
          <div className="terms-layout">
            <nav className="terms-nav">
              <span className="terms-nav-label">On this page</span>
              {sections.map((s, i) => (
                <a key={i} href={`#section-${i}`} className="terms-nav-link">
                  {s.title}
                </a>
              ))}
            </nav>

            <div className="terms-content">
              {sections.map((s, i) => (
                <motion.div
                  key={i}
                  id={`section-${i}`}
                  className="terms-section"
                  variants={fadeUp}
                  custom={i * 0.3}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                >
                  <h2 className="terms-section-title">{s.title}</h2>
                  <p className="terms-section-body">{s.body}</p>
                </motion.div>
              ))}

              <div className="terms-footer-note">
                <p>
                  By using Buzzap Agency&apos;s services you acknowledge that you have read,
                  understood, and agree to be bound by these Terms of Service.
                </p>
                <div className="terms-footer-links">
                  <Link href="/contact" className="terms-link">Contact us</Link>
                  <Link href="/booking" className="terms-link">Book a call</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
