import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { initDatabase, getPool, isDbConnected } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// 1. Health check & DB connection status
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    database: isDbConnected() ? "connected" : "disconnected",
    timestamp: new Date().toISOString()
  });
});

// Helper to format event rows from DB
function formatEventRow(row) {
  let tags;
  let highlights;

  try {
    tags = typeof row.tags === "string" ? JSON.parse(row.tags) : row.tags || [];
  } catch {
    tags = [];
  }

  try {
    highlights = typeof row.highlights === "string" ? JSON.parse(row.highlights) : row.highlights || [];
  } catch {
    highlights = [];
  }

  return {
    id: row.id,
    title: row.title,
    category: row.category,
    date: typeof row.date === "string" ? row.date.slice(0, 10) : new Date(row.date).toISOString().slice(0, 10),
    time: row.time,
    venue: row.venue,
    organizer: row.organizer,
    department: row.department,
    capacity: row.capacity,
    registeredCount: row.registered_count || 0,
    fee: row.fee,
    description: row.description,
    tags,
    highlights
  };
}

// 2. GET /api/events
app.get("/api/events", async (req, res) => {
  try {
    const pool = getPool();
    if (!pool || !isDbConnected()) {
      return res.status(503).json({ error: "Database not connected" });
    }

    const [rows] = await pool.query(
      "SELECT * FROM events ORDER BY date ASC, id ASC;"
    );

    const formatted = rows.map(formatEventRow);
    res.json(formatted);
  } catch (err) {
    console.error("GET /api/events error:", err);
    res.status(500).json({ error: "Failed to retrieve events" });
  }
});

// 3. POST /api/events (Create Event)
app.post("/api/events", async (req, res) => {
  try {
    const pool = getPool();
    if (!pool || !isDbConnected()) {
      return res.status(503).json({ error: "Database not connected" });
    }

    const {
      title,
      category,
      date,
      time,
      venue,
      organizer,
      department,
      capacity,
      fee,
      description,
      tags,
      highlights
    } = req.body;

    if (!title || !category || !date || !venue) {
      return res.status(400).json({ error: "Missing required event fields" });
    }

    const [result] = await pool.query(
      `INSERT INTO events (title, category, date, time, venue, organizer, department, capacity, registered_count, fee, description, tags, highlights)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?);`,
      [
        title,
        category,
        date,
        time || "10:00 AM",
        venue,
        organizer || "Mira College Club",
        department || "General",
        Number(capacity) || 100,
        fee || "Free",
        description || "",
        JSON.stringify(tags || []),
        JSON.stringify(highlights || [])
      ]
    );

    const newEvent = {
      id: result.insertId,
      title,
      category,
      date,
      time: time || "10:00 AM",
      venue,
      organizer: organizer || "Mira College Club",
      department: department || "General",
      capacity: Number(capacity) || 100,
      registeredCount: 0,
      fee: fee || "Free",
      description: description || "",
      tags: tags || [],
      highlights: highlights || []
    };

    res.status(201).json(newEvent);
  } catch (err) {
    console.error("POST /api/events error:", err);
    res.status(500).json({ error: "Failed to create event" });
  }
});

// 4. DELETE /api/events/:id
app.delete("/api/events/:id", async (req, res) => {
  try {
    const pool = getPool();
    if (!pool || !isDbConnected()) {
      return res.status(503).json({ error: "Database not connected" });
    }

    const eventId = Number(req.params.id);
    await pool.query("DELETE FROM events WHERE id = ?;", [eventId]);
    res.json({ success: true, message: "Event deleted" });
  } catch (err) {
    console.error("DELETE /api/events/:id error:", err);
    res.status(500).json({ error: "Failed to delete event" });
  }
});

// 5. GET /api/reviews
app.get("/api/reviews", async (req, res) => {
  try {
    const pool = getPool();
    if (!pool || !isDbConnected()) {
      return res.status(503).json({ error: "Database not connected" });
    }

    const [rows] = await pool.query(
      "SELECT * FROM reviews ORDER BY updated_at DESC;"
    );

    const formatted = rows.map((r) => {
      let tags;
      try {
        tags = typeof r.tags === "string" ? JSON.parse(r.tags) : r.tags || [];
      } catch {
        tags = [];
      }

      return {
        id: r.id,
        eventId: r.event_id,
        studentName: r.student_name,
        studentEmail: r.student_email,
        department: r.department,
        rating: r.rating,
        comment: r.comment,
        tags,
        helpfulVotes: r.helpful_votes || 0,
        updatedAt: r.updated_at
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error("GET /api/reviews error:", err);
    res.status(500).json({ error: "Failed to retrieve reviews" });
  }
});

// 6. POST /api/reviews (Upsert review)
app.post("/api/reviews", async (req, res) => {
  try {
    const pool = getPool();
    if (!pool || !isDbConnected()) {
      return res.status(503).json({ error: "Database not connected" });
    }

    const {
      eventId,
      studentName,
      studentEmail,
      department,
      rating,
      comment,
      tags
    } = req.body;

    if (!eventId || !studentEmail || !rating || !comment) {
      return res.status(400).json({ error: "Missing required review fields" });
    }

    await pool.query(
      `INSERT INTO reviews (event_id, student_name, student_email, department, rating, comment, tags)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         student_name = VALUES(student_name),
         department = VALUES(department),
         rating = VALUES(rating),
         comment = VALUES(comment),
         tags = VALUES(tags),
         updated_at = CURRENT_TIMESTAMP;`,
      [
        Number(eventId),
        studentName || "Student",
        studentEmail.toLowerCase().trim(),
        department || "General",
        Number(rating),
        comment.trim(),
        JSON.stringify(tags || [])
      ]
    );

    res.status(200).json({
      success: true,
      review: {
        eventId: Number(eventId),
        studentName,
        studentEmail: studentEmail.toLowerCase().trim(),
        department,
        rating: Number(rating),
        comment: comment.trim(),
        tags: tags || [],
        updatedAt: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error("POST /api/reviews error:", err);
    res.status(500).json({ error: "Failed to save review" });
  }
});

// 7. GET /api/registrations/:email
app.get("/api/registrations/:email", async (req, res) => {
  try {
    const pool = getPool();
    if (!pool || !isDbConnected()) {
      return res.status(503).json({ error: "Database not connected" });
    }

    const email = req.params.email.toLowerCase().trim();
    const [rows] = await pool.query(
      "SELECT event_id, ticket_code FROM registrations WHERE user_email = ?;",
      [email]
    );

    const eventIds = rows.map((r) => r.event_id);
    res.json({ eventIds, registrations: rows });
  } catch (err) {
    console.error("GET /api/registrations error:", err);
    res.status(500).json({ error: "Failed to retrieve registrations" });
  }
});

// 8. POST /api/registrations (RSVP)
app.post("/api/registrations", async (req, res) => {
  try {
    const pool = getPool();
    if (!pool || !isDbConnected()) {
      return res.status(503).json({ error: "Database not connected" });
    }

    const { eventId, userEmail, ticketCode } = req.body;
    if (!eventId || !userEmail) {
      return res.status(400).json({ error: "Missing eventId or userEmail" });
    }

    const email = userEmail.toLowerCase().trim();
    const code =
      ticketCode ||
      `MIRA-${eventId}-${Math.floor(10000 + Math.random() * 90000)}`;

    // Insert registration
    await pool.query(
      `INSERT IGNORE INTO registrations (event_id, user_email, ticket_code) VALUES (?, ?, ?);`,
      [Number(eventId), email, code]
    );

    // Increment count
    await pool.query(
      `UPDATE events SET registered_count = registered_count + 1 WHERE id = ?;`,
      [Number(eventId)]
    );

    res.status(201).json({ success: true, ticketCode: code });
  } catch (err) {
    console.error("POST /api/registrations error:", err);
    res.status(500).json({ error: "Failed to register" });
  }
});

// 9. DELETE /api/registrations/:eventId/:email (Cancel RSVP)
app.delete("/api/registrations/:eventId/:email", async (req, res) => {
  try {
    const pool = getPool();
    if (!pool || !isDbConnected()) {
      return res.status(503).json({ error: "Database not connected" });
    }

    const eventId = Number(req.params.eventId);
    const email = req.params.email.toLowerCase().trim();

    await pool.query(
      "DELETE FROM registrations WHERE event_id = ? AND user_email = ?;",
      [eventId, email]
    );

    await pool.query(
      "UPDATE events SET registered_count = GREATEST(0, registered_count - 1) WHERE id = ?;",
      [eventId]
    );

    res.json({ success: true, message: "Registration cancelled" });
  } catch (err) {
    console.error("DELETE /api/registrations error:", err);
    res.status(500).json({ error: "Failed to cancel registration" });
  }
});

// 10. GET /api/bookmarks/:email
app.get("/api/bookmarks/:email", async (req, res) => {
  try {
    const pool = getPool();
    if (!pool || !isDbConnected()) {
      return res.status(503).json({ error: "Database not connected" });
    }

    const email = req.params.email.toLowerCase().trim();
    const [rows] = await pool.query(
      "SELECT event_id FROM bookmarks WHERE user_email = ?;",
      [email]
    );

    res.json(rows.map((r) => r.event_id));
  } catch (err) {
    console.error("GET /api/bookmarks error:", err);
    res.status(500).json({ error: "Failed to retrieve bookmarks" });
  }
});

// 11. POST /api/bookmarks/toggle
app.post("/api/bookmarks/toggle", async (req, res) => {
  try {
    const pool = getPool();
    if (!pool || !isDbConnected()) {
      return res.status(503).json({ error: "Database not connected" });
    }

    const { eventId, userEmail } = req.body;
    const email = userEmail.toLowerCase().trim();

    const [existing] = await pool.query(
      "SELECT id FROM bookmarks WHERE event_id = ? AND user_email = ?;",
      [Number(eventId), email]
    );

    let isBookmarked = false;
    if (existing.length > 0) {
      await pool.query("DELETE FROM bookmarks WHERE id = ?;", [existing[0].id]);
      isBookmarked = false;
    } else {
      await pool.query(
        "INSERT INTO bookmarks (event_id, user_email) VALUES (?, ?);",
        [Number(eventId), email]
      );
      isBookmarked = true;
    }

    res.json({ success: true, isBookmarked });
  } catch (err) {
    console.error("POST /api/bookmarks/toggle error:", err);
    res.status(500).json({ error: "Failed to toggle bookmark" });
  }
});

// 12. POST /api/auth/login (Auth / Register)
app.post("/api/auth/login", async (req, res) => {
  try {
    const pool = getPool();
    const { email, fullName, role, department, club, year, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (pool && isDbConnected()) {
      const [existing] = await pool.query(
        "SELECT * FROM users WHERE email = ?;",
        [cleanEmail]
      );

      if (existing.length > 0) {
        const u = existing[0];
        return res.json({
          user: {
            id: u.id,
            email: u.email,
            fullName: u.full_name,
            role: u.role,
            department: u.department,
            club: u.club,
            year: u.year
          }
        });
      }

      // Create new user in DB
      const [insert] = await pool.query(
        `INSERT INTO users (email, full_name, role, department, club, year, password)
         VALUES (?, ?, ?, ?, ?, ?, ?);`,
        [
          cleanEmail,
          fullName || (role === "organizer" ? "Club Organizer" : "Campus Student"),
          role || "student",
          department || null,
          club || null,
          year || "1",
          password || "password123"
        ]
      );

      return res.status(201).json({
        user: {
          id: insert.insertId,
          email: cleanEmail,
          fullName: fullName || (role === "organizer" ? "Club Organizer" : "Campus Student"),
          role: role || "student",
          department,
          club,
          year
        }
      });
    }

    // Fallback if DB is offline
    res.json({
      user: {
        email: cleanEmail,
        fullName: fullName || "Campus User",
        role: role || "student",
        department,
        club,
        year
      }
    });
  } catch (err) {
    console.error("POST /api/auth/login error:", err);
    res.status(500).json({ error: "Auth operation failed" });
  }
});

// Start Server & Connect to MySQL
async function startServer() {
  await initDatabase();

  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`⚡ Mira Events Backend API Server running on port ${PORT}`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🐬 MySQL Status: ${isDbConnected() ? "Connected & Initialized" : "Offline / Connecting..."}`);
    console.log(`======================================================\n`);
  });
}

startServer();
