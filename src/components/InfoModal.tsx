import React, { useEffect, useState } from 'react';
import { X, ExternalLink, Send, Check } from 'lucide-react';
import type { ModalType } from '../types';

interface InfoModalProps {
  type: ModalType;
  isOpen: boolean;
  onClose: () => void;
  onOpenSubmit: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({
  type,
  isOpen,
  onClose,
  onOpenSubmit,
}) => {
  const [suggestUrl, setSuggestUrl] = useState('');
  const [suggestSubmitted, setSuggestSubmitted] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setSuggestUrl('');
      setSuggestSubmitted(false);
      setContactSubmitted(false);
    }
  }, [isOpen]);

  if (!isOpen || !type || ['submit', 'edit', 'delete'].includes(type)) return null;

  const renderContent = () => {
    switch (type) {
      case 'about':
        return (
          <>
            <div className="modal-header">
              <h3 className="modal-title">About HackList</h3>
              <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <div className="modal-body" style={{ lineHeight: 1.65 }}>
              <p style={{ marginBottom: '16px' }}>
                <strong>HackList</strong> is a dedicated personal directory created for passionate builders, students, and software engineers.
              </p>
              <p style={{ marginBottom: '16px', color: 'var(--text-body)' }}>
                Instead of searching through disparate newsletters, Discord servers, and announcement feeds, HackList lets you track and launch directly into your favorite hackathon communities and coding leagues from one central, minimal dashboard.
              </p>
              <div style={{ backgroundColor: 'var(--bg-surface-soft)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '6px', color: 'var(--text-headline)' }}>Design Standard</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Crafted following the clean, editorial developer-community aesthetic: warm off-white tones, charcoal typography, and deep burgundy accents.
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-primary" onClick={onClose}>
                Got it
              </button>
            </div>
          </>
        );

      case 'resources':
        return (
          <>
            <div className="modal-header">
              <h3 className="modal-title">Builder Resources</h3>
              <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ marginBottom: '18px', color: 'var(--text-muted)' }}>
                Handy guides and toolkits to help you win your next hackathon:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <a
                  href="https://github.com/topics/hackathon-starter"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-surface-soft)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-headline)' }}>
                      Hackathon Starter Templates
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Preconfigured boilerplate repos with Auth, DB, and UI
                    </div>
                  </div>
                  <ExternalLink size={16} color="var(--text-muted)" />
                </a>

                <a
                  href="https://devpost.com/software"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-surface-soft)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-headline)' }}>
                      Winning Project Showcase
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Study real award-winning hackathon submissions and pitch videos
                    </div>
                  </div>
                  <ExternalLink size={16} color="var(--text-muted)" />
                </a>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          </>
        );

      case 'suggest':
        return (
          <>
            <div className="modal-header">
              <h3 className="modal-title">Suggest a Platform</h3>
              <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              {suggestSubmitted ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--burgundy-light)',
                      color: 'var(--burgundy-primary)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '14px',
                    }}
                  >
                    <Check size={24} />
                  </div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Thank you!</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Your suggestion has been noted. You can also add it directly to your personal directory!
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (suggestUrl.trim()) setSuggestSubmitted(true);
                  }}
                >
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-body)', marginBottom: '16px' }}>
                    Know a premier hackathon community, regional contest, or dev challenge we should feature?
                  </p>
                  <div className="form-group">
                    <label className="form-label">Platform URL</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. hackmit.org"
                      value={suggestUrl}
                      onChange={(e) => setSuggestUrl(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                    <Send size={15} />
                    <span>Send Suggestion</span>
                  </button>
                </form>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  onClose();
                  onOpenSubmit();
                }}
              >
                Add Directly to My List
              </button>
            </div>
          </>
        );

      case 'contact':
        return (
          <>
            <div className="modal-header">
              <h3 className="modal-title">Contact & Community</h3>
              <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              {contactSubmitted ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--burgundy-light)',
                      color: 'var(--burgundy-primary)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '14px',
                    }}
                  >
                    <Check size={24} />
                  </div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Message Sent</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Thanks for reaching out! We will get back to you shortly.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setContactSubmitted(true);
                  }}
                >
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-body)', marginBottom: '16px' }}>
                    Have feedback or questions about HackList? Drop us a quick note.
                  </p>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-input" placeholder="you@domain.com" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message</label>
                    <textarea className="form-textarea" placeholder="Your note or feedback..." rows={3} required />
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                    <Send size={15} />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-dialog">{renderContent()}</div>
    </div>
  );
};
