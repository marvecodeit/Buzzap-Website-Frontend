'use client';
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Cal, { getCalApi } from '@calcom/embed-react';
import { Calendar, Clock, ShieldCheck, Zap, Send, X } from 'lucide-react';
import { submitLead } from '@/lib/api';
import './final-cta.css';

const CAL_NAMESPACE = 'free-ai-growth-strategy-call';
const CAL_LINK = 'buzzaphq/free-ai-growth-strategy-call';

const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  visible: (i = 0) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function FinalCta() {
  const [calLoaded, setCalLoaded] = useState(false);
  const [shouldInitCal, setShouldInitCal] = useState(false);
  const sectionRef = useRef(null);
  const [showFallbackModal, setShowFallbackModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldInitCal(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldInitCal) return;
    (async function () {
      try {
        const cal = await getCalApi({ namespace: CAL_NAMESPACE });
        cal('ui', {
          theme: 'dark',
          cssVarsPerTheme: {
            dark: {
              'cal-brand': '#6366f1',
              'cal-bg': '#080d1e',
              'cal-bg-subtle': '#0e172a',
              'cal-text': '#f1f5f9',
              'cal-text-subtle': '#94a3b8',
              'cal-border': 'rgba(255,255,255,0.08)',
            },
          },
          hideEventTypeDetails: false,
          layout: 'month_view',
        });
        setCalLoaded(true);
      } catch (err) {
        setCalLoaded(true);
      }
    })();
  }, [shouldInitCal]);

  const handleFallbackSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await submitLead({ ...form, service: 'Fast-Track Audit Call', source: 'booking' });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="fcta-section" id="booking-section" ref={sectionRef}>
      <div className="fcta-orb fcta-orb-left" />
      <div className="fcta-orb fcta-orb-right" />
      <div className="fcta-orb fcta-orb-center" />
      <div className="fcta-grid-overlay" />

      <div className="fcta-container" style={{ maxWidth: 1080 }}>
        <motion.div
          className="fcta-inner"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          style={{ marginBottom: 32 }}
        >
          <motion.span className="fcta-badge" variants={fadeUp} custom={0}>
            <Zap size={12} />
            Free 30-Minute Strategy Session
          </motion.span>

          <motion.h2 className="fcta-headline" variants={fadeUp} custom={1}>
            Schedule your call with <span className="fcta-headline-glow">Buzzap</span>
          </motion.h2>

          <motion.p className="fcta-desc" variants={fadeUp} custom={2}>
            Select a convenient time directly below. We&apos;ll audit your current growth funnel, identify revenue leaks, and deliver your custom AI automation roadmap.
          </motion.p>
        </motion.div>

        {/* Embedded Cal.com Frame */}
        <motion.div
          className="booking-card-frame"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'relative',
            width: '100%',
            background: 'rgba(8, 13, 30, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            padding: '16px',
            boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
            overflow: 'hidden',
          }}
        >
          {!calLoaded && (
            <div className="booking-skeleton" style={{ position: 'absolute', inset: 0, background: '#080d1e', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
              <div className="booking-skeleton-spinner" style={{ width: 40, height: 40, border: '3px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1', borderRadius: '50%' }} />
              <p style={{ fontFamily: 'sans-serif', fontSize: 14, color: '#94a3b8' }}>Loading strategy call calendar…</p>
            </div>
          )}

          {shouldInitCal && (
            <Cal
              namespace={CAL_NAMESPACE}
              calLink={CAL_LINK}
              className="booking-cal-embed"
              style={{ width: '100%', height: '100%', minHeight: '660px', border: 'none', borderRadius: '16px' }}
              config={{ layout: 'month_view', useSlotsViewOnSmallScreen: 'true' }}
            />
          )}

          <div className="booking-fallback-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(15, 23, 42, 0.8)', padding: '14px 20px', borderRadius: '0 0 16px 16px', fontSize: 13, color: '#cbd5e1', marginTop: 8 }}>
            <span>Taking too long or calendar not loading?</span>
            <button type="button" onClick={() => setShowFallbackModal(true)} style={{ background: 'rgba(99, 102, 241, 0.18)', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#818cf8', fontWeight: 700, padding: '7px 16px', borderRadius: '8px', cursor: 'pointer' }}>
              Send a 10-Second Callback Request
            </button>
          </div>
        </motion.div>
      </div>

      {/* Fallback Callback Modal */}
      {showFallbackModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(12px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ position: 'relative', background: '#080d1e', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: 32, maxWidth: 480, width: '100%' }}>
            <button type="button" onClick={() => setShowFallbackModal(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
              <X size={18} />
            </button>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '24px 12px' }}>
                <Zap size={40} style={{ color: '#10b981', marginBottom: 12 }} />
                <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Callback Requested!</h3>
                <p style={{ color: '#94a3b8', fontSize: 14 }}>We have received your details and an AI growth strategist will reach out to you directly within 2 business hours.</p>
              </div>
            ) : (
              <form onSubmit={handleFallbackSubmit}>
                <div style={{ marginBottom: 16 }}>
                  <span className="fcta-badge">Fast-Track</span>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginTop: 6, marginBottom: 4 }}>
                    Request a Direct Callback
                  </h3>
                  <p style={{ fontSize: 13, color: '#94a3b8' }}>
                    Leave your contact info and our team will get in touch to schedule your audit call.
                  </p>
                </div>

                {error && <p className="dash-error" style={{ marginBottom: 12 }}>{error}</p>}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name *"
                    className="booking-modal-input"
                    style={{ width: '100%', padding: '12px', background: '#020617', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 8 }}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <input
                    type="email"
                    required
                    placeholder="Work Email *"
                    className="booking-modal-input"
                    style={{ width: '100%', padding: '12px', background: '#020617', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 8 }}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number (Optional)"
                    className="booking-modal-input"
                    style={{ width: '100%', padding: '12px', background: '#020617', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 8 }}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>

                <button type="submit" className="fcta-primary-btn" style={{ width: '100%', justifyContent: 'center' }} disabled={submitting}>
                  {submitting ? 'Submitting…' : 'Submit Callback Request'} <Send size={15} />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
