import { useState, useEffect } from "react";
import "./App.css";

import { initialEvents, initialReviews } from "./data/mockEvents";
import {
  fetchEventsFromApi,
  createEventApi,
  deleteEventApi,
  fetchReviewsFromApi,
  submitReviewApi,
  registerForEventApi,
  cancelRegistrationApi,
  toggleBookmarkApi,
  fetchUserRegistrationsApi,
  fetchBookmarksApi
} from "./services/api";

import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { EventsListView } from "./components/EventsListView";
import { EventDetailsView } from "./components/EventDetailsView";
import { DashboardView } from "./components/DashboardView";
import { AuthView } from "./components/AuthView";
import { TicketModal } from "./components/TicketModal";
import { CreateEventModal } from "./components/CreateEventModal";
import { CheckCircle2, Sparkles } from "lucide-react";

const STORAGE_KEYS = {
  EVENTS: "mira_events_list_v2",
  REVIEWS: "mira_events_reviews_v2",
  REGISTERED: "mira_events_registered_ids_v2",
  BOOKMARKS: "mira_events_bookmarks_v2",
  USER: "mira_events_current_user_v2",
  ROLE: "mira_events_active_role_v2"
};

function loadStored(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error("Storage write error", err);
  }
}

export default function App() {
  // Navigation State
  const [page, setPage] = useState("home"); // "home" | "events" | "dashboard" | "eventDetails" | "auth"
  const [role, setRole] = useState(() => loadStored(STORAGE_KEYS.ROLE, "student"));

  // Data State
  const [events, setEvents] = useState(() => loadStored(STORAGE_KEYS.EVENTS, initialEvents));
  const [reviews, setReviews] = useState(() => loadStored(STORAGE_KEYS.REVIEWS, initialReviews));
  const [registeredEventIds, setRegisteredEventIds] = useState(() =>
    loadStored(STORAGE_KEYS.REGISTERED, [1])
  );
  const [bookmarkedEventIds, setBookmarkedEventIds] = useState(() =>
    loadStored(STORAGE_KEYS.BOOKMARKS, [2])
  );

  // User State
  const [currentUser, setCurrentUser] = useState(() =>
    loadStored(STORAGE_KEYS.USER, {
      email: "ananya.iyer@miracollege.edu",
      fullName: "Ananya Iyer",
      role: "student",
      department: "AI & Data Science",
      year: "3"
    })
  );

  // Modals & UI Selection
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [ticketModalEvent, setTicketModalEvent] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // 1. Initial Load from MySQL Backend (if available)
  useEffect(() => {
    async function loadBackendData() {
      const apiEvents = await fetchEventsFromApi();
      if (apiEvents && Array.isArray(apiEvents) && apiEvents.length > 0) {
        setEvents(apiEvents);
      }

      const apiReviews = await fetchReviewsFromApi();
      if (apiReviews && Array.isArray(apiReviews)) {
        setReviews(apiReviews);
      }

      if (currentUser?.email) {
        const apiRegs = await fetchUserRegistrationsApi(currentUser.email);
        if (apiRegs && Array.isArray(apiRegs)) {
          setRegisteredEventIds(apiRegs);
        }

        const apiBookmarks = await fetchBookmarksApi(currentUser.email);
        if (apiBookmarks && Array.isArray(apiBookmarks)) {
          setBookmarkedEventIds(apiBookmarks);
        }
      }
    }
    loadBackendData();
  }, [currentUser?.email]);

  // Sync state to LocalStorage
  useEffect(() => {
    saveStored(STORAGE_KEYS.EVENTS, events);
  }, [events]);

  useEffect(() => {
    saveStored(STORAGE_KEYS.REVIEWS, reviews);
  }, [reviews]);

  useEffect(() => {
    saveStored(STORAGE_KEYS.REGISTERED, registeredEventIds);
  }, [registeredEventIds]);

  useEffect(() => {
    saveStored(STORAGE_KEYS.BOOKMARKS, bookmarkedEventIds);
  }, [bookmarkedEventIds]);

  useEffect(() => {
    saveStored(STORAGE_KEYS.USER, currentUser);
  }, [currentUser]);

  useEffect(() => {
    saveStored(STORAGE_KEYS.ROLE, role);
  }, [role]);

  // Toast Helper
  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3800);
  }

  // Role Switch Handler
  function handleSetRole(nextRole) {
    setRole(nextRole);
    if (nextRole === "organizer") {
      if (!currentUser || currentUser.role !== "organizer") {
        setCurrentUser({
          email: "robotics.lead@miracollege.edu",
          fullName: "Rahul Varma (Club Lead)",
          role: "organizer",
          club: "Mira Robotics & AI Club",
          department: "Computer Science"
        });
      }
      showToast("Switched to Organizer View", "info");
    } else {
      if (!currentUser || currentUser.role !== "student") {
        setCurrentUser({
          email: "ananya.iyer@miracollege.edu",
          fullName: "Ananya Iyer",
          role: "student",
          department: "AI & Data Science",
          year: "3"
        });
      }
      showToast("Switched to Student View", "info");
    }
  }

  // Register / RSVP Handler
  async function handleRegister(event) {
    if (role === "organizer") {
      showToast("Organizers cannot RSVP for events as attendees.", "error");
      return;
    }

    if (!currentUser) {
      setPage("auth");
      showToast("Please sign in to get your event pass.", "info");
      return;
    }

    if (registeredEventIds.includes(event.id)) {
      setTicketModalEvent(event);
      return;
    }

    // Add registration to local state
    setRegisteredEventIds((prev) => [...prev, event.id]);
    setEvents((prev) =>
      prev.map((e) =>
        e.id === event.id
          ? { ...e, registeredCount: (e.registeredCount || 0) + 1 }
          : e
      )
    );

    // Call MySQL Backend
    registerForEventApi(event.id, currentUser.email);

    // Open digital ticket pass modal immediately!
    setTicketModalEvent(event);
    showToast(`You're registered for ${event.title}! Real QR Pass generated.`);
  }

  // Cancel RSVP
  async function handleCancelRsvp(eventId) {
    setRegisteredEventIds((prev) => prev.filter((id) => id !== eventId));
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? { ...e, registeredCount: Math.max(0, (e.registeredCount || 1) - 1) }
          : e
      )
    );
    if (currentUser?.email) {
      cancelRegistrationApi(eventId, currentUser.email);
    }
    showToast("Registration cancelled.");
  }

  // Bookmark Toggle
  async function handleToggleBookmark(eventId) {
    if (bookmarkedEventIds.includes(eventId)) {
      setBookmarkedEventIds((prev) => prev.filter((id) => id !== eventId));
      showToast("Removed from bookmarks");
    } else {
      setBookmarkedEventIds((prev) => [...prev, eventId]);
      showToast("Saved to your bookmarks!");
    }
    if (currentUser?.email) {
      toggleBookmarkApi(eventId, currentUser.email);
    }
  }

  // Create Event
  async function handleAddEvent(newEvent) {
    setEvents((prev) => [newEvent, ...prev]);

    // Send to backend
    const saved = await createEventApi(newEvent);
    if (saved && saved.id) {
      setEvents((prev) =>
        prev.map((e) => (e.id === newEvent.id ? saved : e))
      );
    }

    showToast(`"${newEvent.title}" published to MySQL successfully!`);
  }

  // Delete Event
  async function handleDeleteEvent(eventId) {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
    deleteEventApi(eventId);
    showToast("Event deleted from database.");
  }

  // Submit Review
  async function handleSubmitReview(reviewData) {
    const existingIndex = reviews.findIndex(
      (r) =>
        String(r.eventId) === String(reviewData.eventId) &&
        r.studentEmail === reviewData.studentEmail
    );

    if (existingIndex >= 0) {
      setReviews((prev) => {
        const copy = [...prev];
        copy[existingIndex] = reviewData;
        return copy;
      });
      showToast("Your review has been updated!");
    } else {
      setReviews((prev) => [reviewData, ...prev]);
      showToast("Review submitted successfully! Saved to MySQL.");
    }

    submitReviewApi(reviewData);
  }

  // Quick Demo Login Action
  function handleQuickDemo() {
    if (role === "organizer") {
      setCurrentUser({
        email: "robotics.lead@miracollege.edu",
        fullName: "Rahul Varma (Club Lead)",
        role: "organizer",
        club: "Mira Robotics & AI Club",
        department: "Computer Science"
      });
      setPage("dashboard");
      showToast("Logged in as Demo Club Organizer!");
    } else {
      setCurrentUser({
        email: "ananya.iyer@miracollege.edu",
        fullName: "Ananya Iyer",
        role: "student",
        department: "AI & Data Science",
        year: "3"
      });
      setPage("events");
      showToast("Logged in as Demo Student! Browse events & tickets.");
    }
  }

  // Auth Success
  function handleLoginSuccess(user) {
    setCurrentUser(user);
    setRole(user.role);
    setPage("dashboard");
    showToast(`Welcome back, ${user.fullName}!`);
  }

  // Logout
  function handleLogout() {
    setCurrentUser(null);
    setPage("home");
    showToast("Signed out successfully.");
  }

  // Open Details
  function handleSelectEvent(event) {
    setSelectedEvent(event);
    setPage("eventDetails");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toast && (
        <aside
          className={`floating-toast ${toast.type}`}
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 size={16} />
          <span>{toast.message}</span>
        </aside>
      )}

      {/* Modern Navbar */}
      <Navbar
        page={page}
        setPage={setPage}
        role={role}
        setRole={handleSetRole}
        currentUser={currentUser}
        onLogout={handleLogout}
        registeredCount={registeredEventIds.length}
        onOpenMyPasses={() => {
          if (role === "organizer") {
            setPage("dashboard");
          } else {
            setPage("events");
          }
        }}
        onOpenCreateEvent={() => setIsCreateModalOpen(true)}
      />

      {/* Main Routed Content */}
      <main className="main-content">
        {page === "home" && (
          <HeroSection
            onExplore={() => setPage("events")}
            onOrganizerEntry={() => {
              handleSetRole("organizer");
              setPage(currentUser?.role === "organizer" ? "dashboard" : "auth");
            }}
            trendingEvents={events.filter((e) => e.date >= new Date().toISOString().slice(0, 10))}
            onSelectEvent={handleSelectEvent}
            onRegister={handleRegister}
            onViewTicket={(e) => setTicketModalEvent(e)}
            onToggleBookmark={handleToggleBookmark}
            registeredEventIds={registeredEventIds}
            bookmarkedEventIds={bookmarkedEventIds}
            role={role}
            onQuickDemo={handleQuickDemo}
          />
        )}

        {page === "events" && (
          <EventsListView
            events={events}
            reviews={reviews}
            role={role}
            currentUser={currentUser}
            registeredEventIds={registeredEventIds}
            bookmarkedEventIds={bookmarkedEventIds}
            onSelectEvent={handleSelectEvent}
            onRegister={handleRegister}
            onViewTicket={(e) => setTicketModalEvent(e)}
            onToggleBookmark={handleToggleBookmark}
            onOpenCreateEvent={() => setIsCreateModalOpen(true)}
          />
        )}

        {page === "dashboard" && (
          <DashboardView
            role={role}
            currentUser={currentUser}
            events={events}
            registeredEventIds={registeredEventIds}
            bookmarkedEventIds={bookmarkedEventIds}
            reviews={reviews}
            onOpenCreateEvent={() => setIsCreateModalOpen(true)}
            onSelectEvent={handleSelectEvent}
            onViewTicket={(e) => setTicketModalEvent(e)}
            onToggleBookmark={handleToggleBookmark}
            onRegister={handleRegister}
            onDeleteEvent={handleDeleteEvent}
          />
        )}

        {page === "eventDetails" && selectedEvent && (
          <EventDetailsView
            event={selectedEvent}
            onBack={() => setPage("events")}
            currentUser={currentUser}
            role={role}
            isRegistered={registeredEventIds.includes(selectedEvent.id)}
            isBookmarked={bookmarkedEventIds.includes(selectedEvent.id)}
            onToggleBookmark={handleToggleBookmark}
            onRegister={handleRegister}
            onViewTicket={(e) => setTicketModalEvent(e)}
            reviews={reviews}
            onSubmitReview={handleSubmitReview}
          />
        )}

        {page === "auth" && (
          <AuthView
            role={role}
            setRole={handleSetRole}
            onLoginSuccess={handleLoginSuccess}
            onCancel={() => setPage("home")}
          />
        )}
      </main>

      {/* Ticket Modal with Real QR Code */}
      {ticketModalEvent && (
        <TicketModal
          event={ticketModalEvent}
          attendee={currentUser || { fullName: "Student Attendee", email: "student@miracollege.edu" }}
          onClose={() => setTicketModalEvent(null)}
          onCancelRsvp={handleCancelRsvp}
        />
      )}

      {/* Organizer Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAddEvent={handleAddEvent}
        defaultClub={currentUser?.club || "Mira College Club"}
      />

      {/* Modern Footer */}
      <footer className="footer-modern">
        <div className="footer-content">
          <div className="footer-brand-side">
            <div className="footer-brand">
              <span className="footer-dot-live"></span>
              <strong>MIRA EVENTS</strong>
              <span>— Campus Hub</span>
            </div>
            <p className="footer-tagline">
              Powered by MySQL Database & Node.js backend for campus symposiums, hackathons, and cultural fests.
            </p>
          </div>

          <div className="footer-links-side">
            <div className="footer-meta-pill">
              <Sparkles size={13} className="sparkle-gold" />
              <span>MySQL Connected • Real QR Pass</span>
            </div>
            <span className="copyright-text">
              © {new Date().getFullYear()} Mira Events. All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
