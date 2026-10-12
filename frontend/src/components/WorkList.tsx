import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { projects } from "../data/projects";
import Reveal from "./Reveal";
import ProjectModal from "./ProjectModal";
import ProjectWheel from "./ProjectWheel";

const DESKTOP = "(min-width: 1024px)";

/**
 * Work list: a wheel of project cards. On desktop the selected case study
 * sits beside it. On phones there is no room for that, so tapping a card
 * pushes /project/:id and opens the detail modal, making an open project a
 * shareable URL that the back button closes.
 */
const WorkList = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { pathname } = useLocation();

  const visible = projects.filter((p) => !p.placeholder);
  const isFull = pathname.endsWith("/full");

  const [desktop, setDesktop] = useState(() => window.matchMedia(DESKTOP).matches);
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP);
    const on = () => setDesktop(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // Desktop shows the write-up in the page, so a project link only turns the
  // wheel there; the modal is for phones.
  const active = desktop ? undefined : projects.find((p) => p.id === projectId);

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
      <Reveal>
        <ProjectWheel
          // Remounted on a breakpoint change, so the wheel rebuilds its geometry.
          key={desktop ? "desktop" : "compact"}
          compact={!desktop}
          projects={visible}
          initial={Math.max(0, visible.findIndex((p) => p.id === projectId))}
          onOpen={(p) => navigate(`/project/${p.id}`)}
        />
      </Reveal>

      {rendered ? (
        <ProjectModal project={rendered} isFull={isFull} closing={closing} />
      ) : null}
    </>
  );
};

export default WorkList;
