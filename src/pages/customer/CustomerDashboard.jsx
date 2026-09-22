// Customer Portal Dashboard
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Ticket, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Film, 
  Eye, 
  Download, 
  AlertTriangle,
  ArrowRight,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getBookings, updateBookingStatus } from '../../data/storageService';
import MetricCard from '../../components/staff/MetricCard';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);

  const loadCustomerBookings = () => {
    const all = getBookings();
    // Filter by customer email or ID
    const customerList = all.filter(b => 
      b.customerId === user?.id || 
      b.customerEmail?.toLowerCase() === user?.email?.toLowerCase()
    );
    setBookings(customerList);
  };

  useEffect(() => {
    loadCustomerBookings();
    const handleUpdate = () => loadCustomerBookings();
    window.addEventListener('cinewave_data_updated', handleUpdate);
    return () => window.removeEventListener('cinewave_data_updated', handleUpdate);
  }, [user]);

  // Metric Computations
  const totalCount = bookings.length;
  const pendingCount = bookings.filter(b => 
    b.status === 'Booking Requested' || 
    b.status === 'Under Review' || 
    b.status === 'Awaiting Customer Confirmation'
  ).length;
  const confirmedCount = bookings.filter(b => 
    b.status === 'Customer Confirmed' || 
    b.status === 'Booking Confirmed' || 
    b.status === 'Ticket Issued'
  ).length;
  const cancelledCount = bookings.filter(b => 
    b.status === 'Cancelled' || 
    b.status === 'Rejected'
  ).length;

  const handleCancelBooking = (bookingId) => {
    if (window.confirm(`Are you sure you want to cancel booking ${bookingId}?`)) {
      const updated = updateBookingStatus(
        bookingId, 
        'Cancelled', 
        `${user?.name || 'Customer'} (Customer)`,
        'Cancelled by customer from dashboard.'
      );
      if (updated) {
        showToast(`Booking ${bookingId} has been cancelled.`, 'info');
      }
    }
  };

  return (
    <div className="customer-dashboard container animate-fade-in" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      {/* Welcome Banner */}
      <div className="section-header">
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
            Customer Management Portal
          </span>
          <h1 className="section-title">
            Welcome back, {user?.name || 'Valued Customer'}!
          </h1>
          <p className="section-subtitle">
            Manage your cinema ticket reservations, track case reviews, and access digital gate passes
          </p>
        </div>

        <Link to="/movies" className="btn btn-primary">
          <Plus size={18} /> Book New Movie
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="metrics-grid">
        <MetricCard
          title="Total Bookings"
          value={totalCount}
          subtitle="All-time reservations"
          icon={Ticket}
          color="indigo"
        />
        <MetricCard
          title="Pending Requests"
          value={pendingCount}
          subtitle="In review / Awaiting confirm"
          icon={Clock}
          color="gold"
        />
        <MetricCard
          title="Confirmed Tickets"
          value={confirmedCount}
          subtitle="Ready for cinema entry"
          icon={CheckCircle2}
          color="emerald"
        />
        <MetricCard
          title="Cancelled / Rejected"
          value={cancelledCount}
          subtitle="Past inactive cases"
          icon={XCircle}
          color="red"
        />
      </div>

      {/* Action Required Notice if there's an Awaiting Confirmation case */}
      {bookings.some(b => b.status === 'Awaiting Customer Confirmation') && (
        <div style={{
          background: 'rgba(168, 85, 247, 0.12)',
          border: '1.5px solid #a855f7',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle size={22} className="text-gold" />
            <div>
              <strong style={{ color: '#fff' }}>Attention:</strong> You have booking requests awaiting your confirmation!
            </div>
          </div>
          <Link 
            to={`/customer/booking/${bookings.find(b => b.status === 'Awaiting Customer Confirmation')?.id}`}
            className="btn btn-primary btn-sm"
          >
            Review & Confirm Now <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Recent Bookings Table Section */}
      <div className="section-header" style={{ marginBottom: '1.25rem', marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Film size={20} className="text-gold" /> Recent Bookings
        </h2>
        <Link to="/customer/bookings" className="btn btn-secondary btn-sm">
          View All ({totalCount})
        </Link>
      </div>

      {bookings.length > 0 ? (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Movie</th>
                <th>Theatre & Screen</th>
                <th>Date & Time</th>
                <th>Seats</th>
                <th>Amount</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 8).map(b => {
                const canConfirm = b.status === 'Awaiting Customer Confirmation';
                const canCancel = ['Booking Requested', 'Under Review', 'Awaiting Customer Confirmation'].includes(b.status);
                const isReady = b.status === 'Ticket Issued' || b.status === 'Booking Confirmed';

                return (
                  <tr key={b.id}>
                    <td>
                      <Link 
                        to={`/customer/booking/${b.id}`}
                        style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-gold)' }}
                      >
                        {b.id}
                      </Link>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#fff' }}>{b.movieTitle}</div>
                    </td>
                    <td>
                      <div style={{ color: 'var(--text-light)' }}>{b.theatreName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.screen} ({b.format})</div>
                    </td>
                    <td>
                      <div style={{ color: 'var(--text-light)' }}>{formatDate(b.bookingDate)}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', fontWeight: 600 }}>{b.showTime}</div>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-light)' }}>
                        {(b.selectedSeats || []).join(', ')}
                      </span>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{b.ticketCount} tickets</div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>
                        {formatCurrency(b.total)}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={b.status} size="sm" />
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <Link 
                          to={`/customer/booking/${b.id}`} 
                          className="btn btn-secondary btn-sm"
                          title="View booking case tracking"
                        >
                          <Eye size={14} /> View
                        </Link>

                        {canConfirm && (
                          <Link 
                            to={`/customer/booking/${b.id}`} 
                            className="btn btn-primary btn-sm"
                            style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff' }}
                            title="Confirm booking"
                          >
                            Confirm
                          </Link>
                        )}

                        {isReady && (
                          <Link 
                            to={`/customer/ticket/${b.id}`} 
                            className="btn btn-sm btn-outline-gold"
                            title="Open digital ticket"
                          >
                            <Ticket size={14} /> Ticket
                          </Link>
                        )}

                        {canCancel && (
                          <button 
                            onClick={() => handleCancelBooking(b.id)}
                            className="btn btn-sm"
                            style={{ color: 'var(--accent-red)', padding: '0.35rem 0.6rem' }}
                            title="Cancel booking"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          icon={Ticket}
          title="No bookings yet"
          description="You haven't booked any movies yet. Choose a film to start your cinematic journey!"
          actionText="Browse Running Movies"
          actionLink="/movies"
        />
      )}
    </div>
  );
}
