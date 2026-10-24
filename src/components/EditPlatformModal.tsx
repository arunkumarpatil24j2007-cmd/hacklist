import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import type { Platform } from '../types';

interface EditPlatformModalProps {
  platform: Platform | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Pick<Platform, 'name' | 'description'>>) => void;
}

export const EditPlatformModal: React.FC<EditPlatformModalProps> = ({
  platform,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (platform) {
      setName(platform.name);
      setDescription(platform.description);
    }
  }, [platform]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !platform) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave(platform.id, {
      name: name.trim(),
      description: description.trim(),
    });
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-modal-title"
    >
      <div className="modal-dialog">
        <div className="modal-header">
          <h3 id="edit-modal-title" className="modal-title">
            Edit Platform
          </h3>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="edit-name" className="form-label">
                Platform Name
              </label>
              <input
                id="edit-name"
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-desc" className="form-label">
                Description
              </label>
              <textarea
                id="edit-desc"
                className="form-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="form-group">
              <label className="form-label">URL & Domain</label>
              <p className="card-domain" style={{ fontSize: '0.85rem' }}>
                {platform.url} ({platform.domain})
              </p>
            </div>
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
              type="submit"
              className="btn-primary"
            >
              <Check size={16} strokeWidth={2.2} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
