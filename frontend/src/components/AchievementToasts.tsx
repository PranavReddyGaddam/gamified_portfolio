import React from "react";
import { GoTrophy } from "react-icons/go";

export type AchievementTheme =
  | "purple"
  | "blue"
  | "yellow"
  | "green"
  | "red"
  | "teal";

export type AchievementToast = {
  id: string;
  title: string;
  xp: number;
  theme: AchievementTheme;
  leaving?: boolean;
};

const THEME_COLORS: Record<
  AchievementTheme,
  { border: string; bg: string; text: string; icon: string }
> = {
  purple: {
    border: "border-purple-600",
    bg: "bg-purple-50",
    text: "text-purple-700",
    icon: "text-purple-700",
  },
  blue: {
    border: "border-blue-600",
    bg: "bg-blue-50",
    text: "text-blue-700",
    icon: "text-blue-700",
  },
  yellow: {
    border: "border-yellow-600",
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    icon: "text-yellow-700",
  },
  green: {
    border: "border-green-600",
    bg: "bg-green-50",
    text: "text-green-700",
    icon: "text-green-700",
  },
  red: {
    border: "border-red-600",
    bg: "bg-red-50",
    text: "text-red-700",
    icon: "text-red-700",
  },
  teal: {
    border: "border-teal-600",
    bg: "bg-teal-50",
    text: "text-teal-700",
    icon: "text-teal-700",
  },
};

/*
  Single fixed container for achievement toasts. New toasts slide in at the
  bottom of the stack; leaving toasts collapse their height so the remaining
  ones settle smoothly.
*/
const AchievementToasts: React.FC<{ toasts: AchievementToast[] }> = ({
  toasts,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 flex flex-col items-stretch sm:items-end pointer-events-none">
      {toasts.map((toast) => {
        const colors = THEME_COLORS[toast.theme];
        return (
          <div
            key={toast.id}
            className={`achievement-toast ${
              toast.leaving ? "achievement-toast--leaving" : ""
            }`}
          >
            <div
              className={`border-2 ${colors.border} ${colors.bg} backdrop-blur-sm px-5 py-3 rounded-lg shadow-lg`}
            >
              <div className="flex items-center gap-3">
                <span className={`text-2xl ${colors.icon} flex-shrink-0`}>
                  <GoTrophy />
                </span>
                <div className="flex-1">
                  <h3 className="font-pressstart2p text-gray-900 text-sm sm:text-base">
                    {toast.title}
                  </h3>
                  <p className={`font-pixellari text-sm ${colors.text}`}>
                    +{toast.xp} XP
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-pressstart2p text-gray-900 text-xs leading-tight">
                    UNLOCKED
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AchievementToasts;
