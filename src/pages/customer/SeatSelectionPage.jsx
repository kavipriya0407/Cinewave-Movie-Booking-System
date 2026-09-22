// Interactive Cinema Seat Selection Page
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  Armchair, 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowRight, 
  RotateCcw 
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getShowBookedSeats } from '../../data/storageService';
import SeatGrid from '../../components/customer/SeatGrid';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function SeatSelectionPage() {
  const navigate = useNavigate();
  const { 
    movie, 
    theatre, 
    date, 
    show, 
    selectedSeats, 
    toggleSeat, 
    clearSeats, 
    subtotal, 
    fee, 
    total,
    ticketPrice 
  } = useBooking();

  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  // If page accessed without selecting a movie or show, redirect back
  if (!movie || !show) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <h2>No Show Selected</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>
          Please select a movie and screening time first to choose your seats.
        </p>
        <Link to="/movies" className="btn btn-primary">
          Browse Movies
        </Link>
      </div>
    );
  }

  const bookedSeats = getShowBookedSeats(show.id);

  const handleContinue = () => {
    if (!isAuthenticated) {
      showToast('Please sign in before booking tickets.', 'warning');
      navigate('/login', { state: { from: { pathname: '/customer/seats' } } });
      return;
    }

    if (selectedSeats.length === 0) {
      showToast('Please select at least one seat to continue.', 'error');
      return;
    }

    navigate('/customer/book');
  };

  return (
    <div className="seat-selection-page container animate-fade-in" style={{ padding: '2.5rem 1.5rem 6rem' }}>
      {/* Top Header & Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <Link 
          to={`/movie/${movie.id}`} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}
        >
          <ChevronLeft size={16} /> Back to Movie Details
        </Link>

        {selectedSeats.length > 0 && (
          <button 
            onClick={clearSeats} 
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.8rem' }}
          >
            <RotateCcw size={14} /> Clear Selected ({selectedSeats.length})
          </button>
        )}
      </div>

      {/* Show Information Banner */}
      <div className="glass-panel" style={{
        padding: '1.25rem 1.75rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
            {show.screen} &bull; {show.format || 'IMAX'}
          </div>
          <h2 style={{ fontSize: '1.4rem', color: '#fff', margin: '0.15rem 0' }}>
            {movie.title}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            <span>{theatre?.name || 'CineWave Multiplex'}</span>
            <span>&bull;</span>
            <span>{formatDate(date)}</span>
            <span>&bull;</span>
            <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>{show.startTime}</span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span className="ticket-data-label">Price Per Seat</span>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
            {formatCurrency(show.price)}
          </div>
        </div>
      </div>

      {/* Interactive Seat Matrix */}
      <SeatGrid
        bookedSeats={bookedSeats}
        selectedSeats={selectedSeats}
        onToggleSeat={toggleSeat}
        ticketPrice={show.price}
      />

      {/* Floating Summary Bar */}
      <div className="booking-summary-bar">
        <div className="summary-selection-info">
          <div className="summary-stat">
            <span className="summary-stat-label">Selected Seats</span>
            {selectedSeats.length > 0 ? (
              <div className="selected-seat-chips">
                {selectedSeats.map(seat => (
                  <span key={seat} className="selected-chip">{seat}</span>
                ))}
              </div>
            ) : (
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>None selected</span>
            )}
          </div>

          <div className="summary-stat">
            <span className="summary-stat-label">Tickets</span>
            <span className="summary-stat-value">{selectedSeats.length}</span>
          </div>

          <div className="summary-stat">
            <span className="summary-stat-label">Subtotal</span>
            <span className="summary-stat-value">{formatCurrency(subtotal)}</span>
          </div>

          <div className="summary-stat">
            <span className="summary-stat-label">Convenience Fee</span>
            <span className="summary-stat-value">{formatCurrency(fee)}</span>
          </div>

          <div className="summary-stat">
            <span className="summary-stat-label">Total Amount</span>
            <span className="summary-stat-value highlight">{formatCurrency(total)}</span>
          </div>
        </div>

        <button 
          onClick={handleContinue} 
          disabled={selectedSeats.length === 0}
          className="btn btn-primary btn-lg"
          title={selectedSeats.length === 0 ? 'Select at least one seat to continue' : 'Proceed to booking details'}
        >
          Continue Booking <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
