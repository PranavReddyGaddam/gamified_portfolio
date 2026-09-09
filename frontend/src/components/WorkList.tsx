import { useLayoutEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { gsap } from "gsap";
import { projects, type Project } from "../data/projects";

/**
 * Work list where each card expands in place.
 *
 * Selecting a card pushes /project/:id, so an expanded card is a real URL that
 * can be linked and shared, and the browser's back button collapses it. The
 * expanded panel links on to /project/:id/full for the long-form case study.
 */
const WorkList = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const previousOpen = useRef<string | undefined>(undefined);

  const visible = projects.filter((p) => !p.placeholder);

  // Animate the panel whose id is in the URL, and close the one leaving.
  useLayoutEffect(() => {
    const open = (id: string) => {
      const el = panelRefs.current[id];
      if (!el) return;
      gsap.killTweensOf(el);
      gsap.set(el, { height: "auto" });
      const target = el.offsetHeight;
      gsap.fromTo(
        el,
        { height: 0, opacity: 0 },
        {
          height: target,
          opacity: 1,
          duration: 0.5,
          ease: "power3.out",
          onComplete: () => {
            gsap.set(el, { height: "auto" });
          },
        }
      );
    };

    const close = (id: string) => {
      const el = panelRefs.current[id];
      if (!el) return;
      gsap.killTweensOf(el);
      gsap.to(el, { height: 0, opacity: 0, duration: 0.35, ease: "power2.inOut" });
    };

    const prev = previousOpen.current;
    if (prev && prev !== projectId) close(prev);
    if (projectId) open(projectId);
    previousOpen.current = projectId;
  }, [projectId]);

  const toggle = (p: Project) => {
    navigate(projectId === p.id ? "/" : `/project/${p.id}`);
  };

  return (
    <div className="work-list" ref={rootRef}>
      {visible.map((p) => {
        const isOpen = projectId === p.id;
        return (
          <div key={p.id} className="work-card">
            <button
              type="button"
              onClick={() => toggle(p)}
              aria-expanded={isOpen}
              aria-controls={`work-panel-${p.id}`}
              className="work-card-head"
            >
              <span className="work-card-title">
                {p.title}
                {p.year ? <span className="work-card-year"> • {p.year}</span> : null}
              </span>
              <span className="work-card-summary">
                {p.summary ?? p.description}
              </span>
            </button>

            <div
              id={`work-panel-${p.id}`}
              ref={(el) => {
                panelRefs.current[p.id] = el;
              }}
              className="work-panel"
              style={{ height: 0, opacity: 0 }}
            >
              <div className="work-panel-inner">
                {p.previewImages?.[0] ? (
                  <div className="work-media">
                    {p.previewImages[0].endsWith(".mp4") ? (
                      <video
                        src={p.previewImages[0]}
                        muted
                        loop
                        autoPlay
                        playsInline
                      />
                    ) : (
                      <img src={p.previewImages[0]} alt={p.title} />
                    )}
                  </div>
                ) : null}

                <div className="work-meta">
                  <p className="work-desc">{p.description}</p>

                  <div className="work-tags">
                    {p.tags.map((t) => (
                      <span key={t} className="work-tag">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="work-actions">
                    <button
                      type="button"
                      onClick={() => navigate(`/project/${p.id}/full`)}
                      className="work-action work-action--primary"
                    >
                      Read the full story →
                    </button>
                    {p.liveUrl ? (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="work-action"
                      >
                        Visit site
                      </a>
                    ) : null}
                    {p.githubUrl ? (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="work-action"
                      >
                        Code
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WorkList;
