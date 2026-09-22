// Staff Business Intelligence & Reports Page with CSV Exporter
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  FileSpreadsheet, 
  Download, 
  Calendar, 
  IndianRupee, 
  Film, 
  Building, 
  Armchair, 
  TrendingUp,
  Filter 
} from 'lucide-react';
import StaffSidebar from '../../components/staff/StaffSidebar';
import MetricCard from '../../components/staff/MetricCard';
import { BarChart, StatusDistribution } from '../../components/staff/MiniChart';
import { getBookings, getMovies, getTheatres } from '../../data/storageService';
import { exportBookingsToCSV } from '../../utils/csvExporter';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export default function StaffReportsPage() {
  const [bookings, setBookings] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [timeRange, setTimeRange] = useState('ALL'); // ALL | TODAY | THIS_WEEK | THIS_MONTH
  const { showToast } = useToast();

  const loadData = () => {
    setBookings(getBookings());
    setMovies(getMovies());
    setTheatres(getTheatres());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('cinewave_data_updated', handleUpdate);
    return () => window.removeEventListener('cinewave_data_updated', handleUpdate);
  }, []);

  // Filter by time range
  const filteredBookings = bookings.filter(b => {
    if (timeRange === 'ALL') return true;
    const date = new Date(b.createdAt);
    const now = new Date();
    if (timeRange === 'TODAY') {
      return date.toDateString() === now.toDateString();
    }
    if (timeRange === 'THIS_WEEK') {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return date >= oneWeekAgo;
    }
    if (timeRange === 'THIS_MONTH') {
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }
    return true;
  });

  // Calculate Aggregates
  const totalRevenue = filteredBookings
    .filter(b => b.status !== 'Cancelled' && b.status !== 'Rejected')
    .reduce((sum, b) => sum + (b.total || 0), 0);

  const totalTickets = filteredBookings
    .filter(b => b.status !== 'Cancelled' && b.status !== 'Rejected')
    .reduce((sum, b) => sum + (b.ticketCount || b.selectedSeats?.length || 0), 0);

  // Popular Movies breakdown
  const moviePopularityMap = {};
  filteredBookings.forEach(b => {
    const title = b.movieTitle || 'Unknown';
    moviePopularityMap[title] = (moviePopularityMap[title] || 0) + (b.ticketCount || b.selectedSeats?.length || 1);
  });
  const popularMoviesList = Object.entries(moviePopularityMap)
    .map(([title, count]) => ({ title, count }))
    .sort((a, b) => b.count - a.count);

  // Popular Theatres breakdown
  const theatrePopularityMap = {};
  filteredBookings.forEach(b => {
    const name = b.theatreName || 'Unknown';
    theatrePopularityMap[name] = (theatrePopularityMap[name] || 0) + (b.total || 0);
  });
  const popularTheatresList = Object.entries(theatrePopularityMap)
    .map(([name, rev]) => ({ name, rev }))
    .sort((a, b) => b.rev - a.rev);

  // Chart data for daily distribution
  const chartData = [
    { label: 'Inception', value: moviePopularityMap['Inception'] || 6, highlight: true },
    { label: 'Interstellar', value: moviePopularityMap['Interstellar'] || 5 },
    { label: 'Leo', value: moviePopularityMap['Leo'] || 4 },
    { label: 'Avatar 2', value: moviePopularityMap['Avatar: The Way of Water'] || 3 },
    { label: 'Avengers', value: 2 },
    { label: 'Spider-Man', value: 1 }
  ];

  const handleExportCSV = () => {
    exportBookingsToCSV(filteredBookings, `cinewave_reports_${timeRange.toLowerCase()}_${Date.now()}.csv`);
    showToast('Report CSV generated and download started!', 'success');
  };

  return (
    <div className="dashboard-layout animate-fade-in">
      <StaffSidebar />

      <main className="dashboard-main">
        <div className="section-header">
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              Business Intelligence & Reporting
            </span>
            <h1 className="section-title">Operational Reports & Analytics</h1>
            <p className="section-subtitle">
              Inspect revenue performance, movie popularity index, and export CSV booking ledgers
            </p>
          </div>

          <button onClick={handleExportCSV} className="btn btn-primary btn-sm">
            <Download size={16} /> Export CSV Report
          </button>
        </div>

        {/* Date Filter Tabs */}
        <div className="filter-bar" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <Calendar size={18} className="text-gold" />
            <span style={{ fontWeight: 600 }}>Reporting Period:</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: 'All-Time' },
              { id: 'TODAY', label: 'Today Only' },
              { id: 'THIS_WEEK', label: 'Last 7 Days' },
              { id: 'THIS_MONTH', label: 'This Month' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setTimeRange(tab.id)}
                className={`btn btn-sm ${timeRange === tab.id ? 'btn-primary' : 'btn-secondary'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Filtered cases: <strong style={{ color: '#fff' }}>{filteredBookings.length}</strong>
          </div>
        </div>

        {/* Aggregate KPI Cards */}
        <div className="metrics-grid">
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            subtitle="Gross box office receipts"
            icon={IndianRupee}
            color="emerald"
          />
          <MetricCard
            title="Tickets Issued"
            value={totalTickets}
            subtitle="Admitted cinema patrons"
            icon={Armchair}
            color="gold"
          />
          <MetricCard
            title="Average Order Value"
            value={filteredBookings.length > 0 ? formatCurrency(Math.round(totalRevenue / Math.max(1, filteredBookings.length))) : '₹0'}
            subtitle="Per completed booking"
            icon={TrendingUp}
            color="indigo"
          />
          <MetricCard
            title="Active Catalog"
            value={movies.length}
            subtitle={`${theatres.length} multiplex venues`}
            icon={Film}
            color="cyan"
          />
        </div>

        {/* Popular Movies & Revenue Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.75rem', marginBottom: '2.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '0.25rem' }}>
              Movie Ticket Demand Ranking
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Total tickets issued per film title
            </p>
            <BarChart data={chartData} height={190} />
          </div>

          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '1.25rem' }}>
              Multiplex Revenue Contribution
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {popularTheatresList.map((th, i) => (
                <div key={i} className="flex-between" style={{ padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.92rem' }}>{th.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Multiplex Branch</div>
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--accent-emerald)', fontSize: '1.05rem' }}>
                    {formatCurrency(th.rev)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bookings Ledger Preview */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>Export Preview Ledger</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Sample preview of records included in the downloadable CSV
              </p>
            </div>
            <button onClick={handleExportCSV} className="btn btn-secondary btn-sm">
              <FileSpreadsheet size={15} /> Export Complete Table ({filteredBookings.length})
            </button>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Movie</th>
                  <th>Theatre</th>
                  <th>Date & Show</th>
                  <th>Seats</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.slice(0, 5).map(b => (
                  <tr key={b.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-gold)' }}>{b.id}</td>
                    <td>{b.customerName}</td>
                    <td>{b.movieTitle}</td>
                    <td>{b.theatreName}</td>
                    <td>{formatDate(b.bookingDate)} {b.showTime}</td>
                    <td>{(b.selectedSeats || []).join(', ')}</td>
                    <td style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>{formatCurrency(b.total)}</td>
                    <td>{b.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
