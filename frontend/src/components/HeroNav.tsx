import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export type NavItem = {
  label: string;
  target: string;
  /** True for links that leave the page rather than scrolling to a section. */
  external?: boolean;
};

type Props = {
  items: NavItem[];
  onNavigate: (target: string) => void;
};

/**
 * Hero navigation: inline links on desktop, a hamburger opening a full-screen
 * menu on phones.
 */
const HeroNav = ({ items, onNavigate }: Props) => {
  const [open, setOpen] = useState(false);

  // Lock the page behind the menu, and let Escape close it.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const activate = (item: NavItem) => {
    setOpen(false);
    if (item.external) {
      window.open(item.target, "_blank", "noopener,noreferrer");
      return;
    }
    // Let the menu finish closing before the scroll starts.
    window.setTimeout(() => onNavigate(item.target), 180);
  };

  return (
    <>
      <nav className="hero-nav">
        {items.map((item, i) => (
          <a
            key={item.label}
            href={item.target}
            {...(item.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {
                  onClick: (e: React.MouseEvent) => {
                    e.preventDefault();
                    onNavigate(item.target);
                  },
                })}
            className={`hero-nav-link${i === 0 ? " is-active" : ""}`}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        className="hero-burger"
        onClick={() => setOpen(true)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {open
        ? createPortal(
            <div className="hero-menu" role="dialog" aria-modal="true" aria-label="Menu">
              <div className="hero-menu-bar">
                <span className="hero-menu-logo">Pranav Reddy Gaddam</span>
                <button
                  type="button"
                  aria-label="Close menu"
                  className="hero-burger hero-burger--close"
                  onClick={() => setOpen(false)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="hero-menu-links">
                {items.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => activate(item)}
                    className="hero-menu-link"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>,
            document.body
          )
        : null}
    </>
  );
};

export default HeroNav;
