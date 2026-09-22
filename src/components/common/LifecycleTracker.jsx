// Pega-style Case Management Lifecycle Tracker Component
import React from 'react';
import { 
  FileText, 
  Search, 
  BellRing, 
  CheckCheck, 
  CheckCircle2, 
  Ticket, 
  AlertCircle,
  Clock,
  UserCheck
} from 'lucide-react';
import { BOOKING_STAGES, formatDateTime, getStatusDetails } from '../../utils/formatters';

export default function LifecycleTracker({ booking }) {
  if (!booking) return null;

  const currentStatus = booking.status;
  const isRejected = currentStatus === 'Rejected';
  const isCancelled = currentStatus === 'Cancelled';
  const statusDetails = getStatusDetails(currentStatus);
  const currentStep = statusDetails.step;

  const getStepIcon = (index) => {
    switch(index) {
      case 0: return FileText;
      case 1: return Search;
      case 2: return BellRing;
      case 3: return UserCheck;
      case 4: return CheckCircle2;
      case 5: return Ticket;
      default: return Clock;
    }
  };

  return (
    <div className="lifecycle-tracker">
      <div className="lifecycle-header">
        <div>
          <span style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
            Case Lifecycle Workflow
          </span>
          <h3 style={{ fontSize: '1.25rem', marginTop: '0.2rem' }}>
            Case ID: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-light)' }}>{booking.id}</span>
          </h3>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Current Status</span>
          <div style={{ marginTop: '0.2rem' }}>
            <span style={{ 
              backgroundColor: statusDetails.bgColor, 
              border: `1px solid ${statusDetails.borderColor}`, 
              color: statusDetails.textColor,
              padding: '0.3rem 0.8rem',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '0.85rem'
            }}>
              {currentStatus}
            </span>
          </div>
        </div>
      </div>

      {/* 6-Stage Progress Tracker */}
      <div className="lifecycle-steps-wrapper">
        {BOOKING_STAGES.map((stage, idx) => {
          const Icon = getStepIcon(idx);
          const isCompleted = !isRejected && !isCancelled && currentStep > stage.step;
          const isActive = !isRejected && !isCancelled && currentStep === stage.step;

          let stepClass = 'step-item';
          if (isCompleted) stepClass += ' completed';
          if (isActive) stepClass += ' active';

          return (
            <div key={stage.id} className={stepClass}>
              <div className="step-icon-circle">
                {isCompleted ? <CheckCheck size={20} /> : <Icon size={18} />}
              </div>
              <span className="step-label">{stage.label}</span>
              <span className="step-time">Stage {stage.step}</span>
            </div>
          );
        })}
      </div>

      {/* Exception banner if Rejected or Cancelled */}
      {(isRejected || isCancelled) && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem 1.25rem',
          background: isRejected ? 'rgba(239, 68, 68, 0.15)' : 'rgba(100, 116, 139, 0.15)',
          border: `1px solid ${isRejected ? 'var(--accent-red)' : 'var(--text-muted)'}`,
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem'
        }}>
          <AlertCircle size={20} className={isRejected ? 'text-red' : 'text-muted'} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h5 style={{ color: '#fff', fontSize: '0.92rem', marginBottom: '0.2rem' }}>
              {isRejected ? 'Booking Request Rejected by Operations' : 'Booking Cancelled'}
            </h5>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {booking.rejectionReason || 'The requested seats have been released back to general pool.'}
            </p>
          </div>
        </div>
      )}

      {/* Case Timeline / Audit Trail Log */}
      {booking.timeline && booking.timeline.length > 0 && (
        <div className="audit-trail-container">
          <h4 style={{ fontSize: '0.95rem', color: 'var(--text-light)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={16} className="text-gold" />
            Pega Case Audit Trail & History
          </h4>
          <ul className="timeline-list">
            {booking.timeline.map((entry, i) => (
              <li key={i} className="timeline-entry">
                <span className="timeline-dot" />
                <div className="timeline-content">
                  <div className="timeline-header">
                    <span className="timeline-title">{entry.title}</span>
                    <span className="timeline-date">{formatDateTime(entry.timestamp)}</span>
                  </div>
                  <p className="timeline-desc">{entry.description}</p>
                  <span className="timeline-actor">Actor: {entry.actor}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
