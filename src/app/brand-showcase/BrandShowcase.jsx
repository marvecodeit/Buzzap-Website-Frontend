'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import LazyVideo from '@/components/LazyVideo';
import { ArrowLeft, ArrowRight, Sparkles, Layers, Palette, Eye } from 'lucide-react';
import './brand-showcase.css';

const slides = [
  {
    id: 1,
    brand: 'Buzzap Innovations',
    category: 'Brand Identity & Design System',
    result: 'Visual Authority & Design Tokens',
    stat: '100%',
    statLabel: 'Bespoke Brand Assets',
    description: 'A curated visual identity system featuring custom typography, dark-mode glassmorphic cards, vibrant color accents, and structured brand guidelines.',
    image: '/buzz.jpeg',
    video: null,
    accent: '#818cf8',
    tags: ['Brand Identity', 'Design System', 'Typography', 'Dark Mode'],
  },
  {
    id: 2,
    brand: 'Buzzap Motion Lab',
    category: 'Motion Graphics & UI Aesthetics',
    result: 'Dynamic Micro-Animations & AI Interface',
    stat: '60 FPS',
    statLabel: 'Fluid Motion Graphics',
    description: 'Interactive motion graphics, fluid video loops, and conversational AI interface graphics designed to engage prospects instantly.',
    image: '/ai.jpeg',
    video: '/1782395025815.mp4',
    accent: '#c084fc',
    tags: ['Motion Design', 'AI Interface', 'Micro-Animations', 'UI/UX'],
  },
  {
    id: 3,
    brand: 'Buzzap Creative Studio',
    category: 'Visual Storytelling & Ad Assets',
    result: 'High-Impact Campaign Creatives',
    stat: '500%',
    statLabel: 'Visual Engagement',
    description: 'High-converting ad assets, social media visual systems, and brand storytelling graphics built to dominate digital channels.',
    image: '/product4.jpeg',
    video: null,
    accent: '#10b981',
    tags: ['Visual Storytelling', 'Ad Creatives', 'Social Branding', 'Asset Library'],
  },
  {
    id: 4,
    brand: 'Buzzap Product Systems',
    category: 'Digital Product & Web Aesthetics',
    result: 'High-Converting Web Architecture',
    stat: '3.5×',
    statLabel: 'Conversion Scale',
    description: 'Sleek dark-theme layouts, responsive visual cards, and state-of-the-art frontend design engineered for modern enterprise websites.',
    image: '/seo.jpg',
    video: null,
    accent: '#f59e0b',
    tags: ['Web Design', 'Component Library', 'Design Tokens', 'Product Identity'],
  },
];

export default function BrandShowcase() {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);

  const next = () => { setDir(1); setActive((p) => (p + 1) % slides.length); };
  const prev = () => { setDir(-1); setActive((p) => (p - 1 + slides.length) % slides.length); };

  useEffect(() => {
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, []);

  const slide = slides[active];

  return (
    <section className="bs-section">
      <div className="bs-bg-glow" />

      <div className="bs-container">
        {/* Header */}
        <motion.div
          className="bs-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="bs-badge">
            <Sparkles size={12} style={{ marginRight: 6 }} />
            Brand Assets & Visual Identity Prowess
          </span>
          <h2 className="bs-title">
            Showcasing Buzzap&apos;s Brand<br />
            <span className="bs-title-accent">&amp; Visual Identity System</span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '15px', marginTop: '12px', maxWidth: '600px', margin: '12px auto 0' }}>
            A showcase of our brand assets, motion design capabilities, and high-impact visual craftsmanship.
          </p>
        </motion.div>

        {/* Main slide */}
        <div className="bs-slide-wrapper">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={active}
              className="bs-slide"
              custom={dir}
              initial={{ opacity: 0, x: dir * 80, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: dir * -80, scale: 0.96 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ '--bs-accent': slide.accent }}
            >
              {/* Media Column (Video / Image) */}
              <div className="bs-img-col">
                <div className="bs-img-card">
                  {slide.video ? (
                    <LazyVideo src={slide.video} poster={slide.image} alt={slide.brand} className="bs-video" />
                  ) : (
                    <Image
                      src={slide.image}
                      alt={slide.brand}
                      fill
                      sizes="(max-width: 900px) 100vw, 45vw"
                      className="bs-img"
                    />
                  )}
                  <div className="bs-img-overlay" />
                  <div className="bs-big-stat">
                    <div className="bs-big-stat-value" style={{ color: slide.accent }}>{slide.stat}</div>
                    <div className="bs-big-stat-label">{slide.statLabel}</div>
                  </div>
                </div>
              </div>

              {/* Text Column */}
              <div className="bs-text-col">
                <div className="bs-brand-row">
                  <span className="bs-brand-name">{slide.brand}</span>
                  <span className="bs-category">{slide.category}</span>
                </div>

                <h3 className="bs-result" style={{ color: slide.accent }}>{slide.result}</h3>
                <p className="bs-description">{slide.description}</p>

                <div className="bs-tags">
                  {slide.tags.map((t) => (
                    <span key={t} className="bs-tag" style={{
                      borderColor: `${slide.accent}35`,
                      color: slide.accent,
                      background: `${slide.accent}12`
                    }}>{t}</span>
                  ))}
                </div>

                <div className="bs-impact-row">
                  <Palette size={14} style={{ color: slide.accent }} />
                  <span>Engineered with Buzzap&apos;s Design System &amp; Brand Tokens</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="bs-nav">
            <button className="bs-nav-btn" onClick={prev} aria-label="Previous">
              <ArrowLeft size={16} />
            </button>
            <div className="bs-dots">
              {slides.map((_, i) => (
                <button
                  key={i}
                  className={`bs-dot ${i === active ? 'bs-dot-active' : ''}`}
                  onClick={() => { setDir(i > active ? 1 : -1); setActive(i); }}
                  aria-label={`Slide ${i + 1}`}
                  style={i === active ? { background: slides[i].accent, width: '24px' } : {}}
                />
              ))}
            </div>
            <button className="bs-nav-btn" onClick={next} aria-label="Next">
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
