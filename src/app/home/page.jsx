'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, Play, Sparkles, TrendingUp, Users, Zap, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/lib/language-context';
import './homePage.css';

/* ── Animated counter hook ── */
function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

/* ── Word-by-word reveal ── */
const RevealWord = ({ text, delay }) => (
  <motion.span
    className="hero-word"
    initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    {text}{' '}
  </motion.span>
);

/* ── 3D floating card (GPU accelerated) ── */
function FloatingCard({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={`hero-float-card ${className}`}
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.9 + delay * 0.15, ease: [0.16, 1, 0.3, 1] }}
      style={{ animationDelay: `${delay * 0.4}s` }}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const canvasRef = useRef(null);
  const [started, setStarted] = useState(false);
  const roi = useCountUp(340, 1800, started);
  const leads = useCountUp(2400, 2000, started);
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), 1400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    // Throttle particles count for 60 FPS compositor smoothness & 0ms blocking
    const count = w < 768 ? 15 : 35;
    const dots = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      alpha: Math.random() * 0.25 + 0.05,
      hue: Math.random() > 0.6 ? 250 : 220,
    }));

    let raf;
    let lastTime = 0;
    const draw = (now) => {
      // Limit canvas draw calls to 30 FPS to free up main thread for hydration
      if (!lastTime || now - lastTime > 32) {
        lastTime = now;
        ctx.clearRect(0, 0, w, h);
        dots.forEach((d) => {
          d.x += d.vx; d.y += d.vy;
          if (d.x < 0) d.x = w; if (d.x > w) d.x = 0;
          if (d.y < 0) d.y = h; if (d.y > h) d.y = 0;
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${d.hue}, 80%, 70%, ${d.alpha})`;
          ctx.fill();
        });
      }
      raf = requestAnimationFrame(draw);
    };

    // Delay particle loop start by 300ms to allow hydration to finish uninterrupted
    const startTimer = setTimeout(() => {
      raf = requestAnimationFrame(draw);
    }, 300);

    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(startTimer);
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <main className="hero-viewport-container">
      <canvas ref={canvasRef} className="hero-particles-canvas" />

      {/* Aurora orbs */}
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-orb hero-orb-3" />
      <div className="cyber-grid-overlay" />
      <div className="hero-noise" />

      <div className="mainWrapper">
        <div className="hero-split">

          {/* ── LEFT: Text content ── */}
          <div className="hero-left">

            <motion.div
              className="feature-pill-badge"
              initial={{ opacity: 0, scale: 0.85, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Sparkles size={12} className="badge-spark" />
              <span className="badge-text">{t('hero.badge', 'AI Growth Infrastructure — Now Live')}</span>
              <div className="badge-arrow-box"><ArrowRight size={11} /></div>
            </motion.div>

            <h1 className="hero-headline">
              {t('hero.titleLine1', 'Engineered AI systems that')}
              <br />
              <span className="hero-headline-glow">
                {t('hero.titleLine2', 'work while you don\'t.')}
              </span>
            </h1>

            <p className="hero-subheadline">
              {t('hero.subtitle', 'Buzzap deploys AI-powered marketing, CRM automation, and SEO growth infrastructure that generates leads, nurtures prospects, and scales your revenue — automatically.')}
            </p>

            <div className="cta-buttons">
              <Link href="/booking" className="btn-primary-action">
                <span>{t('hero.ctaPrimary', 'Book a Free Call')}</span>
                <ArrowRight size={15} />
              </Link>
              <Link href="/demo" className="btn-video-demo">
                <div className="play-icon-circle">
                  <Play size={10} fill="#fff" />
                </div>
                {t('nav.demo', 'Watch Demo')}
              </Link>
            </div>

            {/* Trust row */}
            <div className="brand-trust-footer">
              <p className="trust-heading">Trusted by 500+ companies worldwide</p>
              <div className="trust-logos-row">
                {['Stripe', 'Notion', 'Linear', 'Vercel', 'Figma'].map((b) => (
                  <span className="trust-logo" key={b}>{b}</span>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Visual dashboard ── */}
          <div className="hero-right">

            {/* Main image card */}
            <div className="hero-img-card">
              <Image
                src="/allwork.jpg"
                alt="AI Growth Dashboard"
                fill
                sizes="(max-width: 480px) 92vw, (max-width: 768px) 80vw, 450px"
                quality={68}
                className="hero-img"
                priority
                fetchPriority="high"
              />
              <div className="hero-img-overlay" />

              {/* Overlay label */}
              <div className="hero-img-label">
                <Zap size={12} />
                <span>AI-Powered Growth Engine</span>
              </div>
            </div>

            {/* Floating stat card — ROI */}
            <FloatingCard delay={0} className="hero-stat-card hero-stat-card-roi">
              <div className="hsc-icon-wrap hsc-icon-green">
                <TrendingUp size={14} />
              </div>
              <div>
                <div className="hsc-value">{roi}%</div>
                <div className="hsc-label">Average ROI</div>
              </div>
              <div className="hsc-sparkline">
                {[40, 55, 45, 70, 60, 85, 80].map((h, i) => (
                  <div key={i} className="hsc-bar" style={{ height: `${h}%` }} />
                ))}
              </div>
            </FloatingCard>

            {/* Floating stat card — leads */}
            <FloatingCard delay={2} className="hero-stat-card hero-stat-card-leads">
              <div className="hsc-icon-wrap hsc-icon-blue">
                <Users size={14} />
              </div>
              <div>
                <div className="hsc-value">{leads.toLocaleString()}</div>
                <div className="hsc-label">Leads Converted</div>
              </div>
              <div className="hsc-badge-green">+24% this month</div>
            </FloatingCard>

            {/* Floating checklist card */}
            <FloatingCard delay={4} className="hero-stat-card hero-stat-card-check">
              {[
                'Meta Ads campaign live',
                'CRM pipeline synced',
                'AI follow-up sequence on',
              ].map((item, i) => (
                <div className="hsc-check-item" key={i}>
                  <CheckCircle size={13} className="hsc-check-icon" />
                  <span>{item}</span>
                </div>
              ))}
            </FloatingCard>

            {/* Secondary image */}
            <motion.div
              className="hero-img-card hero-img-card-sm"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src="/ai.jpeg"
                alt="AI Solutions"
                fill
                sizes="(max-width: 900px) 100vw, 34vw"
                className="hero-img"
              />
              <div className="hero-img-overlay" />
              <div className="hero-img-label">
                <Sparkles size={11} />
                <span>AI Agents 24/7</span>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </main>
  );
}
