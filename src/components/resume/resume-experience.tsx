import resumeData from "@/data/resume.json";
import { ResumeSection } from "./resume-section";

export function ResumeExperience() {
  return (
    <ResumeSection title="Work Experience">
      <div className="resume-entries">
        {resumeData.experience.map((job, index) => (
          <section key={index} className="resume-entry">
            <header className="resume-entry-heading">
              <h4 dangerouslySetInnerHTML={{ __html: job.title }} />
              <p className="resume-date">{job.date}</p>
            </header>
            <ul className="resume-points">
              {job.points.map((point, pointIndex) => (
                <li key={pointIndex} dangerouslySetInnerHTML={{ __html: point }} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </ResumeSection>
  );
}
