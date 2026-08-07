'use client';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, CheckCircle, Clock, Globe, Shield, Zap, BarChart2, Users, Target } from 'lucide-react';
import Link from 'next/link';
import './buzzap.css';

const metrics = [
  { value: '500+', label: 'Brands transformed' },
  { value: '$120M+', label: 'Client revenue generated' },
  { value: '340%', label: 'Average ROI increase' },
  { value: '98%', label: 'Client retention rate' },
];

const differentiators = [
  {
    icon: Zap,
    title: 'Speed of deployment',
    desc: 'Most agencies take months to show results. We go live in weeks. Our pre-built automation frameworks mean your growth system is operational before your competitors notice.',
  },
  {
    icon: Globe,
    title: 'Full-stack AI capability',
    desc: 'We handle everything — ads, SEO, CRM, chatbots, content, and strategy. No hand-offs between agencies. One team, one system, one point of accountability.',
  },
  {
    icon: BarChart2,
    title: 'Outcome-focused reporting',
    desc: 'We measure what actually matters: leads generated, revenue attributed, pipeline created. Not vanity metrics. Your dashboard shows the numbers that impact your business.',
  },
  {
    icon: Shield,
    title: 'Built for your industry',
    desc: 'Every system we build is customised to your specific market, buyer journey, and competitive landscape. No templates. No copy-paste campaigns.',
  },
  {
    icon: Target,
    title: 'AI-native from day one',
    desc: 'We were built around AI — not retrofitted to it. Our entire stack is designed to leverage automation, machine learning, and intelligent agents at every touchpoint.',
  },
  {
    icon: Users,
    title: 'Dedicated growth team',
    desc: 'You get a dedicated strategist, automation engineer, and account manager — not a rotating cast of junior staff. The people who pitch you are the people who build for you.',
  },
];

const timeline = [
  { week: 'Week 1–2', title: 'Discovery & audit', desc: 'We map your full business — current tools, processes, bottlenecks, and revenue goals.' },
  { week: 'Week 2–3', title: 'Architecture', desc: 'We design your complete AI growth system: ads, CRM, automations, content, and agents.' },
  { week: 'Week 3–5', title: 'Build & integrate', desc: 'We build and connect every component — fully tested before going live.' },
  { week: 'Week 6+', title: 'Launch & optimise', desc: 'We go live, monitor closely, and refine every lever based on real performance data.' },
];

const testimonials = [
  {
    quote: 'Buzzap replaced four agencies and three freelancers. One team, one system, and we tripled our lead volume in 60 days.',
    author: 'Chinwe A.',
    role: 'Founder, UrbanNest Group',
  },
  {
    quote: 'The AI follow-up system alone paid for the entire engagement in the first month. We went from 6-hour response times to under 3 minutes.',
    author: 'James K.',
    role: 'CEO, RetailPulse',
  },
  {
    quote: 'What I valued most was the clarity. They told us exactly what was broken, exactly how they would fix it, and delivered precisely that.',
    author: 'Sarah M.',
    role: 'Marketing Director, Flowmatic HQ',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function WhyBuzzap() {
  return (
    <main className="wb-page">

      {/* Hero */}
      <section className="wb-hero">
        <div className="wb-hero-glow" />
        <div className="wb-hero-grid" />
        <div className="wb-container">
          <motion.span className="wb-label" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            Why Buzzap
          </motion.span>
          <motion.h1 className="wb-hero-title" variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            We don&apos;t manage campaigns.<br />
            <span className="wb-muted">We build growth systems.</span>
          </motion.h1>
          <motion.p className="wb-hero-desc" variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            Most agencies optimise for activity — impressions, clicks, posts. We optimise for
            outcomes: leads generated, revenue closed, and systems that keep working without you.
          </motion.p>
          <motion.div className="wb-hero-actions" variants={fadeUp} custom={3} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Link href="/booking" className="wb-btn-primary">Book a Free Audit <ArrowRight size={16} /></Link>
            <Link href="/services" className="wb-btn-ghost">View our services <ArrowUpRight size={16} /></Link>
          </motion.div>
        </div>
      </section>

      {/* Metrics */}
      <section className="wb-metrics-section">
        <div className="wb-container">
          <div className="wb-metrics-grid">
            {metrics.map((m, i) => (
              <motion.div key={i} className="wb-metric" variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div className="wb-metric-value">{m.value}</div>
                <div className="wb-metric-label">{m.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="wb-diff-section">
        <div className="wb-container">
          <div className="wb-section-header">
            <span className="wb-label">What makes us different</span>
            <h2 className="wb-section-title">
              Six reasons clients choose Buzzap<br />
              <span className="wb-muted">and stay for years.</span>
            </h2>
          </div>
          <div className="wb-diff-grid">
            {differentiators.map((d, i) => {
              const Icon = d.icon;
              return (
                <motion.div key={i} className="wb-diff-card" variants={fadeUp} custom={i % 3} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <div className="wb-diff-icon"><Icon size={18} strokeWidth={1.5} /></div>
                  <h3 className="wb-diff-title">{d.title}</h3>
                  <p className="wb-diff-desc">{d.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline / Process */}
      <section className="wb-timeline-section">
        <div className="wb-container">
          <div className="wb-section-header">
            <span className="wb-label">Timeline</span>
            <h2 className="wb-section-title">
              From zero to live<br />
              <span className="wb-muted">in under six weeks.</span>
            </h2>
          </div>
          <div className="wb-timeline">
            {timeline.map((t, i) => (
              <motion.div key={i} className="wb-timeline-item" variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div className="wb-timeline-left">
                  <span className="wb-timeline-week">{t.week}</span>
                  {i < timeline.length - 1 && <div className="wb-timeline-line" />}
                </div>
                <div className="wb-timeline-right">
                  <h3 className="wb-timeline-title">{t.title}</h3>
                  <p className="wb-timeline-desc">{t.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="wb-testimonials-section">
        <div className="wb-container">
          <div className="wb-section-header">
            <span className="wb-label">Client voice</span>
            <h2 className="wb-section-title">Don&apos;t take our word for it.</h2>
          </div>
          <div className="wb-testimonials-grid">
            {testimonials.map((t, i) => (
              <motion.div key={i} className="wb-testimonial" variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <p className="wb-testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
                <div className="wb-testimonial-author">
                  <div className="wb-author-avatar">{t.author[0]}</div>
                  <div>
                    <div className="wb-author-name">{t.author}</div>
                    <div className="wb-author-role">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="wb-cta-section">
        <div className="wb-container">
          <div className="wb-cta-inner">
            <span className="wb-label">Get started</span>
            <h2 className="wb-section-title">
              Ready to see it<br />
              <span className="wb-muted">in your business?</span>
            </h2>
            <p className="wb-cta-desc">
              Book a free 30-minute audit. We&apos;ll review your current systems and tell you
              exactly what&apos;s broken and what to fix first.
            </p>
            <Link href="/booking" className="wb-btn-primary">
              Book a Free Call <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
