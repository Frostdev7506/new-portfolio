import resumeData from "@/data/resume.json";
import { ResumeHeader } from "./resume-header";
import { ResumeExperience } from "./resume-experience";
import { ResumeProjects } from "./resume-projects";
import { ResumeSection } from "./resume-section";

export function ResumeViewer() {
  return (
    <article className="resume-content" aria-labelledby="resume-name">
      <ResumeHeader />

      <ResumeSection title="Professional Summary">
        <p dangerouslySetInnerHTML={{ __html: resumeData.summary }} />
      </ResumeSection>

      <ResumeExperience />

      <ResumeProjects />

      <ResumeSection title="Education">
        {resumeData.education.map((education, index) => (
          <div key={index} className="resume-education">
            <p className="resume-date">{education.date}</p>
            <div dangerouslySetInnerHTML={{ __html: education.degree }} />
          </div>
        ))}
      </ResumeSection>

      <ResumeSection title="Certifications">
        <ul className="resume-certifications">
          {resumeData.certifications.map((certification, index) => (
            <li
              key={index}
              dangerouslySetInnerHTML={{ __html: certification }}
            />
          ))}
        </ul>
      </ResumeSection>

      <ResumeSection title="Technical Skills">
        <dl className="resume-skills">
          {resumeData.technical_skills.map((skill, index) => (
            <div key={index}>
              <dt dangerouslySetInnerHTML={{ __html: skill.category }} />
              <dd dangerouslySetInnerHTML={{ __html: skill.skills }} />
            </div>
          ))}
        </dl>
      </ResumeSection>
    </article>
  );
}
