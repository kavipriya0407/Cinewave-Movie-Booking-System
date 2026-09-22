// CSV Export Utility for CineWave Staff Reports

export function exportBookingsToCSV(bookings, filename = 'cinewave_bookings_report.csv') {
  if (!bookings || bookings.length === 0) {
    alert('No bookings available to export.');
    return;
  }

  const headers = [
    'Booking ID',
    'Customer Name',
    'Customer Email',
    'Customer Phone',
    'Movie',
    'Theatre',
    'Location',
    'Date',
    'Show Time',
    'Screen',
    'Seats',
    'Ticket Count',
    'Subtotal (INR)',
    'Convenience Fee (INR)',
    'Total Amount (INR)',
    'Status',
    'Booking Created Date'
  ];

  const rows = bookings.map(b => [
    `"${b.id || ''}"`,
    `"${b.customerName || ''}"`,
    `"${b.customerEmail || ''}"`,
    `"${b.customerPhone || ''}"`,
    `"${b.movieTitle || ''}"`,
    `"${b.theatreName || ''}"`,
    `"${b.theatreLocation || ''}"`,
    `"${b.bookingDate || ''}"`,
    `"${b.showTime || ''}"`,
    `"${b.screen || ''}"`,
    `"${(b.selectedSeats || []).join(', ')}"`,
    b.ticketCount || (b.selectedSeats ? b.selectedSeats.length : 0),
    b.subtotal || 0,
    b.fee || 0,
    b.total || 0,
    `"${b.status || ''}"`,
    `"${b.createdAt ? new Date(b.createdAt).toLocaleString('en-IN') : ''}"`
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
