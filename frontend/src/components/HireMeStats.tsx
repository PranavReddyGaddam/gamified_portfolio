import React from "react";

const kpis = [
  { value: "500K+", label: "Daily API requests in production" },
  { value: "$30K+", label: "Revenue from a system built from scratch" },
  { value: "2,500+", label: "Attendees served with QR check-in" },
  { value: "3x", label: "Hackathon winner (Cisco, AWS, SJSU)" },
  { value: "35th", label: "comma.ai compression challenge, cold start" },
];

const HireMeStats: React.FC = () => (
  <div className="grid grid-cols-5 gap-2">
    {kpis.map((kpi) => (
      <div
        key={kpi.label}
        className="bg-red-900/40 border border-white/30 rounded-lg px-2 py-3 text-center"
      >
        <p className="font-pressstart2p text-yellow-300 text-xs md:text-base mb-1">
          {kpi.value}
        </p>
        <p className="font-pixellari text-white/90 text-[10px] md:text-xs leading-snug">
          {kpi.label}
        </p>
      </div>
    ))}
  </div>
);

export default HireMeStats;
