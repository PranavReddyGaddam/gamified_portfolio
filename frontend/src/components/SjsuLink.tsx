import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { scrollLock } from "../lib/scrollLock";
import { sjsuPhotos } from "../data/sjsu";

/** Frames shown while there are no photos yet, so the player has something to play. */
const PLACEHOLDER_COUNT = 8;
/** How long each photo holds: quick enough to read as a timelapse. */
const FRAME_MS = 240;
const GUTTER = 16;
const MAX_WIDTH = 560;
/**
 * Frame height over width: wide on desktop, tall on phones, where a wide
 * frame would be a thin strip. The breakpoint matches the CSS.
 */
const WIDE = 10 / 16;
const TALL = 5 / 4;
const PHONE = "(max-width: 640px)";
/** The white edge around the frame, for fitting the bubble on screen. */
const BAR_HEIGHT = 12;

type Place = {
  left: number;
  width: number;
  /** Distance from the viewport edge the bubble grows away from. */
  top?: number;
  bottom?: number;
  /** Arrow and transform-origin, in px from the bubble's left edge. */
  anchor: number;
  above: boolean;
};

/**
 * "San Jose State University" in the About paragraph.
 *
 * Hovering shows a small hint; clicking opens a preview bubble over the link,
 * modelled on iOS link previews: the page softens behind it and the bubble
 * grows out of the link itself. Inside, photos from the two years play back
 * one after another, oldest first, like a timelapse.
 */
const SjsuLink = () => {
  const linkRef = useRef<HTMLButtonElement | null>(null);
  const [place, setPlace] = useState<Place | null>(null);
  const [closing, setClosing] = useState(false);
  const [frame, setFrame] = useState(0);
  // Hovering the photo (or holding it on touch) stops on the current frame
  // and raises its caption.
  const [paused, setPaused] = useState(false);

  const open = () => {
    const el = linkRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    // The bubble's height is the frame's plus its edge.
    const spaceAbove = r.top - 12 - GUTTER;
    const spaceBelow = vh - r.bottom - 12 - GUTTER;
    const aspect = window.matchMedia(PHONE).matches ? TALL : WIDE;
    let width = Math.min(MAX_WIDTH, vw - GUTTER * 2);
    // Prefer above, like iOS; otherwise whichever side has room, shrinking
    // the bubble when neither does.
    const above =
      spaceAbove >= width * aspect + BAR_HEIGHT || spaceAbove >= spaceBelow;
    width = Math.max(
      240,
      Math.min(width, ((above ? spaceAbove : spaceBelow) - BAR_HEIGHT) / aspect)
    );
    const center = r.left + r.width / 2;
    const left = Math.min(Math.max(center - width / 2, GUTTER), vw - GUTTER - width);
    setPlace({
      left,
      width,
      anchor: Math.min(Math.max(center - left, 24), width - 24),
      above,
      ...(above ? { bottom: vh - r.top + 12 } : { top: r.bottom + 12 }),
    });
    setFrame(0);
    setPaused(false);
  };

  const close = useCallback(() => {
    setClosing(true);
    window.setTimeout(() => {
      setPlace(null);
      setClosing(false);
      linkRef.current?.focus();
    }, 220);
  }, []);

  useEffect(() => {
    if (!place) return;
    scrollLock.acquire();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const onResize = () => close();
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      scrollLock.release();
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
    // Only on open/close; `place` changing identity mid-open never happens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [place === null, close]);

  const frames = sjsuPhotos.length
    ? sjsuPhotos
    : Array.from({ length: PLACEHOLDER_COUNT }, () => null);
  const count = frames.length;

  // Advance while open, looping back to the first photo after the last.
  useEffect(() => {
    if (!place || closing || paused) return;
    const id = window.setInterval(() => setFrame((f) => (f + 1) % count), FRAME_MS);
    return () => window.clearInterval(id);
  }, [place, closing, paused, count]);

  const current = frames[frame];
  const hasCaption = Boolean(current?.caption || current?.date);

  return (
    <>
      <button
        ref={linkRef}
        type="button"
        className="sjsu-link"
        aria-haspopup="dialog"
        aria-expanded={Boolean(place)}
        onClick={open}
      >
        San Jose State University
        <span className="sjsu-hint" aria-hidden="true">
          <span className="sjsu-hint-icon">
            <svg viewBox="0 0 12 12" fill="currentColor">
              <path d="M3.5 2.2v7.6a.5.5 0 0 0 .77.42l5.9-3.8a.5.5 0 0 0 0-.84l-5.9-3.8a.5.5 0 0 0-.77.42Z" />
            </svg>
          </span>
          <span className="sjsu-hint-text">
            <strong>Click me</strong> for a timelapse
          </span>
        </span>
      </button>

      {place
        ? createPortal(
            <div
              className={`sjsu-preview${closing ? " is-closing" : ""}`}
              role="dialog"
              aria-modal="true"
              aria-label="San Jose State University photos"
            >
              <div className="sjsu-scrim" onClick={close} />
              <div
                className={`sjsu-bubble ${place.above ? "is-above" : "is-below"}`}
                style={{
                  left: place.left,
                  width: place.width,
                  top: place.top,
                  bottom: place.bottom,
                  transformOrigin: `${place.anchor}px ${place.above ? "100%" : "0%"}`,
                  ["--anchor" as string]: `${place.anchor}px`,
                }}
              >
                <div
                  className="sjsu-frame"
                  onPointerEnter={(e) => {
                    if (e.pointerType === "mouse") setPaused(true);
                  }}
                  onPointerLeave={(e) => {
                    if (e.pointerType === "mouse") setPaused(false);
                  }}
                  onPointerDown={(e) => {
                    if (e.pointerType !== "mouse") setPaused(true);
                  }}
                  onPointerUp={(e) => {
                    if (e.pointerType !== "mouse") setPaused(false);
                  }}
                  onPointerCancel={() => setPaused(false)}
                  // Holding a photo on iOS would otherwise open the image menu.
                  onContextMenu={(e) => e.preventDefault()}
                >
                  {frames.map((photo, i) => (
                    <div
                      key={i}
                      className={`sjsu-shot${photo ? "" : " is-empty"}${
                        i === frame ? " is-on" : ""
                      }`}
                      aria-hidden={i !== frame}
                    >
                      {photo ? (
                        <img
                          src={photo.src}
                          alt={photo.caption ?? ""}
                          style={photo.focus ? { objectPosition: photo.focus } : undefined}
                        />
                      ) : null}
                    </div>
                  ))}

                  {hasCaption ? (
                    <div
                      className={`sjsu-caption${paused ? " is-shown" : ""}`}
                      aria-hidden={!paused}
                    >
                      <span className="sjsu-caption-text">{current?.caption}</span>
                      {current?.date ? (
                        <span className="sjsu-caption-date">{current.date}</span>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
};

export default SjsuLink;
