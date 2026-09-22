// Digital Cinema Ticket Component
import React, { useEffect, useRef } from 'react';
import { 
  Film, 
  Download, 
  Printer, 
  CheckCircle, 
  QrCode, 
  Sparkles, 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function DigitalTicket({ booking }) {
  const ticketRef = useRef(null);

  useEffect(() => {
    // Launch celebratory confetti when viewing confirmed ticket
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#e11d48', '#10b981', '#6366f1']
      });
    } catch (e) {
      // ignore
    }
  }, []);

  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate simple text/json slip or print window
    window.print();
  };

  return (
    <div className="ticket-wrapper">
      <div className="cinema-ticket" ref={ticketRef}>
        {/* Perforation Notches */}
        <div className="ticket-notch top" />
        <div className="ticket-notch bottom" />

        {/* Main Ticket Section */}
        <div className="ticket-main">
          <div>
            <div className="ticket-brand">
              <div className="brand-icon" style={{ width: '28px', height: '28px' }}>
                <Film size={16} />
              </div>
              <span>CINE<span style={{ color: '#fff' }}>WAVE</span></span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: 'auto', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Digital Admission Pass
              </span>
            </div>

            <h2 className="ticket-movie-title">{booking.movieTitle}</h2>
            <div className="ticket-movie-format">{booking.format || 'IMAX 2D'} &bull; {booking.screen}</div>

            <div className="ticket-grid">
              <div>
                <span className="ticket-data-label">Cinema Theatre</span>
                <div className="ticket-data-val">{booking.theatreName}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{booking.theatreLocation}</div>
              </div>

              <div>
                <span className="ticket-data-label">Date & Showtime</span>
                <div className="ticket-data-val">{formatDate(booking.bookingDate)}</div>
                <div style={{ fontSize: '0.88rem', color: 'var(--accent-gold)', fontWeight: 700 }}>{booking.showTime}</div>
              </div>

              <div>
                <span className="ticket-data-label">Seats ({booking.ticketCount || booking.selectedSeats?.length})</span>
                <div className="ticket-seats-highlight">
                  {(booking.selectedSeats || []).join(', ')}
                </div>
              </div>
            </div>

            <div className="ticket-grid" style={{ marginBottom: 0, paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <span className="ticket-data-label">Ticket Holder</span>
                <div className="ticket-data-val" style={{ fontSize: '0.95rem' }}>{booking.customerName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{booking.customerPhone}</div>
              </div>

              <div>
                <span className="ticket-data-label">Amount Paid</span>
                <div className="ticket-data-val" style={{ color: 'var(--accent-emerald)', fontSize: '1.1rem' }}>
                  {formatCurrency(booking.total)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Inclusive of all taxes</div>
              </div>

              <div>
                <span className="ticket-data-label">Status</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '0.9rem', marginTop: '0.2rem' }}>
                  <ShieldCheck size={16} /> Verified & Issued
                </div>
              </div>
            </div>
          </div>

          <div className="no-print" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button onClick={handleDownload} className="btn btn-primary btn-sm">
              <Download size={15} /> Download Ticket
            </button>
            <button onClick={handlePrint} className="btn btn-secondary btn-sm">
              <Printer size={15} /> Print Ticket
            </button>
          </div>
        </div>

        {/* Ticket Stub */}
        <div className="ticket-stub">
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              CineWave Entry Gate
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginTop: '0.25rem' }}>
              {booking.screen}
            </div>
          </div>

          {/* QR Code Graphic */}
          <div className="ticket-qr-container">
            <div className="ticket-qr-box">
              {/* Clean SVG QR code representation */}
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                <rect width="100" height="100" fill="white"/>
                {/* Corner Anchors */}
                <rect x="8" y="8" width="28" height="28" fill="black" />
                <rect x="12" y="12" width="20" height="20" fill="white" />
                <rect x="16" y="16" width="12" height="12" fill="black" />

                <rect x="64" y="8" width="28" height="28" fill="black" />
                <rect x="68" y="12" width="20" height="20" fill="white" />
                <rect x="72" y="16" width="12" height="12" fill="black" />

                <rect x="8" y="64" width="28" height="28" fill="black" />
                <rect x="12" y="68" width="20" height="20" fill="white" />
                <rect x="16" y="72" width="12" height="12" fill="black" />

                {/* Data Matrix Dots */}
                <rect x="42" y="10" width="8" height="8" fill="black" />
                <rect x="42" y="24" width="8" height="8" fill="black" />
                <rect x="10" y="42" width="8" height="8" fill="black" />
                <rect x="24" y="42" width="8" height="8" fill="black" />
                <rect x="42" y="42" width="16" height="16" fill="black" />
                <rect x="64" y="42" width="8" height="8" fill="black" />
                <rect x="78" y="42" width="12" height="8" fill="black" />
                <rect x="42" y="64" width="8" height="12" fill="black" />
                <rect x="64" y="64" width="12" height="8" fill="black" />
                <rect x="80" y="76" width="10" height="10" fill="black" />
                <rect x="56" y="80" width="8" height="10" fill="black" />
              </svg>
            </div>
            <div className="ticket-code">{booking.id}</div>
            <div className="ticket-admit-text">Scan for Admission</div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', width: '100%', paddingTop: '0.75rem' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Non-refundable &bull; Valid for 1 entry
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
