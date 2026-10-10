import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

let pool = null;
let isConnected = false;

function buildDbConfig() {
  const serviceUri = process.env.MYSQL_URI || process.env.DATABASE_URL || process.env.SERVICE_URI;

  if (serviceUri) {
    try {
      const parsedUrl = new URL(serviceUri);
      return {
        host: parsedUrl.hostname,
        port: Number(parsedUrl.port) || 3306,
        user: decodeURIComponent(parsedUrl.username),
        password: decodeURIComponent(parsedUrl.password),
        database: parsedUrl.pathname.replace(/^\//, "") || "defaultdb",
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        ssl: { rejectUnauthorized: false }
      };
    } catch (err) {
      console.warn("[MySQL] URL parse warning:", err.message);
      return {
        uri: serviceUri,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        ssl: { rejectUnauthorized: false }
      };
    }
  }

  const sslMode = process.env.DB_SSL_MODE;
  const isSslRequired = sslMode && sslMode.toUpperCase() !== "DISABLED";

  return {
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "mira_events",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: isSslRequired ? { rejectUnauthorized: false } : undefined
  };
}

export async function initDatabase() {
  const config = buildDbConfig();

  try {
    if (config.uri) {
      pool = mysql.createPool(config.uri);
    } else {
      // Direct pool creation
      pool = mysql.createPool(config);
    }

    // Verify connection
    const testConn = await pool.getConnection();
    testConn.release();
    isConnected = true;
    console.log(`[MySQL] Successfully connected to database! Host: ${config.host || "via URI"}`);

    // Create tables & Seed
    await createTables();
    await seedInitialData();

    return true;
  } catch (error) {
    console.error(`[MySQL] Connection failed:`, error.message);
    isConnected = false;
    return false;
  }
}

async function createTables() {
  if (!pool) return;

  const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      full_name VARCHAR(255) NOT NULL,
      role ENUM('student', 'organizer') DEFAULT 'student',
      department VARCHAR(255) DEFAULT NULL,
      club VARCHAR(255) DEFAULT NULL,
      year VARCHAR(10) DEFAULT '1',
      phone VARCHAR(50) DEFAULT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `;

  const eventsTable = `
    CREATE TABLE IF NOT EXISTS events (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      date DATE NOT NULL,
      time VARCHAR(100) NOT NULL,
      venue VARCHAR(255) NOT NULL,
      organizer VARCHAR(255) NOT NULL,
      department VARCHAR(255) DEFAULT NULL,
      capacity INT DEFAULT 100,
      registered_count INT DEFAULT 0,
      fee VARCHAR(50) DEFAULT 'Free',
      description TEXT NOT NULL,
      tags JSON DEFAULT NULL,
      highlights JSON DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `;

  const registrationsTable = `
    CREATE TABLE IF NOT EXISTS registrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      event_id INT NOT NULL,
      user_email VARCHAR(255) NOT NULL,
      ticket_code VARCHAR(100) NOT NULL UNIQUE,
      registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
      INDEX idx_user_email (user_email),
      INDEX idx_event (event_id)
    ) ENGINE=InnoDB;
  `;

  const reviewsTable = `
    CREATE TABLE IF NOT EXISTS reviews (
      id INT AUTO_INCREMENT PRIMARY KEY,
      event_id INT NOT NULL,
      student_name VARCHAR(255) NOT NULL,
      student_email VARCHAR(255) NOT NULL,
      department VARCHAR(255) DEFAULT NULL,
      rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
      comment TEXT NOT NULL,
      tags JSON DEFAULT NULL,
      helpful_votes INT DEFAULT 0,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
      UNIQUE KEY unique_student_event_review (event_id, student_email)
    ) ENGINE=InnoDB;
  `;

  const bookmarksTable = `
    CREATE TABLE IF NOT EXISTS bookmarks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      event_id INT NOT NULL,
      user_email VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
      UNIQUE KEY unique_user_event_bookmark (event_id, user_email)
    ) ENGINE=InnoDB;
  `;

  await pool.query(usersTable);
  await pool.query(eventsTable);
  await pool.query(registrationsTable);
  await pool.query(reviewsTable);
  await pool.query(bookmarksTable);

  console.log("[MySQL] Schema verified: all tables ready.");
}

async function seedInitialData() {
  if (!pool) return;

  const [rows] = await pool.query("SELECT COUNT(*) as count FROM events;");
  if (rows[0].count > 0) {
    return;
  }

  console.log("[MySQL] Seeding initial campus events and reviews into MySQL...");

  await pool.query(`
    INSERT IGNORE INTO users (id, email, full_name, role, department, club, year, password) VALUES
    (1, 'ananya.iyer@miracollege.edu', 'Ananya Iyer', 'student', 'AI & Data Science', NULL, '3', 'password123'),
    (2, 'robotics.lead@miracollege.edu', 'Rahul Varma (Club Lead)', 'organizer', 'Computer Science', 'Mira Robotics & AI Club', '4', 'password123');
  `);

  const seedEvents = [
    [
      1,
      "AI & Innovation Symposium 2026",
      "Symposium",
      "2026-11-15",
      "10:00 AM - 4:30 PM",
      "Main Auditorium, Academic Block 1",
      "Mira AI & Robotics Club",
      "Computer Science & Engineering",
      200,
      168,
      "Free",
      "Explore artificial intelligence breakthroughs, generative agent workflows, robotics prototypes, and emerging tech. Features keynote speeches by industry leaders and startup founders.",
      JSON.stringify(["Artificial Intelligence", "Robotics", "Startups", "Networking"]),
      JSON.stringify(["Keynote from Google & DeepMind speakers", "Live Robotics Demo", "Networking Lunch", "Certificate of Participation"])
    ],
    [
      2,
      "Campus Cultural Fiesta: 'Dhwani 2026'",
      "Culturals",
      "2026-11-22",
      "09:30 AM - 8:00 PM",
      "Open Air Amphitheatre & College Grounds",
      "Student Cultural Committee",
      "Fine Arts & Humanities",
      500,
      432,
      "Free",
      "Celebrate music, street dance, battle of bands, theatrical drama, and student arts. Food trucks, photobooths, and an electrifying DJ night to conclude.",
      JSON.stringify(["Music", "Dance", "Drama", "Food & Fest"]),
      JSON.stringify(["Battle of the Bands", "Inter-College Dance Battle", "Art Showcase", "Celebrity DJ Night"])
    ],
    [
      3,
      "HackSprint: 24-Hour Campus Hackathon",
      "Technical Events",
      "2026-11-28",
      "09:00 AM (24 Hours)",
      "Innovation & Incubation Center, Lab 3",
      "Mira Developers Community (MDC)",
      "Information Technology",
      120,
      110,
      "Free",
      "Build rapid prototypes solving real-world challenges across Web3, AI Healthcare, Smart Campus, and Clean Energy. ₹50,000 prize pool and investor mentorship.",
      JSON.stringify(["Hackathon", "Coding", "Prizes", "Mentorship"]),
      JSON.stringify(["₹50,000 Prize Pool", "Free Meals & Midnight Energy Drinks", "Direct Internship Interviews", "Mentorship from Senior Engineers"])
    ],
    [
      4,
      "Hands-on Full-Stack Web Development Workshop",
      "Workshops",
      "2026-09-20",
      "02:00 PM - 06:00 PM",
      "Computer Center Lab 4",
      "Web & Open Source Society",
      "Computer Applications",
      80,
      80,
      "Free",
      "Deep dive into modern web technologies: React 19, TypeScript, Tailwind, and serverless backend architecture. Every participant builds a portfolio-ready SaaS application.",
      JSON.stringify(["React", "JavaScript", "Full-Stack", "Hands-on"]),
      JSON.stringify(["Hands-on Coding Session", "Starter Kits Provided", "1-on-1 Code Reviews", "Digital Badge"])
    ],
    [
      5,
      "Annual Inter-College Esports Arena",
      "Sports",
      "2026-12-02",
      "11:00 AM - 07:00 PM",
      "Student Recreation Center",
      "Mira Gaming Guild",
      "Athletics & Recreation",
      150,
      95,
      "₹100 / Team",
      "Compete in Valorant, Rocket League, and FIFA 26 for college championship glory, custom trophies, and gaming accessories sponsored by top tech brands.",
      JSON.stringify(["Gaming", "Valorant", "Esports", "Tournament"]),
      JSON.stringify(["Live Streamed with Shoutcasters", "Pro Gaming Setup Provided", "Championship Trophy", "Merch Giveaways"])
    ],
    [
      6,
      "National Tech Project Expo & Poster Gala",
      "Technical Events",
      "2026-12-05",
      "10:30 AM - 04:30 PM",
      "Central Seminar Complex",
      "Research & Development Cell",
      "Multidisciplinary",
      250,
      175,
      "Free",
      "Undergraduate and postgraduate students display innovative final-year engineering projects, patent-pending inventions, and research posters.",
      JSON.stringify(["Research", "Innovation", "Patents", "Exhibition"]),
      JSON.stringify(["Judged by IEEE Fellows", "Best Innovation Award", "Incubation Grants", "Press Coverage"])
    ]
  ];

  for (const evt of seedEvents) {
    await pool.query(
      `INSERT INTO events (id, title, category, date, time, venue, organizer, department, capacity, registered_count, fee, description, tags, highlights)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE title=VALUES(title);`,
      evt
    );
  }

  await pool.query(`
    INSERT IGNORE INTO registrations (event_id, user_email, ticket_code) VALUES
    (1, 'ananya.iyer@miracollege.edu', 'MIRA-1-39281');
  `);

  await pool.query(`
    INSERT IGNORE INTO bookmarks (event_id, user_email) VALUES
    (2, 'ananya.iyer@miracollege.edu');
  `);

  await pool.query(`
    INSERT IGNORE INTO reviews (event_id, student_name, student_email, department, rating, comment, tags) VALUES
    (4, 'Aditi Sharma', 'aditi.s@college.edu', 'Computer Science', 5, 'Incredible hands-on workshop! The instructors were patient and the codebase examples were crystal clear. Built my first React 19 project in one afternoon.', '["Hands-on", "Great Mentors", "Practical"]'),
    (4, 'Karthik Raja', 'karthik.r@college.edu', 'Information Technology', 4, 'Very informative and fast-paced. Would have loved an extra hour for debugging sessions, but overall one of the best technical workshops on campus.', '["Fast-paced", "Practical"]'),
    (1, 'Sneha Patel', 'sneha.p@college.edu', 'AI & Data Science', 5, 'The keynote speaker lineup was phenomenal. Really excited about the upcoming projects showcased by the robotics club!', '["Inspiring Speakers", "Networking"]');
  `);

  console.log("[MySQL] Seed data successfully populated.");
}

export function getPool() {
  return pool;
}

export function isDbConnected() {
  return isConnected;
}
