'use client';
import './industries.css';

const industries = [
  'E-Commerce', 'Real Estate', 'SaaS', 'Healthcare', 'Finance',
  'Coaching & Education', 'Legal Services', 'Hospitality', 'Logistics',
  'Insurance', 'Agencies', 'Construction', 'Retail', 'Fitness & Wellness',
  'Tech Startups', 'Consulting', 'Automotive', 'Media & Entertainment',
];

export default function Industries() {
  return (
    <section className="ind-section">
      <div className="ind-header">
        <span className="ind-badge">Who We Serve</span>
        <h2 className="ind-title">
          Industries we <span className="ind-title-glow">Buzzap</span>
        </h2>
        <p className="ind-subtitle">
          AI growth systems built for every industry that runs on leads, customers, and revenue.
        </p>
      </div>

      <div className="ind-ticker-wrapper">
        <div className="ind-ticker-fade ind-fade-left" />
        <div className="ind-ticker-fade ind-fade-right" />

        {/* Row 1 — scrolls left */}
        <div className="ind-track">
          {[...industries, ...industries].map((name, i) => (
            <div className="ind-chip" key={`r1-${i}`}>
              <span className="ind-dot" />
              {name}
            </div>
          ))}
        </div>

        {/* Row 2 — scrolls right */}
        <div className="ind-track ind-track-reverse">
          {[...industries.slice(9), ...industries.slice(0, 9), ...industries.slice(9), ...industries.slice(0, 9)].map((name, i) => (
            <div className="ind-chip ind-chip-alt" key={`r2-${i}`}>
              <span className="ind-dot" />
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
