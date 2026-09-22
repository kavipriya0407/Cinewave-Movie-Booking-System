// Staff Sidebar Navigation
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Ticket, 
  Film, 
  Building, 
  Calendar, 
  Armchair, 
  BarChart3, 
  Bell, 
  User 
} from 'lucide-react';
import { getBookings } from '../../data/storageService';

export default function StaffSidebar() {
  const [pendingCount, setPendingCount] = useState(0);

  const calculatePending = () => {
    const bookings = getBookings();
    const count = bookings.filter(b => b.status === 'Booking Requested' || b.status === 'Under Review').length;
    setPendingCount(count);
  };

  useEffect(() => {
    calculatePending();
    const handleUpdate = () => calculatePending();
    window.addEventListener('cinewave_data_updated', handleUpdate);
    return () => window.removeEventListener('cinewave_data_updated', handleUpdate);
  }, []);

  return (
    <aside className="staff-sidebar">
      <span className="sidebar-title">Operations Control</span>

      <NavLink to="/staff/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} end>
        <LayoutDashboard size={18} />
        <span>Dashboard</span>
      </NavLink>

      <NavLink to="/staff/bookings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <Ticket size={18} />
        <span>Case Bookings</span>
        {pendingCount > 0 && (
          <span className="sidebar-badge">{pendingCount}</span>
        )}
      </NavLink>

      <span className="sidebar-title" style={{ marginTop: '1rem' }}>Cinema Management</span>

      <NavLink to="/staff/movies" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <Film size={18} />
        <span>Movies Catalog</span>
      </NavLink>

      <NavLink to="/staff/theatres" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <Building size={18} />
        <span>Theatres & Halls</span>
      </NavLink>

      <NavLink to="/staff/shows" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <Calendar size={18} />
        <span>Show Schedules</span>
      </NavLink>

      <NavLink to="/staff/seats" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <Armchair size={18} />
        <span>Seat Matrix</span>
      </NavLink>

      <span className="sidebar-title" style={{ marginTop: '1rem' }}>Business Intelligence</span>

      <NavLink to="/staff/reports" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <BarChart3 size={18} />
        <span>Reports & CSV</span>
      </NavLink>

      <NavLink to="/staff/notifications" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <Bell size={18} />
        <span>Alerts Feed</span>
      </NavLink>

      <NavLink to="/staff/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <User size={18} />
        <span>Staff Profile</span>
      </NavLink>
    </aside>
  );
}
