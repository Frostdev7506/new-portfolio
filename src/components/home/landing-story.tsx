import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contactNote, experience, homeNotebook } from "@/data/notebook";
import { siteConfig } from "@/data/site";

export function LandingExperience() {
  return (
    <section id="experience" className="ls-section" aria-labelledby="ls-experience-title">
      <div className="landing-container ls-experience-layout">
        <div className="ls-section-intro">
          <h2 id="ls-experience-title" className="ls-heading">Experience</h2>
          <Link className="ls-text-link" href="/resume">Full résumé</Link>
        </div>
        <ol className="ls-timeline" aria-label="Career timeline">
          {experience.map((job) => (
            <li key={job.company} className="ls-job">
              <Image
                src={job.logo}
                alt=""
                width={48}
                height={48}
                sizes="48px"
                className="ls-job-logo"
              />
              <div className="ls-job-heading">
                <h3>{job.company}</h3>
                <p className="ls-job-period">{job.period}</p>
              </div>
              <p className="ls-job-role">{job.role}</p>
              <p className="ls-job-details">{job.details}</p>
              {job.description && <p className="ls-job-description">{job.description}</p>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function LandingContact() {
  return (
    <section id="contact" className="ls-section ls-contact" aria-labelledby="ls-contact-title">
      <div className="landing-container ls-contact-layout">
        <h2 id="ls-contact-title" className="ls-contact-title">{contactNote.title}</h2>
        <Button asChild variant="link" className="ls-contact-link">
          <a href={`mailto:${siteConfig.email}`}>
            <span className="ls-contact-invitation">{homeNotebook.contactAction}</span>
            <span className="ls-contact-arrow" aria-hidden="true">
              <ArrowUpRight className="size-12" strokeWidth={1.25} />
            </span>
            <span className="ls-contact-address">{siteConfig.email}</span>
          </a>
        </Button>
      </div>
    </section>
  );
}

export function LandingAbout() {
  return (
    <section id="about" className="ls-section" aria-labelledby="ls-about-title">
      <div className="landing-container ls-about-layout">
        <div className="ls-about-copy">
          <h2 id="ls-about-title" className="ls-heading">A little context.</h2>
          {homeNotebook.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <Link className="ls-text-link" href="/about">More about me</Link>
        </div>
        <Image
          src="/illustrations/about-connections.png"
          alt="The parts in between: a web app connects to APIs and cloud infrastructure."
          width={1470}
          height={1070}
          sizes="(max-width: 600px) 280px, (max-width: 900px) 340px, 380px"
          className="ls-about-art"
        />
      </div>
    </section>
  );
}
