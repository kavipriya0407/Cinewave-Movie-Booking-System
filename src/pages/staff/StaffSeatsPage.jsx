// Staff Seat Matrix & Hall Occupancy Inspector
import React, { useState, useEffect } from 'react';
import { 
  Armchair, 
  Calendar, 
  Film, 
  Building, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  TrendingUp,
  RotateCcw 
} from 'lucide-react';
import StaffSidebar from '../../components/staff/StaffSidebar';
import { 
  getShows, 
  getMovies, 
  getTheatres, 
  getShowBookedSeats,
  toggleSeatBlock,
  getBookings 
} from '../../data/storageService';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F'];
const COLS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function StaffSeatsPage() {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [selectedShowId, setSelectedShowId] = useState('');

  const { showToast } = useToast();

  const loadData = () => {
    const s = getShows();
    const m = getMovies();
    const t = getTheatres();
    setShows(s);
    setMovies(m);
    setTheatres(t);

    if (!selectedShowId && s.length > 0) {
      setSelectedShowId(s[0].id);
    }
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('cinewave_data_updated', handleUpdate);
    return () => window.removeEventListener('cinewave_data_updated', handleUpdate);
  }, []);

  const currentShow = shows.find(s => s.id === selectedShowId) || shows[0];
  const currentMovie = movies.find(m => m.id === currentShow?.movieId);
  const currentTheatre = theatres.find(t => t.id === currentShow?.theatreId);

  // Seat metrics
  const bookedSeats = currentShow ? getShowBookedSeats(currentShow.id) : [];
  const totalSeats = currentShow?.totalSeats || 48;
  const bookedCount = bookedSeats.length;
  const availableCount = Math.max(0, totalSeats - bookedCount);
  const occupancyPercent = Math.min(100, Math.round((bookedCount / totalSeats) * 100));

  // Staff can manually reserve or release individual seats
  const handleToggleSeat = (seatNumber) => {
    if (!currentShow) return;
    const success = toggleSeatBlock(currentShow.id, seatNumber);
    if (success) {
      const isNowBooked = !bookedSeats.includes(seatNumber);
      showToast(`Seat ${seatNumber} ${isNowBooked ? 'reserved/blocked' : 'released to general pool'}.`, 'info');
      loadData();
    }
  };

  return (
    <div className="dashboard-layout animate-fade-in">
      <StaffSidebar />

      <main className="dashboard-main">
        <div className="section-header">
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              Live Auditorium Matrix
            </span>
            <h1 className="section-title">Seat Inventory & Occupancy</h1>
            <p className="section-subtitle">
              Inspect live hall layout, monitor seat occupancy %, and manually reserve or release seats
            </p>
          </div>
        </div>

        {/* Show Selector Picker */}
        <div className="filter-bar" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <Calendar size={18} className="text-gold" />
            <span style={{ fontWeight: 600 }}>Select Screening Slot:</span>
          </div>

          <div style={{ flexGrow: 1 }}>
            <select
              className="form-select"
              value={selectedShowId}
              onChange={(e) => setSelectedShowId(e.target.value)}
            >
              {shows.map(s => {
                const mov = movies.find(m => m.id === s.movieId);
                const th = theatres.find(t => t.id === s.theatreId);
                return (
                  <option key={s.id} value={s.id}>
                    {mov?.title} &bull; {th?.name} &bull; {formatDate(s.date)} ({s.startTime} - {s.screen})
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {currentShow && (
          <>
            {/* Occupancy Statistics Banner */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2rem'
            }}>
              <div className="glass-panel" style={{ padding: '1.25rem 1.5rem' }}>
                <span className="ticket-data-label">Total Hall Capacity</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginTop: '0.25rem' }}>
                  {totalSeats}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>6 Rows &times; 8 Seats</div>
              </div>

              <div className="glass-panel" style={{ padding: '1.25rem 1.5rem' }}>
                <span className="ticket-data-label">Booked / Reserved</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-red)', marginTop: '0.25rem' }}>
                  {bookedCount}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Occupied by reservations</div>
              </div>

              <div className="glass-panel" style={{ padding: '1.25rem 1.5rem' }}>
                <span className="ticket-data-label">Available for Sale</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '0.25rem' }}>
                  {availableCount}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Open for customers</div>
              </div>

              <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', borderLeft: '4px solid var(--accent-gold)' }}>
                <span className="ticket-data-label">Hall Occupancy Rate</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-gold)', marginTop: '0.25rem' }}>
                  {occupancyPercent}%
                </div>
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '0.5rem' }}>
                  <div style={{ width: `${occupancyPercent}%`, height: '100%', background: 'var(--accent-gold)', borderRadius: '2px' }} />
                </div>
              </div>
            </div>

            {/* Visual Seat Map */}
            <div className="cinema-hall-container">
              <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.3rem', color: '#fff' }}>
                  {currentMovie?.title} &bull; {currentShow.screen}
                </h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Click any seat below to manually reserve (block) or release it
                </span>
              </div>

              {/* Screen */}
              <div className="screen-area">
                <div className="screen-curve" />
                <span className="screen-text">Cinema Auditorium Screen</span>
              </div>

              {/* Seat Matrix */}
              <div className="seating-grid">
                {ROWS.map(row => (
                  <div key={row} className="seat-row">
                    <span className="seat-row-label">{row}</span>

                    {COLS.map((col, idx) => {
                      const seatNumber = `${row}${col}`;
                      const isBooked = bookedSeats.includes(seatNumber);

                      return (
                        <React.Fragment key={seatNumber}>
                          {idx === 4 && <div className="seat-aisle-gap" />}
                          <button
                            type="button"
                            className={`seat-btn ${isBooked ? 'booked' : 'available'}`}
                            onClick={() => handleToggleSeat(seatNumber)}
                            title={`Seat ${seatNumber} - ${isBooked ? 'Occupied (Click to release)' : 'Available (Click to reserve)'}`}
                          >
                            {col}
                          </button>
                        </React.Fragment>
                      );
                    })}

                    <span className="seat-row-label">{row}</span>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="seat-legend">
                <div className="legend-item">
                  <div className="legend-seat-sample" style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.16)' }} />
                  <span>Available ({availableCount})</span>
                </div>
                <div className="legend-item">
                  <div className="legend-seat-sample" style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)' }} />
                  <span>Booked / Reserved ({bookedCount})</span>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
