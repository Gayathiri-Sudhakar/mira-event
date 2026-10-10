import {
  Calendar,
  Ticket,
  Star,
  Users,
  PlusCircle,
  Bookmark,
  Building2,
  Trash2,
  Sparkles
} from "lucide-react";
import { EventCard } from "./EventCard";

export function DashboardView({
  role = "student",
  currentUser,
  events,
  registeredEventIds,
  bookmarkedEventIds,
  reviews,
  onOpenCreateEvent,
  onSelectEvent,
  onViewTicket,
  onToggleBookmark,
  onRegister,
  onDeleteEvent
}) {
  const isOrganizer = role === "organizer";

  // Calculations for Organizer
  const organizerEvents = events.filter((e) =>
    currentUser?.club ? e.organizer?.toLowerCase().includes(currentUser.club.toLowerCase()) || true : true
  );
  const totalRsvps = organizerEvents.reduce((sum, e) => sum + (e.registeredCount || 0), 0);

  const allReviewsForOrgEvents = reviews.filter((r) =>
    organizerEvents.some((e) => String(e.id) === String(r.eventId))
  );
  const avgRating =
    allReviewsForOrgEvents.length > 0
      ? (
          allReviewsForOrgEvents.reduce((s, r) => s + r.rating, 0) /
          allReviewsForOrgEvents.length
        ).toFixed(1)
      : "5.0";

  // Calculations for Student
  const myRegisteredEvents = events.filter((e) => registeredEventIds.includes(e.id));
  const myBookmarkedEvents = events.filter((e) => bookmarkedEventIds.includes(e.id));
  const myReviews = reviews.filter((r) => r.studentEmail === currentUser?.email);

  return (
    <div className="dashboard-container">
      {/* Header Banner */}
      <div className="dashboard-banner">
        <div className="dashboard-banner-text">
          <div className="dash-role-badge">
            <Sparkles size={13} />
            <span>{isOrganizer ? "ORGANIZER STUDIO" : "STUDENT PORTAL"}</span>
          </div>
          <h1>Welcome, {currentUser?.fullName || (isOrganizer ? "Club Leader" : "Student")}!</h1>
          <p>
            {isOrganizer
              ? "Monitor event turnout, review attendee feedback, and publish upcoming campus initiatives."
              : "Track your registered campus passes, access saved events, and manage reviews."}
          </p>
        </div>

        {isOrganizer && (
          <button className="btn-dash-create" onClick={onOpenCreateEvent}>
            <PlusCircle size={18} />
            <span>Host New Event</span>
          </button>
        )}
      </div>

      {/* Metrics Row */}
      {isOrganizer ? (
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon-wrap indigo">
              <Calendar size={22} />
            </div>
            <div className="metric-info">
              <span className="metric-label">Events Hosted</span>
              <strong className="metric-val">{organizerEvents.length}</strong>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-wrap emerald">
              <Users size={22} />
            </div>
            <div className="metric-info">
              <span className="metric-label">Total Student RSVPs</span>
              <strong className="metric-val">{totalRsvps}</strong>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-wrap amber">
              <Star size={22} />
            </div>
            <div className="metric-info">
              <span className="metric-label">Avg Feedback Score</span>
              <strong className="metric-val">{avgRating} / 5.0</strong>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-wrap purple">
              <Building2 size={22} />
            </div>
            <div className="metric-info">
              <span className="metric-label">Registered Club</span>
              <strong className="metric-val small-text">{currentUser?.club || "Mira Tech Club"}</strong>
            </div>
          </div>
        </div>
      ) : (
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon-wrap emerald">
              <Ticket size={22} />
            </div>
            <div className="metric-info">
              <span className="metric-label">Active Passes</span>
              <strong className="metric-val">{myRegisteredEvents.length}</strong>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-wrap indigo">
              <Bookmark size={22} />
            </div>
            <div className="metric-info">
              <span className="metric-label">Saved Events</span>
              <strong className="metric-val">{myBookmarkedEvents.length}</strong>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-wrap amber">
              <Star size={22} />
            </div>
            <div className="metric-info">
              <span className="metric-label">Reviews Shared</span>
              <strong className="metric-val">{myReviews.length}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {isOrganizer ? (
        <div className="dash-section">
          <div className="section-header-row">
            <h2>Your Club's Events</h2>
            <span className="section-counter">{organizerEvents.length} Listed</span>
          </div>

          {organizerEvents.length === 0 ? (
            <div className="empty-dash-box">
              <p>No events published yet. Click "Host New Event" to start!</p>
            </div>
          ) : (
            <div className="organizer-events-list">
              {organizerEvents.map((evt) => {
                const evtReviews = reviews.filter((r) => String(r.eventId) === String(evt.id));
                const evtAvg =
                  evtReviews.length > 0
                    ? (evtReviews.reduce((s, r) => s + r.rating, 0) / evtReviews.length).toFixed(1)
                    : "New";

                return (
                  <div key={evt.id} className="org-event-row-card">
                    <div className="org-event-info">
                      <span className="event-category-badge">{evt.category}</span>
                      <h3>{evt.title}</h3>
                      <div className="org-event-meta">
                        <span>📅 {evt.date}</span>
                        <span>🕒 {evt.time}</span>
                        <span>📍 {evt.venue}</span>
                        <span>👥 {evt.registeredCount || 0}/{evt.capacity} registered</span>
                        <span>⭐ {evtAvg} ({evtReviews.length})</span>
                      </div>
                    </div>

                    <div className="org-event-actions">
                      <button
                        className="btn-org-view"
                        onClick={() => onSelectEvent(evt)}
                      >
                        View & Reviews →
                      </button>
                      {onDeleteEvent && (
                        <button
                          className="btn-org-delete"
                          onClick={() => {
                            if (window.confirm(`Delete "${evt.title}"?`)) {
                              onDeleteEvent(evt.id);
                            }
                          }}
                          title="Delete event"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="dash-section">
          <div className="section-header-row">
            <h2>Your Registered Event Passes</h2>
            <span className="section-counter">{myRegisteredEvents.length} Active</span>
          </div>

          {myRegisteredEvents.length === 0 ? (
            <div className="empty-dash-box">
              <Ticket size={36} className="empty-icon" />
              <h3>No event passes yet</h3>
              <p>Explore upcoming campus events and reserve your spot with 1 click!</p>
            </div>
          ) : (
            <div className="events-grid-responsive">
              {myRegisteredEvents.map((evt) => (
                <EventCard
                  key={evt.id}
                  event={evt}
                  averageRating="4.9"
                  ratingCount={3}
                  isRegistered={true}
                  isBookmarked={bookmarkedEventIds.includes(evt.id)}
                  onToggleBookmark={onToggleBookmark}
                  onSelectEvent={onSelectEvent}
                  onRegister={onRegister}
                  onViewTicket={onViewTicket}
                  role={role}
                />
              ))}
            </div>
          )}

          {myBookmarkedEvents.length > 0 && (
            <div className="dash-section" style={{ marginTop: "40px" }}>
              <div className="section-header-row">
                <h2>Saved for Later</h2>
                <span className="section-counter">{myBookmarkedEvents.length} Bookmarked</span>
              </div>
              <div className="events-grid-responsive">
                {myBookmarkedEvents.map((evt) => (
                  <EventCard
                    key={evt.id}
                    event={evt}
                    averageRating="4.8"
                    ratingCount={2}
                    isRegistered={registeredEventIds.includes(evt.id)}
                    isBookmarked={true}
                    onToggleBookmark={onToggleBookmark}
                    onSelectEvent={onSelectEvent}
                    onRegister={onRegister}
                    onViewTicket={onViewTicket}
                    role={role}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
