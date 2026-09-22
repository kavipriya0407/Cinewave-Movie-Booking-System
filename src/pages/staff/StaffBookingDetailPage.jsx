// Staff In-Depth Booking Case Review & Progression Page
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  User, 
  Mail, 
  Phone, 
  Film, 
  Building, 
  Calendar, 
  Clock, 
  Armchair, 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  Send, 
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';
import StaffSidebar from '../../components/staff/StaffSidebar';
import LifecycleTracker from '../../components/common/LifecycleTracker';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { 
  getBookingById, 
  updateBookingStatus, 
  getShowBookedSeats,
  getShowById 
} from '../../data/storageService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters';

export default function StaffBookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [booking, setBooking] = useState(() => getBookingById(id));
  const [rejectReason, setRejectReason] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setBooking(getBookingById(id));
    window.addEventListener('cinewave_data_updated', handleUpdate);
    return () => window.removeEventListener('cinewave_data_updated', handleUpdate);
  }, [id]);

  if (!booking) {
    return (
      <div className="dashboard-layout">
        <StaffSidebar />
        <main className="dashboard-main" style={{ textAlign: 'center', padding: '5rem' }}>
          <h2>Case Not Found</h2>
          <Link to="/staff/bookings" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Back to Bookings
          </Link>
        </main>
      </div>
    );
  }

  const show = getShowById(booking.showId);
  const bookedSeatsForShow = getShowBookedSeats(booking.showId);
  const availableSeatsCount = Math.max(0, (show?.totalSeats || 48) - bookedSeatsForShow.length);

  const handleAction = (newStatus, reason = '') => {
    const actorName = `${user?.name || 'Operations Staff'} (Staff)`;
    const updated = updateBookingStatus(booking.id, newStatus, actorName, reason);
    if (updated) {
      setBooking(updated);
      showToast(`Case ${booking.id} transitioned to: ${newStatus}`, 'success');
      setIsRejectModalOpen(false);
      setRejectReason('');
    }
  };

  return (
    <div className="dashboard-layout animate-fade-in">
      <StaffSidebar />

      <main className="dashboard-main">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <Link 
            to="/staff/bookings" 
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}
          >
            <ChevronLeft size={16} /> Back to Bookings Queue
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status:</span>
            <StatusBadge status={booking.status} size="lg" />
          </div>
        </div>

        {/* Visual 6-Stage Progress Tracker */}
        <LifecycleTracker booking={booking} />

        {/* Staff Action Header Banner */}
        <div className="glass-panel" style={{
          padding: '1.5rem 2rem',
          marginBottom: '2rem',
          borderLeft: '4px solid var(--accent-gold)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.2rem' }}>
              Operational Workflow Decisions
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Execute state transitions according to CineWave compliance and seat verification policies
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {booking.status === 'Booking Requested' && (
              <>
                <button 
                  onClick={() => handleAction('Under Review')} 
                  className="btn btn-secondary btn-sm"
                >
                  Mark Under Review
                </button>
                <button 
                  onClick={() => handleAction('Awaiting Customer Confirmation')} 
                  className="btn btn-primary btn-sm"
                >
                  <Send size={15} /> Request Customer Confirmation
                </button>
              </>
            )}

            {booking.status === 'Under Review' && (
              <button 
                onClick={() => handleAction('Awaiting Customer Confirmation')} 
                className="btn btn-primary btn-sm"
              >
                <Send size={15} /> Request Customer Confirmation
              </button>
            )}

            {booking.status === 'Customer Confirmed' && (
              <button 
                onClick={() => handleAction('Booking Confirmed')} 
                className="btn btn-success btn-sm"
              >
                <CheckCircle2 size={16} /> Finalize Booking & Lock Seats
              </button>
            )}

            {booking.status === 'Booking Confirmed' && (
              <button 
                onClick={() => handleAction('Ticket Issued')} 
                className="btn btn-success btn-sm"
              >
                <CheckCircle2 size={16} /> Generate & Issue Gate Pass
              </button>
            )}

            {booking.status !== 'Rejected' && booking.status !== 'Cancelled' && booking.status !== 'Ticket Issued' && (
              <button 
                onClick={() => setIsRejectModalOpen(true)} 
                className="btn btn-danger btn-sm"
              >
                <XCircle size={15} /> Reject Request
              </button>
            )}
          </div>
        </div>

        {/* 3-Column Detailed Information Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem' }}>
          {/* Col 1: Customer Details */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--accent-gold)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} /> Customer Details
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
              <div>
                <span className="ticket-data-label">Legal Name</span>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '1rem', marginTop: '0.2rem' }}>
                  {booking.customerName}
                </div>
              </div>
              <div>
                <span className="ticket-data-label">Email Address</span>
                <div style={{ color: 'var(--text-light)', marginTop: '0.2rem' }}>{booking.customerEmail}</div>
              </div>
              <div>
                <span className="ticket-data-label">Phone Number</span>
                <div style={{ color: 'var(--text-light)', marginTop: '0.2rem' }}>{booking.customerPhone}</div>
              </div>
              <div>
                <span className="ticket-data-label">Customer ID</span>
                <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                  {booking.customerId}
                </div>
              </div>
            </div>
          </div>

          {/* Col 2: Movie & Showtime Details */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--accent-gold)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Film size={18} /> Movie & Screening Details
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
              <div>
                <span className="ticket-data-label">Feature Film</span>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '1.05rem', marginTop: '0.2rem' }}>
                  {booking.movieTitle}
                </div>
              </div>
              <div>
                <span className="ticket-data-label">Cinema Multiplex</span>
                <div style={{ color: '#fff', marginTop: '0.2rem' }}>{booking.theatreName}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{booking.theatreLocation}</div>
              </div>
              <div>
                <span className="ticket-data-label">Screen & Format</span>
                <div style={{ color: 'var(--accent-gold)', fontWeight: 600, marginTop: '0.2rem' }}>
                  {booking.screen} ({booking.format || '2D'})
                </div>
              </div>
              <div>
                <span className="ticket-data-label">Date & Time</span>
                <div style={{ color: '#fff', marginTop: '0.2rem' }}>
                  {formatDate(booking.bookingDate)} at <strong>{booking.showTime}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Col 3: Seating & Payment Details */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--accent-gold)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Armchair size={18} /> Seating & Payment Matrix
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
              <div>
                <span className="ticket-data-label">Assigned Seats</span>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent-gold)', fontSize: '1.2rem', marginTop: '0.2rem' }}>
                  {(booking.selectedSeats || []).join(', ')} ({booking.ticketCount} tickets)
                </div>
              </div>
              <div>
                <span className="ticket-data-label">Hall Capacity Stats</span>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                  Total Seats: 48 &bull; Available in Hall: <span className="text-emerald">{availableSeatsCount}</span>
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '0.75rem' }}>
                <div className="flex-between" style={{ fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                  <span style={{ color: '#fff' }}>{formatCurrency(booking.subtotal)}</span>
                </div>
                <div className="flex-between" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Convenience Fee</span>
                  <span style={{ color: '#fff' }}>{formatCurrency(booking.fee)}</span>
                </div>
                <div className="flex-between" style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                  <span style={{ color: '#fff' }}>Total Paid</span>
                  <span style={{ color: 'var(--accent-emerald)' }}>{formatCurrency(booking.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Reject Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title={`Reject Booking Case: ${booking.id}`}
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          if (!rejectReason.trim()) {
            showToast('Please state a reason for rejecting the booking.', 'error');
            return;
          }
          handleAction('Rejected', rejectReason.trim());
        }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Please specify why this customer booking is being rejected. This reason will be logged in the case audit trail and communicated to the customer.
          </p>
          <textarea
            className="form-textarea"
            rows={4}
            placeholder="e.g. Selected seats are no longer available due to emergency screen maintenance."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            required
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={() => setIsRejectModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-danger btn-sm">
              Confirm Rejection & Release Seats
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
