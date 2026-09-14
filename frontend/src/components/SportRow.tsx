import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { sports, type Sport } from "../data/sports";

/**
 * Sports followed — four cards, each opening a detail modal.
 *
 * Unlike the other rows these are not grouped by year: the set barely
 * changes, so a year tab would be noise.
 */
const SportRow = () => {
  const [open, setOpen] = useState<Sport | null>(null);
  const [closing, setClosing] = useState(false);

  // Keep the modal mounted while it animates out — 320ms, matching the exit
  // animation the project modal uses.
  const dismiss = () => {
    setClosing(true);
    window.setTimeout(() => {
      setOpen(null);
      setClosing(false);
    }, 320);
  };

  // Lock the page behind the modal, and let Escape close it.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="fun-row fun-row--sport">
      <div className="fun-row-head">
        {/* Every sport here is a favourite, so the star is always lit — there
            is no year axis to switch to. */}
        <span className="fun-pill is-active">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="fun-pill-star">
            <path
              d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.4-5.8-3-5.8 3 1.1-6.4L2.6 9.4l6.5-.9z"
              fill="currentColor"
            />
          </svg>
          Sport
          <span className="fun-pill-count">{sports.length}</span>
        </span>
      </div>

      <div className="sport-cards">
        {sports.map((s) => (
          <button
            key={s.id}
            type="button"
            className="sport-card"
            onClick={() => setOpen(s)}
          >
            <span className="sport-card-art">
              {s.image ? (
                <img src={s.image} alt="" loading="lazy" />
              ) : (
                <span className="sport-card-mark" aria-hidden="true">
                  {s.label.charAt(0)}
                </span>
              )}
            </span>
            <span className="sport-card-label">{s.label}</span>
            <span className="sport-card-fav">{s.favourite}</span>
          </button>
        ))}
      </div>

      {open
        ? createPortal(
            // Shares the project modal's chrome so the two read as one
            // pattern. ScrollSmoother transforms #smooth-content, which would
            // otherwise be the containing block for position:fixed.
            <div
              className={`pm-overlay${closing ? " pm-overlay--closing" : ""}`}
              role="dialog"
              aria-modal="true"
              aria-label={open.label}
            >
              <div className="pm-scrim" onClick={dismiss} />

              <div className="pm-panel">
                <header className="pm-bar">
                  <span className="pm-crumb">
                    <button type="button" onClick={dismiss} className="pm-crumb-link">
                      Sport
                    </button>
                    <span aria-hidden="true"> › </span>
                    <span className="pm-crumb-current">{open.label}</span>
                  </span>

                  <span className="pm-bar-actions">
                    <button
                      type="button"
                      onClick={dismiss}
                      aria-label="Close"
                      title="Close"
                      className="pm-icon-btn"
                    >
                      <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <path d="M4 4l10 10M14 4L4 14" strokeLinecap="round" />
                      </svg>
                    </button>
                  </span>
                </header>

                <div className="pm-scroll">
                  <div className="pm-content">
                    <h1 className="pm-title">{open.label}</h1>

                    {open.facts?.length ? (
                      <dl className="pm-meta">
                        {open.facts.map((f) => (
                          <div key={f.label}>
                            <dt>{f.label}</dt>
                            <dd>{f.value}</dd>
                          </div>
                        ))}
                      </dl>
                    ) : null}

                    {open.image ? (
                      <div className="pm-hero">
                        <img src={open.image} alt={open.label} />
                      </div>
                    ) : null}

                    {open.blurb ? <p className="pm-lede">{open.blurb}</p> : null}

                    {open.body?.map((p, i) => (
                      <section key={i} className="pm-section">
                        <p>{p}</p>
                      </section>
                    ))}
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
};

export default SportRow;
