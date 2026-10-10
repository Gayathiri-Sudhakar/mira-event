const API_BASE = "http://localhost:5001/api";

// Helper to check if backend is reachable
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, { method: "GET" });
    if (!res.ok) return { online: false };
    return await res.json();
  } catch {
    return { online: false };
  }
}

// 1. Events
export async function fetchEventsFromApi() {
  try {
    const res = await fetch(`${API_BASE}/events`);
    if (!res.ok) throw new Error("Failed to fetch events");
    return await res.json();
  } catch (err) {
    console.warn("[API] Falling back to local storage for events:", err.message);
    return null;
  }
}

export async function createEventApi(eventData) {
  try {
    const res = await fetch(`${API_BASE}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData)
    });
    if (!res.ok) throw new Error("Failed to create event");
    return await res.json();
  } catch (err) {
    console.warn("[API] Create event offline fallback:", err.message);
    return null;
  }
}

export async function deleteEventApi(eventId) {
  try {
    const res = await fetch(`${API_BASE}/events/${eventId}`, {
      method: "DELETE"
    });
    return res.ok;
  } catch {
    return false;
  }
}

// 2. Reviews
export async function fetchReviewsFromApi() {
  try {
    const res = await fetch(`${API_BASE}/reviews`);
    if (!res.ok) throw new Error("Failed to fetch reviews");
    return await res.json();
  } catch (err) {
    console.warn("[API] Falling back to local reviews:", err.message);
    return null;
  }
}

export async function submitReviewApi(reviewData) {
  try {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewData)
    });
    if (!res.ok) throw new Error("Failed to submit review");
    return await res.json();
  } catch (err) {
    console.warn("[API] Review submit offline fallback:", err.message);
    return null;
  }
}

// 3. Registrations (RSVP)
export async function fetchUserRegistrationsApi(email) {
  try {
    const res = await fetch(`${API_BASE}/registrations/${encodeURIComponent(email)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.eventIds;
  } catch {
    return null;
  }
}

export async function registerForEventApi(eventId, userEmail, ticketCode) {
  try {
    const res = await fetch(`${API_BASE}/registrations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, userEmail, ticketCode })
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function cancelRegistrationApi(eventId, userEmail) {
  try {
    const res = await fetch(
      `${API_BASE}/registrations/${eventId}/${encodeURIComponent(userEmail)}`,
      { method: "DELETE" }
    );
    return res.ok;
  } catch {
    return false;
  }
}

// 4. Bookmarks
export async function fetchBookmarksApi(email) {
  try {
    const res = await fetch(`${API_BASE}/bookmarks/${encodeURIComponent(email)}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function toggleBookmarkApi(eventId, userEmail) {
  try {
    const res = await fetch(`${API_BASE}/bookmarks/toggle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, userEmail })
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
