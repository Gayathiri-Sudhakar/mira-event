import { useState } from "react";
import {
  X,
  Calendar,
  CheckCircle2,
  Download,
  Sparkles,
  QrCode,
  Copy,
  Check
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { formatEventDate } from "../utils/eventHelpers";

export function TicketModal({ event, attendee, onClose, onCancelRsvp }) {
  const [copied, setCopied] = useState(false);

  if (!event || !attendee) return null;

  const ticketId = `MIRA-${event.id}-${Math.abs(
    (attendee.email || "guest").split("").reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)
  ).toString().slice(0, 5)}`;

  // Real dummy message payload encoded inside the QR code
  const dummyQrPayload = JSON.stringify(
    {
      issuer: "Mira Events Campus Hub",
      passId: ticketId,
      eventId: event.id,
      eventTitle: event.title,
      category: event.category,
      date: formatEventDate(event.date),
      time: event.time,
      venue: event.venue,
      attendeeName: attendee.fullName || "Student Attendee",
      attendeeEmail: attendee.email,
      entryStatus: "VERIFIED_VALID",
      securityHash: `CHK-${ticketId}-${event.id}992`
    },
    null,
    2
  );

  function handlePrint() {
    window.print();
  }

  function handleAddToCalendar() {
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(event.description);
    const location = encodeURIComponent(event.venue);
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(gCalUrl, "_blank");
  }

  function handleCopyPayload() {
    navigator.clipboard.writeText(dummyQrPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="ticket-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        <div className="ticket-header-pill">
          <Sparkles size={14} className="sparkle-gold" />
          <span>OFFICIAL CAMPUS EVENT PASS</span>
        </div>

        {/* Digital Ticket Card */}
        <div className="digital-ticket-card">
          {/* Ticket Header */}
          <div className="ticket-top-section">
            <div className="ticket-college-brand">
              <span className="brand-dot"></span>
              <strong>MIRA EVENTS</strong>
              <span className="bullet-sep">•</span>
              <span>VERIFIED ACCESS</span>
            </div>
            <span className="pass-status-pill">
              <CheckCircle2 size={13} />
              CONFIRMED
            </span>
          </div>

          {/* Event Main Info */}
          <div className="ticket-main-section">
            <span className="ticket-category-tag">{event.category}</span>
            <h2 className="ticket-event-title">{event.title}</h2>
            <p className="ticket-organizer-name">Organized by {event.organizer || "Mira College"}</p>

            <div className="ticket-meta-grid">
              <div className="ticket-meta-block">
                <span className="label">DATE</span>
                <span className="val">{formatEventDate(event.date)}</span>
              </div>
              <div className="ticket-meta-block">
                <span className="label">TIME</span>
                <span className="val">{event.time}</span>
              </div>
              <div className="ticket-meta-block full">
                <span className="label">VENUE / LOCATION</span>
                <span className="val">{event.venue}</span>
              </div>
            </div>
          </div>

          {/* Perforated Divider */}
          <div className="ticket-perforation">
            <div className="notch notch-left"></div>
            <div className="perforated-line"></div>
            <div className="notch notch-right"></div>
          </div>

          {/* Ticket Bottom Section (Attendee & Real QR Code) */}
          <div className="ticket-bottom-section">
            <div className="attendee-info">
              <div className="attendee-block">
                <span className="label">ATTENDEE NAME</span>
                <span className="attendee-name">{attendee.fullName || "Student Attendee"}</span>
              </div>
              <div className="attendee-block">
                <span className="label">COLLEGE EMAIL</span>
                <span className="attendee-email">{attendee.email}</span>
              </div>
              <div className="attendee-block">
                <span className="label">PASS ID</span>
                <span className="attendee-id">{ticketId}</span>
              </div>
            </div>

            {/* Real Scannable QR Code */}
            <div className="qr-container">
              <div className="qr-box real-qr" title="Scan with any camera or QR scanner">
                <QRCodeSVG
                  value={dummyQrPayload}
                  size={88}
                  level="M"
                  includeMargin={false}
                  bgColor="#ffffff"
                  fgColor="#0f172a"
                />
              </div>
              <span className="qr-caption">SCAN WITH CAMERA</span>
            </div>
          </div>

          {/* Dummy Message QR Verification Banner */}
          <div className="qr-dummy-msg-banner">
            <div className="qr-dummy-header">
              <div className="qr-dummy-title">
                <QrCode size={13} className="qr-icon-small" />
                <span>QR Verification Data (Scannable Dummy Message)</span>
              </div>
              <button
                type="button"
                className="btn-copy-qr-text"
                onClick={handleCopyPayload}
                title="Copy QR message content"
              >
                {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                <span>{copied ? "Copied" : "Copy Payload"}</span>
              </button>
            </div>
            <div className="qr-payload-preview">
              <code>{`✓ Pass: ${ticketId} • Attendee: ${attendee.fullName || "Student"} (${attendee.email}) • Event: "${event.title}" • Entry: GRANTED`}</code>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="ticket-modal-actions">
          <button className="btn-ticket-action primary" onClick={handleAddToCalendar}>
            <Calendar size={15} />
            <span>Add to Calendar</span>
          </button>

          <button className="btn-ticket-action secondary" onClick={handlePrint}>
            <Download size={15} />
            <span>Save / Print Pass</span>
          </button>

          {onCancelRsvp && (
            <button
              className="btn-cancel-rsvp"
              onClick={() => {
                if (window.confirm("Are you sure you want to cancel your registration?")) {
                  onCancelRsvp(event.id);
                  onClose();
                }
              }}
            >
              Cancel Registration
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
