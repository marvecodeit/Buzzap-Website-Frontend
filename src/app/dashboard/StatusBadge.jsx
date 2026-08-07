'use client';
// Small status pill; CSS class drives the color (see dashboard.css .dash-badge.*).
export default function StatusBadge({ status }) {
  return <span className={`dash-badge ${status}`}>{status?.replace('-', ' ')}</span>;
}
