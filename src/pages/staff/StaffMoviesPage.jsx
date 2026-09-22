// Staff Movie Catalog CRUD Management Page
import React, { useState, useEffect } from 'react';
import { 
  Film, 
  Plus, 
  Edit, 
  Trash2, 
  Star, 
  Search, 
  Clock, 
  Calendar,
  Image as ImageIcon 
} from 'lucide-react';
import StaffSidebar from '../../components/staff/StaffSidebar';
import Modal from '../../components/common/Modal';
import { getMovies, saveMovie, deleteMovie } from '../../data/storageService';
import { useToast } from '../../context/ToastContext';
import { generateId } from '../../utils/idGenerator';

const INITIAL_FORM = {
  title: '',
  description: '',
  genre: 'Sci-Fi / Action',
  language: 'English',
  duration: '150 min',
  rating: '8.0',
  director: '',
  cast: '',
  releaseDate: new Date().toISOString().split('T')[0],
  poster: '',
  isUpcoming: false
};

export default function StaffMoviesPage() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const { showToast } = useToast();

  const loadData = () => {
    setMovies(getMovies());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('cinewave_data_updated', handleUpdate);
    return () => window.removeEventListener('cinewave_data_updated', handleUpdate);
  }, []);

  const handleOpenAdd = () => {
    setEditingMovie(null);
    setFormData(INITIAL_FORM);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (movie) => {
    setEditingMovie(movie);
    setFormData({ ...movie });
    setIsModalOpen(true);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}" from the cinema catalog?`)) {
      deleteMovie(id);
      showToast(`Movie "${title}" removed from catalog.`, 'info');
      loadData();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Please enter a movie title.', 'error');
      return;
    }

    const movieToSave = {
      ...formData,
      id: editingMovie ? editingMovie.id : generateId('mov'),
      poster: formData.poster.trim() || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80'
    };

    saveMovie(movieToSave);
    showToast(`Movie "${movieToSave.title}" saved successfully!`, 'success');
    setIsModalOpen(false);
    loadData();
  };

  const filteredMovies = movies.filter(m => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return m.title.toLowerCase().includes(q) || (m.genre || '').toLowerCase().includes(q);
  });

  return (
    <div className="dashboard-layout animate-fade-in">
      <StaffSidebar />

      <main className="dashboard-main">
        <div className="section-header">
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              Film Programming
            </span>
            <h1 className="section-title">Movies Catalog Management</h1>
            <p className="section-subtitle">
              Add new cinematic releases, edit film metadata, and configure theater listings
            </p>
          </div>

          <button onClick={handleOpenAdd} className="btn btn-primary btn-sm">
            <Plus size={16} /> Add New Movie
          </button>
        </div>

        {/* Search */}
        <div className="filter-bar" style={{ marginBottom: '2rem' }}>
          <div className="filter-search-box">
            <Search size={18} className="filter-search-icon" />
            <input
              type="text"
              className="form-input"
              placeholder="Search movie catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            {filteredMovies.length} movies cataloged
          </div>
        </div>

        {/* Movies Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.75rem' }}>
          {filteredMovies.map(movie => (
            <div key={movie.id} className="movie-card">
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
                  <Star size={13} fill="var(--accent-gold)" /> {movie.rating}
                </div>
                <div className="movie-lang-badge">{movie.language}</div>
              </div>

              <div className="movie-card-body">
                <h3 className="movie-title">{movie.title}</h3>
                <div className="movie-meta-info">
                  <span>{movie.duration}</span>
                  <span>&bull;</span>
                  <span>{movie.genre}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {movie.description}
                </p>

                <div className="movie-card-footer" style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '0.85rem' }}>
                  <button 
                    onClick={() => handleOpenEdit(movie)} 
                    className="btn btn-secondary btn-sm" 
                    style={{ flexGrow: 1 }}
                  >
                    <Edit size={14} /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(movie.id, movie.title)} 
                    className="btn btn-sm"
                    style={{ color: 'var(--accent-red)', padding: '0.4rem 0.75rem' }}
                    title="Delete movie"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Add / Edit Movie Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMovie ? `Edit Movie: ${editingMovie.title}` : 'Add New Movie to Catalog'}
        maxWidth="680px"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label"><Film size={15} /> Movie Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Inception"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Synopsis / Description</label>
            <textarea
              rows={3}
              className="form-textarea"
              placeholder="Plot overview..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Genre</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Sci-Fi / Action"
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Language</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. English, Tamil, Hindi"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label"><Clock size={14} /> Duration</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 148 min"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label"><Star size={14} /> Rating (out of 10)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 8.8"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label"><Calendar size={14} /> Release Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.releaseDate}
                onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Director</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Christopher Nolan"
                value={formData.director}
                onChange={(e) => setFormData({ ...formData, director: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Key Cast</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Leonardo DiCaprio, Tom Hardy"
                value={formData.cast}
                onChange={(e) => setFormData({ ...formData, cast: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label"><ImageIcon size={15} /> Poster Image URL</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://images.unsplash.com/photo-..."
              value={formData.poster}
              onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid var(--border-glass)', paddingTop: '1rem' }}>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              Save Movie Details
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
