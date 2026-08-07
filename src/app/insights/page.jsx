'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getPublishedPosts, submitLead } from '@/lib/api';
import './insights.css';

const tagColors = {
  'AI Marketing': '#3b82f6',
  'CRM Automation': '#10b981',
  'Growth Systems': '#8b5cf6',
  'SEO & Brand': '#f59e0b',
  'Case Studies': '#f43f5e',
};
const DEFAULT_COLOR = '#6366f1';
const colorForTag = (tag) => tagColors[tag] || DEFAULT_COLOR;

// Rough read-time estimate from content length (fallback when not stored).
const readTimeFor = (post) => {
  const words = (post.excerpt || '').split(/\s+/).length + 200;
  return `${Math.max(1, Math.round(words / 200))} min`;
};
const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.45, ease: [0.16, 1, 0.3, 1] } }),
};

export default function InsightsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    getPublishedPosts({ limit: 100 })
      .then((data) => setPosts(data.posts || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  // Build the category list from the tags present on published posts.
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags || [])));
  const categories = ['All', ...allTags];

  const primaryTag = (p) => (p.tags && p.tags[0]) || 'Insights';
  const filtered =
    activeCategory === 'All' ? posts : posts.filter((p) => (p.tags || []).includes(activeCategory));
  const featured = posts[0]; // newest published post
  const rest = activeCategory === 'All' ? filtered.filter((p) => p._id !== featured?._id) : filtered;

  return (
    <main className="ins-page">
      {/* Hero */}
      <section className="ins-page-hero">
        <div className="ins-page-glow" />
        <div className="ins-page-container">
          <motion.span className="ins-page-label" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            Insights
          </motion.span>
          <motion.h1 className="ins-page-title" variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            Frameworks, playbooks,<br />
            <span className="ins-page-muted">and real-world results.</span>
          </motion.h1>
          <motion.p className="ins-page-desc" variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            Deep-dive guides written by the team that builds AI growth systems every day.
            No filler. No opinions without data.
          </motion.p>
        </div>
      </section>

      {/* Category filter */}
      {categories.length > 1 && (
        <section className="ins-page-filter-section">
          <div className="ins-page-container">
            <div className="ins-page-filters">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`ins-page-filter-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Loading / empty states */}
      {loading ? (
        <section className="ins-page-grid-section">
          <div className="ins-page-container">
            <p style={{ color: 'var(--text-secondary)' }}>Loading insights…</p>
          </div>
        </section>
      ) : posts.length === 0 ? (
        <section className="ins-page-grid-section">
          <div className="ins-page-container">
            <p style={{ color: 'var(--text-secondary)' }}>No articles published yet. Check back soon.</p>
          </div>
        </section>
      ) : (
        <>
          {/* Featured post */}
          {activeCategory === 'All' && featured && (
            <section className="ins-page-featured-section">
              <div className="ins-page-container">
                <motion.div className="ins-page-featured" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <Link href={`/insights/${featured.slug}`} className="ins-page-featured-inner" style={{ textDecoration: 'none' }}>
                    <div className="ins-page-featured-meta">
                      <span className="ins-page-tag" style={{ color: colorForTag(primaryTag(featured)), borderColor: `${colorForTag(primaryTag(featured))}30`, background: `${colorForTag(primaryTag(featured))}10` }}>
                        {primaryTag(featured)}
                      </span>
                      <span className="ins-page-featured-badge">Featured</span>
                    </div>
                    <h2 className="ins-page-featured-title">{featured.title}</h2>
                    <p className="ins-page-featured-excerpt">{featured.excerpt}</p>
                    <div className="ins-page-featured-footer">
                      <span className="ins-page-meta-date">{formatDate(featured.publishedAt)}</span>
                      <span className="ins-page-meta-sep">·</span>
                      <Clock size={13} />
                      <span className="ins-page-meta-read">{readTimeFor(featured)} read</span>
                      <span className="ins-page-read-link">
                        Read article <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              </div>
            </section>
          )}

          {/* Articles grid */}
          <section className="ins-page-grid-section">
            <div className="ins-page-container">
              <div className="ins-page-grid">
                {rest.map((post, i) => {
                  const tag = primaryTag(post);
                  return (
                    <motion.div
                      key={post._id}
                      variants={fadeUp}
                      custom={i % 3}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.1 }}
                      style={{ '--ins-accent': colorForTag(tag) }}
                    >
                      <Link href={`/insights/${post.slug}`} className="ins-page-card" style={{ textDecoration: 'none', display: 'block' }}>
                        <div className="ins-page-card-top">
                          <span className="ins-page-tag" style={{ color: colorForTag(tag), borderColor: `${colorForTag(tag)}30`, background: `${colorForTag(tag)}10` }}>
                            {tag}
                          </span>
                          <ArrowUpRight size={15} className="ins-page-card-arrow" />
                        </div>
                        <h3 className="ins-page-card-title">{post.title}</h3>
                        <p className="ins-page-card-excerpt">{post.excerpt}</p>
                        <div className="ins-page-card-footer">
                          <span className="ins-page-meta-date">{formatDate(post.publishedAt)}</span>
                          <div className="ins-page-meta-read-row">
                            <Clock size={12} />
                            <span>{readTimeFor(post)} read</span>
                          </div>
                        </div>
                        <div className="ins-page-card-line" style={{ background: `linear-gradient(90deg, ${colorForTag(tag)}, transparent)` }} />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Newsletter CTA */}
      <section className="ins-page-newsletter">
        <div className="ins-page-container">
          <div className="ins-page-newsletter-inner">
            <div>
              <h2 className="ins-page-newsletter-title">Stay ahead of the curve.</h2>
              <p className="ins-page-newsletter-desc">Get our best insights delivered weekly. No fluff, no spam — just frameworks that work.</p>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </main>
  );
}

// Newsletter signup — posts to the leads API (source: newsletter), like the footer.
function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | done | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');
    try {
      const name = email.split('@')[0] || 'Subscriber';
      await submitLead({ name, email, source: 'newsletter' });
      setStatus('done');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'done') {
    return <p className="ins-page-newsletter-desc">Thanks — you&apos;re on the list!</p>;
  }

  return (
    <form className="ins-page-newsletter-form" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="your@email.com"
        className="ins-page-newsletter-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit" className="ins-page-newsletter-btn" disabled={status === 'loading'}>
        {status === 'loading' ? '…' : 'Subscribe'}
      </button>
      {status === 'error' && (
        <span className="dash-error" style={{ fontSize: 12 }}>Something went wrong.</span>
      )}
    </form>
  );
}
