import React, { useEffect } from 'react';
import { X, Trash2, AlertCircle } from 'lucide-react';
import type { Platform } from '../types';

interface DeleteConfirmModalProps {
  platform: Platform | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  platform,
  isOpen,
  onClose,
  onConfirm,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !platform) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-desc"
    >
      <div className="modal-dialog" style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={20} color="#B91C1C" />
            <h3 id="delete-dialog-title" className="modal-title" style={{ fontSize: '1.15rem' }}>
              Remove Platform
            </h3>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p id="delete-dialog-desc" style={{ color: 'var(--text-body)', fontSize: '0.95rem' }}>
            Are you sure you want to remove <strong>{platform.name}</strong> from your HackList? This action cannot be undone.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary"
            style={{ backgroundColor: '#B91C1C', borderColor: '#B91C1C' }}
            onClick={() => {
              onConfirm(platform.id);
              onClose();
            }}
          >
            <Trash2 size={15} />
            <span>Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
};
