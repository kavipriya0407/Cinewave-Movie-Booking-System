// Formatting Utilities for CineWave

export function formatCurrency(amount) {
  if (isNaN(amount)) return '₹0';
  return `₹${Number(amount).toLocaleString('en-IN')}`;
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function formatDateTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export const BOOKING_STAGES = [
  { id: 'Booking Requested', step: 1, label: 'Booking Requested' },
  { id: 'Under Review', step: 2, label: 'Staff Review' },
  { id: 'Awaiting Customer Confirmation', step: 3, label: 'Awaiting Confirmation' },
  { id: 'Customer Confirmed', step: 4, label: 'Customer Confirmed' },
  { id: 'Booking Confirmed', step: 5, label: 'Booking Confirmed' },
  { id: 'Ticket Issued', step: 6, label: 'Ticket Issued' }
];

export function getStatusDetails(status) {
  switch (status) {
    case 'Booking Requested':
      return {
        label: 'Booking Requested',
        className: 'status-requested',
        bgColor: 'var(--status-requested-bg)',
        borderColor: 'var(--status-requested-border)',
        textColor: 'var(--status-requested-text)',
        step: 1
      };
    case 'Under Review':
      return {
        label: 'Under Review',
        className: 'status-review',
        bgColor: 'var(--status-review-bg)',
        borderColor: 'var(--status-review-border)',
        textColor: 'var(--status-review-text)',
        step: 2
      };
    case 'Awaiting Customer Confirmation':
      return {
        label: 'Awaiting Confirmation',
        className: 'status-awaiting',
        bgColor: 'var(--status-awaiting-bg)',
        borderColor: 'var(--status-awaiting-border)',
        textColor: 'var(--status-awaiting-text)',
        step: 3
      };
    case 'Customer Confirmed':
      return {
        label: 'Customer Confirmed',
        className: 'status-cust-confirmed',
        bgColor: 'var(--status-cust-confirmed-bg)',
        borderColor: 'var(--status-cust-confirmed-border)',
        textColor: 'var(--status-cust-confirmed-text)',
        step: 4
      };
    case 'Booking Confirmed':
      return {
        label: 'Booking Confirmed',
        className: 'status-confirmed',
        bgColor: 'var(--status-confirmed-bg)',
        borderColor: 'var(--status-confirmed-border)',
        textColor: 'var(--status-confirmed-text)',
        step: 5
      };
    case 'Ticket Issued':
      return {
        label: 'Ticket Issued',
        className: 'status-ticket',
        bgColor: 'var(--status-ticket-bg)',
        borderColor: 'var(--status-ticket-border)',
        textColor: 'var(--status-ticket-text)',
        step: 6
      };
    case 'Rejected':
      return {
        label: 'Rejected',
        className: 'status-rejected',
        bgColor: 'var(--status-rejected-bg)',
        borderColor: 'var(--status-rejected-border)',
        textColor: 'var(--status-rejected-text)',
        step: -1
      };
    case 'Cancelled':
      return {
        label: 'Cancelled',
        className: 'status-cancelled',
        bgColor: 'var(--status-cancelled-bg)',
        borderColor: 'var(--status-cancelled-border)',
        textColor: 'var(--status-cancelled-text)',
        step: -2
      };
    default:
      return {
        label: status || 'Unknown',
        className: 'status-unknown',
        bgColor: 'rgba(255,255,255,0.1)',
        borderColor: 'rgba(255,255,255,0.2)',
        textColor: 'var(--text-secondary)',
        step: 0
      };
  }
}
