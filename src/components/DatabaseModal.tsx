import React, { useEffect } from 'react';
import { X, Database, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { isCloudDatabaseActive } from '../services/platformsService';

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({ isOpen, onClose }) => {
  const isCloud = isCloudDatabaseActive();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="db-modal-title"
    >
      <div className="modal-dialog" style={{ maxWidth: '560px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Database size={20} color="var(--burgundy-primary)" />
            <h3 id="db-modal-title" className="modal-title">
              Database & Storage Status
            </h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ lineHeight: 1.6 }}>
          {/* Current Status Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: isCloud ? '1px solid #BBF7D0' : '1px solid var(--border-card)',
              backgroundColor: isCloud ? '#F0FDF4' : 'var(--bg-surface-soft)',
              marginBottom: '20px',
            }}
          >
            {isCloud ? (
              <CheckCircle2 size={22} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
            ) : (
              <AlertCircle size={22} color="var(--burgundy-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            )}
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-headline)' }}>
                {isCloud ? 'Live Cloud Firestore Connected' : 'Local Storage Mode Active'}
              </div>
              <p style={{ fontSize: '0.85rem', color: isCloud ? '#15803D' : 'var(--text-muted)' }}>
                {isCloud
                  ? 'All platforms are synchronized in real-time across all users visiting HackList.'
                  : 'Currently platforms are stored locally. To share platforms with all public users across devices, plug in your Firebase keys.'}
              </p>
            </div>
          </div>

          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-headline)' }}>
            How Public Storage Works for Users:
          </h4>
          <ol style={{ paddingLeft: '20px', fontSize: '0.875rem', color: 'var(--text-body)', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            <li>
              <strong>Centralized Collection:</strong> All added platforms are saved to the <code>platforms</code> collection in Cloud Firestore.
            </li>
            <li>
              <strong>Real-Time Sync:</strong> As soon as any user adds or edits a platform, all open browsers receive the update instantly via real-time WebSocket listeners.
            </li>
            <li>
              <strong>Zero-Ops Deployment:</strong> Safe to deploy on Vercel, Netlify, GitHub Pages, or Firebase Hosting with zero server maintenance.
            </li>
          </ol>

          {/* Quick Setup Instructions */}
          {!isCloud && (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
                fontSize: '0.825rem',
              }}
            >
              <div style={{ fontWeight: 600, color: 'var(--text-headline)', marginBottom: '4px' }}>
                Quick 1-Minute Setup:
              </div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>
                1. Go to <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--burgundy-primary)', fontWeight: 600 }}>Firebase Console <ExternalLink size={12} style={{ display: 'inline' }} /></a> & create a free project.<br />
                2. Click &ldquo;Add Web App&rdquo; and enable &ldquo;Firestore Database&rdquo;.<br />
                3. Paste the configuration in your <code>.env</code> file (or your hosting provider&apos;s environment variables).
              </p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-primary" onClick={onClose}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
