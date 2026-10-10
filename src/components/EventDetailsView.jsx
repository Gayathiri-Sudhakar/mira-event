import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Building2,
  Users,
  CheckCircle2,
  Ticket,
  Bookmark,
  Share2,
  Sparkles,
  Tag
} from "lucide-react";
import { getCategoryColor, formatEventDate } from "../utils/eventHelpers";
import { EventFeedback } from "./EventFeedback";

export function EventDetailsView({
  event,
  onBack,
  currentUser,
  role = "student",
  isRegistered,
  isBookmarked,
  onToggleBookmark,
  onRegister,
  onViewTicket,
  reviews,
  onSubmitReview
}) {
  const isOrganizer = role === "organizer";
  const colors = getCategoryColor(event.category);
  const today = new Date().toISOString().slice(0, 10);
  const isPast = event.date < today;

  const capacity = event.capacity || 100;
  const registered = event.registeredCount || 0;
  const remaining = Math.max(0, capacity - registered);

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out ${event.title} at Mira Events!`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Event link copied to clipboard!");
    }
  }

  return (
    <div className="event-details-page">
      {/* Breadcrumb Top Bar */}
      <div className="details-top-bar">
        <button type="button" className="btn-back-crumb" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back to All Events</span>
        </button>

        <div className="details-top-actions">
          {!isOrganizer && (
            <button
              type="button"
              className={`details-icon-btn ${isBookmarked ? "active" : ""}`}
              onClick={() => onToggleBookmark(event.id)}
              title={isBookmarked ? "Remove bookmark" : "Bookmark this event"}
            >
              <Bookmark size={17} fill={isBookmarked ? "#4f46e5" : "none"} />
            </button>
          )}

          <button
            type="button"
            className="details-icon-btn"
            onClick={handleShare}
            title="Share event link"
          >
            <Share2 size={17} />
          </button>
        </div>
      </div>

      {/* Main Hero Header Card */}
      <div className="details-hero-card">
        <div className="details-hero-badge-row">
          <span
            className="category-pill large"
            style={{
              backgroundColor: colors.bg,
              color: colors.text,
              borderColor: colors.border
            }}
          >
            {event.category}
          </span>

          {isPast ? (
            <span className="status-badge status-past">Completed Event</span>
          ) : remaining === 0 ? (
            <span className="status-badge status-urgent">Housefull</span>
          ) : (
            <span className="status-badge status-open">
              {remaining} spots available
            </span>
          )}
        </div>

        <h1 className="details-title">{event.title}</h1>

        <div className="details-host-row">
          <div className="host-pill">
            <Building2 size={15} />
            <span>Hosted by <strong>{event.organizer || "Mira College Club"}</strong></span>
          </div>
          {event.department && (
            <span className="host-dept-pill">{event.department}</span>
          )}
        </div>

        {/* Quick Specs Grid */}
        <div className="details-specs-grid">
          <div className="spec-card">
            <Calendar size={18} className="spec-icon" />
            <div>
              <span className="spec-label">Date</span>
              <strong className="spec-val">{formatEventDate(event.date)}</strong>
            </div>
          </div>

          <div className="spec-card">
            <Clock size={18} className="spec-icon" />
            <div>
              <span className="spec-label">Time Slot</span>
              <strong className="spec-val">{event.time}</strong>
            </div>
          </div>

          <div className="spec-card">
            <MapPin size={18} className="spec-icon" />
            <div>
              <span className="spec-label">Venue</span>
              <strong className="spec-val">{event.venue}</strong>
            </div>
          </div>

          <div className="spec-card">
            <Users size={18} className="spec-icon" />
            <div>
              <span className="spec-label">Capacity & Fee</span>
              <strong className="spec-val">
                {registered}/{capacity} • {event.fee || "Free"}
              </strong>
            </div>
          </div>
        </div>

        {/* CTA Bar */}
        {!isOrganizer && !isPast && (
          <div className="details-cta-banner">
            <div>
              <span className="cta-headline">Ready to attend this event?</span>
              <p className="cta-subline">
                {isRegistered
                  ? "You have already reserved your spot! View your digital pass below."
                  : `Free instant registration for all Mira College students.`}
              </p>
            </div>

            {isRegistered ? (
              <button
                type="button"
                className="btn-registered-large"
                onClick={() => onViewTicket(event)}
              >
                <CheckCircle2 size={18} />
                <span>View My Digital Pass</span>
              </button>
            ) : (
              <button
                type="button"
                className="btn-rsvp-large"
                onClick={() => onRegister(event)}
              >
                <Ticket size={18} />
                <span>RSVP & Get Digital Pass</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Two Column Layout: Description & Key Highlights */}
      <div className="details-content-grid">
        <div className="details-main-col">
          <div className="details-section-card">
            <h3>About This Event</h3>
            <p className="details-description-text">{event.description}</p>

            {event.tags && event.tags.length > 0 && (
              <div className="details-tags-wrap">
                <Tag size={15} className="tag-icon" />
                {event.tags.map((tag) => (
                  <span key={tag} className="detail-tag-pill">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="details-side-col">
          <div className="details-section-card highlights-card">
            <h3>Event Highlights</h3>
            <ul className="highlights-list">
              {(event.highlights || [
                "Interactive Q&A Session",
                "Participation Certificate",
                "Networking Opportunity"
              ]).map((hl, i) => (
                <li key={i}>
                  <Sparkles size={14} className="hl-sparkle" />
                  <span>{hl}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Reviews & Feedback Section */}
      <EventFeedback
        eventId={event.id}
        eventTitle={event.title}
        reviews={reviews}
        currentUser={currentUser}
        role={role}
        onSubmitReview={onSubmitReview}
      />
    </div>
  );
}
