// CineWave Footer Component with Pega Workflow Info Banner
import React from 'react';
import { Link } from 'react-router-dom';
import { Film, ShieldCheck, Heart, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: '#070a10',
      borderTop: '1px solid var(--border-glass)',
      padding: '4rem 0 2rem',
      marginTop: 'auto'
    }}>
      <div className="container">
        {/* Pega Workflow Highlight Banner for Reviewers */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.75rem 2rem',
          marginBottom: '3rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <Sparkles size={18} className="text-gold" />
              <span style={{ fontWeight: 700, color: 'var(--accent-gold)', fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Pega Case Management Architecture
              </span>
            </div>
            <h4 style={{ fontSize: '1.15rem', color: '#fff' }}>
              End-to-End Digital Case Lifecycle: Request &rarr; Review &rarr; Confirm &rarr; Ticket
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Demonstrating automated state transitions, role-based handoffs, customer confirmation checkpoints, and seat lock synchronization.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span className="badge" style={{ background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', border: '1px solid #6366f1' }}>
              1. Requested
            </span>
            <span className="badge" style={{ background: 'rgba(245,158,11,0.2)', color: '#fcd34d', border: '1px solid #f59e0b' }}>
              2. Review
            </span>
            <span className="badge" style={{ background: 'rgba(168,85,247,0.2)', color: '#d8b4fe', border: '1px solid #a855f7' }}>
              3. Confirm
            </span>
            <span className="badge" style={{ background: 'rgba(16,185,129,0.2)', color: '#6ee7b7', border: '1px solid #10b981' }}>
              4. Ticket Issued
            </span>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Col 1 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div className="brand-icon" style={{ width: '32px', height: '32px' }}>
                <Film size={18} />
              </div>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff' }}>
                Cine<span className="brand-accent">Wave</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              “Your Movie. Your Seat. Your Experience.”
              A premier cinema booking and enterprise case management platform.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
                React + Vite
              </span>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
                LocalStorage DB
              </span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h5 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Quick Navigation
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <li><Link to="/movies" style={{ transition: 'color 0.2s' }}>All Movies & Showtimes</Link></li>
              <li><Link to="/theatres">Cinema Locations</Link></li>
              <li><Link to="/login">Account Login</Link></li>
              <li><Link to="/register">Create Customer Account</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h5 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Staff & Operations
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <li><Link to="/staff/dashboard">Operations Dashboard</Link></li>
              <li><Link to="/staff/bookings">Case Queues & Reviews</Link></li>
              <li><Link to="/staff/seats">Live Seating Matrix</Link></li>
              <li><Link to="/staff/reports">Financial & Occupancy Reports</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h5 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Demo Support
            </h5>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Customer: <code style={{ color: 'var(--accent-gold)' }}>customer@cinewave.com</code>
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Staff: <code style={{ color: 'var(--accent-indigo)' }}>staff@cinewave.com</code>
            </p>
            <span style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={14} /> Ready for Mentor Review
            </span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--border-glass)',
          paddingTop: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.82rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            &copy; {new Date().getFullYear()} CineWave Entertainment System. All rights reserved.
          </div>
          <div>
            Crafted for Excellence &bull; Case Management Demonstration
          </div>
        </div>
      </div>
    </footer>
  );
}
