'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import './privacy.css';

const sections = [
  {
    title: '1. Information We Collect',
    body: `We collect information you provide directly to us, including when you fill out a contact form, book a call, subscribe to our newsletter, or engage with our services. This includes: name, email address, phone number, company name, and any other information you choose to share. We also collect information automatically when you visit our website, including IP address, browser type, pages visited, time spent on pages, referring URL, and device information — collected via cookies and similar tracking technologies.`,
  },
  {
    title: '2. How We Use Your Information',
    body: `We use the information we collect to: (a) respond to your inquiries and provide the services you request; (b) send you marketing communications about our services, where you have consented or where we have a legitimate interest; (c) improve our website, services, and marketing; (d) comply with legal obligations; (e) detect and prevent fraud or abuse. We do not sell your personal information to third parties.`,
  },
  {
    title: '3. Legal Basis for Processing (GDPR)',
    body: `If you are in the European Economic Area (EEA), we process your personal data on the following legal bases: Consent — where you have given explicit consent (e.g., newsletter sign-up); Contract — where processing is necessary to perform a contract with you; Legitimate Interests — where we have a legitimate interest that is not overridden by your rights (e.g., improving our services, fraud prevention); Legal Obligation — where we are required to process data to comply with applicable law.`,
  },
  {
    title: '4. Sharing of Information',
    body: `We may share your information with: (a) Service providers who assist in delivering our services, such as CRM platforms (Zoho, HubSpot), email marketing tools (Brevo), scheduling software (Cal.com), and analytics providers. These providers process data only on our instructions and are bound by data processing agreements. (b) Professional advisors such as lawyers, accountants, and auditors. (c) Regulatory authorities and law enforcement where required by law. We require all third-party processors to maintain appropriate security measures and to process data only as directed.`,
  },
  {
    title: '5. Data Retention',
    body: `We retain your personal data for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law. Specifically: Contact and inquiry data is retained for 3 years from last contact. Client data is retained for the duration of the engagement plus 5 years for legal and accounting purposes. Website analytics data is retained for 26 months. Newsletter subscriber data is retained until you unsubscribe. You may request deletion of your data at any time (see Section 8).`,
  },
  {
    title: '6. Cookies and Tracking',
    body: `Our website uses cookies and similar technologies to: measure website traffic and user behaviour (via analytics tools), remember your preferences, and deliver targeted content. You can control cookies through your browser settings. Note that disabling certain cookies may affect the functionality of our website. We use Google Analytics, and you can opt out at g.co/optout. For users in the EEA, we display a cookie consent banner on first visit.`,
  },
  {
    title: '7. International Transfers',
    body: `Buzzap operates globally, and your information may be transferred to and processed in countries outside your country of residence, including the United States. For transfers of personal data from the EEA to third countries, we rely on appropriate safeguards such as Standard Contractual Clauses approved by the European Commission, or we process data in countries that the EU Commission has determined provide adequate protection.`,
  },
  {
    title: '8. Your Rights',
    body: `Depending on your location, you may have the following rights regarding your personal data: Access — the right to request a copy of your data. Rectification — the right to correct inaccurate data. Erasure — the right to request deletion of your data. Restriction — the right to limit how we use your data. Portability — the right to receive your data in a structured, machine-readable format. Objection — the right to object to processing based on legitimate interests. Withdraw Consent — where processing is based on consent, you can withdraw it at any time. To exercise these rights, contact us at privacy@buzzaphq.com. We will respond within 30 days.`,
  },
  {
    title: '9. Security',
    body: `We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, loss, destruction, or alteration. These measures include: TLS encryption for data in transit, AES-256 encryption for data at rest, access controls and role-based permissions, regular security assessments, and staff training on data protection. While we take security seriously, no method of transmission or storage is 100% secure. If you suspect a security incident involving your data, contact us immediately at security@buzzaphq.com.`,
  },
  {
    title: '10. Children\'s Privacy',
    body: `Our services are not directed to individuals under the age of 16. We do not knowingly collect personal data from children. If we become aware that we have collected personal data from a child without parental consent, we will take steps to delete that information as quickly as possible. If you believe we may have collected information from a child, please contact us at privacy@buzzaphq.com.`,
  },
  {
    title: '11. Changes to This Policy',
    body: `We may update this Privacy Policy from time to time. We will notify you of material changes by posting the new policy on our website and, where appropriate, by email. The date at the top of this policy indicates when it was last updated. Your continued use of our services after changes take effect constitutes your acceptance of the revised policy.`,
  },
  {
    title: '12. Contact Us',
    body: `For questions, requests, or complaints about this Privacy Policy or our data practices, contact our Data Protection Officer at privacy@buzzaphq.com. You also have the right to lodge a complaint with your local data protection authority if you believe we have not handled your data appropriately.`,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] } }),
};

export default function PrivacyPage() {
  return (
    <main className="privacy-page">
      <section className="privacy-hero">
        <div className="privacy-container">
          <motion.span className="privacy-label" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            Legal
          </motion.span>
          <motion.h1 className="privacy-title" variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            Privacy Policy
          </motion.h1>
          <motion.p className="privacy-meta" variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            Last updated: June 17, 2026
          </motion.p>
          <motion.p className="privacy-intro" variants={fadeUp} custom={3} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            This policy explains how Buzzap Agency collects, uses, and protects your personal
            data. Questions? Email <a href="mailto:privacy@buzzaphq.com">privacy@buzzaphq.com</a>.
          </motion.p>
        </div>
      </section>

      <section className="privacy-body">
        <div className="privacy-container">
          <div className="privacy-layout">
            <nav className="privacy-nav">
              <span className="privacy-nav-label">On this page</span>
              {sections.map((s, i) => (
                <a key={i} href={`#ps-${i}`} className="privacy-nav-link">{s.title}</a>
              ))}
            </nav>

            <div className="privacy-content">
              {sections.map((s, i) => (
                <motion.div
                  key={i}
                  id={`ps-${i}`}
                  className="privacy-section"
                  variants={fadeUp}
                  custom={i * 0.3}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                >
                  <h2 className="privacy-section-title">{s.title}</h2>
                  <p className="privacy-section-body">{s.body}</p>
                </motion.div>
              ))}

              <div className="privacy-footer-note">
                <p>
                  By using Buzzap Agency&apos;s website and services, you acknowledge this Privacy
                  Policy and consent to our data practices as described above.
                </p>
                <div className="privacy-footer-links">
                  <Link href="/terms" className="privacy-link">Terms of Service</Link>
                  <Link href="/security" className="privacy-link">Security</Link>
                  <Link href="/contact" className="privacy-link">Contact us</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
