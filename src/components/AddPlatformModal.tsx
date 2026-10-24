import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import {
  normalizeUrl,
  deriveBrandNameFromDomain,
  deriveDescriptionFromDomain,
  getLogoUrlForDomain,
} from '../utils/platformMetadata';
import type { Platform } from '../types';

interface AddPlatformModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlatform: (platform: Omit<Platform, 'id' | 'createdAt'>) => { success: boolean; error?: string };
}

export const AddPlatformModal: React.FC<AddPlatformModalProps> = ({
  isOpen,
  onClose,
  onAddPlatform,
}) => {
  const [url, setUrl] = useState('');
  const [customName, setCustomName] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Auto-derived preview states
  const [previewDomain, setPreviewDomain] = useState('');
  const [previewName, setPreviewName] = useState('');
  const [previewLogo, setPreviewLogo] = useState('');
  const [imgFailed, setImgFailed] = useState(false);

  // Update preview whenever URL changes
  useEffect(() => {
    setError(null);
    setImgFailed(false);
    if (!url.trim()) {
      setPreviewDomain('');
      setPreviewName('');
      setPreviewLogo('');
      return;
    }

    const { valid, domain } = normalizeUrl(url);
    if (valid && domain) {
      setPreviewDomain(domain);
      const name = customName.trim() || deriveBrandNameFromDomain(domain);
      setPreviewName(name);
      setPreviewLogo(getLogoUrlForDomain(domain));
    } else {
      setPreviewDomain('');
      setPreviewName('');
      setPreviewLogo('');
    }
  }, [url, customName]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { valid, normalizedUrl, domain, error: urlError } = normalizeUrl(url);
    if (!valid || !domain) {
      setError(urlError || 'Please enter a valid website URL.');
      return;
    }

    const finalName = customName.trim() || deriveBrandNameFromDomain(domain);
    const finalDesc = customDesc.trim() || deriveDescriptionFromDomain(domain, finalName);
    const logoUrl = getLogoUrlForDomain(domain);

    const result = onAddPlatform({
      url: normalizedUrl,
      domain,
      name: finalName,
      description: finalDesc,
      logoUrl,
    });

    if (!result.success) {
      setError(result.error || 'Failed to add platform.');
      return;
    }

    // Reset and close
    setUrl('');
    setCustomName('');
    setCustomDesc('');
    setError(null);
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
      aria-labelledby="add-modal-title"
    >
      <div className="modal-dialog">
        <div className="modal-header">
          <h3 id="add-modal-title" className="modal-title">
            Add Platform
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
            {/* Platform URL (Required) */}
            <div className="form-group">
              <label htmlFor="platform-url" className="form-label">
                Platform URL <span style={{ color: 'var(--burgundy-primary)' }}>*</span>
              </label>
              <input
                id="platform-url"
                type="text"
                className="form-input"
                placeholder="e.g. devpost.com, mlh.io, github.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                autoFocus
                required
              />
              <p className="form-hint">
                Enter any hackathon site or developer portal. Brand name and official logo are discovered automatically.
              </p>
              {error && <p className="form-error">{error}</p>}
            </div>

            {/* Live Detected Preview */}
            {previewDomain && (
              <div className="modal-preview-box">
                <div className="preview-logo-box">
                  {!imgFailed && previewLogo ? (
                    <img
                      src={previewLogo}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      onError={() => setImgFailed(true)}
                    />
                  ) : (
                    <span style={{ fontWeight: 700, color: 'var(--burgundy-primary)' }}>
                      {previewName.charAt(0).toUpperCase() || 'P'}
                    </span>
                  )}
                </div>
                <div className="preview-info">
                  <div className="preview-title">{previewName || 'Discovered Platform'}</div>
                  <div className="preview-domain">{previewDomain}</div>
                </div>
              </div>
            )}

            {/* Optional Custom Display Name */}
            <div className="form-group">
              <label htmlFor="custom-name" className="form-label">
                Custom Name <span className="form-label-optional">(optional)</span>
              </label>
              <input
                id="custom-name"
                type="text"
                className="form-input"
                placeholder="Leave blank to use detected name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
              />
            </div>

            {/* Optional Short Description */}
            <div className="form-group">
              <label htmlFor="custom-desc" className="form-label">
                Description <span className="form-label-optional">(optional)</span>
              </label>
              <textarea
                id="custom-desc"
                className="form-textarea"
                placeholder="Brief description of the platform or hackathon focus..."
                value={customDesc}
                onChange={(e) => setCustomDesc(e.target.value)}
                rows={2}
              />
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
              <Plus size={16} strokeWidth={2.2} />
              <span>Add Platform</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
