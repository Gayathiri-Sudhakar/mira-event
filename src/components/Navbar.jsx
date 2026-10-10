import {
  Sparkles,
  Calendar,
  Ticket,
  User,
  ShieldCheck,
  LogOut,
  PlusCircle,
  Compass
} from "lucide-react";

export function Navbar({
  page,
  setPage,
  role,
  setRole,
  currentUser,
  onLogout,
  registeredCount = 0,
  onOpenMyPasses,
  onOpenCreateEvent
}) {
  const isOrganizer = role === "organizer";

  return (
    <header className="navbar-modern">
      <div className="navbar-container">
        {/* Brand */}
        <div className="navbar-brand" onClick={() => setPage("home")}>
          <div className="brand-logo-modern">
            <Sparkles className="brand-sparkle" size={20} />
          </div>
          <div className="brand-text">
            <span className="brand-title">Mira Events</span>
            <span className="brand-tagline">Campus Hub</span>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="nav-links-modern">
          <button
            className={`nav-btn ${page === "home" ? "active" : ""}`}
            onClick={() => setPage("home")}
          >
            <Compass size={17} />
            <span>Home</span>
          </button>

          <button
            className={`nav-btn ${page === "events" ? "active" : ""}`}
            onClick={() => setPage("events")}
          >
            <Calendar size={17} />
            <span>Discover Events</span>
          </button>

          {currentUser && (
            <button
              className={`nav-btn ${page === "dashboard" ? "active" : ""}`}
              onClick={() => setPage("dashboard")}
            >
              <span>{isOrganizer ? "Organizer Studio" : "My Dashboard"}</span>
            </button>
          )}
        </nav>

        {/* Right side controls */}
        <div className="navbar-actions">
          {/* Quick Role Switcher Pill */}
          <div className="role-switch-container" title="Switch view between Student and Club Organizer">
            <span className="role-switch-label">Role:</span>
            <div className="role-switch-pill">
              <button
                type="button"
                className={`role-pill-btn ${!isOrganizer ? "active student" : ""}`}
                onClick={() => setRole("student")}
              >
                <User size={13} />
                Student
              </button>
              <button
                type="button"
                className={`role-pill-btn ${isOrganizer ? "active organizer" : ""}`}
                onClick={() => setRole("organizer")}
              >
                <ShieldCheck size={13} />
                Organizer
              </button>
            </div>
          </div>

          {/* Organizer Quick Action */}
          {isOrganizer && currentUser && (
            <button
              className="btn-create-event-nav"
              onClick={onOpenCreateEvent}
            >
              <PlusCircle size={16} />
              <span>Host Event</span>
            </button>
          )}

          {/* Student Registered Passes badge button */}
          {!isOrganizer && (
            <button
              className="btn-my-tickets"
              onClick={onOpenMyPasses}
              title="View your registered event tickets"
            >
              <Ticket size={17} />
              <span className="tickets-text">Passes</span>
              {registeredCount > 0 && (
                <span className="ticket-badge">{registeredCount}</span>
              )}
            </button>
          )}

          {/* User profile / Auth Button */}
          {currentUser ? (
            <div className="user-profile-badge">
              <div className="user-avatar">
                {currentUser.fullName ? currentUser.fullName[0].toUpperCase() : "U"}
              </div>
              <div className="user-details-mini">
                <span className="user-name-mini">{currentUser.fullName || currentUser.email.split("@")[0]}</span>
                <span className="user-role-mini">{isOrganizer ? "Organizer" : "Student"}</span>
              </div>
              <button
                className="btn-logout-mini"
                onClick={onLogout}
                title="Log out"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button
              className="btn-login-nav"
              onClick={() => setPage("auth")}
            >
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
