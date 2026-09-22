// CineWave Main Application Component
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import HomePage from './pages/public/HomePage';
import MoviesPage from './pages/public/MoviesPage';
import MovieDetailsPage from './pages/public/MovieDetailsPage';
import TheatresPage from './pages/public/TheatresPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import SeatSelectionPage from './pages/customer/SeatSelectionPage';
import BookingDetailsPage from './pages/customer/BookingDetailsPage';
import BookingTrackingPage from './pages/customer/BookingTrackingPage';
import MyBookingsPage from './pages/customer/MyBookingsPage';
import TicketViewPage from './pages/customer/TicketViewPage';
import NotificationsPage from './pages/customer/NotificationsPage';
import CustomerProfilePage from './pages/customer/CustomerProfilePage';

// Staff Pages
import StaffDashboard from './pages/staff/StaffDashboard';
import StaffBookingsPage from './pages/staff/StaffBookingsPage';
import StaffBookingDetailPage from './pages/staff/StaffBookingDetailPage';
import StaffMoviesPage from './pages/staff/StaffMoviesPage';
import StaffTheatresPage from './pages/staff/StaffTheatresPage';
import StaffShowsPage from './pages/staff/StaffShowsPage';
import StaffSeatsPage from './pages/staff/StaffSeatsPage';
import StaffReportsPage from './pages/staff/StaffReportsPage';
import StaffNotificationsPage from './pages/staff/StaffNotificationsPage';
import StaffProfilePage from './pages/staff/StaffProfilePage';

// Layout wrapper to conditionally show footer (e.g. only on public & customer pages)
function AppLayout({ children }) {
  const location = useLocation();
  const isStaffRoute = location.pathname.startsWith('/staff');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ flexGrow: 1 }}>
        {children}
      </div>
      {!isStaffRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BookingProvider>
          <BrowserRouter>
            <AppLayout>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/movies" element={<MoviesPage />} />
                <Route path="/movie/:id" element={<MovieDetailsPage />} />
                <Route path="/theatres" element={<TheatresPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Customer Routes (Protected) */}
                <Route 
                  path="/customer/dashboard" 
                  element={
                    <ProtectedRoute allowedRole="customer">
                      <CustomerDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/customer/seats" 
                  element={
                    <ProtectedRoute allowedRole="customer">
                      <SeatSelectionPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/customer/book" 
                  element={
                    <ProtectedRoute allowedRole="customer">
                      <BookingDetailsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/customer/booking/:id" 
                  element={
                    <ProtectedRoute allowedRole="customer">
                      <BookingTrackingPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/customer/bookings" 
                  element={
                    <ProtectedRoute allowedRole="customer">
                      <MyBookingsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/customer/ticket/:id" 
                  element={
                    <ProtectedRoute allowedRole="customer">
                      <TicketViewPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/customer/notifications" 
                  element={
                    <ProtectedRoute allowedRole="customer">
                      <NotificationsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/customer/profile" 
                  element={
                    <ProtectedRoute allowedRole="customer">
                      <CustomerProfilePage />
                    </ProtectedRoute>
                  } 
                />

                {/* Staff Routes (Protected) */}
                <Route 
                  path="/staff/dashboard" 
                  element={
                    <ProtectedRoute allowedRole="staff">
                      <StaffDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/staff/bookings" 
                  element={
                    <ProtectedRoute allowedRole="staff">
                      <StaffBookingsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/staff/bookings/:id" 
                  element={
                    <ProtectedRoute allowedRole="staff">
                      <StaffBookingDetailPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/staff/movies" 
                  element={
                    <ProtectedRoute allowedRole="staff">
                      <StaffMoviesPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/staff/theatres" 
                  element={
                    <ProtectedRoute allowedRole="staff">
                      <StaffTheatresPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/staff/shows" 
                  element={
                    <ProtectedRoute allowedRole="staff">
                      <StaffShowsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/staff/seats" 
                  element={
                    <ProtectedRoute allowedRole="staff">
                      <StaffSeatsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/staff/reports" 
                  element={
                    <ProtectedRoute allowedRole="staff">
                      <StaffReportsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/staff/notifications" 
                  element={
                    <ProtectedRoute allowedRole="staff">
                      <StaffNotificationsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/staff/profile" 
                  element={
                    <ProtectedRoute allowedRole="staff">
                      <StaffProfilePage />
                    </ProtectedRoute>
                  } 
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppLayout>
          </BrowserRouter>
        </BookingProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
