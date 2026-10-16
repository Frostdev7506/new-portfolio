import { Github, Globe, Linkedin, Mail, Smartphone } from "lucide-react";
import resumeData from "@/data/resume.json";

const { personal } = resumeData;
const links = [
  { label: "GitHub", href: personal.github, icon: Github },
  { label: "LinkedIn", href: personal.linkedIn, icon: Linkedin },
  { label: "Portfolio", href: personal.portfolio, icon: Globe },
  { label: personal.email, href: `mailto:${personal.email}`, icon: Mail },
  { label: personal.mobile, href: `tel:${personal.mobile}`, icon: Smartphone },
];

export function ResumeHeader() {
  return (
    <header className="resume-header">
      <h2 id="resume-name">{personal.name}</h2>
      <ul className="resume-contact-links" aria-label="Contact and profiles">
        {links.map(({ label, href, icon: Icon }) => (
          <li key={href}>
            <a href={href}>
              <Icon size={16} strokeWidth={1.75} aria-hidden="true" /> {label}
            </a>
          </li>
        ))}
      </ul>
    </header>
  );
}
