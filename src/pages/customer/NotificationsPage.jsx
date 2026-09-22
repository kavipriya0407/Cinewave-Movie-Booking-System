// Customer Notification Center Page
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Check, CheckCheck, Clock, Ticket, AlertTriangle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  getNotifications, 
  markNotificationRead, 
  markAllNotificationsRead 
} from '../../data/storageService';
import EmptyState from '../../components/common/EmptyState';
import { formatDateTime } from '../../utils/formatters';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const loadData = () => {
    if (user) {
      setNotifications(getNotifications('customer', user.id));
    }
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('cinewave_data_updated', handleUpdate);
    return () => window.removeEventListener('cinewave_data_updated', handleUpdate);
  }, [user]);

  const handleMarkAllRead = () => {
    if (user) {
      markAllNotificationsRead('customer', user.id);
    }
  };

  const handleItemClick = (notif) => {
    markNotificationRead(notif.id);
    if (notif.bookingId) {
      navigate(`/customer/booking/${notif.bookingId}`);
    }
  };

  return (
    <div className="notifications-page container animate-fade-in" style={{ padding: '3rem 1.5rem 5rem' }}>
      <div className="section-header">
        <div>
          <h1 className="section-title">
            <span className="section-title-line" />
            Notification Center
          </h1>
          <p className="section-subtitle">
            Real-time updates regarding your booking requests, approvals, and tickets
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
                background: n.read ? 'var(--bg-card)' : 'rgba(245, 158, 11, 0.08)',
                borderColor: n.read ? 'var(--border-glass)' : 'rgba(245, 158, 11, 0.3)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-full)',
                  background: n.read ? 'rgba(255,255,255,0.05)' : 'rgba(245,158,11,0.2)',
                  color: n.read ? 'var(--text-muted)' : 'var(--accent-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Bell size={18} />
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
                    View Case <ArrowRight size={14} />
                  </span>
                )}
                {!n.read && (
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-gold)' }} />
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You're all caught up! You will be notified whenever your booking status changes."
          actionText="Explore Movies"
          actionLink="/movies"
        />
      )}
    </div>
  );
}
