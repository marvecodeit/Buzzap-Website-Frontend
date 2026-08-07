'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Unplug, TrendingDown, ChevronDown } from 'lucide-react';
import './problem.css';

const pains = [
  {
    id: 'follow-up',
    icon: Clock,
    title: 'Slow Lead Follow-up',
    shortDesc: '78% of customers buy from the first business to respond.',
    stat: '78%',
    statLabel: 'buy from first responder',
    fullDesc: `78% of customers buy from the first business to respond. The average business takes 6+ hours to follow up on a new lead. By then — the lead has already spoken to three competitors and made a decision.

Speed is not a nice-to-have. It is the difference between winning and losing the deal.`,
  },
  {
    id: 'tools',
    icon: Unplug,
    title: 'Disconnected Marketing Tools',
    shortDesc: "Your ads, CRM, WhatsApp, and website don't talk to each other.",
    stat: '4+',
    statLabel: 'tools that never sync',
    fullDesc: `When your ads, CRM, WhatsApp, and website don't talk to each other — leads fall through the gaps silently.

We connect every tool into one system. A lead comes in from any channel and the right action fires automatically. Nothing slips. Nothing goes unanswered.`,
  },
  {
    id: 'revenue',
    icon: TrendingDown,
    title: 'Unpredictable Revenue',
    shortDesc: 'Feast one month. Famine the next.',
    stat: '0',
    statLabel: 'systems running for you',
    fullDesc: `Feast one month. Famine the next. It happens when growth depends on manual effort instead of a system.

We build the system that generates and nurtures leads automatically — whether your team is busy or not. Consistent input. Consistent output.`,
  },
];

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const headerVariants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function Problem() {
  const [activeId, setActiveId] = useState(null);

  return (
    <section className="problem-section">
      <div className="problem-glow" />

      <div className="problem-container">
        <motion.div
          className="problem-header"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.span className="problem-badge" variants={headerVariants}>
            The Root Cause
          </motion.span>
          <motion.h2 className="problem-headline" variants={headerVariants}>
            You&apos;re not losing because your product is bad.
            <br />
            <span className="problem-headline-accent">You&apos;re losing because your system is broken.</span>
          </motion.h2>
        </motion.div>

        <div className="problem-cards">
          {pains.map((pain, i) => {
            const Icon = pain.icon;
            const isActive = activeId === pain.id;

            return (
              <motion.div
                key={pain.id}
                layout
                className={`problem-card ${isActive ? 'problem-card-active' : ''}`}
                onClick={() => setActiveId(isActive ? null : pain.id)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1], layout: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } }}
              >
                <div className={`problem-card-border ${isActive ? 'problem-card-border-active' : ''}`} />

                <div className="problem-card-top">
                  <div className="problem-icon-wrap">
                    <Icon size={20} strokeWidth={1.8} />
                  </div>

                  <div className="problem-card-meta">
                    <h3 className="problem-card-title">{pain.title}</h3>
                    <p className="problem-card-short">{pain.shortDesc}</p>
                  </div>

                  <motion.div
                    animate={{ rotate: isActive ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="problem-chevron"
                  >
                    <ChevronDown size={18} />
                  </motion.div>
                </div>

                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                      className="problem-card-expand"
                    >
                      <div className="problem-stat-pill">
                        <span className="problem-stat-number">{pain.stat}</span>
                        <span className="problem-stat-label">{pain.statLabel}</span>
                      </div>
                      <p className="problem-full-desc">{pain.fullDesc}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
