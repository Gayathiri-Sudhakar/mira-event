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
    image: "/events/event-1.jpg",
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
    image: "/events/event-2.jpg",
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
    image: "/events/event-3.jpg",
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
    image: "/events/event-4.jpg",
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
    image: "/events/event-5.jpg",
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
    image: "/events/event-6.jpg",
    description: "Undergraduate and postgraduate students display innovative final-year engineering projects, patent-pending inventions, and research posters.",
    highlights: ["Judged by IEEE Fellows", "Best Innovation Award", "Incubation Grants", "Press Coverage"],
    tags: ["Research", "Innovation", "Patents", "Exhibition"]
  }
];

export const initialReviews = [
  // Event 1: AI & Innovation Symposium 2026
  {
    eventId: 1,
    studentName: "Sneha Patel",
    studentEmail: "sneha.p@college.edu",
    department: "AI & Data Science",
    rating: 5,
    comment: "The keynote speaker lineup was phenomenal. Really excited about the upcoming projects showcased by the robotics club!",
    tags: ["Inspiring Speakers", "Great Networking"],
    updatedAt: "2026-10-01T12:00:00Z"
  },
  {
    eventId: 1,
    studentName: "Vignesh S",
    studentEmail: "vignesh.s@miracollege.edu",
    department: "ECE",
    rating: 5,
    comment: "Sema session bro! GenAI concepts romba clear-ah explain pannanga. Live robotics demo was pure fire!",
    tags: ["Inspiring Speakers", "Hands-on Practical"],
    updatedAt: "2026-10-02T14:30:00Z"
  },
  {
    eventId: 1,
    studentName: "Priya M",
    studentEmail: "priya.m@miracollege.edu",
    department: "Computer Science",
    rating: 4,
    comment: "Good event overall, especially the startup showcase. Auditorium sound konjam echo aachu, but content was top notch.",
    tags: ["Well Organized", "Great Networking"],
    updatedAt: "2026-10-03T16:10:00Z"
  },
  {
    eventId: 1,
    studentName: "Arun Kumar",
    studentEmail: "arun.k@miracollege.edu",
    department: "AIDS",
    rating: 5,
    comment: "Session slides and GitHub code repos share pannadhu romba helpful-ah irundhuchu. 10/10 experience!",
    tags: ["Well Organized", "Inspiring Speakers"],
    updatedAt: "2026-10-04T10:00:00Z"
  },

  // Event 2: Campus Cultural Fiesta: 'Dhwani 2026'
  {
    eventId: 2,
    studentName: "Harish V",
    studentEmail: "harish.v@miracollege.edu",
    department: "Mechanical",
    rating: 5,
    comment: "Vera level vibe boss! Battle of bands and DJ night absolutely rocking. Campus ground lighting and sound arrangements vera maari irundhuchu!",
    tags: ["Fun & Energetic", "Well Organized"],
    updatedAt: "2026-10-05T20:00:00Z"
  },
  {
    eventId: 2,
    studentName: "Deepa R",
    studentEmail: "deepa.r@miracollege.edu",
    department: "Biomedical",
    rating: 5,
    comment: "Best cultural fest on campus! Food stalls la snacks variety nalla irundhuchu. Western dance crew performance pure goosebumps!",
    tags: ["Fun & Energetic", "Good Refreshments"],
    updatedAt: "2026-10-05T21:15:00Z"
  },
  {
    eventId: 2,
    studentName: "Sanjay Kumar",
    studentEmail: "sanjay.k@miracollege.edu",
    department: "Civil",
    rating: 4,
    comment: "Crowd control was handled nicely by student volunteers. Digital QR pass entry was super fast, zero queue rush!",
    tags: ["Well Organized", "Fun & Energetic"],
    updatedAt: "2026-10-06T09:30:00Z"
  },
  {
    eventId: 2,
    studentName: "Kaviya N",
    studentEmail: "kaviya.n@miracollege.edu",
    department: "IT",
    rating: 5,
    comment: "Street dance battle was thrilling! Friends oda sema enjoyment. Next year 2 days vekkanum nu request pandrom!",
    tags: ["Fun & Energetic"],
    updatedAt: "2026-10-06T11:45:00Z"
  },

  // Event 3: HackSprint: 24-Hour Campus Hackathon
  {
    eventId: 3,
    studentName: "Ashwin K",
    studentEmail: "ashwin.k@miracollege.edu",
    department: "Computer Science",
    rating: 5,
    comment: "24 hours flew by so fast! Midnight snacks, Red Bull, and senior mentors support vera level. Mentors gave solid architecture feedback for our Web3 prototype.",
    tags: ["Hands-on Practical", "Great Networking"],
    updatedAt: "2026-09-28T18:00:00Z"
  },
  {
    eventId: 3,
    studentName: "Nithya S",
    studentEmail: "nithya.s@miracollege.edu",
    department: "AIDS",
    rating: 5,
    comment: "Problem statements were challenging and practical. Lab Wi-Fi speed sema fast-ah irundhuchu. Learned a ton about rapid product building!",
    tags: ["Hands-on Practical", "Well Organized"],
    updatedAt: "2026-09-29T10:15:00Z"
  },
  {
    eventId: 3,
    studentName: "Gokul R",
    studentEmail: "gokul.r@miracollege.edu",
    department: "ECE",
    rating: 4,
    comment: "Tough competition, but startup investors oda networking romba valuable-ah irundhuchu. Pitching round experience was amazing.",
    tags: ["Great Networking", "Inspiring Speakers"],
    updatedAt: "2026-09-29T13:45:00Z"
  },
  {
    eventId: 3,
    studentName: "Divya M",
    studentEmail: "divya.m@miracollege.edu",
    department: "IT",
    rating: 5,
    comment: "Zero sleep, full coding, pure fun! Coffee and food midnight la regular-ah arrange pannanga. Best hackathon in our college!",
    tags: ["Good Refreshments", "Hands-on Practical"],
    updatedAt: "2026-09-30T09:00:00Z"
  },

  // Event 4: Hands-on Full-Stack Web Development Workshop
  {
    eventId: 4,
    studentName: "Aditi Sharma",
    studentEmail: "aditi.s@college.edu",
    department: "Computer Science",
    rating: 5,
    comment: "Incredible hands-on workshop! The instructors were patient and the codebase examples were crystal clear. Built my first React 19 project in one afternoon.",
    tags: ["Hands-on Practical", "Inspiring Speakers"],
    updatedAt: "2026-09-21T18:30:00Z"
  },
  {
    eventId: 4,
    studentName: "Karthik Raja",
    studentEmail: "karthik.r@college.edu",
    department: "Information Technology",
    rating: 4,
    comment: "Very informative and fast-paced. Would have loved an extra hour for debugging sessions, but overall one of the best technical workshops on campus.",
    tags: ["Hands-on Practical", "Well Organized"],
    updatedAt: "2026-09-22T10:15:00Z"
  },
  {
    eventId: 4,
    studentName: "Praveen K",
    studentEmail: "praveen.k@miracollege.edu",
    department: "AIDS",
    rating: 5,
    comment: "React 19 hooks and server concepts basic to advanced semaya purinjidhu. Code starter kit kuduthadhu romba use aachu.",
    tags: ["Hands-on Practical"],
    updatedAt: "2026-09-22T14:20:00Z"
  },
  {
    eventId: 4,
    studentName: "Ananya S",
    studentEmail: "ananya.s@miracollege.edu",
    department: "Computer Science",
    rating: 5,
    comment: "Concepts were explained practically without boring slides. Mentors cleared every single bug patiently. Super worth attending!",
    tags: ["Inspiring Speakers", "Well Organized"],
    updatedAt: "2026-09-23T16:00:00Z"
  },

  // Event 5: Annual Inter-College Esports Arena
  {
    eventId: 5,
    studentName: "Dhanush B",
    studentEmail: "dhanush.b@miracollege.edu",
    department: "ECE",
    rating: 5,
    comment: "LAN setup was flawless, zero ping spikes! Valorant clutch moments la crowd roar vera level. Shoutcasting was super professional.",
    tags: ["Fun & Energetic", "Well Organized"],
    updatedAt: "2026-10-03T19:30:00Z"
  },
  {
    eventId: 5,
    studentName: "Shriram M",
    studentEmail: "shriram.m@miracollege.edu",
    department: "Mechanical",
    rating: 5,
    comment: "Gaming monitors and mechanical keyboards provided were top tier. Match schedule exact-ah follow pannanga, no delays at all!",
    tags: ["Well Organized", "Fun & Energetic"],
    updatedAt: "2026-10-04T11:00:00Z"
  },
  {
    eventId: 5,
    studentName: "Keerthana P",
    studentEmail: "keerthana.p@miracollege.edu",
    department: "IT",
    rating: 4,
    comment: "FIFA tournament was nail-biting. Even audience viewing lounge with giant screen mass-ah arrange pannirundhanga!",
    tags: ["Fun & Energetic"],
    updatedAt: "2026-10-04T15:20:00Z"
  },

  // Event 6: National Tech Project Expo & Poster Gala
  {
    eventId: 6,
    studentName: "Meera R",
    studentEmail: "meera.r@miracollege.edu",
    department: "EEE",
    rating: 5,
    comment: "Evaluating panel judges asked deep technical questions on our IoT smart grid project. Direct feedback from industry leads romba valuable-ah irundhuchu.",
    tags: ["Great Networking", "Inspiring Speakers"],
    updatedAt: "2026-10-07T17:00:00Z"
  },
  {
    eventId: 6,
    studentName: "Naveen Kumar",
    studentEmail: "naveen.k@miracollege.edu",
    department: "Civil",
    rating: 4,
    comment: "Prototype stalls arrange pannadhu neat-ah irundhuchu. Other college final year projects paathu lots of cross-disciplinary ideas kedachidhu.",
    tags: ["Well Organized", "Great Networking"],
    updatedAt: "2026-10-08T12:30:00Z"
  },
  {
    eventId: 6,
    studentName: "Swetha K",
    studentEmail: "swetha.k@miracollege.edu",
    department: "Computer Science",
    rating: 5,
    comment: "Patent filing guidance booth was a great addition. Certificate distribution on time mudinjidhu. Excellent expo!",
    tags: ["Well Organized", "Inspiring Speakers"],
    updatedAt: "2026-10-08T16:45:00Z"
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
