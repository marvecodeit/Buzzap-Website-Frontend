'use client';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Server, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import './security.css';

const practices = [
  {
    icon: Lock,
    title: 'Encryption in transit and at rest',
    desc: 'All data transmitted between your browser and our systems uses TLS 1.3. Data stored in our systems is encrypted at rest using AES-256. Sensitive credentials and API keys are stored in dedicated secrets management vaults with zero plaintext access.',
  },
  {
    icon: Eye,
    title: 'Access controls and least privilege',
    desc: 'Team members are granted the minimum access necessary to perform their role. All access is role-based, audited, and reviewed quarterly. Former employees are revoked within the hour of offboarding. Multi-factor authentication is enforced across all internal systems.',
  },
  {
    icon: Server,
    title: 'Infrastructure and vendor security',
    desc: 'Our infrastructure is hosted on AWS and Cloudflare — both SOC 2 Type II certified providers. We conduct regular security assessments and penetration tests. Third-party vendors with access to client data are vetted for security posture before integration.',
  },
  {
    icon: Shield,
    title: 'Incident response',
    desc: 'We have a documented incident response plan. In the event of a security breach affecting client data, we notify affected parties within 72 hours — well within GDPR requirements. Our team conducts post-incident reviews and publishes remediation timelines.',
  },
];

const certifications = [
  { name: 'GDPR Compliant', desc: 'Data processing agreements in place for all EU client data.' },
  { name: 'CCPA Ready', desc: 'California Consumer Privacy Act requirements met for US clients.' },
  { name: 'SOC 2 Vendors', desc: 'All infrastructure providers are SOC 2 Type II certified.' },
  { name: 'TLS 1.3', desc: 'All data in transit encrypted with the latest TLS standard.' },
  { name: 'AES-256', desc: 'All data at rest encrypted with industry-standard AES-256.' },
  { name: 'MFA Enforced', desc: 'Multi-factor authentication required across all internal tools.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] } }),
};

export default function SecurityPage() {
  return (
    <main className="sec-page">

      {/* Hero */}
      <section className="sec-hero">
        <div className="sec-hero-glow" />
        <div className="sec-container">
          <motion.span className="sec-label" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            Security
          </motion.span>
          <motion.h1 className="sec-title" variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            Your data is treated<br />
            <span className="sec-muted">with the same rigour as your revenue.</span>
          </motion.h1>
          <motion.p className="sec-desc" variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            Buzzap handles sensitive client data — CRM records, ad accounts, lead information.
            Here&apos;s exactly how we protect it.
          </motion.p>
        </div>
      </section>

      {/* Practices */}
      <section className="sec-practices-section">
        <div className="sec-container">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="sec-label">Security practices</span>
            <h2 className="sec-section-title" style={{ marginTop: 10 }}>
              How we protect<br />
              <span className="sec-muted">your business data.</span>
            </h2>
          </motion.div>
          <div className="sec-practices-grid">
            {practices.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div key={i} className="sec-practice-card" variants={fadeUp} custom={i * 0.5} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <div className="sec-practice-icon"><Icon size={16} /></div>
                  <h3 className="sec-practice-title">{p.title}</h3>
                  <p className="sec-practice-desc">{p.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="sec-cert-section">
        <div className="sec-container">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="sec-label">Compliance & standards</span>
            <h2 className="sec-section-title" style={{ marginTop: 10, marginBottom: 48 }}>
              What we comply with.<br />
              <span className="sec-muted">And what we hold ourselves to.</span>
            </h2>
          </motion.div>
          <div className="sec-cert-grid">
            {certifications.map((c, i) => (
              <motion.div key={i} className="sec-cert-item" variants={fadeUp} custom={i * 0.4} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <CheckCircle size={14} className="sec-cert-icon" />
                <div>
                  <div className="sec-cert-name">{c.name}</div>
                  <div className="sec-cert-desc">{c.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Responsible disclosure */}
      <section className="sec-disclosure-section">
        <div className="sec-container">
          <div className="sec-disclosure-inner">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <span className="sec-label">Responsible disclosure</span>
              <h2 className="sec-section-title" style={{ marginTop: 10 }}>
                Found a vulnerability?<br />
                <span className="sec-muted">We want to hear from you.</span>
              </h2>
              <p className="sec-disclosure-text">
                If you discover a security vulnerability in our systems, please report it
                to <a href="mailto:security@buzzaphq.com" className="sec-link">security@buzzaphq.com</a>.
                We commit to acknowledging your report within 24 hours, investigating within 72 hours,
                and keeping you informed throughout the remediation process. We do not pursue legal action
                against researchers acting in good faith.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="sec-cta-section">
        <div className="sec-container">
          <div className="sec-cta-inner">
            <motion.span className="sec-label" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              Questions about security?
            </motion.span>
            <motion.h2 className="sec-cta-title" variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              Talk to our team<br />
              <span className="sec-muted">before you commit to anything.</span>
            </motion.h2>
            <motion.div variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/contact" className="sec-btn-primary">
                Contact us <ArrowRight size={16} />
              </Link>
              <Link href="/privacy" className="sec-btn-ghost">
                Read Privacy Policy
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
