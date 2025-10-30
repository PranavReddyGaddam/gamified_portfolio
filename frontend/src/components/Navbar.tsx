import React from "react";
import { BiSolidJoystick } from "react-icons/bi";
import { GoTrophy } from "react-icons/go";
import { GrScorecard } from "react-icons/gr";

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
  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-2 md:p-4 bg-transparent backdrop-blur-sm">
      <div className="flex justify-between items-center max-w-6xl mx-auto gap-3 md:gap-4">
        {/* Level Indicator */}
        <div className="border border-blue-400 bg-black/50 backdrop-blur-sm px-2.5 py-1.5 md:px-4 md:py-2 rounded-md min-w-fit">
          <div className="flex items-center gap-1.5 md:gap-2">
            <span className="text-blue-400 text-sm md:text-base"><BiSolidJoystick /></span>
            <span className="font-pressstart2p text-[10px] md:text-sm text-white">
              {`LEVEL ${currentLevel}/${totalLevels}`}
            </span>
          </div>
        </div>

        {/* Score */}
        <div className="border border-yellow-400 bg-black/50 backdrop-blur-sm px-2.5 py-1.5 md:px-4 md:py-2 rounded-md min-w-fit">
          <div className="flex items-center gap-1.5 md:gap-2">
            <span className="text-yellow-400 text-sm md:text-base"><GrScorecard /></span>
            <span className="font-pressstart2p text-[10px] md:text-sm text-white">{`SCORE: ${score}`}</span>
          </div>
        </div>

        {/* Resume link - place as a direct child for equal spacing */}
        <a
          href="/Pranav_Reddy_Gaddam_Resume_FT_Google.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="border border-purple-400 bg-black/50 backdrop-blur-sm px-2.5 py-1.5 md:px-4 md:py-2 rounded-md min-w-fit active:scale-[0.98] transition-transform hover:bg-purple-600/20"
        >
          <span className="font-pressstart2p text-[10px] md:text-sm text-white">RESUME</span>
        </a>

        {/* Achievements */}
        <div
          className="border border-green-400 bg-black/50 backdrop-blur-sm px-2.5 py-1.5 md:px-4 md:py-2 rounded-md cursor-pointer select-none active:scale-[0.98] transition-transform min-w-fit"
          role="button"
          tabIndex={0}
          onClick={onOpenAchievements}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onOpenAchievements();
          }}
        >
          <div className="flex items-center gap-1.5 md:gap-2">
            <span className="text-green-400 text-sm md:text-base"><GoTrophy /></span>
            <span className="font-pressstart2p text-[10px] md:text-sm text-white"><span className="hidden sm:inline">ACHIEVEMENTS</span></span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
