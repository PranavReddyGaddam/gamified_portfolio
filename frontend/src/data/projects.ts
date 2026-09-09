// Project catalogue, shared by the work list and the case-study routes.

export type Project = {
  id: string;
  title: string;
  image?: string;
  description: string;
  tags: string[];
  linkLabel: string;
  placeholder?: boolean;
  previewImages?: string[];
  githubUrl?: string;
  liveUrl?: string;
  /** Case-study fields, shown on /project/:id and /project/:id/full. */
  year?: string;
  role?: string;
  stack?: string;
  summary?: string;
  sections?: { heading: string; body: string }[];
};

export const projects: Project[] = [
  {
    id: "bloom",
    title: "Bloom",
    description:
      "Generates custom quizzes from any topic for educators, with LLM-powered questions and performance analytics.",
    year: "2025",
    role: "Solo build — design & engineering",
    stack: "Next.js, Python, FastAPI, RAG",
    summary:
      "An LLM quiz platform for educators: paste any topic or source material and get assessment-ready questions, with analytics on how a class actually performed.",
    sections: [
      {
        heading: "The problem",
        body: "Writing good assessment questions is slow, and the slow part is not the typing. It is the judgement: which ideas are load-bearing, which distractors are plausible without being unfair, and how to spread difficulty across a paper. Most generators ignore all of that and produce trivia.",
      },
      {
        heading: "How it works",
        body: "Source material is chunked and embedded, then a retrieval pass grounds every question in a specific passage rather than in the model's own memory. A second agent critiques each draft question for ambiguity and for distractors that are accidentally correct, and rewrites the ones that fail.",
      },
      {
        heading: "What I would do differently",
        body: "The critique pass doubles the cost per question, and for straightforward factual recall it rarely changes the output. Routing by question type, and only escalating the ambiguous ones, would keep the quality where it matters and cut the bill.",
      },
    ],
    tags: ["Next.js", "Python", "RAG", "Agentic Architecture"],
    linkLabel: "View Code",
    previewImages: ["/videos/Bloom.mp4"],
    githubUrl: "https://github.com/pranavreddygaddam/Bloom",
    liveUrl: "https://bloom.pranavreddygaddam.com/",
  },
  {
    id: "baywindow",
    title: "Bay Window",
    description:
      "Free SF building lookup with a 0-100 health score from DBI violations, evictions, crime, and permits data.",
    year: "2024",
    role: "Solo build — data & frontend",
    stack: "React, MapLibre, FastAPI, PostgreSQL",
    summary:
      "A free building lookup for San Francisco that turns scattered public records into a single 0-100 health score, so a renter can judge an address before signing.",
    sections: [
      {
        heading: "The problem",
        body: "San Francisco publishes an enormous amount about its buildings: permits, inspections, violations, eviction filings, incident reports. All of it is public, and none of it is usable. The data lives in separate portals with separate schemas and no shared identifier for a building.",
      },
      {
        heading: "Reconciling the sources",
        body: "The hard part was entity resolution. The same building appears with different address formats across datasets, so records are normalised and matched on parcel where available and on fuzzy address matching where it is not. Unmatched records are surfaced rather than silently dropped.",
      },
      {
        heading: "Scoring honestly",
        body: "A single number invites false confidence, so the score always decomposes: every point deducted links back to the specific filing that caused it. A building is never marked bad without showing the receipt.",
      },
    ],
    tags: ["React", "MapLibre", "FastAPI"],
    linkLabel: "View Website",
    previewImages: ["/videos/Bay-Window.mp4"],
    githubUrl: "https://github.com/PranavReddyGaddam/Bay-Window",
    liveUrl: "https://baywindow.pranavreddygaddam.com/",
  },
  {
    id: "systemdesign",
    title: "System Design",
    year: "2025",
    description:
      "AI study companion that teaches system design from first principles, quizzes you, and grades mock interviews on a visual canvas.",
    tags: ["React", "FastAPI", "Claude"],
    linkLabel: "View Website",
    previewImages: ["/videos/system_design.mp4"],
    githubUrl: "https://github.com/PranavReddyGaddam/system-design",
    liveUrl: "https://systemdesign.pranavreddygaddam.com/",
  },
  {
    id: "gitbridge",
    title: "GitBridge",
    year: "2025",
    description:
      "Turns GitHub repositories into interactive diagrams and AI-narrated walkthroughs for fast codebase exploration.",
    tags: ["React", "ElevenLabs", "FastAPI", "AWS", "MermaidJS"],
    linkLabel: "View Code",
    previewImages: ["/videos/GitBridge.mp4"],
    githubUrl: "https://github.com/pranavreddygaddam/gitbridge",
  },
  {
    id: "hirely",
    title: "Hirely",
    year: "2025",
    description:
      "AI interview prep platform that scrapes live job listings and generates personalized interview questions.",
    tags: ["FastAPI", "React", "Groq", "Supabase", "ChromaDB"],
    linkLabel: "View Code",
    previewImages: ["/videos/Hirely.mp4"],
    githubUrl: "https://github.com/PranavReddyGaddam/Hirely",
  },
  {
    id: "prism",
    title: "Prism",
    year: "2025",
    description:
      "LLM explainability framework using Process Reward Models to make step-by-step mathematical reasoning transparent, with real-time token confidence, attention, logit lens, and gradient attribution visualizations.",
    tags: ["PRM", "LLM", "Explainability", "PyTorch"],
    linkLabel: "View Code",
    previewImages: ["/videos/Prism.mp4"],
    githubUrl: "https://github.com/PranavReddyGaddam/Prism",
  },
  {
    id: "personalwebsite",
    title: "Personal Portfolio Website",
    year: "2025",
    description:
      "Gamified portfolio with level progression, achievements, WebGL backgrounds, and scroll-based reveals.",
    tags: ["Vite", "Tailwind CSS", "React"],
    linkLabel: "View Code",
    previewImages: ["/videos/Portfolio.mp4"],
    githubUrl: "https://github.com/PranavReddyGaddam/gamified-portfolio",
  },
  {
    id: "nexus",
    title: "Nexus",
    year: "2024",
    description:
      "Evaluates startup ideas through simulated expert personas, visualized on an interactive 3D globe.",
    tags: ["React", "Three.js", "Tailwind CSS", "FastAPI", "OpenAI"],
    linkLabel: "View Code",
    previewImages: ["/videos/Nexus.mp4"],
    githubUrl: "https://github.com/PranavReddyGaddam/Nexus",
  },
  {
    id: "pindrop",
    title: "PinDrop",
    year: "2025",
    description:
      "Drop-pricing group-buy marketplace where the unit price falls as more buyers commit, and every committed buyer pays the lowest tier reached by the deadline. Sharing a drop recruits more buyers, which drops the price for everyone already in.",
    tags: ["React", "TypeScript", "FastAPI", "Marketplace"],
    linkLabel: "View Website",
    previewImages: ["/videos/Pindrop.mp4"],
    githubUrl: "https://github.com/PranavReddyGaddam/PinDrop",
    liveUrl: "https://pin-drop-six.vercel.app",
  },
  {
    id: "isowebapp",
    title: "ISO Web App",
    year: "2024",
    description:
      "Volunteer and event management system with role-based access, dynamic ticketing, and QR check-in.",
    tags: ["FastAPI", "React", "Tailwind CSS", "Supabase", "Docker"],
    linkLabel: "View Code",
    githubUrl: "https://github.com/PranavReddyGaddam/ISO_Event_Registration",
  },
  // Placeholder slots for upcoming projects (keeps the showcase grid at 3 full rows)
  {
    id: "coming-soon-2",
    title: "???",
    image: "/Pranav_Logo.png",
    description: "A new quest is under construction. Check back soon.",
    tags: ["TBD"],
    linkLabel: "Coming Soon",
    placeholder: true,
  },
  {
    id: "coming-soon-3",
    title: "???",
    image: "/Pranav_Logo.png",
    description: "A new quest is under construction. Check back soon.",
    tags: ["TBD"],
    linkLabel: "Coming Soon",
    placeholder: true,
  },
];
