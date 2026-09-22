// Dynamic CineWave Navbar
import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  Film, 
  Ticket, 
  Building, 
  LayoutDashboard, 
  Bell, 
  User, 
  LogOut, 
  Menu, 
  X, 
  ShieldAlert, 
  Layers, 
  Calendar, 
  BarChart3, 
  Armchair,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getNotifications, markNotificationRead } from '../../data/storageService';

export default function Navbar() {
  const { user, isAuthenticated, isStaff, isCustomer, logout, demoLogin } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifDrop, setShowNotifDrop] = useState(false);
  const [showUserDrop, setShowUserDrop] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const notifRef = useRef(null);
  const userRef = useRef(null);

  // Load and subscribe to notifications
  const loadNotifs = () => {
    if (isAuthenticated) {
      const list = getNotifications(user.role, user.id);
      setNotifications(list);
    } else {
      setNotifications([]);
    }
  };

  useEffect(() => {
    loadNotifs();
    const handleUpdate = () => loadNotifs();
    window.addEventListener('cinewave_data_updated', handleUpdate);
    return () => window.removeEventListener('cinewave_data_updated', handleUpdate);
  }, [user, isAuthenticated]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifDrop(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setShowUserDrop(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notif) => {
    markNotificationRead(notif.id);
    setShowNotifDrop(false);
    if (isStaff) {
      navigate(`/staff/bookings/${notif.bookingId}`);
    } else {
      navigate(`/customer/booking/${notif.bookingId}`);
    }
  };

  return (
    <header className="main-nav">
      <div className="container nav-container">
        {/* Brand */}
        <Link to="/" className="nav-brand">
          <div className="brand-icon">
            <Film size={20} />
          </div>
          <div>
            <div>Cine<span className="brand-accent">Wave</span></div>
            <span className="brand-tagline">Entertainment</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="nav-links">
          {/* Public & Customer Links */}
          {(!isAuthenticated || isCustomer) && (
            <>
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
                Home
              </NavLink>
              <NavLink to="/movies" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Movies
              </NavLink>
              <NavLink to="/theatres" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Theatres
              </NavLink>
              {isAuthenticated && (
                <>
                  <NavLink to="/customer/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <LayoutDashboard size={16} />
                    Dashboard
                  </NavLink>
                  <NavLink to="/customer/bookings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <Ticket size={16} />
                    My Bookings
                  </NavLink>
                </>
              )}
            </>
          )}

          {/* Staff Navigation Links */}
          {isStaff && (
            <>
              <NavLink to="/staff/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <LayoutDashboard size={16} />
                Dashboard
              </NavLink>
              <NavLink to="/staff/bookings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Ticket size={16} />
                Bookings
              </NavLink>
              <NavLink to="/staff/movies" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Film size={16} />
                Movies
              </NavLink>
              <NavLink to="/staff/theatres" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Building size={16} />
                Theatres
              </NavLink>
              <NavLink to="/staff/shows" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Calendar size={16} />
                Shows
              </NavLink>
              <NavLink to="/staff/seats" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Armchair size={16} />
                Seats
              </NavLink>
              <NavLink to="/staff/reports" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <BarChart3 size={16} />
                Reports
              </NavLink>
            </>
          )}
        </nav>

        {/* Right Actions */}
        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              {/* Notification Bell Dropdown */}
              <div style={{ position: 'relative' }} ref={notifRef}>
                <button 
                  className="nav-btn-icon" 
                  onClick={() => setShowNotifDrop(!showNotifDrop)}
                  aria-label="View notifications"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                  )}
                </button>

                {showNotifDrop && (
                  <div className="dropdown-menu" style={{ width: '320px' }}>
                    <div className="dropdown-header flex-between">
                      <span className="dropdown-user-name" style={{ fontSize: '0.9rem' }}>Notifications</span>
                      <Link 
                        to={isStaff ? "/staff/notifications" : "/customer/notifications"} 
                        style={{ fontSize: '0.75rem', color: 'var(--accent-gold)' }}
                        onClick={() => setShowNotifDrop(false)}
                      >
                        View All
                      </Link>
                    </div>
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {notifications.length === 0 ? (
                        <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          No notifications
                        </div>
                      ) : (
                        notifications.slice(0, 5).map(n => (
                          <div 
                            key={n.id} 
                            onClick={() => handleNotificationClick(n)}
                            style={{
                              padding: '0.75rem',
                              borderBottom: '1px solid rgba(255,255,255,0.05)',
                              cursor: 'pointer',
                              background: n.read ? 'transparent' : 'rgba(245, 158, 11, 0.06)',
                              display: 'flex',
                              gap: '0.6rem',
                              fontSize: '0.82rem'
                            }}
                          >
                            <div style={{ 
                              width: '8px', 
                              height: '8px', 
                              borderRadius: '50%', 
                              background: n.read ? 'transparent' : 'var(--accent-gold)', 
                              marginTop: '6px',
                              flexShrink: 0 
                            }} />
                            <div>
                              <p style={{ color: n.read ? 'var(--text-secondary)' : 'var(--text-light)', lineHeight: 1.4 }}>
                                {n.message}
                              </p>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'block' }}>
                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Dropdown */}
              <div style={{ position: 'relative' }} ref={userRef}>
                <button 
                  className="user-menu-btn" 
                  onClick={() => setShowUserDrop(!showUserDrop)}
                  aria-label="User profile menu"
                >
                  <div className={`user-avatar ${isStaff ? 'staff' : ''}`}>
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name.split(' ')[0]}
                  </span>
                </button>

                {showUserDrop && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <div className="dropdown-user-name">{user.name}</div>
                      <div className="dropdown-user-role">{user.role} Portal</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
                    </div>

                    {isCustomer && (
                      <>
                        <Link 
                          to="/customer/dashboard" 
                          className="dropdown-item" 
                          onClick={() => setShowUserDrop(false)}
                        >
                          <LayoutDashboard size={16} />
                          Dashboard
                        </Link>
                        <Link 
                          to="/customer/bookings" 
                          className="dropdown-item" 
                          onClick={() => setShowUserDrop(false)}
                        >
                          <Ticket size={16} />
                          My Bookings
                        </Link>
                        <Link 
                          to="/customer/profile" 
                          className="dropdown-item" 
                          onClick={() => setShowUserDrop(false)}
                        >
                          <User size={16} />
                          Profile
                        </Link>
                        {/* Demo Switch to Staff */}
                        <button 
                          className="dropdown-item"
                          style={{ color: 'var(--accent-indigo)' }}
                          onClick={() => {
                            setShowUserDrop(false);
                            demoLogin('staff');
                            navigate('/staff/dashboard');
                          }}
                        >
                          <ShieldAlert size={16} />
                          Switch to Staff Portal
                        </button>
                      </>
                    )}

                    {isStaff && (
                      <>
                        <Link 
                          to="/staff/dashboard" 
                          className="dropdown-item" 
                          onClick={() => setShowUserDrop(false)}
                        >
                          <LayoutDashboard size={16} />
                          Staff Dashboard
                        </Link>
                        <Link 
                          to="/staff/profile" 
                          className="dropdown-item" 
                          onClick={() => setShowUserDrop(false)}
                        >
                          <User size={16} />
                          Staff Profile
                        </Link>
                        {/* Demo Switch to Customer */}
                        <button 
                          className="dropdown-item"
                          style={{ color: 'var(--accent-gold)' }}
                          onClick={() => {
                            setShowUserDrop(false);
                            demoLogin('customer');
                            navigate('/customer/dashboard');
                          }}
                        >
                          <Ticket size={16} />
                          Switch to Customer View
                        </button>
                      </>
                    )}

                    <div style={{ borderTop: '1px solid var(--border-glass)', margin: '0.4rem 0' }} />

                    <button 
                      className="dropdown-item danger" 
                      onClick={() => {
                        setShowUserDrop(false);
                        logout();
                        navigate('/');
                      }}
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Unauthenticated state */
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <button 
                onClick={() => {
                  demoLogin('customer');
                  navigate('/customer/dashboard');
                }}
                className="btn btn-primary btn-sm"
              >
                Demo Login
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div style={{
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-glass)',
          padding: '1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <Link to="/" onClick={() => setMobileOpen(false)} style={{ padding: '0.5rem 0' }}>Home</Link>
          <Link to="/movies" onClick={() => setMobileOpen(false)} style={{ padding: '0.5rem 0' }}>Movies</Link>
          <Link to="/theatres" onClick={() => setMobileOpen(false)} style={{ padding: '0.5rem 0' }}>Theatres</Link>
          {isCustomer && (
            <>
              <Link to="/customer/dashboard" onClick={() => setMobileOpen(false)} style={{ padding: '0.5rem 0' }}>Customer Dashboard</Link>
              <Link to="/customer/bookings" onClick={() => setMobileOpen(false)} style={{ padding: '0.5rem 0' }}>My Bookings</Link>
            </>
          )}
          {isStaff && (
            <>
              <Link to="/staff/dashboard" onClick={() => setMobileOpen(false)} style={{ padding: '0.5rem 0' }}>Staff Dashboard</Link>
              <Link to="/staff/bookings" onClick={() => setMobileOpen(false)} style={{ padding: '0.5rem 0' }}>Bookings Management</Link>
              <Link to="/staff/movies" onClick={() => setMobileOpen(false)} style={{ padding: '0.5rem 0' }}>Movies</Link>
              <Link to="/staff/shows" onClick={() => setMobileOpen(false)} style={{ padding: '0.5rem 0' }}>Shows</Link>
              <Link to="/staff/seats" onClick={() => setMobileOpen(false)} style={{ padding: '0.5rem 0' }}>Seat Matrix</Link>
              <Link to="/staff/reports" onClick={() => setMobileOpen(false)} style={{ padding: '0.5rem 0' }}>Reports</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
