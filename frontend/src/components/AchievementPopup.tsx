import React from "react";
import { GoTrophy } from "react-icons/go";

interface AchievementPopupProps {
  title: string;
  xp: number;
  isVisible: boolean;
  theme: "purple" | "blue" | "yellow" | "green" | "red" | "teal";
  index?: number;
}

const AchievementPopup: React.FC<AchievementPopupProps> = ({ 
  title, 
  xp, 
  isVisible, 
  theme, 
  index = 0 
}) => {
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
          <span className={`text-2xl ${colors.icon} flex-shrink-0`}>{GoTrophy as any}</span>
          <div className="flex-1">
            <h3 className="font-pressstart2p text-white text-lg">{title}</h3>
            <p className={`font-pixellari text-sm ${colors.text}`}>+{xp} XP</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-pressstart2p text-white text-xs leading-tight">UNLOCKED</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementPopup;
