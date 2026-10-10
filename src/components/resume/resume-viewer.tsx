import resumeData from "@/data/resume.json";
import { ResumeHeader } from "./resume-header";
import { ResumeExperience } from "./resume-experience";
import { ResumeProjects } from "./resume-projects";
import { ResumeSection } from "./resume-section";

export function ResumeViewer() {
  return (
    <div className="flex justify-center bg-gray-100 min-h-screen p-4 md:p-8 font-sans">
      <div
        className="bg-white shadow-2xl w-full max-w-[210mm] min-h-[297mm] p-[12.7mm] text-[11px] leading-[1.3] text-black"
        style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
      >
        <ResumeHeader />

        <ResumeSection title="Professional Summary">
          <p dangerouslySetInnerHTML={{ __html: resumeData.summary }} />
        </ResumeSection>

        <ResumeExperience />

        <ResumeProjects />

        <ResumeSection title="Education">
          {resumeData.education.map((education, index) => (
            <div key={index} className="flex">
              <div className="w-[80px] shrink-0">{education.date}</div>
              <div dangerouslySetInnerHTML={{ __html: education.degree }} />
            </div>
          ))}
        </ResumeSection>

        <ResumeSection title="Certifications">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {resumeData.certifications.map((certification, index) => (
              <div
                key={index}
                dangerouslySetInnerHTML={{ __html: certification }}
              />
            ))}
          </div>
        </ResumeSection>

        <ResumeSection title="Technical Skills">
          <div className="flex flex-col gap-1">
            {resumeData.technical_skills.map((skill, index) => (
              <div key={index} className="flex">
                <div
                  className="w-[120px] shrink-0"
                  dangerouslySetInnerHTML={{ __html: skill.category }}
                />
                <div dangerouslySetInnerHTML={{ __html: skill.skills }} />
              </div>
            ))}
          </div>
        </ResumeSection>
      </div>
    </div>
  );
}
