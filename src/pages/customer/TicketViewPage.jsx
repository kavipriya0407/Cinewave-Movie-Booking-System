// Digital Ticket Display Page
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ArrowLeft } from 'lucide-react';
import { getBookingById } from '../../data/storageService';
import DigitalTicket from '../../components/customer/DigitalTicket';

export default function TicketViewPage() {
  const { id } = useParams();
  const booking = getBookingById(id);

  if (!booking) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <h2>Ticket Not Found</h2>
        <Link to="/customer/bookings" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to My Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="ticket-view-page container animate-fade-in" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <Link 
          to={`/customer/booking/${booking.id}`} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}
        >
          <ChevronLeft size={16} /> Back to Case Tracking
        </Link>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Ticket Reference: <strong style={{ color: 'var(--accent-gold)' }}>{booking.id}</strong>
        </span>
      </div>

      <div className="no-print" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: '#fff', fontWeight: 800 }}>
          Your Official CineWave Admission Pass
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Present this pass at the gate or turnstile on your arrival
        </p>
      </div>

      {/* Ticket Rendering */}
      <DigitalTicket booking={booking} />
    </div>
  );
}
