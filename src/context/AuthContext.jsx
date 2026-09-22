// Authentication Context & Provider for CineWave
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getCurrentUser, 
  setCurrentUser, 
  findUserByCredentials, 
  saveUser, 
  getUsers 
} from '../data/storageService';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getCurrentUser());
  const { showToast } = useToast();

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (!e.detail || e.detail.key === 'cinewave_current_user') {
        setUser(getCurrentUser());
      }
    };
    window.addEventListener('cinewave_data_updated', handleStorageChange);
    return () => window.removeEventListener('cinewave_data_updated', handleStorageChange);
  }, []);

  // Standard Login
  const login = (email, password, role) => {
    const matched = findUserByCredentials(email, password, role);
    if (matched) {
      setCurrentUser(matched);
      setUser(matched);
      showToast(`Welcome back, ${matched.name}!`, 'success');
      return { success: true, user: matched };
    }
    showToast('Invalid email, password, or role selection.', 'error');
    return { success: false, error: 'Invalid credentials' };
  };

  // Demo Login Helper for quick mentor presentation
  const demoLogin = (role = 'customer') => {
    const users = getUsers();
    const targetEmail = role === 'staff' ? 'staff@cinewave.com' : 'customer@cinewave.com';
    const demoUser = users.find(u => u.email === targetEmail) || {
      id: role === 'staff' ? 'user-staff-001' : 'user-cust-001',
      name: role === 'staff' ? 'Priya Sharma (Operations Manager)' : 'Arun Kumar',
      email: targetEmail,
      role,
      phone: role === 'staff' ? '+91 91234 56789' : '+91 98765 43210'
    };
    setCurrentUser(demoUser);
    setUser(demoUser);
    showToast(`Logged in as Demo ${role === 'staff' ? 'Staff' : 'Customer'}!`, 'success');
    return demoUser;
  };

  // Registration
  const register = (userData) => {
    const users = getUsers();
    const existing = users.find(u => u.email.toLowerCase() === userData.email.trim().toLowerCase());
    if (existing) {
      showToast('An account with this email already exists.', 'error');
      return { success: false, error: 'Account already exists' };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      role: 'customer',
      ...userData
    };

    saveUser(newUser);
    setCurrentUser(newUser);
    setUser(newUser);
    showToast('Account created successfully! Welcome to CineWave.', 'success');
    return { success: true, user: newUser };
  };

  // Update Profile
  const updateProfile = (updatedData) => {
    if (!user) return;
    const updated = { ...user, ...updatedData };
    saveUser(updated);
    setCurrentUser(updated);
    setUser(updated);
    showToast('Profile updated successfully.', 'success');
  };

  // Logout
  const logout = () => {
    setCurrentUser(null);
    setUser(null);
    showToast('You have been logged out.', 'info');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    role: user?.role || null,
    isStaff: user?.role === 'staff',
    isCustomer: user?.role === 'customer',
    login,
    demoLogin,
    register,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
