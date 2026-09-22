// Staff Bookings Case Management Master Table
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  Eye, 
  CheckCircle2, 
  Send, 
  XCircle, 
  Download, 
  FileSpreadsheet,
  Clock 
} from 'lucide-react';
import StaffSidebar from '../../components/staff/StaffSidebar';
import StatusBadge from '../../components/common/StatusBadge';
import BookingReviewModal from '../../components/staff/BookingReviewModal';
import { getBookings, getMovies, getTheatres, updateBookingStatus } from '../../data/storageService';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters';
import { exportBookingsToCSV } from '../../utils/csvExporter';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export default function StaffBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [movieFilter, setMovieFilter] = useState('ALL');
  const [theatreFilter, setTheatreFilter] = useState('ALL');

  const { showToast } = useToast();
  const { user } = useAuth();

  const loadData = () => {
    setBookings(getBookings());
    setMovies(getMovies());
    setTheatres(getTheatres());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('cinewave_data_updated', handleUpdate);
    return () => window.removeEventListener('cinewave_data_updated', handleUpdate);
  }, []);

  const handleQuickStatusChange = (bookingId, newStatus, reason = '') => {
    const actorName = `${user?.name || 'Staff'} (Staff)`;
    const updated = updateBookingStatus(bookingId, newStatus, actorName, reason);
    if (updated) {
      showToast(`Booking ${bookingId} transitioned to: ${newStatus}`, 'success');
      loadData();
    }
  };

  const handleExportCSV = () => {
    exportBookingsToCSV(filteredBookings, `cinewave_bookings_${Date.now()}.csv`);
    showToast('Exported filtered bookings to CSV successfully!', 'success');
  };

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setMovieFilter('ALL');
    setTheatreFilter('ALL');
  };

  const filteredBookings = bookings.filter(b => {
    if (statusFilter !== 'ALL' && b.status !== statusFilter) return false;
    if (movieFilter !== 'ALL' && b.movieId !== movieFilter) return false;
    if (theatreFilter !== 'ALL' && b.theatreId !== theatreFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = (b.id || '').toLowerCase().includes(q);
      const matchCust = (b.customerName || '').toLowerCase().includes(q);
      const matchEmail = (b.customerEmail || '').toLowerCase().includes(q);
      const matchMovie = (b.movieTitle || '').toLowerCase().includes(q);
      if (!matchId && !matchCust && !matchEmail && !matchMovie) return false;
    }
    return true;
  });

  return (
    <div className="dashboard-layout animate-fade-in">
      <StaffSidebar />

      <main className="dashboard-main">
        <div className="section-header">
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              Case Lifecycle Management
            </span>
            <h1 className="section-title">All Customer Bookings</h1>
            <p className="section-subtitle">
              Review, approve, confirm, or reject movie ticket reservations across all multiplex branches
            </p>
          </div>

          <button onClick={handleExportCSV} className="btn btn-secondary btn-sm">
            <FileSpreadsheet size={16} /> Export to CSV
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="filter-bar">
          <div className="filter-search-box">
            <Search size={18} className="filter-search-icon" />
            <input
              type="text"
              className="form-input"
              placeholder="Search by Booking ID, Customer name, email, or movie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div style={{ minWidth: '180px' }}>
            <select 
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses ({bookings.length})</option>
              <option value="Booking Requested">Booking Requested</option>
              <option value="Under Review">Under Review</option>
              <option value="Awaiting Customer Confirmation">Awaiting Customer Confirmation</option>
              <option value="Customer Confirmed">Customer Confirmed</option>
              <option value="Booking Confirmed">Booking Confirmed</option>
              <option value="Ticket Issued">Ticket Issued</option>
              <option value="Rejected">Rejected</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Movie Filter */}
          <div style={{ minWidth: '160px' }}>
            <select
              className="form-select"
              value={movieFilter}
              onChange={(e) => setMovieFilter(e.target.value)}
            >
              <option value="ALL">All Movies</option>
              {movies.map(m => (
                <option key={m.id} value={m.id}>{m.title}</option>
              ))}
            </select>
          </div>

          {/* Theatre Filter */}
          <div style={{ minWidth: '160px' }}>
            <select
              className="form-select"
              value={theatreFilter}
              onChange={(e) => setTheatreFilter(e.target.value)}
            >
              <option value="ALL">All Theatres</option>
              {theatres.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <button onClick={resetFilters} className="btn btn-secondary btn-sm" title="Reset filters">
            <RotateCcw size={15} /> Reset
          </button>
        </div>

        {/* Master Case Table */}
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Movie</th>
                <th>Theatre</th>
                <th>Date & Show</th>
                <th>Seats</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Created At</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map(b => (
                  <tr key={b.id}>
                    <td>
                      <Link 
                        to={`/staff/bookings/${b.id}`}
                        style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-gold)' }}
                      >
                        {b.id}
                      </Link>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{b.customerName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.customerPhone}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-light)' }}>{b.movieTitle}</div>
                    </td>
                    <td>
                      <div>{b.theatreName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.screen} ({b.format || '2D'})</div>
                    </td>
                    <td>
                      <div>{formatDate(b.bookingDate)}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--accent-gold)' }}>{b.showTime}</div>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#fff' }}>
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
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {formatDateTime(b.createdAt)}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <button 
                          onClick={() => setSelectedBookingForReview(b)}
                          className="btn btn-secondary btn-sm"
                          title="Open Case Review"
                        >
                          <Eye size={13} /> Review
                        </button>

                        {/* Quick Action Based on State */}
                        {b.status === 'Booking Requested' && (
                          <button
                            onClick={() => handleQuickStatusChange(b.id, 'Awaiting Customer Confirmation')}
                            className="btn btn-primary btn-sm"
                            title="Request customer confirmation"
                          >
                            <Send size={13} /> Request Confirm
                          </button>
                        )}

                        {b.status === 'Under Review' && (
                          <button
                            onClick={() => handleQuickStatusChange(b.id, 'Awaiting Customer Confirmation')}
                            className="btn btn-primary btn-sm"
                            title="Request customer confirmation"
                          >
                            <Send size={13} /> Request Confirm
                          </button>
                        )}

                        {b.status === 'Customer Confirmed' && (
                          <button
                            onClick={() => handleQuickStatusChange(b.id, 'Booking Confirmed')}
                            className="btn btn-success btn-sm"
                            title="Confirm booking and issue ticket"
                          >
                            <CheckCircle2 size={13} /> Finalize
                          </button>
                        )}

                        <Link 
                          to={`/staff/bookings/${b.id}`}
                          className="btn btn-secondary btn-sm"
                          title="View Full Case History"
                        >
                          Details
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No bookings found matching the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Review Modal */}
      {selectedBookingForReview && (
        <BookingReviewModal
          booking={selectedBookingForReview}
          isOpen={!!selectedBookingForReview}
          onClose={() => setSelectedBookingForReview(null)}
          onUpdated={() => {
            loadData();
            setSelectedBookingForReview(null);
          }}
        />
      )}
    </div>
  );
}
