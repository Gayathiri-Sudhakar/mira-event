# 🎤 Hackathon & Interview Presentation Guide — Mira Events

This guide provides a structured script, talking points, and technical answers to help you present **Mira Events** confidently during interviews and hackathon evaluations.

---

## 1. The Elevator Pitch

### ⚡ 30-Second Version:
> *"Mira Events is an end-to-end campus event and club hub built with React 19, Express, and MySQL. It solves fragmented college communication by letting students discover events, RSVP with 1-click, and generate real, smartphone-scannable digital entry passes with QR codes. Meanwhile, club organizers get a dedicated analytics dashboard to manage attendance, track capacity in real time, and monitor student feedback."*

### 🎙️ 2-Minute Version:
> *"In most universities, events are announced across scattered WhatsApp groups, posters, and emails. Students miss key deadlines, paper passes get lost, and organizers have zero data on attendance or feedback.*
>
> *I built Mira Events to solve this with a clean, responsive web application backed by a relational MySQL database. Students can filter events by category, search by club or venue, and instantly reserve a spot. When they register, the app generates a digital boarding pass with a dynamic SVG QR code that any smartphone camera can scan on the spot for verification.*
> 
> *For clubs, there’s an Organizer Studio that tracks registration thresholds, prevents overbooking, and collects verified peer reviews with star ratings and sentiment tags. The app is fully modular, uses parameterized queries for SQL security, and features a dual-role demo switcher so evaluators can test both perspectives immediately."*

---

## 2. Step-by-Step Live Demo Script

Follow this 5-minute walkthrough to showcase the platform's core capabilities:

### Step 1: Landing Page & Quick Role Switcher (60s)
1. Open `http://localhost:5173/`.
2. Point out the **clean campus design system**: Glassmorphic sticky navbar, gradient badges, and live platform statistics (`20+ Active Events`, `1,850+ Students`, `4.9 ★`).
3. Click the **"1-Click Demo Login"** button or toggle the **Role Switcher** in the navbar between **Student** and **Organizer**.
   - *Talking point:* *"I built a dedicated role toggle into the navbar so anyone reviewing the project can switch context instantly without filling out test forms."*

### Step 2: Event Discovery & Search (60s)
1. Click **"Discover Events"**.
2. Type `AI` or `Auditorium` into the live search input — notice the real-time debounced filtering.
3. Click through the category pills (*Symposium*, *Culturals*, *Workshops*) — point out the live event counter badges.
4. Show the capacity progress bar on an event card (e.g. `168/200 spots filled - Almost Full`).

### Step 3: The Showstopper — 1-Click RSVP & Real QR Code Scan (90s)
1. Find an upcoming event (e.g. *AI & Innovation Symposium 2026*).
2. Click **"RSVP Free"**.
3. The **Digital Campus Pass (Boarding Pass)** modal appears:
   - Point out the attendee name, college email, date, time, venue, and unique Pass ID.
   - **Showstopper Action:** Take your mobile phone, open the Camera app or a QR scanner, and scan the QR code on your computer screen.
   - It instantly displays the verified pass payload:
     `{"issuer": "Mira Events", "passId": "MIRA-1-39281", "entryStatus": "VERIFIED_VALID"}`.
   - Click **"Add to Google Calendar"** or **"Copy Payload"**.
   - *Talking point:* *"Instead of a fake graphic, this generates a real, standards-compliant SVG QR code containing verified JSON security payload data for physical gate check-in."*

### Step 4: Event Feedback & Ratings (45s)
1. Click **"Details & Reviews"** on a past or current event.
2. Scroll to the **Student Ratings & Reviews** section:
   - Point out the **average rating breakdown** and the **distribution bar charts** (5★ to 1★).
   - Demonstrate the interactive star rating selector and click sentiment chips (*"Hands-on Practical"*, *"Great Networking"*).
   - Submit a review and show the instant optimistic UI update.

### Step 5: Organizer Command Center & MySQL (45s)
1. Switch to **Organizer** mode from the navbar.
2. Click **"Organizer Studio"** in the navigation bar:
   - Highlight the analytics cards: *Events Hosted*, *Total Student RSVPs*, and *Avg Feedback Score*.
   - Click **"+ Host New Event"**, enter a test event name, pick a category, and click **"Publish Event Now"**.
   - The event is immediately inserted into the MySQL database and appears in the feed.

---

## 3. Anticipated Interview Questions & Strong Answers

### Q1: "Why did you choose a relational database (MySQL) instead of NoSQL (MongoDB)?"
> **Answer:** *"Campus event ticketing is inherently relational with strict consistency requirements. An event has a capacity limit, registrations belong to both an event and a user, and a student should have exactly one review per event. MySQL's foreign key constraints (`ON DELETE CASCADE`), unique keys (`UNIQUE KEY (event_id, student_email)`), and atomic transactions prevent orphaned registrations and duplicate reviews much more reliably than eventual-consistency NoSQL document stores."*

### Q2: "How did you implement the real QR code generation?"
> **Answer:** *"I integrated `qrcode.react` using standard Reed-Solomon error correction (`level='M'`). When a student registers, the client constructs a structured security payload containing the Pass ID, event ID, attendee email, and gate status, rendering it as a crisp, scalable SVG. Because it's an SVG, it scales cleanly for printing or mobile screens without raster pixelation."*

### Q3: "How do you prevent overbooking when spots are limited?"
> **Answer:** *"In our Express API, the registration endpoint checks current capacity against `registered_count`. In the database schema, `registered_count` is updated atomically (`UPDATE events SET registered_count = registered_count + 1 WHERE id = ? AND registered_count < capacity`). For high-concurrency environments, this can be wrapped in a MySQL transaction with a row-level lock (`SELECT ... FOR UPDATE`)."*

### Q4: "How does the frontend handle backend or database offline scenarios?"
> **Answer:** *"The frontend API layer in `src/services/api.js` has a graceful degradation strategy. It first attempts to query the Express MySQL API. If the server is offline or unreachable, it falls back seamlessly to `localStorage` caching with seed data so the user experience never breaks during an offline interview demo."*

### Q5: "What would you add next if you had 2 more weeks?"
> **Answer:**
> 1. *"A real QR scanner gatekeeper view using the device webcam (`html5-qrcode`) so club volunteers can check in attendees at the auditorium door."*
> 2. *"JWT-based authentication with college Single Sign-On (SSO / OAuth2 via Google Workspace)."*
> 3. *"Automated email delivery of `.ics` calendar invites and PDF passes via Nodemailer / SendGrid."*
