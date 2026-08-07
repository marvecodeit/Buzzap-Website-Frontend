'use client';
import { motion } from 'framer-motion';
import { ArrowUpRight, Clock, BookOpen } from 'lucide-react';
import Link from 'next/link';
import './insights.css';

const posts = [
  {
    tag: 'AI Marketing',
    tagColor: '#3b82f6',
    title: 'Why 78% of Leads Go Cold Before Your Team Responds',
    excerpt: 'The speed gap between a lead arriving and your team responding is costing you more deals than any ad budget can recover.',
    readTime: '4 min read',
    date: 'Jun 10, 2026',
  },
  {
    tag: 'CRM Automation',
    tagColor: '#10b981',
    title: 'How to Build a Lead Follow-Up System That Never Sleeps',
    excerpt: 'A step-by-step breakdown of the Buzzap AI follow-up architecture: what fires, when, and why it outperforms human teams.',
    readTime: '6 min read',
    date: 'Jun 5, 2026',
  },
  {
    tag: 'Growth Systems',
    tagColor: '#8b5cf6',
    title: 'The Hidden Cost of Disconnected Marketing Tools',
    excerpt: 'When your ads, CRM, and messaging don\'t talk to each other, revenue leaks silently. Here\'s how to plug every gap.',
    readTime: '5 min read',
    date: 'May 28, 2026',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, type: 'spring', stiffness: 65, damping: 16 },
  }),
};

export default function Insights() {
  return (
    <section className="ins-section">
      <div className="ins-container">
        <div className="ins-header">
          <span className="ins-badge">
            <BookOpen size={13} />
            Insights & Blog
          </span>
          <h2 className="ins-title">
            Think smarter. <span className="ins-title-glow">Grow faster.</span>
          </h2>
          <p className="ins-subtitle">
            Deep-dive guides, frameworks, and real-world playbooks for AI-driven business growth.
          </p>
        </div>

        <div className="ins-grid">
          {posts.map((post, i) => (
            <motion.article
              key={i}
              className="ins-card"
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -6, borderColor: `${post.tagColor}30` }}
              style={{ '--ins-accent': post.tagColor }}
            >
              <div className="ins-card-top">
                <span className="ins-tag" style={{ color: post.tagColor, background: `${post.tagColor}12`, borderColor: `${post.tagColor}25` }}>
                  {post.tag}
                </span>
                <ArrowUpRight size={16} className="ins-card-arrow" />
              </div>

              <h3 className="ins-card-title">{post.title}</h3>
              <p className="ins-card-excerpt">{post.excerpt}</p>

              <div className="ins-card-footer">
                <span className="ins-card-date">{post.date}</span>
                <div className="ins-card-read">
                  <Clock size={13} />
                  <span>{post.readTime}</span>
                </div>
              </div>

              <div className="ins-card-line" style={{ background: `linear-gradient(90deg, ${post.tagColor}, transparent)` }} />
            </motion.article>
          ))}
        </div>

        <div className="ins-cta-row">
          <Link href="/insights" className="ins-view-all">
            View all insights
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
