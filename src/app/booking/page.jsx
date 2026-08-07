'use client';
import { useEffect, useState } from 'react';
import Cal, { getCalApi } from '@calcom/embed-react';
import { Calendar, Clock, ShieldCheck, Zap, Send, X, AlertCircle } from 'lucide-react';
import { submitLead } from '@/lib/api';
import './booking.css';

const CAL_NAMESPACE = 'free-ai-growth-strategy-call';
const CAL_LINK = 'buzzaphq/free-ai-growth-strategy-call';

export default function BookingPage() {
  const [calLoaded, setCalLoaded] = useState(false);
  const [showFallbackModal, setShowFallbackModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Inject resource hints for app.cal.com for DNS prefetching & TLS warm-up
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://app.cal.com';
    document.head.appendChild(preconnect);

    const dnsPrefetch = document.createElement('link');
    dnsPrefetch.rel = 'dns-prefetch';
    dnsPrefetch.href = 'https://app.cal.com';
    document.head.appendChild(dnsPrefetch);

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
        console.error('Cal.com init issue:', err);
        setCalLoaded(true);
      }
    })();
  }, []);

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
    <main className="booking-viewport">
      <div className="booking-glow" />
      <div className="booking-glow-secondary" />

      <div className="booking-wrapper">
        <div className="booking-header">
          <div className="booking-badge-wrap">
            <span className="booking-badge">
              <Zap size={12} className="booking-badge-icon" /> Free Strategy Audit
            </span>
            <span className="booking-duration-pill">
              <Clock size={12} /> 30 Minutes
            </span>
          </div>

          <h1 className="booking-title">
            Book your strategy call with <span className="booking-title-accent">Buzzap</span>
          </h1>

          <p className="booking-subtitle">
            Select a convenient time below. We&apos;ll audit your current growth stack and deliver a custom AI roadmap.
          </p>
        </div>

        {/* Embedded Calendar Container with Glass Frame */}
        <div className="booking-card-frame">

          {/* Skeleton loader while Cal.com iframe initializes */}
          {!calLoaded && (
            <div className="booking-skeleton">
              <div className="booking-skeleton-spinner" />
              <p className="booking-skeleton-text">Loading interactive calendar…</p>
            </div>
          )}

          <Cal
            namespace={CAL_NAMESPACE}
            calLink={CAL_LINK}
            className="booking-cal-embed"
            style={{ width: '100%', height: '100%', minHeight: '680px' }}
            config={{ layout: 'month_view', useSlotsViewOnSmallScreen: 'true' }}
          />

          {/* Instant Fallback Bar */}
          <div className="booking-fallback-bar">
            <span>Taking too long or calendar not loading?</span>
            <button type="button" className="booking-fallback-btn" onClick={() => setShowFallbackModal(true)}>
              Send a 10-Second Callback Request
            </button>
          </div>
        </div>

        <div className="booking-trust-strip">
          <div className="booking-trust-item">
            <ShieldCheck size={16} className="booking-trust-icon" /> 100% Private & Confidential
          </div>
          <div className="booking-trust-item">
            <Calendar size={16} className="booking-trust-icon" /> Instant Calendar Sync
          </div>
        </div>
      </div>

      {/* Fallback Callback Modal */}
      {showFallbackModal && (
        <div className="booking-modal-overlay">
          <div className="booking-modal-card">
            <button type="button" className="booking-modal-close" onClick={() => setShowFallbackModal(false)}>
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
                  <span className="booking-badge">Fast-Track</span>
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
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <input
                    type="email"
                    required
                    placeholder="Work Email *"
                    className="booking-modal-input"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number (Optional)"
                    className="booking-modal-input"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                  <textarea
                    rows={2}
                    placeholder="Tell us briefly about your business goals (Optional)"
                    className="booking-modal-input"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>

                <button type="submit" className="booking-modal-submit" disabled={submitting}>
                  {submitting ? 'Submitting…' : 'Submit Callback Request'} <Send size={15} />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
