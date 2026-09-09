import { useLocation, useNavigate, useParams } from "react-router-dom";
import { projects } from "../data/projects";
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

  return (
    <>
      <div className="work-list">
        {visible.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => navigate(`/project/${p.id}`)}
            className="work-card-head"
          >
            <span className="work-card-title">
              {p.title}
              {p.year ? <span className="work-card-year"> • {p.year}</span> : null}
            </span>
            <span className="work-card-summary">{p.summary ?? p.description}</span>
          </button>
        ))}
      </div>

      {active ? <ProjectModal project={active} isFull={isFull} /> : null}
    </>
  );
};

export default WorkList;
