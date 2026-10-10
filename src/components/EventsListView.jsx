import { useState, useMemo } from "react";
import {
  Search,
  PlusCircle,
  Calendar,
  Sparkles,
  X,
  History,
  Clock,
  CheckCircle2
} from "lucide-react";
import { eventCategories } from "../data/mockEvents";
import { EventCard } from "./EventCard";

export function EventsListView({
  events,
  reviews,
  role = "student",
  registeredEventIds = [],
  bookmarkedEventIds = [],
  onSelectEvent,
  onRegister,
  onViewTicket,
  onToggleBookmark,
  onOpenCreateEvent,
  initialTab = "upcoming"
}) {
  const isOrganizer = role === "organizer";
  const today = new Date().toISOString().slice(0, 10);

  const [activeTab, setActiveTab] = useState(initialTab); // "upcoming" | "past" | "registered"
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter events based on activeTab, category, and searchQuery
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      // Tab filter
      if (activeTab === "upcoming" && evt.date < today) return false;
      if (activeTab === "past" && evt.date >= today) return false;
      if (activeTab === "registered" && !registeredEventIds.includes(evt.id)) return false;

      // Category filter
      if (selectedCategory !== "All" && evt.category !== selectedCategory) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = evt.title.toLowerCase().includes(query);
        const matchesDesc = evt.description.toLowerCase().includes(query);
        const matchesVenue = evt.venue.toLowerCase().includes(query);
        const matchesOrganizer = evt.organizer?.toLowerCase().includes(query);
        const matchesCategory = evt.category.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesVenue && !matchesOrganizer && !matchesCategory) {
          return false;
        }
      }

      return true;
    });
  }, [events, activeTab, selectedCategory, searchQuery, today, registeredEventIds]);

  // Tab counts
  const upcomingCount = events.filter((e) => e.date >= today).length;
  const pastCount = events.filter((e) => e.date < today).length;
  const registeredCount = events.filter((e) => registeredEventIds.includes(e.id)).length;

  return (
    <div className="events-directory-page">
      {/* Directory Page Header */}
      <div className="directory-header">
        <div className="directory-badge">
          <Sparkles size={13} />
          <span>CAMPUS CALENDAR</span>
        </div>
        <h1>Discover Campus Events</h1>
        <p>
          Find tech symposiums, hackathons, culturals, and workshops across Mira College.
        </p>
      </div>

      {/* Control Bar: Search & Status Tabs */}
      <div className="directory-controls-bar">
        {/* Status Tabs */}
        <div className="status-tab-pills">
          <button
            type="button"
            className={`tab-pill ${activeTab === "upcoming" ? "active" : ""}`}
            onClick={() => setActiveTab("upcoming")}
          >
            <Clock size={15} />
            <span>Upcoming ({upcomingCount})</span>
          </button>

          <button
            type="button"
            className={`tab-pill ${activeTab === "past" ? "active" : ""}`}
            onClick={() => setActiveTab("past")}
          >
            <History size={15} />
            <span>Past Events ({pastCount})</span>
          </button>

          {!isOrganizer && (
            <button
              type="button"
              className={`tab-pill ${activeTab === "registered" ? "active" : ""}`}
              onClick={() => setActiveTab("registered")}
            >
              <CheckCircle2 size={15} />
              <span>My Passes ({registeredCount})</span>
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="search-bar-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by event, club, or venue..."
          />
          {searchQuery && (
            <button
              type="button"
              className="btn-clear-search"
              onClick={() => setSearchQuery("")}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Strip */}
      <div className="category-filter-strip">
        <span className="filter-label">Categories:</span>
        <div className="pills-scroll-row">
          {eventCategories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count =
              cat === "All"
                ? events.length
                : events.filter((e) => e.category === cat).length;

            return (
              <button
                key={cat}
                type="button"
                className={`category-chip ${isSelected ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                <span>{cat}</span>
                <span className="count-pill">{count}</span>
              </button>
            );
          })}
        </div>

        {isOrganizer && (
          <button className="btn-host-top" onClick={onOpenCreateEvent}>
            <PlusCircle size={15} />
            <span>Host Event</span>
          </button>
        )}
      </div>

      {/* Events Grid or Empty State */}
      {filteredEvents.length === 0 ? (
        <div className="empty-results-box">
          <Calendar size={44} className="empty-cal-icon" />
          <h3>No events found</h3>
          <p>
            {searchQuery
              ? `No events match "${searchQuery}". Try a different keyword or category.`
              : activeTab === "registered"
              ? "You haven't registered for any events yet. Check upcoming events to get your pass!"
              : "No events listed under this filter."}
          </p>
          {(searchQuery || selectedCategory !== "All") && (
            <button
              className="btn-reset-filters"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="events-grid-responsive">
          {filteredEvents.map((evt) => {
            const evtReviews = reviews.filter((r) => String(r.eventId) === String(evt.id));
            const avgRating =
              evtReviews.length > 0
                ? (
                    evtReviews.reduce((sum, r) => sum + r.rating, 0) / evtReviews.length
                  ).toFixed(1)
                : null;

            return (
              <EventCard
                key={evt.id}
                event={evt}
                averageRating={avgRating}
                ratingCount={evtReviews.length}
                isRegistered={registeredEventIds.includes(evt.id)}
                isBookmarked={bookmarkedEventIds.includes(evt.id)}
                onToggleBookmark={onToggleBookmark}
                onSelectEvent={onSelectEvent}
                onRegister={onRegister}
                onViewTicket={onViewTicket}
                role={role}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
