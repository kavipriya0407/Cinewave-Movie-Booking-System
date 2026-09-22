// Customer My Bookings List Page
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Search, Filter, Eye, Download, AlertTriangle, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getBookings, updateBookingStatus } from '../../data/storageService';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function MyBookingsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = () => {
    const all = getBookings();
    const customerList = all.filter(b => 
      b.customerId === user?.id || 
      b.customerEmail?.toLowerCase() === user?.email?.toLowerCase()
    );
    setBookings(customerList);
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('cinewave_data_updated', handleUpdate);
    return () => window.removeEventListener('cinewave_data_updated', handleUpdate);
  }, [user]);

  const handleCancelBooking = (bookingId) => {
    if (window.confirm(`Are you sure you want to cancel booking ${bookingId}?`)) {
      const updated = updateBookingStatus(
        bookingId, 
        'Cancelled', 
        `${user?.name || 'Customer'} (Customer)`,
        'Cancelled by customer from My Bookings.'
      );
      if (updated) {
        showToast(`Booking ${bookingId} has been cancelled.`, 'info');
      }
    }
  };

  const filtered = bookings.filter(b => {
    if (statusFilter !== 'ALL' && b.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = b.id.toLowerCase().includes(q);
      const matchMovie = b.movieTitle.toLowerCase().includes(q);
      const matchTheatre = b.theatreName.toLowerCase().includes(q);
      if (!matchId && !matchMovie && !matchTheatre) return false;
    }
    return true;
  });

  return (
    <div className="my-bookings-page container animate-fade-in" style={{ padding: '3rem 1.5rem 5rem' }}>
      <div className="section-header">
        <div>
          <h1 className="section-title">
            <span className="section-title-line" />
            My Movie Bookings
          </h1>
          <p className="section-subtitle">
            Track and manage your cinema ticket reservations through the Pega case lifecycle
          </p>
        </div>

        <Link to="/movies" className="btn btn-primary btn-sm">
          <Ticket size={16} /> Book More Tickets
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="filter-search-box">
          <Search size={18} className="filter-search-icon" />
          <input
            type="text"
            className="form-input"
            placeholder="Search by Booking ID, Movie, or Theatre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ minWidth: '180px' }}>
          <select 
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses ({bookings.length})</option>
            <option value="Booking Requested">Booking Requested</option>
            <option value="Under Review">Under Review</option>
            <option value="Awaiting Customer Confirmation">Awaiting Confirmation</option>
            <option value="Customer Confirmed">Customer Confirmed</option>
            <option value="Booking Confirmed">Booking Confirmed</option>
            <option value="Ticket Issued">Ticket Issued</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      {filtered.length > 0 ? (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Movie</th>
                <th>Theatre & Screen</th>
                <th>Date & Time</th>
                <th>Seats</th>
                <th>Total</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => {
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
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{b.ticketCount} seats</div>
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
                        >
                          <Eye size={14} /> Track Case
                        </Link>

                        {canConfirm && (
                          <Link 
                            to={`/customer/booking/${b.id}`} 
                            className="btn btn-primary btn-sm"
                            style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff' }}
                          >
                            Confirm
                          </Link>
                        )}

                        {isReady && (
                          <Link 
                            to={`/customer/ticket/${b.id}`} 
                            className="btn btn-sm btn-outline-gold"
                          >
                            <Ticket size={14} /> Ticket
                          </Link>
                        )}

                        {canCancel && (
                          <button 
                            onClick={() => handleCancelBooking(b.id)}
                            className="btn btn-sm"
                            style={{ color: 'var(--accent-red)', padding: '0.35rem 0.6rem' }}
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
          title="No bookings match your criteria"
          description="Try selecting a different status filter or search term."
          actionText="Browse Movies"
          actionLink="/movies"
        />
      )}
    </div>
  );
}
