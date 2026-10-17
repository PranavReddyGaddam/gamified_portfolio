import { useEffect, useRef } from "react";

/**
 * Spring for the tip's travel and width: a little under critically damped,
 * so it lands with the faintest settle. Stiffness and damping per unit mass.
 */
const SPRING = { stiffness: 190, damping: 22 };
/** Grace before the tip leaves, so crossing the gap between icons keeps it. */
const LINGER = 90;

type Props = {
  /** The dock whose links the tip labels. */
  dock: React.RefObject<HTMLElement | null>;
};

/**
 * The dock's hover label, after beUI's morphic tooltip: one glass pill shared
 * by every icon. Moving between icons, it glides to the new one and stretches
 * or shrinks to fit the new word instead of one label fading out and another
 * fading in. It reads each link's aria-label, so the music button's label
 * changes with it when pressed.
 */
const DockTip = ({ dock }: Props) => {
  const surfRef = useRef<HTMLSpanElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const nav = dock.current;
    const surf = surfRef.current;
    const text = textRef.current;
    if (!nav || !surf || !text) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let y = 0;
    let vy = 0;
    let ty = 0;
    let w = 0;
    let vw = 0;
    let tw = 0;
    let raf = 0;
    let last = 0;
    let shown = false;
    let hideTimer = 0;
    let current: HTMLElement | null = null;

    const draw = () => {
      surf.style.transform = `translateY(${(y - surf.offsetHeight / 2).toFixed(2)}px)`;
      surf.style.width = `${w.toFixed(2)}px`;
    };

    const frame = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(0.032, (now - last) / 1000) : 1 / 60;
      last = now;
      // Small substeps keep the spring steady on a slow frame.
      for (let left = dt; left > 0; left -= 0.004) {
        const h = Math.min(left, 0.004);
        vy += (SPRING.stiffness * (ty - y) - SPRING.damping * vy) * h;
        y += vy * h;
        vw += (SPRING.stiffness * (tw - w) - SPRING.damping * vw) * h;
        w += vw * h;
      }
      if (Math.abs(ty - y) < 0.05 && Math.abs(vy) < 0.5 && Math.abs(tw - w) < 0.05 && Math.abs(vw) < 0.5) {
        y = ty;
        w = tw;
        vy = vw = 0;
      }
      draw();
      if (y !== ty || w !== tw) raf = requestAnimationFrame(frame);
      else last = 0;
    };

    const point = (link: HTMLElement) => {
      window.clearTimeout(hideTimer);
      current = link;
      const label = link.getAttribute("aria-label") ?? "";
      if (text.textContent !== label) {
        text.textContent = label;
        // Replays the short fade on the incoming word.
        text.classList.remove("is-new");
        void text.offsetWidth;
        if (shown) text.classList.add("is-new");
      }
      const nr = nav.getBoundingClientRect();
      const lr = link.getBoundingClientRect();
      ty = lr.top - nr.top + lr.height / 2;
      tw = text.offsetWidth;
      if (!shown || reduced) {
        // Appears in place; only moves between icons once it is showing.
        cancelAnimationFrame(raf);
        raf = 0;
        last = 0;
        y = ty;
        w = tw;
        vy = vw = 0;
        draw();
      } else if (!raf) {
        raf = requestAnimationFrame(frame);
      }
      shown = true;
      surf.classList.add("is-shown");
    };

    const hide = () => {
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => {
        shown = false;
        current = null;
        surf.classList.remove("is-shown");
      }, LINGER);
    };

    const linkOf = (e: Event) =>
      e.target instanceof Element ? e.target.closest<HTMLElement>(".hero-dock-link") : null;

    const onOver = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const link = linkOf(e);
      if (link) point(link);
    };
    const onFocus = (e: FocusEvent) => {
      const link = linkOf(e);
      if (link?.matches(":focus-visible")) point(link);
    };

    // The music button's label flips when pressed; follow it.
    const mo = new MutationObserver(() => {
      if (shown && current) point(current);
    });
    mo.observe(nav, { attributes: true, attributeFilter: ["aria-label"], subtree: true });

    nav.addEventListener("pointerover", onOver);
    nav.addEventListener("pointerleave", hide);
    nav.addEventListener("focusin", onFocus);
    nav.addEventListener("focusout", hide);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(hideTimer);
      mo.disconnect();
      nav.removeEventListener("pointerover", onOver);
      nav.removeEventListener("pointerleave", hide);
      nav.removeEventListener("focusin", onFocus);
      nav.removeEventListener("focusout", hide);
    };
  }, [dock]);

  return (
    <span ref={surfRef} className="dock-tip" aria-hidden="true">
      <span ref={textRef} className="dock-tip-text" />
    </span>
  );
};

export default DockTip;
