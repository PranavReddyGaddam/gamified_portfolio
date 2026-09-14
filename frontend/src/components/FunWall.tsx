import { Fragment, useState } from "react";
import { funRows, type FunItem, type FunRow } from "../data/fun";
import Reveal from "./Reveal";
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
              <span className="fun-year-count">{y.total ?? y.items.length}</span>
            </button>
          ))}
        </div>

        {/* Follows the selected year where the data has a per-year link. */}
        {row.source || year?.href ? (
          <a
            className="fun-source"
            href={year?.href ?? row.source?.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {row.source?.label ?? "Open"} <span aria-hidden="true">↗</span>
          </a>
        ) : null}
      </div>

      <div className="fun-covers">
        {items.map((item) => (
          <Cover key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

const Cover = ({ item }: { item: FunItem }) => {
  const Tag = item.href ? "a" : "div";
  return (
    <Tag
      className={`fun-cover${item.placeholder ? " is-placeholder" : ""}`}
      {...(item.href
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
