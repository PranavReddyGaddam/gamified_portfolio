import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollLock } from "./scrollLock";

/**
 * Keeps the reader where they were across a refresh.
 *
 * The browser's own scroll restoration cannot be trusted here. ScrollSmoother
 * gives the body its height only once it has measured the content, and iOS
 * Safari restores the position before that, against a page with no height,
 * so it lands at the top. A refresh with a modal open is lost everywhere:
 * the scroll lock pins the page at the top behind the panel, so that is the
 * position the browser remembers. The position is therefore saved and put
 * back by hand.
 */

const KEY = "scroll-memory:y";

const save = () => {
  try {
    sessionStorage.setItem(KEY, String(Math.round(scrollLock.position())));
  } catch {
    // Storage blocked (private mode on some browsers): nothing to remember.
  }
};

const read = (): number | null => {
  try {
    const raw = sessionStorage.getItem(KEY);
    const y = raw === null ? NaN : Number(raw);
    return Number.isFinite(y) && y > 0 ? y : null;
  } catch {
    return null;
  }
};

/** Only a refresh or a back/forward return should land mid-page. */
const isReturn = () => {
  const nav = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  return nav?.type === "reload" || nav?.type === "back_forward";
};

/**
 * Starts saving the position and, on a return visit, restores it. Call once
 * the smoother exists; returns a cleanup.
 */
export const startScrollMemory = (): (() => void) => {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  // pagehide is the one iOS fires reliably on a refresh; visibilitychange
  // covers a tab being backgrounded and then discarded.
  const onHide = () => save();
  const onVisibility = () => {
    if (document.visibilityState === "hidden") save();
  };
  window.addEventListener("pagehide", onHide);
  document.addEventListener("visibilitychange", onVisibility);

  const target = isReturn() ? read() : null;
  let stop = () => {};

  if (target !== null) {
    // The page keeps growing for a moment as fonts and images arrive, and a
    // position below the current end gets clamped short. So the restore is
    // re-applied on each re-measure until it holds, the reader takes over,
    // or a couple of seconds pass.
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      ScrollTrigger.removeEventListener("refresh", apply);
      window.removeEventListener("load", apply);
      ["wheel", "touchstart", "keydown", "pointerdown"].forEach((t) =>
        window.removeEventListener(t, finish)
      );
      window.clearTimeout(timer);
      ro?.disconnect();
    };
    function apply() {
      if (done) return;
      scrollLock.restoreTo(target as number);
    }
    ["wheel", "touchstart", "keydown", "pointerdown"].forEach((t) =>
      window.addEventListener(t, finish, { passive: true })
    );
    ScrollTrigger.addEventListener("refresh", apply);
    // Content that changes size without a ScrollTrigger refresh still moves
    // what sits under the restored position.
    const content = document.getElementById("smooth-content");
    const ro = content ? new ResizeObserver(() => apply()) : null;
    if (content && ro) ro.observe(content);
    window.addEventListener("load", apply);
    const timer = window.setTimeout(finish, 2500);
    // Once now, and again after the first layout pass settles.
    apply();
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      apply();
    });
    stop = finish;
  }

  return () => {
    stop();
    window.removeEventListener("pagehide", onHide);
    document.removeEventListener("visibilitychange", onVisibility);
  };
};
