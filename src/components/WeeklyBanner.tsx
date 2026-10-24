import React from 'react';

export const WeeklyBanner: React.FC = () => {
  return (
    <section className="weekly-banner-section" aria-label="Opportunities Announcement">
      <div className="container-hl">
        <div className="weekly-banner">
          {/* Left Content */}
          <div className="banner-content">
            <span className="eyebrow" style={{ color: 'var(--burgundy-primary)' }}>
              STAY AHEAD
            </span>
            <h2 className="banner-headline">
              New opportunities, every week.
            </h2>
            <p className="banner-subtext">
              Keep building. Keep learning. Keep exploring.
            </p>
          </div>

          {/* Right-Side Understated Geometric Artwork */}
          <div className="banner-artwork" aria-hidden="true">
            {/* Concentric subtle circular rings */}
            <div className="banner-ring-2" />
            <div className="banner-ring-1" />

            {/* Large burgundy circular shape partially cropped by lower edge */}
            <div className="banner-burgundy-circle" />

            {/* Small muted circular decorative accent */}
            <div className="banner-dot-accent" />
          </div>
        </div>
      </div>
    </section>
  );
};
