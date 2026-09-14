import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

type Props = {
  /** Breadcrumb root — "Sport", "Places". */
  crumb: string;
  title: string;
  /** True while the exit animation plays, before unmounting. */
  closing?: boolean;
  onClose: () => void;
  /** Optional control in the bar, left of the close button. */
  action?: ReactNode;
  /**
   * Extra class on the content wrapper. Prose wants the default 720px
   * measure; a long list wants the full panel width.
   */
  contentClass?: string;
  children: ReactNode;
};

/**
 * Shared detail modal, wearing the project modal's chrome so every dialog on
 * the page reads as one pattern.
 *
 * Portalled to the body: ScrollSmoother puts a transform on #smooth-content,
 * which would otherwise be the containing block for position:fixed.
 */
const DetailModal = ({
  crumb,
  title,
  closing = false,
  onClose,
  action,
  contentClass = "",
  children,
}: Props) => {
  // Lock the page behind the modal, and let Escape close it.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return createPortal(
    <div
      className={`pm-overlay${closing ? " pm-overlay--closing" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="pm-scrim" onClick={onClose} />

      <div className="pm-panel">
        <header className="pm-bar">
          <span className="pm-crumb">
            <button type="button" onClick={onClose} className="pm-crumb-link">
              {crumb}
            </button>
            <span aria-hidden="true"> › </span>
            <span className="pm-crumb-current">{title}</span>
          </span>

          <span className="pm-bar-actions">
            {action}
            <button
              type="button"
              onClick={onClose}
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
          <div className={`pm-content ${contentClass}`}>{children}</div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DetailModal;
