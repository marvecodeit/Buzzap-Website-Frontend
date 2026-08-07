'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';
import { submitLead } from '@/lib/api';
import './contact.css';

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    primary: 'hello@buzzaphq.com',
    secondary: 'We reply within one business day.',
  },
  {
    icon: MapPin,
    label: 'Location',
    primary: '7, Ikoyi Club Road, Ikoyi, Lagos.',
    secondary: 'Remote-first team. We work across all time zones.',
  },
  {
    icon: Clock,
    label: 'Working hours',
    primary: 'Monday – Friday, 9am – 6pm WAT',
    secondary: 'Urgent support available for active clients 24/7.',
  },
];

const services = [
  'AI Marketing (Meta & Google Ads)',
  'Brand Boost & SEO',
  'CRM & Lead Automation',
  'AI Agents & Chatbots',
  'Content & Creative Strategy',
  'Growth Consulting',
  'Not sure yet',
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] } }),
};

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', company: '', service: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await submitLead({ ...form, source: 'contact_form' });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="contact-page">

      {/* Hero */}
      <section className="contact-hero">
        <div className="contact-hero-glow" />
        <div className="contact-container">
          <motion.span className="contact-label" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            Contact
          </motion.span>
          <motion.h1 className="contact-title" variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            Let&apos;s talk about<br />
            <span className="contact-muted">your growth system.</span>
          </motion.h1>
          <motion.p className="contact-desc" variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            Tell us what you&apos;re working on. We&apos;ll respond within one business day,
            or you can book a call directly below.
          </motion.p>
          <motion.div variants={fadeUp} custom={3} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Link href="/booking" className="contact-book-link">
              Prefer to book a call directly <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Main grid */}
      <section className="contact-body">
        <div className="contact-container">
          <div className="contact-grid">

            {/* Form */}
            <motion.div
              className="contact-form-wrap"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {submitted ? (
                <div className="contact-success">
                  <div className="contact-success-icon">
                    <ArrowRight size={20} />
                  </div>
                  <h3 className="contact-success-title">Message received.</h3>
                  <p className="contact-success-desc">
                    We&apos;ll review your message and follow up within one business day.
                    In the meantime, feel free to browse our{' '}
                    <Link href="/case-studies">case studies</Link> or{' '}
                    <Link href="/insights">insights</Link>.
                  </p>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="contact-form-row">
                    <div className="contact-field">
                      <label htmlFor="name">Full name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Jane Smith"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="contact-field">
                      <label htmlFor="email">Work email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="jane@company.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="contact-field">
                    <label htmlFor="company">Company name</label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      placeholder="Your company"
                      value={form.company}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="contact-field">
                    <label htmlFor="service">What are you interested in?</label>
                    <select id="service" name="service" value={form.service} onChange={handleChange}>
                      <option value="">Select a service</option>
                      {services.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div className="contact-field">
                    <label htmlFor="message">Tell us about your project</label>
                    <textarea
                      id="message"
                      name="message"
                      placeholder="What's your current situation and what are you trying to achieve?"
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {error && (
                    <p className="contact-error" role="alert">
                      {error}
                    </p>
                  )}

                  <button type="submit" className="contact-submit" disabled={submitting}>
                    {submitting ? 'Sending…' : (
                      <>
                        Send message <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Contact info */}
            <div className="contact-info-col">
              {contactInfo.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    className="contact-info-item"
                    variants={fadeUp}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <div className="contact-info-icon">
                      <Icon size={16} />
                    </div>
                    <div className="contact-info-text">
                      <span className="contact-info-label">{item.label}</span>
                      <span className="contact-info-primary">{item.primary}</span>
                      <span className="contact-info-secondary">{item.secondary}</span>
                    </div>
                  </motion.div>
                );
              })}

              <div className="contact-booking-card">
                <span className="contact-booking-badge">Faster than email</span>
                <h3 className="contact-booking-title">Book a free audit call</h3>
                <p className="contact-booking-desc">
                  45 minutes. We&apos;ll audit your funnel and show you exactly what we&apos;d build.
                </p>
                <Link href="/booking" className="contact-booking-btn">
                  Choose a time <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
