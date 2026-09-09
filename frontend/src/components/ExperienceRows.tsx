import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export type ExperienceEntry = {
  id: string;
  org: string;
  team: string;
  role: string;
  year: string;
  period: string;
  detail: string;
  points: string[];
};

type Props = {
  entries: ExperienceEntry[];
};

/**
 * Experience table where each row expands to reveal its detail.
 *
 * The panel is animated on its natural height rather than a fixed value, so
 * rows of different lengths open correctly and stay correct if the text
 * reflows at another width.
 */
const ExperienceRows = ({ entries }: Props) => {
  const [openId, setOpenId] = useState<string | null>(null);
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const rootRef = useRef<HTMLDivElement | null>(null);

  const toggle = (id: string) => {
    const next = openId === id ? null : id;
    const previous = openId;

    // Close whichever row is open before opening another.
    if (previous && previous !== next) {
      animatePanel(previous, false);
    }
    if (next) {
      animatePanel(next, true);
    } else if (previous) {
      animatePanel(previous, false);
    }

    setOpenId(next);
  };

  const animatePanel = (id: string, open: boolean) => {
    const el = panelRefs.current[id];
    if (!el) return;

    const inner = el.firstElementChild as HTMLElement | null;
    gsap.killTweensOf(el);
    if (inner) gsap.killTweensOf(inner);

    if (open) {
      gsap.set(el, { height: "auto", display: "block" });
      const target = el.offsetHeight;
      gsap.fromTo(
        el,
        { height: 0, opacity: 0 },
        {
          height: target,
          opacity: 1,
          duration: 0.55,
          ease: "power3.out",
          onComplete: () => {
            gsap.set(el, { height: "auto" });
          },
        }
      );
      if (inner) {
        gsap.fromTo(
          inner,
          { y: -8, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, delay: 0.08, ease: "power2.out" }
        );
      }
    } else {
      gsap.to(el, {
        height: 0,
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
      });
    }
  };

  // Reveal rows on scroll, staggered. gsap.context scopes the selector to
  // this component and reverts every tween it created on unmount.
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-exp-row]", {
        y: 14,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 85%" },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="space-y-4 exp-table" ref={rootRef}>
      {entries.map((e) => {
        const isOpen = openId === e.id;
        return (
          <div
            key={e.id}
            data-exp-row
            className="border-b border-neutral-100 last:border-0"
          >
            <button
              type="button"
              onClick={() => toggle(e.id)}
              aria-expanded={isOpen}
              aria-controls={`exp-panel-${e.id}`}
              className="w-full grid grid-cols-4 gap-4 text-sm py-2 text-left transition-opacity duration-200 hover:opacity-60"
            >
              <span className="text-neutral-900 font-normal">{e.org}</span>
              <span className="text-neutral-900">{e.team}</span>
              <span className="text-neutral-900">{e.role}</span>
              <span className="text-neutral-400 text-right tabular-nums">
                {e.year}
              </span>
            </button>

            <div
              id={`exp-panel-${e.id}`}
              ref={(el) => {
                panelRefs.current[e.id] = el;
              }}
              className="overflow-hidden"
              style={{ height: 0, opacity: 0 }}
            >
              <div className="grid grid-cols-4 gap-4 pb-6 pt-1">
                <span className="text-xs text-neutral-400">{e.period}</span>
                <div className="col-span-3">
                  <p className="text-sm text-neutral-600 leading-relaxed mb-3">
                    {e.detail}
                  </p>
                  <ul className="space-y-1">
                    {e.points.map((p) => (
                      <li
                        key={p}
                        className="text-sm text-neutral-500 leading-relaxed"
                      >
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ExperienceRows;
