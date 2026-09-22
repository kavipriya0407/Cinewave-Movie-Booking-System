// Theatre Card Component
import React from 'react';
import { Building, MapPin, Sparkles, Navigation, Phone } from 'lucide-react';

export default function TheatreCard({ theatre, onSelect, isSelected }) {
  return (
    <div 
      className={`theatre-card ${isSelected ? 'glass-panel-hover' : ''}`}
      style={isSelected ? { borderColor: 'var(--accent-gold)', boxShadow: 'var(--shadow-glow-gold)' } : {}}
    >
      <div className="theatre-header">
        <div>
          <h4 className="theatre-name">{theatre.name}</h4>
          <div className="theatre-location">
            <MapPin size={14} className="text-gold" />
            <span>{theatre.location} &bull; {theatre.distance || '2.5 km away'}</span>
          </div>
        </div>
        <span className="theatre-screens-badge">
          {theatre.screens} Screens
        </span>
      </div>

      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
        {theatre.address}
      </p>

      {theatre.contact && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
          <Phone size={12} className="text-muted" />
          <span>{theatre.contact}</span>
        </div>
      )}

      <div className="theatre-facilities">
        {(theatre.facilities || []).map((fac, i) => (
          <span key={i} className={`facility-chip ${fac.includes('IMAX') || fac.includes('Dolby') ? 'active' : ''}`}>
            <Sparkles size={11} /> {fac}
          </span>
        ))}
      </div>

      {onSelect && (
        <button 
          onClick={() => onSelect(theatre)} 
          className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
          style={{ marginTop: 'auto', width: '100%' }}
        >
          {isSelected ? 'Theatre Selected' : 'Select Theatre'}
        </button>
      )}
    </div>
  );
}
