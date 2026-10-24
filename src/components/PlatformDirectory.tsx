import React from 'react';
import { Search, X, PlusCircle, Compass } from 'lucide-react';
import type { Platform } from '../types';
import { PlatformCard } from './PlatformCard';

interface PlatformDirectoryProps {
  platforms: Platform[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenSubmit: () => void;
  onEditPlatform: (platform: Platform) => void;
  onDeletePlatform: (platform: Platform) => void;
}

export const PlatformDirectory: React.FC<PlatformDirectoryProps> = ({
  platforms,
  searchQuery,
  onSearchChange,
  onOpenSubmit,
  onEditPlatform,
  onDeletePlatform,
}) => {
  // Filter platforms based on query: name, domain, or description
  const filteredPlatforms = platforms.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      p.name.toLowerCase().includes(q) ||
      p.domain.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  });

  const hasNoPlatformsAtAll = platforms.length === 0;
  const hasNoSearchResults = platforms.length > 0 && filteredPlatforms.length === 0;

  return (
    <section id="platforms" className="directory-section" aria-labelledby="directory-title">
      <div className="container-hl">
        {/* Header Row: Title & Subtitle on left, Search on right */}
        <div className="directory-header-row">
          <div>
            <h2 id="directory-title" className="directory-title">
              Popular Platforms
            </h2>
            <p className="directory-subtitle">
              Explore hackathons from top platforms and communities.
            </p>
          </div>

          <div className="search-input-wrap">
            <Search size={16} className="search-icon" aria-hidden="true" />
            <input
              type="text"
              className="search-input"
              placeholder="Search platforms..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Search platforms"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => onSearchChange('')}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Content Area: Empty State OR Search Empty OR Three-Column Grid */}
        {hasNoPlatformsAtAll ? (
          /* MANDATORY INITIAL EMPTY STATE (Zero demo cards) */
          <div className="empty-state-box">
            <div className="empty-state-icon" aria-hidden="true">
              <Compass size={28} strokeWidth={1.8} />
            </div>
            <h3 className="empty-state-title">No platforms added yet</h3>
            <p className="empty-state-text">
              Your hackathon collection is currently empty. Add your favorite hackathon websites, developer communities, or coding platforms to start tracking them.
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={onOpenSubmit}
              aria-label="Add your first platform"
            >
              <PlusCircle size={17} strokeWidth={2.2} />
              <span>Add First Platform</span>
            </button>
          </div>
        ) : hasNoSearchResults ? (
          /* Search Empty State */
          <div className="empty-state-box" style={{ padding: '40px 24px' }}>
            <h3 className="empty-state-title" style={{ fontSize: '1.1rem' }}>
              No matching platforms found.
            </h3>
            <p className="empty-state-text" style={{ marginBottom: '16px' }}>
              We couldn't find any platform matching &ldquo;{searchQuery}&rdquo;. Try another keyword or add it to your directory.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => onSearchChange('')}
              >
                Clear Search
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={onOpenSubmit}
              >
                Add This Platform
              </button>
            </div>
          </div>
        ) : (
          /* 3-Column Platform Grid */
          <div className="platform-grid" role="list">
            {filteredPlatforms.map((platform) => (
              <PlatformCard
                key={platform.id}
                platform={platform}
                onEdit={onEditPlatform}
                onDelete={onDeletePlatform}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
