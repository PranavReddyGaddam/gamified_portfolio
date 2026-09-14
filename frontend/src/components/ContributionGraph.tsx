import { useEffect, useState } from "react";

type Day = { date: string; count: number };

type Stats = {
  days: Day[];
  totalContributions: number;
};

/** Cell geometry, in SVG user units. */
const CELL = 11;
const GAP = 3;
const STEP = CELL + GAP;

/**
 * A year of GitHub contributions as a heat grid.
 *
 * Drawn as plain SVG rather than through a charting library: it is a fixed
 * grid of rects, and hand-rolling it keeps the palette tied to the page's
 * olive rather than fighting a library's defaults.
 */
/** "12 contributions on Mar 4" — the text shown in the hover tooltip. */
const describe = (day: Day) => {
  const when = new Date(day.date + "T00:00:00").toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
  if (!day.count) return `No contributions on ${when}`;
  return `${day.count} contribution${day.count === 1 ? "" : "s"} on ${when}`;
};

type Hover = { i: number; x: number; y: number; label: string };

const ContributionGraph = ({ username = "PranavReddyGaddam" }: { username?: string }) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [failed, setFailed] = useState(false);
  const [hover, setHover] = useState<Hover | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/github-stats?username=${encodeURIComponent(username)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: Stats) => {
        if (!cancelled) setStats(data);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [username]);

  // The graph is decorative; if GitHub is unreachable, drop it rather than
  // leaving a broken frame in the column.
  if (failed) return null;

  const days = stats?.days ?? [];

  // Pad the head of the run so the first column starts on a Sunday, keeping
  // the weekday rows aligned.
  const offset = days.length ? new Date(days[0].date + "T00:00:00").getDay() : 0;
  const cells: (Day | null)[] = [...Array<null>(offset).fill(null), ...days];
  const weeks = Math.ceil(cells.length / 7);

  // Fixed commit-count thresholds rather than a scale relative to the busiest
  // day: a handful of 50-commit outliers would otherwise push every ordinary
  // day into the lightest shade and flatten the whole year.
  const level = (count: number) => {
    if (!count) return 0;
    if (count > 10) return 4;
    if (count > 5) return 3;
    if (count > 2) return 2;
    return 1;
  };

  const width = weeks * STEP - GAP;
  const height = 7 * STEP - GAP;

  return (
    <div className="contrib">
      <div className="contrib-head">
        <span className="contrib-title">(Contributions)</span>
        <span className="contrib-total">
          {stats ? `${stats.totalContributions.toLocaleString()} in the last year` : " "}
        </span>
      </div>

      <a
        className="contrib-link"
        href={`https://github.com/${username}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={
          stats
            ? `${stats.totalContributions} GitHub contributions in the last year — open profile`
            : "Open GitHub profile"
        }
        onMouseLeave={() => setHover(null)}
      >
        <svg
          className="contrib-grid"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {cells.map((cell, i) => (
            <rect
              key={i}
              x={Math.floor(i / 7) * STEP}
              y={(i % 7) * STEP}
              width={CELL}
              height={CELL}
              rx={2.5}
              className={`contrib-cell contrib-cell--${cell ? level(cell.count) : 0}${
                hover?.i === i ? " is-hovered" : ""
              }`}
              onMouseEnter={
                cell
                  ? () =>
                      setHover({
                        i,
                        // Position the tooltip over the cell's centre, as a
                        // percentage so it tracks the SVG as it scales.
                        x: ((Math.floor(i / 7) * STEP + CELL / 2) / width) * 100,
                        y: (((i % 7) * STEP) / height) * 100,
                        label: describe(cell),
                      })
                  : undefined
              }
            />
          ))}
        </svg>

        {hover ? (
          <span
            className="contrib-tip"
            style={{ left: `${hover.x}%`, top: `${hover.y}%` }}
            aria-hidden="true"
          >
            {hover.label}
          </span>
        ) : null}
      </a>

      <div className="contrib-legend">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((l) => (
          <i key={l} className={`contrib-key contrib-cell--${l}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
};

export default ContributionGraph;
