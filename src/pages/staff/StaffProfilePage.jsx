// Staff Profile & System Diagnostics Page
import React, { useState } from 'react';
import { User, ShieldCheck, Mail, Phone, Server, Database, Save, RotateCcw } from 'lucide-react';
import StaffSidebar from '../../components/staff/StaffSidebar';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { initializeStorage, getBookings, getMovies, getTheatres, getShows } from '../../data/storageService';

export default function StaffProfilePage() {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || 'Priya Sharma (Operations Manager)');
  const [phone, setPhone] = useState(user?.phone || '+91 91234 56789');

  const bookings = getBookings();
  const movies = getMovies();
  const theatres = getTheatres();
  const shows = getShows();

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Staff name cannot be blank.', 'error');
      return;
    }
    updateProfile({ name: name.trim(), phone: phone.trim() });
  };

  const handleResetDemoData = () => {
    if (window.confirm('Reset all demo data back to default factory seed state?')) {
      localStorage.clear();
      initializeStorage();
      showToast('System data reset to initial demo seeds.', 'success');
      setTimeout(() => window.location.reload(), 500);
    }
  };

  return (
    <div className="dashboard-layout animate-fade-in">
      <StaffSidebar />

      <main className="dashboard-main" style={{ maxWidth: '850px' }}>
        <div className="section-header">
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              Staff Identity & Access Control
            </span>
            <h1 className="section-title">Staff Administrator Profile</h1>
            <p className="section-subtitle">
              Manage operational credentials, system preferences, and demo dataset controls
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)' }}>
            <div className="user-avatar staff" style={{ width: '64px', height: '64px', fontSize: '1.6rem' }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '0.2rem' }}>{user?.name}</h2>
              <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.2)', color: 'var(--accent-indigo)', border: '1px solid #6366f1' }}>
                <ShieldCheck size={12} /> Operational Superuser & Auditor
              </span>
            </div>
          </div>

          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label"><User size={15} /> Staff Full Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label"><Mail size={15} /> Staff Operational Email</label>
              <input
                type="email"
                className="form-input"
                value={user?.email || 'staff@cinewave.com'}
                disabled
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Role assigned: System Operations Lead</span>
            </div>

            <div className="form-group">
              <label className="form-label"><Phone size={15} /> Hotline / Extension Phone</label>
              <input
                type="tel"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              <Save size={16} /> Save Staff Credentials
            </button>
          </form>
        </div>

        {/* System Diagnostics & Database Reset */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={18} className="text-gold" /> System Storage Diagnostics
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
            Current counts in the browser localStorage persistent database:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', textAlign: 'center', marginBottom: '1.75rem' }}>
            <div style={{ padding: '0.85rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-gold)' }}>{movies.length}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Movies</div>
            </div>
            <div style={{ padding: '0.85rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-indigo)' }}>{theatres.length}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Theatres</div>
            </div>
            <div style={{ padding: '0.85rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{shows.length}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Scheduled Shows</div>
            </div>
            <div style={{ padding: '0.85rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>{bookings.length}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active Cases</div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <strong style={{ color: '#fff', fontSize: '0.92rem' }}>Reset Demo Database</strong>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Restore default movies, theatres, and bookings for fresh mentor demos</div>
            </div>
            <button onClick={handleResetDemoData} className="btn btn-secondary btn-sm" style={{ color: 'var(--accent-red)' }}>
              <RotateCcw size={14} /> Factory Reset Database
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
