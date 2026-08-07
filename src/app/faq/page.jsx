'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import './faq.css';

const faqGroups = [
  {
    category: 'Getting Started',
    items: [
      {
        q: 'What exactly does Buzzap do?',
        a: 'Buzzap is an AI agency that builds growth systems for businesses — combining paid ads, AI-powered lead automation, SEO, brand strategy, and CRM infrastructure. We don\'t just run campaigns. We build the end-to-end machine that generates and converts leads without your team having to manage it manually.',
      },
      {
        q: 'How is Buzzap different from a traditional marketing agency?',
        a: 'Traditional agencies manage channels in silos — one team for ads, another for email, another for SEO. Buzzap integrates everything into one connected system: your ads capture leads, AI follows up within minutes, your CRM is enriched automatically, and qualified prospects land directly in your calendar. We measure everything by revenue output, not impressions or clicks.',
      },
      {
        q: 'What size businesses do you work with?',
        a: 'We work with growth-stage businesses from $500K to $20M in annual revenue — typically with 2 to 50 employees. The Starter plan is built for founders just systemising their first pipeline. The Scale and Enterprise plans are built for teams that need deeper integration and multi-channel infrastructure.',
      },
    ],
  },
  {
    category: 'Services & Capabilities',
    items: [
      {
        q: 'What services are included?',
        a: 'Services include: AI Marketing (Meta & Google campaigns with AI creative testing), Brand Boost & SEO (technical SEO, authority content, backlink strategy), CRM & Lead Automation (Zoho or HubSpot setup, AI follow-up sequences, lead enrichment), AI Agents & Chatbots (WhatsApp, website, and phone AI agents), Content & Creative Strategy, and Growth Consulting for teams that need strategic advisory.',
      },
      {
        q: 'Do you run paid ads?',
        a: 'Yes. We build and manage Meta (Facebook/Instagram) and Google ad campaigns with AI-generated creative, dynamic audience segmentation, and automated scaling logic. We don\'t just set campaigns and leave them — we run weekly optimisation loops and test creative variations continuously.',
      },
      {
        q: 'How does the AI lead follow-up work?',
        a: 'When a lead enters your system (via ad, form, or organic), our automation fires within 60 seconds. They receive a personalised message via WhatsApp, SMS, or email. An AI agent qualifies them with a short conversation. Qualified leads are booked directly into your calendar. Unqualified leads enter a nurture sequence. Nothing requires manual intervention.',
      },
      {
        q: 'What tools and platforms do you integrate with?',
        a: 'We build on the best-in-class stack: Zoho CRM, HubSpot, Make.com, Voiceflow, Vapi (AI phone agents), WhatsApp Business API, Cal.com, Apollo.io, Instantly (cold outreach), Brevo, Clay (data enrichment), and all major ad platforms. If you\'re already using a tool, we work with it or migrate you to a better one.',
      },
    ],
  },
  {
    category: 'Results & Timeline',
    items: [
      {
        q: 'How quickly will I see results?',
        a: 'The automation infrastructure is typically live within 14 days. Ad campaigns go live in week 2. Most clients see measurable lead volume increase within 30 days. Significant ROI — meaning your engagement cost is covered by deals closed — is typically visible within 60 to 90 days. We show you projected outcomes in your onboarding call before you commit.',
      },
      {
        q: 'Can you guarantee results?',
        a: 'We don\'t make guarantees, and any agency that does is not being honest with you. What we do: show you real documented outcomes from comparable clients, give you projected ranges based on your industry and funnel, and structure our Scale and Enterprise plans around milestones. If the system isn\'t producing, we diagnose and fix it — that\'s what our monthly retainer covers.',
      },
      {
        q: 'How do you measure and report on performance?',
        a: 'You get a live reporting dashboard connected to your ad accounts, CRM, and automation tools. We send a written performance summary every month with cost per lead, contact rate, booked calls, pipeline generated, and deals closed (where visible). We track what moves revenue, not vanity metrics.',
      },
    ],
  },
  {
    category: 'Pricing & Contracts',
    items: [
      {
        q: 'What are your pricing plans?',
        a: 'Starter at $1,200/month covers one core automation flow, basic CRM setup, and monthly strategy calls. Scale at $2,800/month covers multi-channel ads, full CRM build, AI follow-up sequences, and weekly reporting. Enterprise at $5,500/month is fully custom — AI phone agents, SDR automation, advanced integrations, and a dedicated growth manager.',
      },
      {
        q: 'Is there a minimum commitment?',
        a: 'Starter and Scale plans require a 3-month minimum. Enterprise is a 6-month minimum. This isn\'t to lock you in — it\'s because the system typically takes 60 to 90 days to show full ROI, and we won\'t take on a client we can\'t genuinely help. After the minimum period, you continue month-to-month with 30 days notice.',
      },
      {
        q: 'Do you offer a free trial or audit?',
        a: 'We offer a free growth audit call — 45 minutes where we review your current funnel, identify the biggest gaps, and show you exactly what we\'d build. If we don\'t think we can deliver meaningful results for your business, we\'ll tell you on the call. Book one at the link below.',
      },
    ],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.45, ease: [0.16, 1, 0.3, 1] } }),
};

export default function FAQPage() {
  const [openItem, setOpenItem] = useState(null);

  const toggle = (key) => setOpenItem(openItem === key ? null : key);

  return (
    <main className="faq-page">

      {/* Hero */}
      <section className="faq-hero">
        <div className="faq-hero-glow" />
        <div className="faq-container">
          <motion.span className="faq-label" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            FAQ
          </motion.span>
          <motion.h1 className="faq-title" variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            Common questions,<br />
            <span className="faq-muted">direct answers.</span>
          </motion.h1>
          <motion.p className="faq-desc" variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            Everything you need to know about Buzzap — our services, how we work,
            what to expect, and what we cost.
          </motion.p>
        </div>
      </section>

      {/* FAQ Groups */}
      <section className="faq-body">
        <div className="faq-container">
          {faqGroups.map((group, gi) => (
            <motion.div
              key={gi}
              className="faq-group"
              variants={fadeUp}
              custom={gi * 0.5}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              <div className="faq-group-label">{group.category}</div>
              <div className="faq-group-items">
                {group.items.map((item, ii) => {
                  const key = `${gi}-${ii}`;
                  const isOpen = openItem === key;
                  return (
                    <div key={ii} className={`faq-item ${isOpen ? 'open' : ''}`}>
                      <button className="faq-question" onClick={() => toggle(key)} aria-expanded={isOpen}>
                        <span>{item.q}</span>
                        <ChevronDown size={16} className="faq-chevron" />
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                            className="faq-answer-wrap"
                          >
                            <p className="faq-answer">{item.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="faq-cta-section">
        <div className="faq-container">
          <div className="faq-cta-inner">
            <span className="faq-label">Still have questions?</span>
            <h2 className="faq-cta-title">
              Talk to the team<br />
              <span className="faq-muted">before you commit.</span>
            </h2>
            <p className="faq-cta-desc">
              Book a free 45-minute audit call. We&apos;ll walk through your current funnel,
              answer every question you have, and tell you honestly whether Buzzap is
              the right fit.
            </p>
            <Link href="/booking" className="faq-btn-primary">
              Book a Free Audit <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
