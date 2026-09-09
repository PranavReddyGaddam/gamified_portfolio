import { useEffect, useRef, useState } from "react";

/**
 * TimeMachine — a CSS 3D police box that links to the frozen v1 portfolio.
 *
 * Built with transform-style: preserve-3d rather than a WebGL model: the box is
 * four real panels in 3D space, so it costs a few KB instead of the ~600KB a
 * three.js + glTF pipeline would add to the bundle. The faceted look also sits
 * closer to the site's pixel-art styling than a photoreal model would.
 */

const PANELS = [
  { label: "front", transform: "rotateY(0deg) translateZ(29px)" },
  { label: "right", transform: "rotateY(90deg) translateZ(29px)" },
  { label: "back", transform: "rotateY(180deg) translateZ(29px)" },
  { label: "left", transform: "rotateY(-90deg) translateZ(29px)" },
];

const TimeMachine = () => {
  const [visible, setVisible] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Only start the animation once it scrolls into view, so the idle rotation
  // isn't burning frames while it sits offscreen at the bottom of the page.
  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "120px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="tm-root">
      <a
        href="/v1"
        className={`tm-link${visible ? " tm-visible" : ""}`}
        aria-label="Time machine: travel to portfolio v1 from 2025"
      >
        <div className="tm-stage">
          <div className="tm-box">
            {PANELS.map((panel) => (
              <div
                key={panel.label}
                className={`tm-panel tm-panel-${panel.label}`}
                style={{ transform: panel.transform }}
              >
                <div className="tm-sign">POLICE</div>
                <div className="tm-windows">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <div className="tm-door" />
              </div>
            ))}

            <div className="tm-roof" />
            <div className="tm-lamp" />
          </div>

          <div className="tm-shadow" />
        </div>

        <div className="tm-caption">
          <span className="tm-caption-main">◄ TIME MACHINE</span>
          <span className="tm-caption-sub">PORTFOLIO V1 &middot; 2025</span>
        </div>
      </a>
    </div>
  );
};

export default TimeMachine;
