import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Pins each section as it reaches the top of the viewport, so the next one
 * scrolls up over it and the page reads as a stack of cards.
 *
 * Sections need ascending z-index for the covering to work, which is applied
 * here rather than in the markup so the order stays in one place. The last
 * section is left unpinned: there is nothing after it to do the covering, and
 * pinning it would just add dead scroll at the foot of the page.
 */
const useStickySections = (selector = "[data-sticky-section]") => {
  useLayoutEffect(() => {
    // Pinning fights a small viewport, and the effect is mostly lost there.
    const mm = gsap.matchMedia();

    mm.add("(min-width: 900px)", () => {
      const sections = gsap.utils.toArray<HTMLElement>(selector);
      if (sections.length < 2) return;

      sections.forEach((section, i) => {
        section.style.zIndex = String(10 + i);

        // The final section has nothing to cover it, so it scrolls normally.
        if (i === sections.length - 1) return;

        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          endTrigger: sections[sections.length - 1],
          end: "top top",
          pin: true,
          pinSpacing: false,
        });
      });

      ScrollTrigger.refresh();
    });

    return () => mm.revert();
  }, [selector]);
};

export default useStickySections;
