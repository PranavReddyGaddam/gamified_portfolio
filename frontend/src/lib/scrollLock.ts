import type ScrollSmoother from "gsap/ScrollSmoother";

/**
 * Freezes the page behind an open modal.
 *
 * `body { overflow: hidden }` is the usual way to do this and does nothing
 * here: ScrollSmoother never scrolls the body, it translates #smooth-content
 * inside a fixed wrapper. The page therefore kept scrolling under open
 * modals, and on touch the gesture would move the page rather than the
 * panel. Pausing the smoother is what actually stops it.
 *
 * Locks are counted, so nested or overlapping modals cannot unlock the page
 * while one of them is still open.
 */

let smoother: ScrollSmoother | null = null;
let depth = 0;
/** Scroll position at the moment of the first lock, restored on release. */
let savedY = 0;

const apply = () => {
  const locked = depth > 0;

  // Touch scrolling on iOS ignores a paused smoother, so the wrapper is
  // pinned as well: with the body fixed there is no page left to scroll.
  document.documentElement.classList.toggle("is-scroll-locked", locked);

  if (!smoother) return;
  smoother.paused(locked);
};

export const scrollLock = {
  /** Called by App as the smoother is created and destroyed. */
  register(instance: ScrollSmoother | null) {
    smoother = instance;
    apply();
  },

  acquire() {
    if (depth === 0) {
      savedY = smoother ? smoother.scrollTop() : window.scrollY;
    }
    depth += 1;
    apply();
  },

  release() {
    depth = Math.max(0, depth - 1);
    apply();
    // Pinning the wrapper drops the page to the top, so put it back.
    if (depth === 0 && smoother) smoother.scrollTop(savedY);
  },
};
