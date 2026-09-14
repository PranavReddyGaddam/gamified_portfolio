import { Fragment, useState } from "react";
import { funRows, type FunItem, type FunRow, type FunYear } from "../data/fun";
import DetailModal from "./DetailModal";
import Reveal from "./Reveal";
import TrackListModal from "./TrackListModal";
import SportRow from "./SportRow";

/** Sentinel for the starred tab, which is not a year. */
const FAVES = "__faves";

/** One category: favourites tab, year tabs, source link, then the covers. */
const Row = ({ row }: { row: FunRow }) => {
  const hasFaves = Boolean(row.favourites?.length);
  const [active, setActive] = useState(
    hasFaves ? FAVES : (row.years[0]?.year ?? "")
  );

  const showingFaves = active === FAVES && hasFaves;
  const year = row.years.find((y) => y.year === active);
  const items = showingFaves ? row.favourites! : (year?.items ?? []);

  // Kept mounted through the 320ms exit animation, as the project modal is.
  const [open, setOpen] = useState<FunItem | null>(null);
  const [seeAll, setSeeAll] = useState<FunYear | null>(null);
  const [closing, setClosing] = useState(false);
  const dismiss = () => {
    setClosing(true);
    window.setTimeout(() => {
      setOpen(null);
      setSeeAll(null);
      setClosing(false);
    }, 320);
  };

  return (
    <div className={`fun-row fun-row--${row.id}`}>
      <div className="fun-row-head">
        {/* The starred tab holds all-time favourites — it is the first option
            rather than a label, which is what the star is for. */}
        <button
          type="button"
          onClick={() => hasFaves && setActive(FAVES)}
          disabled={!hasFaves}
          className={`fun-pill${showingFaves ? " is-active" : ""}`}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="fun-pill-star">
            <path
              d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.4-5.8-3-5.8 3 1.1-6.4L2.6 9.4l6.5-.9z"
              fill="currentColor"
            />
          </svg>
          {row.label}
          {hasFaves ? (
            <span className="fun-pill-count">{row.favourites!.length}</span>
          ) : null}
        </button>

        <div className="fun-years">
          {row.years.map((y) => (
            <button
              key={y.year}
              type="button"
              onClick={() => setActive(y.year)}
              className={`fun-year${y.year === active ? " is-active" : ""}`}
            >
              {y.year}
            </button>
          ))}
        </div>

        {/* The full list lives in a modal rather than sending people straight
            out to Apple Music. */}
        {!showingFaves && year?.total ? (
          <button type="button" className="fun-source" onClick={() => setSeeAll(year)}>
            See all {year.total}
          </button>
        ) : null}
      </div>

      <div className="fun-covers">
        {items.map((item) => (
          <Cover key={item.id} item={item} onOpen={setOpen} />
        ))}
      </div>

      {seeAll ? (
        <TrackListModal
          year={seeAll.year}
          crumb={row.label}
          source={
            seeAll.href && row.source
              ? { label: row.source.label, href: seeAll.href }
              : row.source
          }
          closing={closing}
          onClose={dismiss}
        />
      ) : null}

      {open ? (
        <DetailModal
          crumb={row.label}
          title={open.title}
          closing={closing}
          onClose={dismiss}
        >
          <h1 className="pm-title">{open.title}</h1>

          <dl className="pm-meta">
            <div>
              <dt>Where</dt>
              <dd>{open.by}</dd>
            </div>
            {open.tag ? (
              <div>
                <dt>When</dt>
                <dd>{open.tag}</dd>
              </div>
            ) : null}
            {open.detail?.facts?.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>

          {open.detail?.body?.map((p, i) => (
            <p key={i} className={i === 0 ? "pm-lede" : "pm-para"}>
              {p}
            </p>
          ))}

          {open.detail?.photos?.length ? (
            <div className="trip-photos">
              {open.detail.photos.map((src) => (
                <img key={src} src={src} alt={open.title} loading="lazy" />
              ))}
            </div>
          ) : (
            <p className="trip-empty">Photos to come.</p>
          )}
        </DetailModal>
      ) : null}
    </div>
  );
};

const Cover = ({
  item,
  onOpen,
}: {
  item: FunItem;
  onOpen?: (item: FunItem) => void;
}) => {
  const Tag = item.detail ? "button" : item.href ? "a" : "div";
  return (
    <Tag
      className={`fun-cover${item.placeholder ? " is-placeholder" : ""}`}
      {...(item.detail
        ? { type: "button" as const, onClick: () => onOpen?.(item) }
        : item.href
          ? { href: item.href, target: "_blank", rel: "noopener noreferrer" }
          : {})}
    >
      <span className="fun-cover-art">
        {item.image ? (
          <img src={item.image} alt={item.title} loading="lazy" />
        ) : (
          <span className="fun-cover-initial" aria-hidden="true">
            {item.title.replace(/[[\]]/g, "").charAt(0)}
          </span>
        )}

        {item.tag ? <span className="fun-cover-tag">{item.tag}</span> : null}
      </span>
      <span className="fun-cover-title">{item.title}</span>
      <span className="fun-cover-by">{item.by}</span>
    </Tag>
  );
};

/**
 * Things heard, watched and visited — one row per category.
 *
 * Sport is its own component: it has no year axis and its cards open a
 * modal rather than linking out.
 */
const FunWall = () => (
  <Reveal stagger={0.1} className="fun-rows">
    {funRows.map((row) => (
      <Fragment key={row.id}>
        <Row row={row} />
        {/* Sport sits between Screen and Places. */}
        {row.id === "screen" ? <SportRow /> : null}
      </Fragment>
    ))}
  </Reveal>
);

export default FunWall;
