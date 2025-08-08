import React from 'react';

type NavbarProps = {
  currentLevel: number;
  totalLevels: number;
  score: number;
  onOpenAchievements: () => void;
};

const Navbar: React.FC<NavbarProps> = ({ currentLevel, totalLevels, score, onOpenAchievements }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 bg-transparent backdrop-blur-sm">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
                       {/* Level Indicator */}
               <div className="border border-blue-400 bg-black/50 backdrop-blur-sm px-4 py-2 rounded">
                 <div className="flex items-center gap-2">
                   <span className="text-blue-400">🎮</span>
                   <span className="font-pressstart2p text-sm text-white">
                     {`LEVEL ${currentLevel}/${totalLevels}`}
                   </span>
                 </div>
               </div>

        {/* Score */}
        <div className="border border-yellow-400 bg-black/50 backdrop-blur-sm px-4 py-2 rounded">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">⭐</span>
            <span className="font-pressstart2p text-sm text-white">
              {`SCORE: ${score}`}
            </span>
          </div>
        </div>

        {/* Health Bar */}
        <div className="border border-red-400 bg-black/50 backdrop-blur-sm px-4 py-2 rounded">
          <div className="flex items-center gap-2">
            <span className="text-red-400">❤️</span>
            <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="w-full h-full bg-red-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div
          className="border border-yellow-400 bg-black/50 backdrop-blur-sm px-4 py-2 rounded cursor-pointer select-none"
          role="button"
          tabIndex={0}
          onClick={onOpenAchievements}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onOpenAchievements();
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">🏆</span>
            <span className="font-pressstart2p text-sm text-white">
              ACHIEVEMENTS
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar; 