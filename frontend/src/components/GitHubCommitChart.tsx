import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

interface CommitData {
  date: string;
  count: number;
}

interface GitHubCommitChartProps {
  className?: string;
}

const GitHubCommitChart: React.FC<GitHubCommitChartProps> = ({ className = '' }) => {
  const [commitData, setCommitData] = useState<CommitData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCommitData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/github-commits');
        
        if (!response.ok) {
          throw new Error('Failed to fetch commit data');
        }
        
        const data = await response.json();
        setCommitData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching commit data:', err);
        setError('Failed to load commit history');
      } finally {
        setLoading(false);
      }
    };

    fetchCommitData();
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
  }, [commitData]);

  // Transform data for react-calendar-heatmap
  const heatmapData = commitData.map((item) => ({
    date: item.date,
    count: item.count,
  }));

  // Get the date range for the heatmap (last 365 days)
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setDate(today.getDate() - 365);

  // Custom class for the heatmap to match game theme
  const getClassForValue = (value: { count: number } | null) => {
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
        <p className="font-pixellari text-blue-300 text-sm">Loading commit history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <p className="font-pixellari text-red-300 text-sm">{error}</p>
      </div>
    );
  }

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
        className="flex-1 min-h-0 overflow-x-auto overflow-y-visible bg-gradient-to-br from-slate-900/50 to-blue-900/30 rounded-lg border border-blue-400/30 pt-4 px-3 pb-3 backdrop-blur-sm relative"
      >
        <CalendarHeatmap
          startDate={oneYearAgo}
          endDate={today}
          values={heatmapData}
          classForValue={getClassForValue}
          tooltipDataAttrs={(value: { date: string; count: number } | null) => {
            if (!value) {
              return { 'data-tip': 'No commits' };
            }
            const dateObj = new Date(value.date);
            const formattedDate = dateObj.toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric',
              year: 'numeric'
            });
            return {
              'data-tip': `${value.count} ${value.count === 1 ? 'contribution' : 'contributions'} on ${formattedDate}`,
            };
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
    </div>
  );
};

export default GitHubCommitChart;

