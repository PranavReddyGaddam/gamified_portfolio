import { useState } from "react";
import { sports, type Sport } from "../data/sports";
import DetailModal from "./DetailModal";

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

      {open ? (
        <DetailModal
          crumb="Sport"
          title={open.label}
          closing={closing}
          onClose={dismiss}
        >
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
            <p key={i} className="pm-para">
              {p}
            </p>
          ))}

          {open.photos?.length ? (
            <div className="sp-photos">
              {open.photos.map((ph) => (
                <figure key={ph.src} className="sp-photo">
                  <img src={ph.src} alt={ph.caption} loading="lazy" />
                  <figcaption>
                    {ph.caption}{" "}
                    <a href={ph.href} target="_blank" rel="noopener noreferrer">
                      {ph.credit}, {ph.licence}
                    </a>
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : null}
        </DetailModal>
      ) : null}
    </div>
  );
};

export default SportRow;
