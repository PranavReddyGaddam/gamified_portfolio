import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export type SidebarChild = { id: string; label: string };
export type SidebarEntry = {
  id: string;
  label: string;
  children?: SidebarChild[];
};

type Props = {
  entries: SidebarEntry[];
  /** Scrolls the page to a row, routed through the app's ScrollSmoother. */
  onJump: (id: string) => void;
  /** Opens a child entry. The only children are the sports. */
  onPickChild: (rowId: string, childId: string) => void;
};

/**
 * A contents rail for the Fun section, desktop only.
 *
 * Only the row being read expands. Sport is the one row with real
 * sub-sections, so it is the only entry with children; the rest are a single
 * list filtered by year, and those years belong in the row header rather than
 * here, where they would read as a second set of tabs.
 */
const FunSidebar = ({ entries, onJump, onPickChild }: Props) => {
  const [active, setActive] = useState(entries[0]?.id ?? "");
  const railRef = useRef<HTMLElement | null>(null);
  // Suppresses scroll tracking while a click-driven scroll is in flight, so
  // the rail does not light up every row it passes on the way down.
  const seeking = useRef(0);

  /**
   * Pin the rail with ScrollTrigger rather than position: sticky.
   *
   * ScrollSmoother transforms #smooth-content, which makes it the containing
   * block for sticky as well as for fixed — the rail would resolve its offset
   * against the moving wrapper and scroll away with the page. ScrollTrigger
   * knows about the smoother and pins against the real scroll position.
   */
  useLayoutEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const section = rail.closest(".fun-layout");
        if (!section) return;
        const st = ScrollTrigger.create({
          trigger: section,
          start: "top 96px",
          // Stop pinning once the rows run out, so the rail does not hang
          // past the end of the section.
          end: () => `bottom bottom-=${rail.offsetHeight}`,
          pin: rail,
          // The rail's column is held open by its flex sibling, so pinning
          // must not add spacer height of its own.
          pinSpacing: false,
          // Keeps the pinned element in the same column it started in.
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });
        return () => st.kill();
      });
      return () => mm.revert();
    }, rail);

    return () => ctx.revert();
  }, [entries]);

  useEffect(() => {
    const update = () => {
      if (Date.now() < seeking.current) return;
      // The row covering a line a third of the way down the viewport.
      // A fixed viewport line rather than the rail's own top: the rail is
      // pinned to the top edge, so measuring from it would put the line above
      // every row on screen. Measured with getBoundingClientRect rather than
      // IntersectionObserver, since ScrollSmoother moves the page with a
      // transform and observer roots do not fire where you expect.
      const line = window.innerHeight * 0.33;

      let current = "";
      for (const e of entries) {
        const el = document.querySelector(`.fun-row--${e.id}`);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        // A row owns the line from the moment it reaches it until its bottom
        // passes, so a tall row does not hand over early.
        if (r.top <= line && r.bottom > line) {
          current = e.id;
          break;
        }
      }

      // Past the last row (the footer), or before the first: hold the nearest
      // rather than clearing the rail.
      if (!current) {
        let best = entries[0]?.id ?? "";
        for (const e of entries) {
          const el = document.querySelector(`.fun-row--${e.id}`);
          if (el && el.getBoundingClientRect().top <= line) best = e.id;
        }
        current = best;
      }

      setActive(current);
    };

    update();
    // Driven by ScrollTrigger rather than the scroll event: ScrollSmoother
    // applies its transform on its own tick, so a raw scroll listener reads
    // the previous frame's positions and the rail lags a row behind.
    ScrollTrigger.addEventListener("refresh", update);
    gsap.ticker.add(update);
    window.addEventListener("resize", update);
    return () => {
      ScrollTrigger.removeEventListener("refresh", update);
      gsap.ticker.remove(update);
      window.removeEventListener("resize", update);
    };
  }, [entries]);

  const jump = (id: string) => {
    setActive(id);
    seeking.current = Date.now() + 700;
    onJump(id);
  };

  return (
    <nav className="fun-rail" aria-label="For fun" ref={railRef}>
      {entries.map((entry) => {
        const isActive = entry.id === active;
        const kids = entry.children ?? [];
        const open = isActive && kids.length > 0;

        return (
          <div key={entry.id} className="fun-rail-group">
            <button
              type="button"
              onClick={() => jump(entry.id)}
              aria-current={isActive ? "true" : undefined}
              className={`fun-rail-link${isActive ? " is-active" : ""}`}
            >
              {entry.label}
            </button>

            {/* Height-animated rather than unmounted, so the rail slides open
                instead of snapping. aria-hidden and tabIndex keep the
                collapsed entries out of the tab order. */}
            <div
              className={`fun-rail-kids${open ? " is-open" : ""}`}
              style={{ height: open ? kids.length * 26 : 0 }}
              aria-hidden={!open}
            >
              {kids.map((kid) => (
                <button
                  key={kid.id}
                  type="button"
                  tabIndex={open ? 0 : -1}
                  onClick={() => onPickChild(entry.id, kid.id)}
                  className="fun-rail-kid"
                >
                  {kid.label}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </nav>
  );
};

export default FunSidebar;
