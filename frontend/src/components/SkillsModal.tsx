import DetailModal from "./DetailModal";
import { skillGroups } from "../data/skills";

type Props = {
  closing: boolean;
  onClose: () => void;
};

/**
 * The tools behind "full-stack engineering" in the About paragraph.
 *
 * Same chrome as the name and project modals, so it reads as another footnote
 * on the page rather than a resume section.
 */
const SkillsModal = ({ closing, onClose }: Props) => (
  <DetailModal crumb="About" title="Skills" closing={closing} onClose={onClose}>
    <h1 className="pm-title">Skills</h1>

    <dl className="pm-meta">
      <div>
        <dt>Focus</dt>
        <dd>Full-stack, backend, AI</dd>
      </div>
      <div>
        <dt>Languages</dt>
        <dd>Java, Python, TypeScript</dd>
      </div>
      <div>
        <dt>Now</dt>
        <dd>Platform at Salesforce</dd>
      </div>
    </dl>

    <p className="pm-lede">
      Most of this was learned by building something that needed it. Every
      item below shows up in a project or role on this page.
    </p>

    {skillGroups.map((group) => (
      <section key={group.id} className="pm-section skills-group">
        <h2>{group.title}</h2>
        <p>{group.note}</p>
        <ul className="skills-list">
          {group.skills.map(({ name, icon: Icon }) => (
            <li key={name} className="skills-item">
              <Icon aria-hidden="true" className="skills-item-icon" />
              {name}
            </li>
          ))}
        </ul>
      </section>
    ))}
  </DetailModal>
);

export default SkillsModal;
