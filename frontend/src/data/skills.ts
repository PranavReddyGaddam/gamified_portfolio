import type { IconType } from "react-icons";
import {
  SiDocker,
  SiFastapi,
  SiGreensock,
  SiJenkins,
  SiMaplibre,
  SiNextdotjs,
  SiOpenjdk,
  SiPostgresql,
  SiPytest,
  SiPython,
  SiPytorch,
  SiReact,
  SiSpringboot,
  SiStripe,
  SiSupabase,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
  SiVite,
} from "react-icons/si";
import {
  PiBroadcast,
  PiDatabase,
  PiFlowArrow,
  PiGauge,
  PiGraph,
  PiRobot,
  PiStack,
  PiTreeStructure,
  PiWaveform,
} from "react-icons/pi";

export type Skill = {
  name: string;
  icon: IconType;
};

export type SkillGroup = {
  id: string;
  title: string;
  /** One line on how the group shows up in the work, not a self-rating. */
  note: string;
  skills: Skill[];
};

/**
 * Only what the projects and roles on this page actually use, so every chip
 * can be traced back to something shipped.
 */
export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    title: "Frontend",
    note: "Interfaces that move: maps, graphs, 3D globes and scroll-driven pages.",
    skills: [
      { name: "React", icon: SiReact },
      { name: "TypeScript", icon: SiTypescript },
      { name: "Next.js", icon: SiNextdotjs },
      { name: "Vite", icon: SiVite },
      { name: "Tailwind CSS", icon: SiTailwindcss },
      { name: "GSAP", icon: SiGreensock },
      { name: "Three.js / R3F", icon: SiThreedotjs },
      { name: "MapLibre GL", icon: SiMaplibre },
      { name: "React Flow", icon: PiFlowArrow },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    note: "Java and Spring Boot at work today, and Python services before that, from 500K+ requests a day to streaming APIs.",
    skills: [
      { name: "Java", icon: SiOpenjdk },
      { name: "Spring Boot", icon: SiSpringboot },
      { name: "Python", icon: SiPython },
      { name: "FastAPI", icon: SiFastapi },
      { name: "PostgreSQL", icon: SiPostgresql },
      { name: "Supabase", icon: SiSupabase },
      { name: "Aurora DSQL", icon: PiDatabase },
      { name: "Server-Sent Events", icon: PiBroadcast },
      { name: "Stripe", icon: SiStripe },
    ],
  },
  {
    id: "ai",
    title: "AI and data",
    note: "Models wired into products rather than left in notebooks.",
    skills: [
      { name: "PyTorch", icon: SiPytorch },
      { name: "Agentic pipelines", icon: PiRobot },
      { name: "LLMs", icon: PiTreeStructure },
      { name: "ChromaDB", icon: PiGraph },
      { name: "Speech (STT / TTS)", icon: PiWaveform },
    ],
  },
  {
    id: "infra",
    title: "Infrastructure",
    note: "Keeping things up: deploys, tests, and the platform underneath.",
    skills: [
      { name: "Docker", icon: SiDocker },
      { name: "Jenkins", icon: SiJenkins },
      { name: "pytest", icon: SiPytest },
      { name: "Distributed systems", icon: PiStack },
      { name: "Caching and query tuning", icon: PiGauge },
    ],
  },
];
