import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BiSolidJoystick } from "react-icons/bi";
import { GoTrophy } from "react-icons/go";
import { GrScorecard } from "react-icons/gr";

gsap.registerPlugin(ScrollTrigger);

type NavbarProps = {
  currentLevel: number;
  totalLevels: number;
  score: number;
  onOpenAchievements: () => void;
};

const Navbar: React.FC<NavbarProps> = ({
  currentLevel,
  totalLevels,
  score,
  onOpenAchievements,
}) => {
  const headerRef = useRef<HTMLElement>(null);

  // On mobile the navbar is tall, so hide it when scrolling down and reveal
  // it on scroll up to free the viewport
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(max-width: 767px)", () => {
      const showAnim = gsap
        .from(headerRef.current, {
          yPercent: -110,
          paused: true,
          duration: 0.25,
          ease: "power1.out",
        })
        .progress(1);

      const trigger = ScrollTrigger.create({
        start: "top top",
        end: "max",
        onUpdate: (self) => {
          if (self.direction === -1 || self.scroll() < 50) {
            showAnim.play();
          } else {
            showAnim.reverse();
          }
        },
      });

      return () => {
        trigger.kill();
        showAnim.kill();
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 p-2 md:p-4 bg-white/90 md:bg-transparent backdrop-blur-sm"
    >
      {/* Desktop Layout - Horizontal */}
      <div className="hidden md:flex justify-between items-center max-w-6xl mx-auto gap-3 md:gap-4">
        {/* Level Indicator */}
        <div className="border border-blue-600 bg-white/80 backdrop-blur-sm px-2.5 py-1.5 md:px-4 md:py-2 rounded-md min-w-fit">
          <div className="flex items-center gap-1.5 md:gap-2">
            <span className="text-blue-700 text-sm md:text-base"><BiSolidJoystick /></span>
            <span className="font-pressstart2p text-[10px] md:text-sm text-gray-900">
              {`LEVEL ${currentLevel}/${totalLevels}`}
            </span>
          </div>
        </div>

        {/* Score */}
        <div className="border border-yellow-600 bg-white/80 backdrop-blur-sm px-2.5 py-1.5 md:px-4 md:py-2 rounded-md min-w-fit">
          <div className="flex items-center gap-1.5 md:gap-2">
            <span className="text-yellow-700 text-sm md:text-base"><GrScorecard /></span>
            <span className="font-pressstart2p text-[10px] md:text-sm text-gray-900">{`SCORE: ${score}`}</span>
          </div>
        </div>

        {/* Resume link - place as a direct child for equal spacing */}
        <a
          href="/Pranav_Reddy_Gaddam_Resume_FT_Master.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="border border-purple-600 bg-white/80 backdrop-blur-sm px-2.5 py-1.5 md:px-4 md:py-2 rounded-md min-w-fit active:scale-[0.98] transition-transform hover:bg-purple-600/20"
        >
          <span className="font-pressstart2p text-[10px] md:text-sm text-gray-900">RESUME</span>
        </a>

        {/* Achievements */}
        <div
          className="border border-green-600 bg-white/80 backdrop-blur-sm px-2.5 py-1.5 md:px-4 md:py-2 rounded-md cursor-pointer select-none active:scale-[0.98] transition-transform min-w-fit"
          role="button"
          tabIndex={0}
          onClick={onOpenAchievements}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onOpenAchievements();
          }}
        >
          <div className="flex items-center gap-1.5 md:gap-2">
            <span className="text-green-700 text-sm md:text-base"><GoTrophy /></span>
            <span className="font-pressstart2p text-[10px] md:text-sm text-gray-900"><span className="hidden sm:inline">ACHIEVEMENTS</span></span>
          </div>
        </div>
      </div>

      {/* Mobile Layout - 2x2 Grid */}
      <div className="md:hidden max-w-6xl mx-auto">
        <div className="grid grid-cols-2 gap-2">
          {/* Top Row - Level & Score */}
          <div className="border border-blue-600 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-md">
            <div className="flex items-center gap-2">
              <span className="text-blue-700 text-sm"><BiSolidJoystick /></span>
              <span className="font-pressstart2p text-[9px] text-gray-900">
                {`LEVEL ${currentLevel}/${totalLevels}`}
              </span>
            </div>
          </div>

          <div className="border border-yellow-600 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-md">
            <div className="flex items-center gap-2">
              <span className="text-yellow-700 text-sm"><GrScorecard /></span>
              <span className="font-pressstart2p text-[9px] text-gray-900">{`SCORE: ${score}`}</span>
            </div>
          </div>

          {/* Bottom Row - Resume & Achievements */}
          <a
            href="/Pranav_Reddy_Gaddam_Resume_FT_Master.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-purple-600 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-md active:scale-[0.98] transition-transform hover:bg-purple-600/20"
          >
            <span className="font-pressstart2p text-[9px] text-gray-900">RESUME</span>
          </a>

          <div
            className="border border-green-600 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-md cursor-pointer select-none active:scale-[0.98] transition-transform"
            role="button"
            tabIndex={0}
            onClick={onOpenAchievements}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onOpenAchievements();
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-green-700 text-sm"><GoTrophy /></span>
              <span className="font-pressstart2p text-[9px] text-gray-900">ACHIEVEMENTS</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
