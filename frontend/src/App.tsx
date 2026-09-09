import { useState, useRef, useEffect, useLayoutEffect } from "react";
import "./App.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import emailjs from "@emailjs/browser";
import GameInstructionsModal from "./components/GameInstructionsModal";
import CodeRequestModal from "./components/CodeRequestModal";
import "./components/Hero.css";
import ExperienceRows from "./components/ExperienceRows";
import { projects } from "./data/projects";
import WorkList from "./components/WorkList";
import Reveal from "./components/Reveal";
import HeroNav from "./components/HeroNav";
import LocalClock from "./components/LocalClock";
import HireMeStats from "./components/HireMeStats";
import { RiTwitterXFill } from "react-icons/ri";
import { FaLock, FaUnlock, FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

// EmailJS configuration
const EMAILJS_SERVICE_ID = "service_d0bwser";
const EMAILJS_TEMPLATE_ID = "template_4hg075h";
const EMAILJS_PUBLIC_KEY = "wRXZiwguBPiyEMvoX";

// Resume URL (place your PDF in public/ and update this path if needed)
const RESUME_URL = "/Pranav_Reddy_Gaddam_Resume_FT_Master.pdf";


// Level 5 project quests


function App() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [unlockedSkills, setUnlockedSkills] = useState({
    frontend: false,
    backend: false,
    database: false,
    devops: false,
    ai: false,
    tools: false,
  });


  // Command center state

  // Mobile carousel auto-animation state

  // Spaceship sound ref
  const spaceshipSoundRef = useRef<HTMLAudioElement | null>(null);

  // Achievements modal visibility

  // Achievement tracking

  // Game instructions modal state
  const [showGameInstructions, setShowGameInstructions] = useState(false);

  // Card flip state

  // Per-section achievement bookkeeping
  const [unlockedSection4Achievements] = useState<Set<string>>(new Set());

  // "Why you should hire me" modal (opened from the lanyard stamp card)
  const [showWhyHireMeModal, setShowWhyHireMeModal] = useState(false);

  // Code Request Modal
  const [showCodeRequestModal, setShowCodeRequestModal] = useState(false);
  const [isSubmittingCodeRequest, setIsSubmittingCodeRequest] = useState(false);

  // Section visibility to control heavy backgrounds

  const nextSectionRef = useRef<HTMLDivElement>(null);

  // Section 5: reveal the second row of project cards only after the button is clicked

  // Animate the "more projects" deck open/closed by height, mirroring the
  // mobile deck. The wrapper stays mounted so the close tween can actually run.

  // Collaboration form (Section 6)

  // Achievement toast handlers
  // Achievements were removed from the site. Kept as a no-op so the many
  // call sites scattered through the sections stay valid.
  const showAchievement = (_achievementId: string) => {};

  // Mapping of achievement IDs to their corresponding section levels

  // Function to navigate to a specific section

  // Function to handle achievement click

  // List of all achievements with display names and XP

  // Escape closes any open modal
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowWhyHireMeModal(false);
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

  // Nav scrolling. ScrollSmoother owns the scroll position, so anchor jumps
  // have to go through it; otherwise the browser fights the smoother.
  const scrollToSection = (target: string) => {
    const el = document.querySelector(target);
    if (!el) return;
    if (smootherRef.current) {
      smootherRef.current.scrollTo(el, true, "top top");
    } else {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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




  // Section 2 Achievement Handlers



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
              }
            },
          })
        );
      });

    return () => triggers.forEach((t) => t.kill());
  }, []);


  // Section 3 Carousel Navigation Achievements


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


  // Removed: career progression unlock handler (no longer gated)

  // Terminal command handler

  // Handle collaboration form submit (Section 6)

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
        id="home"
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
            Pranav Reddy Gaddam
          </a>
          <span className="hero-meta-loc">San Jose, California</span>
          <HeroNav
            items={[
              { label: "Home", target: "#home" },
              { label: "About", target: "#about" },
              { label: "Work", target: "#projects" },
              // Resume is a file rather than a section, so it opens in a new tab.
              { label: "Resume", target: RESUME_URL, external: true },
            ]}
            onNavigate={scrollToSection}
          />
        </div>

        {/* Centered hero content */}
        <div className="relative z-10 w-full flex flex-col items-center text-center">
          <h1 className="hero-title">
            I{" "}
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("#about");
              }}
              className="hero-title-img hero-title-img--me"
              aria-label="About me"
            />
            build living, breathing{" "}
            <br className="hero-br" />
            software{" "}
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("#projects");
              }}
              className="hero-title-img hero-title-img--work"
              aria-label="Work"
            />
            for teams that want{" "}
            <br className="hero-br" />
            to ship, not just plan.
          </h1>
        </div>
      </section>

      {/* Transition Section - Smooth Blend */}
      <section className="relative z-10 h-32 bg-cream">
        <div className="absolute inset-0 "></div>
      </section>

      {/* Section 2: About */}
      <section
        data-level={2}
        ref={nextSectionRef}
        id="about"
        className="about-section relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 py-16 md:py-32"
      >
        <Reveal stagger={0.12} className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-32">
          {/* Left: portrait + labels */}
          <div>
            <div className="about-portrait-head flex justify-between mb-4">
              <a
                href="#about"
                className="text-sm text-neutral-900 hover:text-neutral-500 transition-colors"
              >
                (About me)
              </a>
              <span className="text-sm text-neutral-400">
                (Software Engineer)
              </span>
            </div>

            <div className="about-portrait">
              <img
                src="/projects/Pranav.jpeg"
                alt="Pranav Reddy Gaddam"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex gap-1 mt-4 text-sm text-neutral-900">
              <a
                href="https://github.com/PranavReddyGaddam"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-neutral-500 transition-colors"
              >
                GitHub
              </a>
              <span className="text-neutral-400">,</span>
              <a
                href="https://www.linkedin.com/in/pranav-reddy-gaddam"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-neutral-500 transition-colors"
              >
                LinkedIn
              </a>
              <span className="text-neutral-400">,</span>
              <a
                href="mailto:reddy.pranav.gaddam@gmail.com"
                className="hover:text-neutral-500 transition-colors"
              >
                Email
              </a>
            </div>
          </div>

          {/* Right: paragraph + experience table */}
          <div className="about-right">
            <p className="text-xl md:text-2xl font-light leading-relaxed text-neutral-900 mb-16 md:mb-24">
              Starting with side projects, I built a versatile skill set across{" "}
              <span className="font-['Instrument_Serif'] italic underline decoration-1 underline-offset-4">
                full-stack engineering
              </span>
              , backend systems, and AI through hands-on work. I&apos;m
              now a software engineer at{" "}
              <a
                href="https://www.salesforce.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-1 underline-offset-4"
              >
                Salesforce
              </a>
              , alongside finishing my master&apos;s at{" "}
              <a
                href="https://www.sjsu.edu/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-1 underline-offset-4"
              >
                San Jose State University
              </a>
              .
            </p>

            <ExperienceRows
              entries={[
                {
                  id: "salesforce",
                  org: "Salesforce",
                  team: "Platform Radio",
                  role: "Software Engineer",
                  year: "26–",
                  period: "Sep 2026 – Present",
                  detail:
                    "Building on the Platform Radio team, working on the infrastructure that Salesforce products are built on.",
                  points: ["Distributed systems and platform services"],
                },
                {
                  id: "masters",
                  org: "San Jose State University",
                  team: "Applied Data Science",
                  role: "Master's",
                  year: "24–26",
                  period: "Aug 2024 – May 2026",
                  detail:
                    "Master's in Applied Data Science, focusing on machine learning systems and putting models into production.",
                  points: [
                    "CGPA 3.84 / 4.0",
                    "Machine learning, AI systems, and large-scale data",
                  ],
                },
                {
                  id: "ve-projects",
                  org: "VE Projects Pvt Ltd",
                  team: "Backend Services",
                  role: "Software Engineer",
                  year: "23–24",
                  period: "Aug 2023 – Jul 2024",
                  detail:
                    "Built and maintained backend services in Python and FastAPI on PostgreSQL, serving 500K+ API requests a day at 99.5% uptime.",
                  points: [
                    "Cut response latency 35% through query optimisation and caching",
                    "Held 85% test coverage with pytest, and took on-call incidents",
                    "Shipped across 10+ production deployments via Jenkins and Docker",
                  ],
                },
                {
                  id: "bachelors",
                  org: "St. Martin's Engineering College",
                  team: "Computer Science",
                  role: "Bachelor's",
                  year: "19–23",
                  period: "Aug 2019 – May 2023",
                  detail:
                    "Bachelor's in Computer Science, where I picked up the fundamentals and started building things well beyond coursework.",
                  points: [
                    "Data structures, algorithms, and systems foundations",
                    "First side projects in Python and web development",
                  ],
                },
              ]}
            />
          </div>
        </Reveal>
      </section>


      {/* Section 5: Project Quests */}
      <section
        data-level={5}
        id="projects"
        className="work-section relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 py-16 md:py-32"
      >
        <div className="max-w-6xl mx-auto">
          <Reveal className="flex justify-between mb-10">
            <span className="text-sm text-neutral-900">(Selected work)</span>
            <span className="text-sm text-neutral-400">
              ({projects.filter((p) => !p.placeholder).length} projects)
            </span>
          </Reveal>

          <WorkList />
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="site-footer relative z-10 px-6 md:px-16 pt-8 pb-8">
        <div className="flex flex-col">
          <div className="flex flex-col gap-5 items-start w-full">
            {/* Hairline rule */}
            <div className="bg-neutral-200 h-px w-full" />

            <div className="hidden md:grid gap-5 grid-cols-4 w-full">
              {/* Name + local time */}
              <div className="flex flex-col gap-0 items-start">
                <a href="#home" className="flex gap-3 items-center transition-opacity hover:opacity-80">
                  <p className="font-display text-3xl text-neutral-700">
                    Pranav Reddy Gaddam
                  </p>
                </a>
                <p className="text-base text-neutral-400 mt-1">
                  <LocalClock /> San Jose, CA
                </p>
              </div>

              <div />

              {/* Nav */}
              <div className="flex flex-col gap-2 items-start">
                {[
                  { label: "Work", href: "#projects" },
                  { label: "About", href: "#about" },
                  { label: "Previous version", href: "/v1" },
                ].map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    className="text-base text-neutral-400 tracking-[0.01em] hover:text-neutral-900 transition-colors duration-200"
                  >
                    {l.label}
                  </a>
                ))}
              </div>

              {/* Contact + socials */}
              <div className="flex flex-col gap-4 items-start">
                <div>
                  <p className="text-base text-neutral-400">
                    Let&apos;s work together!
                  </p>
                  <a
                    href="mailto:reddy.pranav.gaddam@gmail.com"
                    className="text-base text-neutral-700 hover:text-neutral-900 transition-colors"
                  >
                    reddy.pranav.gaddam@gmail.com
                  </a>
                </div>

                <div className="flex gap-4 items-center text-neutral-300">
                  <a
                    href="https://www.linkedin.com/in/pranav-reddy-gaddam"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="hover:text-neutral-600 transition-colors"
                  >
                    <FaLinkedin size={20} />
                  </a>
                  <a
                    href="https://github.com/PranavReddyGaddam"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="hover:text-neutral-600 transition-colors"
                  >
                    <FaGithub size={20} />
                  </a>
                  <a
                    href="https://www.instagram.com/__pranav.reddy__"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="hover:text-neutral-600 transition-colors"
                  >
                    <FaInstagram size={20} />
                  </a>
                  <a
                    href="https://twitter.com/Pranav_2801"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X"
                    className="hover:text-neutral-600 transition-colors"
                  >
                    <RiTwitterXFill size={19} />
                  </a>
                </div>
              </div>
            </div>

            {/* Mobile: stacked */}
            <div className="md:hidden flex flex-col gap-6 w-full">
              <div>
                <p className="font-display text-2xl text-neutral-700">
                  Pranav Reddy Gaddam
                </p>
                <p className="text-sm text-neutral-400 mt-1">
                  <LocalClock /> San Jose, CA
                </p>
              </div>
              <a
                href="mailto:reddy.pranav.gaddam@gmail.com"
                className="text-sm text-neutral-700"
              >
                reddy.pranav.gaddam@gmail.com
              </a>
              <div className="flex gap-4 items-center text-neutral-300">
                <a href="https://www.linkedin.com/in/pranav-reddy-gaddam" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin size={18} /></a>
                <a href="https://github.com/PranavReddyGaddam" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FaGithub size={18} /></a>
                <a href="https://www.instagram.com/__pranav.reddy__" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram size={18} /></a>
                <a href="https://twitter.com/Pranav_2801" target="_blank" rel="noopener noreferrer" aria-label="X"><RiTwitterXFill size={17} /></a>
              </div>
            </div>
          </div>
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

          </div>
  );
}

export default App;
