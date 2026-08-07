'use client';
import { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, ArrowUpRight, BarChart2, Search, Cpu, MessageSquare, PenTool, Layers, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import LazyVideo from '@/components/LazyVideo';
import './service.css';

const services = [
  {
    id: 'ai-marketing',
    icon: BarChart2,
    label: '01',
    title: 'PAID ADS & AI MARKETING',
    capability: 'PAID ADS',
    tagline: 'High-converting, hyper-targeted campaigns.',
    desc: 'High-converting, hyper-targeted campaigns across premium digital channels designed to capture attention and scale ROI through autonomous testing and instant lead distribution.',
    bullets: ['Meta & Google Ads automation', 'AI-driven ad copy and creative testing', 'Multi-channel lead capture systems', 'Automated email and SMS sequences', 'Real-time campaign performance dashboards'],
    image: '/product2.jpeg',
    video: '/services.mp4',
    color: '#818cf8',
  },
  {
    id: 'brand-boost-seo',
    icon: Search,
    label: '02',
    title: 'AI-DRIVEN SEO & BRAND BOOST',
    capability: 'AI-DRIVEN SEO',
    tagline: 'Algorithmic search positioning.',
    desc: 'Algorithmic search positioning and predictive keyword intent structures engineered to dominate traffic channels and build long-term authority.',
    bullets: ['Technical SEO audit and implementation', 'Keyword strategy and content architecture', 'Brand identity and positioning', 'Local SEO and Google Business optimisation', 'Authority link building campaigns'],
    image: '/social.jpeg',
    video: '/1782395091229 (1).mp4',
    color: '#10b981',
  },
  {
    id: 'crm-automation',
    icon: Layers,
    label: '03',
    title: 'CRM & LEAD AUTOMATION',
    capability: 'AI-LEAD GENERATION',
    tagline: 'Autonomous prospect sourcing pipelines.',
    desc: 'Autonomous prospect sourcing pipelines that automatically track, qualify, and score high-intent buyers into your pipeline 24/7.',
    bullets: ['CRM setup and full configuration', 'Automated lead routing and scoring', 'WhatsApp and SMS follow-up sequences', 'Pipeline stage automation', 'Zoho, HubSpot, and Apollo.io integrations'],
    image: '/product3.jpeg',
    video: '/1782380563471 (1).mp4',
    color: '#f59e0b',
  },
  {
    id: 'ai-agents',
    icon: Cpu,
    label: '04',
    title: 'AI VOICE AGENTS & CHATBOTS',
    capability: 'AI CUSTOMER SUPPORT',
    tagline: 'Intelligent, conversational automated engines.',
    desc: 'Intelligent, conversational automated engines delivering instant resolution to your clients around the clock across WhatsApp, Web, and Voice AI.',
    bullets: ['Custom-trained chatbots (Voiceflow, Vapi)', 'WhatsApp AI agents for instant resolution', 'Voice AI for inbound and outbound calls', 'Appointment booking automation via Cal.com', 'Handoff to human agents when needed'],
    image: '/ai.jpeg',
    video: '/voice.mp4',
    color: '#c084fc',
  },
  {
    id: 'content-strategy',
    icon: PenTool,
    label: '05',
    title: 'CONTENT & CREATIVE STRATEGY',
    capability: 'VISUAL & CONTENT AI',
    tagline: 'Content that converts.',
    desc: 'We build AI-assisted content pipelines that produce high-quality blog posts, social content, ad creative, and video scripts at scale — aligned to your brand voice.',
    bullets: ['AI-accelerated blog and SEO content', 'Social media content calendars', 'Ad copywriting and creative briefs', 'Video scripts and UGC frameworks', 'Email newsletter production'],
    image: '/product4.jpeg',
    video: '/1782395025815 (1).mp4',
    color: '#f43f5e',
  },
  {
    id: 'growth-consulting',
    icon: MessageSquare,
    label: '06',
    title: 'GROWTH CONSULTING',
    capability: 'SYSTEM ARCHITECTURE',
    tagline: 'Strategy before execution.',
    desc: 'Before we build anything, we audit where your current systems are breaking down. Our consulting engagements identify your highest-leverage opportunities.',
    bullets: ['Full business growth audit', 'Revenue gap analysis', 'AI readiness assessment', 'Custom automation roadmap', 'Monthly strategy and performance reviews'],
    image: '/buzz.jpeg',
    color: '#06b6d4',
  },
];

const processSteps = [
  { n: '01', title: 'Audit', desc: 'We analyse your current marketing, sales, and operations stack to identify where you are losing revenue.' },
  { n: '02', title: 'Architect', desc: 'We design a custom growth system — selecting the right tools, automations, and channels for your business.' },
  { n: '03', title: 'Build', desc: 'Our team deploys your AI infrastructure end-to-end — CRM, ads, automations, agents, and content systems.' },
  { n: '04', title: 'Optimise', desc: 'We monitor performance weekly and continuously refine every lever — so your results compound over time.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  visible: (i = 0) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  }),
};

/* 3D tilt card */
function TiltCard({ children, className = '' }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 25 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 25 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0); y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}

export default function ServicesPage({ isHomepage = false }) {
  return (
    <main className={`svc-page ${isHomepage ? 'svc-homepage-embed' : ''}`}>

      {/* Hero / Section Header */}
      {isHomepage ? (
        <section className="svc-section-header">
          <div className="svc-container" style={{ textAlign: 'center', paddingTop: '90px', paddingBottom: '30px' }}>
            <motion.span className="svc-label" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              Core Capabilities
            </motion.span>
            <motion.h2 className="svc-section-title" style={{ fontSize: 'clamp(32px, 4.5vw, 56px)', marginBottom: '16px' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
              AI Infrastructure Built For<br />
              <span className="svc-hero-muted">Infinite Scale</span>
            </motion.h2>
            <motion.p className="svc-hero-desc" style={{ margin: '0 auto 40px', maxWidth: '640px' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}>
              Modular AI solutions engineered to capture leads, automate workflows, and accelerate pipeline velocity.
            </motion.p>
          </div>
        </section>
      ) : (
        <section className="svc-hero">
          <div className="svc-hero-glow" />
          <div className="svc-hero-grid" />
          <div className="svc-hero-inner">
            <motion.span className="svc-label" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              Services
            </motion.span>
            <motion.h1 className="svc-hero-title" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
              Everything your business needs<br />
              <span className="svc-hero-muted">to grow on autopilot.</span>
            </motion.h1>
            <motion.p className="svc-hero-desc" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}>
              Buzzap combines AI marketing, SEO, CRM automation, and intelligent agents into one
              cohesive growth system — built specifically for your business.
            </motion.p>
            <motion.div className="svc-hero-actions" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3}>
              <Link href="/booking" className="svc-btn-primary">Get a Free Audit <ArrowRight size={16} /></Link>
              <Link href="/case-studies" className="svc-btn-ghost">View case studies <ArrowUpRight size={16} /></Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Services grid */}
      <section className="svc-grid-section">
        <div className="svc-container">
          <div className="svc-grid">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.id}
                  id={s.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.08 }}
                  variants={fadeUp}
                  custom={i % 2}
                >
                  <TiltCard className="svc-card">
                    {/* Media Header (Motion Graphic / Image) */}
                    <div className="svc-card-img-wrap" style={{ '--svc-color': s.color }}>
                      {s.video ? (
                        <LazyVideo src={s.video} poster={s.image} alt={s.title} className="svc-card-video" />
                      ) : (
                        <Image src={s.image} alt={s.title} fill className="svc-card-img" sizes="(max-width: 768px) 100vw, 50vw" />
                      )}
                      <div className="svc-card-img-overlay" />

                      <div className="svc-card-img-label">
                        <div className="svc-card-icon">
                          <Icon size={16} strokeWidth={1.5} />
                        </div>
                        <span className="svc-capability-tag">{s.capability}</span>
                        <span className="svc-card-num">{s.label}</span>
                      </div>
                    </div>

                    <div className="svc-card-body">
                      <h3 className="svc-card-title" style={{ '--svc-color': s.color }}>{s.title}</h3>
                      <p className="svc-card-tagline" style={{ color: s.color }}>{s.tagline}</p>
                      <p className="svc-card-desc">{s.desc}</p>
                      <ul className="svc-bullets">
                        {s.bullets.map((b, bi) => (
                          <li key={bi}>
                            <CheckCircle size={12} className="svc-check" style={{ color: s.color }} />
                            {b}
                          </li>
                        ))}
                      </ul>
                      <div className="svc-card-footer">
                        <Link href="/booking" className="svc-card-link" style={{ '--svc-color': s.color }}>
                          Explore Capability <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>

                    {/* Corner glow */}
                    <div className="svc-card-glow" style={{ background: `radial-gradient(circle, ${s.color}15 0%, transparent 70%)` }} />
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="svc-process-section">
        <div className="svc-container">
          <div className="svc-process-header">
            <span className="svc-label">How it works</span>
            <h2 className="svc-section-title">A process built for results,<br /><span className="svc-muted">not activity.</span></h2>
          </div>
          <div className="svc-process-grid">
            {processSteps.map((step, i) => (
              <motion.div key={i} className="svc-step" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} whileHover={{ y: -4 }}>
                <span className="svc-step-num">{step.n}</span>
                <h3 className="svc-step-title">{step.title}</h3>
                <p className="svc-step-desc">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA (only when not homepage embed) */}
      {!isHomepage && (
        <section className="svc-cta-section">
          <div className="svc-container">
            <div className="svc-cta-inner">
              <span className="svc-label">Ready to start</span>
              <h2 className="svc-section-title">Let&apos;s build your<br /><span className="svc-muted">growth system.</span></h2>
              <p className="svc-cta-desc">Book a free 30-minute strategy call. We&apos;ll audit your current setup and show you exactly where you&apos;re leaving revenue on the table.</p>
              <Link href="/booking" className="svc-btn-primary">Book a Free Call <ArrowRight size={16} /></Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
