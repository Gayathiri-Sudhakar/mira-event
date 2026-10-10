# 🎓 Mira Events — Campus Event & Club Hub

> **A full-stack, interview-grade Campus Event Management & Digital Ticketing Platform built with React 19, Node.js/Express, and MySQL.**

[![React 19](https://img.shields.io/badge/React-19.2.8-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.4%2F9.0-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🌟 Overview

**Mira Events** solves the fragmentation of college campus life by providing a single, unified digital platform for **Students** and **Club Organizers**. 

Students can discover technical symposiums, hackathons, culturals, and workshops, reserve spots with **1-click RSVPs**, generate **real scannable digital passes (with smartphone-scannable QR verification)**, and publish authentic peer reviews. Club organizers get a dedicated command center with real-time capacity tracking, attendance analytics, and event publishing tools.

---

## 🚀 Key Highlights & Showstopper Features

- **⚡ 1-Click Role Switcher & Demo Login:** Toggle seamlessly between Student and Organizer perspectives directly from the navigation bar. Pre-filled demo profiles enable zero-friction presentation during interviews.
- **📱 Real Scannable Digital Passes (Boarding Pass Modal):** Generates a realistic campus pass with verified attendee status, gate entry info, and a **dynamic SVG QR code (via `qrcode.react`)** that can be scanned by any smartphone camera to view verified entry payload data.
- **⭐ Interactive Ratings & Feedback Engine:** Features aggregate star ratings, visual distribution bar charts (5★ down to 1★), sentiment tag chips (*"Hands-on"*, *"Inspiring Speakers"*), and upvotable student review items. Organizers have read-only audit access.
- **📊 Organizer Studio & Analytics:** Real-time metrics tracking total events hosted, student RSVPs collected, and average feedback ratings, plus an event creation wizard with capacity constraints and date validation.
- **🔍 Instant Search & Category Filtering:** Real-time search across event titles, venues, and hosting clubs, coupled with category pills (*Symposium*, *Culturals*, *Technical Events*, *Workshops*, *Sports*).
- **🐬 Full MySQL Integration with Local & Cloud Database Support:** Backed by an Express REST API with connection pooling (`mysql2/promise`), auto-database provisioning, table creation DDL, seed queries, and SSL support for cloud providers (Aiven, PlanetScale, DigitalOcean).

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph Client ["Frontend (React 19 + Vite)"]
        UI["UI Pages & Modals"]
        Comp["Components (Navbar, EventCard, TicketModal, Feedback)"]
        APIService["API Service Layer (src/services/api.js)"]
        LocalStorage["LocalStorage (Offline Fallback & Cache)"]
    end

    subgraph Backend ["Backend API (Node.js + Express)"]
        Router["Express REST Routes (/api/*)"]
        DBPool["MySQL Connection Pool (mysql2/promise)"]
    end

    subgraph Database ["Database Layer (MySQL)"]
        Users["users Table"]
        Events["events Table"]
        Regs["registrations Table"]
        Reviews["reviews Table"]
        Bookmarks["bookmarks Table"]
    end

    UI --> Comp
    Comp --> APIService
    APIService -->|HTTP / JSON| Router
    APIService -.->|Fallback| LocalStorage
    Router --> DBPool
    DBPool --> Users
    DBPool --> Events
    DBPool --> Regs
    DBPool --> Reviews
    DBPool --> Bookmarks
```

---

## 🛠️ Tech Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite, JavaScript (ESM) | Modern component architecture, zero ESLint errors |
| **Icons & UI** | Lucide React, Plus Jakarta Sans, CSS3 | Custom design system with glassmorphism & gradients |
| **QR Engine** | `qrcode.react` | Real SVG-based scannable QR verification code |
| **Backend API** | Node.js, Express.js | REST API with modular routes and CORS handling |
| **Database** | MySQL (Local or Cloud Managed) | Connection pool (`mysql2/promise`), auto DDL migration |
| **Environment** | `dotenv` | Support for local credentials or Cloud Service URI (`mysql://...`) |

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- **Node.js** >= 18.x
- **MySQL** server running locally (or a free cloud database URI from Aiven / PlanetScale)

### 2. Installation
Clone the repository and install all dependencies:
```bash
git clone https://github.com/Gayathiri-Sudhakar/mira-event.git
cd mira-event
npm install
```

### 3. Database Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Configure your MySQL connection in `.env`:
```env
PORT=5001

# Option A: Local MySQL
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=mira_events
DB_SSL_MODE=DISABLED

# Option B: Cloud MySQL (Aiven, PlanetScale, Railway)
# SERVICE_URI=mysql://user:password@host:port/dbname?ssl-mode=REQUIRED
```

### 4. Running the Application

You can start both the **Frontend** and **Backend** concurrently with a single command:
```bash
npm run dev:all
```

Or start them in separate terminals:
```bash
# Terminal 1: Backend Express + MySQL API (Port 5001)
npm run server

# Terminal 2: Vite React Frontend (Port 5173)
npm run dev
```

Open your browser at **[http://localhost:5173/](http://localhost:5173/)**.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Check server and MySQL connection health |
| `GET` | `/api/events` | Retrieve all campus events with registered counts |
| `POST` | `/api/events` | Create and publish a new event (Organizer) |
| `DELETE` | `/api/events/:id` | Delete an event |
| `GET` | `/api/reviews` | Retrieve all verified student reviews |
| `POST` | `/api/reviews` | Submit or update a rating and review |
| `GET` | `/api/registrations/:email` | Get all registered event IDs for a student |
| `POST` | `/api/registrations` | RSVP for an event and reserve a spot |
| `DELETE` | `/api/registrations/:eventId/:email` | Cancel registration |
| `GET` | `/api/bookmarks/:email` | Retrieve student's saved event IDs |
| `POST` | `/api/bookmarks/toggle` | Toggle event bookmark on/off |

---

## 📱 Real QR Code Scanning Demo

When registering for any event (e.g. *AI & Innovation Symposium*), a digital pass modal pops up containing a **live QR Code**:
1. Open your smartphone camera or any QR scanner app.
2. Point your camera at the QR code on your screen.
3. The scanner will instantly decode the verified entry pass:
```json
{
  "issuer": "Mira Events Campus Hub",
  "passId": "MIRA-1-39281",
  "eventTitle": "AI & Innovation Symposium 2026",
  "attendeeName": "Ananya Iyer",
  "entryStatus": "VERIFIED_VALID"
}
```

---

## 📚 Additional Documentation

- 🏛️ [**ARCHITECTURE.md**](file:///Users/dhanushamsanathan/Documents/GitHub/mira-event/ARCHITECTURE.md) — Comprehensive architecture, ERD, and component hierarchy.
- 🎤 [**INTERVIEW_GUIDE.md**](file:///Users/dhanushamsanathan/Documents/GitHub/mira-event/INTERVIEW_GUIDE.md) — Elevator pitch, demo script, and interview questions.

---

## 📄 License
This project is open-source under the MIT License.
