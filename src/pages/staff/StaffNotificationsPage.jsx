// Staff Alert Feed & Notifications Page
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, ArrowRight, ShieldAlert, Ticket } from 'lucide-react';
import StaffSidebar from '../../components/staff/StaffSidebar';
import EmptyState from '../../components/common/EmptyState';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../../data/storageService';
import { formatDateTime } from '../../utils/formatters';

export default function StaffNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const loadData = () => {
    setNotifications(getNotifications('staff'));
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('cinewave_data_updated', handleUpdate);
    return () => window.removeEventListener('cinewave_data_updated', handleUpdate);
  }, []);

  const handleMarkAllRead = () => {
    markAllNotificationsRead('staff');
  };

  const handleItemClick = (notif) => {
    markNotificationRead(notif.id);
    if (notif.bookingId) {
      navigate(`/staff/bookings/${notif.bookingId}`);
    }
  };

  return (
    <div className="dashboard-layout animate-fade-in">
      <StaffSidebar />

      <main className="dashboard-main">
        <div className="section-header">
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              Operational Alerts
            </span>
            <h1 className="section-title">Operations Notifications Feed</h1>
            <p className="section-subtitle">
              Real-time notices for incoming customer requests, customer confirmations, and schedule updates
            </p>
          </div>

          {notifications.some(n => !n.read) && (
            <button onClick={handleMarkAllRead} className="btn btn-secondary btn-sm">
              <CheckCheck size={16} /> Mark All as Read
            </button>
          )}
        </div>

        {notifications.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {notifications.map(n => (
              <div
                key={n.id}
                onClick={() => handleItemClick(n)}
                className="glass-panel"
                style={{
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  background: n.read ? 'var(--bg-card)' : 'rgba(99, 102, 241, 0.08)',
                  borderColor: n.read ? 'var(--border-glass)' : 'rgba(99, 102, 241, 0.3)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: 'var(--radius-full)',
                    background: n.read ? 'rgba(255,255,255,0.05)' : 'rgba(99, 102, 241, 0.2)',
                    color: n.read ? 'var(--text-muted)' : 'var(--accent-indigo)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <ShieldAlert size={20} />
                  </div>

                  <div>
                    <p style={{ color: n.read ? 'var(--text-secondary)' : '#fff', fontWeight: n.read ? 500 : 700, fontSize: '0.95rem' }}>
                      {n.message}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>
                      {formatDateTime(n.createdAt)}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {n.bookingId && (
                    <span style={{ fontSize: '0.82rem', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      Review Case <ArrowRight size={14} />
                    </span>
                  )}
                  {!n.read && (
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-indigo)' }} />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Bell}
            title="No staff notifications"
            description="You are caught up! Alerts will appear when customers submit bookings or confirm seats."
          />
        )}
      </main>
    </div>
  );
}
