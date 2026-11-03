import { useEffect, useRef, useState, type CSSProperties } from "react";

type Props = {
  /** Sport id, which picks the ball that rides the rule. */
  ball: string;
  open: boolean;
  onChange: (open: boolean) => void;
  /** Fired on first contact, so the photographs can start loading early. */
  onPrime?: () => void;
};

const SUFFIX = " in Pictures";

/**
 * A two-state slider for a sport write-up: the story on its own, or with
 * its photographs laid back in.
 *
 * A native range input does the work, transparent over a hairline rule, so
 * drag, click and keyboard all come for free; the ball is drawn underneath
 * and rolls as it moves. It follows the pointer while dragging and settles
 * at whichever end is nearer on release.
 */
const PhotoSlider = ({ ball, open, onChange, onPrime }: Props) => {
  const [pos, setPos] = useState(open ? 1 : 0);
  const [dragging, setDragging] = useState(false);
  const [track, setTrack] = useState(0);
  const ruleRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Where a press started, to tell a tap on the ball from a drag.
  const pressStart = useRef<number | null>(null);

  useEffect(() => {
    if (!dragging) setPos(open ? 1 : 0);
  }, [open, dragging]);

  // The roll is distance over circumference, so it needs the track length.
  useEffect(() => {
    const el = ruleRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setTrack(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const settle = (value: number) => {
    setDragging(false);
    const start = pressStart.current;
    pressStart.current = null;
    // Pressed and let go without travelling: a tap, which flips it.
    if (start !== null && Math.abs(value - start) < 0.02) {
      onChange(!open);
      return;
    }
    const next = value >= 0.5;
    setPos(next ? 1 : 0);
    if (next !== open) onChange(next);
  };

  const BALL = 18;
  const turn = (pos * Math.max(track - BALL, 0)) / (Math.PI * BALL) * 360;

  return (
    <div className="sp-slider">
      <p className="sp-slider-label" aria-hidden="true">
        The Story
        <span className={`sp-slider-suffix${open ? " is-open" : ""}`}>
          <span>
            {[...SUFFIX].map((ch, i) => (
              <span key={i} style={{ "--i": i } as CSSProperties}>
                {ch === " " ? " " : ch}
              </span>
            ))}
          </span>
        </span>
      </p>

      <div
        ref={ruleRef}
        className={`sp-slider-rule${dragging ? " is-dragging" : ""}`}
        style={{ "--pos": pos, "--turn": `${turn}deg` } as CSSProperties}
      >
        <input
          ref={inputRef}
          type="range"
          min={0}
          max={1}
          step="any"
          value={pos}
          aria-label="Photographs — drag right to show them in the story"
          aria-valuetext={open ? "Story with photographs" : "Story only"}
          onPointerDown={(e) => {
            onPrime?.();
            pressStart.current = Number(e.currentTarget.value);
            setDragging(true);
            // A drag can end anywhere on the page, so the release is heard
            // there, and attached now so even the quickest tap is caught.
            const end = () => {
              window.removeEventListener("pointerup", end);
              window.removeEventListener("pointercancel", end);
              settle(Number(inputRef.current?.value ?? 0));
            };
            window.addEventListener("pointerup", end);
            window.addEventListener("pointercancel", end);
          }}
          onFocus={onPrime}
          onChange={(e) => setPos(Number(e.target.value))}
          onKeyDown={(e) => {
            // Snap rather than step: there are only two places to be.
            const on = ["ArrowRight", "ArrowUp", "End", "PageUp"];
            const off = ["ArrowLeft", "ArrowDown", "Home", "PageDown"];
            if (on.includes(e.key)) onChange(true);
            else if (off.includes(e.key)) onChange(false);
            else if (e.key === "Enter" || e.key === " ") onChange(!open);
            else return;
            e.preventDefault();
          }}
        />
        <span className="sp-slider-pos" aria-hidden="true">
          <span className={`sp-ball sp-ball--${ball}`} />
        </span>
      </div>
    </div>
  );
};

export default PhotoSlider;
