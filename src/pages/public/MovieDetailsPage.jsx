// Movie Details & Showtimes Picker Page
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Star, 
  Clock, 
  Calendar, 
  Film, 
  User, 
  MapPin, 
  Sparkles, 
  Ticket, 
  ChevronLeft, 
  Armchair,
  Check 
} from 'lucide-react';
import { 
  getMovieById, 
  getTheatres, 
  getShowsForMovieAndTheatre, 
  getShowBookedSeats 
} from '../../data/storageService';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectMovie, selectTheatre, selectDate, selectShow } = useBooking();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const movie = getMovieById(id);
  const theatres = getTheatres();

  // Selected state
  const today = new Date();
  const dates = [
    { label: 'Today', val: today.toISOString().split('T')[0] },
    { label: 'Tomorrow', val: new Date(today.getTime() + 86400000).toISOString().split('T')[0] },
    { label: 'Day 3', val: new Date(today.getTime() + 86400000 * 2).toISOString().split('T')[0] },
    { label: 'Day 4', val: new Date(today.getTime() + 86400000 * 3).toISOString().split('T')[0] }
  ];

  const [selectedDate, setSelectedDate] = useState(dates[0].val);
  const [selectedTheatreId, setSelectedTheatreId] = useState(theatres[0]?.id || '');
  const [selectedShowObj, setSelectedShowObj] = useState(null);

  if (!movie) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h2>Movie not found</h2>
        <Link to="/movies" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Movies
        </Link>
      </div>
    );
  }

  // Get shows for current selected theatre and date
  const availableShows = getShowsForMovieAndTheatre(movie.id, selectedTheatreId, selectedDate);

  const handleSelectShow = (show, theatre) => {
    setSelectedShowObj(show);
    selectMovie(movie);
    selectTheatre(theatre);
    selectDate(selectedDate);
    selectShow(show);
  };

  const handleProceedToSeats = () => {
    if (!selectedShowObj) {
      showToast('Please choose a showtime first.', 'warning');
      return;
    }
    const currentTheatre = theatres.find(t => t.id === selectedTheatreId);
    selectMovie(movie);
    selectTheatre(currentTheatre);
    selectDate(selectedDate);
    selectShow(selectedShowObj);
    navigate('/customer/seats');
  };

  return (
    <div className="movie-details-page animate-fade-in" style={{ paddingBottom: '6rem' }}>
      {/* Movie Hero Banner */}
      <div style={{
        position: 'relative',
        background: `linear-gradient(to bottom, rgba(10, 13, 20, 0.5) 0%, rgba(10, 13, 20, 0.95) 80%, var(--bg-main) 100%), url(${movie.backdrop || movie.poster}) center/cover no-repeat`,
        padding: '3rem 0 4rem',
        borderBottom: '1px solid var(--border-glass)'
      }}>
        <div className="container">
          <Link to="/movies" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.88rem' }}>
            <ChevronLeft size={16} /> Back to Movies
          </Link>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(220px, 280px) 1fr',
            gap: '2.5rem',
            alignItems: 'center'
          }}>
            <img 
              src={movie.poster} 
              alt={movie.title} 
              style={{
                width: '100%',
                borderRadius: 'var(--radius-xl)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.8), 0 0 25px rgba(245, 158, 11, 0.2)',
                border: '1px solid rgba(255,255,255,0.15)',
                aspectRatio: '2/3',
                objectFit: 'cover'
              }}
            />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.2)', color: 'var(--accent-gold)', border: '1px solid #f59e0b' }}>
                  <Star size={13} fill="var(--accent-gold)" /> {movie.rating} / 10
                </span>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.08)', color: '#fff' }}>
                  {movie.language}
                </span>
                <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.2)', color: 'var(--accent-indigo)' }}>
                  {movie.duration}
                </span>
              </div>

              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, marginBottom: '1rem', color: '#fff' }}>
                {movie.title}
              </h1>

              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: '800px' }}>
                {movie.description}
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1.25rem',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.25rem'
              }}>
                <div>
                  <span className="ticket-data-label">Director</span>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.92rem', marginTop: '0.2rem' }}>
                    {movie.director}
                  </div>
                </div>

                <div>
                  <span className="ticket-data-label">Starring Cast</span>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.92rem', marginTop: '0.2rem' }}>
                    {movie.cast}
                  </div>
                </div>

                <div>
                  <span className="ticket-data-label">Release Date</span>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.92rem', marginTop: '0.2rem' }}>
                    {formatDate(movie.releaseDate)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Showtimes & Theatres Picker */}
      <div className="container" style={{ marginTop: '3.5rem' }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">
              <span className="section-title-line" />
              Available Theatres & Showtimes
            </h2>
            <p className="section-subtitle">Select your preferred date, venue, and screening time</p>
          </div>
        </div>

        {/* Date Selector Pills */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {dates.map(d => (
            <button
              key={d.val}
              onClick={() => { setSelectedDate(d.val); setSelectedShowObj(null); }}
              className={`btn btn-sm ${selectedDate === d.val ? 'btn-primary' : 'btn-secondary'}`}
              style={{ minWidth: '120px', padding: '0.65rem 1.25rem' }}
            >
              <Calendar size={15} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
                <span style={{ fontWeight: 700 }}>{d.label}</span>
                <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>{d.val}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Theatres List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {theatres.map(th => {
            const showsForThisTh = getShowsForMovieAndTheatre(movie.id, th.id, selectedDate);
            const isThSelected = selectedTheatreId === th.id;

            return (
              <div 
                key={th.id}
                className="glass-panel"
                style={{
                  padding: '1.75rem',
                  borderColor: isThSelected ? 'var(--accent-gold)' : 'var(--border-glass)'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  marginBottom: '1.25rem',
                  borderBottom: '1px solid var(--border-glass)',
                  paddingBottom: '1rem'
                }}>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '0.25rem' }}>
                      {th.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                      <MapPin size={14} className="text-gold" />
                      <span>{th.location} &bull; {th.address}</span>
                      <span>&bull;</span>
                      <span className="text-gold">{th.distance || '2.4 km'}</span>
                    </div>
                  </div>

                  {/* Facilities */}
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {(th.facilities || []).slice(0, 4).map((f, i) => (
                      <span key={i} className="facility-chip">
                        <Sparkles size={11} /> {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Showtimes for this Theatre */}
                <div>
                  <span className="ticket-data-label" style={{ marginBottom: '0.75rem', display: 'block' }}>
                    Select Screening Time & Screen
                  </span>
                  
                  {showsForThisTh.length > 0 ? (
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      {showsForThisTh.map(sh => {
                        const booked = getShowBookedSeats(sh.id);
                        const availableCount = Math.max(0, (sh.totalSeats || 48) - booked.length);
                        const isShowActive = selectedShowObj?.id === sh.id;

                        return (
                          <button
                            key={sh.id}
                            type="button"
                            onClick={() => {
                              setSelectedTheatreId(th.id);
                              handleSelectShow(sh, th);
                            }}
                            className={`show-time-btn ${isShowActive ? 'active' : ''}`}
                            style={{ padding: '0.85rem 1.25rem', minWidth: '150px' }}
                          >
                            <span className="show-time-format">{sh.screen} &bull; {sh.format}</span>
                            <span className="show-time-val">{sh.startTime}</span>
                            <span className="show-time-price">{formatCurrency(sh.price)}</span>
                            <span style={{ fontSize: '0.72rem', color: isShowActive ? '#000' : 'var(--accent-emerald)', marginTop: '0.2rem', fontWeight: 600 }}>
                              {availableCount} seats left
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', padding: '0.75rem 0' }}>
                      No showtimes scheduled at this theatre on {selectedDate}. Please select another date.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sticky Action Footer Bar */}
        {selectedShowObj && (
          <div className="booking-summary-bar">
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Selected Show</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                {selectedShowObj.startTime} &bull; {selectedShowObj.screen} ({selectedShowObj.format})
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--accent-gold)' }}>
                {formatCurrency(selectedShowObj.price)} per ticket
              </div>
            </div>

            <button onClick={handleProceedToSeats} className="btn btn-primary btn-lg">
              <Armchair size={18} /> Select Seats <Check size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
