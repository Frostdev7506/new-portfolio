import { experience } from "@/data/notebook";
import { TextLink } from "@/components/shared/text-link";

export function Experience({ detailed = false }: { detailed?: boolean }) {
  return (
    <section
      id="experience"
      className={
        "section-block experience" + (detailed ? " detailed-experience" : "")
      }
    >
      <p className="eyebrow">
        {detailed ? "The journey." : "Where I’ve worked."}
      </p>
      <h2>{detailed ? "Where I’ve worked" : "Experience"}</h2>
      <ol className="experience-list">
        {experience.map((job) => (
          <li key={job.company}>
            <div>
              <h3>{job.company}</h3>
              <p>{job.role}</p>
              {detailed && <p className="job-description">{job.description}</p>}
            </div>
            <span className="job-period">{job.period}</span>
          </li>
        ))}
      </ol>
      {!detailed && <TextLink href="/resume">View full résumé</TextLink>}
    </section>
  );
}
