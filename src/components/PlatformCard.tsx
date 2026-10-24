import React, { useState } from 'react';
import { ArrowUpRight, Pencil, Trash2 } from 'lucide-react';
import type { Platform } from '../types';
import { getLogoUrlForDomain, getSecondaryLogoUrl } from '../utils/platformMetadata';

interface PlatformCardProps {
  platform: Platform;
  onEdit: (platform: Platform) => void;
  onDelete: (platform: Platform) => void;
}

export const PlatformCard: React.FC<PlatformCardProps> = ({
  platform,
  onEdit,
  onDelete,
}) => {
  const [logoState, setLogoState] = useState<'primary' | 'secondary' | 'monogram'>('primary');

  const initial = platform.name.trim().charAt(0).toUpperCase() || 'P';
  const primaryUrl = platform.logoUrl || getLogoUrlForDomain(platform.domain);
  const secondaryUrl = getSecondaryLogoUrl(platform.domain);

  const handleCardClick = () => {
    window.open(platform.url, '_blank', 'noopener,noreferrer');
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(platform);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(platform);
  };

  return (
    <article
      className="platform-card"
      onClick={handleCardClick}
      tabIndex={0}
      role="link"
      aria-label={`Open ${platform.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleCardClick();
      }}
    >
      <div>
        {/* Top Row: Logo Container + Contextual Edit/Delete Actions */}
        <div className="card-top-row">
          <div className="card-logo-container" aria-hidden="true">
            {logoState === 'primary' ? (
              <img
                src={primaryUrl}
                alt=""
                className="card-logo-img"
                onError={() => setLogoState('secondary')}
                loading="lazy"
              />
            ) : logoState === 'secondary' ? (
              <img
                src={secondaryUrl}
                alt=""
                className="card-logo-img"
                onError={() => setLogoState('monogram')}
                loading="lazy"
              />
            ) : (
              <span className="card-monogram">{initial}</span>
            )}
          </div>

          <div className="card-actions" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="action-icon-btn"
              onClick={handleEditClick}
              title="Edit platform"
              aria-label={`Edit ${platform.name}`}
            >
              <Pencil size={13} strokeWidth={2} />
            </button>
            <button
              type="button"
              className="action-icon-btn delete"
              onClick={handleDeleteClick}
              title="Delete platform"
              aria-label={`Delete ${platform.name}`}
            >
              <Trash2 size={13} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Card Body: Platform Name + Muted Description */}
        <div className="card-body">
          <h3 className="card-name">{platform.name}</h3>
          <p className="card-desc">{platform.description}</p>
        </div>
      </div>

      {/* Card Bottom Row: Domain indicator + Circular subtle right-arrow button */}
      <div className="card-bottom-row">
        <span className="card-domain">{platform.domain}</span>
        <div className="card-arrow-btn" aria-hidden="true">
          <ArrowUpRight size={16} strokeWidth={2.2} />
        </div>
      </div>
    </article>
  );
};
