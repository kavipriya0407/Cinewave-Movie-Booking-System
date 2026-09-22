// Movie Card Component
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Clock, Calendar, Ticket } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';

export default function MovieCard({ movie }) {
  const navigate = useNavigate();
  const { selectMovie } = useBooking();
  const { isAuthenticated } = useAuth();

  const handleBookNow = (e) => {
    e.stopPropagation();
    selectMovie(movie);
    navigate(`/movie/${movie.id}`);
  };

  const handleDetails = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="movie-card" onClick={handleDetails} style={{ cursor: 'pointer' }}>
      <div className="movie-poster-wrap">
        <img 
          src={movie.poster} 
          alt={movie.title} 
          className="movie-poster-img"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="movie-rating-badge">
          <Star size={14} fill="var(--accent-gold)" />
          {movie.rating}
        </div>
        <div className="movie-lang-badge">
          {movie.language}
        </div>
      </div>

      <div className="movie-card-body">
        <h3 className="movie-title" title={movie.title}>{movie.title}</h3>
        
        <div className="movie-meta-info">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Clock size={13} /> {movie.duration}
          </span>
          <span>&bull;</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Calendar size={13} /> {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : '2026'}
          </span>
        </div>

        <div className="movie-genre-tags">
          {(movie.genre || '').split('/').map((g, i) => (
            <span key={i} className="genre-chip">{g.trim()}</span>
          ))}
        </div>

        <div className="movie-card-footer">
          <button 
            onClick={handleBookNow} 
            className="btn btn-primary btn-sm" 
            style={{ flexGrow: 1 }}
          >
            <Ticket size={15} /> Book Now
          </button>
          <button 
            onClick={handleDetails} 
            className="btn btn-secondary btn-sm"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
}
