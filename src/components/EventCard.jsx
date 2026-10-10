import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Star,
  Ticket,
  Bookmark,
  ArrowRight,
  Building2,
  CheckCircle2
} from "lucide-react";
import { getCategoryColor, formatEventDate } from "../utils/eventHelpers";

export function EventCard({
  event,
  averageRating,
  ratingCount,
  isRegistered,
  isBookmarked,
  onToggleBookmark,
  onSelectEvent,
  onRegister,
  onViewTicket,
  role = "student"
}) {
  const isOrganizer = role === "organizer";
  const today = new Date().toISOString().slice(0, 10);
  const isPast = event.date < today;
  const colors = getCategoryColor(event.category);

  const capacity = event.capacity || 100;
  const registered = event.registeredCount || 0;
  const capacityPercent = Math.min(100, Math.round((registered / capacity) * 100));
  const isAlmostFull = capacityPercent >= 85 && !isPast;

  return (
    <article className={`modern-event-card ${isPast ? "is-past" : ""}`}>
      {/* Event Photo Banner */}
      <div className="card-image-wrap" onClick={() => onSelectEvent(event)}>
        <img
          src={event.image || `/events/event-${((event.id - 1) % 6) + 1}.jpg`}
          alt={event.title}
          className="card-image"
          loading="lazy"
        />
        <div className="card-image-gradient"></div>

        <span
          className="category-pill on-image"
          style={{
            backgroundColor: colors.bg,
            color: colors.text,
            borderColor: colors.border
          }}
        >
          {event.category}
        </span>

        {!isOrganizer && (
          <button
            type="button"
            className={`bookmark-btn on-image ${isBookmarked ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(event.id);
            }}
            title={isBookmarked ? "Remove bookmark" : "Save event"}
            aria-label="Bookmark event"
          >
            <Bookmark size={15} fill={isBookmarked ? "#4f46e5" : "none"} />
          </button>
        )}
      </div>

      {/* Top Status Row */}
      <div className="card-top-row">
        <div className="organizer-badge">
          <Building2 size={13} className="org-icon" />
          <span>{event.organizer || "Campus Club"}</span>
        </div>

        <div className="card-top-actions">
          {isPast ? (
            <span className="status-badge status-past">Completed</span>
          ) : isAlmostFull ? (
            <span className="status-badge status-urgent">🔥 Almost Full</span>
          ) : (
            <span className="status-badge status-open">Open</span>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="card-body">
        {/* Organizer Club / Department */}
        <div className="organizer-badge">
          <Building2 size={13} className="org-icon" />
          <span>{event.organizer || "Campus Club"}</span>
        </div>

        {/* Title */}
        <h3 className="card-title" onClick={() => onSelectEvent(event)}>
          {event.title}
        </h3>

        {/* Description snippet */}
        <p className="card-desc">
          {event.description}
        </p>

        {/* Info Grid */}
        <div className="event-meta-grid">
          <div className="meta-item">
            <Calendar size={14} className="meta-icon" />
            <span>{formatEventDate(event.date)}</span>
          </div>

          <div className="meta-item">
            <Clock size={14} className="meta-icon" />
            <span>{event.time}</span>
          </div>

          <div className="meta-item full-width">
            <MapPin size={14} className="meta-icon" />
            <span className="venue-text">{event.venue}</span>
          </div>
        </div>

        {/* Capacity Progress Bar */}
        {!isPast && (
          <div className="capacity-container">
            <div className="capacity-header">
              <span className="capacity-label">
                <Users size={12} />
                <span>Attendance Capacity</span>
              </span>
              <span className="capacity-stats">
                <strong>{registered}</strong> / {capacity} spots
              </span>
            </div>
            <div className="progress-track">
              <div
                className={`progress-fill ${isAlmostFull ? "warning" : ""}`}
                style={{ width: `${capacityPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Ratings & Tags preview */}
        <div className="card-ratings-row">
          <div className="star-rating-pill">
            <Star size={14} className="star-gold" fill="#f59e0b" />
            <strong>{averageRating ? averageRating : "New"}</strong>
            <span className="review-count">
              ({ratingCount} {ratingCount === 1 ? "review" : "reviews"})
            </span>
          </div>

          {event.fee && (
            <span className="event-fee-pill">
              {event.fee}
            </span>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="card-footer">
        <button
          type="button"
          className="btn-details"
          onClick={() => onSelectEvent(event)}
        >
          <span>Details & Reviews</span>
          <ArrowRight size={14} />
        </button>

        {!isOrganizer && !isPast && (
          isRegistered ? (
            <button
              type="button"
              className="btn-registered"
              onClick={() => onViewTicket(event)}
            >
              <CheckCircle2 size={15} />
              <span>Pass Ready</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn-rsvp-primary"
              onClick={() => onRegister(event)}
            >
              <Ticket size={15} />
              <span>RSVP Free</span>
            </button>
          )
        )}
      </div>
    </article>
  );
}
