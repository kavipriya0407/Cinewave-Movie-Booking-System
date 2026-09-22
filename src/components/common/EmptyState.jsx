// Empty State Card Component
import React from 'react';
import { Film } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({ 
  icon: Icon = Film, 
  title = 'No records found', 
  description = 'There are currently no items to display.', 
  actionText, 
  actionLink, 
  onAction 
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 2rem',
      background: 'var(--bg-card)',
      border: '1px dashed var(--border-glass)',
      borderRadius: 'var(--radius-xl)',
      textAlign: 'center',
      margin: '1.5rem 0'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: 'var(--radius-full)',
        background: 'rgba(255, 255, 255, 0.04)',
        border: '1px solid var(--border-glass)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--accent-gold)',
        marginBottom: '1.25rem'
      }}>
        <Icon size={32} />
      </div>
      <h3 style={{ fontSize: '1.25rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '420px', marginBottom: '1.75rem' }}>
        {description}
      </p>
      {actionText && actionLink && (
        <Link to={actionLink} className="btn btn-primary btn-sm">
          {actionText}
        </Link>
      )}
      {actionText && onAction && (
        <button onClick={onAction} className="btn btn-primary btn-sm">
          {actionText}
        </button>
      )}
    </div>
  );
}
