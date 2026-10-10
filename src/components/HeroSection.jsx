import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Users,
  Award,
  Zap,
  Ticket
} from "lucide-react";
import { EventCard } from "./EventCard";

export function HeroSection({
  onExplore,
  onOrganizerEntry,
  trendingEvents = [],
  onSelectEvent,
  onRegister,
  onViewTicket,
  onToggleBookmark,
  registeredEventIds = [],
  bookmarkedEventIds = [],
  role = "student",
  onQuickDemo
}) {
  return (
    <div className="home-hero-wrap">
      {/* Hero Header */}
      <section className="hero-modern-section">
        <div className="hero-badge-pill">
          <span className="pulse-dot"></span>
          <span>CAMPUS EVENT & CLUB PLATFORM</span>
        </div>

        <h1 className="hero-main-title">
          The Pulse of Your <br />
          <span className="text-gradient">Campus Life.</span>
        </h1>

        <p className="hero-subtitle">
          Explore upcoming symposiums, hackathons, culturals, and technical workshops.
          Reserve free student passes in 1-click and review real campus experiences.
        </p>

        {/* Action Buttons */}
        <div className="hero-actions-row">
          <button className="btn-hero-primary" onClick={onExplore}>
            <Calendar size={18} />
            <span>Discover Events</span>
            <ArrowRight size={16} />
          </button>

          <button className="btn-hero-secondary" onClick={onOrganizerEntry}>
            <ShieldCheck size={18} />
            <span>Club Organizer Portal</span>
          </button>

          <button
            className="btn-hero-demo"
            onClick={onQuickDemo}
            title="Instant 1-click Demo Login for interview presentation"
          >
            <Zap size={16} className="zap-icon" />
            <span>1-Click Demo Login</span>
          </button>
        </div>

        {/* Live Platform Stats */}
        <div className="hero-stats-strip">
          <div className="stat-item">
            <span className="stat-number">20+</span>
            <span className="stat-text">Active Campus Events</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">1,850+</span>
            <span className="stat-text">Registered Students</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">24</span>
            <span className="stat-text">College Societies</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">4.9 ★</span>
            <span className="stat-text">Verified Rating</span>
          </div>
        </div>
      </section>

      {/* Featured / Trending Events Preview */}
      <section className="trending-events-section">
        <div className="trending-header-row">
          <div>
            <div className="section-pill">
              <Sparkles size={13} />
              <span>WHAT'S HAPPENING NEXT</span>
            </div>
            <h2>Trending Campus Events</h2>
            <p>Popular events filling up fast across engineering, arts, and robotics.</p>
          </div>

          <button className="btn-view-all-link" onClick={onExplore}>
            <span>View All ({trendingEvents.length}+)</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="events-grid-responsive">
          {trendingEvents.slice(0, 3).map((evt) => (
            <EventCard
              key={evt.id}
              event={evt}
              averageRating="4.9"
              ratingCount={2}
              isRegistered={registeredEventIds.includes(evt.id)}
              isBookmarked={bookmarkedEventIds.includes(evt.id)}
              onToggleBookmark={onToggleBookmark}
              onSelectEvent={onSelectEvent}
              onRegister={onRegister}
              onViewTicket={onViewTicket}
              role={role}
            />
          ))}
        </div>
      </section>

      {/* Campus Value Proposition Grid */}
      <section className="features-prop-section">
        <div className="feature-prop-card">
          <div className="feature-icon-box purple">
            <Ticket size={24} />
          </div>
          <h3>Instant Digital Event Passes</h3>
          <p>
            Never lose paper tickets again. Generate unique digital campus passes with QR codes ready for instant gate scanning.
          </p>
        </div>

        <div className="feature-prop-card">
          <div className="feature-icon-box indigo">
            <Award size={24} />
          </div>
          <h3>Verified Reviews & Ratings</h3>
          <p>
            Authentic peer reviews from fellow students with rating distributions to help you choose the best workshops and fests.
          </p>
        </div>

        <div className="feature-prop-card">
          <div className="feature-icon-box emerald">
            <Users size={24} />
          </div>
          <h3>Organizer Command Center</h3>
          <p>
            Campus club leads can publish events in 60 seconds, monitor capacity thresholds, and engage with student feedback.
          </p>
        </div>
      </section>
    </div>
  );
}
