import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import CalendarHeatmap, { ReactCalendarHeatmapValue, TooltipDataAttrs } from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

interface CommitData {
  date: string;
  count: number;
}

/**
 * The heatmap's own value type. Its `[key: string]: any` index signature covers
 * the `count` field we supply, and the callbacks require this exact type.
 */
type HeatmapValue = ReactCalendarHeatmapValue<string>;

interface LanguageStat {
  name: string;
  color: string | null;
  percent: number;
}

interface GitHubStats {
  days: CommitData[];
  totalContributions: number;
  activeDays: number;
  currentStreak: number;
  longestStreak: number;
  pullRequests: number;
  followers: number;
  languages: LanguageStat[];
}

interface GitHubCommitChartProps {
  className?: string;
}

const GitHubCommitChart: React.FC<GitHubCommitChartProps> = ({ className = '' }) => {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/github-stats');

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('API Error:', response.status, errorData);
          throw new Error(errorData.message || `Failed to fetch GitHub stats (${response.status})`);
        }

        const data = await response.json();
        if (data && Array.isArray(data.days)) {
          setStats(data);
          setError(null);
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (err) {
        console.error('Error fetching GitHub stats:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load GitHub stats';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Setup tooltip handlers for SVG rects
  useEffect(() => {
    if (!containerRef.current) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as SVGElement;
      if (target.tagName === 'rect' && containerRef.current) {
        const dataTip = target.getAttribute('data-tip');
        if (dataTip) {
          const rectBounds = target.getBoundingClientRect();
          setTooltip({
            x: rectBounds.left + rectBounds.width / 2, // Absolute viewport X
            y: rectBounds.top - 10, // Absolute viewport Y
            text: dataTip,
          });
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as SVGElement;
      if (target.tagName === 'rect' && containerRef.current) {
        const dataTip = target.getAttribute('data-tip');
        if (dataTip) {
          const rectBounds = target.getBoundingClientRect();
          setTooltip({
            x: rectBounds.left + rectBounds.width / 2, // Absolute viewport X
            y: rectBounds.top - 10, // Absolute viewport Y
            text: dataTip,
          });
        }
      }
    };

    const handleMouseOut = () => {
      setTooltip(null);
    };

    const heatmapContainer = containerRef.current.querySelector('.react-calendar-heatmap');
    if (heatmapContainer) {
      heatmapContainer.addEventListener('mouseover', handleMouseOver as EventListener);
      heatmapContainer.addEventListener('mousemove', handleMouseMove as EventListener);
      heatmapContainer.addEventListener('mouseout', handleMouseOut);
    }

    return () => {
      if (heatmapContainer) {
        heatmapContainer.removeEventListener('mouseover', handleMouseOver as EventListener);
        heatmapContainer.removeEventListener('mousemove', handleMouseMove as EventListener);
        heatmapContainer.removeEventListener('mouseout', handleMouseOut);
      }
    };
  }, [stats]);

  // Transform data for react-calendar-heatmap
  const heatmapData = (stats?.days ?? []).map((item) => ({
    date: item.date,
    count: item.count,
  }));

  // Get the date range for the heatmap (last 365 days)
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setDate(today.getDate() - 365);

  // Custom class for the heatmap to match game theme
  const getClassForValue = (value: HeatmapValue | undefined) => {
    if (!value || value.count === 0) {
      return 'color-empty';
    }
    if (value.count >= 10) {
      return 'color-scale-4';
    }
    if (value.count >= 5) {
      return 'color-scale-3';
    }
    if (value.count >= 2) {
      return 'color-scale-2';
    }
    return 'color-scale-1';
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <p className="font-pixellari text-blue-300 text-sm">Loading GitHub stats...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <p className="font-pixellari text-red-300 text-sm">{error}</p>
      </div>
    );
  }

  const statTiles = [
    { label: 'CONTRIBS', value: stats.totalContributions, accent: 'text-green-400' },
    { label: 'STREAK', value: `${stats.currentStreak}d`, accent: 'text-yellow-400' },
    { label: 'BEST RUN', value: `${stats.longestStreak}d`, accent: 'text-orange-400' },
    { label: 'ACTIVE DAYS', value: stats.activeDays, accent: 'text-cyan-400' },
    { label: 'PULL REQS', value: stats.pullRequests, accent: 'text-purple-400' },
    { label: 'FOLLOWERS', value: stats.followers, accent: 'text-pink-400' },
  ];

  return (
    <div className={`flex flex-col ${className}`}>
      <style>{`
        .react-calendar-heatmap {
          font-family: 'Pixellari', monospace;
          width: 100%;
          padding: 16px 8px 8px 8px;
        }
        .react-calendar-heatmap text {
          font-size: 9px;
          fill: #60a5fa;
          font-weight: bold;
        }
        .react-calendar-heatmap .color-empty {
          fill: #0d1117;
          stroke: #21262d;
          stroke-width: 0.5;
        }
        .react-calendar-heatmap .color-scale-1 {
          fill: #0e4429;
          stroke: #006d32;
          stroke-width: 0.5;
        }
        .react-calendar-heatmap .color-scale-2 {
          fill: #006d32;
          stroke: #26a641;
          stroke-width: 0.5;
        }
        .react-calendar-heatmap .color-scale-3 {
          fill: #26a641;
          stroke: #39d353;
          stroke-width: 0.5;
        }
        .react-calendar-heatmap .color-scale-4 {
          fill: #39d353;
          stroke: #56d364;
          stroke-width: 0.5;
        }
        .react-calendar-heatmap rect {
          rx: 2;
          ry: 2;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .react-calendar-heatmap rect:hover {
          stroke: #60a5fa !important;
          stroke-width: 2.5 !important;
          filter: drop-shadow(0 0 6px rgba(96, 165, 250, 0.8));
          opacity: 1;
        }
        .react-calendar-heatmap .color-scale-1:hover {
          fill: #006d32;
        }
        .react-calendar-heatmap .color-scale-2:hover {
          fill: #26a641;
        }
        .react-calendar-heatmap .color-scale-3:hover {
          fill: #39d353;
        }
        .react-calendar-heatmap .color-scale-4:hover {
          fill: #56d364;
        }
      `}</style>
      <div
        ref={containerRef}
        className="overflow-x-auto overflow-y-visible bg-gradient-to-br from-slate-900/50 to-blue-900/30 rounded-lg border border-blue-400/30 pt-4 px-3 pb-3 backdrop-blur-sm relative flex-shrink-0"
      >
        <CalendarHeatmap
          startDate={oneYearAgo}
          endDate={today}
          values={heatmapData}
          classForValue={getClassForValue}
          tooltipDataAttrs={(value: HeatmapValue | undefined) => {
            if (!value) {
              return { 'data-tip': 'No commits' } as TooltipDataAttrs;
            }
            const dateObj = new Date(value.date);
            const formattedDate = dateObj.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            });
            return {
              'data-tip': `${value.count} ${value.count === 1 ? 'contribution' : 'contributions'} on ${formattedDate}`,
            } as TooltipDataAttrs;
          }}
        />
      </div>
      {tooltip && createPortal(
        <div
          className="fixed pointer-events-none z-[9999] bg-gray-900 text-white text-xs font-pixellari px-3 py-2 rounded border border-gray-700 shadow-xl whitespace-nowrap"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: 'translateX(-50%) translateY(-100%)',
          }}
        >
          {tooltip.text}
          <div
            className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"
          />
        </div>,
        document.body
      )}
      <div className="flex items-center justify-center gap-3 mt-3 text-xs font-pixellari text-blue-300 flex-shrink-0">
        <span className="text-blue-400">Less</span>
        <div className="flex gap-1.5 items-center">
          <div className="w-3.5 h-3.5 rounded border border-gray-600 bg-[#0d1117] hover:border-blue-400 transition-colors"></div>
          <div className="w-3.5 h-3.5 rounded border border-green-900 bg-[#0e4429] hover:border-blue-400 transition-colors"></div>
          <div className="w-3.5 h-3.5 rounded border border-green-800 bg-[#006d32] hover:border-blue-400 transition-colors"></div>
          <div className="w-3.5 h-3.5 rounded border border-green-600 bg-[#26a641] hover:border-blue-400 transition-colors"></div>
          <div className="w-3.5 h-3.5 rounded border border-green-400 bg-[#39d353] hover:border-green-300 transition-colors shadow-sm shadow-green-400/50"></div>
        </div>
        <span className="text-blue-400">More</span>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-3 gap-2 mt-4 flex-shrink-0">
        {statTiles.map((tile) => (
          <div
            key={tile.label}
            className="bg-slate-900/50 border border-blue-400/30 rounded p-2 text-center"
          >
            <div className={`font-pressstart2p text-sm ${tile.accent}`}>{tile.value}</div>
            <div className="font-pixellari text-blue-300 text-[10px] mt-1 leading-tight">
              {tile.label}
            </div>
          </div>
        ))}
      </div>

      {/* Top languages */}
      {stats.languages.length > 0 && (
        <div className="mt-4 flex-shrink-0">
          <h4 className="font-pressstart2p text-white text-[10px] mb-2">TOP LANGUAGES</h4>
          <div className="flex h-3 w-full rounded-sm overflow-hidden border border-blue-400/30">
            {stats.languages.map((lang) => (
              <div
                key={lang.name}
                style={{
                  width: `${lang.percent}%`,
                  backgroundColor: lang.color || '#60a5fa',
                }}
                title={`${lang.name} ${lang.percent.toFixed(1)}%`}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
            {stats.languages.map((lang) => (
              <div key={lang.name} className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: lang.color || '#60a5fa' }}
                />
                <span className="font-pixellari text-blue-300 text-[10px]">
                  {lang.name} {lang.percent.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GitHubCommitChart;
