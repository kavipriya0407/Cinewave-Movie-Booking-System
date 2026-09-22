// Movies Catalog & Search Page
import React, { useState, useMemo } from 'react';
import { Search, Filter, RotateCcw, Film } from 'lucide-react';
import { getMovies, getTheatres } from '../../data/storageService';
import MovieCard from '../../components/customer/MovieCard';
import EmptyState from '../../components/common/EmptyState';

export default function MoviesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('ALL');
  const [selectedLanguage, setSelectedLanguage] = useState('ALL');
  const [selectedRating, setSelectedRating] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ALL');

  const movies = getMovies();
  const theatres = getTheatres();

  // Extract unique genres and languages
  const genres = ['ALL', 'Sci-Fi', 'Action', 'Thriller', 'Adventure', 'Drama'];
  const languages = ['ALL', 'English', 'Tamil'];
  const locations = ['ALL', 'Coimbatore', 'Chennai', 'Bangalore'];

  const filteredMovies = useMemo(() => {
    return movies.filter(m => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = m.title.toLowerCase().includes(q);
        const matchesDirector = (m.director || '').toLowerCase().includes(q);
        const matchesCast = (m.cast || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesDirector && !matchesCast) return false;
      }

      // Genre filter
      if (selectedGenre !== 'ALL') {
        if (!m.genre || !m.genre.toLowerCase().includes(selectedGenre.toLowerCase())) {
          return false;
        }
      }

      // Language filter
      if (selectedLanguage !== 'ALL') {
        if (!m.language || m.language.toLowerCase() !== selectedLanguage.toLowerCase()) {
          return false;
        }
      }

      // Rating filter
      if (selectedRating !== 'ALL') {
        const minRating = parseFloat(selectedRating);
        if (parseFloat(m.rating) < minRating) return false;
      }

      return true;
    });
  }, [movies, searchQuery, selectedGenre, selectedLanguage, selectedRating]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedGenre('ALL');
    setSelectedLanguage('ALL');
    setSelectedRating('ALL');
    setSelectedLocation('ALL');
  };

  return (
    <div className="movies-page container animate-fade-in" style={{ padding: '3rem 1.5rem 5rem' }}>
      <div className="section-header">
        <div>
          <h1 className="section-title">
            <span className="section-title-line" />
            Explore Movies
          </h1>
          <p className="section-subtitle">
            Browse currently running and upcoming movies across all CineWave multiplexes
          </p>
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Showing <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>{filteredMovies.length}</span> movies
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        {/* Search */}
        <div className="filter-search-box">
          <Search size={18} className="filter-search-icon" />
          <input
            type="text"
            className="form-input"
            placeholder="Search by movie title, cast, or director..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Genre */}
        <div style={{ minWidth: '150px' }}>
          <select 
            className="form-select" 
            value={selectedGenre} 
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            {genres.map(g => (
              <option key={g} value={g}>{g === 'ALL' ? 'All Genres' : g}</option>
            ))}
          </select>
        </div>

        {/* Language */}
        <div style={{ minWidth: '140px' }}>
          <select 
            className="form-select" 
            value={selectedLanguage} 
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            {languages.map(l => (
              <option key={l} value={l}>{l === 'ALL' ? 'All Languages' : l}</option>
            ))}
          </select>
        </div>

        {/* Rating */}
        <div style={{ minWidth: '140px' }}>
          <select 
            className="form-select" 
            value={selectedRating} 
            onChange={(e) => setSelectedRating(e.target.value)}
          >
            <option value="ALL">All Ratings</option>
            <option value="8.5">8.5+ Star</option>
            <option value="8.0">8.0+ Star</option>
            <option value="7.5">7.5+ Star</option>
          </select>
        </div>

        {/* Reset */}
        <button onClick={resetFilters} className="btn btn-secondary btn-sm" title="Reset filters">
          <RotateCcw size={15} /> Reset
        </button>
      </div>

      {/* Movies Grid */}
      {filteredMovies.length > 0 ? (
        <div className="grid-cards">
          {filteredMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Film}
          title="No movies found"
          description="We couldn't find any movies matching your current search or filter criteria."
          actionText="Reset All Filters"
          onAction={resetFilters}
        />
      )}
    </div>
  );
}
