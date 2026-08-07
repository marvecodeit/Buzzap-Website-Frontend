'use client';
import { useState, useEffect } from 'react';
import { Check, ChevronDown, HelpCircle } from 'lucide-react';
import { getPublicPricing } from '@/lib/api';
import './pricing.css';

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // Load plans from the CMS. Map the API shape to what the card markup expects.
  useEffect(() => {
    getPublicPricing()
      .then((data) => {
        const mapped = (data.plans || []).map((p) => ({
          name: p.name,
          monthlyPrice: p.monthlyPrice,
          yearlyPrice: p.yearlyPrice,
          priceSuffix: p.priceSuffix || '/month',
          desc: p.description || '',
          features: p.features || [],
          cta: p.ctaLabel || 'Get started',
          popular: Boolean(p.popular),
        }));
        setTiers(mapped);
      })
      .catch(() => setTiers([]))
      .finally(() => setLoading(false));
  }, []);

  const faqs = [
    { q: 'What is Buzzap?', a: 'Buzzap is an AI-driven agency ecosystem designed to scale your business growth, automate manual workflows, and optimize search authority natively.' },
    { q: 'What services can I get from Buzzap?', a: 'We specialize in multi-channel AI automation pipelines, predictive lead workflows, intelligent brand marketing, and autonomous CRM operations.' },
    { q: 'Do you service for all size businesses?', a: 'Yes! Our tiers support early founders looking for proof of concept up to custom multi-node pipelines for scaled enterprise architectures.' },
    { q: 'Does your solution integrate with other software and tools?', a: 'Completely. Built-in webhooks and node systems seamlessly map data pipelines across major CRMs, databases, and communication stacks.' }
  ];

  return (
    <main className="pricing-viewport">
      <div className="pricing-glow-layer"></div>

      <div className="pricing-wrapper">
        {/* Header Block Section */}
        <div className="pricing-header">
          <h1>Try It Out First, Then<br />Choose a Strategy.</h1>
          <p>Simple plans, simple prices. Only pay for what you really need. Change or cancel your plan at anytime.</p>
          
          {/* Custom Billing Toggle Switch Frame */}
          <div className="billing-toggle-container">
            <span className={`toggle-label ${!isYearly ? 'active' : ''}`}>Monthly</span>
            <button 
              className={`toggle-switch-track ${isYearly ? 'switched' : ''}`} 
              onClick={() => setIsYearly(!isYearly)}
              aria-label="Toggle Billing Cycle"
            >
              <span className="toggle-thumb"></span>
            </button>
            <span className={`toggle-label ${isYearly ? 'active' : ''}`}>Yearly <span className="discount-badge">-20%</span></span>
          </div>
        </div>

        {/* 3-Tier Matrix Grid */}
        {loading ? (
          <p className="pricing-loading">Loading plans…</p>
        ) : tiers.length === 0 ? (
          <p className="pricing-loading">Pricing is being updated. Please check back shortly.</p>
        ) : (
          <div className="pricing-grid">
            {tiers.map((tier, idx) => (
              <div key={idx} className={`pricing-card ${tier.popular ? 'premium-highlighted' : ''}`}>
                {tier.popular && <span className="popular-badge">Popular Plan</span>}
                <div className="card-top-context">
                  {!tier.popular && <span className="plan-name-tag">{tier.name}</span>}
                  <div className="price-display">
                    <h2>${isYearly ? tier.yearlyPrice : tier.monthlyPrice}<span>{tier.priceSuffix}</span></h2>
                  </div>
                  <p className="tier-description">{tier.desc}</p>
                </div>

                <hr className="divider-line" />

                <ul className="tier-features-list">
                  {tier.features.map((feat, fIdx) => (
                    <li key={fIdx}>
                      <Check size={14} className="check-icon" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button className={`btn-tier-action ${tier.popular ? 'btn-premium' : ''}`}>
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* FAQ Accordion Architecture Section */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-accordion-group">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`faq-item-row ${activeFaq === index ? 'expanded' : ''}`}
                onClick={() => toggleFaq(index)}
              >
                <div className="faq-header-trigger">
                  <div className="faq-question-side">
                    <HelpCircle size={18} className="faq-help-icon" />
                    <h3>{faq.q}</h3>
                  </div>
                  <ChevronDown size={16} className="faq-chevron" />
                </div>
                <div className="faq-body-content">
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}