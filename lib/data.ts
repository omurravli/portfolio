export const profile = {
  name: "Ömür Ravlı",
  role: "Multidisciplinary Engineer & Developer",
  location: "Kayseri, Türkiye",
  university: "Abdullah Gül University",
  // Replace these with your real links / address.
  email: "omurravli04@gmail.com",
  github: "https://github.com/omurravli",
  linkedin: "https://linkedin.com/in/omurravli/",
};

// Edit the values to match your real counts — they animate on scroll.
export const stats = [
  { value: 2, suffix: "+", label: "Mobile Apps" },
  { value: 3, suffix: "+", label: "IoT Prototypes" },
  { value: 4, suffix: "+", label: "ML Workflows" },
  { value: 2, suffix: "+", label: "Drone Systems" },
  { value: 6, suffix: "+", label: "E-commerce Themes" },
];

export interface Project {
  id: string;
  title: string;
  system: string;
  status: string;
  description: string;
  stack: string[];
  accent: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    id: "skincare-analyzer",
    title: "Skincare Analyzer",
    system: "MOBILE / AI SYSTEM",
    status: "PROTOTYPE → PRODUCT",
    description:
      "Flutter app that scans skincare labels with OCR and matches every ingredient against a 247-item library with safety and category labeling. Firebase/Firestore backend with AI-assisted data cleanup for messy real-world label text.",
    stack: ["Flutter", "Firebase", "Firestore", "OCR", "AI Cleanup"],
    accent: "#22d3ee",
    featured: true,
  },
  {
    id: "studiq",
    title: "StudIQ — Study Focus Planner",
    system: "MOBILE SYSTEM",
    status: "IN DEVELOPMENT",
    description:
      "Academic planner built in Flutter: tasks, calendar, projects, settings and onboarding on a feature-based architecture with local storage — built to survive a real semester, not a demo.",
    stack: ["Flutter", "Dart", "Local Storage", "Feature Architecture"],
    accent: "#38bdf8",
  },
  {
    id: "cafe-iot",
    title: "Café Table Ordering",
    system: "EMBEDDED / IOT SYSTEM",
    status: "WORKING PROTOTYPE",
    description:
      "ESP32-based table ordering prototype: QR/web order flow, MQTT state sync, TFT screen UI and RGB LED indicators driving order states — waiting, preparing, ready — with live Wi-Fi status.",
    stack: ["ESP32", "MQTT", "C++", "TFT Display", "Wi-Fi"],
    accent: "#34d399",
  },
  {
    id: "sidus-drone",
    title: "Sidus Drone Systems",
    system: "ROBOTICS SYSTEM",
    status: "TEAM PROJECT",
    description:
      "Student drone team work spanning robotics, embedded logic and systems thinking — integrating airframe, electronics and control into one machine that actually has to fly.",
    stack: ["Drones", "Embedded", "Robotics", "Systems Integration"],
    accent: "#a78bfa",
  },
  {
    id: "ecommerce-themes",
    title: "E-commerce Theme Development",
    system: "WEB / COMMERCE SYSTEM",
    status: "PRODUCTION WORK",
    description:
      "Custom Shopify/ikas-style storefront and theme development: responsive product and category pages, frontend fixes and production-oriented UI shipped to live stores.",
    stack: ["Shopify", "ikas", "JavaScript", "CSS", "Responsive UI"],
    accent: "#e879f9",
  },
  {
    id: "or-tools-scheduler",
    title: "OR-Tools Production Scheduler",
    system: "OPTIMIZATION SYSTEM",
    status: "RESEARCH BUILD",
    description:
      "Python optimization project on Google OR-Tools CP-SAT: production scheduling across workers, machines and constraints, with tuned solver configuration for real factory-shaped problems.",
    stack: ["Python", "OR-Tools", "CP-SAT", "Constraint Modeling"],
    accent: "#c084fc",
  },
  {
    id: "programming-education",
    title: "Programming Education",
    system: "EDUCATION SYSTEM",
    status: "ONGOING",
    description:
      "Teaching programming and mathematics through Python, Scratch, Roblox Studio and Lua — turning game worlds into a first engineering lab for students.",
    stack: ["Python", "Lua", "Roblox Studio", "Scratch", "Mathematics"],
    accent: "#7dd3fc",
  },
];

export interface SkillCategory {
  id: string;
  label: string;
  color: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: "programming",
    label: "Programming",
    color: "#a78bfa",
    skills: ["Python", "JavaScript", "TypeScript", "Java", "C++", "MATLAB", "Lua", "Dart"],
  },
  {
    id: "frontend",
    label: "Frontend",
    color: "#22d3ee",
    skills: ["React", "Next.js", "Tailwind CSS", "Responsive UI", "Motion Interfaces"],
  },
  {
    id: "mobile",
    label: "Mobile",
    color: "#38bdf8",
    skills: ["Flutter", "Firebase", "Firestore", "SQLite"],
  },
  {
    id: "ai-ml",
    label: "AI / ML",
    color: "#e879f9",
    skills: ["Machine Learning", "Data Processing", "OCR Workflows", "Ingredient Analysis", "Optimization"],
  },
  {
    id: "embedded",
    label: "Embedded / Robotics",
    color: "#34d399",
    skills: ["ESP32", "Arduino", "MQTT", "TFT Displays", "RGB LEDs", "Drone Systems", "Sensors"],
  },
  {
    id: "gamedev",
    label: "Game Dev",
    color: "#f472b6",
    skills: ["Unity", "Roblox Studio", "Godot"],
  },
  {
    id: "engineering",
    label: "Engineering",
    color: "#7dd3fc",
    skills: ["SolidWorks", "AutoCAD", "CAD Modeling", "Mechanical Systems"],
  },
  {
    id: "tools",
    label: "Tools",
    color: "#c4b5fd",
    skills: ["Git", "VS Code", "PlatformIO", "Firebase", "OR-Tools"],
  },
];

export interface TimelineEntry {
  title: string;
  context: string;
  description: string;
  tag: string;
}

export const timeline: TimelineEntry[] = [
  {
    title: "Mechanical Engineering",
    context: "Abdullah Gül University — Kayseri",
    description:
      "Mechanics, materials, thermodynamics, CAD. The systems-thinking foundation that sits under everything else I build.",
    tag: "FOUNDATION",
  },
  {
    title: "Drone Team / Robotics",
    context: "Sidus Drone Systems",
    description:
      "Embedded logic, airframe integration and engineering trade-offs on machines where a bad assumption ends in a crash.",
    tag: "ROBOTICS",
  },
  {
    title: "Programming & Math Instructor",
    context: "Teaching Python, Scratch, Roblox Studio, Lua",
    description:
      "Explaining loops, logic and geometry to beginners — the fastest way to find out whether you actually understand them yourself.",
    tag: "EDUCATION",
  },
  {
    title: "Flutter App Development",
    context: "Skincare Analyzer · StudIQ",
    description:
      "Feature-based architectures, Firebase backends, OCR pipelines — mobile products designed to be used daily, not demoed once.",
    tag: "MOBILE",
  },
  {
    title: "ESP32 / IoT Prototyping",
    context: "Café Table Ordering System",
    description:
      "MQTT state machines, TFT UI and RGB status signaling — a physical product loop from QR scan to 'order ready'.",
    tag: "EMBEDDED",
  },
  {
    title: "E-commerce Theme Development",
    context: "Shopify / ikas storefronts",
    description:
      "Production storefront themes: responsive product and category pages, frontend fixes, real customers on the other side.",
    tag: "WEB",
  },
  {
    title: "ML & Optimization",
    context: "OCR workflows · OR-Tools CP-SAT",
    description:
      "Data processing, ingredient analysis and constraint-based production scheduling — software that decides, not just displays.",
    tag: "AI / OPT",
  },
];

export interface ProcessStage {
  id: string;
  title: string;
  blurb: string;
}

export const processStages: ProcessStage[] = [
  { id: "idea", title: "Idea", blurb: "Find the friction worth solving." },
  { id: "design", title: "System Design", blurb: "Define inputs, constraints, architecture." },
  { id: "prototype", title: "Prototype", blurb: "Build the ugliest working version, fast." },
  { id: "test", title: "Test", blurb: "Break it before reality does." },
  { id: "iterate", title: "Iterate", blurb: "Tighten tolerances, cut what's dead." },
  { id: "ship", title: "Ship", blurb: "Put it in real hands." },
];
