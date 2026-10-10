import { Fragment } from "react";
import resumeData from "@/data/resume.json";
import { ResumeSection } from "./resume-section";

export function ResumeProjects() {
  return (
    <ResumeSection title="Projects">
      <div className="flex flex-col gap-[8px]">
        {resumeData.projects.map((project, index) => (
          <div key={index}>
            <div className="flex justify-between items-baseline mb-[2px]">
              <span dangerouslySetInnerHTML={{ __html: project.title }} />
              <span className="text-[10px] whitespace-nowrap space-x-1">
                {project.links.map((link, linkIndex) => (
                  <Fragment key={linkIndex}>
                    <a href={link.url} className="text-[#003399] hover:underline">
                      {link.text}
                    </a>
                    {linkIndex < project.links.length - 1 && (
                      <span className="text-gray-600 px-1">|</span>
                    )}
                  </Fragment>
                ))}
              </span>
            </div>
            <ul className="list-none space-y-[1px]">
              {project.points.map((point, pointIndex) => (
                <li key={pointIndex} className="flex">
                  <span className="mr-1">--</span>
                  <span dangerouslySetInnerHTML={{ __html: point }} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </ResumeSection>
  );
}
