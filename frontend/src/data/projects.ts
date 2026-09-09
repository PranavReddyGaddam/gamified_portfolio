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
    role: "Solo build \u2014 design & engineering",
    stack: "Next.js, Python, FastAPI, agentic pipelines, object storage",
    summary:
      "An AI study platform that turns uploaded files, links, or YouTube videos into summaries, flashcards, quizzes, two-speaker podcasts, and live voice tutoring that grades a student explaining the material out loud.",
    sections: [
      {
        heading: "What it does",
        body: "Bloom ingests PDFs, DOCX, PPTX, YouTube videos and articles, then generates study material from them: concept-grouped summaries, flashcards on an SM-2 spaced repetition schedule, fact-checked quizzes, and podcast episodes with per-segment playback offsets for follow-along highlighting.",
      },
      {
        heading: "Agentic, not one-shot",
        body: "Every generation step is a multi-stage pipeline with self-verification rather than a single model call. Summaries go draft, critique, revise. Quiz questions are fact-checked against the source before a student ever sees them.",
      },
      {
        heading: "Failing open",
        body: "The verification stages are the fragile part, so every one of them fails open: if a check errors it degrades rather than blocking the student. A slightly weaker summary beats a spinner that never resolves.",
      },
      {
        heading: "Tutoring",
        body: "Adaptive tutor sessions track mastery per concept with selectable rigor bars, and a teach-it-back mode states a plausible misconception the student has to catch and correct in their own words.",
      },
    ],
    title: "Bloom",
    description:
      "Generates custom quizzes from any topic for educators, with LLM-powered questions and performance analytics.",
    year: "2025",
    tags: ["Next.js", "Python", "RAG", "Agentic Architecture"],
    linkLabel: "View Code",
    previewImages: ["/videos/Bloom.mp4"],
    githubUrl: "https://github.com/pranavreddygaddam/Bloom",
    liveUrl: "https://bloom.pranavreddygaddam.com/",
  },
  {
    id: "baywindow",
    role: "Solo build \u2014 data & frontend",
    stack: "React 19, TypeScript, Vite, MapLibre GL, FastAPI, PMTiles",
    summary:
      "A free San Francisco building lookup. Search any address and get a 0\u2013100 health score built from DBI violations, complaints, 311 cases, evictions, rent control, crime, permits and seismic retrofit status.",
    sections: [
      {
        heading: "The problem",
        body: "All of this data is public on DataSF and none of it is usable. It lives across separate Socrata datasets with no shared building identifier, so answering one question about one address means cross-referencing a dozen portals.",
      },
      {
        heading: "The map",
        body: "A full-bleed choropleth of all 41 SF neighbourhoods shaded by housing density, with rent-stabilised and high-violation overlays. Zoom in and every building becomes a dot coloured by health bucket.",
      },
      {
        heading: "3D at city scale",
        body: "171k building footprints with real heights from GlobalBuildingAtlas, tiled with tippecanoe into a self-hosted PMTiles archive so the whole city renders without a paid tile provider.",
      },
      {
        heading: "Free by design",
        body: "Geocoding is hybrid and costs nothing, using SF's own address points rather than a paid API. The point was a tool with no paywall, so the running cost had to stay near zero.",
      },
    ],
    title: "Bay Window",
    description:
      "Free SF building lookup with a 0-100 health score from DBI violations, evictions, crime, and permits data.",
    year: "2024",
    tags: ["React", "MapLibre", "FastAPI"],
    linkLabel: "View Website",
    previewImages: ["/videos/Bay-Window.mp4"],
    githubUrl: "https://github.com/PranavReddyGaddam/Bay-Window",
    liveUrl: "https://baywindow.pranavreddygaddam.com/",
  },
  {
    id: "systemdesign",
    role: "Solo build \u2014 design & engineering",
    stack: "Next.js 16, FastAPI, React Flow, SSE, Mermaid",
    summary:
      "An AI study companion that takes you from beginner to interview-ready on system design across a 93-topic curriculum, with a visual canvas where you architect real systems and get graded like a mock interview.",
    sections: [
      {
        heading: "Teach, quiz, revise",
        body: "Each topic streams a structured five-part lesson over SSE \u2014 beginner, intermediate, real-world, interview Q&A, quiz \u2014 rendered as Markdown with Mermaid diagrams. Quizzes are free-response, and an LLM grades the written answer with a score, strengths, gaps and a model answer.",
      },
      {
        heading: "Design practice",
        body: "A React Flow canvas where you drag load balancers, caches, databases and queues to architect a system for a classic interview question, then get an interviewer-style critique of the result.",
      },
      {
        heading: "Tracking progress",
        body: "The full 14-phase curriculum with per-topic status, a completion donut, and a GitHub-style activity heatmap. Completed topics resurface automatically as review cards with regenerated key concepts and common mistakes.",
      },
    ],
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
    role: "Solo build \u2014 design & engineering",
    stack: "React 18, TypeScript, FastAPI, STT/TTS, Mermaid",
    summary:
      "Turns any GitHub repository into something you can listen to, look at, or talk to: an AI-generated podcast, an architecture diagram, or a live voice conversation about the codebase.",
    sections: [
      {
        heading: "Three ways in",
        body: "Podcast mode converts a repository into audio with streaming generation and live segments. Diagram mode auto-generates Mermaid architecture diagrams from the code structure. Talk mode is a real-time speech-to-text, LLM, text-to-speech loop.",
      },
      {
        heading: "Repository-aware",
        body: "All three modes sit on the same analysis layer, which parses the file structure and reads the code, so the AI answers about your actual repository rather than generalities. Talk mode opens by introducing the repo back to you.",
      },
      {
        heading: "Why",
        body: "Reading an unfamiliar codebase is slow and mostly linear. A podcast you can listen to on a walk, or a diagram you can take in at a glance, gets you oriented far faster than scrolling files.",
      },
    ],
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
    role: "Solo build \u2014 design & engineering",
    stack: "React, TypeScript, FastAPI, Supabase, ChromaDB, Groq",
    summary:
      "An interview preparation platform built on live job market data: it scrapes real postings, extracts the skills actually being asked for, and generates interview questions from those requirements.",
    sections: [
      {
        heading: "Grounded in real postings",
        body: "Rather than generic question banks, Hirely scrapes live LinkedIn postings through BrightData MCP and Crawl4AI, then extracts and ranks the technical skills that appear across them.",
      },
      {
        heading: "From data to preparation",
        body: "Those extracted requirements drive question generation, so you practise against what a specific role and company are currently asking for, alongside study guides and a practice plan.",
      },
      {
        heading: "The stack",
        body: "A FastAPI services layer separates scraping, skills analysis, AI analysis and interview preparation, with Supabase for storage and ChromaDB for retrieval.",
      },
    ],
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
    role: "Solo build \u2014 research & engineering",
    stack: "FastAPI, React, TypeScript, PyTorch, Gemma, Colab GPU",
    summary:
      "An explainability framework for language models, using Process Reward Models to make mathematical reasoning legible step by step rather than only at the final answer.",
    sections: [
      {
        heading: "Why step-level",
        body: "Outcome supervision tells you a model got the answer wrong but not where the reasoning broke. Process Reward Models score each intermediate step, so a failure can be located rather than just detected.",
      },
      {
        heading: "What it visualises",
        body: "Token confidence, attention patterns, logit lens projections, and gradient attribution, rendered live in an interactive dashboard as the model generates.",
      },
      {
        heading: "Architecture",
        body: "A FastAPI orchestration layer supports both local and remote inference, proxying to GPU-hosted Gemma models running on Colab behind an ngrok tunnel \u2014 which kept the research iterable without paying for dedicated GPUs.",
      },
    ],
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
    role: "Solo build \u2014 design & engineering",
    stack: "React, TypeScript, Vite, GSAP, Tailwind",
    summary:
      "This site. An editorial portfolio with a smooth-scrolled, scroll-revealed layout \u2014 and a preserved archive of the previous gamified version, still live at /v1.",
    sections: [
      {
        heading: "Two versions",
        body: "The earlier portfolio was a game: levels, XP, achievements and an 8-bit interface. Rather than delete it, it is frozen on its own branch and deployment, reachable from the footer, so the older work stays visible.",
      },
      {
        heading: "This version",
        body: "Instrument Serif and Geist over a cream ground, GSAP ScrollSmoother driving the page, and project case studies that open in a modal which expands to full screen.",
      },
    ],
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
    role: "Solo build \u2014 design & engineering",
    stack: "React 18, TypeScript, Vite, Three.js, React Three Fiber, FastAPI",
    summary:
      "A startup idea gets analysed through expert personas from around the world, with an interactive 3D globe showing where each perspective is coming from.",
    sections: [
      {
        heading: "The idea",
        body: "The same pitch reads very differently in different markets. Nexus simulates expert perspectives across regions and domains, so the feedback surfaces how an idea lands somewhere other than where it was written.",
      },
      {
        heading: "The globe",
        body: "Personas are placed on an interactive 3D globe built with Three.js and React Three Fiber, which makes the geographic spread of the feedback something you see rather than read.",
      },
      {
        heading: "Input",
        body: "Ideas can be submitted as text or with supporting documents attached, and results come back with per-persona ratings and comments.",
      },
    ],
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
    role: "Hackathon build \u2014 AWS Databases \u00d7 Vercel",
    stack: "Next.js 16, React 19, FastAPI, Amazon Aurora DSQL, Stripe",
    summary:
      "A group-buy marketplace where the unit price falls as more people commit, and every committed buyer pays the lowest tier reached by the deadline \u2014 so sharing a deal makes it cheaper for everyone already in.",
    sections: [
      {
        heading: "The mechanic",
        body: "Price drops through tiers as buyers commit, and settlement applies the final tier retroactively to everyone. That inverts the usual incentive: recruiting more buyers directly lowers what you pay.",
      },
      {
        heading: "Concurrency on Aurora DSQL",
        body: "Distributed SQL means optimistic concurrency, so simultaneous commits to the same campaign collide. Writes retry on SQLSTATE 40001 rather than locking, which keeps the commit path correct under exactly the burst traffic a deal deadline creates.",
      },
      {
        heading: "Payments",
        body: "Stripe manual-capture PaymentIntents hold each buyer's authorisation until the deadline, so nobody is charged before the final tier is known.",
      },
    ],
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
    role: "Solo build \u2014 engineering",
    stack: "React, FastAPI, Supabase, Docker",
    summary:
      "A volunteer management system covering the whole event flow: registration, day-of check-in, and an admin dashboard for organisers.",
    sections: [
      {
        heading: "The flow",
        body: "Volunteers register ahead of time, get checked in on the day, and organisers see the state of both from one dashboard rather than a spreadsheet passed around over email.",
      },
      {
        heading: "Built to hand over",
        body: "Supabase for auth and storage, automated email confirmations, and the whole stack containerised with Docker Compose so the next organiser can run it without reconstructing the environment.",
      },
    ],
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
