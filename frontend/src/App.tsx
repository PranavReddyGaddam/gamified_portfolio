import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import Galaxy from "./backgrounds/Backgrounds/Galaxy";
import Squares from "./backgrounds/Backgrounds/Squares";
import TextType from "./backgrounds/TextAnimations/TextType/TextType";
import emailjs from '@emailjs/browser';
import Navbar from "./components/Navbar";
import GitHubCommitChart from "./components/GitHubCommitChart";
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

// Achievement popup component
const AchievementPopup: React.FC<{
  title: string;
  xp: number;
  isVisible: boolean;
  theme: "purple" | "blue" | "yellow" | "green" | "red" | "teal";
  index?: number;
}> = ({ title, xp, isVisible, theme, index = 0 }) => {
  const getThemeColors = () => {
    switch (theme) {
      case "purple":
        return {
          border: "border-purple-400",
          bg: "bg-purple-900/80",
          text: "text-purple-300",
          icon: "text-purple-400",
        };
      case "blue":
        return {
          border: "border-blue-400",
          bg: "bg-blue-900/80",
          text: "text-blue-300",
          icon: "text-blue-400",
        };
      case "yellow":
        return {
          border: "border-yellow-400",
          bg: "bg-yellow-900/80",
          text: "text-yellow-300",
          icon: "text-yellow-400",
        };
      case "green":
        return {
          border: "border-green-400",
          bg: "bg-green-900/80",
          text: "text-green-300",
          icon: "text-green-400",
        };
      case "red":
        return {
          border: "border-red-400",
          bg: "bg-red-900/80",
          text: "text-red-300",
          icon: "text-red-400",
        };
      case "teal":
        return {
          border: "border-teal-400",
          bg: "bg-teal-900/80",
          text: "text-teal-300",
          icon: "text-teal-400",
        };
      default:
        return {
          border: "border-purple-400",
          bg: "bg-purple-900/80",
          text: "text-purple-300",
          icon: "text-purple-400",
        };
    }
  };

  const colors = getThemeColors();

  if (!isVisible) return null;

  return (
    <div
      className="fixed right-6 z-50 animate-fade-in transition-all duration-300"
      style={{
        bottom: index === 0 ? "1.5rem" : `${1.5 + index * 5}rem`,
        zIndex: 50 + index,
      }}
    >
      <div
        className={`border-2 ${colors.border} ${colors.bg} backdrop-blur-sm px-6 py-4 rounded-lg shadow-lg`}
      >
        <div className="flex items-center gap-3">
          <span className={`text-2xl ${colors.icon}`}><GoTrophy /></span>
          <div>
            <h3 className="font-pressstart2p text-white text-lg">{title}</h3>
            <p className={`font-pixellari text-sm ${colors.text}`}>+{xp} XP</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Game Instructions Modal component
const GameInstructionsModal: React.FC<{
  isVisible: boolean;
  onClose: () => void;
}> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-black border-2 border-green-400 rounded-lg p-6 max-w-md w-full shadow-lg">
        <div className="text-center mb-4">
          <h2 className="font-pressstart2p text-green-400 text-xl mb-2">
            Game Instructions:
          </h2>
        </div>
        <ul className="space-y-2 text-white font-pixellari text-sm">
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>Scroll down to explore different levels</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>Click on skills to unlock them and earn XP</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>Unlock projects to view details and links</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>Collect achievements by exploring the portfolio</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>Complete all levels to reach the contact form</span>
          </li>
        </ul>
        <div className="text-center mt-6">
          <button
            onClick={onClose}
            className="font-pressstart2p bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded border border-green-400 transition-colors"
          >
            GOT IT!
          </button>
        </div>
      </div>
    </div>
  );
};

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
  const [carouselIndex, setCarouselIndex] = useState(0);
  
  // Show more projects state
  const [showMoreProjects, setShowMoreProjects] = useState(false);

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
  const [showQuestInitiator, setShowQuestInitiator] = useState(false);
  const [showRulebookRaider, setShowRulebookRaider] = useState(false);
  const [showScrollSeeker, setShowScrollSeeker] = useState(false);

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
      "quest-initiator": 50,
      "rulebook-raider": 30,
      "scroll-seeker": 20,
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
    "quest-initiator": 1,
    "rulebook-raider": 1,
    "scroll-seeker": 1,
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
      id: "quest-initiator",
      title: "Quest Initiator",
      xp: 50,
      section: "Intro",
    },
    {
      id: "rulebook-raider",
      title: "Rulebook Raider",
      xp: 30,
      section: "Intro",
    },
    { id: "scroll-seeker", title: "Scroll Seeker", xp: 20, section: "Intro" },
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
    showAchievement("quest-initiator", setShowQuestInitiator);
  };

  const handleHowToPlay = () => {
    setShowGameInstructions(true);
    showAchievement("rulebook-raider", setShowRulebookRaider);
  };

  const handleOpenResume = () => {
    window.open(RESUME_URL, '_blank');
  };

  const handleScrollToContinue = () => {
    showAchievement("scroll-seeker", setShowScrollSeeker);
    nextSectionRef.current?.scrollIntoView({ behavior: "smooth" });
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
        <div className="relative z-10 border-2 border-white bg-black p-8 rounded-lg max-w-2xl w-full text-center mb-16">
          {/* Start Prompt */}
          <p className="font-pressstart2p text-purple-400 text-lg mb-6">
            PRANAV REDDY GADDAM'S
          </p>

          {/* Main Title with Typing Effect */}
          <div className="font-pressstart2p text-4xl md:text-6xl text-white mb-4">
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
            <button
              className="font-pressstart2p bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded border-2 border-purple-400 flex items-center justify-center gap-2 transition-colors"
              onClick={handleStartGame}
            >
              START GAME
            </button>

            <button
              className="font-pressstart2p bg-transparent border-2 border-white text-white px-6 py-3 rounded hover:bg-white hover:text-black transition-colors"
              onClick={handleHowToPlay}
            >
              HOW TO PLAY
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          className="text-center cursor-pointer group z-10"
          role="button"
          tabIndex={0}
          onClick={handleScrollToContinue}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleScrollToContinue();
            }
          }}
        >
          <p className="font-pressstart2p text-white text-sm mb-2 transition-colors duration-200 group-hover:text-purple-400 cursor-pointer">
            SCROLL TO CONTINUE
          </p>
          <div className="text-white text-xl animate-bounce cursor-pointer group-hover:text-purple-400 transition-colors duration-200">
            ↓
          </div>
        </div>
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
            <h2 className="font-pressstart2p text-3xl md:text-4xl text-white border-2 border-blue-400 bg-black/50 backdrop-blur-sm px-6 py-3 rounded-lg inline-block">
              LEVEL 2: CHARACTER STATS
            </h2>
          </div>

          {/* Character Card Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-6 items-stretch max-w-7xl mx-auto px-4 md:px-4">
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
                          A creative builder and systems thinker who engineers
                          AI-powered applications using tools like Python,
                          FastAPI, MongoDB, and Next.js. Currently pursuing a
                          Master's at San Jose State University, with projects
                          spanning GitBridge (a voice-enabled GitHub companion),
                          QuizForge (an adaptive learning platform), and
                          scalable cloud-first ML pipelines.
                        </p>
                        <p className="break-words">
                          An active hackathon participant and backend
                          specialist, with hands-on experience in AWS and LLM
                          integration. Passionate about designing resilient
                          systems, collaborating across fast-paced teams, and
                          always ready to debug the next boss-level challenge.
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
                          <span className="text-yellow-400">⚡</span>
                          FastAPI Mastery
                        </li>
                        <li className="flex items-center gap-2 whitespace-normal md:whitespace-nowrap">
                          <span className="text-green-400">🛠</span>
                          LLM Prompt Tuning
                        </li>
                        <li className="flex items-center gap-2 whitespace-normal md:whitespace-nowrap">
                          <span className="text-cyan-400">☁️</span>
                          AWS & Cloud Deployments
                        </li>
                        <li className="flex items-center gap-2 whitespace-normal md:whitespace-nowrap">
                          <span className="text-pink-400">🌉</span>
                          GitBridge Voice AI
                        </li>
                        <li className="flex items-center gap-2 whitespace-normal md:whitespace-nowrap">
                          <span className="text-indigo-400">📊</span>
                          QuizForge Analytics
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
            <h2 className="font-pressstart2p text-3xl md:text-4xl text-white border-2 border-yellow-400 bg-black/50 backdrop-blur-sm px-6 py-3 rounded-lg inline-block">
              LEVEL 3: CAREER PATH
            </h2>
            <p className="font-pressstart2p text-white text-sm mt-4">
              ACADEMIC ACHIEVEMENTS AND PROFESSIONAL JOURNEY
            </p>
          </div>

          {/* Career Progression Carousel (always visible) */}
          {
            <div className="flex justify-center items-center mt-8 w-full px-4">
              {/* Custom Carousel for Progression Path */}
              <div className="w-full flex flex-col items-center justify-center mt-8 min-h-[420px]">
                <div className="relative w-full max-w-3xl flex flex-col items-center">
                  {/* Carousel Card */}
                  <div
                    className="bg-yellow-900/80 border-2 border-yellow-400 rounded-lg w-full min-h-[400px] flex flex-col items-center justify-start p-4 md:p-8 transition-all duration-500"
                    data-card={
                      carouselIndex === 1
                        ? "work-experience"
                        : carouselIndex === 0
                        ? "masters"
                        : ""
                    }
                  >
                    {(() => {
                      switch (carouselIndex) {
                        case 0:
                          return (
                            <>
                              <h3 className="font-pressstart2p text-white text-3xl mb-2 text-center">
                                Master's
                              </h3>
                              <div className="flex-1 w-full space-y-3 overflow-y-auto px-1">
                                {/* Main Quest */}
                                <div className="text-center mb-1">
                                  <h4 className="font-pressstart2p text-yellow-400 text-lg mb-1">
                                    Quest Title
                                  </h4>
                                  <p className="font-pixellari text-white text-lg">
                                    Master's in Data Analytics
                                  </p>
                                </div>
                                {/* Training Grounds & Duration */}
                                <div className="flex flex-col justify-start items-start mb-1 gap-2">
                                  <div className="text-left md:text-md">
                                    <span className="font-pressstart2p text-yellow-400 text-md">
                                      Training Grounds:
                                    </span>

                                    <span className="font-pixellari text-white text-base ml-2">
                                      San Jose State University
                                    </span>
                                  </div>
                                  <div className="text-right md:text-md">
                                    <span className="font-pressstart2p text-yellow-400 text-md">
                                      Campaign Duration:
                                    </span>
                                    <span className="font-pixellari text-white text-base ml-2">
                                      Aug 2024 – May 2026
                                    </span>
                                  </div>
                                </div>
                                {/* Stats */}
                                <div className="flex flex-row items-center mb-2">
                                  <span className="font-pressstart2p text-yellow-400 text-md mr-2">
                                    Stats:
                                  </span>
                                  <span className="font-pixellari text-white text-base">
                                    CGPA 3.8 / 4.0
                                  </span>
                                </div>
                                {/* Skills Unlocked */}
                                <div className="mb-1">
                                  <h4 className="font-pressstart2p text-yellow-400 text-md mb-1">
                                    Skills Unlocked
                                  </h4>
                                  <ul className="columns-1 sm:columns-2 gap-x-6 list-disc list-inside font-pixellari text-white text-sm space-y-1 pl-4">
                                    <li>Big Data, Machine Learning</li>
                                    <li>Data Warehousing & Pipelines</li>
                                    <li>
                                      Applied Statistics, Analytics Strategy
                                    </li>
                                    <li>Data-Driven Decision Making</li>
                                  </ul>
                                </div>

                                {/* Achievements */}
                                <div className="mb-1">
                                  <h4 className="font-pressstart2p text-yellow-400 text-xl mb-1">
                                    Achievements
                                  </h4>
                                  <ul className="columns-1 sm:columns-2 gap-x-6 list-disc list-inside font-pixellari text-white text-sm space-y-1 pl-4">
                                    <li>
                                      Winner – SpartUp Spring Hackathon 2025
                                      (Hosted by Cisco & SJSU)
                                    </li>
                                    <li>
                                      Participated in 8+ hackathons focused on
                                      AI/ML and Cloud
                                    </li>
                                  </ul>
                                </div>

                                {/* Power-Ups */}
                                <div className="mb-1">
                                  <h4 className="font-pressstart2p text-yellow-400 text-xl mb-1">
                                    Power-Ups
                                  </h4>
                                  <ul className="columns-1 sm:columns-2 gap-x-6 list-disc list-inside font-pixellari text-white text-sm space-y-1 pl-4">
                                    <li>Snowflake Mastery</li>
                                    <li>dbt Workflow Architect</li>
                                    <li>
                                      AWS Certified (Cloud + AI Practitioner)
                                    </li>
                                    <li>Vespa-powered Search Systems</li>
                                    <li>
                                      HuggingFace Transformers Integration
                                    </li>
                                  </ul>
                                </div>

                                {/* Side Quests */}
                                <div>
                                  <h4 className="font-pressstart2p text-yellow-400 text-xl mb-1">
                                    Side Quests
                                  </h4>
                                  <p className="font-pixellari text-white text-sm">
                                    Tech Team Lead – Indian Student Organization
                                    (2025)
                                  </p>
                                </div>
                              </div>
                            </>
                          );
                        case 1:
                          return (
                            <>
                              <h3 className="font-pressstart2p text-white text-3xl mb-4">
                                Work Experience
                              </h3>
                              <div className="flex-1 w-full space-y-2 overflow-y-auto px-1">
                                <div className="text-center mb-2">
                                  <h4 className="font-pressstart2p text-yellow-400 text-lg mb-1">
                                    Quest Completed
                                  </h4>
                                  <p className="font-pixellari text-white text-base">
                                    Data Engineer
                                  </p>
                                </div>
                                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 gap-2">
                                  <div className="text-center md:text-left">
                                    <span className="font-pressstart2p text-yellow-400 text-sm">
                                      Guild:
                                    </span>
                                    <span className="font-pixellari text-white text-sm ml-2">
                                      VE PROJECTS PVT LTD
                                    </span>
                                  </div>
                                  <div className="text-center md:text-right">
                                    <span className="font-pressstart2p text-yellow-400 text-sm">
                                      Duration:
                                    </span>
                                    <span className="font-pixellari text-white text-sm ml-2">
                                      Aug 2023 – Jul 2024
                                    </span>
                                  </div>
                                </div>
                                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 gap-2">
                                  <div className="text-center md:text-left">
                                    <span className="font-pressstart2p text-yellow-400 text-sm">
                                      Role:
                                    </span>
                                    <span className="font-pixellari text-white text-sm ml-2">
                                      Backend Ops & Data Pipeline Architect
                                    </span>
                                  </div>
                                  <div className="text-center md:text-right">
                                    <span className="font-pressstart2p text-yellow-400 text-sm">
                                      Rank Achieved:
                                    </span>
                                    <span className="font-pixellari text-white text-sm ml-2">
                                      Data Engineer
                                    </span>
                                  </div>
                                </div>
                                <div className="text-center mb-2">
                                  <span className="font-pressstart2p text-yellow-400 text-sm">
                                    XP Gained:
                                  </span>
                                  <span className="font-pixellari text-white text-sm ml-2">
                                    +9000 XP
                                  </span>
                                </div>
                                <div className="mb-2">
                                  <h4 className="font-pressstart2p text-yellow-400 text-base mb-1">
                                    Loot Collected
                                  </h4>
                                  <ul className="list-disc list-inside font-pixellari text-white text-sm space-y-1 pl-2">
                                    <li>
                                      <span className="text-yellow-300">
                                        Redshift Relic
                                      </span>{" "}
                                      — Migrated databases from Oracle to Amazon
                                      Redshift
                                      <br />
                                      <span className="text-gray-300">
                                        Resulted in $120K annual cost savings
                                        and 12% improvement in query speed
                                      </span>
                                    </li>
                                    <li>
                                      <span className="text-yellow-300">
                                        ETL Mastery Scroll
                                      </span>{" "}
                                      — Built and optimized a real-time ETL
                                      pipeline processing 150M+ records/day
                                      <br />
                                      <span className="text-gray-300">
                                        Integrated 30+ data sources using Kafka,
                                        PySpark, and Redshift
                                        <br />
                                        Reduced manual intervention by 29%
                                      </span>
                                    </li>
                                    <li>
                                      <span className="text-yellow-300">
                                        QA Totem of Accuracy
                                      </span>{" "}
                                      — Implemented automated data quality
                                      validation
                                      <br />
                                      <span className="text-gray-300">
                                        Used SQL, Python, and Airflow
                                        <br />
                                        Improved accuracy by 60% and accelerated
                                        BI reporting by 3x
                                      </span>
                                    </li>
                                  </ul>
                                </div>
                                <div>
                                  <h4 className="font-pressstart2p text-yellow-400 text-base mb-1">
                                    Skills Unlocked
                                  </h4>
                                  <p className="font-pixellari text-white text-sm">
                                    SQL, Apache Kafka, Apache Airflow, Redshift,
                                    PySpark, Pipeline Optimization, Data QA
                                    Automation, Cost Optimization
                                  </p>
                                </div>
                              </div>
                            </>
                          );
                        case 2:
                          return (
                            <>
                              <h3 className="font-pressstart2p text-white text-3xl mb-6">
                                Bachelor's
                              </h3>
                              <div className="flex-1 w-full space-y-3">
                                <div className="text-center">
                                  <h4 className="font-pressstart2p text-yellow-400 text-xl mb-2">
                                    Quest Title
                                  </h4>
                                  <p className="font-pixellari text-white text-lg">
                                    Bachelor's in Computer Science
                                  </p>
                                </div>
                                <div className="text-center">
                                  <h5 className="font-pressstart2p text-yellow-400 text-lg mb-1">
                                    Training Grounds
                                  </h5>
                                  <p className="font-pixellari text-white text-base">
                                    St. Martin's Engineering College
                                  </p>
                                </div>
                                <div className="text-center">
                                  <h4 className="font-pressstart2p text-yellow-400 text-lg mb-1">
                                    Campaign Duration
                                  </h4>
                                  <p className="font-pixellari text-white text-base">
                                    Aug 2019 – May 2023
                                  </p>
                                </div>
                                <div className="text-center">
                                  <h4 className="font-pressstart2p text-yellow-400 text-lg mb-1">
                                    Skill Unlocks
                                  </h4>
                                  <p className="font-pixellari text-white text-base">
                                    DBMS, Machine Learning, Data Mining, DSA
                                  </p>
                                </div>
                                <div className="text-center">
                                  <h4 className="font-pressstart2p text-yellow-400 text-lg mb-1">
                                    Lore Unlocked
                                  </h4>
                                  <p className="font-pixellari text-white text-base">
                                    Patent – ML Techniques for Hate Speech
                                    Detection
                                  </p>
                                  <p className="font-pixellari text-white text-base">
                                    Publication – Feature Extraction for Student
                                    Classification
                                  </p>
                                </div>
                                <div className="text-center">
                                  <h4 className="font-pressstart2p text-yellow-400 text-lg mb-1">
                                    Side Quests
                                  </h4>
                                  <p className="font-pixellari text-white text-base">
                                    SMEC Technology Awareness Month Director of
                                    Operations
                                  </p>
                                </div>
                              </div>
                            </>
                          );
                        default:
                          return null;
                      }
                    })()}
                  </div>
                  {/* Carousel Navigation - Arrows on Sides */}
                  <button
                    className="absolute left-2 md:left-[-48px] top-1/2 -translate-y-1/2 text-2xl md:text-4xl text-yellow-300 hover:text-white px-2 py-1 disabled:opacity-40 z-10 bg-black/50 rounded-full w-10 h-10 md:w-auto md:h-auto flex items-center justify-center"
                    onClick={() => {
                      const newIndex = Math.max(0, carouselIndex - 1);
                      setCarouselIndex(newIndex);
                      handleCarouselNavigation(newIndex);
                    }}
                    disabled={carouselIndex === 0}
                    aria-label="Previous Card"
                  >
                    &#8592;
                  </button>
                  <button
                    className="absolute right-2 md:right-[-48px] top-1/2 -translate-y-1/2 text-2xl md:text-4xl text-yellow-300 hover:text-white px-2 py-1 disabled:opacity-40 z-10 bg-black/50 rounded-full w-10 h-10 md:w-auto md:h-auto flex items-center justify-center"
                    onClick={() => {
                      const newIndex = Math.min(2, carouselIndex + 1);
                      setCarouselIndex(newIndex);
                      handleCarouselNavigation(newIndex);
                    }}
                    disabled={carouselIndex === 2}
                    aria-label="Next Card"
                  >
                    &#8594;
                  </button>
                  {/* Dot Indicators Below Card */}
                  <div className="flex gap-2 justify-center mt-8">
                    {[0, 1, 2].map((idx) => (
                      <span
                        key={idx}
                        className={`h-3 w-3 rounded-full border-2 ${
                          carouselIndex === idx
                            ? "bg-yellow-400 border-yellow-400"
                            : "bg-yellow-900 border-yellow-400"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          }
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
            <h2 className="font-pressstart2p text-3xl md:text-4xl text-white border-2 border-green-400 bg-black/50 backdrop-blur-sm px-6 py-3 rounded-lg inline-block">
              LEVEL 4: SKILL TREE
            </h2>
            <p className="font-pressstart2p text-white text-sm mt-4">
              CLICK ON SKILLS TO UNLOCK THEM AND EARN EXPERIENCE POINTS
            </p>
            
            {/* Unlock All Button - Only show when at least one skill is unlocked */}
            {Object.values(unlockedSkills).some(skill => skill) && (
              <button
                onClick={handleUnlockAllSkills}
                className="absolute top-0 right-0 font-pressstart2p text-xs sm:text-sm md:text-base text-green-400 hover:text-white bg-black/70 border border-green-400 hover:border-green-300 px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-2 rounded-lg transition-all duration-300 hover:bg-green-900/20 hover:scale-105 whitespace-nowrap"
                title="Unlock all skills at once"
              >
                <span className="hidden sm:inline">UNLOCK ALL</span>
                <span className="sm:hidden">ALL</span>
              </button>
            )}
          </div>

          {/* Skill Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                {unlockedSkills.frontend && (
                  <span className="text-green-400 text-xl">✓</span>
                )}
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
                        React & Next.js
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">●</span>
                        TypeScript & JavaScript
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">●</span>
                        HTML/CSS & Tailwind
                      </li>
                    </ul>

                    {/* Bottom status text */}
                    <div className="flex justify-between items-end mt-8">
                      <span className="font-pixellari text-white text-sm">
                        +50 XP
                      </span>
                      <span className="font-pressstart2p text-green-400 text-sm">
                        UNLOCKED
                      </span>
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
                  <RxGear />
                </span>
                <h3 className="font-pressstart2p text-white text-lg">
                  Backend
                </h3>
                {unlockedSkills.backend && (
                  <span className="text-green-400 text-xl">✓</span>
                )}
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
                        Flask
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">●</span>
                        FastAPI
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">●</span>
                        Django
                      </li>
                    </ul>

                    {/* Bottom status text */}
                    <div className="flex justify-between items-end mt-8">
                      <span className="font-pixellari text-white text-sm">
                        +50 XP
                      </span>
                      <span className="font-pressstart2p text-green-400 text-sm">
                        UNLOCKED
                      </span>
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
                  <BsDatabaseAdd />
                </span>
                <h3 className="font-pressstart2p text-white text-lg">
                  Database
                </h3>
                {unlockedSkills.database && (
                  <span className="text-green-400 text-xl">✓</span>
                )}
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
                        PostgreSQL & MySQL
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
                      <span className="font-pressstart2p text-green-400 text-sm">
                        UNLOCKED
                      </span>
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
                  <FaDocker />
                </span>
                <h3 className="font-pressstart2p text-white text-lg">DevOps</h3>
                {unlockedSkills.devops && (
                  <span className="text-green-400 text-xl">✓</span>
                )}
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
                        Docker & Kubernetes
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-yellow-400">●</span>
                        AWS & Cloud Deployments
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-yellow-400">●</span>
                        CI/CD & GitHub Actions
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-yellow-400">●</span>
                        Airflow
                      </li>
                    </ul>

                    {/* Bottom status text */}
                    <div className="flex justify-between items-end mt-8">
                      <span className="font-pixellari text-white text-sm">
                        +50 XP
                      </span>
                      <span className="font-pressstart2p text-green-400 text-sm">
                        UNLOCKED
                      </span>
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
                  <BsRobot />
                </span>
                <h3 className="font-pressstart2p text-white text-lg">AI/ML</h3>
                {unlockedSkills.ai && (
                  <span className="text-green-400 text-xl">✓</span>
                )}
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
                        LLM Integration & APIs
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-purple-400">●</span>
                        PyTorch
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-purple-400">●</span>
                        Hugging Face Transformers
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-purple-400">●</span>
                        spaCy, ML workflows
                      </li>
                    </ul>

                    {/* Bottom status text */}
                    <div className="flex justify-between items-end mt-8">
                      <span className="font-pixellari text-white text-sm">
                        +50 XP
                      </span>
                      <span className="font-pressstart2p text-green-400 text-sm">
                        UNLOCKED
                      </span>
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
                  <BsTools />
                </span>
                <h3 className="font-pressstart2p text-white text-lg">Tools</h3>
                {unlockedSkills.tools && (
                  <span className="text-green-400 text-xl">✓</span>
                )}
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
                        PowerBI, Tableau
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-pink-400">●</span>
                        AI tools
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-pink-400">●</span>
                        Postman, VS Code, etc.
                      </li>
                    </ul>

                    {/* Bottom status text */}
                    <div className="flex justify-between items-end mt-8">
                      <span className="font-pixellari text-white text-sm">
                        +50 XP
                      </span>
                      <span className="font-pressstart2p text-green-400 text-sm">
                        UNLOCKED
                      </span>
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
            <h2 className="font-pressstart2p text-3xl md:text-4xl text-white border-2 border-red-400 bg-black/50 backdrop-blur-sm px-6 py-3 rounded-lg inline-block">
              LEVEL 5: PROJECT QUESTS
            </h2>
            <p className="font-pressstart2p text-white text-sm mt-4">
              UNLOCK PROJECTS TO VIEW DETAILS AND EARN REWARDS
            </p>
          </div>

          {/* Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        Expert
                      </div>
                    </div>

                    {/* Project Details - Flexible Height */}
                    <div className="flex-1 p-4 flex flex-col overflow-hidden flex-shrink-0 min-h-0">
                      <p className="text-gray-300 font-pixellari text-sm md:text-base mb-3 leading-relaxed flex-1">
                        AI-powered developer tool that transforms GitHub repositories into interactive diagrams and narrated explainers. Generates visual architecture diagrams, provides AI-narrated walkthroughs, and offers intelligent Q&A for codebase exploration. Built with FastAPI and AWS.
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
                      <button
                        onClick={() => handleProjectLink("gitbridge")}
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
                        Expert
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
                      <button
                        onClick={() => handleProjectLink("hirely")}
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
                      <button
                        onClick={() => handleProjectLink("nexus")}
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
                      <div className="absolute top-2 right-2 bg-orange-600 text-white px-2 py-1 rounded text-xs font-pressstart2p whitespace-nowrap flex-shrink-0">
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
                      <button
                        onClick={() => handleProjectLink("quizforge")}
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
                      <button
                        onClick={() => handleProjectLink("isowebapp")}
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
                        Expert
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
                      <button
                        onClick={() => handleProjectLink("personalwebsite")}
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

            {/* Show More Button */}
            {!showMoreProjects && (
              <div className="col-span-full flex justify-center mt-6">
                <button
                  onClick={() => setShowMoreProjects(true)}
                  className="font-pressstart2p bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded border border-red-400 transition-colors text-sm md:text-base"
                >
                  VIEW MORE PROJECTS
                </button>
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
            <h2 className="font-pressstart2p text-3xl md:text-4xl text-white border-2 border-teal-400 bg-black/50 backdrop-blur-sm px-6 py-3 rounded-lg inline-block">
              LEVEL 6: PLAYER LOUNGE
            </h2>
            <p className="font-pressstart2p text-white text-sm mt-4">
              GET TO KNOW ME SOME MORE
            </p>
          </div>

          {/* Contact Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email Card */}
            <div className="bg-black/80 border border-teal-400 rounded-lg p-4 md:p-5 transition-all duration-300 hover:border-teal-300">
              <form onSubmit={handleCollabSubmit} className="space-y-3">
                <h3 className="font-pressstart2p text-white text-base md:text-lg text-center">
                  Collaborate
                </h3>
                <p className="font-pixellari text-teal-300 text-[10px] md:text-xs text-center -mt-1">
                  Tell me about your project and let's build together
                </p>
                <div className="space-y-2.5">
                  <input
                    aria-label="Your name"
                    type="text"
                    value={collabName}
                    onChange={(e) => setCollabName(e.target.value)}
                    placeholder="Your name (optional)"
                    disabled={isSubmitting}
                    className="w-full bg-black/70 border border-teal-500/60 focus:border-teal-400 outline-none rounded px-2.5 py-1.5 text-sm text-white placeholder:text-teal-300/60 font-pixellari disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <input
                    aria-label="Your email"
                    type="email"
                    value={collabEmail}
                    onChange={(e) => setCollabEmail(e.target.value)}
                    placeholder="Your email"
                    required
                    disabled={isSubmitting}
                    className="w-full bg-black/70 border border-teal-500/60 focus:border-teal-400 outline-none rounded px-2.5 py-1.5 text-sm text-white placeholder:text-teal-300/60 font-pixellari disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <textarea
                    aria-label="Project details"
                    value={collabMessage}
                    onChange={(e) => setCollabMessage(e.target.value)}
                    placeholder="Briefly describe the project / idea"
                    required
                    rows={3}
                    disabled={isSubmitting}
                    className="w-full bg-black/70 border border-teal-500/60 focus:border-teal-400 outline-none rounded px-2.5 py-1.5 text-sm text-white placeholder:text-teal-300/60 font-pixellari disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                
                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="bg-green-900/30 border border-green-400 rounded px-3 py-2">
                    <p className="font-pixellari text-green-400 text-xs text-center">
                      ✓ Message sent successfully! I'll get back to you soon.
                    </p>
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="bg-red-900/30 border border-red-400 rounded px-3 py-2">
                    <p className="font-pixellari text-red-400 text-xs text-center">
                      ✗ Failed to send message. Please try again or contact me directly.
                    </p>
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full font-pressstart2p bg-teal-600 hover:bg-teal-700 disabled:bg-teal-800 disabled:cursor-not-allowed text-white px-3 py-2 rounded border border-teal-400 transition-colors text-sm"
                >
                  {isSubmitting ? "SENDING..." : "SEND REQUEST"}
                </button>
                <p className="font-pixellari text-teal-300 text-[10px] text-center">
                  {isSubmitting ? "Sending your message..." : "Your message will be sent directly to me"}
                </p>
              </form>
            </div>

            {/* LinkedIn Card */}
            <div className="bg-black/80 border border-teal-400 rounded-lg p-4 md:p-5 transition-all duration-300 hover:border-teal-300">
              <div className="text-center mb-4">
                <h3 className="font-pressstart2p text-white text-base md:text-lg">
                  SIDE QUESTS
                </h3>
              </div>
              <ul className="list-disc list-inside space-y-2 text-left px-2">
                <li className="font-pixellari text-teal-300 text-sm md:text-base">
                  <span className="text-teal-300 font-pressstart2p">
                    Cinephile's Marathon
                  </span>
                  <span className="text-gray-300">
                    {" "}
                    – Binge-watch legendary films and uncover hidden cinematic
                    gems.
                  </span>
                </li>
                <li className="font-pixellari text-teal-300 text-sm md:text-base">
                  <span className="text-teal-300 font-pressstart2p">
                    Arena Watcher
                  </span>
                  <span className="text-gray-300">
                    {" "}
                    – Track epic matches across cricket, basketball, and beyond.
                  </span>
                </li>
                <li className="font-pixellari text-teal-300 text-sm md:text-base">
                  <span className="text-teal-300 font-pressstart2p">
                    The City Rider
                  </span>
                  <span className="text-gray-300">
                    {" "}
                    – Cycle through bustling streets and scenic trails.
                  </span>
                </li>
                <li className="font-pixellari text-teal-300 text-sm md:text-base">
                  <span className="text-teal-300 font-pressstart2p">
                    Explorer's Odyssey
                  </span>
                  <span className="text-gray-300">
                    {" "}
                    – Venture into unfamiliar neighborhoods and travel to
                    distant cities, collecting stories along the way.
                  </span>
                </li>
              </ul>
            </div>

            {/* Social Dock (compact version) */}
            <div className="md:col-span-2 w-60 bg-black/80 border border-teal-400 rounded-lg p-1 transition-all duration-300 hover:border-teal-300 mx-auto justify-self-center">
              <div className="text-center mb-1">
                <h3 className="font-pressstart2p text-white text-sm">
                  SOCIALS
                </h3>
              </div>
              <nav className="flex items-center justify-center gap-3 sm:gap-4 md:gap-5 flex-wrap py-0.5">
                <a
                  href="https://github.com/PranavReddyGaddam"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="text-teal-300 hover:text-white transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/pranav-reddy-gaddam-69338321b/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="text-teal-300 hover:text-white transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="https://www.instagram.com/__pranav.reddy__"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-teal-300 hover:text-white transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com/Pranav_2801"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="text-teal-300 hover:text-white transition-colors"
                >
                  <RiTwitterXFill className="w-5 h-5" />
                </a>
              </nav>
            </div>
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
      <AchievementPopup
        title="Quest Initiator"
        xp={50}
        isVisible={showQuestInitiator}
        theme="purple"
        index={getAchievementIndex("quest-initiator")}
      />
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
      <AchievementPopup
        title="Scroll Seeker"
        xp={20}
        isVisible={showScrollSeeker}
        theme="yellow"
        index={getAchievementIndex("scroll-seeker")}
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
                        <GoTrophy />
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
                      <span
                        className={`font-pressstart2p text-xs ${
                          isUnlocked ? "text-green-400" : "text-gray-400"
                        }`}
                      >
                        {isUnlocked ? "UNLOCKED" : "LOCKED"}
                      </span>
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
