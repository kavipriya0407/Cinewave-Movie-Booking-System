// CineWave Authentication & Login Page
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Film, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  UserCheck, 
  ArrowRight,
  Sparkles 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer'); // customer | staff
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const { login, demoLogin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || (role === 'staff' ? '/staff/dashboard' : '/customer/dashboard');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      showToast('Please enter both email and password.', 'error');
      return;
    }

    const result = login(email, password, role);
    if (result.success) {
      if (result.user.role === 'staff') {
        navigate('/staff/dashboard');
      } else {
        navigate(redirectPath || '/customer/dashboard');
      }
    }
  };

  const handleQuickDemo = (demoRole) => {
    const user = demoLogin(demoRole);
    if (demoRole === 'staff') {
      navigate('/staff/dashboard');
    } else {
      navigate(location.state?.from?.pathname || '/customer/dashboard');
    }
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem',
      background: 'radial-gradient(circle at 50% 20%, rgba(245, 158, 11, 0.08) 0%, transparent 60%)'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        maxWidth: '480px',
        padding: '2.5rem',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid rgba(245, 158, 11, 0.25)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-red))',
            color: '#fff',
            marginBottom: '0.75rem',
            boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)'
          }}>
            <Film size={26} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
            Cine<span className="brand-accent">Wave</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            “Your Movie. Your Seat. Your Experience.”
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: 'rgba(10, 15, 26, 0.8)',
          padding: '0.3rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.75rem',
          border: '1px solid var(--border-glass)'
        }}>
          <button
            type="button"
            onClick={() => setRole('customer')}
            style={{
              padding: '0.6rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              background: role === 'customer' ? 'linear-gradient(135deg, var(--accent-gold), #d97706)' : 'transparent',
              color: role === 'customer' ? '#000' : 'var(--text-secondary)'
            }}
          >
            <UserCheck size={16} /> Customer
          </button>
          <button
            type="button"
            onClick={() => setRole('staff')}
            style={{
              padding: '0.6rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              background: role === 'staff' ? 'linear-gradient(135deg, var(--accent-indigo), #4338ca)' : 'transparent',
              color: role === 'staff' ? '#fff' : 'var(--text-secondary)'
            }}
          >
            <ShieldCheck size={16} /> Staff / Admin
          </button>
        </div>

        {/* 1-Click Quick Demo Switcher Buttons for Mentor Reviews */}
        <div style={{
          background: 'rgba(245, 158, 11, 0.06)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          borderRadius: 'var(--radius-md)',
          padding: '0.9rem',
          marginBottom: '1.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Sparkles size={13} /> 1-Click Demo Accounts (Instant Test)
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleQuickDemo('customer')}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, fontSize: '0.78rem', padding: '0.4rem 0.5rem' }}
            >
              Demo Customer
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('staff')}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, fontSize: '0.78rem', padding: '0.4rem 0.5rem', borderColor: 'var(--accent-indigo)', color: '#a5b4fc' }}
            >
              Demo Staff
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <Mail size={15} /> Email Address
            </label>
            <input
              type="email"
              className="form-input"
              placeholder={role === 'staff' ? 'staff@cinewave.com' : 'customer@cinewave.com'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <div className="flex-between">
              <label className="form-label">
                <Lock size={15} /> Password
              </label>
              <a 
                href="#forgot" 
                onClick={(e) => { e.preventDefault(); showToast('Demo password: "customer123" or "staff123"', 'info'); }}
                style={{ fontSize: '0.78rem', color: 'var(--accent-gold)' }}
              >
                Forgot password?
              </a>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder={role === 'staff' ? 'staff123' : 'customer123'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex-between" style={{ marginBottom: '1.5rem', fontSize: '0.85rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: 'var(--accent-gold)' }}
              />
              Remember me
            </label>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '0.85rem' }}
          >
            Sign In as {role === 'staff' ? 'Staff' : 'Customer'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
