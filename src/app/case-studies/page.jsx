'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Clock, Users, Zap } from 'lucide-react';
import Link from 'next/link';
import { getCaseStudies } from '@/lib/api';
import './case-studies.css';

const iconMap = { TrendingUp, Clock, Users, Zap };

const defaultStudies = [
  {
    industry: 'Real Estate',
    company: 'UrbanNest Group',
    headline: '$4.2M in new pipeline generated in 90 days.',
    challenge: 'UrbanNest had 3 agents, a basic website form, and no system for following up on leads. Ad spend was generating enquiries but 70% went unanswered for over 12 hours.',
    solution: 'We built a full AI lead system: Meta ad campaigns with AI creative testing, a WhatsApp automation sequence that responded within 3 minutes, Zoho CRM enrichment on every lead, and a booking flow via Cal.com that put qualified prospects directly in an agent\'s calendar.',
    results: [
      { iconName: 'TrendingUp', value: '$4.2M', label: 'New sales pipeline created' },
      { iconName: 'Clock', value: '3 min', label: 'Average lead response time' },
      { iconName: 'Users', value: '89%', label: 'Lead contact rate' },
      { iconName: 'Zap', value: '3x', label: 'Faster sales cycle' },
    ],
    quote: 'Buzzap replaced four agencies and three freelancers. One team, one system, and we tripled our lead volume.',
    author: 'Chinwe A. — Founder, UrbanNest Group',
    tag: 'Full AI Growth System',
    color: '#10b981',
  },
  {
    industry: 'E-Commerce',
    company: 'RetailPulse',
    headline: '340% ROI increase in the first 90 days.',
    challenge: 'RetailPulse was running Facebook ads without any post-click automation. Leads filled a form, landed in a spreadsheet, and waited for a sales rep to manually follow up — sometimes days later.',
    solution: 'We deployed AI-powered email and SMS sequences triggered the instant a lead submitted. An AI agent on WhatsApp qualified leads before human handoff. We rebuilt their ad creative strategy using dynamic AI testing to cut cost per lead by 44%.',
    results: [
      { iconName: 'TrendingUp', value: '340%', label: 'Return on investment' },
      { iconName: 'Users', value: '2,400', label: 'Leads converted in 90 days' },
      { iconName: 'Clock', value: '6 min', label: 'Average follow-up time' },
      { iconName: 'Zap', value: '44%', label: 'Lower cost per lead' },
    ],
    quote: 'The AI follow-up system alone paid for the entire engagement in the first month.',
    author: 'James K. — CEO, RetailPulse',
    tag: 'AI Marketing + Automation',
    color: '#3b82f6',
  },
  {
    industry: 'SaaS',
    company: 'Flowmatic HQ',
    headline: 'Sales cycle reduced from 14 days to 3.',
    challenge: 'Flowmatic had 5 disconnected tools — HubSpot, Mailchimp, Typeform, Calendly, and Slack — none of which talked to each other. Leads slipped through handoffs and the team spent hours on manual admin.',
    solution: 'We consolidated their entire stack into one automated system using Make.com as the backbone, Zoho CRM as the single source of truth, and a custom AI SDR agent trained on their product to handle initial qualification calls via Vapi.',
    results: [
      { iconName: 'TrendingUp', value: '98%', label: 'Client retention rate' },
      { iconName: 'Zap', value: '78%', label: 'Faster sales cycle' },
      { iconName: 'Users', value: '5 → 1', label: 'Tools consolidated' },
      { iconName: 'Clock', value: '12h', label: 'Admin time saved weekly' },
    ],
    quote: 'What I valued most was the clarity. They told us exactly what was broken and delivered precisely that fix.',
    author: 'Sarah M. — Marketing Director, Flowmatic HQ',
    tag: 'Systems Integration',
    color: '#8b5cf6',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] } }),
};

export default function CaseStudiesPage() {
  const [studiesList, setStudiesList] = useState(defaultStudies);

  useEffect(() => {
    getCaseStudies()
      .then((data) => {
        if (data.caseStudies && data.caseStudies.length > 0) {
          setStudiesList(data.caseStudies);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <main className="csp-page">

      {/* Hero */}
      <section className="csp-hero">
        <div className="csp-hero-glow" />
        <div className="csp-container">
          <motion.span className="csp-label" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            Case Studies
          </motion.span>
          <motion.h1 className="csp-hero-title" variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            Real businesses.<br />
            <span className="csp-muted">Documented results.</span>
          </motion.h1>
          <motion.p className="csp-hero-desc" variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            These aren&apos;t projections or estimates. They&apos;re real outcomes from real clients
            — with the challenges, solutions, and numbers behind each one.
          </motion.p>
        </div>
      </section>

      {/* Case studies */}
      <section className="csp-studies-section">
        <div className="csp-container">
          {studiesList.map((study, i) => (
            <motion.div
              key={study._id || i}
              className="csp-study"
              style={{ '--csp-accent': study.color || '#818cf8' }}
              variants={fadeUp}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              <div className="csp-study-header">
                <div className="csp-study-meta">
                  <span className="csp-industry-tag" style={{ color: study.color || '#818cf8', borderColor: `${study.color || '#818cf8'}30`, background: `${study.color || '#818cf8'}0f` }}>
                    {study.industry}
                  </span>
                  <span className="csp-system-tag">{study.tag || 'Case Study'}</span>
                </div>
                <h2 className="csp-company">{study.company}</h2>
                <p className="csp-headline">{study.headline}</p>
              </div>

              <div className="csp-study-body">
                <div className="csp-study-text">
                  <div className="csp-text-block">
                    <span className="csp-text-label">The challenge</span>
                    <p className="csp-text-content">{study.challenge}</p>
                  </div>
                  <div className="csp-text-block">
                    <span className="csp-text-label">What we built</span>
                    <p className="csp-text-content">{study.solution}</p>
                  </div>
                  {study.quote && (
                    <blockquote className="csp-quote">
                      <p>&ldquo;{study.quote}&rdquo;</p>
                      {study.author && <cite>{study.author}</cite>}
                    </blockquote>
                  )}
                </div>

                <div className="csp-results-panel">
                  <span className="csp-results-label">Results</span>
                  <div className="csp-results-grid">
                    {(study.results || []).map((r, ri) => {
                      const IconComponent = iconMap[r.iconName] || TrendingUp;
                      return (
                        <div key={ri} className="csp-result-item">
                          <IconComponent size={14} className="csp-result-icon" />
                          <div className="csp-result-value">{r.value}</div>
                          <div className="csp-result-label">{r.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="csp-cta-section">
        <div className="csp-container">
          <div className="csp-cta-inner">
            <span className="csp-label">Get similar results</span>
            <h2 className="csp-cta-title">
              Your case study<br />
              <span className="csp-muted">starts with one call.</span>
            </h2>
            <p className="csp-cta-desc">
              Book a free audit and we&apos;ll map out what a Buzzap growth system would look
              like for your specific business — with projected outcomes.
            </p>
            <Link href="/booking" className="csp-btn-primary">
              Book a Free Audit <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
