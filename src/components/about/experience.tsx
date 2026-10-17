import Image from "next/image";
import { experience } from "@/data/notebook";
import { TextLink } from "@/components/shared/text-link";

export function Experience({ detailed = false }: { detailed?: boolean }) {
  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className={
        "section-block experience" +
        (detailed ? " detailed-experience" : " work-history")
      }
    >
      <div className="section-heading-row">
        <h2 id="experience-title">{detailed ? "Where I’ve worked" : "Experience"}</h2>
        {!detailed && <TextLink href="/resume">Full résumé</TextLink>}
      </div>
      <ol className="experience-list" aria-label="Career timeline">
        {experience.map((job) => (
          <li key={job.company}>
            <Image
              src={job.logo}
              alt=""
              width={48}
              height={48}
              sizes="48px"
              className="job-logo"
            />
            <div className="job-copy">
              <div className="job-heading">
                <h3>{job.company}</h3>
                <span className="job-period">{job.period}</span>
              </div>
              <p className="job-role">{job.role}</p>
              <p className="job-details">{job.details}</p>
              {job.description && (
                <p className="job-description">{job.description}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
