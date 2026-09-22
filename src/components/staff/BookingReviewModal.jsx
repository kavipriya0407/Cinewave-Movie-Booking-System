// Staff Booking Review & Decision Modal
import React, { useState } from 'react';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import { 
  User, 
  Film, 
  MapPin, 
  Calendar, 
  Clock, 
  Armchair, 
  CreditCard, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Send 
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { updateBookingStatus } from '../../data/storageService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function BookingReviewModal({ booking, isOpen, onClose, onUpdated }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectBox, setShowRejectBox] = useState(false);

  if (!booking) return null;

  const actorName = user?.name ? `${user.name} (Staff)` : 'Staff Member';

  const handleAction = (newStatus, reason = '') => {
    const updated = updateBookingStatus(booking.id, newStatus, actorName, reason);
    if (updated) {
      showToast(`Case ${booking.id} transitioned to: ${newStatus}`, 'success');
      setShowRejectBox(false);
      setRejectReason('');
      if (onUpdated) onUpdated(updated);
      onClose();
    }
  };

  const handleRejectSubmit = (e) => {
    e.preventDefault();
    if (!rejectReason.trim()) {
      showToast('Please provide a reason for rejecting the booking.', 'warning');
      return;
    }
    handleAction('Rejected', rejectReason.trim());
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Review Booking Case: ${booking.id}`}
      maxWidth="700px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Status Header Banner */}
        <div className="flex-between" style={{
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '0.9rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-glass)'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Current Case Status</span>
            <div style={{ marginTop: '0.2rem' }}>
              <StatusBadge status={booking.status} size="md" />
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Created At</span>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 600 }}>
              {new Date(booking.createdAt).toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div>
          <h4 style={{ fontSize: '0.95rem', color: 'var(--accent-gold)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <User size={16} /> Customer Information
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            background: 'var(--bg-surface)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-glass)'
          }}>
            <div>
              <span className="ticket-data-label">Name</span>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem' }}>{booking.customerName}</div>
            </div>
            <div>
              <span className="ticket-data-label">Email</span>
              <div style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>{booking.customerEmail}</div>
            </div>
            <div>
              <span className="ticket-data-label">Phone</span>
              <div style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>{booking.customerPhone}</div>
            </div>
          </div>
        </div>

        {/* Movie & Show Details */}
        <div>
          <h4 style={{ fontSize: '0.95rem', color: 'var(--accent-gold)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Film size={16} /> Movie & Show Details
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            background: 'var(--bg-surface)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-glass)'
          }}>
            <div>
              <span className="ticket-data-label">Movie</span>
              <div style={{ fontWeight: 700, color: '#fff' }}>{booking.movieTitle}</div>
            </div>
            <div>
              <span className="ticket-data-label">Theatre</span>
              <div style={{ color: 'var(--text-light)' }}>{booking.theatreName}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{booking.theatreLocation}</div>
            </div>
            <div>
              <span className="ticket-data-label">Screen & Format</span>
              <div style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>{booking.screen} ({booking.format || '2D'})</div>
            </div>
            <div>
              <span className="ticket-data-label">Date</span>
              <div style={{ color: 'var(--text-primary)' }}>{formatDate(booking.bookingDate)}</div>
            </div>
            <div>
              <span className="ticket-data-label">Show Time</span>
              <div style={{ color: 'var(--text-primary)' }}>{booking.showTime}</div>
            </div>
            <div>
              <span className="ticket-data-label">Selected Seats</span>
              <div style={{ color: 'var(--accent-gold)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                {(booking.selectedSeats || []).join(', ')} ({booking.ticketCount} tickets)
              </div>
            </div>
          </div>
        </div>

        {/* Special Request */}
        {booking.specialRequest && (
          <div style={{
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            padding: '0.85rem 1.15rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.88rem'
          }}>
            <span style={{ fontWeight: 700, color: 'var(--accent-gold)' }}>Customer Request: </span>
            <span style={{ color: 'var(--text-primary)' }}>{booking.specialRequest}</span>
          </div>
        )}

        {/* Financial Breakdown */}
        <div>
          <h4 style={{ fontSize: '0.95rem', color: 'var(--accent-gold)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CreditCard size={16} /> Financial Calculation
          </h4>
          <div style={{
            background: 'var(--bg-surface)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-glass)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <span className="ticket-data-label">Subtotal</span>
              <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{formatCurrency(booking.subtotal)}</div>
            </div>
            <div>
              <span className="ticket-data-label">Convenience Fee</span>
              <div style={{ color: 'var(--text-secondary)' }}>{formatCurrency(booking.fee)}</div>
            </div>
            <div>
              <span className="ticket-data-label">Total Payable</span>
              <div style={{ color: 'var(--accent-emerald)', fontWeight: 800, fontSize: '1.2rem' }}>
                {formatCurrency(booking.total)}
              </div>
            </div>
          </div>
        </div>

        {/* Rejection Form Box */}
        {showRejectBox && (
          <form onSubmit={handleRejectSubmit} style={{
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem'
          }}>
            <h5 style={{ color: 'var(--accent-red)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertTriangle size={16} /> Enter Reason for Rejection (Required)
            </h5>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="e.g. Selected seats are no longer available due to emergency maintenance."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              required
            />
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => setShowRejectBox(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-danger btn-sm">
                Confirm Rejection & Release Seats
              </button>
            </div>
          </form>
        )}

        {/* Action Buttons depending on Lifecycle Stage */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap', paddingTop: '1rem', borderTop: '1px solid var(--border-glass)' }}>
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
                <Send size={14} /> Request Customer Confirmation
              </button>
            </>
          )}

          {booking.status === 'Under Review' && (
            <button 
              onClick={() => handleAction('Awaiting Customer Confirmation')} 
              className="btn btn-primary btn-sm"
            >
              <Send size={14} /> Request Customer Confirmation
            </button>
          )}

          {booking.status === 'Customer Confirmed' && (
            <button 
              onClick={() => handleAction('Booking Confirmed')} 
              className="btn btn-success btn-sm"
            >
              <CheckCircle2 size={15} /> Finalize Booking & Issue Ticket
            </button>
          )}

          {booking.status === 'Booking Confirmed' && (
            <button 
              onClick={() => handleAction('Ticket Issued')} 
              className="btn btn-success btn-sm"
            >
              <CheckCircle2 size={15} /> Issue Gate Pass / Ticket
            </button>
          )}

          {booking.status !== 'Rejected' && booking.status !== 'Cancelled' && booking.status !== 'Ticket Issued' && !showRejectBox && (
            <button 
              onClick={() => setShowRejectBox(true)} 
              className="btn btn-danger btn-sm"
            >
              <XCircle size={14} /> Reject Request
            </button>
          )}

          <button onClick={onClose} className="btn btn-secondary btn-sm">
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
