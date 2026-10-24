import React from 'react';
import { ArrowRight, Trophy, Code2, Users } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="container-hl">
        <div className="hero-grid">
          {/* Left Column: Copy & Primary CTA */}
          <div className="hero-content">
            <span className="eyebrow">BUILD · LEARN · COMPETE</span>
            
            <h1 id="hero-title" className="hero-headline">
              All Hackathons<br />in One Place
            </h1>

            <p className="hero-subtext">
              Discover upcoming hackathons from top communities, companies and student groups. Stay ahead, never miss an opportunity.
            </p>

            <button
              type="button"
              className="btn-primary"
              onClick={onExploreClick}
              aria-label="Explore Hackathons"
            >
              <span>Explore Hackathons</span>
              <ArrowRight size={17} strokeWidth={2.2} />
            </button>
          </div>

          {/* Right Column: Hero Artwork Illustration */}
          <div className="hero-artwork-wrap" aria-hidden="true">
            <div className="hero-artwork-canvas">
              {/* Concentric thin outline geometry */}
              <div className="art-ring-inner" />
              <div className="art-ring-outer" />

              {/* Large burgundy circular shape partially cropped by right edge */}
              <div className="art-burgundy-circle" />

              {/* Three Overlapping Lightly Shaded Off-White Cards */}
              {/* Card 1: Trophy Icon */}
              <div className="art-card art-card-top">
                <div className="art-icon-box">
                  <Trophy size={22} strokeWidth={2} />
                </div>
                <div>
                  <div className="art-card-title">Championships</div>
                  <div className="art-card-tag">Global prize pools</div>
                </div>
              </div>

              {/* Card 2: Code Icon */}
              <div className="art-card art-card-mid">
                <div className="art-icon-box">
                  <Code2 size={22} strokeWidth={2} />
                </div>
                <div>
                  <div className="art-card-title">Open Source Sprints</div>
                  <div className="art-card-tag">Build real products</div>
                </div>
              </div>

              {/* Card 3: Developer-Community Icon */}
              <div className="art-card art-card-bot">
                <div className="art-icon-box">
                  <Users size={22} strokeWidth={2} />
                </div>
                <div>
                  <div className="art-card-title">Developer Hubs</div>
                  <div className="art-card-tag">Find teams & mentors</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
