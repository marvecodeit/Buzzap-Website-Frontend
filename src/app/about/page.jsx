'use client';
import { motion } from 'framer-motion';
import { ArrowRight, Target, Zap, Users, Globe } from 'lucide-react';
import Link from 'next/link';
import './about.css';

const values = [
  {
    icon: Target,
    title: 'Outcomes over activity',
    desc: 'We measure success by revenue generated and pipeline created — not impressions, clicks, or deliverables shipped. Every system we build is designed to produce a business outcome.',
  },
  {
    icon: Zap,
    title: 'Speed as a competitive edge',
    desc: 'The best lead follow-up happens in minutes, not days. We build systems that operate faster than any human team and hold that standard across everything we do.',
  },
  {
    icon: Users,
    title: 'Integration, not silos',
    desc: 'We don\'t run one channel in isolation. We build the full stack: ads, automation, CRM, content, and outreach — wired together into one system that compounds over time.',
  },
  {
    icon: Globe,
    title: 'Transparent execution',
    desc: 'No black boxes. Clients see exactly what we\'re building, why it works, and what the numbers say. We share the same live dashboard our team looks at every day.',
  },
];

const team = [
  { name: 'Rohan Adesanya', role: 'Founder & Growth Architect', initial: 'R' },
  { name: 'Kayla Mensah', role: 'Head of AI Systems', initial: 'K' },
  { name: 'Dami Okafor', role: 'Lead Automation Engineer', initial: 'D' },
  { name: 'Sophie Carr', role: 'Brand & SEO Director', initial: 'S' },
  { name: 'Tunde Bakare', role: 'Paid Media Strategist', initial: 'T' },
  { name: 'Lena Fischer', role: 'CRM & Pipeline Specialist', initial: 'L' },
];

const milestones = [
  { year: '2022', event: 'Founded in Lagos with a focus on AI-powered cold outreach for SMEs.' },
  { year: '2023', event: 'Expanded to 40+ clients across real estate, e-commerce, and SaaS. Deployed first AI phone agent.' },
  { year: '2024', event: 'Generated over $50M in client pipeline. Launched the Buzzap Growth System framework.' },
  { year: '2025', event: 'Opened operations in the US and UK. Crossed $120M in cumulative pipeline generated for clients.' },
  { year: '2026', event: 'Team of 20+ across 3 continents. Serving growth-stage businesses from $500K to $20M ARR.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] } }),
};

export default function AboutPage() {
  return (
    <main className="about-page">

      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-glow" />
        <div className="about-container">
          <motion.span className="about-label" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            About Buzzap
          </motion.span>
          <motion.h1 className="about-title" variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            We build AI growth<br />
            <span className="about-muted">systems for ambitious businesses.</span>
          </motion.h1>
          <motion.p className="about-desc" variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            Buzzap is an AI agency that replaces disconnected marketing teams with one
            integrated system — built to generate leads, follow up automatically, and
            close deals faster than your competition.
          </motion.p>
        </div>
      </section>

      {/* Mission */}
      <section className="about-mission-section">
        <div className="about-container">
          <div className="about-mission-grid">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <span className="about-label">Our mission</span>
              <h2 className="about-section-title">
                Make world-class growth<br />
                <span className="about-muted">accessible to every business.</span>
              </h2>
            </motion.div>
            <motion.div variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <p className="about-body-text">
                The same AI infrastructure that enterprise companies use — automated outreach,
                intelligent CRM pipelines, AI phone agents — used to require a team of 20 and
                a seven-figure budget.
              </p>
              <p className="about-body-text" style={{ marginTop: 16 }}>
                We built Buzzap to change that. We deploy this infrastructure for growth-stage
                businesses as a managed service — so a five-person team can operate like a
                fifty-person revenue machine.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="about-metrics-section">
        <div className="about-container">
          <div className="about-metrics-grid">
            {[
              { value: '$120M+', label: 'Client pipeline generated' },
              { value: '200+', label: 'Businesses served' },
              { value: '98%', label: 'Client retention rate' },
              { value: '3 min', label: 'Avg. AI lead response time' },
            ].map((m, i) => (
              <motion.div key={i} className="about-metric" variants={fadeUp} custom={i * 0.5} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div className="about-metric-value">{m.value}</div>
                <div className="about-metric-label">{m.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="about-values-section">
        <div className="about-container">
          <motion.div className="about-section-header" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="about-label">How we operate</span>
            <h2 className="about-section-title" style={{ marginTop: 10 }}>
              The principles behind<br />
              <span className="about-muted">every system we build.</span>
            </h2>
          </motion.div>
          <div className="about-values-grid">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div key={i} className="about-value-card" variants={fadeUp} custom={i * 0.5} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <div className="about-value-icon"><Icon size={16} /></div>
                  <h3 className="about-value-title">{v.title}</h3>
                  <p className="about-value-desc">{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="about-timeline-section">
        <div className="about-container">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="about-label">Our story</span>
            <h2 className="about-section-title" style={{ marginTop: 10, marginBottom: 48 }}>
              Built fast. <span className="about-muted">Grown deliberately.</span>
            </h2>
          </motion.div>
          <div className="about-timeline">
            {milestones.map((m, i) => (
              <motion.div key={i} className="about-timeline-item" variants={fadeUp} custom={i * 0.4} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <span className="about-timeline-year">{m.year}</span>
                <p className="about-timeline-event">{m.event}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="about-team-section">
        <div className="about-container">
          <motion.div className="about-section-header" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="about-label">The team</span>
            <h2 className="about-section-title" style={{ marginTop: 10 }}>
              People who&apos;ve built<br />
              <span className="about-muted">what they&apos;re selling.</span>
            </h2>
          </motion.div>
          <div className="about-team-grid">
            {team.map((member, i) => (
              <motion.div key={i} className="about-team-card" variants={fadeUp} custom={i * 0.4} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div className="about-team-avatar">{member.initial}</div>
                <div className="about-team-info">
                  <div className="about-team-name">{member.name}</div>
                  <div className="about-team-role">{member.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta-section">
        <div className="about-container">
          <div className="about-cta-inner">
            <motion.span className="about-label" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              Work with us
            </motion.span>
            <motion.h2 className="about-cta-title" variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              Ready to build your<br />
              <span className="about-muted">AI growth system?</span>
            </motion.h2>
            <motion.p className="about-cta-desc" variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              Book a free audit. We&apos;ll map out what the system looks like for your
              business — specific to your industry, funnel, and team size.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/booking" className="about-btn-primary">
                Book a Free Audit <ArrowRight size={16} />
              </Link>
              <Link href="/case-studies" className="about-btn-ghost">
                See client results
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
