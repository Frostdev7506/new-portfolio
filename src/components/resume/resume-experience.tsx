import resumeData from "@/data/resume.json";
import { ResumeSection } from "./resume-section";

export function ResumeExperience() {
  return (
    <ResumeSection title="Work Experience">
      <div className="flex flex-col gap-2">
        {resumeData.experience.map((job, index) => (
          <div key={index}>
            <div className="flex justify-between items-baseline mb-1">
              <span dangerouslySetInnerHTML={{ __html: job.title }} />
              <span className="text-[10px] whitespace-nowrap">{job.date}</span>
            </div>
            <ul className="list-disc pl-4 marker:text-black space-y-[1px]">
              {job.points.map((point, pointIndex) => (
                <li key={pointIndex} dangerouslySetInnerHTML={{ __html: point }} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </ResumeSection>
  );
}
