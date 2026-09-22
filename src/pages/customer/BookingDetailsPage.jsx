// Customer Booking Confirmation Form Page
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  Film, 
  Building, 
  Calendar, 
  Clock, 
  Armchair, 
  CreditCard, 
  Send, 
  User, 
  Mail, 
  Phone, 
  MessageSquare,
  ShieldCheck 
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { saveBooking, addNotification } from '../../data/storageService';
import { generateBookingId } from '../../utils/idGenerator';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function BookingDetailsPage() {
  const navigate = useNavigate();
  const { 
    movie, 
    theatre, 
    date, 
    show, 
    selectedSeats, 
    subtotal, 
    fee, 
    total, 
    resetBooking 
  } = useBooking();

  const { user } = useAuth();
  const { showToast } = useToast();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [specialRequest, setSpecialRequest] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If no booking in progress, redirect
  if (!movie || !show || selectedSeats.length === 0) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <h2>No Active Booking</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>
          Please select a movie, showtime, and seats first.
        </p>
        <Link to="/movies" className="btn btn-primary">
          Browse Movies
        </Link>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!customerName.trim()) {
      showToast('Please enter your full name.', 'error');
      return;
    }
    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 8) {
      showToast('Please enter a valid phone number.', 'error');
      return;
    }

    setIsSubmitting(true);

    const bookingId = generateBookingId();
    const newBooking = {
      id: bookingId,
      customerId: user?.id || `user-guest-${Date.now()}`,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerPhone: customerPhone.trim(),
      movieId: movie.id,
      movieTitle: movie.title,
      theatreId: theatre?.id || 'th-001',
      theatreName: theatre?.name || 'CineWave Multiplex',
      theatreLocation: theatre?.location || 'Coimbatore',
      showId: show.id,
      screen: show.screen,
      format: show.format || '2D',
      bookingDate: date,
      showTime: show.startTime,
      selectedSeats: [...selectedSeats],
      ticketCount: selectedSeats.length,
      ticketPrice: show.price,
      subtotal,
      fee,
      total,
      status: 'Booking Requested', // Stage 1 of Pega Case Lifecycle
      specialRequest: specialRequest.trim(),
      rejectionReason: '',
      createdAt: new Date().toISOString(),
      timeline: [
        {
          stage: 'Booking Requested',
          title: 'Booking Request Submitted',
          description: `Customer submitted reservation for ${selectedSeats.length} seats (${selectedSeats.join(', ')}).`,
          actor: `${customerName.trim()} (Customer)`,
          timestamp: new Date().toISOString()
        }
      ]
    };

    // Save to localStorage
    saveBooking(newBooking);

    // Notify staff of new request
    addNotification({
      userId: 'user-staff-001',
      role: 'staff',
      bookingId: newBooking.id,
      message: `New booking request ${newBooking.id} submitted by ${customerName} for ${movie.title}.`,
      type: 'new_request'
    });

    // Notify customer
    addNotification({
      userId: newBooking.customerId,
      role: 'customer',
      bookingId: newBooking.id,
      message: `Your booking request ${newBooking.id} is under review by cinema operations.`,
      type: 'info'
    });

    showToast(`Booking request ${bookingId} submitted successfully!`, 'success');
    resetBooking();
    navigate(`/customer/booking/${bookingId}`);
  };

  return (
    <div className="booking-details-page container animate-fade-in" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <Link 
        to="/customer/seats" 
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.88rem' }}
      >
        <ChevronLeft size={16} /> Back to Seat Selection
      </Link>

      <div className="section-header" style={{ marginBottom: '1.75rem' }}>
        <div>
          <h1 className="section-title">
            <span className="section-title-line" />
            Complete Your Booking Request
          </h1>
          <p className="section-subtitle">
            Verify your ticket details and submit your digital case request for staff review
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: '2.5rem',
        alignItems: 'flex-start'
      }}>
        {/* Left Form */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={18} className="text-gold" /> Customer Contact Information
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                <User size={15} /> Full Name
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Full legal name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">
                  <Mail size={15} /> Email Address
                </label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="name@domain.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Phone size={15} /> Phone Number
                </label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="+91 98765 43210"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <MessageSquare size={15} /> Special Request / Note (Optional)
              </label>
              <textarea
                rows={3}
                className="form-textarea"
                placeholder="e.g. Wheelchair access needed, booster seat for child, celebration shoutout..."
                value={specialRequest}
                onChange={(e) => setSpecialRequest(e.target.value)}
              />
            </div>

            <div style={{
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.25rem',
              margin: '1.5rem 0',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start'
            }}>
              <ShieldCheck size={20} className="text-gold" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <strong style={{ color: '#fff' }}>Pega Case Lifecycle Workflow:</strong> Submitting this request initiates Stage 1 (<code style={{ color: 'var(--accent-gold)' }}>Booking Requested</code>). Cinema operations will verify allocation and notify you to confirm your tickets before final charge.
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn btn-primary btn-lg" 
              style={{ width: '100%' }}
            >
              <Send size={18} /> Submit Booking Request
            </button>
          </form>
        </div>

        {/* Right Summary Card */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1.5rem' }}>
            Reservation Summary
          </h3>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)' }}>
            <img 
              src={movie.poster} 
              alt={movie.title} 
              style={{ width: '80px', height: '110px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }} 
            />
            <div>
              <h4 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '0.25rem' }}>{movie.title}</h4>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: 600, marginBottom: '0.4rem' }}>
                {show.screen} &bull; {show.format || 'IMAX'}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{theatre?.name}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{theatre?.location}</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem', fontSize: '0.88rem' }}>
            <div className="flex-between">
              <span style={{ color: 'var(--text-secondary)' }}>Date</span>
              <span style={{ fontWeight: 600, color: '#fff' }}>{formatDate(date)}</span>
            </div>
            <div className="flex-between">
              <span style={{ color: 'var(--text-secondary)' }}>Showtime</span>
              <span style={{ fontWeight: 700, color: 'var(--accent-gold)' }}>{show.startTime}</span>
            </div>
            <div className="flex-between">
              <span style={{ color: 'var(--text-secondary)' }}>Seats Selected</span>
              <span style={{ fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono)' }}>
                {selectedSeats.join(', ')} ({selectedSeats.length} seats)
              </span>
            </div>
            <div className="flex-between">
              <span style={{ color: 'var(--text-secondary)' }}>Ticket Price</span>
              <span style={{ color: '#fff' }}>{formatCurrency(show.price)} &times; {selectedSeats.length}</span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1.25rem' }}>
            <div className="flex-between" style={{ marginBottom: '0.5rem', fontSize: '0.88rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
              <span style={{ color: '#fff' }}>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex-between" style={{ marginBottom: '1rem', fontSize: '0.88rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Convenience Fee</span>
              <span style={{ color: '#fff' }}>{formatCurrency(fee)}</span>
            </div>
            <div className="flex-between" style={{ paddingTop: '0.75rem', borderTop: '1px dashed var(--border-glass)', fontSize: '1.15rem' }}>
              <span style={{ fontWeight: 700, color: '#fff' }}>Total Payable</span>
              <span style={{ fontWeight: 800, color: 'var(--accent-gold)', fontSize: '1.35rem' }}>
                {formatCurrency(total)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
