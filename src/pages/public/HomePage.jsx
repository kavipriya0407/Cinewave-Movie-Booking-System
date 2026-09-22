// CineWave Cinema Homepage
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Film, 
  Ticket, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Bell, 
  ChevronRight, 
  Armchair, 
  Building,
  CheckCircle2
} from 'lucide-react';
import { getMovies, getTheatres } from '../../data/storageService';
import MovieCard from '../../components/customer/MovieCard';
import TheatreCard from '../../components/customer/TheatreCard';

export default function HomePage() {
  const navigate = useNavigate();
  const movies = getMovies();
  const theatres = getTheatres();

  const nowShowing = movies.filter(m => !m.isUpcoming);
  const comingSoon = movies.filter(m => m.isUpcoming);

  return (
    <div className="home-page animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-backdrop-glow" />
        <div className="container">
          <div className="hero-grid">
            <div>
              <div className="hero-badge-tag">
                <Sparkles size={14} /> Premier Cinema & Booking System
              </div>
              <h1 className="hero-title">
                Experience Movies <br />
                <span className="hero-title-highlight">Like Never Before</span>
              </h1>
              <p className="hero-subtitle">
                Book your favourite movies, choose your perfect seat, and enjoy a seamless cinema experience with real-time digital case tracking.
              </p>

              <div className="hero-actions">
                <Link to="/movies" className="btn btn-primary btn-lg">
                  <Ticket size={20} /> Book Tickets Now
                </Link>
                <a href="#now-showing" className="btn btn-secondary btn-lg">
                  <Film size={20} /> Explore Movies
                </a>
              </div>

              {/* Stats Bar */}
              <div className="hero-stats">
                <div className="hero-stat-item">
                  <h4>{movies.length}+</h4>
                  <p>Blockbuster Movies</p>
                </div>
                <div className="hero-stat-item">
                  <h4>{theatres.length}</h4>
                  <p>Luxury Theatres</p>
                </div>
                <div className="hero-stat-item">
                  <h4>100%</h4>
                  <p>Real-Time Availability</p>
                </div>
              </div>
            </div>

            {/* Visual Cinema Poster Reel */}
            <div className="hero-visual">
              <div className="hero-card-stack">
                <img 
                  src={nowShowing[0]?.poster || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80"} 
                  alt="Featured Movie" 
                  className="hero-feature-poster"
                />
                <div className="hero-floating-badge">
                  <div className="hero-floating-badge-icon">
                    <Armchair size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff' }}>IMAX & 4DX Experience</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)' }}>Dolby Atmos Surround Audio</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Now Showing Section */}
      <section id="now-showing" style={{ padding: '5rem 0' }}>
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">
                <span className="section-title-line" />
                Now Showing in Theatres
              </h2>
              <p className="section-subtitle">Catch the biggest blockbusters on giant screens today</p>
            </div>
            <Link to="/movies" className="btn btn-secondary btn-sm">
              View All Movies <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid-cards">
            {nowShowing.slice(0, 4).map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section style={{ padding: '4rem 0', background: 'rgba(17, 23, 38, 0.4)', borderTop: '1px solid var(--border-glass)', borderBottom: '1px solid var(--border-glass)' }}>
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">
                <span className="section-title-line" style={{ background: 'var(--accent-indigo)' }} />
                Coming Soon
              </h2>
              <p className="section-subtitle">Upcoming spectacles arriving exclusively at CineWave</p>
            </div>
            <Link to="/movies" className="btn btn-secondary btn-sm">
              Explore Lineup <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid-cards">
            {nowShowing.slice(4, 8).concat(comingSoon).map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Theatres Section */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">
                <span className="section-title-line" />
                Popular Theatres & Multiplexes
              </h2>
              <p className="section-subtitle">State-of-the-art projection and sound across premier venues</p>
            </div>
            <Link to="/theatres" className="btn btn-secondary btn-sm">
              All Theatres <ChevronRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {theatres.map(th => (
              <TheatreCard key={th.id} theatre={th} onSelect={() => navigate(`/theatres`)} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose CineWave? */}
      <section style={{ padding: '5rem 0', background: 'rgba(10, 13, 20, 0.9)', borderTop: '1px solid var(--border-glass)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              The CineWave Advantage
            </span>
            <h2 style={{ fontSize: '2.4rem', marginTop: '0.4rem', color: '#fff' }}>
              Why Choose CineWave?
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Built with enterprise-grade Pega case management workflows to ensure transparency and instant confirmation.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.75rem' }}>
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-lg)', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <Ticket size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '0.5rem' }}>Easy Booking</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                Intuitive 4-step booking flow from movie selection to instant gate-ready QR pass.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-lg)', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-indigo)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <Armchair size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '0.5rem' }}>Real-Time Availability</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                Interactive cinema curved seat matrix showing live booked, reserved, and available seats.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-lg)', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <ShieldCheck size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '0.5rem' }}>Secure Confirmation</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                Dual-stage customer confirmation with operational audit logs before final seat locking.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-lg)', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <Bell size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '0.5rem' }}>Instant Notifications</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                Live in-app alerts whenever your booking status moves from review to ticket issuance.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
