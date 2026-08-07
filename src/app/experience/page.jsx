'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Target, ChevronsUpDown, BarChart3, Binary, ArrowUpRight } from 'lucide-react';
import './experience.css';

/* ── Animated counter ── */
function AnimatedCounter({ target, prefix = '', suffix = '', duration = 2200 }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let startTime = null;
    const numTarget = typeof target === 'string' ? parseFloat(target.replace(/[^0-9.]/g, '')) : target;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * numTarget));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  const display = typeof target === 'string' && target.includes('.')
    ? `${prefix}${count.toFixed(0)}M${suffix}`
    : `${prefix}${count}${suffix}`;

  return <span ref={ref}>{display}</span>;
}

const metricStats = [
  {
    title: '500', prefix: '', suffix: '+',
    label: 'Brands Transformed',
    icon: Binary,
    desc: 'Across 40+ industries worldwide',
    color: '#818cf8',
    bg: 'rgba(99,102,241,0.08)',
    border: 'rgba(99,102,241,0.2)',
  },
  {
    title: '120', prefix: '$', suffix: 'M',
    label: 'Revenue Generated',
    icon: ChevronsUpDown,
    desc: 'For our clients in the past 3 years',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.2)',
    highlight: true
  },
  {
    title: '340', prefix: '', suffix: '%',
    label: 'Avg. ROI Increase',
    icon: BarChart3,
    desc: 'Average across all active clients',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.2)',
  },
  {
    title: '98', prefix: '', suffix: '%',
    label: 'Client Retention',
    icon: Target,
    desc: 'Because results speak for themselves',
    color: '#c084fc',
    bg: 'rgba(192,132,252,0.08)',
    border: 'rgba(192,132,252,0.2)',
  },
];

const technologyTags = [
  "NEURAL NETWORKS", "DEEP LEARNING MODELS", "PREDICTIVE INTELLIGENCE",
  "AUTONOMOUS AGENTS", "CRM AUTOMATION", "AI-UGC PIPELINES",
  "OMNICHANNEL CHATBOTS", "LEAD QUALIFICATION ENGINES", "DATA-DRIVEN GROWTH",
  "SEO AUTHORITY BUILDING", "VOICE AI", "BRAND SYSTEMS",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 60, damping: 14 } }
};

export default function Experience() {
  const marqueeRef = useRef(null);
  const marqueeGroupRef = useRef(null);
  const spotlightRef = useRef(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    const marqueeGroup = marqueeGroupRef.current;
    if (marquee && marqueeGroup) {
      const scrollWidth = marqueeGroup.offsetWidth;
      gsap.to(marqueeGroup, {
        x: -scrollWidth,
        duration: 40,
        ease: 'none',
        repeat: -1,
        modifiers: { x: gsap.utils.unitize(x => parseFloat(x) % scrollWidth) }
      });
    }

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      gsap.to(spotlightRef.current, {
        x: clientX - 400,
        y: clientY - 400,
        duration: 0.8,
        ease: 'power3.out',
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <main className="expMain">
      <div className="expGridOverlay" />
      <div ref={spotlightRef} className="expSpotlight" />

      {/* Marquee */}
      <div className="expMarqueeWrapper">
        <div className="expMarqueeFadeLeft" />
        <div className="expMarqueeFadeRight" />
        <div ref={marqueeRef} className="expMarquee">
          <div ref={marqueeGroupRef} className="expMarqueeGroup">
            {technologyTags.map((tech, i) => (
              <span key={`t1-${i}`} className="expMarqueeTag">
                {tech} <span className="expMarqueeDot">◆</span>
              </span>
            ))}
          </div>
          <div className="expMarqueeGroup" aria-hidden="true">
            {technologyTags.map((tech, i) => (
              <span key={`t2-${i}`} className="expMarqueeTag">
                {tech} <span className="expMarqueeDot">◆</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="expContainer">
        {/* Header */}
        <motion.div
          className="expHeader"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.span variants={itemVariants} className="expBadge">GLOBAL IMPACT</motion.span>
          <motion.h1 variants={itemVariants} className="expTitle">
            Why Market Leaders <span className="expGradientText">Trust Buzzap</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="expSubtitle">
            Engineered growth pipelines for forward-thinking enterprises. Proven by data, scaled by results.
          </motion.p>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          className="expGrid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {metricStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`expCard ${stat.highlight ? 'expCardHighlight' : ''}`}
                style={{
                  '--stat-color': stat.color,
                  '--stat-bg': stat.bg,
                  '--stat-border': stat.border,
                }}
              >
                <div className="expCardBorderGlow" />

                {/* Top accent line */}
                <div className="expCardTopLine" />

                <div className="expIconWrapper">
                  <Icon className="expIcon" strokeWidth={1.5} size={24} />
                </div>

                <h3 className="expCardTitle">
                  <AnimatedCounter
                    target={stat.title}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    duration={2000}
                  />
                </h3>
                <p className="expCardLabel">{stat.label}</p>
                <p className="expCardDesc">{stat.desc}</p>

                <div className="expCardLink">
                  <span>View Case Study</span>
                  <ArrowUpRight size={15} />
                </div>

                {/* Background glow */}
                <div className="expCardInnerGlow" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </main>
  );
}
