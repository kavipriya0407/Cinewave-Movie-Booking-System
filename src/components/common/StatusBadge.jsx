// Reusable Status Badge Component for the 8 Case Lifecycle States
import React from 'react';
import { getStatusDetails } from '../../utils/formatters';
import { 
  Clock, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Ticket, 
  XCircle, 
  Ban 
} from 'lucide-react';

export default function StatusBadge({ status, showIcon = true, size = 'md' }) {
  const details = getStatusDetails(status);

  let Icon = Clock;
  if (status === 'Under Review') Icon = Search;
  if (status === 'Awaiting Customer Confirmation') Icon = AlertTriangle;
  if (status === 'Customer Confirmed') Icon = CheckCircle2;
  if (status === 'Booking Confirmed') Icon = CheckCircle2;
  if (status === 'Ticket Issued') Icon = Ticket;
  if (status === 'Rejected') Icon = XCircle;
  if (status === 'Cancelled') Icon = Ban;

  const style = {
    backgroundColor: details.bgColor,
    border: `1px solid ${details.borderColor}`,
    color: details.textColor,
    padding: size === 'sm' ? '0.2rem 0.55rem' : size === 'lg' ? '0.45rem 1rem' : '0.3rem 0.75rem',
    fontSize: size === 'sm' ? '0.75rem' : size === 'lg' ? '0.88rem' : '0.8rem',
    borderRadius: '9999px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontWeight: 600,
    letterSpacing: '0.02em',
    whiteSpace: 'nowrap'
  };

  return (
    <span style={style} className={`status-badge-root ${details.className}`}>
      {showIcon && <Icon size={size === 'sm' ? 12 : size === 'lg' ? 16 : 14} />}
      {details.label}
    </span>
  );
}
