import { useGroups } from "../data/uses";

/**
 * What I use — hardware and software, as a plain two-column list.
 *
 * The other rows show artwork, so they earn tiles. This one is names and
 * glyphs: a cover grid of laptops and browsers would be a lot of chrome
 * around very little, so it stays a list and lets the column do the work.
 */
const UsesRow = () => (
  <div className="fun-row fun-row--uses">
    <div className="fun-row-head">
      {/* Everything listed is in daily use, so the star is always lit — as in
          the sport row, there is no other tab to switch to. */}
      <span className="fun-pill is-active">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="fun-pill-star">
          <path
            d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.4-5.8-3-5.8 3 1.1-6.4L2.6 9.4l6.5-.9z"
            fill="currentColor"
          />
        </svg>
        Uses
      </span>
    </div>

    <div className="uses-groups">
      {useGroups.map((group) => (
        <section key={group.label} className="uses-group">
          <h3 className="uses-group-label">{group.label}</h3>
          <ul className="uses-list">
            {group.items.map(({ name, icon: Icon }) => (
              <li key={name} className="uses-item">
                <Icon className="uses-item-icon" aria-hidden="true" />
                {name}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  </div>
);

export default UsesRow;
