'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import './case-studies.css';

const cases = [
  {
    id: 1,
    title: 'Bringing the Mega Growth Brand to Life Through Visual Storytelling',
    category: 'Brand Strategy & Visuals',
    image: '/team.jpeg',
    link: '/case-studies',
  },
  {
    id: 2,
    title: 'A Nigerian Fashion Brand That Made People Come Back: How Àlàyò Hit 500% ROAS',
    category: 'E-Commerce Growth & Paid Ads',
    image: '/structure.jpg',
    link: '/case-studies',
  },
  {
    id: 3,
    title: 'A 25-Year Legacy of Legal Excellence Transformed Into a Digital Law Firm Presence',
    category: 'Digital Transformation',
    image: '/ai.jpeg',
    link: '/case-studies',
  },
];

export default function CaseStudies() {
  return (
    <section className="cs-section">
      <div className="cs-glow" />

      <div className="cs-container">
        {/* Header matching Image 3 */}
        <motion.div
          className="cs-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="cs-badge">Case Studies</span>
          <h2 className="cs-title">
            Real Results from Our Client<br />
            <span className="cs-title-accent">Projects</span>
          </h2>
          <p className="cs-subtitle">
            See how we deliver results for businesses through strategic thinking, creative execution, and high-impact digital solutions.
          </p>
        </motion.div>

        {/* Cards Grid matching Image 3 */}
        <div className="cs-grid">
          {cases.map((c, i) => (
            <motion.article
              key={c.id}
              className={`cs-ref-card ${i === 1 ? "cs-middle-card" : ""}`}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
            >
              <div className="cs-ref-img-box">
                <Image
                  src={c.image}
                  alt={c.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="cs-ref-img"
                />
                <div className="cs-ref-img-overlay" />
              </div>

              <div className="cs-ref-body">
                <h3 className="cs-ref-card-title">{c.title}</h3>
                <div className="cs-ref-footer">
                  <Link href={c.link} className="cs-ref-btn">
                    View Project <ArrowRight size={14} style={{ marginLeft: 4 }} />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Pagination Dots & All Case Studies CTA button matching Image 3 */}
        <div className="cs-ref-pagination-bar">
          <div className="cs-ref-dots">
            <span className="cs-ref-dot" />
            <span className="cs-ref-dot" />
            <span className="cs-ref-dot cs-ref-dot-active" />
            <span className="cs-ref-dot" />
            <span className="cs-ref-dot" />
          </div>

          <Link href="/case-studies" className="cs-ref-all-btn">
            All Case Studies <ArrowUpRight size={14} style={{ marginLeft: 4 }} />
          </Link>
        </div>
      </div>
    </section>
  );
}
