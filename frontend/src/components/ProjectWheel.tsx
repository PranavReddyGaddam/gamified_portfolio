import { useEffect, useRef, useState } from "react";
import type { Project } from "../data/projects";
import ProjectBody from "./ProjectBody";

/**
 * Wheel geometry and feel, after hancore.dev.
 *
 * Cards ride the left edge of a circle whose centre sits off to the right, so
 * the column reads as the rim of a dial. radius and step set the spacing,
 * reach how far round the rim cards stay visible, tilt how much each card
 * leans with the curve, small the scale one step out from the centre.
 * response is the spring's settle time in seconds (critically damped, so it
 * never overshoots). wheelStep and drag are the pixels of wheel delta or
 * pointer travel that turn the wheel one card.
 */
const WHEEL = {
  reach: 0.82,
  small: 0.64,
  tilt: 0.55,
  response: 0.34,
  wheelStep: 42,
  drag: 64,
  /** Rest on a card this long before the panel swaps, so a flick past five
      projects does not load all five. */
  commit: 170,
};

/**
 * Per-layout geometry. Desktop gets larger cards on a wider rim; phones use
 * the reference's own numbers, sized for a narrow column.
 */
const GEOMETRY = {
  desktop: { radius: 560, step: 0.17, box: [190, 119] as const },
  compact: { radius: 520, step: 0.155, box: [150, 94] as const },
};

const TAU = Math.PI * 2;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

type Props = {
  projects: Project[];
  /** Card to start on, from a /project/:id link. */
  initial?: number;
  /**
   * Phones: no side panel. Tapping a card turns to it and then opens its
   * write-up through onOpen, as the reference does on a narrow screen.
   */
  compact?: boolean;
  onOpen?: (project: Project) => void;
};

/**
 * Work section: a wheel of project cards with the selected case study beside
 * it on desktop, or a tap away in a modal on phones.
 *
 * The wheel takes the mouse wheel the way the reference does, but only over
 * its own narrow column. The rest of the section, and the margins either
 * side, scroll the page as normal, so the wheel never traps someone reading
 * down the site.
 */
const ProjectWheel = ({ projects, initial = 0, compact = false, onOpen }: Props) => {
  const n = projects.length;
  const hostRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const markRef = useRef<HTMLSpanElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  // Card under the marker, updated as the wheel turns.
  const [current, setCurrent] = useState(initial);
  // Card whose write-up the panel shows, updated once the wheel rests.
  const [shown, setShown] = useState(initial);
  const [dragging, setDragging] = useState(false);
  // Exposed to the click and key handlers rendered below.
  const api = useRef<{ select: (k: number) => void; step: (d: number) => void } | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !n) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const G = GEOMETRY[compact ? "compact" : "desktop"];
    const [bw, bh] = G.box;

    let H = 0;
    let cx = 0;
    let cy = 0;
    let apex = 0;
    let pos = initial;
    let target = initial;
    let vel = 0;
    let raf = 0;
    let last = 0;
    let commitTimer = 0;
    let wheelAcc = 0;
    let moved = false;
    let drag: { id: number; y: number; from: number; v: number; lastY: number; lastAt: number } | null =
      null;

    const wrap = (k: number) => ((Math.round(k) % n) + n) % n;
    const index = () => wrap(target);
    // Signed distance from the centre, taking the short way round the loop.
    const offOf = (k: number, p: number) => {
      let off = (k - p) % n;
      if (off > n / 2) off -= n;
      if (off < -n / 2) off += n;
      return off;
    };

    const place = () => {
      if (!H) return;
      const sel = index();
      for (let k = 0; k < n; k++) {
        const card = cardRefs.current[k];
        if (!card) continue;
        const off = offOf(k, pos);
        const a = Math.PI - off * G.step;
        const far = Math.abs(off * G.step);
        if (far > WHEEL.reach) {
          card.style.visibility = "hidden";
          continue;
        }
        const x = cx + Math.cos(a) * G.radius;
        const y = cy + Math.sin(a) * G.radius;
        const near = clamp(1 - Math.abs(off), 0, 1);
        const s = WHEEL.small + (1 - WHEEL.small) * near;
        card.style.visibility = "visible";
        card.style.transform = `translate(${Math.round(x - bw / 2)}px, ${Math.round(
          y - bh / 2
        )}px) rotate(${((a - Math.PI) * WHEEL.tilt).toFixed(4)}rad) scale(${s.toFixed(4)})`;
        // White veil over the cards away from the centre, deeper the farther out.
        card.style.setProperty(
          "--shade",
          (k === sel ? 0 : 1 - (0.32 + 0.42 * (1 - far / WHEEL.reach) + 0.26 * near)).toFixed(3)
        );
        card.style.zIndex = String(100 - Math.round(Math.abs(off) * 8));
      }
      if (markRef.current) {
        markRef.current.style.transform = `translate(${(apex + bw / 2 + 10).toFixed(1)}px, ${(
          cy - 7
        ).toFixed(1)}px)`;
      }
    };

    const layout = () => {
      const rect = host.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      H = rect.height;
      // The centre card sits flush with the column's left edge.
      apex = bw / 2 + 8;
      cx = apex + G.radius;
      cy = H / 2;
      place();
    };

    const frame = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      if (!drag) {
        const w = TAU / WHEEL.response;
        vel += (w * w * (target - pos) - 2 * w * vel) * dt;
        pos += vel * dt;
        if (Math.abs(target - pos) < 0.002 && Math.abs(vel) < 0.01) {
          pos = target;
          vel = 0;
        }
      }
      place();
      if (drag || pos !== target) raf = requestAnimationFrame(frame);
      else last = 0;
    };

    const kick = () => {
      if (reduced && !drag) {
        pos = target;
        vel = 0;
        place();
        return;
      }
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const changed = () => {
      const k = index();
      setCurrent(k);
      window.clearTimeout(commitTimer);
      commitTimer = window.setTimeout(() => setShown(k), reduced ? 0 : WHEEL.commit);
    };

    const moveTo = (next: number) => {
      if (next === target) return;
      target = next;
      changed();
      kick();
    };

    const step = (delta: number) => moveTo(Math.round(target) + delta);
    const select = (k: number) => moveTo(Math.round(target) + offOf(k, Math.round(target)));
    api.current = { select, step };

    const onWheel = (e: WheelEvent) => {
      // Stop the page scrolling while the pointer is over the wheel.
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? 400 : 1;
      wheelAcc += (Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX) * unit;
      const steps = Math.trunc(wheelAcc / WHEEL.wheelStep);
      if (!steps) return;
      wheelAcc -= steps * WHEEL.wheelStep;
      step(clamp(steps, -3, 3));
    };

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const now = performance.now();
      const at = e.clientY;
      drag = { id: e.pointerId, y: at, from: pos, v: 0, lastY: at, lastAt: now };
      moved = false;
    };

    const onMove = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const at = e.clientY;
      const dy = at - drag.y;
      if (!moved && Math.abs(dy) < 6) return;
      if (!moved) {
        moved = true;
        host.setPointerCapture?.(e.pointerId);
        setDragging(true);
      }
      const now = performance.now();
      const dt = Math.max(1, now - drag.lastAt);
      drag.v = 0.7 * drag.v + 0.3 * ((at - drag.lastY) / dt) * 1000;
      drag.lastY = at;
      drag.lastAt = now;
      pos = drag.from - dy / WHEEL.drag;
      vel = 0;
      const near = Math.round(pos);
      if (near !== target) {
        target = near;
        changed();
      }
      kick();
    };

    const onUp = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const release = drag.v;
      drag = null;
      setDragging(false);
      if (!moved) return;
      // Carry the flick on: project where a 0.99/ms decay would coast to,
      // and land on the nearest card there.
      const project = ((release / 1000) * 0.99) / (1 - 0.99);
      const next = Math.round(pos - project / WHEEL.drag);
      vel = -release / WHEEL.drag;
      if (next !== target) {
        target = next;
        changed();
      }
      kick();
    };

    // A drag ends in a click on whichever card it was released over; swallow it.
    const onClickCapture = (e: MouseEvent) => {
      if (!moved) return;
      e.preventDefault();
      e.stopPropagation();
      moved = false;
    };

    host.addEventListener("wheel", onWheel, { passive: false });
    host.addEventListener("pointerdown", onDown);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerup", onUp);
    host.addEventListener("pointercancel", onUp);
    host.addEventListener("click", onClickCapture, true);
    const ro = new ResizeObserver(layout);
    ro.observe(host);
    layout();

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(commitTimer);
      ro.disconnect();
      host.removeEventListener("wheel", onWheel);
      host.removeEventListener("pointerdown", onDown);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerup", onUp);
      host.removeEventListener("pointercancel", onUp);
      host.removeEventListener("click", onClickCapture, true);
      api.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n, compact]);

  // Only the centre card plays; the rest hold their first frame.
  useEffect(() => {
    cardRefs.current.forEach((card, k) => {
      const video = card?.querySelector("video");
      if (!video) return;
      if (k === current) void video.play().catch(() => {});
      else video.pause();
    });
  }, [current]);

  // Each project opens at the top of its write-up.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [shown]);

  const project = projects[shown];

  return (
    <div className={`pw${compact ? " pw--compact" : ""}`}>
      <div
        ref={hostRef}
        className={`pw-wheel${dragging ? " is-dragging" : ""}`}
        role="listbox"
        aria-label="Projects"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowRight") {
            e.preventDefault();
            api.current?.step(1);
          } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
            e.preventDefault();
            api.current?.step(-1);
          }
        }}
      >
        {projects.map((p, k) => {
          const media = p.previewImages?.[0];
          return (
            <button
              key={p.id}
              ref={(el) => {
                cardRefs.current[k] = el;
              }}
              type="button"
              role="option"
              aria-selected={k === current}
              aria-label={p.title}
              tabIndex={-1}
              className="pw-card"
              onClick={() => {
                api.current?.select(k);
                // Let the wheel settle on the card before the modal covers it.
                if (compact) window.setTimeout(() => onOpen?.(p), WHEEL.commit);
              }}
            >
              {media ? (
                media.endsWith(".mp4") ? (
                  // #t nudges Safari into painting the first frame while paused.
                  <video src={`${media}#t=0.1`} muted loop playsInline preload="metadata" />
                ) : (
                  <img src={media} alt="" draggable={false} />
                )
              ) : null}
              <span className="pw-cap">{p.title}</span>
            </button>
          );
        })}
        <span ref={markRef} className="pw-mark" aria-hidden="true" />
        <p className="pw-hint" aria-hidden="true">
          {compact ? "swipe · tap to open" : "scroll · drag the wheel"}
        </p>
      </div>

      {compact ? (
        // The page scrolls normally over this side; only the wheel takes swipes.
        <div className="pw-aside" aria-live="polite">
          <div key={projects[current].id} className="pw-swap">
            <p className="pw-aside-year">{projects[current].year}</p>
            <h3 className="pw-aside-title">{projects[current].title}</h3>
            <p className="pw-aside-desc">{projects[current].description}</p>
            <button
              type="button"
              className="pw-aside-open"
              onClick={() => onOpen?.(projects[current])}
            >
              Read case study →
            </button>
          </div>
        </div>
      ) : (
        <article className="pw-panel" aria-live="polite">
          <header className="pm-bar">
            <span className="pm-crumb">
              Work <span aria-hidden="true"> › </span>
              <span className="pm-crumb-current">{project.title}</span>
            </span>
            <span className="pm-bar-actions">
              {project.liveUrl ? (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="pm-bar-link">
                  Visit site ↗
                </a>
              ) : null}
              {project.githubUrl ? (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="pm-bar-link">
                  Code ↗
                </a>
              ) : null}
            </span>
          </header>
          <div ref={scrollRef} className="pw-scroll">
            {/* Keyed so each swap replays the fade-in. */}
            <div key={project.id} className="pw-swap">
              <ProjectBody project={project} />
            </div>
          </div>
        </article>
      )}
    </div>
  );
};

export default ProjectWheel;
