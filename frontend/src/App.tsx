import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import Galaxy from "./backgrounds/Backgrounds/Galaxy";
import Squares from "./backgrounds/Backgrounds/Squares";
import TextType from "./backgrounds/TextAnimations/TextType/TextType";
import emailjs from '@emailjs/browser';
import Navbar from "./components/Navbar";
import GitHubCommitChart from "./components/GitHubCommitChart";
import AchievementPopup from "./components/AchievementPopup";
import GameInstructionsModal from "./components/GameInstructionsModal";
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
import { FaDocker, FaLock } from "react-icons/fa";
import { GoTrophy } from "react-icons/go";

// EmailJS configuration
const EMAILJS_SERVICE_ID = 'service_d0bwser';
const EMAILJS_TEMPLATE_ID = 'template_4hg075h';
const EMAILJS_PUBLIC_KEY = 'wRXZiwguBPiyEMvoX';

// Resume URL (place your PDF in public/ and update this path if needed)
const RESUME_URL = '/frontend/public/Pranav_Reddy_Gaddam_Resume_FT_Google.pdf';

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

  // Project card flip states
  const [flippedProjects, setFlippedProjects] = useState<Set<string>>(new Set());

  const [unlockedProjects, setUnlockedProjects] = useState<Set<string>>(
    new Set()
  );
  const [carouselIndex, setCarouselIndex] = useState(1);
  
  // Show more projects state
  const [showMoreProjects, setShowMoreProjects] = useState(false);

  // Command center state
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<'socials' | 'quests' | 'terminal'>('socials');

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

  // Achievement stacking state
  const [visibleAchievements, setVisibleAchievements] = useState<string[]>([]);

  // Achievement popup states
  const [showRulebookRaider, setShowRulebookRaider] = useState(false);

  // Game instructions modal state
  const [showGameInstructions, setShowGameInstructions] = useState(false);

  // Card flip state
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isInfoCardFlipped, setIsInfoCardFlipped] = useState(false);
  const [isAttributesCardFlipped, setIsAttributesCardFlipped] = useState(false);

  // Section 2 Achievements
  const [showFaceOfHero, setShowFaceOfHero] = useState(false);
  const [showKeeperOfStories, setShowKeeperOfStories] = useState(false);
  const [showPowerUnleashed, setShowPowerUnleashed] = useState(false);
  const [unlockedSection2Achievements] = useState<Set<string>>(new Set());

  // Section 3 Achievements (only carousel navigation achievements remain)
  const [showGuildExplorer, setShowGuildExplorer] = useState(false);
  const [showGrandmastersPath, setShowGrandmastersPath] = useState(false);
  const [unlockedSection3Achievements] = useState<Set<string>>(new Set());

  // Section unlock-on-scroll Achievements
  const [showIdentityUnlocked, setShowIdentityUnlocked] = useState(false);
  const [showPathfinder, setShowPathfinder] = useState(false);
  const [showSkillMastery, setShowSkillMastery] = useState(false);
  const [showQuestConqueror, setShowQuestConqueror] = useState(false);
  const [showSocialLinkEstablished, setShowSocialLinkEstablished] =
    useState(false);

  // Section 4 Achievements
  const [showSkillTreeMaster, setShowSkillTreeMaster] = useState(false);
  const [unlockedSection4Achievements] = useState<Set<string>>(new Set());

  // Section 5 Achievements
  const [showProjectMaster, setShowProjectMaster] = useState(false);
  const [unlockedSection5Achievements] = useState<Set<string>>(new Set());

  // Section 6 Achievement
  const [showAllianceFormed, setShowAllianceFormed] = useState(false);

  // Section visibility to control heavy backgrounds
  const [isSection1Visible, setIsSection1Visible] = useState(true);
  const [isSection2Visible, setIsSection2Visible] = useState(false);
  const [isSection3Visible, setIsSection3Visible] = useState(false);

  const nextSectionRef = useRef<HTMLDivElement>(null);

  // Collaboration form (Section 6)
  const [collabName, setCollabName] = useState("");
  const [collabEmail, setCollabEmail] = useState("");
  const [collabMessage, setCollabMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Achievement popup handlers
  const showAchievement = (
    achievementId: string,
    setter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    // Check if achievement is already unlocked (session-wide)
    if (unlockedAchievementsRef.current.has(achievementId)) {
      return; // Already unlocked, don't show again
    }

    // Unlock the achievement (update ref immediately to avoid stale closures)
    unlockedAchievementsRef.current.add(achievementId);
    setUnlockedAchievements((prev) => new Set(prev).add(achievementId));

    // Add to visible achievements for stacking
    setVisibleAchievements((prev) => [...prev, achievementId]);

    // Show the popup
    setter(true);
    setTimeout(() => {
      setter(false);
      // Remove from visible achievements after hiding
      setVisibleAchievements((prev) =>
        prev.filter((id) => id !== achievementId)
      );
    }, 5000);

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

  // Helper function to get achievement index for stacking
  const getAchievementIndex = (achievementId: string) => {
    return visibleAchievements.indexOf(achievementId);
  };

  // Mapping of achievement IDs to their corresponding section levels
  const achievementToSectionMap: Record<string, number> = {
    // Intro achievements
    "rulebook-raider": 1,
    // Section unlock achievements
    "identity_unlocked": 2,
    "pathfinder": 3,
    "skill_mastery": 4,
    "quest_conqueror": 5,
    "social_link_established": 6,
    // Section 2 achievements
    "face_of_hero": 2,
    "keeper_of_stories": 2,
    "power_unleashed": 2,
    // Section 3 achievements
    "guild_explorer": 3,
    "grandmasters_path": 3,
    // Section 4 achievements
    "pixel_perfect": 4,
    "server_sensei": 4,
    "data_tamer": 4,
    "pipeline_pro": 4,
    "model_maker": 4,
    "utility_wizard": 4,
    // Section 5 achievements
    "code_cartographer": 5,
    "quizmaster_crafter": 5,
    "community_architect": 5,
    "emotion_decoder": 5,
    "suggestion_sage": 5,
    "digital_persona_builder": 5,
    // Section 6 achievements
    "alliance_formed": 6,
  };

  // Function to navigate to a specific section
  const navigateToSection = (sectionLevel: number) => {
    const sectionElement = document.querySelector(`[data-level="${sectionLevel}"]`);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: "smooth" });
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
    { id: "skill_tree_master", title: "Skill Tree Master", xp: 200, section: "Level 4" },
    // Section 5 completion
    { id: "project_master", title: "Project Master", xp: 300, section: "Level 5" },
    // Section 6
    {
      id: "alliance_formed",
      title: "Alliance Formed",
      xp: 100,
      section: "Level 6",
    },
  ];

  // Unlock achievements when sections enter viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const levelAttr = entry.target.getAttribute("data-level");
          const level = levelAttr ? Number(levelAttr) : NaN;
          switch (level) {
            case 2:
              showAchievement("identity_unlocked", setShowIdentityUnlocked);
              observer.unobserve(entry.target);
              break;
            case 3:
              showAchievement("pathfinder", setShowPathfinder);
              observer.unobserve(entry.target);
              break;
            case 4:
              showAchievement("skill_mastery", setShowSkillMastery);
              observer.unobserve(entry.target);
              break;
            case 5:
              showAchievement("quest_conqueror", setShowQuestConqueror);
              observer.unobserve(entry.target);
              break;
            case 6:
              showAchievement(
                "social_link_established",
                setShowSocialLinkEstablished
              );
              observer.unobserve(entry.target);
              break;
            default:
              break;
          }
        });
      },
      { threshold: 0.5 }
    );

    const nodes = document.querySelectorAll<HTMLElement>("section[data-level]");
    nodes.forEach((node) => {
      const levelAttr = node.getAttribute("data-level");
      const level = levelAttr ? Number(levelAttr) : NaN;
      if (level >= 2 && level <= 6) {
        observer.observe(node);
      }
    });

    return () => observer.disconnect();
  }, []);

  const handleStartGame = () => {
    // Play spaceship sound
    if (spaceshipSoundRef.current) {
      spaceshipSoundRef.current.currentTime = 0;
      spaceshipSoundRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
    
    // Show identity unlocked achievement for consistency with section unlocking
    showAchievement("identity_unlocked", setShowIdentityUnlocked);
    
    // Scroll to next section
    nextSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleHowToPlay = () => {
    setShowGameInstructions(true);
    showAchievement("rulebook-raider", setShowRulebookRaider);
  };

  const handleOpenResume = () => {
    window.open(RESUME_URL, '_blank');
  };


  const handleUnlockAllProjects = () => {
    const allProjectIds = ["gitbridge", "quizforge", "isowebsite", "sentimentanalysis", "movierecommendation", "personalwebsite"];
    setUnlockedProjects(new Set(allProjectIds));

    // Trigger section completion achievement
    if (!unlockedSection5Achievements.has("project_master")) {
      showAchievement("project_master", setShowProjectMaster);
    }
  };

  // Section 2 Achievement Handlers
  const handleRevealAvatar = () => {
    setIsCardFlipped(true);
    if (!unlockedSection2Achievements.has("face_of_hero")) {
      showAchievement("face_of_hero", setShowFaceOfHero);
    }
  };

  const handleUnlockLore = () => {
    setIsInfoCardFlipped(true);
    if (!unlockedSection2Achievements.has("keeper_of_stories")) {
      showAchievement("keeper_of_stories", setShowKeeperOfStories);
    }
  };

  const handleUnlockMetrics = () => {
    setIsAttributesCardFlipped(true);
    if (!unlockedSection2Achievements.has("power_unleashed")) {
      showAchievement("power_unleashed", setShowPowerUnleashed);
    }
  };

  // Section 3 Achievement Handlers (none for hint/password anymore)

  // Observe which section is in view and update level indicator
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("section[data-level]")
    );

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            const levelAttr = target.getAttribute("data-level");
            const level = levelAttr ? parseInt(levelAttr, 10) : NaN;
            if (!Number.isNaN(level)) {
              setCurrentLevel(level);
              // Control background visibility to avoid overlapping canvases
              setIsSection1Visible(level === 1);
              setIsSection2Visible(level === 2);
              setIsSection3Visible(level === 3);
            }
          }
        });
      },
      {
        root: null,
        threshold: 0.6,
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Mobile carousel auto-animation effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = parseInt(entry.target.getAttribute('data-card-index') || '0');
            setVisibleCardIndex(cardIndex);
            setCarouselIndex(cardIndex);
          }
        });
      },
      {
        root: null,
        threshold: 0.5,
        rootMargin: '-50px 0px -50px 0px'
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
      showAchievement("guild_explorer", setShowGuildExplorer);
    } else if (
      newIndex === 2 &&
      !unlockedSection3Achievements.has("grandmasters_path")
    ) {
      showAchievement("grandmasters_path", setShowGrandmastersPath);
    }
  };

  const handleSkillClick = (skillName: string) => {
    setUnlockedSkills((prev) => {
      const newSkills = {
        ...prev,
        [skillName]: true, // Once unlocked, stays unlocked
      };
      
      // Check if all skills are now unlocked
      const allSkillsUnlocked = Object.values(newSkills).every(skill => skill);
      if (allSkillsUnlocked && !unlockedSection4Achievements.has("skill_tree_master")) {
        showAchievement("skill_tree_master", setShowSkillTreeMaster);
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
      showAchievement("skill_tree_master", setShowSkillTreeMaster);
    }
  };

  const handleProjectUnlock = (projectId: string) => {
    setUnlockedProjects((prev) => {
      const newProjects = new Set(Array.from(prev).concat(projectId));
      
      // Check if all projects are now unlocked
      const allProjectIds = ["gitbridge", "quizforge", "isowebsite", "sentimentanalysis", "movierecommendation", "personalwebsite"];
      const allProjectsUnlocked = allProjectIds.every(id => newProjects.has(id));
      
      if (allProjectsUnlocked && !unlockedSection5Achievements.has("project_master")) {
        showAchievement("project_master", setShowProjectMaster);
      }
      
      return newProjects;
    });
  };

  const handleProjectFlip = (projectId: string) => {
    setFlippedProjects((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
    // Also unlock the project when flipped
    if (!unlockedProjects.has(projectId)) {
      handleProjectUnlock(projectId);
    }
  };

  const handleProjectLink = (projectId: string) => {
    const projectUrls: { [key: string]: string } = {
      gitbridge: "https://github.com/pranavreddygaddam/gitbridge",
      quizforge: "https://github.com/pranavreddygaddam/quizforge",
      isowebsite: "https://iso-website-six.vercel.app/",
      sentimentanalysis:
        "https://github.com/PranavReddyGaddam/Network-Based-Social-Media-Sentiment-Analysis-on-Twitter",
      movierecommendation:
        "https://github.com/PranavReddyGaddam/Movie-Recomendation",
      personalwebsite: "https://github.com/pranavreddygaddam/gitbridge",
    };

    const url = projectUrls[projectId];
    if (url) {
      window.open(url, "_blank");
    }
  };

  // Removed: career progression unlock handler (no longer gated)

  // Terminal command handler
  const handleTerminalCommand = (command: string) => {
    const cmd = command.toLowerCase().trim();
    let response = '';

    switch (cmd) {
      case 'help':
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
      case 'about':
        response = `Pranav Reddy Gaddam - Full Stack Developer & AI Enthusiast
Master's Student at San Jose State University
Passionate about building innovative solutions with AI and modern web technologies.`;
        break;
      case 'skills':
        response = `Technical Arsenal:
Frontend: React, TypeScript, Tailwind CSS, Next.js
Backend: FastAPI, Node.js, Python, PostgreSQL
AI/ML: OpenAI APIs, LangChain, Vector Databases
DevOps: Docker, AWS, Git, CI/CD
Tools: Vite, Webpack, Figma, VS Code`;
        break;
      case 'projects':
        response = `Featured Projects:
🔗 GitBridge - AI-powered GitHub repository analyzer
   GitHub: https://github.com/pranavreddygaddam/gitbridge

🔗 Hirely - AI interview preparation platform  
   GitHub: https://github.com/pranavreddygaddam/hirely

🔗 Nexus - 3D startup analysis tool
   GitHub: https://github.com/pranavreddygaddam/nexus

🔗 QuizForge - AI quiz generation platform
   GitHub: https://github.com/pranavreddygaddam/quizforge

🔗 ISO Web App - University event management system
   GitHub: https://github.com/pranavreddygaddam/iso-website

🔗 Portfolio - Gamified personal website
   GitHub: https://github.com/pranavreddygaddam/gamified-portfolio

Type 'github' to open main GitHub profile`;
        break;
      case 'github':
        response = `Opening GitHub profile...`;
        setTimeout(() => {
          window.open('https://github.com/PranavReddyGaddam', '_blank');
        }, 1000);
        break;
      case 'resume':
        response = `Opening resume download...`;
        setTimeout(() => {
          window.open('/Pranav_Reddy_Gaddam_Resume_FT_Google.pdf', '_blank');
        }, 1000);
        break;
      case 'contact':
        response = `Get in touch:
Email: pranavreddy.gaddam@sjsu.edu
GitHub: github.com/PranavReddyGaddam
LinkedIn: linkedin.com/in/pranav-reddy-gaddam-69338321b/
Location: San Jose, California

Type 'github' to open GitHub profile directly`;
        break;
      case 'social':
        response = `Social Command Center:
GitHub: Code repositories and contributions
LinkedIn: Professional network and experience
Instagram: Personal journey and lifestyle
Twitter: Tech thoughts and insights

Type 'github' to open GitHub profile directly`;
        break;
      case 'interests':
        response = `Beyond Coding:
Cinema - Exploring legendary films and hidden gems
Sports - Cricket, basketball and athletic pursuits
Cycling - Urban adventures and scenic trails
Travel - Discovering new places and cultures`;
        break;
      case 'clear':
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

    setTerminalHistory(prev => [...prev, `> ${command}`, response]);
  };

  // Handle collaboration form submit (Section 6)
  const handleCollabSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = collabName.trim();
    const trimmedEmail = collabEmail.trim();
    const trimmedMessage = collabMessage.trim();

    if (!trimmedEmail || !trimmedMessage) {
      alert("Please provide your email and a brief message.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Check if EmailJS is properly configured
      if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
        throw new Error('EmailJS configuration is missing. Please check your environment variables.');
      }

      // Initialize EmailJS with your public key
      emailjs.init(EMAILJS_PUBLIC_KEY);

      // Prepare template parameters
      const templateParams = {
        name: trimmedName || "Anonymous",
        email: trimmedEmail,
        message: trimmedMessage,
        title: "Collaboration Request from Portfolio",
        time: new Date().toLocaleString()
      };

      // Send email using EmailJS
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      if (response.status === 200) {
        setSubmitStatus('success');
        // Clear form
        setCollabName("");
        setCollabEmail("");
        setCollabMessage("");
        
        // Trigger Section 6 achievement on successful submit
        showAchievement("alliance_formed", setShowAllianceFormed);
      } else {
        throw new Error('Email sending failed');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
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

      {/* Section 1: Landing Page */}
      <section
        data-level={1}
        className="relative z-10 flex flex-col items-center justify-center h-screen px-4 overflow-hidden pt-20"
      >
        {/* Galaxy Background for Section 1 */}
        <div className="absolute inset-0 z-0">
          {isSection1Visible && (
          <Galaxy
            density={1.5}
            starSpeed={0.7}
            glowIntensity={0.3}
            twinkleIntensity={0.2}
            mouseInteraction={false}
            mouseRepulsion={false}
            transparent={true}
            disableAnimation={!isSection1Visible}
          />
          )}
          {/* Fade out overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        </div>
        <Card className="relative z-10 max-w-2xl w-full text-center mb-16 bg-black border-white">
          <CardContent className="p-8">
            {/* Start Prompt */}
            <p className="font-pressstart2p text-purple-400 text-lg mb-6">
              PRANAV REDDY GADDAM'S
            </p>

            {/* Main Title with Typing Effect */}
            <div className="font-pressstart2p text-2xl sm:text-3xl md:text-4xl lg:text-6xl text-white mb-4">
              <TextType
                text={["RUNTIME ODYSSEY"]}
                typingSpeed={125}
                pauseDuration={1000}
                showCursor={true}
                cursorCharacter="_"
              />
            </div>

            {/* Subtitle */}
            <p className="font-pressstart2p text-xl text-white mb-4">
              LEVEL 1: INTRODUCTION
            </p>

            {/* Description */}
            <p className="font-pressstart2p text-sm text-gray-300 mb-8">
              An engineer's quest across stacks, pipelines, and pixel worlds
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="default"
                size="lg"
                font="retro"
                className="border-purple-400 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3"
                onClick={handleStartGame}
              >
                START GAME
              </Button>

              <Button
                variant="outline"
                size="lg"
                font="retro"
                className="border-white text-white hover:bg-white hover:text-black px-6 py-3"
                onClick={handleHowToPlay}
              >
                HOW TO PLAY
              </Button>
            </div>
          </CardContent>
        </Card>

        </section>

      {/* Transition Section - Smooth Blend */}
      <section className="relative z-10 h-32 bg-gradient-to-b from-transparent via-blue-900/5 to-blue-900/20">
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/20 to-black/0"></div>
      </section>

      {/* Section 2: Character Stats */}
      <section
        data-level={2}
        ref={nextSectionRef}
        className="relative z-10 min-h-screen bg-gradient-to-b from-black via-blue-900/10 to-blue-900/30 px-4 py-16"
      >
        {/* Squares Background */}
        <div className="absolute inset-0 z-0">
          {isSection2Visible && (
          <Squares
            speed={0.3}
            squareSize={40}
            direction="diagonal"
            borderColor="rgba(255,255,255,0.25)"
            hoverFillColor="#222"
            paused={!isSection2Visible}
          />
          )}
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="font-pressstart2p text-2xl sm:text-3xl md:text-4xl text-white border-2 border-blue-400 bg-black/50 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-lg inline-block">
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
                    <div className="border border-blue-400 bg-blue-900/80 backdrop-blur-sm rounded-lg h-full flex flex-col items-center justify-center p-6">
                      <div className="text-center">
                        <div className="flex justify-center mb-4">
                          <ShieldUser className="w-16 h-16 text-blue-400" />
                        </div>
                        <h3 className="font-pressstart2p text-white text-base md:text-lg mb-4">
                          HIDDEN CHARACTER
                        </h3>
                        <p className="font-pixellari text-blue-300 text-xs md:text-sm mb-6">
                          Click to reveal the character
                        </p>
                        <button
                          onClick={handleRevealAvatar}
                          className="font-pressstart2p bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 md:px-6 md:py-3 rounded border border-blue-400 transition-colors text-xs md:text-sm"
                        >
                          REVEAL AVATAR
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Card Front (Character Portrait) */}
                  <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                    <div className="bg-blue-900/80 border border-blue-400 rounded-lg overflow-hidden h-full flex flex-col">
                      {/* Image area */}
                      <div className="flex-1 min-h-0">
                        <img
                          src="/Pranav.jpeg"
                          alt="Character Portrait"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Bottom stats section */}
                      <div className="flex-shrink-0 p-3 bg-blue-900/90 flex flex-col justify-center">
                        {/* Name & Level */}
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-pressstart2p text-xs">
                            Pranav Reddy Gaddam
                          </h4>
                          <p className="text-blue-300 font-pressstart2p text-xs">
                            LVL 24
                          </p>
                        </div>

                        {/* HP & MP side by side */}
                        <div className="flex items-center gap-2 md:gap-4">
                          {/* HP */}
                          <div className="flex items-center gap-1">
                            <span className="text-green-400 text-xs font-pressstart2p">
                              HP
                            </span>
                            <div className="w-16 md:w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div className="w-4/5 h-full bg-green-500 rounded-full"></div>
                            </div>
                          </div>

                          {/* MP */}
                          <div className="flex items-center gap-1">
                            <span className="text-cyan-400 text-xs font-pressstart2p">
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
                        <div className="relative transform rotate-6 hover:rotate-3 transition-transform duration-300">
                          {/* Stamp shadow effect */}
                          <div className="absolute inset-0 bg-red-900/40 blur-lg transform translate-x-1 translate-y-1"></div>
                          
                          {/* Main stamp card - smaller size for lanyard */}
                          <div className="relative bg-gradient-to-br from-red-600 to-red-800 border-3 border-red-900 rounded-md p-3 shadow-xl">
                            {/* Stamp texture overlay */}
                            <div className="absolute inset-0 bg-red-900/20 rounded-md"></div>
                            
                            {/* Ink splatter effects */}
                            <div className="absolute top-1 left-1 w-2 h-2 bg-red-900/60 rounded-full blur-xs"></div>
                            <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-red-900/50 rounded-full blur-xs"></div>
                            
                            {/* Main content */}
                            <div className="relative z-10 text-center">
                              <div className="transform -rotate-1">
                                <h3 className="font-pressstart2p text-white text-sm mb-1 tracking-wider">
                                  TECHIE
                                </h3>
                                <div className="border-t border-white/60 border-b border-white/60 py-1 my-1">
                                  <h4 className="font-pressstart2p text-yellow-300 text-xs font-bold tracking-widest">
                                    FOR HIRE
                                  </h4>
                                </div>
                                <div className="flex justify-center items-center gap-1 mt-1">
                                  <div className="w-4 h-px bg-white/60"></div>
                                  <span className="font-pixellari text-white/80 text-[8px]">NOW</span>
                                  <div className="w-4 h-px bg-white/60"></div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Stamp edges */}
                            <div className="absolute inset-0 border border-white/30 rounded-md pointer-events-none"></div>
                          </div>
                          
                          {/* Additional ink drops */}
                          <div className="absolute -top-0.5 -right-1 w-3 h-3 bg-red-900/50 rounded-full blur-sm"></div>
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
                    <div className="border border-blue-400 bg-blue-900/80 backdrop-blur-sm rounded-lg h-full flex flex-col items-center justify-center p-6">
                      <div className="text-center">
                        <div className="flex justify-center mb-4">
                          <BookOpenText className="w-16 h-16 text-blue-400" />
                        </div>
                        <h3 className="font-pressstart2p text-white text-base md:text-lg mb-4">
                          CHARACTER LORE
                        </h3>
                        <p className="font-pixellari text-blue-300 text-xs md:text-sm mb-6">
                          Uncover backstory
                        </p>
                        <button
                          onClick={handleUnlockLore}
                          className="font-pressstart2p bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 md:px-6 md:py-3 rounded border border-blue-400 transition-colors text-xs md:text-sm"
                        >
                          UNLOCK LORE
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Card Front (Character Info) */}
                  <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                    <div className="bg-blue-900/80 border border-blue-400 rounded-lg p-4 h-full flex flex-col">
                      <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                        <h3 className="font-pressstart2p text-white text-base">
                          CHARACTER INFO
                        </h3>
                      </div>
                      <div className="font-pressstart2p space-y-3 text-gray-300 text-xs md:text-[10px] text-left leading-relaxed overflow-y-auto flex-1 min-h-0">
                        <p className="break-words">
                          A creative full-stack developer who builds
                          intelligent applications using React 18, TypeScript, FastAPI,
                          and real-time ML pipelines. Currently pursuing a Master's in 
                          Computer Science at San Jose State University, with production 
                          projects including Nexus (AI-powered startup analysis), Ripple 
                          (real-time social media intelligence), and gamified portfolio systems.
                        </p>
                        <p className="break-words">
                          Specialized in LLM integration (OpenAI/Anthropic), streaming 
                          systems, and 3D visualization with Three.js. Active 
                          contributor to open-source with expertise in Docker, PostgreSQL, 
                          and scalable real-time applications. Passionate about developing 
                          AI-powered solutions and collaborating on technical teams 
                          through complex engineering challenges.
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
                    <div className="border border-blue-400 bg-blue-900/80 backdrop-blur-sm rounded-lg h-full flex flex-col items-center justify-center p-6">
                      <div className="text-center">
                        <div className="flex justify-center mb-4">
                          <ChartColumnIncreasing className="w-16 h-16 text-blue-400" />
                        </div>
                        <h3 className="font-pressstart2p text-white text-base md:text-lg mb-4">
                          POWER METRICS
                        </h3>
                        <p className="font-pixellari text-blue-300 text-xs md:text-sm mb-6">
                          See True Power
                        </p>
                        <button
                          onClick={handleUnlockMetrics}
                          className="font-pressstart2p bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 md:px-6 md:py-3 rounded border border-blue-400 transition-colors text-xs md:text-sm"
                        >
                          UNLOCK METRICS
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Card Front (Attributes) */}
                  <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                    <div className="bg-blue-900/80 border border-blue-400 rounded-lg p-4 h-full flex flex-col">
                      <h3 className="font-pressstart2p text-white text-base mb-3 flex-shrink-0">
                        COMMIT HISTORY
                      </h3>
                      <div className="flex-1 min-h-0 overflow-x-auto overflow-y-visible">
                        <GitHubCommitChart className="h-full" />
                      </div>

                      {/* Equipped Skills Panel */}
                      <h3 className="font-pressstart2p text-white text-sm md:text-base mb-3 flex-shrink-0 mt-4">
                        EQUIPPED SKILLS
                      </h3>
                      <ul className="space-y-2 md:space-y-3 text-xs text-gray-300 font-pressstart2p overflow-y-auto flex-1 min-h-0">
                        <li className="flex items-center gap-2 whitespace-normal md:whitespace-nowrap">
                          <span className="text-yellow-400">[FRONTEND]</span>
                          React 18 & TypeScript
                        </li>
                        <li className="flex items-center gap-2 whitespace-normal md:whitespace-nowrap">
                          <span className="text-green-400">[BACKEND]</span>
                          FastAPI & Python
                        </li>
                        <li className="flex items-center gap-2 whitespace-normal md:whitespace-nowrap">
                          <span className="text-cyan-400">[ML]</span>
                          Real-time ML Pipelines
                        </li>
                        <li className="flex items-center gap-2 whitespace-normal md:whitespace-nowrap">
                          <span className="text-pink-400">[AI]</span>
                          LLM Integration (OpenAI/Anthropic)
                        </li>
                        <li className="flex items-center gap-2 whitespace-normal md:whitespace-nowrap">
                          <span className="text-indigo-400">[DATA]</span>
                          Social Media Intelligence
                        </li>
                        <li className="flex items-center gap-2 whitespace-normal md:whitespace-nowrap">
                          <span className="text-purple-400">[3D]</span>
                          Three.js & 3D Visualization
                        </li>
                        <li className="flex items-center gap-2 whitespace-normal md:whitespace-nowrap">
                          <span className="text-red-400">[DEVOPS]</span>
                          Docker & Streaming Systems
                        </li>
                      </ul>
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
        className="relative z-10 min-h-screen bg-gradient-to-b from-black via-yellow-900/10 to-yellow-900/30 px-4 py-16"
      >
        {/* Squares Background */}
        <div className="absolute inset-0 z-0">
          {isSection3Visible && (
          <Squares
            speed={0.3}
            squareSize={40}
            direction="diagonal"
            borderColor="rgba(255,255,255,0.25)"
            hoverFillColor="#222"
            paused={!isSection3Visible}
          />
          )}
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="font-pressstart2p text-2xl sm:text-3xl md:text-4xl text-white border-2 border-yellow-400 bg-black/50 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-lg inline-block">
              LEVEL 3: CAREER PATH
            </h2>
            <p className="font-pressstart2p text-white text-sm mt-4">
              ACADEMIC ACHIEVEMENTS AND PROFESSIONAL JOURNEY
            </p>
          </div>

          {/* Career Progression Timeline - Redesigned for Better UX */}
          <div className="flex justify-center items-center mt-8 w-full px-4">
            <div className="w-full max-w-6xl">
              {/* Timeline Navigation - Desktop Only */}
              <div className="hidden md:flex flex-wrap justify-center gap-4 mb-8">
                {[
                  { id: 'bachelors', title: "BACHELOR'S", color: "green" },
                  { id: 'masters', title: "MASTER'S", color: "yellow" },
                  { id: 'experience', title: 'EXPERIENCE', color: "blue" },
                  { id: 'achievements', title: 'ACHIEVEMENTS', color: "purple" }
                ].map((item) => (
                  <Button
                    key={item.id}
                    onClick={() => {
                      const index = item.id === 'bachelors' ? 0 : item.id === 'masters' ? 1 : item.id === 'experience' ? 2 : 3;
                      setCarouselIndex(index);
                      handleCarouselNavigation(index);
                    }}
                    variant={carouselIndex === (item.id === 'bachelors' ? 0 : item.id === 'masters' ? 1 : item.id === 'experience' ? 2 : 3) ? "default" : "outline"}
                    size="lg"
                    font="retro"
                    className={`${
                      carouselIndex === (item.id === 'bachelors' ? 0 : item.id === 'masters' ? 1 : item.id === 'experience' ? 2 : 3)
                        ? `bg-${item.color}-600 border-${item.color}-400 text-white`
                        : `border-${item.color}-400 text-${item.color}-400 hover:bg-${item.color}-600 hover:text-white`
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
                    ref={(el) => { cardRefs.current[1] = el; }}
                    data-card-index="1"
                    className={`cursor-pointer transform transition-all duration-500 flex-shrink-0 w-80 snap-center ${
                      visibleCardIndex === 1 ? 'scale-105 opacity-100' : 'scale-95 opacity-60'
                    }`}
                  >
                    <Card className="bg-yellow-900/80 border-yellow-400 h-full hover:border-yellow-300">
                      <CardContent className="p-4 h-full">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="font-pressstart2p text-white text-lg">MASTER'S</h3>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-pressstart2p text-yellow-400 text-xs mb-1">Quest Title</h4>
                            <p className="font-pixellari text-white text-sm">Master's in Computer Science</p>
                          </div>
                          
                          <div>
                            <h4 className="font-pressstart2p text-yellow-400 text-xs mb-1">Training Grounds</h4>
                            <p className="font-pixellari text-white text-sm">San Jose State University</p>
                          </div>
                          
                          <div>
                            <h4 className="font-pressstart2p text-yellow-400 text-xs mb-1">Campaign Duration</h4>
                            <p className="font-pixellari text-white text-sm">Aug 2024 – May 2026</p>
                          </div>
                          
                          <div>
                            <h4 className="font-pressstart2p text-yellow-400 text-xs mb-1">Stats</h4>
                            <p className="font-pixellari text-white text-sm">CGPA: 3.84 / 4.0</p>
                          </div>
                          
                          <div>
                            <h4 className="font-pressstart2p text-yellow-400 text-xs mb-2">Skills Unlocked</h4>
                            <ul className="space-y-1 font-pixellari text-white text-xs">
                              <li>- Big Data, Machine Learning</li>
                              <li>- Data Warehousing & Pipelines</li>
                              <li>- Applied Statistics, Analytics Strategy</li>
                              <li>- Data-Driven Decision Making</li>
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-pressstart2p text-yellow-400 text-xs mb-2">Achievements</h4>
                            <ul className="space-y-1 font-pixellari text-white text-xs">
                              <li>- Winner SpartUp Spring Hackathon 2025</li>
                              <li>- 8+ AI/ML and Cloud hackathons</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Bachelor's Card */}
                  <div 
                    ref={(el) => { cardRefs.current[0] = el; }}
                    data-card-index="0"
                    className={`cursor-pointer transform transition-all duration-500 flex-shrink-0 w-80 snap-center ${
                      visibleCardIndex === 0 ? 'scale-105 opacity-100' : 'scale-95 opacity-60'
                    }`}
                  >
                    <Card className="bg-green-900/80 border-green-400 h-full hover:border-green-300">
                      <CardContent className="p-4 h-full">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="font-pressstart2p text-white text-lg">BACHELOR'S</h3>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-pressstart2p text-green-400 text-xs mb-1">Quest Title</h4>
                            <p className="font-pixellari text-white text-sm">Bachelor's in Computer Science</p>
                          </div>
                          
                          <div>
                            <h4 className="font-pressstart2p text-green-400 text-xs mb-1">Training Grounds</h4>
                            <p className="font-pixellari text-white text-sm">St. Martin's Engineering College</p>
                          </div>
                          
                          <div>
                            <h4 className="font-pressstart2p text-green-400 text-xs mb-1">Campaign Duration</h4>
                            <p className="font-pixellari text-white text-sm">Aug 2019 – May 2023</p>
                          </div>
                          
                          <div>
                            <h4 className="font-pressstart2p text-green-400 text-xs mb-1">Stats</h4>
                            <p className="font-pixellari text-white text-sm">B. Tech in Computer Science</p>
                          </div>
                          
                          <div>
                            <h4 className="font-pressstart2p text-green-400 text-xs mb-2">Skills Unlocked</h4>
                            <ul className="space-y-1 font-pixellari text-white text-xs">
                              <li>- Data Structures & Algorithms</li>
                              <li>- Web Development, Databases</li>
                              <li>- Machine Learning, AI Basics</li>
                              <li>- Software Engineering</li>
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-pressstart2p text-green-400 text-xs mb-2">Achievements</h4>
                            <ul className="space-y-1 font-pixellari text-white text-xs">
                              <li>- Academic Excellence Award</li>
                              <li>- Multiple Hackathon Wins</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Experience Card */}
                  <div 
                    ref={(el) => { cardRefs.current[2] = el; }}
                    data-card-index="2"
                    className={`cursor-pointer transform transition-all duration-500 flex-shrink-0 w-80 snap-center ${
                      visibleCardIndex === 2 ? 'scale-105 opacity-100' : 'scale-95 opacity-60'
                    }`}
                  >
                    <Card className="bg-blue-900/80 border-blue-400 h-full hover:border-blue-300">
                      <CardContent className="p-4 h-full">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="font-pressstart2p text-white text-lg">EXPERIENCE</h3>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-pressstart2p text-blue-400 text-xs mb-1">Current Quest</h4>
                            <p className="font-pixellari text-white text-sm">Software Engineer (Data)</p>
                          </div>
                          
                          <div>
                            <h4 className="font-pressstart2p text-blue-400 text-xs mb-1">Guild Location</h4>
                            <p className="font-pixellari text-white text-sm">VE Projects Pvt Ltd</p>
                          </div>
                          
                          <div>
                            <h4 className="font-pressstart2p text-blue-400 text-xs mb-1">Campaign Duration</h4>
                            <p className="font-pixellari text-white text-sm">Aug 2023 – Jul 2024</p>
                          </div>
                          
                          <div>
                            <h4 className="font-pressstart2p text-blue-400 text-xs mb-2">Core Technologies</h4>
                            <ul className="space-y-1 font-pixellari text-white text-xs">
                              <li>- FastAPI, React, PostgreSQL</li>
                              <li>- AWS, Docker, Git, CI/CD</li>
                              <li>- OpenAI APIs, LangChain</li>
                              <li>- Vector Databases, RAG Systems</li>
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-pressstart2p text-blue-400 text-xs mb-2">Key Projects</h4>
                            <ul className="space-y-1 font-pixellari text-white text-xs">
                              <li>- AI-powered repository analyzer</li>
                              <li>- Interview preparation platform</li>
                              <li>- Real-time data streaming systems</li>
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-pressstart2p text-blue-400 text-xs mb-1">Expertise Level</h4>
                            <p className="font-pixellari text-white text-sm">Mid-Level Engineer</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Power-Ups Card */}
                  <div 
                    ref={(el) => { cardRefs.current[3] = el; }}
                    data-card-index="3"
                    className={`cursor-pointer transform transition-all duration-500 flex-shrink-0 w-80 snap-center ${
                      visibleCardIndex === 3 ? 'scale-105 opacity-100' : 'scale-95 opacity-60'
                    }`}
                  >
                    <Card className="bg-purple-900/80 border-purple-400 h-full hover:border-purple-300">
                      <CardContent className="p-4 h-full">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="font-pressstart2p text-white text-lg">POWER-UPS</h3>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-pressstart2p text-purple-400 text-xs mb-2">Technical Arsenal</h4>
                            <ul className="space-y-1 font-pixellari text-white text-xs">
                              <li>- React 18, TypeScript, Tailwind CSS</li>
                              <li>- FastAPI, Python, PostgreSQL</li>
                              <li>- AWS, Docker, Git, CI/CD</li>
                              <li>- OpenAI APIs, LangChain</li>
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-pressstart2p text-purple-400 text-xs mb-2">AI/ML Stack</h4>
                            <ul className="space-y-1 font-pixellari text-white text-xs">
                              <li>- Vector Databases, RAG Systems</li>
                              <li>- HuggingFace Transformers</li>
                              <li>- Real-time ML Pipelines</li>
                              <li>- Data Warehousing & Analytics</li>
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-pressstart2p text-purple-400 text-xs mb-2">Power-Ups Unlocked</h4>
                            <ul className="space-y-1 font-pixellari text-white text-xs">
                              <li>- dbt Workflow Development</li>
                              <li>- Vespa Search Systems</li>
                              <li>- HuggingFace Transformers</li>
                              <li>- Streaming Systems & Real-time Data</li>
                              <li>- Snowflake Mastery</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Desktop Grid - Hidden on Mobile */}
              <div className="hidden md:grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
                {/* Bachelor's Card - Desktop */}
                <div 
                  onClick={() => {
                    setCarouselIndex(0);
                    handleCarouselNavigation(0);
                  }}
                  className={`cursor-pointer transform transition-all duration-500 ${
                    carouselIndex === 0 ? 'scale-105 opacity-100' : 'scale-95 opacity-60'
                  }`}
                >
                  <Card className="bg-green-900/80 border-green-400 h-full hover:border-green-300">
                    <CardContent className="p-4 h-full">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-pressstart2p text-white text-lg">BACHELOR'S</h3>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-pressstart2p text-green-400 text-xs mb-1">Quest Title</h4>
                          <p className="font-pixellari text-white text-sm">Bachelor's in Computer Science</p>
                        </div>
                        
                        <div>
                          <h4 className="font-pressstart2p text-green-400 text-xs mb-1">Training Grounds</h4>
                          <p className="font-pixellari text-white text-sm">St. Martin's Engineering College</p>
                        </div>
                        
                        <div>
                          <h4 className="font-pressstart2p text-green-400 text-xs mb-1">Campaign Duration</h4>
                          <p className="font-pixellari text-white text-sm">Aug 2019 – May 2023</p>
                        </div>
                        
                        <div>
                          <h4 className="font-pressstart2p text-green-400 text-xs mb-1">Stats</h4>
                          <p className="font-pixellari text-white text-sm">B. Tech in Computer Science</p>
                        </div>
                        
                        <div>
                          <h4 className="font-pressstart2p text-green-400 text-xs mb-2">Skills Unlocked</h4>
                          <ul className="space-y-1 font-pixellari text-white text-xs">
                            <li>- Data Structures & Algorithms</li>
                            <li>- Web Development, Databases</li>
                            <li>- Machine Learning, AI Basics</li>
                            <li>- Software Engineering</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-pressstart2p text-green-400 text-xs mb-2">Achievements</h4>
                          <ul className="space-y-1 font-pixellari text-white text-xs">
                            <li>- Academic Excellence Award</li>
                            <li>- Multiple Hackathon Wins</li>
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
                    carouselIndex === 1 ? 'scale-105 opacity-100' : 'scale-95 opacity-60'
                  }`}
                >
                  <Card className="bg-yellow-900/80 border-yellow-400 h-full hover:border-yellow-300">
                    <CardContent className="p-4 h-full">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-pressstart2p text-white text-lg">MASTER'S</h3>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-pressstart2p text-yellow-400 text-xs mb-1">Quest Title</h4>
                          <p className="font-pixellari text-white text-sm">Master's in Computer Science</p>
                        </div>
                        
                        <div>
                          <h4 className="font-pressstart2p text-yellow-400 text-xs mb-1">Training Grounds</h4>
                          <p className="font-pixellari text-white text-sm">San Jose State University</p>
                        </div>
                        
                        <div>
                          <h4 className="font-pressstart2p text-yellow-400 text-xs mb-1">Campaign Duration</h4>
                          <p className="font-pixellari text-white text-sm">Aug 2024 – May 2026</p>
                        </div>
                        
                        <div>
                          <h4 className="font-pressstart2p text-yellow-400 text-xs mb-1">Stats</h4>
                          <p className="font-pixellari text-white text-sm">CGPA: 3.84 / 4.0</p>
                        </div>
                        
                        <div>
                          <h4 className="font-pressstart2p text-yellow-400 text-xs mb-2">Skills Unlocked</h4>
                          <ul className="space-y-1 font-pixellari text-white text-xs">
                            <li>- Big Data, Machine Learning</li>
                            <li>- Data Warehousing & Pipelines</li>
                            <li>- Applied Statistics, Analytics Strategy</li>
                            <li>- Data-Driven Decision Making</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-pressstart2p text-yellow-400 text-xs mb-2">Achievements</h4>
                          <ul className="space-y-1 font-pixellari text-white text-xs">
                            <li>- Winner SpartUp Spring Hackathon 2025</li>
                            <li>- 8+ AI/ML and Cloud hackathons</li>
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
                    carouselIndex === 2 ? 'scale-105 opacity-100' : 'scale-95 opacity-60'
                  }`}
                >
                  <Card className="bg-blue-900/80 border-blue-400 h-full hover:border-blue-300">
                    <CardContent className="p-4 h-full">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-pressstart2p text-white text-lg">EXPERIENCE</h3>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-pressstart2p text-blue-400 text-xs mb-1">Current Quest</h4>
                          <p className="font-pixellari text-white text-sm">Software Engineer (Data)</p>
                        </div>
                        
                        <div>
                          <h4 className="font-pressstart2p text-blue-400 text-xs mb-1">Guild Location</h4>
                          <p className="font-pixellari text-white text-sm">VE Projects Pvt Ltd</p>
                        </div>
                        
                        <div>
                          <h4 className="font-pressstart2p text-blue-400 text-xs mb-1">Campaign Duration</h4>
                          <p className="font-pixellari text-white text-sm">Aug 2023 – Jul 2024</p>
                        </div>
                        
                        <div>
                          <h4 className="font-pressstart2p text-blue-400 text-xs mb-2">Core Technologies</h4>
                          <ul className="space-y-1 font-pixellari text-white text-xs">
                            <li>- FastAPI, React, PostgreSQL</li>
                            <li>- AWS, Docker, Git, CI/CD</li>
                            <li>- OpenAI APIs, LangChain</li>
                            <li>- Vector Databases, RAG Systems</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-pressstart2p text-blue-400 text-xs mb-2">Key Projects</h4>
                          <ul className="space-y-1 font-pixellari text-white text-xs">
                            <li>- AI-powered repository analyzer</li>
                            <li>- Interview preparation platform</li>
                            <li>- Real-time data streaming systems</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-pressstart2p text-blue-400 text-xs mb-1">Expertise Level</h4>
                          <p className="font-pixellari text-white text-sm">Mid-Level Engineer</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Power-Ups Card - Desktop */}
                <div 
                  onClick={() => {
                    setCarouselIndex(3);
                    handleCarouselNavigation(3);
                  }}
                  className={`cursor-pointer transform transition-all duration-500 ${
                    carouselIndex === 3 ? 'scale-105 opacity-100' : 'scale-95 opacity-60'
                  }`}
                >
                  <Card className="bg-purple-900/80 border-purple-400 h-full hover:border-purple-300">
                    <CardContent className="p-4 h-full">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-pressstart2p text-white text-lg">POWER-UPS</h3>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-pressstart2p text-purple-400 text-xs mb-2">Technical Arsenal</h4>
                          <ul className="space-y-1 font-pixellari text-white text-xs">
                            <li>- React 18, TypeScript, Tailwind CSS</li>
                            <li>- FastAPI, Python, PostgreSQL</li>
                            <li>- AWS, Docker, Git, CI/CD</li>
                            <li>- OpenAI APIs, LangChain</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-pressstart2p text-purple-400 text-xs mb-2">AI/ML Stack</h4>
                          <ul className="space-y-1 font-pixellari text-white text-xs">
                            <li>- Vector Databases, RAG Systems</li>
                            <li>- HuggingFace Transformers</li>
                            <li>- Real-time ML Pipelines</li>
                            <li>- Data Warehousing & Analytics</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-pressstart2p text-purple-400 text-xs mb-2">Power-Ups Unlocked</h4>
                          <ul className="space-y-1 font-pixellari text-white text-xs">
                            <li>- dbt Workflow Development</li>
                            <li>- Vespa Search Systems</li>
                            <li>- HuggingFace Transformers</li>
                            <li>- Streaming Systems & Real-time Data</li>
                            <li>- Snowflake Mastery</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Progress Indicator - Desktop Only */}
              <div className="hidden md:flex justify-center mt-8">
                <div className="flex gap-2">
                  {[0, 1, 2, 3].map((idx) => (
                    <div
                      key={idx}
                      className={`h-2 w-8 rounded-full transition-all duration-300 ${
                        carouselIndex === idx
                          ? 'bg-yellow-400 scale-110'
                          : 'bg-gray-600 hover:bg-gray-500'
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
        className="relative z-10 min-h-screen bg-gradient-to-b from-black via-green-900/10 to-green-900/30 px-4 py-16"
      >
        {/* State for unlocked skills */}
        <script>
          {`
             window.unlockedSkills = window.unlockedSkills || {};
           `}
        </script>
        {/* Squares Background */}
        <div className="absolute inset-0 z-0">
          <Squares
            speed={0.3}
            squareSize={40}
            direction="diagonal"
            borderColor="rgba(255,255,255,0.25)"
            hoverFillColor="#222"
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 relative">
            <h2 className="font-pressstart2p text-2xl sm:text-3xl md:text-4xl text-white border-2 border-green-400 bg-black/50 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-lg inline-block">
              LEVEL 4: SKILL TREE
            </h2>
            <p className="font-pressstart2p text-white text-sm mt-4">
              CLICK ON SKILLS TO UNLOCK THEM AND EARN EXPERIENCE POINTS
            </p>
            
            {/* Unlock All Button - Only show when at least one skill is unlocked */}
            {Object.values(unlockedSkills).some(skill => skill) && (
              <Button
                onClick={handleUnlockAllSkills}
                variant="outline"
                size="sm"
                font="retro"
                className="absolute top-0 right-0 text-green-400 hover:text-white bg-black/70 border border-green-400 hover:border-green-300 px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-2 hover:bg-green-900/20 hover:scale-105 whitespace-nowrap"
                title="Unlock all skills at once"
              >
                <span className="hidden sm:inline">UNLOCK ALL</span>
                <span className="sm:hidden">ALL</span>
              </Button>
            )}
          </div>

          {/* Skill Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {/* Frontend Skills */}
            <div
              className={`border rounded-lg p-6 transition-all duration-300 cursor-pointer relative overflow-hidden ${
                unlockedSkills.frontend
                  ? "bg-blue-900/80 border-blue-400 hover:border-blue-300"
                  : "bg-black/90 border-green-400 hover:border-green-300 shadow-lg shadow-green-500/20"
              }`}
              onClick={() => handleSkillClick("frontend")}
            >
              {/* Header - Always visible */}
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <span
                  className={`text-2xl ${
                    unlockedSkills.frontend ? "text-blue-400" : "text-white"
                  }`}
                >
                  &lt;/&gt;
                </span>
                <h3 className="font-pressstart2p text-white text-lg">
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
                      <span className="font-pressstart2p text-white text-sm animate-bounce">
                        UNLOCK
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Unlocked state - Show skills */
                  <div className="relative z-10">
                    <ul className="space-y-2 text-gray-300 font-pixellari text-sm mb-8">
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">●</span>
                        React 18 & TypeScript
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">●</span>
                        Vite & Modern Build Tools
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">●</span>
                        Tailwind CSS & Responsive Design
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">●</span>
                        Three.js & React Three Fiber
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">●</span>
                        React Router & State Management
                      </li>
                    </ul>

                    {/* Bottom status text */}
                    <div className="flex justify-between items-end mt-8">
                      <span className="font-pixellari text-white text-sm">
                        +50 XP
                      </span>
                      <Badge variant="default" font="retro" className="bg-green-600 border-green-400 text-green-400 text-sm">
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
                  ? "bg-cyan-900/80 border-cyan-400 hover:border-cyan-300"
                  : "bg-black/90 border-green-400 hover:border-green-300 shadow-lg shadow-green-500/20"
              }`}
              onClick={() => handleSkillClick("backend")}
            >
              {/* Header - Always visible */}
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <span
                  className={`text-2xl ${
                    unlockedSkills.backend ? "text-cyan-400" : "text-white"
                  }`}
                >
                  {RxGear as any}
                </span>
                <h3 className="font-pressstart2p text-white text-lg">
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
                      <span className="font-pressstart2p text-white text-sm animate-bounce">
                        UNLOCK
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Unlocked state - Show skills */
                  <div className="relative z-10">
                    <ul className="space-y-2 text-gray-300 font-pixellari text-sm mb-8">
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">●</span>
                        FastAPI & Python
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">●</span>
                        PostgreSQL & Database Design
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">●</span>
                        REST APIs & Pydantic
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">●</span>
                        WebSocket & Real-time Communication
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">●</span>
                        Authentication & Security
                      </li>
                    </ul>

                    {/* Bottom status text */}
                    <div className="flex justify-between items-end mt-8">
                      <span className="font-pixellari text-white text-sm">
                        +50 XP
                      </span>
                      <Badge variant="default" font="retro" className="bg-green-600 border-green-400 text-green-400 text-sm">
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
                  ? "bg-green-900/80 border-green-400 hover:border-green-300"
                  : "bg-black/90 border-green-400 hover:border-green-300 shadow-lg shadow-green-500/20"
              }`}
              onClick={() => handleSkillClick("database")}
            >
              {/* Header - Always visible */}
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <span
                  className={`text-2xl ${
                    unlockedSkills.database ? "text-green-400" : "text-white"
                  }`}
                >
                  {BsDatabaseAdd as any}
                </span>
                <h3 className="font-pressstart2p text-white text-lg">
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
                      <span className="font-pressstart2p text-white text-sm animate-bounce">
                        UNLOCK
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Unlocked state - Show skills */
                  <div className="relative z-10">
                    <ul className="space-y-2 text-gray-300 font-pixellari text-sm mb-8">
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">●</span>
                        PostgreSQL
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">●</span>
                        MySQL
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">●</span>
                        MongoDB
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">●</span>
                        Redis
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">●</span>
                        Snowflake
                      </li>
                    </ul>

                    {/* Bottom status text */}
                    <div className="flex justify-between items-end mt-8">
                      <span className="font-pixellari text-white text-sm">
                        +50 XP
                      </span>
                      <Badge variant="default" font="retro" className="bg-green-600 border-green-400 text-green-400 text-sm">
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
                  ? "bg-yellow-900/80 border-yellow-400 hover:border-yellow-300"
                  : "bg-black/90 border-green-400 hover:border-green-300 shadow-lg shadow-green-500/20"
              }`}
              onClick={() => handleSkillClick("devops")}
            >
              {/* Header - Always visible */}
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <span
                  className={`text-2xl ${
                    unlockedSkills.devops ? "text-yellow-400" : "text-white"
                  }`}
                >
                  {FaDocker as any}
                </span>
                <h3 className="font-pressstart2p text-white text-lg">DevOps</h3>
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
                      <span className="font-pressstart2p text-white text-sm animate-bounce">
                        UNLOCK
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Unlocked state - Show skills */
                  <div className="relative z-10">
                    <ul className="space-y-2 text-gray-300 font-pixellari text-sm mb-8">
                      <li className="flex items-center gap-2">
                        <span className="text-yellow-400">●</span>
                        Docker & Containerization
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-yellow-400">●</span>
                        Streaming Systems & Real-time Data
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-yellow-400">●</span>
                        Data Pipeline Engineering
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-yellow-400">●</span>
                        API Design & Microservices
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-yellow-400">●</span>
                        Performance Optimization
                      </li>
                    </ul>

                    {/* Bottom status text */}
                    <div className="flex justify-between items-end mt-8">
                      <span className="font-pixellari text-white text-sm">
                        +50 XP
                      </span>
                      <Badge variant="default" font="retro" className="bg-green-600 border-green-400 text-green-400 text-sm">
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
                  ? "bg-purple-900/80 border-purple-400 hover:border-purple-300"
                  : "bg-black/90 border-green-400 hover:border-green-300 shadow-lg shadow-green-500/20"
              }`}
              onClick={() => handleSkillClick("ai")}
            >
              {/* Header - Always visible */}
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <span
                  className={`text-2xl ${
                    unlockedSkills.ai ? "text-purple-400" : "text-white"
                  }`}
                >
                  {BsRobot as any}
                </span>
                <h3 className="font-pressstart2p text-white text-lg">AI/ML</h3>
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
                      <span className="font-pressstart2p text-white text-sm animate-bounce">
                        UNLOCK
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Unlocked state - Show skills */
                  <div className="relative z-10">
                    <ul className="space-y-2 text-gray-300 font-pixellari text-sm mb-8">
                      <li className="flex items-center gap-2">
                        <span className="text-purple-400">●</span>
                        OpenAI & Anthropic API Integration
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-purple-400">●</span>
                        Real-time Data Processing Pipelines
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-purple-400">●</span>
                        Social Media Intelligence & Sentiment Analysis
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-purple-400">●</span>
                        ML Model Deployment & Streaming
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-purple-400">●</span>
                        Data Visualization & Topic Modeling
                      </li>
                    </ul>

                    {/* Bottom status text */}
                    <div className="flex justify-between items-end mt-8">
                      <span className="font-pixellari text-white text-sm">
                        +50 XP
                      </span>
                      <Badge variant="default" font="retro" className="bg-green-600 border-green-400 text-green-400 text-sm">
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
                  ? "bg-pink-900/80 border-pink-400 hover:border-pink-300"
                  : "bg-black/90 border-green-400 hover:border-green-300 shadow-lg shadow-green-500/20"
              }`}
              onClick={() => handleSkillClick("tools")}
            >
              {/* Header - Always visible */}
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <span
                  className={`text-2xl ${
                    unlockedSkills.tools ? "text-pink-400" : "text-white"
                  }`}
                >
                  {BsTools as any}
                </span>
                <h3 className="font-pressstart2p text-white text-lg">Tools</h3>
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
                      <span className="font-pressstart2p text-white text-sm animate-bounce">
                        UNLOCK
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Unlocked state - Show skills */
                  <div className="relative z-10">
                    <ul className="space-y-2 text-gray-300 font-pixellari text-sm mb-8">
                      <li className="flex items-center gap-2">
                        <span className="text-pink-400">●</span>
                        Git & Version Control
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-pink-400">●</span>
                        VS Code & Development Tools
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-pink-400">●</span>
                        API Testing & Documentation
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-pink-400">●</span>
                        Data Analysis & Visualization
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-pink-400">●</span>
                        Project Management & Collaboration
                      </li>
                    </ul>

                    {/* Bottom status text */}
                    <div className="flex justify-between items-end mt-8">
                      <span className="font-pixellari text-white text-sm">
                        +50 XP
                      </span>
                      <Badge variant="default" font="retro" className="bg-green-600 border-green-400 text-green-400 text-sm">
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
        className="relative z-10 min-h-screen bg-gradient-to-b from-black via-red-900/10 to-red-900/30 px-4 py-16"
      >
        {/* Squares Background */}
        <div className="absolute inset-0 z-0">
          <Squares
            speed={0.3}
            squareSize={40}
            direction="diagonal"
            borderColor="rgba(255,255,255,0.25)"
            hoverFillColor="#222"
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="font-pressstart2p text-2xl sm:text-3xl md:text-4xl text-white border-2 border-red-400 bg-black/50 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-lg inline-block">
              LEVEL 5: PROJECT QUESTS
            </h2>
            <p className="font-pressstart2p text-white text-sm mt-4">
              UNLOCK PROJECTS TO VIEW DETAILS AND EARN REWARDS
            </p>
          </div>

          {/* Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {/* gitbridge AI Project */}
            <div className="relative w-full h-[450px] perspective-1000">
              <div
                className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                  flippedProjects.has("gitbridge") ? "rotate-y-180" : ""
                }`}
              >
                {/* Front Card - Locked State */}
                <div className="absolute inset-0 w-full h-full backface-hidden">
                  <div className="border border-red-400 bg-red-900/80 backdrop-blur-sm rounded-lg h-full flex flex-col items-center justify-center p-6">
                    <div className="text-center">
                      <div className="flex justify-center mb-4">
                        <img
                          src="/github-mark-white.png"
                          alt="GitBridge"
                          className="w-24 h-24 md:w-32 md:h-32 object-contain opacity-90"
                        />
                      </div>
                      <h3 className="font-pressstart2p text-white text-base md:text-lg mb-4">
                        GitBridge
                      </h3>
                      <p className="font-pixellari text-red-300 text-xs md:text-sm mb-6">
                        Click to reveal project
                      </p>
                      <button
                        onClick={() => handleProjectFlip("gitbridge")}
                        className="font-pressstart2p bg-red-600 hover:bg-red-700 text-white px-4 py-2 md:px-6 md:py-3 rounded border border-red-400 transition-colors text-xs md:text-sm"
                      >
                        UNLOCK PROJECT
                      </button>
                    </div>
                  </div>
                </div>

                {/* Back Card - Unlocked State */}
                <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                  <div className="bg-black/80 border border-red-400 rounded-lg overflow-hidden h-full flex flex-col">
                    {/* Project Name - Flexible Height */}
                    <div className="min-h-[12%] py-2 px-4 flex items-center justify-center border-b border-red-400/30 relative">
                      <h3 className="font-pressstart2p text-white text-xs md:text-sm text-center leading-tight break-words px-8">
                        GitBridge
                      </h3>
                      {/* Difficulty Badge */}
                      <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-pressstart2p whitespace-nowrap flex-shrink-0">
                        Hard
                      </div>
                    </div>

                    {/* Project Details - Flexible Height */}
                    <div className="flex-1 p-4 flex flex-col overflow-hidden flex-shrink-0 min-h-0">
                      <p className="text-gray-300 font-pixellari text-sm md:text-base mb-3 leading-relaxed flex-1">
                        AI-powered developer tool that transforms GitHub repositories into interactive diagrams and narrated explainers. Generates visual system diagrams, provides AI-narrated walkthroughs, and offers intelligent Q&A for codebase exploration. Built with FastAPI and AWS.
                      </p>
                      {/* Technology Tags */}
                      <div className="flex flex-wrap gap-2 mt-auto">
                        <span className="bg-red-900/50 text-red-300 px-3 py-1 rounded text-xs md:text-sm font-pixellari">
                          ElevenLabs
                        </span>
                        <span className="bg-red-900/50 text-red-300 px-3 py-1 rounded text-xs md:text-sm font-pixellari">
                          FastAPI
                        </span>
                        <span className="bg-red-900/50 text-red-300 px-3 py-1 rounded text-xs md:text-sm font-pixellari">
                          AWS
                        </span>
                        <span className="bg-red-900/50 text-red-300 px-3 py-1 rounded text-xs md:text-sm font-pixellari">
                          MermaidJS
                        </span>
                      </div>
                    </div>

                    {/* View Code Button - Fixed Bottom */}
                    <div className="flex-shrink-0 py-3 px-4 flex items-center justify-center border-t border-red-400/30">
                      <Button
                        onClick={() => handleProjectLink("gitbridge")}
                        variant="default"
                        size="sm"
                        font="retro"
                        className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 border border-red-400 flex items-center justify-center gap-2 text-xs"
                      >
                        <span>View Code</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Hirely */}
            <div className="relative w-full h-[450px] perspective-1000">
              <div
                className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                  flippedProjects.has("hirely") ? "rotate-y-180" : ""
                }`}
              >
                {/* Front Card - Locked State */}
                <div className="absolute inset-0 w-full h-full backface-hidden">
                  <div className="border border-red-400 bg-red-900/80 backdrop-blur-sm rounded-lg h-full flex flex-col items-center justify-center p-6">
                    <div className="text-center">
                      <div className="flex justify-center mb-4">
                        <img
                          src="/Hirely.png"
                          alt="Hirely"
                          className="w-32 h-32 md:w-40 md:h-40 object-contain opacity-90"
                        />
                      </div>
                      <h3 className="font-pressstart2p text-white text-base md:text-lg mb-4">
                        Hirely
                      </h3>
                      <p className="font-pixellari text-red-300 text-xs md:text-sm mb-6">
                        Click to reveal project
                      </p>
                      <button
                        onClick={() => handleProjectFlip("hirely")}
                        className="font-pressstart2p bg-red-600 hover:bg-red-700 text-white px-4 py-2 md:px-6 md:py-3 rounded border border-red-400 transition-colors text-xs md:text-sm"
                      >
                        UNLOCK PROJECT
                      </button>
                    </div>
                  </div>
                </div>

                {/* Back Card - Unlocked State */}
                <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                  <div className="bg-black/80 border border-red-400 rounded-lg overflow-hidden h-full flex flex-col">
                    {/* Project Name - Flexible Height */}
                    <div className="min-h-[12%] py-2 px-4 flex items-center justify-center border-b border-red-400/30 relative">
                      <h3 className="font-pressstart2p text-white text-xs md:text-sm text-center leading-tight break-words px-8">
                        Hirely
                      </h3>
                      {/* Difficulty Badge */}
                      <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-pressstart2p whitespace-nowrap flex-shrink-0">
                        Hard
                      </div>
                    </div>

                    {/* Project Details - Flexible Height */}
                    <div className="flex-1 p-4 flex flex-col overflow-hidden flex-shrink-0 min-h-0">
                      <p className="text-gray-300 font-pixellari text-sm md:text-base mb-3 leading-relaxed flex-1">
                        AI-powered interview analysis and preparation platform that bridges real job market data with personalized training. Scrapes live job listings using BrightData MCP and Crawl4AI, performs skill analysis via Groq, and generates customized interview questions. Built with FastAPI, React, Supabase, and ChromaDB.
                      </p>
                      {/* Technology Tags */}
                      <div className="flex flex-wrap gap-2 mt-auto">
                        <span className="bg-red-900/50 text-red-300 px-3 py-1 rounded text-xs md:text-sm font-pixellari">
                          FastAPI
                        </span>
                        <span className="bg-red-900/50 text-red-300 px-3 py-1 rounded text-xs md:text-sm font-pixellari">
                          React
                        </span>
                        <span className="bg-red-900/50 text-red-300 px-3 py-1 rounded text-xs md:text-sm font-pixellari">
                          Groq
                        </span>
                        <span className="bg-red-900/50 text-red-300 px-3 py-1 rounded text-xs md:text-sm font-pixellari">
                          Supabase
                        </span>
                        <span className="bg-red-900/50 text-red-300 px-3 py-1 rounded text-xs md:text-sm font-pixellari">
                          ChromaDB
                        </span>
                      </div>
                    </div>

                    {/* View Code Button - Fixed Bottom */}
                    <div className="flex-shrink-0 py-3 px-4 flex items-center justify-center border-t border-red-400/30">
                      <Button
                        onClick={() => handleProjectLink("hirely")}
                        variant="default"
                        size="sm"
                        font="retro"
                        className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 border border-red-400 flex items-center justify-center gap-2 text-xs"
                      >
                        <span>View Code</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Nexus */}
            <div className="relative w-full h-[450px] perspective-1000">
              <div
                className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                  flippedProjects.has("nexus") ? "rotate-y-180" : ""
                }`}
              >
                {/* Front Card - Locked State */}
                <div className="absolute inset-0 w-full h-full backface-hidden">
                  <div className="border border-red-400 bg-red-900/80 backdrop-blur-sm rounded-lg h-full flex flex-col items-center justify-center p-6">
                    <div className="text-center">
                      <div className="flex justify-center mb-4">
                        <img
                          src="/market_research.png"
                          alt="Nexus"
                          className="w-32 h-32 md:w-40 md:h-40 object-contain opacity-90"
                        />
                      </div>
                      <h3 className="font-pressstart2p text-white text-base md:text-lg mb-4">
                        Nexus
                      </h3>
                      <p className="font-pixellari text-red-300 text-xs md:text-sm mb-6">
                        Click to reveal project
                      </p>
                      <button
                        onClick={() => handleProjectFlip("nexus")}
                        className="font-pressstart2p bg-red-600 hover:bg-red-700 text-white px-4 py-2 md:px-6 md:py-3 rounded border border-red-400 transition-colors text-xs md:text-sm"
                      >
                        UNLOCK PROJECT
                      </button>
                    </div>
                  </div>
                </div>

                {/* Back Card - Unlocked State */}
                <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                  <div className="bg-black/80 border border-red-400 rounded-lg overflow-hidden h-full flex flex-col">
                    {/* Project Name - Flexible Height */}
                    <div className="min-h-[12%] py-2 px-4 flex items-center justify-center border-b border-red-400/30 relative">
                      <h3 className="font-pressstart2p text-white text-xs md:text-sm text-center leading-tight break-words px-8">
                        Nexus
                      </h3>
                      {/* Difficulty Badge */}
                      <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-pressstart2p whitespace-nowrap flex-shrink-0">
                        Hard
                      </div>
                    </div>

                    {/* Project Details - Flexible Height */}
                    <div className="flex-1 p-4 flex flex-col overflow-hidden flex-shrink-0 min-h-0">
                      <p className="text-gray-300 font-pixellari text-sm md:text-base mb-3 leading-relaxed flex-1">
                        AI-driven startup analysis platform that evaluates business ideas through simulated expert personas. Users visualize insights on an interactive 3D globe and receive market-specific feedback powered by LLMs. Features real-time analysis, file uploads, and WebSocket-based live updates. Built with React, Three.js, and FastAPI.
                      </p>
                      {/* Technology Tags */}
                      <div className="flex flex-wrap gap-2 mt-auto">
                        <span className="bg-red-900/50 text-red-300 px-3 py-1 rounded text-xs md:text-sm font-pixellari">
                          React
                        </span>
                        <span className="bg-red-900/50 text-red-300 px-3 py-1 rounded text-xs md:text-sm font-pixellari">
                          Three.js
                        </span>
                        <span className="bg-red-900/50 text-red-300 px-3 py-1 rounded text-xs md:text-sm font-pixellari">
                          Tailwind CSS
                        </span>
                        <span className="bg-red-900/50 text-red-300 px-3 py-1 rounded text-xs md:text-sm font-pixellari">
                          FastAPI
                        </span>
                        <span className="bg-red-900/50 text-red-300 px-3 py-1 rounded text-xs md:text-sm font-pixellari">
                          OpenAI
                        </span>
                      </div>
                    </div>

                    {/* View Code Button - Fixed Bottom */}
                    <div className="flex-shrink-0 py-3 px-4 flex items-center justify-center border-t border-red-400/30">
                      <Button
                        onClick={() => handleProjectLink("nexus")}
                        variant="default"
                        size="sm"
                        font="retro"
                        className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 border border-red-400 flex items-center justify-center gap-2 text-xs"
                      >
                        <span>View Code</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. QuizForge */}
            <div className="relative w-full h-[450px] perspective-1000">
              <div
                className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                  flippedProjects.has("quizforge") ? "rotate-y-180" : ""
                }`}
              >
                {/* Front Card - Locked State */}
                <div className="absolute inset-0 w-full h-full backface-hidden">
                  <div className="border border-red-400 bg-red-900/80 backdrop-blur-sm rounded-lg h-full flex flex-col items-center justify-center p-6">
                    <div className="text-center">
                      <div className="flex justify-center mb-4">
                        <img
                          src="/Quiz.png"
                          alt="QuizForge"
                          className="w-24 h-24 md:w-32 md:h-32 object-contain opacity-90"
                        />
                      </div>
                      <h3 className="font-pressstart2p text-white text-base md:text-lg mb-4">
                        QuizForge
                      </h3>
                      <p className="font-pixellari text-red-300 text-xs md:text-sm mb-6">
                        Click to reveal project
                      </p>
                      <button
                        onClick={() => handleProjectFlip("quizforge")}
                        className="font-pressstart2p bg-red-600 hover:bg-red-700 text-white px-4 py-2 md:px-6 md:py-3 rounded border border-red-400 transition-colors text-xs md:text-sm"
                      >
                        UNLOCK PROJECT
                      </button>
                    </div>
                  </div>
                </div>

                {/* Back Card - Unlocked State */}
                <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                  <div className="bg-black/80 border border-red-400 rounded-lg overflow-hidden h-full flex flex-col">
                    {/* Project Name - Flexible Height */}
                    <div className="min-h-[12%] py-2 px-4 flex items-center justify-center border-b border-red-400/30 relative">
                      <h3 className="font-pressstart2p text-white text-xs md:text-sm text-center leading-tight break-words px-8">
                        QuizForge
                      </h3>
                      {/* Difficulty Badge */}
                      <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-pressstart2p whitespace-nowrap flex-shrink-0">
                        Hard
                      </div>
                    </div>

                    {/* Project Details - Flexible Height */}
                    <div className="flex-1 p-4 flex flex-col overflow-hidden flex-shrink-0 min-h-0">
                      <p className="text-gray-300 font-pixellari text-sm md:text-base mb-3 leading-relaxed flex-1">
                        AI-powered quiz generation platform for educators. Generates custom quizzes from any topic using Qwen3 LLM with automatic question generation and performance analytics. Built with Next.js and MongoDB.
                      </p>
                      {/* Technology Tags */}
                      <div className="flex flex-wrap gap-2 mt-auto">
                        <span className="bg-red-900/50 text-red-300 px-3 py-1 rounded text-xs md:text-sm font-pixellari">
                          Next.js
                        </span>
                        <span className="bg-red-900/50 text-red-300 px-3 py-1 rounded text-xs md:text-sm font-pixellari">
                          JavaScript
                        </span>
                        <span className="bg-red-900/50 text-red-300 px-3 py-1 rounded text-xs md:text-sm font-pixellari">
                          Qwen3 LLM
                        </span>
                        <span className="bg-red-900/50 text-red-300 px-3 py-1 rounded text-xs md:text-sm font-pixellari">
                          MongoDB
                        </span>
                      </div>
                    </div>

                    {/* View Code Button - Fixed Bottom */}
                    <div className="flex-shrink-0 py-3 px-4 flex items-center justify-center border-t border-red-400/30">
                      <Button
                        onClick={() => handleProjectLink("quizforge")}
                        variant="default"
                        size="sm"
                        font="retro"
                        className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 border border-red-400 flex items-center justify-center gap-2 text-xs"
                      >
                        <span>View Code</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. ISO Web App */}
            <div className="relative w-full h-[450px] perspective-1000">
              <div
                className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                  flippedProjects.has("isowebapp") ? "rotate-y-180" : ""
                }`}
              >
                {/* Front Card - Locked State */}
                <div className="absolute inset-0 w-full h-full backface-hidden">
                  <div className="border border-red-400 bg-red-900/80 backdrop-blur-sm rounded-lg h-full flex flex-col items-center justify-center p-6">
                    <div className="text-center">
                      <div className="flex justify-center mb-4">
                        <img
                          src="/SJSU_Logo.webp"
                          alt="ISO Web App"
                          className="w-24 h-24 md:w-32 md:h-32 object-contain opacity-90"
                        />
                      </div>
                      <h3 className="font-pressstart2p text-white text-base md:text-lg mb-4">
                        ISO Web App
                      </h3>
                      <p className="font-pixellari text-red-300 text-xs md:text-sm mb-6">
                        Click to reveal project
                      </p>
                      <button
                        onClick={() => handleProjectFlip("isowebapp")}
                        className="font-pressstart2p bg-red-600 hover:bg-red-700 text-white px-4 py-2 md:px-6 md:py-3 rounded border border-red-400 transition-colors text-xs md:text-sm"
                      >
                        UNLOCK PROJECT
                      </button>
                    </div>
                  </div>
                </div>

                {/* Back Card - Unlocked State */}
                <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                  <div className="bg-black/80 border border-red-400 rounded-lg overflow-hidden h-full flex flex-col">
                    {/* Project Name - Flexible Height */}
                    <div className="min-h-[12%] py-2 px-4 flex items-center justify-center border-b border-red-400/30 relative">
                      <h3 className="font-pressstart2p text-white text-xs md:text-sm text-center leading-tight break-words px-8">
                        ISO Web App
                      </h3>
                      {/* Difficulty Badge */}
                      <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-pressstart2p whitespace-nowrap flex-shrink-0">
                        Hard
                      </div>
                    </div>

                    {/* Project Details - Flexible Height */}
                    <div className="flex-1 p-4 flex flex-col overflow-hidden flex-shrink-0 min-h-0">
                      <p className="text-gray-300 font-pixellari text-sm md:text-base mb-3 leading-relaxed flex-1">
                        Comprehensive volunteer and event management system for university organizations. Includes role-based access, dynamic ticketing, QR check-in, and admin dashboard. Integrates Supabase for PostgreSQL storage, Gmail API for notifications, and FastAPI backend with Docker deployment. Built with React, Tailwind CSS, and FastAPI.
                      </p>
                      {/* Technology Tags */}
                      <div className="flex flex-wrap gap-2 mt-auto">
                        <span className="bg-red-900/50 text-red-300 px-3 py-1 rounded text-xs md:text-sm font-pixellari">
                          FastAPI
                        </span>
                        <span className="bg-red-900/50 text-red-300 px-3 py-1 rounded text-xs md:text-sm font-pixellari">
                          React
                        </span>
                        <span className="bg-red-900/50 text-red-300 px-3 py-1 rounded text-xs md:text-sm font-pixellari">
                          Tailwind CSS
                        </span>
                        <span className="bg-red-900/50 text-red-300 px-3 py-1 rounded text-xs md:text-sm font-pixellari">
                          Supabase
                        </span>
                        <span className="bg-red-900/50 text-red-300 px-3 py-1 rounded text-xs md:text-sm font-pixellari">
                          Docker
                        </span>
                      </div>
                    </div>

                    {/* View Code Button - Fixed Bottom */}
                    <div className="flex-shrink-0 py-3 px-4 flex items-center justify-center border-t border-red-400/30">
                      <Button
                        onClick={() => handleProjectLink("isowebapp")}
                        variant="default"
                        size="sm"
                        font="retro"
                        className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 border border-red-400 flex items-center justify-center gap-2 text-xs"
                      >
                        <span>View Code</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 6. Portfolio */}
            <div className="relative w-full h-[450px] perspective-1000">
              <div
                className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                  flippedProjects.has("personalwebsite") ? "rotate-y-180" : ""
                }`}
              >
                {/* Front Card - Locked State */}
                <div className="absolute inset-0 w-full h-full backface-hidden">
                  <div className="border border-red-400 bg-red-900/80 backdrop-blur-sm rounded-lg h-full flex flex-col items-center justify-center p-6">
                    <div className="text-center">
                      <div className="flex justify-center mb-4">
                        <img
                          src="/mario_logo.png"
                          alt="Personal Portfolio Website"
                          className="w-24 h-24 md:w-32 md:h-32 object-contain opacity-90"
                        />
                      </div>
                      <h3 className="font-pressstart2p text-white text-base md:text-lg mb-4">
                        Personal Portfolio Website
                      </h3>
                      <p className="font-pixellari text-red-300 text-xs md:text-sm mb-6">
                        Click to reveal project
                      </p>
                      <button
                        onClick={() => handleProjectFlip("personalwebsite")}
                        className="font-pressstart2p bg-red-600 hover:bg-red-700 text-white px-4 py-2 md:px-6 md:py-3 rounded border border-red-400 transition-colors text-xs md:text-sm"
                      >
                        UNLOCK PROJECT
                      </button>
                    </div>
                  </div>
                </div>

                {/* Back Card - Unlocked State */}
                <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                  <div className="bg-black/80 border border-red-400 rounded-lg overflow-hidden h-full flex flex-col">
                    {/* Project Name - Flexible Height */}
                    <div className="min-h-[12%] py-2 px-4 flex items-center justify-center border-b border-red-400/30 relative">
                      <h3 className="font-pressstart2p text-white text-xs md:text-sm text-center leading-tight break-words px-8">
                        Personal Portfolio Website
                      </h3>
                      {/* Difficulty Badge */}
                      <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-pressstart2p whitespace-nowrap flex-shrink-0">
                        Hard
                      </div>
                    </div>

                    {/* Project Details - Flexible Height */}
                    <div className="flex-1 p-4 flex flex-col overflow-hidden flex-shrink-0 min-h-0">
                      <p className="text-gray-300 font-pixellari text-sm md:text-base mb-3 leading-relaxed flex-1">
                        Gamified portfolio website with level progression, achievements, and scoring systems. Features WebGL backgrounds, flip card interactions, and smooth scroll-based reveals. Built with React 19, Vite, and Tailwind CSS.
                      </p>
                      {/* Technology Tags */}
                      <div className="flex flex-wrap gap-2 mt-auto">
                        <span className="bg-red-900/50 text-red-300 px-3 py-1 rounded text-xs md:text-sm font-pixellari">
                          Vite
                        </span>
                        <span className="bg-red-900/50 text-red-300 px-3 py-1 rounded text-xs md:text-sm font-pixellari">
                          Tailwind CSS
                        </span>
                        <span className="bg-red-900/50 text-red-300 px-3 py-1 rounded text-xs md:text-sm font-pixellari">
                          React
                        </span>
                      </div>
                    </div>

                    {/* View Code Button - Fixed Bottom */}
                    <div className="flex-shrink-0 py-3 px-4 flex items-center justify-center border-t border-red-400/30">
                      <Button
                        onClick={() => handleProjectLink("personalwebsite")}
                        variant="default"
                        size="sm"
                        font="retro"
                        className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 border border-red-400 flex items-center justify-center gap-2 text-xs"
                      >
                        <span>View Code</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Show More Button */}
            {!showMoreProjects && (
              <div className="col-span-full flex justify-center mt-6">
                <Button
                  onClick={() => setShowMoreProjects(true)}
                  variant="default"
                  size="lg"
                  font="retro"
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 border border-red-400 transition-colors text-sm md:text-base"
                >
                  SHOW MORE PROJECTS
                </Button>
              </div>
            )}

            {/* Additional Projects - Shown when showMoreProjects is true */}
            {showMoreProjects && (
              <>
                {/* 7. ISO Website */}
                <div className="relative w-full h-[450px] perspective-1000">
                  <div
                    className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                      flippedProjects.has("isowebsite") ? "rotate-y-180" : ""
                    }`}
                  >
                    {/* Front Card - Locked State */}
                    <div className="absolute inset-0 w-full h-full backface-hidden">
                      <div className="border border-red-400 bg-red-900/80 backdrop-blur-sm rounded-lg h-full flex flex-col items-center justify-center p-6">
                        <div className="text-center">
                          <div className="flex justify-center mb-4">
                            <img
                              src="/SJSU_Logo.webp"
                              alt="ISO Website"
                              className="w-24 h-24 md:w-32 md:h-32 object-contain opacity-90"
                            />
                          </div>
                          <h3 className="font-pressstart2p text-white text-base md:text-lg mb-4">
                            ISO Website
                          </h3>
                          <p className="font-pixellari text-red-300 text-xs md:text-sm mb-6">
                            Click to reveal project
                          </p>
                          <button
                            onClick={() => handleProjectFlip("isowebsite")}
                            className="font-pressstart2p bg-red-600 hover:bg-red-700 text-white px-4 py-2 md:px-6 md:py-3 rounded border border-red-400 transition-colors text-xs md:text-sm"
                          >
                            UNLOCK PROJECT
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Back Card - Unlocked State */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                      <div className="bg-black/80 border border-red-400 rounded-lg overflow-hidden h-full flex flex-col">
                        {/* Project Name - Flexible Height */}
                        <div className="min-h-[12%] py-2 px-4 flex items-center justify-center border-b border-red-400/30 relative">
                          <h3 className="font-pressstart2p text-white text-xs md:text-sm text-center leading-tight break-words px-8">
                            ISO Website
                          </h3>
                          {/* Difficulty Badge */}
                          <div className="absolute top-2 right-2 bg-orange-600 text-white px-2 py-1 rounded text-xs font-pressstart2p whitespace-nowrap flex-shrink-0">
                            Hard
                          </div>
                        </div>

                        {/* Project Details - Flexible Height */}
                        <div className="flex-1 p-4 flex flex-col overflow-hidden flex-shrink-0 min-h-0">
                          <p className="text-gray-300 font-pixellari text-sm md:text-base mb-3 leading-relaxed flex-1">
                            Modern website for the Indian Student Organization at San Jose State University. Features event management, member registration, photo galleries, and real-time updates. Built with React, Tailwind CSS, and MongoDB.
                          </p>
                          {/* Technology Tags */}
                          <div className="flex flex-wrap gap-2 mt-auto">
                            <span className="bg-red-900/50 text-red-300 px-3 py-1 rounded text-xs md:text-sm font-pixellari">
                              React
                            </span>
                            <span className="bg-red-900/50 text-red-300 px-3 py-1 rounded text-xs md:text-sm font-pixellari">
                              Tailwind CSS
                            </span>
                            <span className="bg-red-900/50 text-red-300 px-3 py-1 rounded text-xs md:text-sm font-pixellari">
                              MongoDB
                            </span>
                          </div>
                        </div>

                        {/* View Website Button - Fixed Bottom */}
                        <div className="flex-shrink-0 py-3 px-4 flex items-center justify-center border-t border-red-400/30">
                          <button
                            onClick={() => handleProjectLink("isowebsite")}
                            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded border border-red-400 transition-colors flex items-center justify-center gap-2 font-pressstart2p text-xs"
                          >
                            <span className="text-lg">📄</span>
                            <span>View Website</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 8. Sentiment Analysis */}
                <div className="relative w-full h-[450px] perspective-1000">
                  <div
                    className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                      flippedProjects.has("sentimentanalysis") ? "rotate-y-180" : ""
                    }`}
                  >
                    {/* Front Card - Locked State */}
                    <div className="absolute inset-0 w-full h-full backface-hidden">
                      <div className="border border-red-400 bg-red-900/80 backdrop-blur-sm rounded-lg h-full flex flex-col items-center justify-center p-6">
                        <div className="text-center">
                          <div className="flex justify-center mb-4">
                            <img 
                              src="/X_logo.png" 
                              alt="Sentiment Analysis" 
                              className="w-24 h-24 md:w-32 md:h-32 object-contain filter invert drop-shadow-lg"
                            />
                          </div>
                          <h3 className="font-pressstart2p text-white text-base md:text-lg mb-4">
                            Sentiment Analysis
                          </h3>
                          <p className="font-pixellari text-red-300 text-xs md:text-sm mb-6">
                            Click to reveal project
                          </p>
                          <button
                            onClick={() => handleProjectFlip("sentimentanalysis")}
                            className="font-pressstart2p bg-red-600 hover:bg-red-700 text-white px-4 py-2 md:px-6 md:py-3 rounded border border-red-400 transition-colors text-xs md:text-sm"
                          >
                            UNLOCK PROJECT
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Back Card - Unlocked State */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                      <div className="bg-black/80 border border-red-400 rounded-lg overflow-hidden h-full flex flex-col">
                        {/* Project Name - Flexible Height */}
                        <div className="min-h-[12%] py-2 px-4 flex items-center justify-center border-b border-red-400/30 relative">
                          <h3 className="font-pressstart2p text-white text-xs md:text-sm text-center leading-tight break-words px-8">
                            Sentiment Analysis
                          </h3>
                          {/* Difficulty Badge */}
                          <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-pressstart2p whitespace-nowrap flex-shrink-0">
                            Hard
                          </div>
                        </div>

                        {/* Project Details - Flexible Height */}
                        <div className="flex-1 p-4 flex flex-col overflow-hidden flex-shrink-0 min-h-0">
                          <p className="text-gray-300 font-pixellari text-sm md:text-base mb-3 leading-relaxed flex-1">
                            Network-based sentiment analysis system for Twitter data. Uses Python, Twitter API, and machine learning algorithms to classify sentiment and visualize public opinion trends. Built with Streamlit for interactive dashboards.
                          </p>
                          {/* Technology Tags */}
                          <div className="flex flex-wrap gap-2 mt-auto">
                            <span className="bg-red-900/50 text-red-300 px-3 py-1 rounded text-xs md:text-sm font-pixellari">
                              Python
                            </span>
                            <span className="bg-red-900/50 text-red-300 px-3 py-1 rounded text-xs md:text-sm font-pixellari">
                              Twitter API
                            </span>
                            <span className="bg-red-900/50 text-red-300 px-3 py-1 rounded text-xs md:text-sm font-pixellari">
                              Macine Learning
                            </span>
                            <span className="bg-red-900/50 text-red-300 px-3 py-1 rounded text-xs md:text-sm font-pixellari">
                              Streamlit
                            </span>
                          </div>
                        </div>

                        {/* View Code Button - Fixed Bottom */}
                        <div className="flex-shrink-0 py-3 px-4 flex items-center justify-center border-t border-red-400/30">
                          <button
                            onClick={() => handleProjectLink("sentimentanalysis")}
                            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded border border-red-400 transition-colors flex items-center justify-center gap-2 font-pressstart2p text-xs"
                          >
                            <span className="text-lg">📄</span>
                            <span>View Code</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 9. Movie Recommendation */}
                <div className="relative w-full h-[450px] perspective-1000">
                  <div
                    className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                      flippedProjects.has("movierecommendation") ? "rotate-y-180" : ""
                    }`}
                  >
                    {/* Front Card - Locked State */}
                    <div className="absolute inset-0 w-full h-full backface-hidden">
                      <div className="border border-red-400 bg-red-900/80 backdrop-blur-sm rounded-lg h-full flex flex-col items-center justify-center p-6">
                        <div className="text-center">
                          <div className="flex justify-center mb-4">
                            <img 
                              src="/Netflix_logo.png" 
                              alt="Netflix Logo" 
                              className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-lg"
                            />
                          </div>
                          <h3 className="font-pressstart2p text-white text-base md:text-lg mb-4">
                            Recommendation System
                          </h3>
                          <p className="font-pixellari text-red-300 text-xs md:text-sm mb-6">
                            Click to reveal project
                          </p>
                          <button
                            onClick={() => handleProjectFlip("movierecommendation")}
                            className="font-pressstart2p bg-red-600 hover:bg-red-700 text-white px-4 py-2 md:px-6 md:py-3 rounded border border-red-400 transition-colors text-xs md:text-sm"
                          >
                            UNLOCK PROJECT
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Back Card - Unlocked State */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                      <div className="bg-black/80 border border-red-400 rounded-lg overflow-hidden h-full flex flex-col">
                        {/* Project Name - Flexible Height */}
                        <div className="min-h-[12%] py-2 px-4 flex items-center justify-center border-b border-red-400/30 relative">
                          <h3 className="font-pressstart2p text-white text-xs md:text-sm text-center leading-tight break-words px-8">
                            Recommendation System
                          </h3>
                          {/* Difficulty Badge */}
                          <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-pressstart2p whitespace-nowrap flex-shrink-0">
                            Hard
                          </div>
                        </div>

                        {/* Project Details - Flexible Height */}
                        <div className="flex-1 p-4 flex flex-col overflow-hidden flex-shrink-0 min-h-0">
                          <p className="text-gray-300 font-pixellari text-sm md:text-base mb-3 leading-relaxed flex-1">
                            Movie recommendation system using collaborative filtering and vector databases. Integrates with TMDB API and uses advanced algorithms to analyze user preferences for personalized suggestions. Built with Next.js.
                          </p>
                          {/* Technology Tags */}
                          <div className="flex flex-wrap gap-2 mt-auto">
                            <span className="bg-red-900/50 text-red-300 px-3 py-1 rounded text-xs md:text-sm font-pixellari">
                              Next.js
                            </span>
                            <span className="bg-red-900/50 text-red-300 px-3 py-1 rounded text-xs md:text-sm font-pixellari">
                              TMDB API
                            </span>
                            <span className="bg-red-900/50 text-red-300 px-3 py-1 rounded text-xs md:text-sm font-pixellari">
                              Vector Database
                            </span>
                            <span className="bg-red-900/50 text-red-300 px-3 py-1 rounded text-xs md:text-sm font-pixellari">
                              Cross Filtering
                            </span>
                          </div>
                        </div>

                        {/* View Code Button - Fixed Bottom */}
                        <div className="flex-shrink-0 py-3 px-4 flex items-center justify-center border-t border-red-400/30">
                          <button
                            onClick={() => handleProjectLink("movierecommendation")}
                            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded border border-red-400 transition-colors flex items-center justify-center gap-2 font-pressstart2p text-xs"
                          >
                            <span className="text-lg">📄</span>
                            <span>View Code</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
      <section
        data-level={6}
        className="relative z-10 min-h-screen bg-gradient-to-b from-black via-teal-900/10 to-teal-900/30 px-3 py-12"
      >
        {/* Squares Background */}
        <div className="absolute inset-0 z-0">
          <Squares
            speed={0.3}
            squareSize={40}
            direction="diagonal"
            borderColor="rgba(255,255,255,0.25)"
            hoverFillColor="#222"
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="font-pressstart2p text-2xl sm:text-3xl md:text-4xl text-white border-2 border-teal-400 bg-black/50 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-lg inline-block">
              LEVEL 6: COMMAND CENTER
            </h2>
            <p className="font-pressstart2p text-white text-sm mt-4">
              INTERACTIVE TERMINAL • CONNECT • EXPLORE
            </p>
          </div>

          {/* Interactive Command Center */}
          <div className="max-w-6xl mx-auto px-4">
            {/* Tab Navigation */}
            <div className="flex justify-center mb-6">
              <div className="bg-black/80 border border-teal-400 rounded-lg p-1 flex gap-1 flex-wrap justify-center max-w-sm mx-auto">
                <button
                  onClick={() => setActiveTab('socials')}
                  className={`px-3 py-2 rounded font-pressstart2p text-xs transition-all duration-300 min-w-[80px] ${
                    activeTab === 'socials' 
                      ? 'bg-teal-600 text-white' 
                      : 'text-teal-300 hover:text-white hover:bg-teal-800/50'
                  }`}
                >
                  SOCIALS
                </button>
                <button
                  onClick={() => setActiveTab('quests')}
                  className={`px-3 py-2 rounded font-pressstart2p text-xs transition-all duration-300 min-w-[80px] ${
                    activeTab === 'quests' 
                      ? 'bg-teal-600 text-white' 
                      : 'text-teal-300 hover:text-white hover:bg-teal-800/50'
                  }`}
                >
                  QUESTS
                </button>
                <button
                  onClick={() => setActiveTab('terminal')}
                  className={`px-3 py-2 rounded font-pressstart2p text-xs transition-all duration-300 min-w-[80px] ${
                    activeTab === 'terminal' 
                      ? 'bg-teal-600 text-white' 
                      : 'text-teal-300 hover:text-white hover:bg-teal-800/50'
                  }`}
                >
                  TERMINAL
                </button>
              </div>
            </div>

            {/* Terminal Tab */}
            {activeTab === 'terminal' && (
              <div className="bg-black/90 border-2 border-teal-400 rounded-lg overflow-hidden">
                {/* Terminal Header */}
                <div className="bg-teal-900/50 px-4 py-2 flex items-center justify-between border-b border-teal-400/50">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-pixellari text-teal-300 text-xs ml-2">pranav@portfolio:~</span>
                  </div>
                  <button
                    onClick={() => setTerminalHistory([])}
                    className="font-pixellari text-teal-300 text-xs hover:text-white transition-colors"
                  >
                    CLEAR
                  </button>
                </div>

                {/* Terminal Body */}
                <div className="p-3 sm:p-4 h-64 sm:h-80 md:h-96 overflow-y-auto">
                  {/* Welcome Message */}
                  {terminalHistory.length === 0 && (
                    <div className="mb-4">
                      <p className="font-pixellari text-teal-300 text-sm mb-2">
                        Welcome to Pranav's Interactive Terminal v2.0
                      </p>
                      <p className="font-pixellari text-teal-300 text-sm mb-4">
                        Type 'help' to explore available commands
                      </p>
                    </div>
                  )}

                  {/* Command History */}
                  {terminalHistory.map((line, index) => (
                    <div key={index} className="mb-2">
                      <p className={`font-pixellari text-sm ${
                        line.startsWith('>') ? 'text-teal-400' : 'text-gray-300'
                      } whitespace-pre-line`}>
                        {line}
                      </p>
                    </div>
                  ))}

                  {/* Command Input */}
                  <div className="flex items-center gap-2 mt-4">
                    <span className="font-pixellari text-teal-400 text-sm flex-shrink-0">$</span>
                    <input
                      type="text"
                      value={currentCommand}
                      onChange={(e) => setCurrentCommand(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleTerminalCommand(currentCommand);
                          setCurrentCommand('');
                        }
                      }}
                      placeholder="Type a command..."
                      className="flex-1 bg-transparent text-teal-300 font-pixellari text-xs sm:text-sm outline-none placeholder-teal-300/50 min-w-0"
                      autoFocus
                    />
                    {isTyping && (
                      <span className="text-teal-400 animate-pulse flex-shrink-0">_</span>
                    )}
                  </div>
                </div>

                {/* Terminal Footer */}
                <div className="bg-teal-900/30 px-4 py-2 border-t border-teal-400/30">
                  <p className="font-pixellari text-teal-300 text-xs">
                    Press Enter to execute • Type 'help' for commands
                  </p>
                </div>
              </div>
            )}

            {/* Socials Tab */}
            {activeTab === 'socials' && (
              <div className="bg-black/90 border-2 border-teal-400 rounded-lg p-4 sm:p-6">
                <h3 className="font-pressstart2p text-white text-base sm:text-lg mb-4 sm:mb-6 text-center">
                  SOCIAL COMMAND CENTER
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <a
                    href="https://github.com/PranavReddyGaddam"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-teal-900/30 border border-teal-400/50 rounded-lg p-3 sm:p-4 text-center transition-all duration-300 hover:bg-teal-800/50 hover:border-teal-300 hover:scale-105 group"
                  >
                    <Github className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-teal-300 group-hover:text-white" />
                    <p className="font-pressstart2p text-white text-xs">GitHub</p>
                    <p className="font-pixellari text-teal-300 text-xs mt-1">Code Repository</p>
                  </a>
                  
                  <a
                    href="https://www.linkedin.com/in/pranav-reddy-gaddam-69338321b/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-teal-900/30 border border-teal-400/50 rounded-lg p-3 sm:p-4 text-center transition-all duration-300 hover:bg-teal-800/50 hover:border-teal-300 hover:scale-105 group"
                  >
                    <Linkedin className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-teal-300 group-hover:text-white" />
                    <p className="font-pressstart2p text-white text-xs">LinkedIn</p>
                    <p className="font-pixellari text-teal-300 text-xs mt-1">Professional</p>
                  </a>
                  
                  <a
                    href="https://www.instagram.com/__pranav.reddy__"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-teal-900/30 border border-teal-400/50 rounded-lg p-3 sm:p-4 text-center transition-all duration-300 hover:bg-teal-800/50 hover:border-teal-300 hover:scale-105 group"
                  >
                    <Instagram className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-teal-300 group-hover:text-white" />
                    <p className="font-pressstart2p text-white text-xs">Instagram</p>
                    <p className="font-pixellari text-teal-300 text-xs mt-1">Personal</p>
                  </a>
                  
                  <a
                    href="https://twitter.com/Pranav_2801"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-teal-900/30 border border-teal-400/50 rounded-lg p-3 sm:p-4 text-center transition-all duration-300 hover:bg-teal-800/50 hover:border-teal-300 hover:scale-105 group"
                  >
                    {React.createElement(RiTwitterXFill as any, { className: "w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-teal-300 group-hover:text-white" })}
                    <p className="font-pressstart2p text-white text-xs">Twitter</p>
                    <p className="font-pixellari text-teal-300 text-xs mt-1">Insights</p>
                  </a>
                </div>

                {/* Direct Contact */}
                <div className="bg-teal-900/20 border border-teal-400/30 rounded-lg p-3 sm:p-4">
                  <h4 className="font-pressstart2p text-teal-300 text-sm mb-2 sm:mb-3">DIRECT COMMS CHANNEL</h4>
                  <div className="space-y-1 sm:space-y-2">
                    <p className="font-pixellari text-gray-300 text-xs sm:text-sm break-words">
                      <span className="text-teal-400">Email:</span> pranavreddy.gaddam@sjsu.edu
                    </p>
                    <p className="font-pixellari text-gray-300 text-xs sm:text-sm">
                      <span className="text-teal-400">Location:</span> San Jose, California
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quests Tab */}
            {activeTab === 'quests' && (
              <div className="bg-black/90 border-2 border-teal-400 rounded-lg p-4 sm:p-6">
                <h3 className="font-pressstart2p text-white text-base sm:text-lg mb-4 sm:mb-6 text-center">
                  HOBBIES & INTERESTS
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-teal-900/20 border border-teal-400/30 rounded-lg p-3 sm:p-4">
                    <div>
                      <h4 className="font-pressstart2p text-teal-300 text-sm mb-1">Movie Enthusiast</h4>
                      <p className="font-pixellari text-gray-400 text-xs mb-3">Film Buff</p>
                    </div>
                    <p className="font-pixellari text-gray-300 text-xs leading-relaxed">
                      Love watching a wide variety of movies - from classic films to modern cinema across all genres.
                    </p>
                  </div>

                  <div className="bg-teal-900/20 border border-teal-400/30 rounded-lg p-3 sm:p-4">
                    <div>
                      <h4 className="font-pressstart2p text-teal-300 text-sm mb-1">Weekend Coding</h4>
                      <p className="font-pixellari text-gray-400 text-xs mb-3">Passion Projects</p>
                    </div>
                    <p className="font-pixellari text-gray-300 text-xs leading-relaxed">
                      Enjoy vibe coding on weekends - exploring new technologies and building creative side projects.
                    </p>
                  </div>

                  <div className="bg-teal-900/20 border border-teal-400/30 rounded-lg p-3 sm:p-4">
                    <div>
                      <h4 className="font-pressstart2p text-teal-300 text-sm mb-1">Sports Fan</h4>
                      <p className="font-pixellari text-gray-400 text-xs mb-3">Cricket, Basketball & Tennis</p>
                    </div>
                    <p className="font-pixellari text-gray-300 text-xs leading-relaxed">
                      Passionate about watching cricket, basketball, and tennis. Also enjoy following various other sports.
                    </p>
                  </div>

                  <div className="bg-teal-900/20 border border-teal-400/30 rounded-lg p-3 sm:p-4">
                    <div>
                      <h4 className="font-pressstart2p text-teal-300 text-sm mb-1">Baking</h4>
                      <p className="font-pixellari text-gray-400 text-xs mb-3">Home Chef</p>
                    </div>
                    <p className="font-pixellari text-gray-300 text-xs leading-relaxed">
                      Enjoy baking as a creative outlet - experimenting with recipes and creating delicious treats.
                    </p>
                  </div>
                </div>

                {/* Collaboration Section */}
                <div className="mt-4 sm:mt-6 bg-gradient-to-r from-teal-900/30 to-cyan-900/30 border border-teal-400 rounded-lg p-3 sm:p-4">
                  <h4 className="font-pressstart2p text-teal-300 text-sm mb-2 sm:mb-3 text-center">
                    LET'S COLLABORATE
                  </h4>
                  <p className="font-pixellari text-gray-300 text-xs sm:text-sm text-center mb-3 sm:mb-4">
                    Have an interesting project or idea? I'd love to hear about it and work together!
                  </p>
                  <button
                    onClick={() => setActiveTab('terminal')}
                    className="w-full font-pressstart2p bg-teal-600 hover:bg-teal-700 text-white px-3 sm:px-4 py-2 rounded border border-teal-400 transition-all duration-300 hover:scale-105 text-xs"
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
      <footer className="relative z-10 bg-gradient-to-r from-black via-black/80 to-black border-t-2 border-teal-400">
        <div className="max-w-6xl mx-auto px-4 py-4 text-center">
          <p className="font-pixellari text-teal-300 text-sm">
            Crafted with curiosity and caffeine — © {new Date().getFullYear()}{" "}
            Pranav Reddy Gaddam
          </p>
        </div>
      </footer>

      {/* Achievement Popups */}
      {/* Section unlock-on-scroll Achievement Popups */}
      <AchievementPopup
        title="Identity Unlocked"
        xp={100}
        isVisible={showIdentityUnlocked}
        theme="blue"
        index={getAchievementIndex("identity_unlocked")}
      />
      <AchievementPopup
        title="Pathfinder"
        xp={100}
        isVisible={showPathfinder}
        theme="yellow"
        index={getAchievementIndex("pathfinder")}
      />
      <AchievementPopup
        title="Skill Mastery"
        xp={100}
        isVisible={showSkillMastery}
        theme="green"
        index={getAchievementIndex("skill_mastery")}
      />
      <AchievementPopup
        title="Quest Conqueror"
        xp={100}
        isVisible={showQuestConqueror}
        theme="red"
        index={getAchievementIndex("quest_conqueror")}
      />
      <AchievementPopup
        title="Social Link"
        xp={100}
        isVisible={showSocialLinkEstablished}
        theme="teal"
        index={getAchievementIndex("social_link_established")}
      />
      <AchievementPopup
        title="Rulebook Raider"
        xp={30}
        isVisible={showRulebookRaider}
        theme="blue"
        index={getAchievementIndex("rulebook-raider")}
      />
      {/* Section 2 Achievement Popups */}
      <AchievementPopup
        title="Face of the Hero"
        xp={150}
        isVisible={showFaceOfHero}
        theme="blue"
        index={getAchievementIndex("face_of_hero")}
      />
      <AchievementPopup
        title="Keeper of Stories"
        xp={100}
        isVisible={showKeeperOfStories}
        theme="yellow"
        index={getAchievementIndex("keeper_of_stories")}
      />
      <AchievementPopup
        title="Power Unleashed"
        xp={75}
        isVisible={showPowerUnleashed}
        theme="green"
        index={getAchievementIndex("power_unleashed")}
      />
      {/* Section 3 Achievement Popups */}
      <AchievementPopup
        title="Guild Explorer"
        xp={75}
        isVisible={showGuildExplorer}
        theme="green"
        index={getAchievementIndex("guild_explorer")}
      />
      <AchievementPopup
        title="Grandmaster's Path"
        xp={90}
        isVisible={showGrandmastersPath}
        theme="purple"
        index={getAchievementIndex("grandmasters_path")}
      />
      {/* Section 4 Achievement Popups */}
      <AchievementPopup
        title="Skill Tree Master"
        xp={200}
        isVisible={showSkillTreeMaster}
        theme="green"
        index={getAchievementIndex("skill_tree_master")}
      />
      {/* Section 5 Achievement Popups */}
      <AchievementPopup
        title="Project Master"
        xp={300}
        isVisible={showProjectMaster}
        theme="red"
        index={getAchievementIndex("project_master")}
      />

      {/* Section 6 Achievement Popup */}
      <AchievementPopup
        title="Alliance Formed"
        xp={100}
        isVisible={showAllianceFormed}
        theme="teal"
        index={getAchievementIndex("alliance_formed")}
      />

      {/* Game Instructions Modal */}
      <GameInstructionsModal
        isVisible={showGameInstructions}
        onClose={() => setShowGameInstructions(false)}
      />

      {/* Achievements Modal */}
      {showAchievementsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-black border-2 border-yellow-400 rounded-lg p-6 max-w-3xl w-full shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-pressstart2p text-yellow-400 text-xl">
                ACHIEVEMENTS
              </h2>
              <button
                onClick={() => setShowAchievementsModal(false)}
                className="font-pressstart2p bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded border border-yellow-400"
              >
                CLOSE
              </button>
            </div>
            <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-400/50 rounded-lg">
              <p className="font-pixellari text-yellow-300 text-sm">
                💡 Click on locked achievements to navigate to where you can unlock them!
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
                        ? "border-green-400 bg-green-900/30"
                        : "border-gray-600 bg-black/40"
                    } ${
                      isClickable 
                        ? "cursor-pointer hover:border-yellow-400 hover:bg-yellow-900/20 hover:scale-105" 
                        : "cursor-default"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span
                        className={`flex-shrink-0 ${
                          isUnlocked ? "text-green-400" : "text-gray-400"
                        }`}
                      >
                        {GoTrophy as any}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`font-pressstart2p text-sm truncate ${
                            isUnlocked ? "text-white" : "text-gray-400"
                          }`}
                          title={a.title}
                        >
                          {a.title}
                        </div>
                        <div className="font-pixellari text-xs text-gray-300/80 truncate">
                          {a.section} • +{a.xp} XP
                          {isClickable && !isUnlocked && (
                            <span className="text-yellow-400 ml-2">(Click to navigate)</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isClickable && !isUnlocked && (
                        <span className="text-yellow-400 text-xs">→</span>
                      )}
                      <Badge 
                        variant={isUnlocked ? "default" : "outline"} 
                        font="retro" 
                        className={`${isUnlocked ? "bg-green-600 border-green-400 text-green-400" : "bg-gray-600 border-gray-400 text-gray-400"} text-sm`}
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
