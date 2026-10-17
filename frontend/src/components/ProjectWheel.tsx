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
 * The bezel: a watch-style tick ring on the inner edge of the rim, between
 * the cards and the panel, turning with the wheel. sub is the ticks per card
 * (the long tick lines up with each card), gap the space from the centre
 * card's edge, long and short the tick lengths, all in pixels.
 */
const DIAL = { sub: 5, gap: 10, long: 12, short: 6, span: 6 };

/**
 * The focus brackets, after beui's arc picker: four corners held at the
 * centre slot while the cards turn through it. They stand gap pixels off the
 * card at rest, open by spread while the wheel moves, and close back in on
 * the card it lands on. response is that spring's settle time in seconds.
 */
const FOCUS = { gap: 5, spread: 4, response: 0.16 };

const SVG = "http://www.w3.org/2000/svg";

/**
 * A short tap of the phone's haptic engine, one per card the wheel passes.
 * Android takes navigator.vibrate. iOS has no vibrate, but Safari 18 and up
 * taps the engine when a switch-style checkbox toggles, so a hidden one is
 * toggled instead. Desktops get nothing.
 */
const makeHaptic = () => {
  if (!window.matchMedia("(pointer: coarse)").matches) return () => {};
  if (typeof navigator.vibrate === "function") {
    return () => {
      navigator.vibrate(6);
    };
  }
  const label = document.createElement("label");
  const input = document.createElement("input");
  input.type = "checkbox";
  input.setAttribute("switch", "");
  label.setAttribute("aria-hidden", "true");
  label.style.display = "none";
  label.appendChild(input);
  document.body.appendChild(label);
  const tap = () => label.click();
  tap.dispose = () => label.remove();
  return tap;
};

/**
 * The click of a watch crown, made on the fly with Web Audio: a few
 * milliseconds of noise through a narrow band-pass, so there is no file to
 * load. Browsers only start audio after a click, tap or key press, so the
 * context is created on the first one anywhere on the page; until then
 * scrolling the wheel is silent.
 */
const makeClick = () => {
  let ctx: AudioContext | null = null;
  let noise: AudioBuffer | null = null;
  const unlock = () => {
    if (!ctx) {
      ctx = new AudioContext();
      const len = Math.round(ctx.sampleRate * 0.03);
      noise = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = noise.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === "suspended") void ctx.resume();
  };
  const events = ["pointerdown", "keydown", "touchend"] as const;
  events.forEach((t) => window.addEventListener(t, unlock, { passive: true }));

  const click = () => {
    if (!ctx || !noise || ctx.state !== "running") return;
    const at = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = noise;
    // High-pass first so nothing below the click's band gives it body.
    const high = ctx.createBiquadFilter();
    high.type = "highpass";
    high.frequency.value = 3200;
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    // A little variation from click to click, as a real detent has.
    band.frequency.value = 4800 + Math.random() * 600;
    band.Q.value = 5;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(0.32, at + 0.0008);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.018);
    src.connect(high).connect(band).connect(gain).connect(ctx.destination);
    src.start(at);
    src.stop(at + 0.022);
  };
  click.dispose = () => {
    events.forEach((t) => window.removeEventListener(t, unlock));
    void ctx?.close();
  };
  return click;
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
  const dialRef = useRef<SVGSVGElement | null>(null);
  const focusRef = useRef<HTMLSpanElement | null>(null);
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
    // How far open the focus brackets are, 0 at rest to 1 while turning.
    let open = 0;
    let openVel = 0;
    let moved = false;
    let drag: { id: number; y: number; from: number; v: number; lastY: number; lastAt: number } | null =
      null;

    // One line per tick, laid out again every frame round the current spot.
    const dial = dialRef.current;
    const half = DIAL.span * DIAL.sub;
    const ticks: SVGLineElement[] = [];
    const rim = document.createElementNS(SVG, "path");
    rim.setAttribute("class", "pw-dial-rim");
    if (dial) {
      dial.replaceChildren(rim);
      for (let i = -half; i <= half; i++) {
        const line = document.createElementNS(SVG, "line");
        dial.appendChild(line);
        ticks.push(line);
      }
    }
    const haptic: (() => void) & { dispose?: () => void } = makeHaptic();
    const click = makeClick();
    let detent = Math.round(initial);
    let lastTap = 0;

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
      if (focusRef.current) {
        focusRef.current.style.transform = `translate(${apex - bw / 2}px, ${(cy - bh / 2).toFixed(1)}px)`;
        focusRef.current.style.setProperty("--gap", `${(FOCUS.gap + open * FOCUS.spread).toFixed(2)}px`);
      }
      // Ticks sit at fixed spots on the wheel, so they ride round with it.
      const r = G.radius - bw / 2 - DIAL.gap;
      const base = Math.floor(pos * DIAL.sub);
      for (let i = 0; i < ticks.length; i++) {
        const t = base + i - half;
        const off = t / DIAL.sub - pos;
        const a = Math.PI - off * G.step;
        const far = Math.abs(off * G.step) / WHEEL.reach;
        const line = ticks[i];
        if (far > 1) {
          line.setAttribute("opacity", "0");
          continue;
        }
        const major = ((t % DIAL.sub) + DIAL.sub) % DIAL.sub === 0;
        const len = major ? DIAL.long : DIAL.short;
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        line.setAttribute("x1", (cx + cos * r).toFixed(1));
        line.setAttribute("y1", (cy + sin * r).toFixed(1));
        line.setAttribute("x2", (cx + cos * (r - len)).toFixed(1));
        line.setAttribute("y2", (cy + sin * (r - len)).toFixed(1));
        line.setAttribute("opacity", (1 - far * far).toFixed(3));
        line.setAttribute(
          "class",
          major ? (Math.abs(off) < 0.1 ? "pw-tick is-major is-on" : "pw-tick is-major") : "pw-tick"
        );
      }
      // A tap and a click for every card that crosses the marker, however it
      // got there.
      const d = Math.round(pos);
      if (d !== detent) {
        detent = d;
        const now = performance.now();
        if (now - lastTap > 30) {
          lastTap = now;
          haptic();
          click();
        }
      }
    };

    const layout = () => {
      const rect = host.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      H = rect.height;
      // The centre card sits near the column's left edge, leaving room for
      // the focus brackets to open.
      apex = bw / 2 + 14;
      cx = apex + G.radius;
      cy = H / 2;
      // The bezel's edge, the arc the long and short ticks hang from.
      const r = G.radius - bw / 2 - DIAL.gap;
      const sweep = WHEEL.reach;
      const p = (a: number) => `${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}`;
      rim.setAttribute("d", `M ${p(Math.PI - sweep)} A ${r} ${r} 0 0 1 ${p(Math.PI + sweep)}`);
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
      // The brackets open while anything moves and close once it rests.
      // Small substeps keep this stiffer spring stable on a slow frame.
      const goal = !reduced && (drag || pos !== target) ? 1 : 0;
      const w = TAU / FOCUS.response;
      for (let left = dt; left > 0; left -= 0.004) {
        const h = Math.min(left, 0.004);
        openVel += (w * w * (goal - open) - 2 * w * openVel) * h;
        open += openVel * h;
      }
      if (Math.abs(goal - open) < 0.002 && Math.abs(openVel) < 0.01) {
        open = goal;
        openVel = 0;
      }
      place();
      if (drag || pos !== target || open !== 0) raf = requestAnimationFrame(frame);
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
      haptic.dispose?.();
      click.dispose();
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
        <svg ref={dialRef} className="pw-dial" aria-hidden="true" />
        <span ref={focusRef} className="pw-focus" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
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
