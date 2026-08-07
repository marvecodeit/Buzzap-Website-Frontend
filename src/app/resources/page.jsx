'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getPublishedPosts } from '@/lib/api';
import './resources.css';

// Tag → accent color (falls back to indigo).
const tagColors = {
  'AI Marketing': '#3b82f6',
  'CRM Automation': '#10b981',
  'Growth Systems': '#8b5cf6',
  'SEO & Brand': '#f59e0b',
  'Case Studies': '#f43f5e',
};
const colorForTag = (tag) => tagColors[tag] || '#6366f1';
const readTimeFor = (post) => {
  const words = (post.excerpt || '').split(/\s+/).length + 200;
  return `${Math.max(1, Math.round(words / 200))} min`;
};

const tools = [
  { name: 'Lead Response Time Calculator', desc: 'See exactly how much revenue is being lost to slow follow-up.', href: '/contact' },
  { name: 'AI Stack Builder', desc: 'Get a recommended tool stack for your specific business model.', href: '/contact' },
  { name: 'ROI Estimator', desc: 'Estimate the ROI of an AI growth system based on your current numbers.', href: '/booking' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.45, ease: [0.16, 1, 0.3, 1] } }),
};

export default function ResourcesPage() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublishedPosts({ limit: 100 })
      .then((data) => setGuides(data.posts || []))
      .catch(() => setGuides([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="res-page">

      {/* Hero */}
      <section className="res-hero">
        <div className="res-hero-glow" />
        <div className="res-container">
          <motion.span className="res-label" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            Resources
          </motion.span>
          <motion.h1 className="res-title" variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            Playbooks, guides,<br />
            <span className="res-muted">and templates that ship.</span>
          </motion.h1>
          <motion.p className="res-desc" variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            Practical resources written by the team that builds AI growth systems every day.
            Take what&apos;s useful. Build something with it.
          </motion.p>
        </div>
      </section>

      {/* Guides grid */}
      <section className="res-guides-section">
        <div className="res-container">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="res-label">Guides & playbooks</span>
            <h2 className="res-section-title" style={{ marginTop: 10, marginBottom: 48 }}>
              The exact frameworks<br />
              <span className="res-muted">we use with clients.</span>
            </h2>
          </motion.div>
          {loading ? (
            <p style={{ color: 'var(--text-secondary)' }}>Loading resources…</p>
          ) : guides.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No resources published yet. Check back soon.</p>
          ) : (
            <div className="res-guides-grid">
              {guides.map((g, i) => {
                const tag = (g.tags && g.tags[0]) || 'Guide';
                const tagColor = colorForTag(tag);
                return (
                  <motion.article
                    key={g._id}
                    className="res-guide-card"
                    variants={fadeUp}
                    custom={i * 0.4}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                  >
                    <Link href={`/insights/${g.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                      <div className="res-guide-card-line" style={{ background: `linear-gradient(90deg, ${tagColor}, transparent)` }} />
                      <div className="res-guide-top">
                        <span className="res-guide-tag" style={{ color: tagColor, borderColor: `${tagColor}30`, background: `${tagColor}10` }}>
                          {tag}
                        </span>
                        <ArrowUpRight size={15} className="res-guide-arrow" />
                      </div>
                      <h3 className="res-guide-title">{g.title}</h3>
                      <p className="res-guide-desc">{g.excerpt}</p>
                      <div className="res-guide-footer">
                        <Clock size={12} />
                        <span>{readTimeFor(g)} read</span>
                      </div>
                    </Link>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Tools */}
      <section className="res-tools-section">
        <div className="res-container">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="res-label">Interactive tools</span>
            <h2 className="res-section-title" style={{ marginTop: 10, marginBottom: 40 }}>
              Calculators and estimators<br />
              <span className="res-muted">for your specific situation.</span>
            </h2>
          </motion.div>
          <div className="res-tools-grid">
            {tools.map((t, i) => (
              <motion.div key={i} className="res-tool-card" variants={fadeUp} custom={i * 0.5} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <h3 className="res-tool-name">{t.name}</h3>
                <p className="res-tool-desc">{t.desc}</p>
                <Link href={t.href} className="res-tool-link">
                  Get access <ArrowRight size={13} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog CTA */}
      <section className="res-blog-section">
        <div className="res-container">
          <div className="res-blog-inner">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <span className="res-label">Insights</span>
              <h2 className="res-section-title" style={{ marginTop: 10 }}>
                Looking for in-depth articles?<br />
                <span className="res-muted">Head to our blog.</span>
              </h2>
              <p className="res-blog-desc">
                Deep-dive guides on AI marketing, CRM automation, SEO, and growth systems —
                published weekly.
              </p>
              <Link href="/insights" className="res-btn-primary" style={{ marginTop: 20 }}>
                Browse the Insights blog <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
