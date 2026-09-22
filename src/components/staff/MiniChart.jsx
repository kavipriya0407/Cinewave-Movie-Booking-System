// Clean Responsive SVG Mini Charts
import React from 'react';

// Bar chart for weekly bookings or revenue
export function BarChart({ data = [], height = 180, color = 'var(--accent-gold)' }) {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <div style={{ width: '100%', height: `${height}px`, display: 'flex', alignItems: 'flex-end', gap: '0.75rem', padding: '1rem 0' }}>
      {data.map((item, index) => {
        const heightPercent = Math.max(8, (item.value / maxValue) * 100);
        return (
          <div 
            key={index} 
            style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              height: '100%', 
              justifyContent: 'flex-end' 
            }}
          >
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>
              {item.value}
            </div>
            <div 
              style={{ 
                width: '100%', 
                maxWidth: '40px',
                height: `${heightPercent}%`, 
                background: item.highlight ? 'linear-gradient(180deg, #fbbf24, #d97706)' : 'linear-gradient(180deg, rgba(99, 102, 241, 0.8), rgba(99, 102, 241, 0.4))',
                borderRadius: '6px 6px 2px 2px',
                transition: 'height 0.4s ease',
                boxShadow: item.highlight ? '0 0 12px rgba(245, 158, 11, 0.3)' : 'none'
              }} 
              title={`${item.label}: ${item.value}`}
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.5rem', whiteSpace: 'nowrap' }}>
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// Status breakdown progress bar list
export function StatusDistribution({ data = [] }) {
  const total = data.reduce((acc, curr) => acc + curr.count, 0) || 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {data.map((item, i) => {
        const percent = Math.round((item.count / total) * 100);
        return (
          <div key={i}>
            <div className="flex-between" style={{ fontSize: '0.82rem', marginBottom: '0.3rem' }}>
              <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }} />
                {item.label}
              </span>
              <span style={{ fontWeight: 700, color: 'var(--text-light)' }}>
                {item.count} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({percent}%)</span>
              </span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  width: `${percent}%`, 
                  height: '100%', 
                  background: item.color,
                  borderRadius: '999px',
                  transition: 'width 0.5s ease'
                }} 
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
