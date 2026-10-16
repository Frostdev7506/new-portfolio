import resumeData from "@/data/resume.json";
import { ResumeSection } from "./resume-section";

export function ResumeProjects() {
  return (
    <ResumeSection title="Projects">
      <div className="resume-entries">
        {resumeData.projects.map((project, index) => (
          <section key={index} className="resume-entry">
            <header className="resume-entry-heading">
              <h4 dangerouslySetInnerHTML={{ __html: project.title }} />
              <ul className="resume-project-links">
                {project.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href={link.url}>{link.text}</a>
                  </li>
                ))}
              </ul>
            </header>
            <ul className="resume-points">
              {project.points.map((point, pointIndex) => (
                <li key={pointIndex} dangerouslySetInnerHTML={{ __html: point }} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </ResumeSection>
  );
}
