import { useState } from "react";
import { X, Sparkles } from "lucide-react";
import { eventCategories } from "../data/mockEvents";

export function CreateEventModal({ isOpen, onClose, onAddEvent, defaultClub = "" }) {
  const today = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    title: "",
    category: "Technical Events",
    date: "",
    time: "10:00 AM - 04:00 PM",
    venue: "",
    organizer: defaultClub || "Mira Tech Club",
    department: "Computer Science",
    capacity: 100,
    fee: "Free",
    description: "",
    tagsInput: "Innovation, Workshop, Networking"
  });

  const [error, setError] = useState("");

  if (!isOpen) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Please enter an event title.");
      return;
    }
    if (!form.date || form.date < today) {
      setError("Please choose today or a future date.");
      return;
    }
    if (!form.venue.trim()) {
      setError("Please enter a venue.");
      return;
    }

    const tags = form.tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const newEvent = {
      id: Date.now(),
      title: form.title.trim(),
      category: form.category,
      date: form.date,
      time: form.time.trim(),
      venue: form.venue.trim(),
      organizer: form.organizer.trim(),
      department: form.department.trim(),
      capacity: Number(form.capacity) || 100,
      registeredCount: 0,
      fee: form.fee.trim() || "Free",
      description: form.description.trim(),
      tags: tags.length ? tags : ["Campus Event"],
      highlights: ["Interactive Session", "Verified Campus Event", "Student Networking"]
    };

    onAddEvent(newEvent);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="create-event-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="create-badge">
              <Sparkles size={13} />
              <span>ORGANIZER STUDIO</span>
            </div>
            <h2>Publish New Campus Event</h2>
            <p>Fill in the details to list your club's event on Mira Events.</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {error && <div className="form-error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="modern-form">
          <div className="form-row">
            <div className="form-field full">
              <label>Event Name / Title *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. NextGen AI & Robotics Summit 2026"
                required
              />
            </div>
          </div>

          <div className="form-row two-cols">
            <div className="form-field">
              <label>Category *</label>
              <select name="category" value={form.category} onChange={handleChange} required>
                {eventCategories
                  .filter((c) => c !== "All")
                  .map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
              </select>
            </div>

            <div className="form-field">
              <label>Hosting Club / Society *</label>
              <input
                name="organizer"
                value={form.organizer}
                onChange={handleChange}
                placeholder="e.g. Robotics Club"
                required
              />
            </div>
          </div>

          <div className="form-row three-cols">
            <div className="form-field">
              <label>Date *</label>
              <input
                type="date"
                name="date"
                value={form.date}
                min={today}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label>Time Slot *</label>
              <input
                name="time"
                value={form.time}
                onChange={handleChange}
                placeholder="e.g. 10:00 AM - 04:00 PM"
                required
              />
            </div>

            <div className="form-field">
              <label>Capacity (Seats)</label>
              <input
                type="number"
                name="capacity"
                value={form.capacity}
                min={10}
                max={2000}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row two-cols">
            <div className="form-field">
              <label>Venue / Location *</label>
              <input
                name="venue"
                value={form.venue}
                onChange={handleChange}
                placeholder="e.g. Mechanical Seminar Hall, Block C"
                required
              />
            </div>

            <div className="form-field">
              <label>Registration Fee</label>
              <input
                name="fee"
                value={form.fee}
                onChange={handleChange}
                placeholder="Free or ₹50"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field full">
              <label>Event Description *</label>
              <textarea
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
                placeholder="Describe key activities, speakers, agenda, and why students should attend..."
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field full">
              <label>Tags (Comma separated)</label>
              <input
                name="tagsInput"
                value={form.tagsInput}
                onChange={handleChange}
                placeholder="e.g. Artificial Intelligence, Hands-on, Cash Prizes"
              />
            </div>
          </div>

          <div className="modal-actions-bar">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary-gradient">
              Publish Event Now →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
