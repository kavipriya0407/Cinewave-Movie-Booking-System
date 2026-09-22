// Staff Show Schedule Management Page
import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  Film, 
  Building, 
  IndianRupee, 
  Armchair,
  Search 
} from 'lucide-react';
import StaffSidebar from '../../components/staff/StaffSidebar';
import Modal from '../../components/common/Modal';
import { 
  getShows, 
  saveShow, 
  deleteShow, 
  getMovies, 
  getTheatres, 
  getShowBookedSeats 
} from '../../data/storageService';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { generateId } from '../../utils/idGenerator';

const FORMATS = ['2D', '3D', 'IMAX', '4DX'];

export default function StaffShowsPage() {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShow, setEditingShow] = useState(null);

  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    movieId: '',
    theatreId: '',
    screen: 'Screen 1',
    date: todayStr,
    startTime: '10:00 AM',
    endTime: '01:00 PM',
    format: 'IMAX',
    price: 250,
    totalSeats: 48
  });

  const { showToast } = useToast();

  const loadData = () => {
    setShows(getShows());
    const m = getMovies();
    const t = getTheatres();
    setMovies(m);
    setTheatres(t);

    if (!formData.movieId && m.length > 0) {
      setFormData(prev => ({ ...prev, movieId: m[0].id, theatreId: t[0]?.id || '' }));
    }
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('cinewave_data_updated', handleUpdate);
    return () => window.removeEventListener('cinewave_data_updated', handleUpdate);
  }, []);

  const handleOpenAdd = () => {
    setEditingShow(null);
    setFormData({
      movieId: movies[0]?.id || '',
      theatreId: theatres[0]?.id || '',
      screen: 'Screen 1',
      date: todayStr,
      startTime: '10:00 AM',
      endTime: '01:00 PM',
      format: 'IMAX',
      price: 250,
      totalSeats: 48
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (show) => {
    setEditingShow(show);
    setFormData({
      ...show,
      price: show.price || 250,
      totalSeats: show.totalSeats || 48
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this scheduled show?')) {
      deleteShow(id);
      showToast('Show deleted successfully.', 'info');
      loadData();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.movieId || !formData.theatreId) {
      showToast('Please select both a movie and a theatre venue.', 'error');
      return;
    }

    const showToSave = {
      ...formData,
      id: editingShow ? editingShow.id : generateId('show'),
      price: parseInt(formData.price, 10) || 250,
      totalSeats: parseInt(formData.totalSeats, 10) || 48,
      bookedSeats: editingShow?.bookedSeats || []
    };

    saveShow(showToSave);
    showToast('Show schedule saved successfully!', 'success');
    setIsModalOpen(false);
    loadData();
  };

  return (
    <div className="dashboard-layout animate-fade-in">
      <StaffSidebar />

      <main className="dashboard-main">
        <div className="section-header">
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              Timetable & Programming
            </span>
            <h1 className="section-title">Show Schedules Management</h1>
            <p className="section-subtitle">
              Schedule movie screening slots, allocate screens, and configure ticket tariffs
            </p>
          </div>

          <button onClick={handleOpenAdd} className="btn btn-primary btn-sm">
            <Plus size={16} /> Schedule New Show
          </button>
        </div>

        {/* Shows Table */}
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Movie</th>
                <th>Theatre Venue</th>
                <th>Screen & Format</th>
                <th>Date</th>
                <th>Show Timing</th>
                <th>Ticket Price</th>
                <th>Seating Capacity</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shows.map(s => {
                const movie = movies.find(m => m.id === s.movieId);
                const theatre = theatres.find(t => t.id === s.theatreId);
                const booked = getShowBookedSeats(s.id);
                const available = Math.max(0, (s.totalSeats || 48) - booked.length);
                const occupancyPercent = Math.round((booked.length / (s.totalSeats || 48)) * 100);

                return (
                  <tr key={s.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#fff' }}>
                        {movie?.title || s.movieId}
                      </div>
                    </td>
                    <td>
                      <div style={{ color: 'var(--text-light)' }}>{theatre?.name || s.theatreId}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{theatre?.location}</div>
                    </td>
                    <td>
                      <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.12)', color: 'var(--accent-gold)', border: '1px solid rgba(245,158,11,0.3)' }}>
                        {s.format || '2D'}
                      </span>
                      <span style={{ marginLeft: '0.5rem', color: 'var(--text-secondary)' }}>{s.screen}</span>
                    </td>
                    <td>
                      <div style={{ color: '#fff' }}>{formatDate(s.date)}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--accent-gold)' }}>{s.startTime}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>to {s.endTime || 'End'}</div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>
                        {formatCurrency(s.price)}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 700, color: '#fff' }}>{available} / {s.totalSeats || 48}</span>
                        <span style={{ fontSize: '0.75rem', color: occupancyPercent > 60 ? 'var(--accent-gold)' : 'var(--text-muted)' }}>
                          ({occupancyPercent}% full)
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                        <button 
                          onClick={() => handleOpenEdit(s)}
                          className="btn btn-secondary btn-sm"
                          title="Edit show schedule"
                        >
                          <Edit size={13} />
                        </button>
                        <button 
                          onClick={() => handleDelete(s.id)}
                          className="btn btn-sm"
                          style={{ color: 'var(--accent-red)' }}
                          title="Delete show"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>

      {/* Add / Edit Show Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingShow ? 'Edit Show Schedule' : 'Schedule New Cinema Screening'}
        maxWidth="620px"
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label"><Film size={15} /> Select Movie</label>
              <select
                className="form-select"
                value={formData.movieId}
                onChange={(e) => setFormData({ ...formData, movieId: e.target.value })}
                required
              >
                {movies.map(m => (
                  <option key={m.id} value={m.id}>{m.title}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label"><Building size={15} /> Select Multiplex Venue</label>
              <select
                className="form-select"
                value={formData.theatreId}
                onChange={(e) => setFormData({ ...formData, theatreId: e.target.value })}
                required
              >
                {theatres.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.location})</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Screen Number</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Screen 1 (IMAX)"
                value={formData.screen}
                onChange={(e) => setFormData({ ...formData, screen: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Screening Format</label>
              <select
                className="form-select"
                value={formData.format}
                onChange={(e) => setFormData({ ...formData, format: e.target.value })}
              >
                {FORMATS.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label"><Calendar size={14} /> Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label"><Clock size={14} /> Start Time</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 10:00 AM"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label"><Clock size={14} /> End Time</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 01:00 PM"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label"><IndianRupee size={15} /> Ticket Price (₹)</label>
              <input
                type="number"
                min="50"
                step="10"
                className="form-input"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label"><Armchair size={15} /> Total Hall Capacity</label>
              <input
                type="number"
                min="10"
                max="250"
                className="form-input"
                value={formData.totalSeats}
                onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
                required
              />
            </div>
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
              Schedule Show
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
