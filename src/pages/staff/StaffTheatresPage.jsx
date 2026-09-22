// Staff Multiplex Theatres CRUD Page
import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Plus, 
  Edit, 
  Trash2, 
  MapPin, 
  Phone, 
  Sparkles,
  Search 
} from 'lucide-react';
import StaffSidebar from '../../components/staff/StaffSidebar';
import Modal from '../../components/common/Modal';
import { getTheatres, saveTheatre, deleteTheatre } from '../../data/storageService';
import { useToast } from '../../context/ToastContext';
import { generateId } from '../../utils/idGenerator';

const AVAILABLE_FACILITIES = [
  'IMAX Laser',
  'Dolby Atmos',
  '4DX',
  'VIP Recliners',
  'Valet Parking',
  'Food Court',
  'Wheelchair Access',
  'RGB Laser Projection'
];

const INITIAL_FORM = {
  name: '',
  location: 'Coimbatore',
  address: '',
  screens: 4,
  contact: '',
  facilities: ['Dolby Atmos', 'Parking', 'Food Court', 'Wheelchair Access'],
  distance: '3.0 km away'
};

export default function StaffTheatresPage() {
  const [theatres, setTheatres] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTheatre, setEditingTheatre] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const { showToast } = useToast();

  const loadData = () => {
    setTheatres(getTheatres());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('cinewave_data_updated', handleUpdate);
    return () => window.removeEventListener('cinewave_data_updated', handleUpdate);
  }, []);

  const handleOpenAdd = () => {
    setEditingTheatre(null);
    setFormData(INITIAL_FORM);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (th) => {
    setEditingTheatre(th);
    setFormData({ ...th });
    setIsModalOpen(true);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteTheatre(id);
      showToast(`Theatre ${name} deleted successfully.`, 'info');
      loadData();
    }
  };

  const handleFacilityToggle = (facility) => {
    const exists = formData.facilities.includes(facility);
    if (exists) {
      setFormData({ ...formData, facilities: formData.facilities.filter(f => f !== facility) });
    } else {
      setFormData({ ...formData, facilities: [...formData.facilities, facility] });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Please enter theatre name.', 'error');
      return;
    }

    const theatreToSave = {
      ...formData,
      id: editingTheatre ? editingTheatre.id : generateId('th'),
      screens: parseInt(formData.screens, 10) || 4
    };

    saveTheatre(theatreToSave);
    showToast(`Theatre ${theatreToSave.name} saved successfully!`, 'success');
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
              Venue Infrastructure
            </span>
            <h1 className="section-title">Theatre & Screen Management</h1>
            <p className="section-subtitle">
              Manage cinema multiplex venues, screening halls, and technical audio/visual installations
            </p>
          </div>

          <button onClick={handleOpenAdd} className="btn btn-primary btn-sm">
            <Plus size={16} /> Add New Theatre
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.75rem' }}>
          {theatres.map(th => (
            <div key={th.id} className="theatre-card">
              <div className="theatre-header">
                <div>
                  <h3 className="theatre-name">{th.name}</h3>
                  <div className="theatre-location">
                    <MapPin size={14} className="text-gold" />
                    <span>{th.location}</span>
                  </div>
                </div>
                <span className="theatre-screens-badge">
                  {th.screens} Screens
                </span>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                {th.address}
              </p>

              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                <Phone size={13} style={{ display: 'inline', marginRight: '4px' }} />
                <span>{th.contact}</span>
              </div>

              <div className="theatre-facilities">
                {(th.facilities || []).map((f, i) => (
                  <span key={i} className="facility-chip active">
                    <Sparkles size={11} /> {f}
                  </span>
                ))}
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '1.25rem', borderTop: '1px solid var(--border-glass)', display: 'flex', gap: '0.75rem' }}>
                <button 
                  onClick={() => handleOpenEdit(th)} 
                  className="btn btn-secondary btn-sm"
                  style={{ flexGrow: 1 }}
                >
                  <Edit size={14} /> Edit Venue
                </button>
                <button 
                  onClick={() => handleDelete(th.id, th.name)} 
                  className="btn btn-sm"
                  style={{ color: 'var(--accent-red)' }}
                  title="Delete theatre"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Add / Edit Theatre Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTheatre ? `Edit Theatre: ${editingTheatre.name}` : 'Add New Multiplex Venue'}
        maxWidth="600px"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label"><Building size={15} /> Theatre Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. CineWave Prestige Mall"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label"><MapPin size={15} /> City / Location</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Coimbatore, Chennai, Bangalore"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Number of Screens</label>
              <input
                type="number"
                min="1"
                max="20"
                className="form-input"
                value={formData.screens}
                onChange={(e) => setFormData({ ...formData, screens: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Address</label>
            <input
              type="text"
              className="form-input"
              placeholder="Street address, district, postal code"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label"><Phone size={15} /> Contact Number</label>
            <input
              type="tel"
              className="form-input"
              placeholder="+91 422 2589000"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              required
            />
          </div>

          {/* Facilities Checklist */}
          <div className="form-group">
            <label className="form-label"><Sparkles size={15} /> Available Facilities</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginTop: '0.25rem' }}>
              {AVAILABLE_FACILITIES.map(fac => {
                const isChecked = formData.facilities.includes(fac);
                return (
                  <label 
                    key={fac}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.85rem',
                      padding: '0.4rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      background: isChecked ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isChecked ? 'var(--accent-gold)' : 'var(--border-glass)'}`,
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleFacilityToggle(fac)}
                      style={{ accentColor: 'var(--accent-gold)' }}
                    />
                    <span style={{ color: isChecked ? '#fff' : 'var(--text-secondary)' }}>{fac}</span>
                  </label>
                );
              })}
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
              Save Theatre Details
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
