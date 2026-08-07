'use client';
import { motion } from 'framer-motion';
import './infrabar.css';

// SVG Brand Logos map
const brandSvgs = {
  OpenAI: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.28 9.82a6 6 0 0 0-.52-4.91 6.05 6.05 0 0 0-6.45-2.9 6 6 0 0 0-4.63-2.09 6.06 6.06 0 0 0-5.77 4.14 6 6 0 0 0-4.14 3 6.06 6.06 0 0 0 .73 6.94 6 6 0 0 0 .52 4.91 6.05 6.05 0 0 0 6.45 2.9 6 6 0 0 0 4.63 2.09 6.06 6.06 0 0 0 5.77-4.14 6 6 0 0 0 4.14-3 6.06 6.06 0 0 0-.73-6.94zm-9.28 11.73a4.5 4.5 0 0 1-2.94-1.1l.14-.08 3.86-2.23a.77.77 0 0 0 .39-.67v-5.45l1.64.95a.73.73 0 0 0 .37.1.77.77 0 0 0 .39-.11l4.73-2.73a4.52 4.52 0 0 1 .53 4.88 4.46 4.46 0 0 1-4.11 6.44zm-7.65-3.32a4.49 4.49 0 0 1-.58-3.08l.14.09 3.86 2.23a.76.76 0 0 0 .77 0l4.72-2.73v1.89a.77.77 0 0 0 .39.67l4.73 2.73a4.48 4.48 0 0 1-5.74 1.34zm-1.89-8.48a4.48 4.48 0 0 1 2.37-1.99v4.61a.76.76 0 0 0 .38.67l4.73 2.73-1.64.95a.77.77 0 0 0-.39.67v5.46a4.5 4.5 0 0 1-5.45-13.04zm10.74 3.09l-3.86-2.23 1.64-.95a.77.77 0 0 0 .39-.67V3.54a4.5 4.5 0 0 1 7.28 4.5 4.47 4.47 0 0 1-1.9 2.5l-3.86 2.23a.76.76 0 0 0-.69.07zm3.17-5.59l-.14-.08-3.86-2.23a.76.76 0 0 0-.77 0L8.68 7.37V5.48a.77.77 0 0 0-.39-.67L3.56 2.08a4.48 4.48 0 0 1 6.27-1.42 4.52 4.52 0 0 1 7.54 2.18z" />
    </svg>
  ),
  Claude: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L9.5 8.5L3 11L9.5 13.5L12 20L14.5 13.5L21 11L14.5 8.5L12 2Z" />
    </svg>
  ),
  'Meta Ads': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.96 4a6.45 6.45 0 0 0-4.96 2.45A6.45 6.45 0 0 0 7.04 4 6.7 6.7 0 0 0 .34 10.7c0 4.12 3.65 8.3 6.7 10.3l5-3.32 5 3.32c3.05-2 6.7-6.18 6.7-10.3A6.7 6.7 0 0 0 16.96 4z" />
    </svg>
  ),
  'Google Ads': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    </svg>
  ),
  'Make.com': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z" />
    </svg>
  ),
  Voiceflow: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15h-2v-2h2zm0-4h-2V7h2z" />
    </svg>
  ),
  Vapi: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
    </svg>
  ),
  'Zoho CRM': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
    </svg>
  ),
  'Cal.com': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
    </svg>
  ),
  HubSpot: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.5 12a3.5 3.5 0 1 0-3.5 3.5v2.88a2 2 0 1 1-2 0V11a2.5 2.5 0 1 0-2.5 2.5h.38a4.5 4.5 0 1 1 7.62-1.5z" />
    </svg>
  ),
  WhatsApp: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.75 13.96c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.66.81-.81.98-.15.17-.3.19-.55.07-.25-.13-1.07-.39-2.04-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.3zm-4.75 7.04a8.9 8.9 0 0 1-4.54-1.24l-.32-.19-3.38.89.9-3.29-.21-.34a8.9 8.9 0 1 1 7.55 4.17zm0-19a11 11 0 0 0-9.35 16.78L1 23l4.33-1.14A11 11 0 1 0 12 2z" />
    </svg>
  ),
  Clay: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  ),
  'Apollo.io': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L1 21h22L12 2zm0 4.5l7.5 13h-15L12 6.5z" />
    </svg>
  ),
};

const tools = [
  { name: 'OpenAI', color: '#10a37f', bg: 'rgba(16,163,127,0.12)', border: 'rgba(16,163,127,0.3)' },
  { name: 'Claude', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' },
  { name: 'Meta Ads', color: '#0082fb', bg: 'rgba(0,130,251,0.12)', border: 'rgba(0,130,251,0.3)' },
  { name: 'Google Ads', color: '#4285f4', bg: 'rgba(66,133,244,0.12)', border: 'rgba(66,133,244,0.3)' },
  { name: 'Make.com', color: '#a259ff', bg: 'rgba(162,89,255,0.12)', border: 'rgba(162,89,255,0.3)' },
  { name: 'Voiceflow', color: '#5865f2', bg: 'rgba(88,101,242,0.12)', border: 'rgba(88,101,242,0.3)' },
  { name: 'Vapi', color: '#06b6d4', bg: 'rgba(6,182,212,0.12)', border: 'rgba(6,182,212,0.3)' },
  { name: 'Zoho CRM', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)' },
  { name: 'Cal.com', color: '#6366f1', bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.3)' },
  { name: 'HubSpot', color: '#ff7a59', bg: 'rgba(255,122,89,0.12)', border: 'rgba(255,122,89,0.3)' },
  { name: 'WhatsApp', color: '#25d366', bg: 'rgba(37,211,102,0.12)', border: 'rgba(37,211,102,0.3)' },
  { name: 'Clay', color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.3)' },
  { name: 'Apollo.io', color: '#f97316', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.3)' },
];

export default function InfraBar() {
  const doubled = [...tools, ...tools];

  return (
    <section className="infra-section">
      <div className="infra-section-glow" />

      <motion.div
        className="infra-header"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="infra-title">
          Built on world-class <span className="infra-glow-text">AI infrastructure</span>
        </h2>
        <p className="infra-subtitle">Integrating the best tools so you don&apos;t have to.</p>
      </motion.div>

      <div className="infra-ticker-wrapper">
        <div className="infra-ticker-fade infra-ticker-fade-left" />
        <div className="infra-ticker-fade infra-ticker-fade-right" />

        <div className="infra-ticker-track">
          {doubled.map((tool, i) => (
            <div
              className="infra-tool-chip"
              key={i}
              style={{
                '--tool-color': tool.color,
                '--tool-bg': tool.bg,
                '--tool-border': tool.border,
              }}
            >
              <div className="infra-tool-logo" style={{ background: tool.bg, border: `1px solid ${tool.border}`, color: tool.color }}>
                {brandSvgs[tool.name] || brandSvgs.OpenAI}
              </div>
              <span className="infra-tool-name">{tool.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
