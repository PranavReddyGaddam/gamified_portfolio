import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { projects } from "../data/projects";
import Reveal from "./Reveal";
import ProjectModal from "./ProjectModal";

/**
 * Work list. Selecting a card pushes /project/:id and opens the detail modal,
 * so an open project is a shareable URL and the back button closes it.
 */
const WorkList = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { pathname } = useLocation();

  const visible = projects.filter((p) => !p.placeholder);
  const active = projects.find((p) => p.id === projectId);
  const isFull = pathname.endsWith("/full");

  // Keep the modal mounted for the length of its exit animation, so closing
  // animates out instead of vanishing the moment the route changes.
  const [rendered, setRendered] = useState(active);
  const [closing, setClosing] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    window.clearTimeout(timer.current);
    if (active) {
      setRendered(active);
      setClosing(false);
      return;
    }
    if (rendered) {
      setClosing(true);
      timer.current = window.setTimeout(() => {
        setRendered(undefined);
        setClosing(false);
      }, 320);
    }
    return () => window.clearTimeout(timer.current);
  }, [active, rendered]);

  return (
    <>
      <Reveal stagger={0.08} className="work-grid">
        {visible.map((p) => {
          const media = p.previewImages?.[0];
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => navigate(`/project/${p.id}`)}
              className="work-card"
              aria-label={p.title}
            >
              <span className="work-card-media">
                {media ? (
                  media.endsWith(".mp4") ? (
                    <video src={media} muted loop autoPlay playsInline />
                  ) : (
                    <img src={media} alt="" />
                  )
                ) : null}

                <span className="work-card-pill">{p.title}</span>
              </span>
            </button>
          );
        })}
      </Reveal>

      {rendered ? (
        <ProjectModal project={rendered} isFull={isFull} closing={closing} />
      ) : null}
    </>
  );
};

export default WorkList;
