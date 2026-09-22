// Theatres Directory Page
import React from 'react';
import { getTheatres, getShows } from '../../data/storageService';
import TheatreCard from '../../components/customer/TheatreCard';
import { Building, MapPin, Film, Sparkles, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TheatresPage() {
  const theatres = getTheatres();
  const shows = getShows();
  const navigate = useNavigate();

  return (
    <div className="theatres-page container animate-fade-in" style={{ padding: '3rem 1.5rem 5rem' }}>
      <div className="section-header">
        <div>
          <h1 className="section-title">
            <span className="section-title-line" />
            CineWave Multiplex Theatres
          </h1>
          <p className="section-subtitle">
            Find state-of-the-art cinema halls with IMAX Laser, Dolby Atmos, and 4DX audio visual installations
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {theatres.map(th => {
          const theatreShows = shows.filter(s => s.theatreId === th.id);
          return (
            <div key={th.id} className="theatre-card">
              <div className="theatre-header">
                <div>
                  <h3 className="theatre-name">{th.name}</h3>
                  <div className="theatre-location">
                    <MapPin size={14} className="text-gold" />
                    <span>{th.location}</span>
                  </div>
                </div>
                <span className="theatre-screens-badge">
                  {th.screens} Screens
                </span>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                {th.address}
              </p>

              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Phone: <span style={{ color: 'var(--text-primary)' }}>{th.contact}</span>
              </div>

              <div className="theatre-facilities">
                {(th.facilities || []).map((f, i) => (
                  <span key={i} className="facility-chip active">
                    <Sparkles size={11} /> {f}
                  </span>
                ))}
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '1.25rem', borderTop: '1px solid var(--border-glass)' }}>
                <button 
                  onClick={() => navigate('/movies')} 
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%' }}
                >
                  <Film size={15} /> View Running Movies & Shows
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
