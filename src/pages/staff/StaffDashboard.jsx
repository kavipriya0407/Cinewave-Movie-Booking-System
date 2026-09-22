// Staff Operations Dashboard
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Ticket, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  IndianRupee, 
  TrendingUp, 
  Film, 
  Building, 
  Armchair, 
  AlertTriangle,
  ArrowRight,
  Eye,
  Send
} from 'lucide-react';
import StaffSidebar from '../../components/staff/StaffSidebar';
import MetricCard from '../../components/staff/MetricCard';
import { BarChart, StatusDistribution } from '../../components/staff/MiniChart';
import StatusBadge from '../../components/common/StatusBadge';
import BookingReviewModal from '../../components/staff/BookingReviewModal';
import { getBookings, getMovies, getTheatres } from '../../data/storageService';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function StaffDashboard() {
  const [bookings, setBookings] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);

  const loadAll = () => {
    setBookings(getBookings());
    setMovies(getMovies());
    setTheatres(getTheatres());
  };

  useEffect(() => {
    loadAll();
    const handleUpdate = () => loadAll();
    window.addEventListener('cinewave_data_updated', handleUpdate);
    return () => window.removeEventListener('cinewave_data_updated', handleUpdate);
  }, []);

  // Compute Statistics
  const totalBookings = bookings.length;
  const pendingRequests = bookings.filter(b => b.status === 'Booking Requested' || b.status === 'Under Review').length;
  const awaitingConfirmation = bookings.filter(b => b.status === 'Awaiting Customer Confirmation').length;
  const confirmedBookings = bookings.filter(b => b.status === 'Customer Confirmed' || b.status === 'Booking Confirmed' || b.status === 'Ticket Issued').length;
  const cancelledBookings = bookings.filter(b => b.status === 'Cancelled' || b.status === 'Rejected').length;

  const totalRevenue = bookings
    .filter(b => b.status !== 'Cancelled' && b.status !== 'Rejected')
    .reduce((acc, curr) => acc + (curr.total || 0), 0);

  // Overall Occupancy Calculation across active bookings
  const totalBookedSeats = bookings
    .filter(b => b.status !== 'Cancelled' && b.status !== 'Rejected')
    .reduce((acc, curr) => acc + (curr.ticketCount || curr.selectedSeats?.length || 0), 0);
  const totalPossibleCapacity = Math.max(1, bookings.length * 48);
  const overallOccupancyPercent = Math.min(100, Math.round((totalBookedSeats / totalPossibleCapacity) * 100));

  // Chart Data: Weekly Bookings Breakdown
  const weeklyBookingsData = [
    { label: 'Mon', value: 12 },
    { label: 'Tue', value: 18 },
    { label: 'Wed', value: 15 },
    { label: 'Thu', value: 24 },
    { label: 'Fri', value: 38 },
    { label: 'Sat', value: 52, highlight: true },
    { label: 'Sun', value: 46 }
  ];

  // Chart Data: Status Distribution
  const statusDistributionData = [
    { label: 'Requested / Review', count: pendingRequests, color: 'var(--accent-gold)' },
    { label: 'Awaiting Confirm', count: awaitingConfirmation, color: 'var(--accent-indigo)' },
    { label: 'Confirmed / Issued', count: confirmedBookings, color: 'var(--accent-emerald)' },
    { label: 'Cancelled / Rejected', count: cancelledBookings, color: 'var(--accent-red)' }
  ];

  // Urgent pending requests queue
  const pendingQueue = bookings.filter(b => 
    b.status === 'Booking Requested' || b.status === 'Under Review' || b.status === 'Awaiting Customer Confirmation'
  );

  return (
    <div className="dashboard-layout animate-fade-in">
      {/* Staff Sidebar */}
      <StaffSidebar />

      {/* Main Content Area */}
      <main className="dashboard-main">
        <div className="section-header">
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              Enterprise Operations Center
            </span>
            <h1 className="section-title">Operations Command Dashboard</h1>
            <p className="section-subtitle">
              Monitor incoming case lifecycles, review bookings, and inspect cinema hall utilization
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/staff/bookings" className="btn btn-secondary btn-sm">
              <Ticket size={16} /> All Cases
            </Link>
            <Link to="/staff/reports" className="btn btn-primary btn-sm">
              <TrendingUp size={16} /> Analytics Reports
            </Link>
          </div>
        </div>

        {/* Analytic Metrics Grid */}
        <div className="metrics-grid">
          <MetricCard
            title="Total Bookings"
            value={totalBookings}
            subtitle="All customer requests"
            icon={Ticket}
            color="indigo"
          />
          <MetricCard
            title="Pending Requests"
            value={pendingRequests}
            subtitle="Requires staff triage"
            icon={Clock}
            color="gold"
          />
          <MetricCard
            title="Awaiting Confirmation"
            value={awaitingConfirmation}
            subtitle="With customer"
            icon={AlertTriangle}
            color="cyan"
          />
          <MetricCard
            title="Confirmed Bookings"
            value={confirmedBookings}
            subtitle="Tickets generated"
            icon={CheckCircle2}
            color="emerald"
          />
          <MetricCard
            title="Cancelled / Rejected"
            value={cancelledBookings}
            subtitle="Seats returned to pool"
            icon={XCircle}
            color="red"
          />
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            subtitle={`Occupancy: ~${overallOccupancyPercent}%`}
            icon={IndianRupee}
            color="emerald"
          />
        </div>

        {/* Charts & Status Distribution Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.75rem', marginBottom: '2.5rem' }}>
          {/* Weekly Bookings Chart */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>Weekly Ticket Sales Trend</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', fontWeight: 600 }}>Live Capacity Trend</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Daily booking volume across all 4 multiplex theatres
            </p>
            <BarChart data={weeklyBookingsData} height={180} />
          </div>

          {/* Status Distribution Breakdown */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>Case Lifecycle Distribution</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Pega Stages</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Active state proportion of all customer reservations
            </p>
            <StatusDistribution data={statusDistributionData} />
          </div>
        </div>

        {/* Priority Pending Case Requests Queue */}
        <div className="section-header" style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.35rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Clock size={20} className="text-gold" />
            Pending Action Queue ({pendingQueue.length})
          </h2>
          <Link to="/staff/bookings" style={{ fontSize: '0.88rem', color: 'var(--accent-gold)' }}>
            Manage Full Table &rarr;
          </Link>
        </div>

        {pendingQueue.length > 0 ? (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Movie</th>
                  <th>Theatre</th>
                  <th>Show Time</th>
                  <th>Seats</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Staff Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingQueue.slice(0, 6).map(b => (
                  <tr key={b.id}>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-gold)' }}>
                        {b.id}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{b.customerName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.customerPhone}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-light)' }}>{b.movieTitle}</div>
                    </td>
                    <td>
                      <div>{b.theatreName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.screen}</div>
                    </td>
                    <td>
                      <div>{formatDate(b.bookingDate)}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--accent-gold)' }}>{b.showTime}</div>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#fff' }}>
                        {(b.selectedSeats || []).join(', ')}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>
                        {formatCurrency(b.total)}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={b.status} size="sm" />
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button 
                          onClick={() => setSelectedBookingForReview(b)} 
                          className="btn btn-primary btn-sm"
                        >
                          <Eye size={14} /> Review & Action
                        </button>
                        <Link 
                          to={`/staff/bookings/${b.id}`} 
                          className="btn btn-secondary btn-sm"
                        >
                          Details
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <CheckCircle2 size={36} className="text-emerald" style={{ margin: '0 auto 0.75rem' }} />
            <h4 style={{ color: '#fff', fontSize: '1.1rem' }}>Zero Pending Requests!</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              All customer booking requests have been reviewed and processed.
            </p>
          </div>
        )}
      </main>

      {/* Review Modal */}
      {selectedBookingForReview && (
        <BookingReviewModal
          booking={selectedBookingForReview}
          isOpen={!!selectedBookingForReview}
          onClose={() => setSelectedBookingForReview(null)}
          onUpdated={(updated) => {
            loadAll();
            setSelectedBookingForReview(null);
          }}
        />
      )}
    </div>
  );
}
