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

          {/* The card image is a thumbnail, not a lead: repeating it here
              would only push the writing down the panel. Photographs inside
              the piece come from the body blocks instead. */}
          {open.blurb ? <p className="pm-lede">{open.blurb}</p> : null}

          {open.body?.map((block, i) =>
            block.kind === "text" ? (
              <p key={i} className="pm-para">
                {block.text}
              </p>
            ) : (
              <figure
                key={i}
                className={`sp-figure${
                  block.images.length > 1 ? " sp-figure--pair" : ""
                }`}
              >
                <span className="sp-figure-frames">
                  {block.images.map((img) => (
                    <span
                      key={img.src}
                      className={`sp-frame${
                        block.focus === "top" ? " sp-frame--top" : ""
                      }`}
                    >
                      <img src={img.src} alt={img.alt} loading="lazy" />
                    </span>
                  ))}
                </span>

                {block.caption || block.credit ? (
                  <figcaption>
                    {block.caption}
                    {block.credit ? (
                      <>
                        {" "}
                        <a
                          href={block.credit.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {block.credit.name}, {block.credit.licence}
                        </a>
                      </>
                    ) : null}
                  </figcaption>
                ) : null}
              </figure>
            )
          )}
        </DetailModal>
      ) : null}
    </div>
  );
};

export default SportRow;
