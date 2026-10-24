import React from 'react';
import { BrandMark } from './BrandLogo';

interface FooterProps {
  onOpenAbout: () => void;
  onOpenSuggest: () => void;
  onOpenContact: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAbout,
  onOpenSuggest,
  onOpenContact,
}) => {
  return (
    <footer className="footer-wrap" role="contentinfo">
      <div className="container-hl footer-container">
        {/* Left Side */}
        <div className="footer-left">
          <div className="footer-brand">
            <BrandMark size={20} />
            <span className="brand-text" style={{ fontSize: '1.15rem' }}>
              HackList
            </span>
          </div>
          <p className="footer-sub">A curated collection for builders.</p>
        </div>

        {/* Right Side */}
        <nav className="footer-links" aria-label="Footer Navigation">
          <button
            type="button"
            className="footer-link"
            onClick={onOpenAbout}
          >
            About
          </button>
          <button
            type="button"
            className="footer-link"
            onClick={onOpenSuggest}
          >
            Suggest a Platform
          </button>
          <button
            type="button"
            className="footer-link"
            onClick={onOpenContact}
          >
            Contact
          </button>
        </nav>
      </div>
    </footer>
  );
};
