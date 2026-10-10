import { useState } from "react";
import {
  User,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  Building2,
  ArrowRight,
  Zap
} from "lucide-react";

export function AuthView({ role, setRole, onLoginSuccess, onCancel }) {
  const isOrganizer = role === "organizer";
  const [authMode, setAuthMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    club: "",
    department: "",
    year: "3",
    password: ""
  });

  function updateField(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  }

  function handleQuickDemoFill() {
    if (isOrganizer) {
      setForm({
        fullName: "Rahul Varma (Club Lead)",
        email: "robotics.lead@miracollege.edu",
        phone: "+91 98765 43210",
        club: "Mira Robotics & AI Club",
        department: "Computer Science",
        year: "4",
        password: "password123"
      });
    } else {
      setForm({
        fullName: "Ananya Iyer",
        email: "ananya.iyer@miracollege.edu",
        phone: "+91 91234 56789",
        club: "",
        department: "Artificial Intelligence & Data Science",
        year: "3",
        password: "password123"
      });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in email and password.");
      return;
    }

    const userData = {
      email: form.email.trim().toLowerCase(),
      fullName: form.fullName || (isOrganizer ? "Club Organizer" : "Campus Student"),
      role: role,
      department: form.department || (isOrganizer ? form.club : "Computer Science"),
      club: form.club,
      year: form.year
    };

    onLoginSuccess(userData);
  }

  return (
    <div className="auth-modern-page">
      <div className="auth-container-grid">
        {/* Left Side: Presentation Card */}
        <div className="auth-hero-pane">
          <div className="auth-badge-pill">
            <Sparkles size={14} />
            <span>CAMPUS GATEWAY</span>
          </div>

          <h1 className="auth-headline">
            {isOrganizer ? (
              <>
                Empower your club. <br />
                <span>Unite your campus.</span>
              </>
            ) : (
              <>
                Every event. <br />
                <span>One single hub.</span>
              </>
            )}
          </h1>

          <p className="auth-subtext">
            {isOrganizer
              ? "Host symposiums, manage registrations, track live capacity, and collect verified attendee feedback seamlessly."
              : "Discover upcoming hackathons, culturals, and technical symposiums. RSVP in one click and never miss a college memory."}
          </p>

          <div className="auth-perks-list">
            <div className="perk-row">
              <CheckCircle2 size={18} className="perk-check" />
              <span>{isOrganizer ? "Live real-time attendee tracking" : "Instant digital event pass with QR code"}</span>
            </div>
            <div className="perk-row">
              <CheckCircle2 size={18} className="perk-check" />
              <span>{isOrganizer ? "Verified student feedback & analytics" : "1-Click RSVP with spot reservation"}</span>
            </div>
            <div className="perk-row">
              <CheckCircle2 size={18} className="perk-check" />
              <span>{isOrganizer ? "Seamless event publishing with tags" : "Community reviews & verified ratings"}</span>
            </div>
          </div>

          <div className="demo-fill-card">
            <div className="demo-fill-text">
              <Zap size={16} className="zap-icon" />
              <div>
                <strong>Hackathon Demo Mode</strong>
                <p>Click below to prefill demo credentials instantly.</p>
              </div>
            </div>
            <button
              type="button"
              className="btn-demo-fill"
              onClick={handleQuickDemoFill}
            >
              Prefill {isOrganizer ? "Organizer" : "Student"} Demo
            </button>
          </div>
        </div>

        {/* Right Side: Auth Form Card */}
        <div className="auth-card-pane">
          <div className="auth-role-tabs">
            <button
              type="button"
              className={`role-tab-btn ${!isOrganizer ? "active" : ""}`}
              onClick={() => {
                setRole("student");
                setError("");
              }}
            >
              <User size={15} />
              <span>Student</span>
            </button>
            <button
              type="button"
              className={`role-tab-btn ${isOrganizer ? "active" : ""}`}
              onClick={() => {
                setRole("organizer");
                setError("");
              }}
            >
              <Building2 size={15} />
              <span>Club Organizer</span>
            </button>
          </div>

          <div className="auth-form-header">
            <h2>{authMode === "login" ? "Welcome back!" : "Create your account"}</h2>
            <p>
              {authMode === "login"
                ? `Sign in to your ${role} portal.`
                : `Join Mira Events as a campus ${role}.`}
            </p>
          </div>

          {/* Mode switch pills */}
          <div className="mode-switch-pills">
            <button
              type="button"
              className={authMode === "login" ? "active" : ""}
              onClick={() => setAuthMode("login")}
            >
              Sign In
            </button>
            <button
              type="button"
              className={authMode === "register" ? "active" : ""}
              onClick={() => setAuthMode("register")}
            >
              Create Account
            </button>
          </div>

          {error && <div className="form-error-banner">{error}</div>}

          <form onSubmit={handleSubmit} className="modern-auth-form">
            {authMode === "register" && (
              <>
                <div className="form-field full">
                  <label>Full Name *</label>
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={updateField}
                    placeholder="e.g. Ananya Iyer"
                    required
                  />
                </div>

                <div className="form-field full">
                  <label>Mobile Number *</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={updateField}
                    placeholder="e.g. +91 98765 43210"
                    required
                  />
                </div>

                {isOrganizer ? (
                  <div className="form-field full">
                    <label>Club / Committee / Department *</label>
                    <input
                      name="club"
                      value={form.club}
                      onChange={updateField}
                      placeholder="e.g. Robotics Club or CSE Dept"
                      required
                    />
                  </div>
                ) : (
                  <div className="form-row two-cols">
                    <div className="form-field">
                      <label>Department *</label>
                      <input
                        name="department"
                        value={form.department}
                        onChange={updateField}
                        placeholder="e.g. AI & Data Science"
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label>Year of Study</label>
                      <select name="year" value={form.year} onChange={updateField}>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                      </select>
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="form-field full">
              <label>College Email Address *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={updateField}
                placeholder="student@miracollege.edu"
                required
              />
            </div>

            <div className="form-field full">
              <label>Password *</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={updateField}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="btn-toggle-eye"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-auth-submit">
              <span>{authMode === "login" ? "Sign In to Mira Events" : "Complete Registration"}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="auth-card-footer">
            <button type="button" className="btn-back-home" onClick={onCancel}>
              ← Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
