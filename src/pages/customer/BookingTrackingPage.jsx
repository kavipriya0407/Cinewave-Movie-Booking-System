// Booking Case Tracking & Customer Confirmation Page
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  Ticket, 
  Download, 
  Printer, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Film, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  Sparkles,
  ArrowRight 
} from 'lucide-react';
import { getBookingById, updateBookingStatus } from '../../data/storageService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import LifecycleTracker from '../../components/common/LifecycleTracker';
import StatusBadge from '../../components/common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function BookingTrackingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [booking, setBooking] = useState(() => getBookingById(id));
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setBooking(getBookingById(id));
    };
    window.addEventListener('cinewave_data_updated', handleUpdate);
    return () => window.removeEventListener('cinewave_data_updated', handleUpdate);
  }, [id]);

  if (!booking) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <h2>Booking Case Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>
          We could not find a booking with ID: <span style={{ fontFamily: 'var(--font-mono)' }}>{id}</span>
        </p>
        <Link to="/customer/bookings" className="btn btn-primary">
          Back to My Bookings
        </Link>
      </div>
    );
  }

  // Handle Stage 4: Customer Confirms the Booking
  const handleCustomerConfirm = () => {
    setIsProcessing(true);
    const updated = updateBookingStatus(
      booking.id, 
      'Customer Confirmed', 
      `${user?.name || 'Customer'} (Customer)`
    );
    if (updated) {
      setBooking(updated);
      showToast('You have confirmed your booking! Staff has been notified for final ticket issuance.', 'success');
    }
    setIsProcessing(false);
  };

  // Handle Customer Declining the Confirmation Request
  const handleCustomerDecline = () => {
    if (window.confirm('Are you sure you want to decline this booking? Your seats will be released.')) {
      setIsProcessing(true);
      const updated = updateBookingStatus(
        booking.id, 
        'Cancelled', 
        `${user?.name || 'Customer'} (Customer)`,
        'Customer declined confirmation request.'
      );
      if (updated) {
        setBooking(updated);
        showToast('Booking declined and cancelled.', 'info');
      }
      setIsProcessing(false);
    }
  };

  // Handle Customer Cancellation
  const handleCustomerCancel = () => {
    if (window.confirm('Are you sure you want to cancel this booking? This action is permanent.')) {
      setIsProcessing(true);
      const updated = updateBookingStatus(
        booking.id, 
        'Cancelled', 
        `${user?.name || 'Customer'} (Customer)`,
        'Customer voluntarily cancelled before screening.'
      );
      if (updated) {
        setBooking(updated);
        showToast('Booking cancelled successfully. Selected seats released.', 'info');
      }
      setIsProcessing(false);
    }
  };

  const isAwaitingConfirmation = booking.status === 'Awaiting Customer Confirmation';
  const isTicketReady = booking.status === 'Ticket Issued' || booking.status === 'Booking Confirmed';
  const canCancel = ['Booking Requested', 'Under Review', 'Awaiting Customer Confirmation'].includes(booking.status);

  return (
    <div className="booking-tracking-page container animate-fade-in" style={{ padding: '2.5rem 1.5rem 6rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <Link 
          to="/customer/bookings" 
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}
        >
          <ChevronLeft size={16} /> Back to My Bookings
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Case Reference:</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-gold)' }}>{booking.id}</span>
        </div>
      </div>

      {/* Visual 6-Stage Pega Lifecycle Progress Tracker */}
      <LifecycleTracker booking={booking} />

      {/* IMPORTANT: Stage 3 & 4 Customer Confirmation Callout */}
      {isAwaitingConfirmation && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
          border: '2px solid #a855f7',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          marginBottom: '2.5rem',
          boxShadow: '0 0 30px rgba(168, 85, 247, 0.25)'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, #a855f7, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              flexShrink: 0
            }}>
              <AlertTriangle size={24} />
            </div>

            <div style={{ flexGrow: 1, minWidth: '260px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#d8b4fe', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Action Required by Customer
              </span>
              <h3 style={{ fontSize: '1.4rem', color: '#fff', margin: '0.2rem 0 0.5rem' }}>
                Your booking request has been reviewed. Please confirm your booking to proceed.
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1.5rem', maxWidth: '720px' }}>
                Cinema operations staff has verified seat allocation for <strong>{booking.movieTitle}</strong> on <strong>{formatDate(booking.bookingDate)} at {booking.showTime}</strong> ({booking.selectedSeats.join(', ')}). Click below to authorize final ticket issuance.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={handleCustomerConfirm}
                  disabled={isProcessing}
                  className="btn btn-primary btn-lg"
                  style={{ background: 'linear-gradient(135deg, #10b981, #059669)', borderColor: '#34d399', color: '#fff' }}
                >
                  <CheckCircle2 size={18} /> Confirm Booking Now
                </button>
                <button
                  onClick={handleCustomerDecline}
                  disabled={isProcessing}
                  className="btn btn-secondary btn-lg"
                  style={{ color: 'var(--accent-red)', borderColor: 'rgba(239,68,68,0.3)' }}
                >
                  <XCircle size={18} /> Decline Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Ready Callout */}
      {isTicketReady && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.12) 100%)',
          border: '1px solid #10b981',
          borderRadius: 'var(--radius-xl)',
          padding: '1.75rem 2rem',
          marginBottom: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '0.85rem' }}>
              <CheckCircle2 size={18} /> BOOKING CONFIRMED & TICKET READY
            </div>
            <h3 style={{ fontSize: '1.3rem', color: '#fff', margin: '0.25rem 0' }}>
              Your digital entry ticket with gate QR code has been issued!
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              Present the QR code at the cinema entry turnstile or download your printable ticket copy.
            </p>
          </div>

          <Link to={`/customer/ticket/${booking.id}`} className="btn btn-success btn-lg">
            <Ticket size={20} /> View Digital Ticket
          </Link>
        </div>
      )}

      {/* Booking Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Left Column: Details */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1.25rem' }}>
            Case Parameters & Screening Details
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <span className="ticket-data-label">Movie</span>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '1.1rem', marginTop: '0.2rem' }}>
                {booking.movieTitle}
              </div>
            </div>

            <div>
              <span className="ticket-data-label">Theatre & Location</span>
              <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem', marginTop: '0.2rem' }}>
                {booking.theatreName}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{booking.theatreLocation}</div>
            </div>

            <div>
              <span className="ticket-data-label">Screen & Format</span>
              <div style={{ fontWeight: 600, color: 'var(--accent-gold)', marginTop: '0.2rem' }}>
                {booking.screen} ({booking.format || '2D'})
              </div>
            </div>

            <div>
              <span className="ticket-data-label">Date & Showtime</span>
              <div style={{ fontWeight: 600, color: '#fff', marginTop: '0.2rem' }}>
                {formatDate(booking.bookingDate)}
              </div>
              <div style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>{booking.showTime}</div>
            </div>

            <div>
              <span className="ticket-data-label">Selected Seats</span>
              <div style={{ fontWeight: 800, color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)', fontSize: '1.1rem', marginTop: '0.2rem' }}>
                {(booking.selectedSeats || []).join(', ')} ({booking.ticketCount || booking.selectedSeats?.length} tickets)
              </div>
            </div>

            <div>
              <span className="ticket-data-label">Customer Contact</span>
              <div style={{ color: '#fff', fontWeight: 600, marginTop: '0.2rem' }}>{booking.customerName}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{booking.customerEmail} &bull; {booking.customerPhone}</div>
            </div>
          </div>

          {booking.specialRequest && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1.15rem',
              fontSize: '0.85rem',
              marginBottom: '1.5rem'
            }}>
              <span style={{ fontWeight: 700, color: 'var(--accent-gold)' }}>Special Request: </span>
              <span style={{ color: 'var(--text-secondary)' }}>{booking.specialRequest}</span>
            </div>
          )}

          {canCancel && (
            <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={handleCustomerCancel} 
                disabled={isProcessing}
                className="btn btn-secondary btn-sm"
                style={{ color: 'var(--accent-red)' }}
              >
                Cancel Booking
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Financial Summary */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1.25rem' }}>
            Payment Summary
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            <div className="flex-between">
              <span style={{ color: 'var(--text-secondary)' }}>Ticket Price</span>
              <span style={{ color: '#fff' }}>{formatCurrency(booking.ticketPrice || 250)} &times; {booking.ticketCount}</span>
            </div>
            <div className="flex-between">
              <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
              <span style={{ color: '#fff' }}>{formatCurrency(booking.subtotal)}</span>
            </div>
            <div className="flex-between">
              <span style={{ color: 'var(--text-secondary)' }}>Convenience Fee</span>
              <span style={{ color: '#fff' }}>{formatCurrency(booking.fee)}</span>
            </div>
          </div>

          <div className="flex-between" style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1.25rem', marginBottom: '1.5rem' }}>
            <span style={{ fontWeight: 700, color: '#fff', fontSize: '1.05rem' }}>Total Amount</span>
            <span style={{ fontWeight: 800, color: 'var(--accent-gold)', fontSize: '1.4rem' }}>
              {formatCurrency(booking.total)}
            </span>
          </div>

          {isTicketReady ? (
            <Link to={`/customer/ticket/${booking.id}`} className="btn btn-primary" style={{ width: '100%' }}>
              <Ticket size={18} /> Open Digital Ticket
            </Link>
          ) : (
            <div style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Ticket will be downloadable once staff confirms and completes ticket issuance.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
