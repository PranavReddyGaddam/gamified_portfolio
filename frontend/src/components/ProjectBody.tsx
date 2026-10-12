import type { Project } from "../data/projects";

type Props = {
  project: Project;
  /** Renders the hero as a video only when true, so a hidden copy does not decode. */
  playMedia?: boolean;
};

/**
 * The case-study write-up: title, meta, hero, lede and sections. Shared by
 * the phone modal and the desktop wheel's side panel, so the two never drift.
 */
const ProjectBody = ({ project, playMedia = true }: Props) => {
  const media = project.previewImages?.[0];

  return (
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
            playMedia ? <video src={media} muted loop autoPlay playsInline /> : null
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
    </div>
  );
};

export default ProjectBody;
