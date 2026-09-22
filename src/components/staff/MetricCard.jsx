// Analytic Metric Card Component
import React from 'react';

export default function MetricCard({ title, value, subtitle, icon: Icon, color = 'gold' }) {
  const getColors = () => {
    switch (color) {
      case 'gold': return { bg: 'rgba(245, 158, 11, 0.15)', text: 'var(--accent-gold)' };
      case 'red': return { bg: 'rgba(225, 29, 72, 0.15)', text: 'var(--accent-red)' };
      case 'emerald': return { bg: 'rgba(16, 185, 129, 0.15)', text: 'var(--accent-emerald)' };
      case 'indigo': return { bg: 'rgba(99, 102, 241, 0.15)', text: 'var(--accent-indigo)' };
      case 'cyan': return { bg: 'rgba(6, 182, 212, 0.15)', text: 'var(--accent-cyan)' };
      default: return { bg: 'rgba(255, 255, 255, 0.08)', text: 'var(--text-light)' };
    }
  };

  const scheme = getColors();

  return (
    <div className="metric-card">
      <div className="metric-info">
        <span className="metric-label">{title}</span>
        <div className="metric-value">{value}</div>
        {subtitle && <span className="metric-sub">{subtitle}</span>}
      </div>
      {Icon && (
        <div className="metric-icon-box" style={{ background: scheme.bg, color: scheme.text }}>
          <Icon size={22} />
        </div>
      )}
    </div>
  );
}
