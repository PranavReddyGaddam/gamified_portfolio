import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { scrollLock } from "../lib/scrollLock";
import {
  LuHouse,
  LuUser,
  LuBriefcase,
  LuFileText,
  LuPopcorn,
} from "react-icons/lu";
import type { IconType } from "react-icons";

export type NavItem = {
  label: string;
  target: string;
  /** True for links that leave the page rather than scrolling to a section. */
  external?: boolean;
};

type Props = {
  items: NavItem[];
  onNavigate: (target: string) => void;
  /**
   * Shown only in the mobile menu. On desktop these live outside the dock
   * (Resume has its own corner), but the burger is the only nav on phones,
   * so they have to appear there or become unreachable.
   */
  extraItems?: NavItem[];
};

/** Icon per nav label. Falls back to the document glyph for anything unmapped. */
const ICONS: Record<string, IconType> = {
  Home: LuHouse,
  About: LuUser,
  Work: LuBriefcase,
  Fun: LuPopcorn,
  Resume: LuFileText,
};

/**
 * Hero navigation: a glass dock pinned to the right edge on desktop, a
 * hamburger opening a full-screen menu on phones.
 */
const HeroNav = ({ items, onNavigate, extraItems = [] }: Props) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(items[0]?.target ?? "");
  const menuRef = useRef<HTMLDivElement | null>(null);
  const dockRef = useRef<HTMLElement | null>(null);

  // Freeze the page behind the menu, and let Escape close it.
  useEffect(() => {
    if (!open) return;
    scrollLock.acquire();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      scrollLock.release();
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Light up whichever section is crossing the middle of the viewport. Uses a
  // scroll listener rather than IntersectionObserver: ScrollSmoother moves the
  // page with a transform, so observer roots do not fire where you expect.
  useEffect(() => {
    const sections = items
      .filter((i) => !i.external)
      .map((i) => ({ target: i.target, el: document.querySelector(i.target) }))
      .filter((s): s is { target: string; el: Element } => Boolean(s.el));
    if (!sections.length) return;

    const update = () => {
      const line = window.innerHeight * 0.4;
      let current = sections[0].target;
      for (const s of sections) {
        if (s.el.getBoundingClientRect().top <= line) current = s.target;
      }
      setActive(current);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items]);

  // The dock drifts in from the right edge once the hero has settled.
  useLayoutEffect(() => {
    if (!dockRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(dockRef.current, {
        opacity: 0,
        x: 24,
        duration: 0.8,
        delay: 0.4,
        ease: "power3.out",
      });
    }, dockRef);
    return () => ctx.revert();
  }, []);

  // The panel fades while each link slides in from the right, staggered —
  // matching the reference menu's entrance.
  useLayoutEffect(() => {
    if (!open || !menuRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        menuRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.28, ease: "power2.out" }
      );
      gsap.fromTo(
        ".hero-menu-link",
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          stagger: 0.06,
          ease: "power3.out",
        }
      );
    }, menuRef);
    return () => ctx.revert();
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
      <nav ref={dockRef} className="hero-dock" aria-label="Sections">
        {items.map((item) => {
          const Icon = ICONS[item.label] ?? LuFileText;
          const isActive = !item.external && item.target === active;
          return (
            <a
              key={item.label}
              href={item.target}
              aria-label={item.label}
              aria-current={isActive ? "true" : undefined}
              {...(item.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {
                    onClick: (e: React.MouseEvent) => {
                      e.preventDefault();
                      onNavigate(item.target);
                    },
                  })}
              className={`hero-dock-link${isActive ? " is-active" : ""}`}
            >
              <Icon aria-hidden="true" />
              <span className="hero-dock-tip">{item.label}</span>
            </a>
          );
        })}
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
            <div
              ref={menuRef}
              className="hero-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
            >
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
                {[...items, ...extraItems].map((item) => (
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
