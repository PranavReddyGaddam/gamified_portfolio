import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { projects } from "../data/projects";

/**
 * Long-form case study at /project/:id/full — the room a card can't give you:
 * breadcrumb, metadata grid, hero media, then as many prose sections as the
 * project needs.
 */
const ProjectFull = () => {
  const { projectId } = useParams();
  const project = projects.find((p) => p.id === projectId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [projectId]);

  if (!project) {
    return (
      <main className="project-full">
        <div className="project-full-inner">
          <p className="project-crumb">
            <Link to="/">Work</Link>
          </p>
          <h1 className="project-title">Not found</h1>
          <p className="project-lede">
            No project matches that address. <Link to="/">Back to work</Link>.
          </p>
        </div>
      </main>
    );
  }

  const media = project.previewImages?.[0];

  return (
    <main className="project-full">
      <div className="project-full-inner">
        <nav className="project-crumb" aria-label="Breadcrumb">
          <Link to="/">Work</Link>
          <span aria-hidden="true"> › </span>
          <span className="project-crumb-current">{project.title}</span>
        </nav>

        <h1 className="project-title">{project.title}</h1>

        <dl className="project-meta">
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
          <div className="project-hero">
            {media.endsWith(".mp4") ? (
              <video src={media} muted loop autoPlay playsInline />
            ) : (
              <img src={media} alt={project.title} />
            )}
          </div>
        ) : null}

        <p className="project-lede">{project.summary ?? project.description}</p>

        {project.sections?.map((sec) => (
          <section key={sec.heading} className="project-section">
            <h2>{sec.heading}</h2>
            <p>{sec.body}</p>
          </section>
        ))}

        <div className="project-links">
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

        <p className="project-back">
          <Link to={`/project/${project.id}`}>← Back to work</Link>
        </p>
      </div>
    </main>
  );
};

export default ProjectFull;
