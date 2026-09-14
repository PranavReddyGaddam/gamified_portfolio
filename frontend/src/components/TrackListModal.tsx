import { useEffect, useState } from "react";
import DetailModal from "./DetailModal";

type Track = { t: string; a: string; i: string | null };
type Payload = { prefix: string; years: Record<string, Track[]> };

type Props = {
  year: string;
  /** Row label, used as the modal's breadcrumb root. */
  crumb: string;
  /** Where the full list lives, shown top right. */
  source?: { label: string; href: string };
  closing?: boolean;
  onClose: () => void;
};

/** Cached across opens — the file is the same for every year. */
let cache: Payload | null = null;

/**
 * The full ranked list for one year.
 *
 * Held in /replay.json rather than the bundle: ~500 tracks is 74KB that most
 * visitors never open, so it is fetched the first time the modal is shown.
 */
const TrackListModal = ({ year, crumb, source, closing, onClose }: Props) => {
  const [data, setData] = useState<Payload | null>(cache);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (cache) return;
    let gone = false;
    fetch("/replay.json")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((p: Payload) => {
        cache = p;
        if (!gone) setData(p);
      })
      .catch(() => !gone && setFailed(true));
    return () => {
      gone = true;
    };
  }, []);

  const tracks = data?.years[year] ?? [];

  return (
    <DetailModal
      crumb={crumb}
      title={year}
      closing={closing}
      onClose={onClose}
      contentClass="pm-content--wide"
      action={
        source ? (
          <a
            href={source.href}
            target="_blank"
            rel="noopener noreferrer"
            className="pm-bar-link"
          >
            {source.label} ↗
          </a>
        ) : null
      }
    >
      <header className="tl-head">
        <h1 className="tl-year">{year}</h1>
        <p className="tl-sub">
          {tracks.length ? `${tracks.length} songs · ` : ""}most played first
        </p>
      </header>

      {failed ? (
        <p className="trip-empty">That list could not be loaded just now.</p>
      ) : !data ? (
        <p className="trip-empty">Loading…</p>
      ) : (
        <ol className="tl-list">
          {tracks.map((t, i) => (
            <li key={`${t.t}-${i}`} className={`tl-row${i < 3 ? " is-top" : ""}`}>
              <span className="tl-rank">{i + 1}</span>
              <span className="tl-art">
                {t.i ? (
                  <img src={data.prefix + t.i} alt="" loading="lazy" />
                ) : null}
              </span>
              <span className="tl-text">
                <span className="tl-title">{t.t}</span>
                <span className="tl-by">{t.a}</span>
              </span>
            </li>
          ))}
        </ol>
      )}
    </DetailModal>
  );
};

export default TrackListModal;
