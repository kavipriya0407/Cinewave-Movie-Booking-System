// Customer Profile Page
import React, { useState } from 'react';
import { User, Mail, Phone, ShieldCheck, Ticket, Calendar, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getBookings } from '../../data/storageService';

export default function CustomerProfilePage() {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const bookings = getBookings().filter(b => b.customerId === user?.id || b.customerEmail === user?.email);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Name cannot be blank.', 'error');
      return;
    }
    updateProfile({ name: name.trim(), phone: phone.trim() });
  };

  return (
    <div className="customer-profile-page container animate-fade-in" style={{ padding: '3rem 1.5rem 5rem', maxWidth: '800px' }}>
      <div className="section-header">
        <div>
          <h1 className="section-title">
            <span className="section-title-line" />
            Customer Account Profile
          </h1>
          <p className="section-subtitle">
            Manage your personal contact details and cinema booking preferences
          </p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)' }}>
          <div className="user-avatar" style={{ width: '64px', height: '64px', fontSize: '1.6rem' }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '0.2rem' }}>{user?.name}</h2>
            <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-gold)', border: '1px solid var(--accent-gold)' }}>
              Verified CineWave Member
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label"><User size={15} /> Full Name</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label"><Mail size={15} /> Email Address (Account ID)</label>
            <input
              type="email"
              className="form-input"
              value={user?.email || ''}
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email cannot be changed</span>
          </div>

          <div className="form-group">
            <label className="form-label"><Phone size={15} /> Contact Phone</label>
            <input
              type="tel"
              className="form-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            <Save size={16} /> Save Changes
          </button>
        </form>
      </div>

      {/* Account Statistics */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '1rem' }}>
          Account Activity Summary
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
          <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-gold)' }}>{bookings.length}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Bookings</div>
          </div>
          <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
              {bookings.filter(b => b.status === 'Ticket Issued' || b.status === 'Booking Confirmed').length}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Confirmed Passes</div>
          </div>
          <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-indigo)' }}>
              {bookings.filter(b => b.status === 'Awaiting Customer Confirmation').length}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Action Required</div>
          </div>
        </div>
      </div>
    </div>
  );
}
