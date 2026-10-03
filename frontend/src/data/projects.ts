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
        heading: "The problem with one-shot generation",
        body: "A single model call asked to summarise a textbook chapter will quietly invent things, and a student studying from it has no way to know. Bloom treats every generation step as a pipeline rather than a call: summaries go draft, critique, revise against a fixed quality checklist, and quiz questions are fact-checked against the source before anyone sees them. Questions whose answers are not supported by the text are regenerated with feedback, then dropped and backfilled if they still do not hold.",
      },
      {
        heading: "Failing open, not closed",
        body: "Verification is the fragile part of that design. Every check therefore degrades instead of blocking: if a critique pass errors, the draft ships. A slightly weaker summary is a better outcome than a spinner that never resolves, and the alternative is a study tool that stops working whenever a model provider has a bad afternoon.",
      },
      {
        heading: "Reading the pages a parser drops",
        body: "PDF extraction usually throws away exactly what matters in technical material. Pages are classified individually before use: text pages stay text, while diagrams and equations are rendered to images and described by a vision model, so they feed generation rather than vanishing. Title and agenda pages are kept but down-weighted.",
      },
      {
        heading: "One correct answer is not mastery",
        body: "The tutor's central rule is that a right answer proves very little. Multiple choice carries a 25 percent guess rate, and asking the same question again tests memory of the question. So every answer schedules an unannounced follow-up two to four questions later in a different framing. Passing variants is what moves a concept toward mastered; failing a variant after getting the original right is treated as memorisation and penalised harder than a plain miss.",
      },
      {
        heading: "Audio that does not seam",
        body: "Deepgram has no multi-speaker mode, so episode assembly is owned in-house. Segments are requested as raw 24 kHz PCM and concatenated as samples with a single MP3 encode at the end, because encoding per segment puts frame boundaries mid-episode, which is where audible seams come from. Measured sample counts also give exact playback offsets instead of word-count estimates. Script and audio fail independently: a TTS outage still returns a readable episode.",
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
        heading: "The question renters cannot answer",
        body: "Everything you would want to know before signing a San Francisco lease is public, and effectively unreachable. DBI violations, 311 cases, eviction notices, rent board records, permits and seismic retrofit status live in separate DataSF datasets with their own schemas and quirks. Bay Window joins them per address and resolves it to a single 0 to 100 health score.",
      },
      {
        heading: "Zero-dollar geocoding",
        body: "Commercial geocoding would have been the cost that killed the project, since every search needs one. The lookup instead runs against SF's own EAS address points, which makes address resolution free and keeps the whole tool free to use. A FastAPI proxy with an in-memory TTL cache sits in front of Socrata so repeat lookups never re-hit the upstream API.",
      },
      {
        heading: "171,000 buildings in the browser",
        body: "Showing every building in the city in 3D means shipping geometry no normal payload can carry. Footprints with heights from GlobalBuildingAtlas were tiled with tippecanoe into a self-hosted PMTiles archive of about 24 MB, which the map reads by range request, so a client only ever fetches the tiles actually on screen.",
      },
      {
        heading: "Honest about missing data",
        body: "Most buildings have no violation history, which is not the same as being safe. Health buckets include an explicit not-enough-data state rather than scoring an unknown building as excellent, because a renter reading a green dot deserves to know whether it means clean or unrecorded.",
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
        heading: "Teaching a syllabus, not a chatbot",
        body: "Asking a model system design questions gives answers without a path through the material. This is built on a fixed 93-topic curriculum across 14 phases, from requirements and back-of-the-envelope maths through sharding, consistent hashing, circuit breakers and observability, with high-priority interview topics flagged. Each topic streams a five-part lesson over SSE, routed into separate tabs as the tokens arrive.",
      },
      {
        heading: "Paying for a lesson once",
        body: "Generated lessons are cached per section in Postgres, so reopening a topic costs nothing and only an explicit re-teach calls the model again. Grading runs on a deliberately smaller model than teaching, because scoring a short answer is a much lighter task than authoring a lesson, and using one model for both is how study tools get expensive.",
      },
      {
        heading: "Grading a diagram",
        body: "The part interviews actually test is whether you can draw the system. A React Flow canvas lets you drag load balancers, caches, queues and databases into an architecture, then submits the node and edge graph for critique as a senior interviewer would: verdict, gaps, follow-up questions, and a model architecture rendered back as a diagram.",
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
        heading: "Reading a repository you have never seen",
        body: "Onboarding into an unfamiliar codebase means reconstructing intent from files. GitBridge parses a repository's structure through the GitHub API and exposes it three ways: a generated architecture diagram, a two-speaker podcast walkthrough, and a voice conversation where you can ask about the code and get answers grounded in what is actually there.",
      },
      {
        heading: "A voice loop with no dead air",
        body: "Conversation only works if the turnaround is short. The pipeline runs Silero VAD for endpointing into Faster-Whisper for transcription, an LLM over OpenRouter for the response, and AWS Polly for speech, with streaming so playback starts before generation finishes. Polly falls back to local synthesis when credentials are absent, so the feature degrades rather than disappearing.",
      },
      {
        heading: "Caching what is expensive to rebuild",
        body: "Repository analysis and generated audio are both slow and costly, so results are stored in S3 behind a hybrid cache. Asking about the same repository twice does not pay for parsing it twice.",
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
        heading: "Preparing against real postings",
        body: "Generic interview prep optimises for questions nobody asks. Hirely scrapes live LinkedIn postings for a target role, extracts the technical skills actually named across them, and generates questions and study plans from that distribution rather than from a canned list.",
      },
      {
        heading: "Two scrapers, because one is not enough",
        body: "Job boards actively resist automated collection, and any single method fails often enough to break the product. Collection runs through both BrightData MCP and Crawl4AI so coverage survives one path being blocked, with results normalised before analysis.",
      },
      {
        heading: "Skills as the unit of analysis",
        body: "Postings are reduced to a skill frequency distribution, which is what makes the output actionable: it answers which technologies to study first for a specific role and company, instead of restating the job description back at the user.",
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
        heading: "Showing the work, then checking it",
        body: "A model that reaches the right answer by bad reasoning is still wrong, and ordinary generation hides that. Prism fine-tunes Gemma 3 4B with a LoRA adapter on a Process Reward Model dataset so the model emits mathematical reasoning step by step with per-step correctness labels, making the chain itself inspectable rather than only the final answer.",
      },
      {
        heading: "Four views of one generation",
        body: "Explainability here is not a single score. The dashboard renders per-token confidence across the sequence, layer-specific attention matrices, a logit lens showing how predictions evolve through depth, and gradient attribution over input tokens, so a reasoning step can be examined from several independent angles at once.",
      },
      {
        heading: "GPU inference without a GPU budget",
        body: "The models need accelerators the rest of the stack does not. Inference runs on Colab behind a Flask server exposed through an ngrok tunnel, with the FastAPI backend proxying to it, which keeps the architecture the same whether the model is local or remote and made the project possible without paid GPU hosting.",
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
        heading: "Many readers, not one verdict",
        body: "A single model opinion on a startup idea is one opinion wearing a confident voice. Nexus runs an idea past a set of expert personas drawn from different markets and domains, each returning its own rating and reasoning, so disagreement between them is visible instead of averaged away.",
      },
      {
        heading: "Geography as the interface",
        body: "Personas are placed on an interactive 3D globe built with React Three Fiber, which makes the point the product is arguing: an idea that lands well in one market may not travel. Selecting a location reads as asking that market specifically.",
      },
      {
        heading: "Context beyond the pitch",
        body: "Supporting documents can be attached to a submission so analysis runs against real material rather than a one-line description, and results stream back as each persona finishes rather than blocking on the slowest.",
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
        heading: "Inverting the incentive",
        body: "Normal group-buying rewards early commitment and punishes the people who join late. Pindrop settles every buyer at the lowest tier reached by the deadline, so recruiting more buyers directly lowers what you already agreed to pay, and sharing a deal becomes self-interested rather than altruistic.",
      },
      {
        heading: "Counting without contention",
        body: "Aurora DSQL offers optimistic concurrency with no row locks and no foreign keys, which is exactly the wrong shape for a live counter. Commitments are therefore append-only, one INSERT each, and the live quantity is a SUM aggregate, so reads never contend with writes no matter how many people commit at once.",
      },
      {
        heading: "One hot row, and a retry",
        body: "The batch cap still needs a serialisation point, so a single control row per campaign is taken with SELECT FOR UPDATE. Under DSQL that surfaces as a commit-time conflict rather than a wait, so losing transactions retry with backoff and jitter on SQLSTATE 40001, which is the precise failure mode a deadline rush produces, handled rather than hoped away.",
      },
      {
        heading: "Nobody pays before settlement",
        body: "Buyers authorise with Stripe manual-capture PaymentIntents, so funds are held but uncaptured until the drop closes and the final tier is known. Payment mode is environment-toggled between mock and test, which keeps the full commit-to-settle path runnable locally without touching a real card.",
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
        heading: "Running a real event door",
        body: "Built for an actual student organisation event, where the failure modes are physical: a queue at the door, volunteers on their own phones, and no tolerance for a check-in that takes more than a moment. Registration issues a QR ticket as a PDF by email, and check-in is a phone camera scanning it.",
      },
      {
        heading: "Two roles, one system",
        body: "Presidents and volunteers see different systems behind the same login. JWT auth with bcrypt hashing gates a volunteer application and approval workflow, dynamic ticket pricing, and an admin dashboard for attendees and applications, with Supabase row level security enforcing the boundary at the database rather than only in the UI.",
      },
      {
        heading: "Deployable by someone else",
        body: "The whole stack is containerised with Docker Compose and health-checked, because the people running next year's event are not the people who wrote it. Configuration is entirely environment variables, so a handover is a .env file rather than a code change.",
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
