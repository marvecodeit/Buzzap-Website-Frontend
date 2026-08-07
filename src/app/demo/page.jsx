'use client';
import { motion } from 'framer-motion';
import { ArrowRight, Play, TrendingUp, Users, Clock, Zap, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import './demo.css';

const metrics = [
  { value: '10,000+', label: 'AI automations deployed' },
  { value: '340%', label: 'Avg. ROI in 90 days' },
  { value: '3 min', label: 'Lead response time' },
  { value: '$120M+', label: 'Pipeline generated for clients' },
];

const walkthroughSteps = [
  {
    step: '01',
    title: 'Lead captured',
    desc: 'A prospect clicks your ad or fills out a form. The system fires instantly — no manual review, no delay.',
  },
  {
    step: '02',
    title: 'AI qualifies within 3 minutes',
    desc: 'An AI agent sends a personalised WhatsApp or SMS, asks qualifying questions, and scores the lead automatically.',
  },
  {
    step: '03',
    title: 'Qualified leads book a call',
    desc: 'If qualified, the AI books them directly into your calendar. Unqualified leads enter a long-term nurture sequence.',
  },
  {
    step: '04',
    title: 'CRM updated automatically',
    desc: 'Every interaction enriches your CRM in real time — contact details, company data, conversation transcript, lead score.',
  },
];

const features = [
  'Meta & Google AI ad campaigns',
  'WhatsApp & SMS AI follow-up',
  'CRM enrichment and automation',
  'AI phone agent for qualification',
  'Live reporting dashboard',
  'Brand content and SEO infrastructure',
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] } }),
};

export default function DemoPage() {
  return (
    <main className="demo-page">

      {/* Hero */}
      <section className="demo-hero">
        <div className="demo-hero-glow" />
        <div className="demo-container">
          <motion.span className="demo-label" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            Product Demo
          </motion.span>
          <motion.h1 className="demo-title" variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            See the system<br />
            <span className="demo-muted">before you buy.</span>
          </motion.h1>
          <motion.p className="demo-desc" variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            Watch how Buzzap&apos;s AI growth infrastructure works end-to-end — from lead
            capture to qualified booking, fully automated.
          </motion.p>
          <motion.div className="demo-hero-actions" variants={fadeUp} custom={3} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Link href="/booking" className="demo-btn-primary">
              Book a Live Demo <ArrowRight size={16} />
            </Link>
            <Link href="/case-studies" className="demo-btn-ghost">
              See real results
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Video placeholder */}
      <section className="demo-video-section">
        <div className="demo-container">
          <motion.div
            className="demo-video-frame"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="demo-video-inner">
              <div className="demo-play-btn">
                <Play size={22} fill="currentColor" />
              </div>
              <p className="demo-video-label">Full walkthrough — 12 minutes</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Metrics strip */}
      <section className="demo-metrics-section">
        <div className="demo-container">
          <div className="demo-metrics-grid">
            {metrics.map((m, i) => (
              <motion.div
                key={i}
                className="demo-metric"
                variants={fadeUp}
                custom={i * 0.5}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <div className="demo-metric-value">{m.value}</div>
                <div className="demo-metric-label">{m.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Walkthrough */}
      <section className="demo-walkthrough-section">
        <div className="demo-container">
          <motion.div className="demo-section-header" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="demo-label">How it works</span>
            <h2 className="demo-section-title">
              From ad click to booked call<br />
              <span className="demo-muted">in under 4 minutes.</span>
            </h2>
          </motion.div>

          <div className="demo-steps-grid">
            {walkthroughSteps.map((step, i) => (
              <motion.div
                key={i}
                className="demo-step"
                variants={fadeUp}
                custom={i * 0.5}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
              >
                <span className="demo-step-num">{step.step}</span>
                <h3 className="demo-step-title">{step.title}</h3>
                <p className="demo-step-desc">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature list + CTA */}
      <section className="demo-features-section">
        <div className="demo-container">
          <div className="demo-features-inner">
            <motion.div className="demo-features-left" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <span className="demo-label">What&apos;s included</span>
              <h2 className="demo-section-title">
                Every tool you need,<br />
                <span className="demo-muted">connected as one system.</span>
              </h2>
              <ul className="demo-feature-list">
                {features.map((f, i) => (
                  <li key={i} className="demo-feature-item">
                    <CheckCircle size={15} className="demo-feature-icon" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div className="demo-cta-card" variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <span className="demo-cta-badge">Free audit</span>
              <h3 className="demo-cta-card-title">Ready to see it built for your business?</h3>
              <p className="demo-cta-card-desc">
                Book a 45-minute call. We&apos;ll audit your current funnel and show you exactly
                what a Buzzap system would look like for your specific business — with
                projected outcomes.
              </p>
              <Link href="/booking" className="demo-btn-primary">
                Book a Free Audit <ArrowRight size={16} />
              </Link>
              <p className="demo-cta-footnote">No commitment. No sales pitch — just the audit.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
