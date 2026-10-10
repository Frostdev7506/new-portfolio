import { Fragment } from "react";
import { Github, Linkedin, Globe, Mail, Smartphone } from "lucide-react";
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
    <div className="text-center mb-3">
      <h1 className="text-3xl font-bold mb-1">{personal.name}</h1>
      <div className="flex flex-wrap justify-center gap-2 items-center text-[10px]">
        {links.map(({ label, href, icon: Icon }, index) => (
          <Fragment key={href}>
            {index > 0 && <span className="text-gray-400">|</span>}
            <a href={href} className="flex items-center gap-1 text-[#003399] hover:underline">
              <Icon className="w-3 h-3" /> {label}
            </a>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
