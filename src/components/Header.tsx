import React from 'react';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  onOpenSubmit: () => void;
  onOpenAbout: () => void;
  onOpenResources: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSubmit,
  onOpenAbout,
  onOpenResources,
}) => {
  return (
    <header className="header-wrapper" role="banner">
      <div className="container-hl header-container">
        <BrandLogo size="md" />

        <nav className="nav-links" aria-label="Main Navigation">
          <button
            type="button"
            className="nav-link"
            onClick={onOpenResources}
            aria-label="Resources"
          >
            Resources
          </button>
          <button
            type="button"
            className="nav-link"
            onClick={onOpenAbout}
            aria-label="About HackList"
          >
            About
          </button>
          <button
            type="button"
            className="nav-link"
            onClick={onOpenSubmit}
            aria-label="Submit Platform"
            style={{ fontWeight: 700, color: 'var(--burgundy-primary)' }}
          >
            Submit
          </button>
        </nav>
      </div>
    </header>
  );
};
