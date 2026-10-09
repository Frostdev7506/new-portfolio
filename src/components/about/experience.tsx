import { ArrowUpRight, Circle, CircleDot } from "lucide-react";
import { experience } from "@/data/notebook";
import { TextLink } from "@/components/shared/text-link";

export function Experience({ detailed = false }: { detailed?: boolean }) {
  return (
    <section
      id="experience"
      className={
        "section-block experience" +
        (detailed ? " detailed-experience" : " work-history")
      }
    >
      <p className="eyebrow">
        {detailed ? "The journey." : "Where I’ve worked."}
      </p>
      <div className="section-heading-row">
        <h2>{detailed ? "Where I’ve worked" : "Experience"}</h2>
        {!detailed && <TextLink href="/resume">Full résumé</TextLink>}
      </div>
      <ol className="experience-list" aria-label="Career timeline">
        {experience.map((job) => (
          <li key={job.company} data-current={job.current}>
            {!detailed && (
              <>
                <div className="job-dates">
                  <span className="job-period">{job.period}</span>
                  {job.current && (
                    <span className="current-role">
                      <span className="sr-only">Current role</span>
                      <span aria-hidden="true">now</span>
                      <ArrowUpRight size={22} aria-hidden="true" />
                    </span>
                  )}
                </div>
                <span className="job-milestone" aria-hidden="true">
                  {job.current ? <CircleDot /> : <Circle />}
                </span>
              </>
            )}
            <div>
              <h3>{job.company}</h3>
              <p className="job-role">{job.role}</p>
              <p className="job-description">{job.description}</p>
            </div>
            {detailed && <span className="job-period">{job.period}</span>}
          </li>
        ))}
      </ol>
    </section>
  );
}
