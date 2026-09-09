import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import "./App.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import emailjs from "@emailjs/browser";
import Navbar from "./components/Navbar";
import GitHubCommitChart from "./components/GitHubCommitChart";
import AchievementToasts, {
  AchievementToast,
  AchievementTheme,
} from "./components/AchievementToasts";
import GameInstructionsModal from "./components/GameInstructionsModal";
import CodeRequestModal from "./components/CodeRequestModal";
import ProjectDeck from "./components/ProjectDeck";
import ProjectDeckMobile from "./components/ProjectDeckMobile";
import TimeMachine from "./components/TimeMachine";
import "./components/TimeMachine.css";
import "./components/Hero.css";
import HireMeStats from "./components/HireMeStats";
import { Button } from "@/components/ui/8bit/button";
import { Card, CardContent } from "@/components/ui/8bit/card";
import { Input } from "@/components/ui/8bit/input";
import { Textarea } from "@/components/ui/8bit/textarea";
import { Label } from "@/components/ui/8bit/label";
import { Badge } from "@/components/ui/8bit/badge";
import {
  Linkedin,
  Github,
  ShieldUser,
  BookOpenText,
  ChartColumnIncreasing,
  Instagram,
} from "lucide-react";
import { RiTwitterXFill } from "react-icons/ri";
import { BsRobot, BsTools, BsDatabaseAdd } from "react-icons/bs";
import { RxGear } from "react-icons/rx";
import { FaDocker, FaLock, FaUnlock, FaChevronDown } from "react-icons/fa";
import { GoTrophy } from "react-icons/go";
import { IoClose } from "react-icons/io5";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

// EmailJS configuration
const EMAILJS_SERVICE_ID = "service_d0bwser";
const EMAILJS_TEMPLATE_ID = "template_4hg075h";
const EMAILJS_PUBLIC_KEY = "wRXZiwguBPiyEMvoX";

// Resume URL (place your PDF in public/ and update this path if needed)
const RESUME_URL = "/Pranav_Reddy_Gaddam_Resume_FT_Master.pdf";

// Achievement toast metadata (title/xp/theme shown in the popup)
const ACHIEVEMENT_TOAST_META: Record<
  string,
  { title: string; xp: number; theme: AchievementTheme }
> = {
  "rulebook-raider": { title: "Rulebook Raider", xp: 30, theme: "blue" },
  identity_unlocked: { title: "Identity Unlocked", xp: 100, theme: "blue" },
  pathfinder: { title: "Pathfinder", xp: 100, theme: "yellow" },
  skill_mastery: { title: "Skill Mastery", xp: 100, theme: "green" },
  quest_conqueror: { title: "Quest Conqueror", xp: 100, theme: "red" },
  social_link_established: { title: "Social Link", xp: 100, theme: "teal" },
  face_of_hero: { title: "Face of the Hero", xp: 150, theme: "blue" },
  keeper_of_stories: { title: "Keeper of Stories", xp: 100, theme: "yellow" },
  power_unleashed: { title: "Power Unleashed", xp: 75, theme: "green" },
  guild_explorer: { title: "Guild Explorer", xp: 75, theme: "green" },
  grandmasters_path: { title: "Grandmaster's Path", xp: 90, theme: "purple" },
  skill_tree_master: { title: "Skill Tree Master", xp: 200, theme: "green" },
  project_master: { title: "Project Master", xp: 300, theme: "red" },
  alliance_formed: { title: "Alliance Formed", xp: 100, theme: "teal" },
};

// Level 5 project quests
type Project = {
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
};

const projects: Project[] = [
  {
    id: "bloom",
    title: "Bloom",
    description:
      "Generates custom quizzes from any topic for educators, with LLM-powered questions and performance analytics.",
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
    tags: ["React", "MapLibre", "FastAPI"],
    linkLabel: "View Website",
    previewImages: ["/videos/Bay-Window.mp4"],
    githubUrl: "https://github.com/PranavReddyGaddam/Bay-Window",
    liveUrl: "https://baywindow.pranavreddygaddam.com/",
  },
  {
    id: "systemdesign",
    title: "System Design",
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

function App() {
  const totalLevels = 6;
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [unlockedSkills, setUnlockedSkills] = useState({
    frontend: false,
    backend: false,
    database: false,
    devops: false,
    ai: false,
    tools: false,
  });

  const [carouselIndex, setCarouselIndex] = useState(1);

  // Command center state
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState<string[]>([]);
  const [currentCommand, setCurrentCommand] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<"socials" | "quests" | "terminal">(
    "socials"
  );

  // Mobile carousel auto-animation state
  const [visibleCardIndex, setVisibleCardIndex] = useState(1); // Start with Master's card visible
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Spaceship sound ref
  const spaceshipSoundRef = useRef<HTMLAudioElement | null>(null);

  // Achievements modal visibility
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);

  // Achievement tracking
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(
    new Set()
  );
  const unlockedAchievementsRef = useRef<Set<string>>(new Set());

  // Achievement toast queue (max 3 visible, extras wait their turn)
  const [achievementToasts, setAchievementToasts] = useState<
    AchievementToast[]
  >([]);
  const toastQueueRef = useRef<AchievementToast[]>([]);
  const visibleToastCountRef = useRef(0);

  // Game instructions modal state
  const [showGameInstructions, setShowGameInstructions] = useState(false);

  // Card flip state
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isInfoCardFlipped, setIsInfoCardFlipped] = useState(false);
  const [isAttributesCardFlipped, setIsAttributesCardFlipped] = useState(false);

  // Per-section achievement bookkeeping
  const [unlockedSection2Achievements] = useState<Set<string>>(new Set());
  const [unlockedSection3Achievements] = useState<Set<string>>(new Set());
  const [unlockedSection4Achievements] = useState<Set<string>>(new Set());
  const [unlockedSection5Achievements] = useState<Set<string>>(new Set());

  // "Why you should hire me" modal (opened from the lanyard stamp card)
  const [showWhyHireMeModal, setShowWhyHireMeModal] = useState(false);

  // Code Request Modal
  const [showCodeRequestModal, setShowCodeRequestModal] = useState(false);
  const [isSubmittingCodeRequest, setIsSubmittingCodeRequest] = useState(false);

  // Section visibility to control heavy backgrounds
  const [isSection1Visible, setIsSection1Visible] = useState(true);
  const [isSection2Visible, setIsSection2Visible] = useState(false);
  const [isSection3Visible, setIsSection3Visible] = useState(false);

  const nextSectionRef = useRef<HTMLDivElement>(null);

  // Section 5: reveal the second row of project cards only after the button is clicked
  const [showMoreProjects, setShowMoreProjects] = useState(false);
  const moreProjectsWrapRef = useRef<HTMLDivElement | null>(null);
  const isFirstMoreProjectsRender = useRef(true);

  // Animate the "more projects" deck open/closed by height, mirroring the
  // mobile deck. The wrapper stays mounted so the close tween can actually run.
  useLayoutEffect(() => {
    const wrap = moreProjectsWrapRef.current;
    if (!wrap) return;

    if (isFirstMoreProjectsRender.current) {
      gsap.set(wrap, {
        height: showMoreProjects ? "auto" : 0,
        opacity: showMoreProjects ? 1 : 0,
      });
      isFirstMoreProjectsRender.current = false;
      return;
    }

    if (showMoreProjects) {
      gsap.fromTo(
        wrap,
        { height: 0, opacity: 0 },
        {
          height: wrap.scrollHeight,
          opacity: 1,
          duration: 0.5,
          ease: "power3.inOut",
          onComplete: () => {
            gsap.set(wrap, { height: "auto" });
            ScrollTrigger.refresh();
          },
        }
      );
    } else {
      gsap.to(wrap, {
        height: 0,
        opacity: 0,
        duration: 0.5,
        ease: "power3.inOut",
        onComplete: () => ScrollTrigger.refresh(),
      });
    }
  }, [showMoreProjects]);

  // Collaboration form (Section 6)
  const [collabName, setCollabName] = useState("");
  const [collabEmail, setCollabEmail] = useState("");
  const [collabMessage, setCollabMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  // Achievement toast handlers
  const TOAST_DURATION_MS = 3500;
  const TOAST_EXIT_MS = 300;
  const MAX_VISIBLE_TOASTS = 3;

  const removeToast = (id: string) => {
    // play the exit animation, then drop the toast and promote a queued one
    setAchievementToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
    );
    setTimeout(() => {
      setAchievementToasts((prev) => prev.filter((t) => t.id !== id));
      visibleToastCountRef.current -= 1;
      const next = toastQueueRef.current.shift();
      if (next) displayToast(next);
    }, TOAST_EXIT_MS);
  };

  const displayToast = (toast: AchievementToast) => {
    visibleToastCountRef.current += 1;
    setAchievementToasts((prev) => [...prev, toast]);
    setTimeout(() => removeToast(toast.id), TOAST_DURATION_MS);
  };

  const showAchievement = (achievementId: string) => {
    // Check if achievement is already unlocked (session-wide)
    if (unlockedAchievementsRef.current.has(achievementId)) {
      return; // Already unlocked, don't show again
    }

    // Unlock the achievement (update ref immediately to avoid stale closures)
    unlockedAchievementsRef.current.add(achievementId);
    setUnlockedAchievements((prev) => new Set(prev).add(achievementId));

    // Show a toast (max 3 at once; extras wait in the queue)
    const meta = ACHIEVEMENT_TOAST_META[achievementId];
    if (meta) {
      const toast: AchievementToast = { id: achievementId, ...meta };
      if (visibleToastCountRef.current < MAX_VISIBLE_TOASTS) {
        displayToast(toast);
      } else {
        toastQueueRef.current.push(toast);
      }
    }

    // Score increments per achievement
    const xpMap: Record<string, number> = {
      // Generic/game flow
      "rulebook-raider": 30,
      // Section 2 specific
      face_of_hero: 150,
      keeper_of_stories: 100,
      power_unleashed: 75,
      // Section 3 specific (hint/password achievements removed)
      guild_explorer: 75,
      grandmasters_path: 90,
      // Section 4 specific
      pixel_perfect: 50,
      server_sensei: 50,
      data_tamer: 50,
      pipeline_pro: 50,
      model_maker: 50,
      utility_wizard: 50,
      // Section 5 specific
      code_cartographer: 75,
      quizmaster_crafter: 75,
      community_architect: 75,
      emotion_decoder: 75,
      suggestion_sage: 75,
      digital_persona_builder: 75,
      // Section 6
      alliance_formed: 100,
      // Section unlock-on-scroll
      identity_unlocked: 100,
      pathfinder: 100,
      skill_mastery: 100,
      quest_conqueror: 100,
      social_link_established: 100,
    };

    const gained = xpMap[achievementId] ?? 0;
    if (gained > 0) {
      setScore((prev) => prev + gained);
    }
  };

  // Mapping of achievement IDs to their corresponding section levels
  const achievementToSectionMap: Record<string, number> = {
    // Intro achievements
    "rulebook-raider": 1,
    // Section unlock achievements
    identity_unlocked: 2,
    pathfinder: 3,
    skill_mastery: 4,
    quest_conqueror: 5,
    social_link_established: 6,
    // Section 2 achievements
    face_of_hero: 2,
    keeper_of_stories: 2,
    power_unleashed: 2,
    // Section 3 achievements
    guild_explorer: 3,
    grandmasters_path: 3,
    // Section 4 achievements
    pixel_perfect: 4,
    server_sensei: 4,
    data_tamer: 4,
    pipeline_pro: 4,
    model_maker: 4,
    utility_wizard: 4,
    // Section 5 achievements
    code_cartographer: 5,
    quizmaster_crafter: 5,
    community_architect: 5,
    emotion_decoder: 5,
    suggestion_sage: 5,
    digital_persona_builder: 5,
    // Section 6 achievements
    alliance_formed: 6,
  };

  // Function to navigate to a specific section
  const navigateToSection = (sectionLevel: number) => {
    const sectionElement = document.querySelector(
      `[data-level="${sectionLevel}"]`
    );
    if (sectionElement) {
      if (smootherRef.current) {
        smootherRef.current.scrollTo(sectionElement, true, "top top");
      } else {
        sectionElement.scrollIntoView({ behavior: "smooth" });
      }
      setShowAchievementsModal(false);
    }
  };

  // Function to handle achievement click
  const handleAchievementClick = (achievementId: string) => {
    const sectionLevel = achievementToSectionMap[achievementId];
    if (sectionLevel) {
      navigateToSection(sectionLevel);
    }
  };

  // List of all achievements with display names and XP
  const allAchievements: {
    id: string;
    title: string;
    xp: number;
    section: string;
  }[] = [
    // Generic/game flow
    {
      id: "rulebook-raider",
      title: "Rulebook Raider",
      xp: 30,
      section: "Intro",
    },
    // Section unlock-on-scroll
    {
      id: "identity_unlocked",
      title: "Identity Unlocked",
      xp: 100,
      section: "Level 2",
    },
    { id: "pathfinder", title: "Pathfinder", xp: 100, section: "Level 3" },
    {
      id: "skill_mastery",
      title: "Skill Mastery",
      xp: 100,
      section: "Level 4",
    },
    {
      id: "quest_conqueror",
      title: "Quest Conqueror",
      xp: 100,
      section: "Level 5",
    },
    {
      id: "social_link_established",
      title: "Social Link",
      xp: 100,
      section: "Level 6",
    },
    // Section 2 specifics
    {
      id: "face_of_hero",
      title: "Face of the Hero",
      xp: 150,
      section: "Level 2",
    },
    {
      id: "keeper_of_stories",
      title: "Keeper of Stories",
      xp: 100,
      section: "Level 2",
    },
    {
      id: "power_unleashed",
      title: "Power Unleashed",
      xp: 75,
      section: "Level 2",
    },
    // Section 3 specifics (hint/password achievements removed)
    {
      id: "guild_explorer",
      title: "Guild Explorer",
      xp: 75,
      section: "Level 3",
    },
    {
      id: "grandmasters_path",
      title: "Grandmaster's Path",
      xp: 90,
      section: "Level 3",
    },
    // Section 4 completion
    {
      id: "skill_tree_master",
      title: "Skill Tree Master",
      xp: 200,
      section: "Level 4",
    },
    // Section 5 completion
    {
      id: "project_master",
      title: "Project Master",
      xp: 300,
      section: "Level 5",
    },
    // Section 6
    {
      id: "alliance_formed",
      title: "Alliance Formed",
      xp: 100,
      section: "Level 6",
    },
  ];

  // Escape closes any open modal
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowWhyHireMeModal(false);
        setShowAchievementsModal(false);
        setShowGameInstructions(false);
        setShowCodeRequestModal(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // GSAP smooth scrolling for the whole page
  const smootherRef = useRef<ScrollSmoother | null>(null);
  useLayoutEffect(() => {
    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 0.8,
      // Native 1:1 momentum on touch devices; smoothing only applies to wheel
      smoothTouch: false,
      effects: false,
    });
    smootherRef.current = smoother;
    return () => {
      smoother.kill();
      smootherRef.current = null;
    };
  }, []);

  // Unlock achievements when sections enter viewport
  useEffect(() => {
    const unlockByLevel: Record<number, () => void> = {
      2: () => showAchievement("identity_unlocked"),
      3: () => showAchievement("pathfinder"),
      4: () => showAchievement("skill_mastery"),
      5: () => showAchievement("quest_conqueror"),
      6: () => showAchievement("social_link_established"),
    };

    const triggers: ScrollTrigger[] = [];
    document
      .querySelectorAll<HTMLElement>("section[data-level]")
      .forEach((node) => {
        const level = Number(node.getAttribute("data-level"));
        const unlock = unlockByLevel[level];
        if (!unlock) return;
        triggers.push(
          ScrollTrigger.create({
            trigger: node,
            start: "top 50%",
            once: true,
            onEnter: unlock,
          })
        );
      });

    return () => triggers.forEach((t) => t.kill());
  }, []);

  const handleStartGame = () => {
    // Play spaceship sound
    if (spaceshipSoundRef.current) {
      spaceshipSoundRef.current.currentTime = 0;
      spaceshipSoundRef.current
        .play()
        .catch((e) => console.log("Audio play failed:", e));
    }

    // Show identity unlocked achievement for consistency with section unlocking
    showAchievement("identity_unlocked");

    // Scroll to next section
    if (nextSectionRef.current) {
      if (smootherRef.current) {
        smootherRef.current.scrollTo(nextSectionRef.current, true, "top top");
      } else {
        nextSectionRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleHowToPlay = () => {
    setShowGameInstructions(true);
    showAchievement("rulebook-raider");
  };

  const handleOpenResume = () => {
    window.open(RESUME_URL, "_blank");
  };

  // Section 2 Achievement Handlers
  const handleRevealAvatar = () => {
    setIsCardFlipped(true);
    if (!unlockedSection2Achievements.has("face_of_hero")) {
      showAchievement("face_of_hero");
    }
  };

  const handleUnlockLore = () => {
    setIsInfoCardFlipped(true);
    if (!unlockedSection2Achievements.has("keeper_of_stories")) {
      showAchievement("keeper_of_stories");
    }
  };

  const handleUnlockMetrics = () => {
    setIsAttributesCardFlipped(true);
    if (!unlockedSection2Achievements.has("power_unleashed")) {
      showAchievement("power_unleashed");
    }
  };

  // Section 3 Achievement Handlers (none for hint/password anymore)

  // Track which section occupies the viewport and update level indicator
  useEffect(() => {
    const triggers: ScrollTrigger[] = [];

    document
      .querySelectorAll<HTMLElement>("section[data-level]")
      .forEach((section) => {
        const level = Number(section.getAttribute("data-level"));
        if (Number.isNaN(level)) return;
        triggers.push(
          ScrollTrigger.create({
            trigger: section,
            start: "top 60%",
            end: "bottom 40%",
            onToggle: (self) => {
              if (self.isActive) {
                setCurrentLevel(level);
                // Control background visibility to avoid overlapping canvases
                setIsSection1Visible(level === 1);
                setIsSection2Visible(level === 2);
                setIsSection3Visible(level === 3);
              }
            },
          })
        );
      });

    return () => triggers.forEach((t) => t.kill());
  }, []);

  // Mobile carousel auto-animation effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = parseInt(
              entry.target.getAttribute("data-card-index") || "0"
            );
            setVisibleCardIndex(cardIndex);
            setCarouselIndex(cardIndex);
          }
        });
      },
      {
        root: null,
        threshold: 0.5,
        rootMargin: "-50px 0px -50px 0px",
      }
    );

    // Observe all mobile carousel cards
    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Section 3 Carousel Navigation Achievements
  const handleCarouselNavigation = (newIndex: number) => {
    if (newIndex === 1 && !unlockedSection3Achievements.has("guild_explorer")) {
      showAchievement("guild_explorer");
    } else if (
      newIndex === 2 &&
      !unlockedSection3Achievements.has("grandmasters_path")
    ) {
      showAchievement("grandmasters_path");
    }
  };

  const handleSkillClick = (skillName: string) => {
    setUnlockedSkills((prev) => {
      const newSkills = {
        ...prev,
        [skillName]: true, // Once unlocked, stays unlocked
      };

      // Check if all skills are now unlocked
      const allSkillsUnlocked = Object.values(newSkills).every(
        (skill) => skill
      );
      if (
        allSkillsUnlocked &&
        !unlockedSection4Achievements.has("skill_tree_master")
      ) {
        showAchievement("skill_tree_master");
      }

      return newSkills;
    });
  };

  const handleUnlockAllSkills = () => {
    setUnlockedSkills({
      frontend: true,
      backend: true,
      database: true,
      devops: true,
      ai: true,
      tools: true,
    });

    // Trigger section completion achievement
    if (!unlockedSection4Achievements.has("skill_tree_master")) {
      showAchievement("skill_tree_master");
    }
  };

  const handleProjectLink = (projectId: string) => {
    // Show code request modal for private portfolio website
    if (projectId === "personalwebsite") {
      setShowCodeRequestModal(true);
      return;
    }

    const project = projects.find((p) => p.id === projectId);
    const url = project?.liveUrl ?? project?.githubUrl;
    if (url) {
      window.open(url, "_blank");
    }
  };

  // Removed: career progression unlock handler (no longer gated)

  // Terminal command handler
  const handleTerminalCommand = (command: string) => {
    const cmd = command.toLowerCase().trim();
    let response = "";

    switch (cmd) {
      case "help":
        response = `Available commands:
  help - Show this help message
  about - Learn about Pranav
  skills - View technical skills
  projects - See project portfolio with GitHub links
  github - Access GitHub profile
  contact - Get contact information
  social - View social profiles
  interests - Discover personal interests
  resume - Download resume
  clear - Clear terminal history`;
        break;
      case "about":
        response = `Pranav Reddy Gaddam - Full Stack Developer & AI Enthusiast
Master's Student at San Jose State University
Passionate about building innovative solutions with AI and modern web technologies.`;
        break;
      case "skills":
        response = `Technical Arsenal:
Frontend: React, TypeScript, Tailwind CSS, Next.js
Backend: FastAPI, Node.js, Python, PostgreSQL
AI/ML: OpenAI APIs, LangChain, Vector Databases
DevOps: Docker, AWS, Git, CI/CD
Tools: Vite, Webpack, Figma, VS Code`;
        break;
      case "projects":
        response = `Featured Projects:
- GitBridge - AI-powered GitHub repository analyzer
   GitHub: https://github.com/pranavreddygaddam/gitbridge

- Hirely - AI interview preparation platform  
   GitHub: https://github.com/pranavreddygaddam/hirely

- Nexus - 3D startup analysis tool
   GitHub: https://github.com/pranavreddygaddam/nexus

- Bloom - AI quiz generation platform
   GitHub: https://github.com/pranavreddygaddam/bloom

- Bay Window - SF building & renter lookup tool
   Website: https://baywindow.pranavreddygaddam.com/

- Portfolio - Gamified personal website
   GitHub: https://github.com/pranavreddygaddam/gamified-portfolio

Type 'github' to open main GitHub profile`;
        break;
      case "github":
        response = `Opening GitHub profile...`;
        setTimeout(() => {
          window.open("https://github.com/PranavReddyGaddam", "_blank");
        }, 1000);
        break;
      case "resume":
        response = `Opening resume download...`;
        setTimeout(() => {
          window.open("/Pranav_Reddy_Gaddam_Resume_FT_Master.pdf", "_blank");
        }, 1000);
        break;
      case "contact":
        response = `Get in touch:
Email: pranavreddy.gaddam@sjsu.edu
GitHub: github.com/PranavReddyGaddam
LinkedIn: linkedin.com/in/pranav-reddy-gaddam-69338321b/
Location: San Jose, California

Type 'github' to open GitHub profile directly`;
        break;
      case "social":
        response = `Social Command Center:
GitHub: Code repositories and contributions
LinkedIn: Professional network and experience
Instagram: Personal journey and lifestyle
Twitter: Tech thoughts and insights

Type 'github' to open GitHub profile directly`;
        break;
      case "interests":
        response = `Beyond Coding:
Cinema - Exploring legendary films and hidden gems
Sports - Cricket, basketball and athletic pursuits
Cycling - Urban adventures and scenic trails
Travel - Discovering new places and cultures`;
        break;
      case "clear":
        setTerminalHistory([]);
        return;
      default:
        if (cmd) {
          response = `Command not recognized: ${cmd}
Type 'help' to see available commands.`;
        } else {
          return;
        }
    }

    setTerminalHistory((prev) => [...prev, `> ${command}`, response]);
  };

  // Handle collaboration form submit (Section 6)
  const handleCollabSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const trimmedName = collabName.trim();
    const trimmedEmail = collabEmail.trim();
    const trimmedMessage = collabMessage.trim();

    if (!trimmedEmail || !trimmedMessage) {
      alert("Please provide your email and a brief message.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Check if EmailJS is properly configured
      if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
        throw new Error(
          "EmailJS configuration is missing. Please check your environment variables."
        );
      }

      // Initialize EmailJS with your public key
      emailjs.init(EMAILJS_PUBLIC_KEY);

      // Prepare template parameters
      const templateParams = {
        name: trimmedName || "Anonymous",
        email: trimmedEmail,
        message: trimmedMessage,
        title: "Collaboration Request from Portfolio",
        time: new Date().toLocaleString(),
      };

      // Send email using EmailJS
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      if (response.status === 200) {
        setSubmitStatus("success");
        // Clear form
        setCollabName("");
        setCollabEmail("");
        setCollabMessage("");

        // Trigger Section 6 achievement on successful submit
        showAchievement("alliance_formed");
      } else {
        throw new Error("Email sending failed");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle code request submission
  const handleCodeRequestSubmit = async (requestData: { name: string; from: string; reason: string }) => {
    setIsSubmittingCodeRequest(true);
    
    try {
      // Check if EmailJS is properly configured
      if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
        throw new Error(
          "EmailJS configuration is missing. Please check your environment variables."
        );
      }

      // Initialize EmailJS with your public key
      emailjs.init(EMAILJS_PUBLIC_KEY);

      // Prepare template parameters matching the existing contact form template
      const templateParams = {
        name: requestData.name,
        email: "no-reply@portfolio.com", // Placeholder since no email is collected
        message: `From: ${requestData.from}\n\nReason for code request:\n${requestData.reason}\n\nProject: Portfolio Website`,
        title: "Code Request from Portfolio",
        time: new Date().toLocaleString(),
      };

      // Send email using EmailJS
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      if (response.status === 200) {
        alert("Code request sent successfully! I'll get back to you soon.");
        setShowCodeRequestModal(false);
      } else {
        throw new Error("Failed to send request");
      }
    } catch (error) {
      console.error("Error sending code request:", error);
      alert("Failed to send request. Please try again later.");
    } finally {
      setIsSubmittingCodeRequest(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 relative">
      {/* Navbar */}
      <Navbar
        currentLevel={currentLevel}
        totalLevels={totalLevels}
        score={score}
        onOpenAchievements={() => setShowAchievementsModal(true)}
      />

      {/* Spaceship Start Sound */}
      <audio
        ref={spaceshipSoundRef}
        src="https://assets.mixkit.co/sfx/preview/mixkit-rocket-launch-shuttle-takeoff-1641.mp3"
        preload="auto"
      />

      <div id="smooth-wrapper">
      <div id="smooth-content">

      {/* Section 1: Landing Page */}
      <section
        data-level={1}
        className="hero-section relative z-10 min-h-screen flex flex-col justify-center px-[50px] overflow-hidden"
      >
        {/* Decorative gradient shapes */}
        <div className="hero-shapes" aria-hidden="true">
          <div className="hero-blob hero-blob--orange" />
          <div className="hero-blob hero-blob--violet" />
          <div className="hero-blob hero-blob--green" />
          <div className="hero-star" />
          <div className="hero-astrix">✳</div>
          <div className="hero-leaf" />
        </div>

        {/* Vertical column rules */}
        <div className="hero-columns" aria-hidden="true">
          <span /><span /><span /><span />
        </div>

        {/* Top meta bar */}
        <div className="hero-meta">
          <a href="/" className="hero-logo">
            pranav reddy
            <br />
            gaddam
          </a>
          <span className="hero-meta-tag">Software engineer</span>
          <span className="hero-meta-loc">Based in San Jose, California</span>
          <nav className="hero-nav">
            <a href="#home" className="hero-nav-link is-active">Home</a>
            <a href="#projects" className="hero-nav-link">Work</a>
            <a href="#about" className="hero-nav-link">About</a>
            <a href="#contact" className="hero-nav-link">Contact</a>
          </nav>
        </div>

        {/* Centered hero content */}
        <div className="relative z-10 w-full flex flex-col items-center text-center">
          <span className="pill-button">Full-stack &amp; AI engineering</span>

          <h1 className="hero-title">
            I{" "}
            <a href="#about" className="hero-title-img hero-title-img--me" aria-label="About me" />
            build living, breathing
            <br />
            software{" "}
            <a href="#projects" className="hero-title-img hero-title-img--work" aria-label="My work" />
            for teams that want
            <br />
            to ship, not just plan.
          </h1>
        </div>
      </section>

      {/* Transition Section - Smooth Blend */}
      <section className="relative z-10 h-32 bg-cream">
        <div className="absolute inset-0 "></div>
      </section>

      {/* Section 2: Character Stats */}
      <section
        data-level={2}
        ref={nextSectionRef}
        className="relative z-10 min-h-screen bg-cream px-4 py-16"
      >

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="font-pressstart2p text-2xl sm:text-3xl md:text-4xl text-gray-900 border-2 border-blue-600 bg-white/80 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-lg inline-block">
              LEVEL 2: CHARACTER STATS
            </h2>
          </div>

          {/* Character Card Container */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 items-stretch max-w-7xl mx-auto px-4">
            {/* Left Column: Character Portrait */}
            <div className="col-span-1 flex">
              <div className="relative w-full min-h-[400px] perspective-1000 flex-1">
                <div
                  className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                    isCardFlipped ? "rotate-y-180" : ""
                  }`}
                >
                  {/* Card Back (Hidden Side) */}
                  <div className="absolute inset-0 w-full h-full backface-hidden">
                    <div className="border border-blue-600 bg-blue-50 backdrop-blur-sm rounded-lg h-full flex flex-col items-center justify-center p-6">
                      <div className="text-center">
                        <div className="flex justify-center mb-4">
                          <ShieldUser className="w-16 h-16 text-blue-700" />
                        </div>
                        <h3 className="font-pressstart2p text-gray-900 text-base md:text-lg mb-4">
                          HIDDEN CHARACTER
                        </h3>
                        <p className="font-pixellari text-blue-700 text-xs md:text-sm mb-6">
                          Click to reveal the character
                        </p>
                        <button
                          onClick={handleRevealAvatar}
                          className="font-pressstart2p bg-blue-600 hover:bg-blue-700 text-gray-900 px-4 py-2 md:px-6 md:py-3 rounded border border-blue-600 transition-colors text-xs md:text-sm"
                        >
                          REVEAL AVATAR
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Card Front (Character Portrait) */}
                  <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                    <div className="bg-blue-50 border border-blue-600 rounded-lg overflow-hidden h-full flex flex-col">
                      {/* Image area */}
                      <div className="flex-1 min-h-0">
                        <img
                          src="/projects/Pranav.jpeg"
                          alt="Character Portrait"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Bottom stats section */}
                      <div className="flex-shrink-0 p-3 bg-blue-50 flex flex-col justify-center">
                        {/* Name & Level */}
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-gray-900 font-pressstart2p text-xs">
                            Pranav Reddy Gaddam
                          </h4>
                          <p className="text-blue-700 font-pressstart2p text-xs">
                            LVL 24
                          </p>
                        </div>

                        {/* HP & MP side by side */}
                        <div className="flex items-center gap-2 md:gap-4">
                          {/* HP */}
                          <div className="flex items-center gap-1">
                            <span className="text-green-700 text-xs font-pressstart2p">
                              HP
                            </span>
                            <div className="w-16 md:w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div className="w-4/5 h-full bg-green-500 rounded-full"></div>
                            </div>
                          </div>

                          {/* MP */}
                          <div className="flex items-center gap-1">
                            <span className="text-cyan-700 text-xs font-pressstart2p">
                              MP
                            </span>
                            <div className="w-16 md:w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div className="w-2/3 h-full bg-cyan-500 rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Lanyard "Techie for Hire" Card - Appears when portrait is unlocked */}
                    {isCardFlipped && (
                      <div className="absolute -top-2 -right-2 z-20">
                        {/* Lanyard cord */}
                        <div className="absolute top-2 left-2 w-1 h-16 bg-gray-600 rounded-full transform rotate-45 origin-top"></div>

                        {/* Stamped card hanging from lanyard */}
                        <div
                          className="relative transform rotate-6 hover:rotate-3 transition-transform duration-300 cursor-pointer"
                          role="button"
                          tabIndex={0}
                          onClick={() => setShowWhyHireMeModal(true)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ")
                              setShowWhyHireMeModal(true);
                          }}
                        >
                          {/* Stamp shadow effect */}
                          <div className="absolute inset-0 bg-red-50 blur-lg transform translate-x-1 translate-y-1"></div>

                          {/* Main stamp card - smaller size for lanyard */}
                          <div className="relative bg-gradient-to-br from-red-600 to-red-800 border-3 border-red-600 rounded-md p-3 shadow-xl">
                            {/* Stamp texture overlay */}
                            <div className="absolute inset-0 bg-red-50 rounded-md"></div>

                            {/* Ink splatter effects */}
                            <div className="absolute top-1 left-1 w-2 h-2 bg-red-50 rounded-full blur-xs"></div>
                            <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-red-50 rounded-full blur-xs"></div>

                            {/* Main content */}
                            <div className="relative z-10 text-center">
                              <div className="transform -rotate-1">
                                <h3 className="font-pressstart2p text-gray-900 text-[10px] mb-1 tracking-wider">
                                  WHY YOU
                                </h3>
                                <div className="border-t border-gray-300 border-b border-gray-300 py-1 my-1">
                                  <h4 className="font-pressstart2p text-yellow-700 text-[8px] font-bold tracking-widest">
                                    SHOULD HIRE ME
                                  </h4>
                                </div>
                                <div className="flex justify-center items-center gap-1 mt-1">
                                  <div className="w-4 h-px bg-white/60"></div>
                                  <span className="font-pixellari text-gray-700 text-[8px]">
                                    CLICK ME
                                  </span>
                                  <div className="w-4 h-px bg-white/60"></div>
                                </div>
                              </div>
                            </div>

                            {/* Stamp edges */}
                            <div className="absolute inset-0 border border-gray-200 rounded-md pointer-events-none"></div>
                          </div>

                          {/* Additional ink drops */}
                          <div className="absolute -top-0.5 -right-1 w-3 h-3 bg-red-50 rounded-full blur-sm"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Column: Character Info */}
            <div className="col-span-1 flex">
              <div className="relative w-full min-h-[400px] perspective-1000 flex-1">
                <div
                  className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                    isInfoCardFlipped ? "rotate-y-180" : ""
                  }`}
                >
                  {/* Card Back (Hidden Side) */}
                  <div className="absolute inset-0 w-full h-full backface-hidden">
                    <div className="border border-blue-600 bg-blue-50 backdrop-blur-sm rounded-lg h-full flex flex-col items-center justify-center p-6">
                      <div className="text-center">
                        <div className="flex justify-center mb-4">
                          <BookOpenText className="w-16 h-16 text-blue-700" />
                        </div>
                        <h3 className="font-pressstart2p text-gray-900 text-base md:text-lg mb-4">
                          CHARACTER LORE
                        </h3>
                        <p className="font-pixellari text-blue-700 text-xs md:text-sm mb-6">
                          Uncover backstory
                        </p>
                        <button
                          onClick={handleUnlockLore}
                          className="font-pressstart2p bg-blue-600 hover:bg-blue-700 text-gray-900 px-4 py-2 md:px-6 md:py-3 rounded border border-blue-600 transition-colors text-xs md:text-sm"
                        >
                          UNLOCK LORE
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Card Front (Character Info) */}
                  <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                    <div className="bg-blue-50 border border-blue-600 rounded-lg p-4 h-full flex flex-col">
                      <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                        <h3 className="font-pressstart2p text-gray-900 text-base">
                          CHARACTER INFO
                        </h3>
                      </div>
                      <div className="font-pressstart2p space-y-3 text-gray-600 text-xs md:text-[10px] text-left leading-relaxed overflow-y-auto flex-1 min-h-0">
                        <p className="break-words">
                          A full-stack engineer drawn to the hard parts of AI
                          systems, the agent loops, the tool orchestration,
                          the context pipelines that make intelligent software
                          actually work. Builds with Python, TypeScript, and
                          FastAPI, and cares as much about how systems behave
                          under pressure as how they demo. Just graduated with a Master's in Applied Data Science at San
                          Jose State University.
                        </p>
                        <p className="break-words">
                          Plays a builder class: prototypes fast, reads the
                          docs, debugs with stubborn patience, and doesn't ship
                          things that fall over. Equally comfortable deep in a
                          backend service or polishing the last pixel of a
                          frontend. Always chasing the next thing worth
                          learning — usually found experimenting with whatever
                          the AI ecosystem shipped this week.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Attributes Panel with Flip */}
            <div className="col-span-1 flex">
              <div className="relative w-full min-h-[400px] perspective-1000 flex-1">
                <div
                  className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                    isAttributesCardFlipped ? "rotate-y-180" : ""
                  }`}
                >
                  {/* Card Back (Hidden Side) */}
                  <div className="absolute inset-0 w-full h-full backface-hidden">
                    <div className="border border-blue-600 bg-blue-50 backdrop-blur-sm rounded-lg h-full flex flex-col items-center justify-center p-6">
                      <div className="text-center">
                        <div className="flex justify-center mb-4">
                          <ChartColumnIncreasing className="w-16 h-16 text-blue-700" />
                        </div>
                        <h3 className="font-pressstart2p text-gray-900 text-base md:text-lg mb-4">
                          POWER METRICS
                        </h3>
                        <p className="font-pixellari text-blue-700 text-xs md:text-sm mb-6">
                          See True Power
                        </p>
                        <button
                          onClick={handleUnlockMetrics}
                          className="font-pressstart2p bg-blue-600 hover:bg-blue-700 text-gray-900 px-4 py-2 md:px-6 md:py-3 rounded border border-blue-600 transition-colors text-xs md:text-sm"
                        >
                          UNLOCK METRICS
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Card Front (Attributes) */}
                  <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                    <div className="bg-blue-50 border border-blue-600 rounded-lg p-4 h-full flex flex-col">
                      <h3 className="font-pressstart2p text-gray-900 text-base mb-3 flex-shrink-0">
                        GITHUB STATS
                      </h3>
                      <div className="flex-1 min-h-0 overflow-y-auto">
                        <GitHubCommitChart />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Progression Path */}
      <section
        data-level={3}
        className="relative z-10 min-h-screen bg-cream px-4 py-16"
      >

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="font-pressstart2p text-2xl sm:text-3xl md:text-4xl text-gray-900 border-2 border-yellow-600 bg-white/80 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-lg inline-block">
              LEVEL 3: CAREER PATH
            </h2>
            <p className="font-pressstart2p text-gray-900 text-sm mt-4">
              ACADEMIC ACHIEVEMENTS AND PROFESSIONAL JOURNEY
            </p>
          </div>

          {/* Career Progression Timeline - Redesigned for Better UX */}
          <div className="flex justify-center items-center mt-8 w-full px-4">
            <div className="w-full max-w-6xl">
              {/* Timeline Navigation - Desktop Only */}
              <div className="hidden md:flex flex-wrap justify-center gap-4 mb-8">
                {[
                  { id: "bachelors", title: "BACHELOR'S", color: "green" },
                  { id: "masters", title: "MASTER'S", color: "yellow" },
                  { id: "experience", title: "EXPERIENCE", color: "blue" },
                ].map((item) => (
                  <Button
                    key={item.id}
                    onClick={() => {
                      const index =
                        item.id === "bachelors"
                          ? 0
                          : item.id === "masters"
                          ? 1
                          : 2;
                      setCarouselIndex(index);
                      handleCarouselNavigation(index);
                    }}
                    variant={
                      carouselIndex ===
                      (item.id === "bachelors"
                        ? 0
                        : item.id === "masters"
                        ? 1
                        : 2)
                        ? "default"
                        : "outline"
                    }
                    size="lg"
                    font="retro"
                    className={`${
                      carouselIndex ===
                      (item.id === "bachelors"
                        ? 0
                        : item.id === "masters"
                        ? 1
                        : 2)
                        ? `bg-${item.color}-600 border-${item.color}-400 text-gray-900`
                        : `border-${item.color}-400 text-${item.color}-400 hover:bg-${item.color}-600 hover:text-gray-900`
                    } px-6 py-3 transition-all duration-300 hover:scale-105`}
                  >
                    {item.title}
                  </Button>
                ))}
              </div>

              {/* Content Cards - Original Desktop Grid + Mobile Carousel */}
              {/* Mobile Carousel - Hidden on Desktop */}
              <div className="md:hidden">
                <div className="flex gap-4 overflow-x-auto pb-4 px-1 snap-x snap-mandatory scrollbar-hide">
                  {/* Master's Card - Show First on Mobile */}
                  <div
                    ref={(el) => {
                      cardRefs.current[1] = el;
                    }}
                    data-card-index="1"
                    className={`cursor-pointer transform transition-all duration-500 flex-shrink-0 w-[72vw] max-w-72 snap-center ${
                      visibleCardIndex === 1
                        ? "scale-105 opacity-100"
                        : "scale-95 opacity-60"
                    }`}
                  >
                    <Card className="bg-yellow-50 border-yellow-600 h-full hover:border-yellow-500">
                      <CardContent className="p-4 h-full">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="font-pressstart2p text-gray-900 text-lg">
                            MASTER'S
                          </h3>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <h4 className="font-pressstart2p text-yellow-700 text-xs mb-1">
                              Current Quest
                            </h4>
                            <p className="font-pixellari text-gray-900 text-sm">
                              Master's in Applied Data Science
                            </p>
                          </div>

                          <div>
                            <h4 className="font-pressstart2p text-yellow-700 text-xs mb-1">
                              Training Grounds
                            </h4>
                            <p className="font-pixellari text-gray-900 text-sm">
                              San Jose State University
                            </p>
                          </div>

                          <div>
                            <h4 className="font-pressstart2p text-yellow-700 text-xs mb-1">
                              Campaign Duration
                            </h4>
                            <p className="font-pixellari text-gray-900 text-sm">
                              Aug 2024 – May 2026
                            </p>
                          </div>

                          <div>
                            <h4 className="font-pressstart2p text-yellow-700 text-xs mb-1">
                              Stats
                            </h4>
                            <p className="font-pixellari text-gray-900 text-sm">
                              CGPA: 3.84 / 4.0
                            </p>
                          </div>

                          <div>
                            <h4 className="font-pressstart2p text-yellow-700 text-xs mb-2">
                              Skills Unlocked
                            </h4>
                            <ul className="space-y-1 font-pixellari text-gray-900 text-xs">
                              <li>- Big Data, Machine Learning</li>
                              <li>- Data Warehousing & Pipelines</li>
                              <li>- Applied Statistics, Analytics Strategy</li>
                              <li>- Data-Driven Decision Making</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Bachelor's Card */}
                  <div
                    ref={(el) => {
                      cardRefs.current[0] = el;
                    }}
                    data-card-index="0"
                    className={`cursor-pointer transform transition-all duration-500 flex-shrink-0 w-[72vw] max-w-72 snap-center ${
                      visibleCardIndex === 0
                        ? "scale-105 opacity-100"
                        : "scale-95 opacity-60"
                    }`}
                  >
                    <Card className="bg-green-50 border-green-600 h-full hover:border-green-500">
                      <CardContent className="p-4 h-full">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="font-pressstart2p text-gray-900 text-lg">
                            BACHELOR'S
                          </h3>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <h4 className="font-pressstart2p text-green-700 text-xs mb-1">
                              Quest Title
                            </h4>
                            <p className="font-pixellari text-gray-900 text-sm">
                              Bachelor's in Computer Science
                            </p>
                          </div>

                          <div>
                            <h4 className="font-pressstart2p text-green-700 text-xs mb-1">
                              Training Grounds
                            </h4>
                            <p className="font-pixellari text-gray-900 text-sm">
                              St. Martin's Engineering College
                            </p>
                          </div>

                          <div>
                            <h4 className="font-pressstart2p text-green-700 text-xs mb-1">
                              Campaign Duration
                            </h4>
                            <p className="font-pixellari text-gray-900 text-sm">
                              Aug 2019 – May 2023
                            </p>
                          </div>

                          <div>
                            <h4 className="font-pressstart2p text-green-700 text-xs mb-1">
                              Stats
                            </h4>
                            <p className="font-pixellari text-gray-900 text-sm">
                              B. Tech in Computer Science
                            </p>
                          </div>

                          <div>
                            <h4 className="font-pressstart2p text-green-700 text-xs mb-2">
                              Skills Unlocked
                            </h4>
                            <ul className="space-y-1 font-pixellari text-gray-900 text-xs">
                              <li>- Data Structures & Algorithms</li>
                              <li>- Web Development, Databases</li>
                              <li>- Machine Learning, AI Basics</li>
                              <li>- Software Engineering</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Experience Card */}
                  <div
                    ref={(el) => {
                      cardRefs.current[2] = el;
                    }}
                    data-card-index="2"
                    className={`cursor-pointer transform transition-all duration-500 flex-shrink-0 w-[72vw] max-w-72 snap-center ${
                      visibleCardIndex === 2
                        ? "scale-105 opacity-100"
                        : "scale-95 opacity-60"
                    }`}
                  >
                    <Card className="bg-blue-50 border-blue-600 h-full hover:border-blue-500">
                      <CardContent className="p-4 h-full">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="font-pressstart2p text-gray-900 text-lg">
                            EXPERIENCE
                          </h3>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <h4 className="font-pressstart2p text-blue-700 text-xs mb-1">
                              Quest Title
                            </h4>
                            <p className="font-pixellari text-gray-900 text-sm">
                              Software Engineer (Data)
                            </p>
                          </div>

                          <div>
                            <h4 className="font-pressstart2p text-blue-700 text-xs mb-1">
                              Guild Location
                            </h4>
                            <p className="font-pixellari text-gray-900 text-sm">
                              VE Projects Pvt Ltd
                            </p>
                          </div>

                          <div>
                            <h4 className="font-pressstart2p text-blue-700 text-xs mb-1">
                              Campaign Duration
                            </h4>
                            <p className="font-pixellari text-gray-900 text-sm">
                              Aug 2023 – Jul 2024
                            </p>
                          </div>

                          <div>
                            <h4 className="font-pressstart2p text-blue-700 text-xs mb-2">
                              Core Technologies
                            </h4>
                            <ul className="space-y-1 font-pixellari text-gray-900 text-xs">
                              <li>- Python,SQL,R</li>
                              <li>- AWS, Docker</li>
                              <li>- Snowflake, RedShift, Kafka, Spark</li>
                              <li>- Git, CI/CD</li>
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-pressstart2p text-blue-700 text-xs mb-2">
                              Key Contributions
                            </h4>
                            <ul className="space-y-1 font-pixellari text-gray-900 text-xs">
                              <li>- Migrated Databases, Saved Money</li>
                              <li>- Built Data Pipelines, Resolved Bugs</li>
                              <li>
                                - Developed Quality Systems, Automated reporting
                              </li>
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-pressstart2p text-blue-700 text-xs mb-1">
                              Expertise Level
                            </h4>
                            <p className="font-pixellari text-gray-900 text-sm">
                              {" "}
                              SDE-1
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Desktop Grid - Hidden on Mobile */}
              <div className="hidden md:grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
                {/* Bachelor's Card - Desktop */}
                <div
                  onClick={() => {
                    setCarouselIndex(0);
                    handleCarouselNavigation(0);
                  }}
                  className={`cursor-pointer transform transition-all duration-500 ${
                    carouselIndex === 0
                      ? "scale-105 opacity-100"
                      : "scale-95 opacity-60"
                  }`}
                >
                  <Card className="bg-green-50 border-green-600 h-full hover:border-green-500">
                    <CardContent className="p-4 h-full">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-pressstart2p text-gray-900 text-lg">
                          BACHELOR'S
                        </h3>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h4 className="font-pressstart2p text-green-700 text-xs mb-1">
                            Quest Title
                          </h4>
                          <p className="font-pixellari text-gray-900 text-sm">
                            Bachelor's in Computer Science
                          </p>
                        </div>

                        <div>
                          <h4 className="font-pressstart2p text-green-700 text-xs mb-1">
                            Training Grounds
                          </h4>
                          <p className="font-pixellari text-gray-900 text-sm">
                            St. Martin's Engineering College
                          </p>
                        </div>

                        <div>
                          <h4 className="font-pressstart2p text-green-700 text-xs mb-1">
                            Campaign Duration
                          </h4>
                          <p className="font-pixellari text-gray-900 text-sm">
                            Aug 2019 – May 2023
                          </p>
                        </div>

                        <div>
                          <h4 className="font-pressstart2p text-green-700 text-xs mb-1">
                            Stats
                          </h4>
                          <p className="font-pixellari text-gray-900 text-sm">
                            B. Tech in Computer Science
                          </p>
                        </div>

                        <div>
                          <h4 className="font-pressstart2p text-green-700 text-xs mb-2">
                            Skills Unlocked
                          </h4>
                          <ul className="space-y-1 font-pixellari text-gray-900 text-xs">
                            <li>- Data Structures & Algorithms</li>
                            <li>- Web Development, Databases</li>
                            <li>- Machine Learning, AI Basics</li>
                            <li>- Software Engineering</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Master's Card - Desktop */}
                <div
                  onClick={() => {
                    setCarouselIndex(1);
                    handleCarouselNavigation(1);
                  }}
                  className={`cursor-pointer transform transition-all duration-500 ${
                    carouselIndex === 1
                      ? "scale-105 opacity-100"
                      : "scale-95 opacity-60"
                  }`}
                >
                  <Card className="bg-yellow-50 border-yellow-600 h-full hover:border-yellow-500">
                    <CardContent className="p-4 h-full">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-pressstart2p text-gray-900 text-lg">
                          MASTER'S
                        </h3>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h4 className="font-pressstart2p text-yellow-700 text-xs mb-1">
                            Current Quest
                          </h4>
                          <p className="font-pixellari text-gray-900 text-sm">
                            Master's in Applied Data Science
                          </p>
                        </div>

                        <div>
                          <h4 className="font-pressstart2p text-yellow-700 text-xs mb-1">
                            Training Grounds
                          </h4>
                          <p className="font-pixellari text-gray-900 text-sm">
                            San Jose State University
                          </p>
                        </div>

                        <div>
                          <h4 className="font-pressstart2p text-yellow-700 text-xs mb-1">
                            Campaign Duration
                          </h4>
                          <p className="font-pixellari text-gray-900 text-sm">
                            Aug 2024 – May 2026
                          </p>
                        </div>

                        <div>
                          <h4 className="font-pressstart2p text-yellow-700 text-xs mb-1">
                            Stats
                          </h4>
                          <p className="font-pixellari text-gray-900 text-sm">
                            CGPA: 3.84 / 4.0
                          </p>
                        </div>

                        <div>
                          <h4 className="font-pressstart2p text-yellow-700 text-xs mb-2">
                            Skills Unlocked
                          </h4>
                          <ul className="space-y-1 font-pixellari text-gray-900 text-xs">
                            <li>- Big Data, Machine Learning</li>
                            <li>- Data Warehousing & Pipelines</li>
                            <li>- Applied Statistics, Analytics Strategy</li>
                            <li>- Data-Driven Decision Making</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Experience Card - Desktop */}
                <div
                  onClick={() => {
                    setCarouselIndex(2);
                    handleCarouselNavigation(2);
                  }}
                  className={`cursor-pointer transform transition-all duration-500 ${
                    carouselIndex === 2
                      ? "scale-105 opacity-100"
                      : "scale-95 opacity-60"
                  }`}
                >
                  <Card className="bg-blue-50 border-blue-600 h-full hover:border-blue-500">
                    <CardContent className="p-4 h-full">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-pressstart2p text-gray-900 text-lg">
                          EXPERIENCE
                        </h3>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h4 className="font-pressstart2p text-blue-700 text-xs mb-1">
                            Quest Title
                          </h4>
                          <p className="font-pixellari text-gray-900 text-sm">
                            Software Engineer (Data)
                          </p>
                        </div>

                        <div>
                          <h4 className="font-pressstart2p text-blue-700 text-xs mb-1">
                            Guild Location
                          </h4>
                          <p className="font-pixellari text-gray-900 text-sm">
                            VE Projects Pvt Ltd
                          </p>
                        </div>

                        <div>
                          <h4 className="font-pressstart2p text-blue-700 text-xs mb-1">
                            Campaign Duration
                          </h4>
                          <p className="font-pixellari text-gray-900 text-sm">
                            Aug 2023 – Jul 2024
                          </p>
                        </div>

                        <div>
                          <h4 className="font-pressstart2p text-blue-700 text-xs mb-2">
                            Core Technologies
                          </h4>
                          <ul className="space-y-1 font-pixellari text-gray-900 text-xs">
                            <li>- Python,SQL</li>
                            <li>- AWS, Docker</li>
                            <li>- Snowflake, RedShift, Kafka, Spark</li>
                            <li>- Git, CI/CD</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-pressstart2p text-blue-700 text-xs mb-2">
                            Key Contributions
                          </h4>
                          <ul className="space-y-1 font-pixellari text-gray-900 text-xs">
                            <li>- Migrated Databases, Saved Money</li>
                            <li>- Built Data Pipelines, Resolved Bugs</li>
                            <li>
                              - Developed Quality Systems, Automated reporting
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-pressstart2p text-blue-700 text-xs mb-1">
                            Expertise Level
                          </h4>
                          <p className="font-pixellari text-gray-900 text-sm">
                            SDE-1
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Progress Indicator - Desktop Only */}
              <div className="hidden md:flex justify-center mt-8">
                <div className="flex gap-2">
                  {[0, 1, 2].map((idx) => (
                    <div
                      key={idx}
                      className={`h-2 w-8 rounded-full transition-all duration-300 ${
                        carouselIndex === idx
                          ? "bg-yellow-400 scale-110"
                          : "bg-gray-600 hover:bg-gray-500"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Skill Tree */}
      <section
        data-level={4}
        className="relative z-10 min-h-screen bg-cream px-4 py-16"
      >
        {/* State for unlocked skills */}
        <script>
          {`
             window.unlockedSkills = window.unlockedSkills || {};
           `}
        </script>

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 relative">
            <h2 className="font-pressstart2p text-2xl sm:text-3xl md:text-4xl text-gray-900 border-2 border-green-600 bg-white/80 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-lg inline-block">
              LEVEL 4: SKILL TREE
            </h2>
            <p className="font-pressstart2p text-gray-900 text-sm mt-4">
              CLICK ON SKILLS TO UNLOCK THEM AND EARN EXPERIENCE POINTS
            </p>

          </div>

          {/* Skill Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {/* Frontend Skills */}
            <div
              className={`border rounded-lg p-6 transition-all duration-300 cursor-pointer relative overflow-hidden ${
                unlockedSkills.frontend
                  ? "bg-blue-50 border-blue-600 hover:border-blue-500"
                  : "bg-white border-green-600 hover:border-green-500 shadow-lg shadow-green-500/20"
              }`}
              onClick={() => handleSkillClick("frontend")}
            >
              {/* Header - Always visible */}
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <span
                  className={`text-2xl ${
                    unlockedSkills.frontend ? "text-blue-700" : "text-gray-900"
                  }`}
                >
                  &lt;/&gt;
                </span>
                <h3 className="font-pressstart2p text-gray-900 text-lg">
                  Frontend
                </h3>
              </div>

              {/* Content area */}
              <div className="relative min-h-[120px]">
                {!unlockedSkills.frontend ? (
                  /* Locked state - Dark with green glow and bouncing text */
                  <div className="relative h-full">
                    {/* Green glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 via-transparent to-green-500/5 rounded-lg"></div>

                    {/* Bouncing UNLOCK text */}
                    <div className="absolute inset-0 flex items-center justify-center pt-12">
                      <span className="font-pressstart2p text-gray-900 text-sm animate-bounce">
                        UNLOCK
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Unlocked state - Show skills */
                  <div className="relative z-10">
                    <ul className="space-y-2 text-gray-600 font-pixellari text-sm mb-8">
                      <li className="flex items-center gap-2">
                        <span className="text-green-700">●</span>
                        React 18 & TypeScript
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-700">●</span>
                        Vite & Modern Build Tools
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-700">●</span>
                        Tailwind CSS & Responsive Design
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-700">●</span>
                        Three.js & React Three Fiber
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-700">●</span>
                        React Router & State Management
                      </li>
                    </ul>

                    {/* Bottom status text */}
                    <div className="flex justify-between items-end mt-8">
                      <span className="font-pixellari text-gray-900 text-sm">
                        +50 XP
                      </span>
                      <Badge
                        variant="default"
                        font="retro"
                        className="bg-green-600 border-green-600 text-green-700 text-sm"
                      >
                        UNLOCKED
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Backend Skills */}
            <div
              className={`border rounded-lg p-6 transition-all duration-300  cursor-pointer relative overflow-hidden ${
                unlockedSkills.backend
                  ? "bg-cyan-50 border-cyan-600 hover:border-cyan-500"
                  : "bg-white border-green-600 hover:border-green-500 shadow-lg shadow-green-500/20"
              }`}
              onClick={() => handleSkillClick("backend")}
            >
              {/* Header - Always visible */}
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <span
                  className={`text-2xl ${
                    unlockedSkills.backend ? "text-cyan-700" : "text-gray-900"
                  }`}
                >
                  <RxGear />
                </span>
                <h3 className="font-pressstart2p text-gray-900 text-lg">
                  Backend
                </h3>
              </div>

              {/* Content area */}
              <div className="relative min-h-[120px]">
                {!unlockedSkills.backend ? (
                  /* Locked state - Dark with green glow and bouncing text */
                  <div className="relative h-full">
                    {/* Green glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 via-transparent to-green-500/5 rounded-lg"></div>

                    {/* Bouncing UNLOCK text */}
                    <div className="absolute inset-0 flex items-center justify-center pt-12">
                      <span className="font-pressstart2p text-gray-900 text-sm animate-bounce">
                        UNLOCK
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Unlocked state - Show skills */
                  <div className="relative z-10">
                    <ul className="space-y-2 text-gray-600 font-pixellari text-sm mb-8">
                      <li className="flex items-center gap-2">
                        <span className="text-green-700">●</span>
                        FastAPI & Python
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-700">●</span>
                        PostgreSQL & Database Design
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-700">●</span>
                        REST APIs & Pydantic
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-700">●</span>
                        WebSocket & Real-time Communication
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-700">●</span>
                        Authentication & Security
                      </li>
                    </ul>

                    {/* Bottom status text */}
                    <div className="flex justify-between items-end mt-8">
                      <span className="font-pixellari text-gray-900 text-sm">
                        +50 XP
                      </span>
                      <Badge
                        variant="default"
                        font="retro"
                        className="bg-green-600 border-green-600 text-green-700 text-sm"
                      >
                        UNLOCKED
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Database Skills */}
            <div
              className={`border rounded-lg p-6 transition-all duration-300 cursor-pointer relative overflow-hidden ${
                unlockedSkills.database
                  ? "bg-green-50 border-green-600 hover:border-green-500"
                  : "bg-white border-green-600 hover:border-green-500 shadow-lg shadow-green-500/20"
              }`}
              onClick={() => handleSkillClick("database")}
            >
              {/* Header - Always visible */}
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <span
                  className={`text-2xl ${
                    unlockedSkills.database ? "text-green-700" : "text-gray-900"
                  }`}
                >
                  <BsDatabaseAdd />
                </span>
                <h3 className="font-pressstart2p text-gray-900 text-lg">
                  Database
                </h3>
              </div>

              {/* Content area */}
              <div className="relative min-h-[120px]">
                {!unlockedSkills.database ? (
                  /* Locked state - Dark with green glow and bouncing text */
                  <div className="relative h-full">
                    {/* Green glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 via-transparent to-green-500/5 rounded-lg"></div>

                    {/* Bouncing UNLOCK text */}
                    <div className="absolute inset-0 flex items-center justify-center pt-12">
                      <span className="font-pressstart2p text-gray-900 text-sm animate-bounce">
                        UNLOCK
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Unlocked state - Show skills */
                  <div className="relative z-10">
                    <ul className="space-y-2 text-gray-600 font-pixellari text-sm mb-8">
                      <li className="flex items-center gap-2">
                        <span className="text-green-700">●</span>
                        PostgreSQL
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-700">●</span>
                        MySQL
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-700">●</span>
                        MongoDB
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-700">●</span>
                        Redis
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-700">●</span>
                        Snowflake
                      </li>
                    </ul>

                    {/* Bottom status text */}
                    <div className="flex justify-between items-end mt-8">
                      <span className="font-pixellari text-gray-900 text-sm">
                        +50 XP
                      </span>
                      <Badge
                        variant="default"
                        font="retro"
                        className="bg-green-600 border-green-600 text-green-700 text-sm"
                      >
                        UNLOCKED
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* DevOps Skills */}
            <div
              className={`border rounded-lg p-6 transition-all duration-300 cursor-pointer relative overflow-hidden ${
                unlockedSkills.devops
                  ? "bg-yellow-50 border-yellow-600 hover:border-yellow-500"
                  : "bg-white border-green-600 hover:border-green-500 shadow-lg shadow-green-500/20"
              }`}
              onClick={() => handleSkillClick("devops")}
            >
              {/* Header - Always visible */}
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <span
                  className={`text-2xl ${
                    unlockedSkills.devops ? "text-yellow-700" : "text-gray-900"
                  }`}
                >
                  <FaDocker />
                </span>
                <h3 className="font-pressstart2p text-gray-900 text-lg">DevOps</h3>
              </div>

              {/* Content area */}
              <div className="relative min-h-[120px]">
                {!unlockedSkills.devops ? (
                  /* Locked state - Dark with green glow and bouncing text */
                  <div className="relative h-full">
                    {/* Green glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 via-transparent to-green-500/5 rounded-lg"></div>

                    {/* Bouncing UNLOCK text */}
                    <div className="absolute inset-0 flex items-center justify-center pt-12">
                      <span className="font-pressstart2p text-gray-900 text-sm animate-bounce">
                        UNLOCK
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Unlocked state - Show skills */
                  <div className="relative z-10">
                    <ul className="space-y-2 text-gray-600 font-pixellari text-sm mb-8">
                      <li className="flex items-center gap-2">
                        <span className="text-yellow-700">●</span>
                        Docker & Containerization
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-yellow-700">●</span>
                        Streaming Systems & Real-time Data
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-yellow-700">●</span>
                        Data Pipeline Engineering
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-yellow-700">●</span>
                        API Design & Microservices
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-yellow-700">●</span>
                        Performance Optimization
                      </li>
                    </ul>

                    {/* Bottom status text */}
                    <div className="flex justify-between items-end mt-8">
                      <span className="font-pixellari text-gray-900 text-sm">
                        +50 XP
                      </span>
                      <Badge
                        variant="default"
                        font="retro"
                        className="bg-green-600 border-green-600 text-green-700 text-sm"
                      >
                        UNLOCKED
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AI/ML Skills */}
            <div
              className={`border rounded-lg p-6 transition-all duration-300 cursor-pointer relative overflow-hidden ${
                unlockedSkills.ai
                  ? "bg-purple-50 border-purple-600 hover:border-purple-500"
                  : "bg-white border-green-600 hover:border-green-500 shadow-lg shadow-green-500/20"
              }`}
              onClick={() => handleSkillClick("ai")}
            >
              {/* Header - Always visible */}
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <span
                  className={`text-2xl ${
                    unlockedSkills.ai ? "text-purple-700" : "text-gray-900"
                  }`}
                >
                  <BsRobot />
                </span>
                <h3 className="font-pressstart2p text-gray-900 text-lg">AI/ML</h3>
              </div>

              {/* Content area */}
              <div className="relative min-h-[120px]">
                {!unlockedSkills.ai ? (
                  /* Locked state - Dark with green glow and bouncing text */
                  <div className="relative h-full">
                    {/* Green glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 via-transparent to-green-500/5 rounded-lg"></div>

                    {/* Bouncing UNLOCK text */}
                    <div className="absolute inset-0 flex items-center justify-center pt-12">
                      <span className="font-pressstart2p text-gray-900 text-sm animate-bounce">
                        UNLOCK
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Unlocked state - Show skills */
                  <div className="relative z-10">
                    <ul className="space-y-2 text-gray-600 font-pixellari text-sm mb-8">
                      <li className="flex items-center gap-2">
                        <span className="text-purple-700">●</span>
                        OpenAI & Anthropic API Integration
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-purple-700">●</span>
                        Real-time Data Processing Pipelines
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-purple-700">●</span>
                        Social Media Intelligence & Sentiment Analysis
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-purple-700">●</span>
                        ML Model Deployment & Streaming
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-purple-700">●</span>
                        Data Visualization & Topic Modeling
                      </li>
                    </ul>

                    {/* Bottom status text */}
                    <div className="flex justify-between items-end mt-8">
                      <span className="font-pixellari text-gray-900 text-sm">
                        +50 XP
                      </span>
                      <Badge
                        variant="default"
                        font="retro"
                        className="bg-green-600 border-green-600 text-green-700 text-sm"
                      >
                        UNLOCKED
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tools Skills */}
            <div
              className={`border rounded-lg p-6 transition-all duration-300 cursor-pointer relative overflow-hidden ${
                unlockedSkills.tools
                  ? "bg-pink-50 border-pink-600 hover:border-pink-500"
                  : "bg-white border-green-600 hover:border-green-500 shadow-lg shadow-green-500/20"
              }`}
              onClick={() => handleSkillClick("tools")}
            >
              {/* Header - Always visible */}
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <span
                  className={`text-2xl ${
                    unlockedSkills.tools ? "text-pink-700" : "text-gray-900"
                  }`}
                >
                  <BsTools />
                </span>
                <h3 className="font-pressstart2p text-gray-900 text-lg">Tools</h3>
              </div>

              {/* Content area */}
              <div className="relative min-h-[120px]">
                {!unlockedSkills.tools ? (
                  /* Locked state - Dark with green glow and bouncing text */
                  <div className="relative h-full">
                    {/* Green glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 via-transparent to-green-500/5 rounded-lg"></div>

                    {/* Bouncing UNLOCK text */}
                    <div className="absolute inset-0 flex items-center justify-center pt-12">
                      <span className="font-pressstart2p text-gray-900 text-sm animate-bounce">
                        UNLOCK
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Unlocked state - Show skills */
                  <div className="relative z-10">
                    <ul className="space-y-2 text-gray-600 font-pixellari text-sm mb-8">
                      <li className="flex items-center gap-2">
                        <span className="text-pink-700">●</span>
                        Git & Version Control
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-pink-700">●</span>
                        VS Code & Development Tools
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-pink-700">●</span>
                        API Testing & Documentation
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-pink-700">●</span>
                        Data Analysis & Visualization
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-pink-700">●</span>
                        Project Management & Collaboration
                      </li>
                    </ul>

                    {/* Bottom status text */}
                    <div className="flex justify-between items-end mt-8">
                      <span className="font-pixellari text-gray-900 text-sm">
                        +50 XP
                      </span>
                      <Badge
                        variant="default"
                        font="retro"
                        className="bg-green-600 border-green-600 text-green-700 text-sm"
                      >
                        UNLOCKED
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Project Quests */}
      <section
        data-level={5}
        className="relative z-10 min-h-screen bg-cream px-4 py-16"
      >

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="font-pressstart2p text-2xl sm:text-3xl md:text-4xl text-gray-900 border-2 border-red-600 bg-white/80 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-lg inline-block">
              LEVEL 5: PROJECT QUESTS
            </h2>
            <p className="font-pressstart2p text-gray-900 text-sm mt-4">
              EXPLORE PROJECTS AND THE TECH BEHIND THEM
            </p>
          </div>

          {/* Project Cards Grid */}
          {/* Desktop: horizontal accordion deck */}
          <div className="hidden lg:block">
            <ProjectDeck
              label="Featured builds"
              projects={projects.slice(0, 6)}
              onProjectOpen={handleProjectLink}
            />
            {/* stays mounted so GSAP can animate it closed as well as open */}
            <div ref={moreProjectsWrapRef} className="overflow-hidden">
              <ProjectDeck
                label="More projects"
                projects={projects.slice(6)}
                onProjectOpen={handleProjectLink}
                paused={!showMoreProjects}
              />
            </div>
            <div className="flex justify-center mt-5">
              <button
                onClick={() => setShowMoreProjects((current) => !current)}
                className="group relative flex items-center gap-2 font-pressstart2p text-[10px] text-gray-900 bg-red-600 hover:bg-red-500 px-4 py-2 border-2 border-red-600 shadow-[3px_3px_0_0_rgba(0,0,0,0.6)] hover:shadow-[4px_4px_0_0_rgba(0,0,0,0.6)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-[1px_1px_0_0_rgba(0,0,0,0.6)] active:translate-x-0.5 active:translate-y-0.5 transition-all duration-150"
              >
                {showMoreProjects ? "SHOW LESS" : "MORE PROJECTS"}
                <FaChevronDown
                  size={10}
                  className={`transition-transform duration-300 ${
                    showMoreProjects ? "rotate-180" : "group-hover:translate-y-0.5"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Mobile / tablet: vertical accordion, capped at 6 until expanded */}
          <ProjectDeckMobile
            projects={projects}
            onProjectOpen={handleProjectLink}
          />
        </div>

      </section>
      <section
        data-level={6}
        className="relative z-10 min-h-screen bg-cream px-3 py-12"
      >

        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="font-pressstart2p text-2xl sm:text-3xl md:text-4xl text-gray-900 border-2 border-teal-600 bg-white/80 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-lg inline-block">
              LEVEL 6: COMMAND CENTER
            </h2>
            <p className="font-pressstart2p text-gray-900 text-sm mt-4">
              INTERACTIVE TERMINAL • CONNECT • EXPLORE
            </p>
          </div>

          {/* Interactive Command Center */}
          <div className="max-w-6xl mx-auto px-4">
            {/* Tab Navigation */}
            <div className="flex justify-center mb-6">
              <div className="bg-white border border-teal-600 rounded-lg p-1 flex gap-1 flex-wrap justify-center max-w-sm mx-auto">
                <button
                  onClick={() => setActiveTab("socials")}
                  className={`px-3 py-2 rounded font-pressstart2p text-xs transition-all duration-300 min-w-[80px] ${
                    activeTab === "socials"
                      ? "bg-teal-600 text-gray-900"
                      : "text-teal-700 hover:text-gray-900 hover:bg-teal-100"
                  }`}
                >
                  SOCIALS
                </button>
                <button
                  onClick={() => setActiveTab("quests")}
                  className={`px-3 py-2 rounded font-pressstart2p text-xs transition-all duration-300 min-w-[80px] ${
                    activeTab === "quests"
                      ? "bg-teal-600 text-gray-900"
                      : "text-teal-700 hover:text-gray-900 hover:bg-teal-100"
                  }`}
                >
                  QUESTS
                </button>
                <button
                  onClick={() => setActiveTab("terminal")}
                  className={`px-3 py-2 rounded font-pressstart2p text-xs transition-all duration-300 min-w-[80px] ${
                    activeTab === "terminal"
                      ? "bg-teal-600 text-gray-900"
                      : "text-teal-700 hover:text-gray-900 hover:bg-teal-100"
                  }`}
                >
                  TERMINAL
                </button>
              </div>
            </div>

            {/* Terminal Tab */}
            {activeTab === "terminal" && (
              <div className="bg-white border-2 border-teal-600 rounded-lg overflow-hidden">
                {/* Terminal Header */}
                <div className="bg-teal-50 px-4 py-2 flex items-center justify-between border-b border-teal-500/50">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-pixellari text-teal-700 text-xs ml-2">
                      pranav@portfolio:~
                    </span>
                  </div>
                  <button
                    onClick={() => setTerminalHistory([])}
                    className="font-pixellari text-teal-700 text-xs hover:text-gray-900 transition-colors"
                  >
                    CLEAR
                  </button>
                </div>

                {/* Terminal Body */}
                <div className="p-3 sm:p-4 h-64 sm:h-80 md:h-96 overflow-y-auto">
                  {/* Welcome Message */}
                  {terminalHistory.length === 0 && (
                    <div className="mb-4">
                      <p className="font-pixellari text-teal-700 text-sm mb-2">
                        Welcome to Pranav's Interactive Terminal v2.0
                      </p>
                      <p className="font-pixellari text-teal-700 text-sm mb-4">
                        Type 'help' to explore available commands
                      </p>
                    </div>
                  )}

                  {/* Command History */}
                  {terminalHistory.map((line, index) => (
                    <div key={index} className="mb-2">
                      <p
                        className={`font-pixellari text-sm ${
                          line.startsWith(">")
                            ? "text-teal-700"
                            : "text-gray-600"
                        } whitespace-pre-line`}
                      >
                        {line}
                      </p>
                    </div>
                  ))}

                  {/* Command Input */}
                  <div className="flex items-center gap-2 mt-4">
                    <span className="font-pixellari text-teal-700 text-sm flex-shrink-0">
                      $
                    </span>
                    <input
                      type="text"
                      value={currentCommand}
                      onChange={(e) => setCurrentCommand(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleTerminalCommand(currentCommand);
                          setCurrentCommand("");
                        }
                      }}
                      placeholder="Type a command..."
                      className="flex-1 bg-transparent text-teal-700 font-pixellari text-xs sm:text-sm outline-none placeholder-teal-300/50 min-w-0"
                      autoFocus
                    />
                    {isTyping && (
                      <span className="text-teal-700 animate-pulse flex-shrink-0">
                        _
                      </span>
                    )}
                  </div>
                </div>

                {/* Terminal Footer */}
                <div className="bg-teal-50 px-4 py-2 border-t border-teal-500/30">
                  <p className="font-pixellari text-teal-700 text-xs">
                    Press Enter to execute • Type 'help' for commands
                  </p>
                </div>
              </div>
            )}

            {/* Socials Tab */}
            {activeTab === "socials" && (
              <div className="bg-white border-2 border-teal-600 rounded-lg p-4 sm:p-6">
                <h3 className="font-pressstart2p text-gray-900 text-base sm:text-lg mb-4 sm:mb-6 text-center">
                  SOCIAL COMMAND CENTER
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <a
                    href="https://github.com/PranavReddyGaddam"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-teal-50 border border-teal-500/50 rounded-lg p-3 sm:p-4 text-center transition-all duration-300 hover:bg-teal-100 hover:border-teal-500 hover:scale-105 group"
                  >
                    <Github className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-teal-700 group-hover:text-gray-900" />
                    <p className="font-pressstart2p text-gray-900 text-xs">
                      GitHub
                    </p>
                    <p className="font-pixellari text-teal-700 text-xs mt-1">
                      Code Repository
                    </p>
                  </a>

                  <a
                    href="https://www.linkedin.com/in/pranav-reddy-gaddam-69338321b/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-teal-50 border border-teal-500/50 rounded-lg p-3 sm:p-4 text-center transition-all duration-300 hover:bg-teal-100 hover:border-teal-500 hover:scale-105 group"
                  >
                    <Linkedin className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-teal-700 group-hover:text-gray-900" />
                    <p className="font-pressstart2p text-gray-900 text-xs">
                      LinkedIn
                    </p>
                    <p className="font-pixellari text-teal-700 text-xs mt-1">
                      Professional
                    </p>
                  </a>

                  <a
                    href="https://www.instagram.com/__pranav.reddy__"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-teal-50 border border-teal-500/50 rounded-lg p-3 sm:p-4 text-center transition-all duration-300 hover:bg-teal-100 hover:border-teal-500 hover:scale-105 group"
                  >
                    <Instagram className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-teal-700 group-hover:text-gray-900" />
                    <p className="font-pressstart2p text-gray-900 text-xs">
                      Instagram
                    </p>
                    <p className="font-pixellari text-teal-700 text-xs mt-1">
                      Personal
                    </p>
                  </a>

                  <a
                    href="https://twitter.com/Pranav_2801"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-teal-50 border border-teal-500/50 rounded-lg p-3 sm:p-4 text-center transition-all duration-300 hover:bg-teal-100 hover:border-teal-500 hover:scale-105 group"
                  >
                    {React.createElement(RiTwitterXFill as any, {
                      className:
                        "w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-teal-700 group-hover:text-gray-900",
                    })}
                    <p className="font-pressstart2p text-gray-900 text-xs">
                      Twitter
                    </p>
                    <p className="font-pixellari text-teal-700 text-xs mt-1">
                      Insights
                    </p>
                  </a>
                </div>

                {/* Direct Contact */}
                <div className="bg-teal-50 border border-teal-500/30 rounded-lg p-3 sm:p-4">
                  <h4 className="font-pressstart2p text-teal-700 text-sm mb-2 sm:mb-3">
                    DIRECT COMMS CHANNEL
                  </h4>
                  <div className="space-y-1 sm:space-y-2">
                    <p className="font-pixellari text-gray-600 text-xs sm:text-sm break-words">
                      <span className="text-teal-700">Email:</span>{" "}
                      pranavreddy.gaddam@sjsu.edu
                    </p>
                    <p className="font-pixellari text-gray-600 text-xs sm:text-sm">
                      <span className="text-teal-700">Location:</span> San Jose,
                      California
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quests Tab */}
            {activeTab === "quests" && (
              <div className="bg-white border-2 border-teal-600 rounded-lg p-4 sm:p-6">
                <h3 className="font-pressstart2p text-gray-900 text-base sm:text-lg mb-4 sm:mb-6 text-center">
                  HOBBIES & INTERESTS
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-teal-50 border border-teal-500/30 rounded-lg p-3 sm:p-4">
                    <div>
                      <h4 className="font-pressstart2p text-teal-700 text-sm mb-1">
                        Movie Enthusiast
                      </h4>
                      <p className="font-pixellari text-gray-500 text-xs mb-3">
                        Film Buff
                      </p>
                    </div>
                    <p className="font-pixellari text-gray-600 text-xs leading-relaxed">
                      Love watching a wide variety of movies - from classic
                      films to modern cinema across all genres.
                    </p>
                  </div>

                  <div className="bg-teal-50 border border-teal-500/30 rounded-lg p-3 sm:p-4">
                    <div>
                      <h4 className="font-pressstart2p text-teal-700 text-sm mb-1">
                        Weekend Coding
                      </h4>
                      <p className="font-pixellari text-gray-500 text-xs mb-3">
                        Passion Projects
                      </p>
                    </div>
                    <p className="font-pixellari text-gray-600 text-xs leading-relaxed">
                      Enjoy vibe coding on weekends - exploring new technologies
                      and building creative side projects.
                    </p>
                  </div>

                  <div className="bg-teal-50 border border-teal-500/30 rounded-lg p-3 sm:p-4">
                    <div>
                      <h4 className="font-pressstart2p text-teal-700 text-sm mb-1">
                        Sports Fan
                      </h4>
                      <p className="font-pixellari text-gray-500 text-xs mb-3">
                        Cricket, Basketball & Tennis
                      </p>
                    </div>
                    <p className="font-pixellari text-gray-600 text-xs leading-relaxed">
                      Passionate about watching cricket, basketball, and tennis.
                      Also enjoy following various other sports.
                    </p>
                  </div>

                  <div className="bg-teal-50 border border-teal-500/30 rounded-lg p-3 sm:p-4">
                    <div>
                      <h4 className="font-pressstart2p text-teal-700 text-sm mb-1">
                        Baking
                      </h4>
                      <p className="font-pixellari text-gray-500 text-xs mb-3">
                        Home Chef
                      </p>
                    </div>
                    <p className="font-pixellari text-gray-600 text-xs leading-relaxed">
                      Enjoy baking as a creative outlet - experimenting with
                      recipes and creating delicious treats.
                    </p>
                  </div>
                </div>

                {/* Collaboration Section */}
                <div className="mt-4 sm:mt-6 bg-gradient-to-r from-teal-50 to-cyan-100 border border-teal-600 rounded-lg p-3 sm:p-4">
                  <h4 className="font-pressstart2p text-teal-700 text-sm mb-2 sm:mb-3 text-center">
                    LET'S COLLABORATE
                  </h4>
                  <p className="font-pixellari text-gray-600 text-xs sm:text-sm text-center mb-3 sm:mb-4">
                    Have an interesting project or idea? I'd love to hear about
                    it and work together!
                  </p>
                  <button
                    onClick={() => setActiveTab("terminal")}
                    className="w-full font-pressstart2p bg-teal-600 hover:bg-teal-700 text-gray-900 px-3 sm:px-4 py-2 rounded border border-teal-600 transition-all duration-300 hover:scale-105 text-xs"
                  >
                    GET IN TOUCH →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-cream border-t-2 border-teal-600">
        <div className="max-w-6xl mx-auto px-4 py-4 text-center">
          <TimeMachine />
          <p className="font-pixellari text-teal-700 text-sm mt-3">
            Crafted with curiosity and caffeine — © {new Date().getFullYear()}{" "}
            Pranav Reddy Gaddam
          </p>
        </div>
      </footer>

      </div>
      </div>

      {/* Floating Unlock All Skills Button - Attached to scrollbar side */}
      {currentLevel === 4 &&
        Object.values(unlockedSkills).some((skill) => skill) && (
          <div className="fixed right-2 top-1/2 -translate-y-1/2 z-50 group">
            <button
              onClick={handleUnlockAllSkills}
              className="bg-green-50 hover:bg-green-800 text-gray-900 p-3 rounded-l-lg border-2 border-r-0 border-green-600 hover:border-green-500 transition-all duration-300 hover:scale-105 hover:translate-x-2 shadow-lg hover:shadow-green-500/50 backdrop-blur-sm relative"
              title="Unlock all skills"
            >
              {Object.values(unlockedSkills).every((skill) => skill) ? (
                <FaUnlock className="text-lg" />
              ) : (
                <FaLock className="text-lg" />
              )}
            </button>
            {/* Tooltip */}
            <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 px-3 py-1 bg-white text-gray-900 text-xs font-pressstart2p rounded border border-green-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              Unlock all skills
              <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-black/90"></div>
            </div>
          </div>
        )}

      {/* Achievement Toasts */}
      <AchievementToasts toasts={achievementToasts} />

      {/* Why You Should Hire Me Modal */}
      {showWhyHireMeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/90"
          onClick={() => setShowWhyHireMeModal(false)}
        >
          <div
            className="relative bg-gradient-to-br from-red-600 to-red-800 border-3 border-red-600 rounded-lg p-8 max-w-5xl w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Stamp texture overlay to match the lanyard card */}
            <div className="absolute inset-0 bg-red-50 rounded-lg pointer-events-none"></div>
            <div className="absolute inset-0 border border-gray-200 rounded-lg pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-pressstart2p text-yellow-700 text-lg md:text-2xl tracking-widest">
                  WHY YOU SHOULD HIRE ME
                </h2>
                <button
                  onClick={() => setShowWhyHireMeModal(false)}
                  aria-label="Close"
                  className="text-gray-600 hover:text-gray-900 text-3xl transition-colors"
                >
                  <IoClose />
                </button>
              </div>
              <div className="font-pixellari text-gray-900 text-base leading-relaxed max-h-[75vh] overflow-y-auto space-y-6 pr-2">
                <HireMeStats />

                <div>
                  <h3 className="font-pressstart2p text-yellow-700 text-sm mb-3 tracking-wider">
                    WHAT MAKES ME DIFFERENT
                  </h3>
                  <p>
                    Most people my level build with APIs. I build what goes
                    underneath them — fine-tuned LLMs, agent loops, and real
                    systems people use today, owned end to end from
                    infrastructure to UI.
                  </p>
                  <ul className="mt-4 space-y-3">
                    <li className="flex gap-2">
                      <span className="text-yellow-700">◆</span>
                      <span>
                        I close the loop — deploy it, monitor it, own what
                        breaks at 2 AM.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-yellow-700">◆</span>
                      <span>
                        AI-native. I build agentic systems and use them daily,
                        so I move at the speed of the tooling.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-yellow-700">◆</span>
                      <span>
                        Early career: still hungry, still fast, and I will
                        outwork anyone in the room.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game Instructions Modal */}
      <GameInstructionsModal
        isVisible={showGameInstructions}
        onClose={() => setShowGameInstructions(false)}
      />

      {/* Code Request Modal */}
      <CodeRequestModal
        isVisible={showCodeRequestModal}
        onClose={() => setShowCodeRequestModal(false)}
        onSubmit={handleCodeRequestSubmit}
        isSubmitting={isSubmittingCodeRequest}
      />

      {/* Achievements Modal */}
      {showAchievementsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-yellow-600 rounded-lg p-6 max-w-3xl w-full shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-pressstart2p text-yellow-700 text-xl">
                ACHIEVEMENTS
              </h2>
              <button
                onClick={() => setShowAchievementsModal(false)}
                className="font-pressstart2p bg-yellow-600 hover:bg-yellow-700 text-gray-900 px-4 py-2 rounded border border-yellow-600"
              >
                CLOSE
              </button>
            </div>
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-500/50 rounded-lg">
              <p className="font-pixellari text-yellow-700 text-sm">
                Click on locked achievements to navigate to where you can
                unlock them!
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto pr-1">
              {allAchievements.map((a) => {
                const isUnlocked =
                  unlockedAchievements.has(a.id) ||
                  unlockedAchievementsRef.current.has(a.id);
                const sectionLevel = achievementToSectionMap[a.id];
                const isClickable = sectionLevel !== undefined;

                return (
                  <div
                    key={a.id}
                    onClick={() => isClickable && handleAchievementClick(a.id)}
                    className={`flex items-center justify-between border-2 rounded-lg px-4 py-3 transition-all duration-200 h-20 ${
                      isUnlocked
                        ? "border-green-600 bg-green-50"
                        : "border-gray-300 bg-white/70"
                    } ${
                      isClickable
                        ? "cursor-pointer hover:border-yellow-600 hover:bg-yellow-50 hover:scale-105"
                        : "cursor-default"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span
                        className={`flex-shrink-0 ${
                          isUnlocked ? "text-green-700" : "text-gray-500"
                        }`}
                      >
                        <GoTrophy />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`font-pressstart2p text-sm truncate ${
                            isUnlocked ? "text-gray-900" : "text-gray-500"
                          }`}
                          title={a.title}
                        >
                          {a.title}
                        </div>
                        <div className="font-pixellari text-xs text-gray-600 truncate">
                          {a.section} • +{a.xp} XP
                          {isClickable && !isUnlocked && (
                            <span className="text-yellow-700 ml-2">
                              (Click to navigate)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isClickable && !isUnlocked && (
                        <span className="text-yellow-700 text-xs">→</span>
                      )}
                      <Badge
                        variant={isUnlocked ? "default" : "outline"}
                        font="retro"
                        className={`${
                          isUnlocked
                            ? "bg-green-600 border-green-600 text-green-700"
                            : "bg-gray-600 border-gray-300 text-gray-500"
                        } text-sm`}
                      >
                        {isUnlocked ? "UNLOCKED" : "LOCKED"}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
