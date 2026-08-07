'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Zap, TrendingUp, Users, BarChart3, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import './solution-cta.css';

const fadeUp = {
  hidden: { opacity: 0, y: 32, filter: 'blur(8px)' },
  visible: (i = 0) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  }),
};

const systems = [
  { icon: BarChart3, label: 'AI Marketing', color: '#818cf8', value: '+487%', unit: 'MRR' },
  { icon: Users, label: 'CRM Automation', color: '#10b981', value: '98%', unit: 'retention' },
  { icon: TrendingUp, label: 'SEO Authority', color: '#f59e0b', value: '#1', unit: 'rankings' },
];

const bullets = [
  'Full AI marketing system built in 14 days',
  'CRM + WhatsApp + email fully integrated',
  'AI agents active 24/7 — not templates',
  'Monthly performance reviews + optimization',
];

export default function SolutionCta() {
  return (
    <section className="sol-section">
      <div className="sol-bg-orb sol-orb-1" />
      <div className="sol-bg-orb sol-orb-2" />
      <div className="sol-grid" />

      <div className="sol-container">
        <div className="sol-split">

          {/* Left: Visual stack */}
          <div className="sol-visual">
            {/* Main image */}
            <motion.div
              className="sol-img-wrap"
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image src="/product2.jpeg" alt="AI Growth System" fill className="sol-img" />
              <div className="sol-img-overlay" />

              {/* Floating metric cards */}
              {systems.map((sys, i) => {
                const Icon = sys.icon;
                return (
                  <motion.div
                    key={i}
                    className="sol-metric-card"
                    style={{
                      top: `${22 + i * 28}%`,
                      right: i % 2 === 0 ? '-36px' : 'auto',
                      left: i % 2 !== 0 ? '-36px' : 'auto',
                      '--sys-color': sys.color,
                    }}
                    initial={{ opacity: 0, x: i % 2 === 0 ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="sol-metric-icon" style={{ background: `${sys.color}15`, border: `1px solid ${sys.color}30`, color: sys.color }}>
                      <Icon size={13} />
                    </div>
                    <div>
                      <div className="sol-metric-value" style={{ color: sys.color }}>{sys.value}</div>
                      <div className="sol-metric-label">{sys.label}</div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Right: Text */}
          <div className="sol-text">
            <motion.span className="sol-badge" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <Zap size={11} />
              The Buzzap System
            </motion.span>

            <motion.h2 className="sol-title" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
              Not an agency.<br />
              <span className="sol-title-accent">An AI growth engine.</span>
            </motion.h2>

            <motion.p className="sol-desc" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}>
              Most agencies deliver reports. Buzzap deploys working systems — AI infrastructure
              that generates leads, closes deals, and scales revenue while you focus on what matters.
            </motion.p>

            <motion.ul className="sol-bullets" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={3}>
              {bullets.map((b, i) => (
                <li key={i}>
                  <CheckCircle size={14} className="sol-check" />
                  {b}
                </li>
              ))}
            </motion.ul>

            <motion.div className="sol-cta-row" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={4}>
              <Link href="/booking" className="sol-btn-primary">
                Book a strategy call <ArrowRight size={15} />
              </Link>
              <Link href="/services" className="sol-btn-ghost">
                See all services
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
