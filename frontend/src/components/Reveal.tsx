import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Props = {
  children: ReactNode;
  /** Stagger between direct children; omit to reveal the block as one piece. */
  stagger?: number;
  /** Delay before the tween starts, in seconds. */
  delay?: number;
  /** Distance travelled, in px. */
  y?: number;
  className?: string;
};

/**
 * Reveals its content as it scrolls into view.
 *
 * ScrollSmoother drives the scroll position, so this uses ScrollTrigger rather
 * than an IntersectionObserver — the two share a ticker and stay in sync.
 * Respects prefers-reduced-motion by rendering the content already in place.
 */
const Reveal = ({ children, stagger, delay = 0, y = 24, className }: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(node, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const targets =
        stagger != null ? Array.from(node.children) : ([node] as Element[]);

      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay,
          ease: "power2.out",
          stagger: stagger ?? 0,
          scrollTrigger: {
            trigger: node,
            start: "top 88%",
            once: true,
          },
        }
      );
    }, ref);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [stagger, delay, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default Reveal;
