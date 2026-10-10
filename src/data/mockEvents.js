export const initialEvents = [
  {
    id: 1,
    title: "AI & Innovation Symposium 2026",
    category: "Symposium",
    date: "2026-11-15",
    time: "10:00 AM - 4:30 PM",
    venue: "Main Auditorium, Academic Block 1",
    organizer: "Mira AI & Robotics Club",
    department: "Computer Science & Engineering",
    capacity: 200,
    registeredCount: 168,
    fee: "Free",
    description: "Explore artificial intelligence breakthroughs, generative agent workflows, robotics prototypes, and emerging tech. Features keynote speeches by industry leaders and startup founders.",
    highlights: ["Keynote from Google & DeepMind speakers", "Live Robotics Demo", "Networking Lunch", "Certificate of Participation"],
    tags: ["Artificial Intelligence", "Robotics", "Startups", "Networking"]
  },
  {
    id: 2,
    title: "Campus Cultural Fiesta: 'Dhwani 2026'",
    category: "Culturals",
    date: "2026-11-22",
    time: "09:30 AM - 8:00 PM",
    venue: "Open Air Amphitheatre & College Grounds",
    organizer: "Student Cultural Committee",
    department: "Fine Arts & Humanities",
    capacity: 500,
    registeredCount: 432,
    fee: "Free",
    description: "Celebrate music, street dance, battle of bands, theatrical drama, and student arts. Food trucks, photobooths, and an electrifying DJ night to conclude.",
    highlights: ["Battle of the Bands", "Inter-College Dance Battle", "Art Showcase", "Celebrity DJ Night"],
    tags: ["Music", "Dance", "Drama", "Food & Fest"]
  },
  {
    id: 3,
    title: "HackSprint: 24-Hour Campus Hackathon",
    category: "Technical Events",
    date: "2026-11-28",
    time: "09:00 AM (24 Hours)",
    venue: "Innovation & Incubation Center, Lab 3",
    organizer: "Mira Developers Community (MDC)",
    department: "Information Technology",
    capacity: 120,
    registeredCount: 110,
    fee: "Free",
    description: "Build rapid prototypes solving real-world challenges across Web3, AI Healthcare, Smart Campus, and Clean Energy. ₹50,000 prize pool and investor mentorship.",
    highlights: ["₹50,000 Prize Pool", "Free Meals & Midnight Energy Drinks", "Direct Internship Interviews", "Mentorship from Senior Engineers"],
    tags: ["Hackathon", "Coding", "Prizes", "Mentorship"]
  },
  {
    id: 4,
    title: "Hands-on Full-Stack Web Development Workshop",
    category: "Workshops",
    date: "2026-09-20",
    time: "02:00 PM - 06:00 PM",
    venue: "Computer Center Lab 4",
    organizer: "Web & Open Source Society",
    department: "Computer Applications",
    capacity: 80,
    registeredCount: 80,
    fee: "Free",
    description: "Deep dive into modern web technologies: React 19, TypeScript, Tailwind, and serverless backend architecture. Every participant builds a portfolio-ready SaaS application.",
    highlights: ["Hands-on Coding Session", "Starter Kits Provided", "1-on-1 Code Reviews", "Digital Badge"],
    tags: ["React", "JavaScript", "Full-Stack", "Hands-on"]
  },
  {
    id: 5,
    title: "Annual Inter-College Esports Arena",
    category: "Sports",
    date: "2026-12-02",
    time: "11:00 AM - 07:00 PM",
    venue: "Student Recreation Center",
    organizer: "Mira Gaming Guild",
    department: "Athletics & Recreation",
    capacity: 150,
    registeredCount: 95,
    fee: "₹100 / Team",
    description: "Compete in Valorant, Rocket League, and FIFA 26 for college championship glory, custom trophies, and gaming accessories sponsored by top tech brands.",
    highlights: ["Live Streamed with Shoutcasters", "Pro Gaming Setup Provided", "Championship Trophy", "Merch Giveaways"],
    tags: ["Gaming", "Valorant", "Esports", "Tournament"]
  },
  {
    id: 6,
    title: "National Tech Project Expo & Poster Gala",
    category: "Technical Events",
    date: "2026-12-05",
    time: "10:30 AM - 04:30 PM",
    venue: "Central Seminar Complex",
    organizer: "Research & Development Cell",
    department: "Multidisciplinary",
    capacity: 250,
    registeredCount: 175,
    fee: "Free",
    description: "Undergraduate and postgraduate students display innovative final-year engineering projects, patent-pending inventions, and research posters.",
    highlights: ["Judged by IEEE Fellows", "Best Innovation Award", "Incubation Grants", "Press Coverage"],
    tags: ["Research", "Innovation", "Patents", "Exhibition"]
  }
];

export const initialReviews = [
  {
    eventId: 4,
    studentName: "Aditi Sharma",
    studentEmail: "aditi.s@college.edu",
    department: "Computer Science",
    rating: 5,
    comment: "Incredible hands-on workshop! The instructors were patient and the codebase examples were crystal clear. Built my first React 19 project in one afternoon.",
    tags: ["Hands-on", "Great Mentors", "Practical"],
    updatedAt: "2026-09-21T18:30:00Z"
  },
  {
    eventId: 4,
    studentName: "Karthik Raja",
    studentEmail: "karthik.r@college.edu",
    department: "Information Technology",
    rating: 4,
    comment: "Very informative and fast-paced. Would have loved an extra hour for debugging sessions, but overall one of the best technical workshops on campus.",
    tags: ["Fast-paced", "Practical"],
    updatedAt: "2026-09-22T10:15:00Z"
  },
  {
    eventId: 1,
    studentName: "Sneha Patel",
    studentEmail: "sneha.p@college.edu",
    department: "AI & Data Science",
    rating: 5,
    comment: "The keynote speaker lineup was phenomenal. Really excited about the upcoming projects showcased by the robotics club!",
    tags: ["Inspiring Speakers", "Networking"],
    updatedAt: "2026-10-01T12:00:00Z"
  }
];

export const eventCategories = [
  "All",
  "Symposium",
  "Culturals",
  "Technical Events",
  "Workshops",
  "Sports",
  "Others"
];
