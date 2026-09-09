import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import type { Project } from "../data/projects";

type Props = {
  project: Project;
  /** True on /project/:id/full — the panel fills the viewport. */
  isFull: boolean;
};

/**
 * Project detail modal.
 *
 * The panel is one element in both states: expanding to full screen animates
 * its width, height and corner radius rather than swapping in a second view,
 * so the transition is continuous and the scroll position survives it.
 */
const ProjectModal = ({ project, isFull }: Props) => {
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Lock the page behind the modal while it is open.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Escape steps back out: full screen returns to the modal, the modal closes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      navigate(isFull ? `/project/${project.id}` : "/");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isFull, project.id, navigate]);

  const media = project.previewImages?.[0];

  // ScrollSmoother puts a transform on #smooth-content, which makes it the
  // containing block for position:fixed. Portal to the body so the overlay is
  // measured against the viewport instead of the whole scrollable page.
  return createPortal(
    <div className="pm-overlay" role="dialog" aria-modal="true" aria-label={project.title}>
      {/* Scrim — clicking it closes, but not while full screen. */}
      <div
        className={`pm-scrim${isFull ? " pm-scrim--hidden" : ""}`}
        onClick={() => !isFull && navigate("/")}
      />

      <div ref={panelRef} className={`pm-panel${isFull ? " pm-panel--full" : ""}`}>
        <header className="pm-bar">
          <span className="pm-crumb">
            <button type="button" onClick={() => navigate("/")} className="pm-crumb-link">
              Work
            </button>
            <span aria-hidden="true"> › </span>
            <span className="pm-crumb-current">{project.title}</span>
          </span>

          <span className="pm-bar-actions">
            <button
              type="button"
              onClick={() =>
                navigate(isFull ? `/project/${project.id}` : `/project/${project.id}/full`)
              }
              aria-label={isFull ? "Exit full screen" : "Enter full screen"}
              title={isFull ? "Exit full screen" : "Full screen"}
              className="pm-icon-btn"
            >
              {isFull ? (
                <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M7 2v5H2M11 16v-5h5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M2 7V2h5M16 11v5h-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
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

        <div ref={scrollRef} className="pm-scroll">
          <div className="pm-content">
            <h1 className="pm-title">{project.title}</h1>

            <dl className="pm-meta">
              {[
                { label: "Year", value: project.year },
                { label: "Role", value: project.role },
                { label: "Stack", value: project.stack ?? project.tags.join(", ") },
              ]
                .filter((m) => m.value)
                .map((m) => (
                  <div key={m.label}>
                    <dt>{m.label}</dt>
                    <dd>{m.value}</dd>
                  </div>
                ))}
            </dl>

            {media ? (
              <div className="pm-hero">
                {media.endsWith(".mp4") ? (
                  <video src={media} muted loop autoPlay playsInline />
                ) : (
                  <img src={media} alt={project.title} />
                )}
              </div>
            ) : null}

            <p className="pm-lede">{project.summary ?? project.description}</p>

            {project.sections?.map((sec) => (
              <section key={sec.heading} className="pm-section">
                <h2>{sec.heading}</h2>
                <p>{sec.body}</p>
              </section>
            ))}

            <div className="pm-links">
              {project.liveUrl ? (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  Visit site ↗
                </a>
              ) : null}
              {project.githubUrl ? (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  View code ↗
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProjectModal;
