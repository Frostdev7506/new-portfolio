import { Mail } from "lucide-react";
import { LinkedinIcon, WhatsappIcon, XIcon } from "@/components/shared/brand-icons";

import { CopyButton } from "./copy-button";

type ShareLinksProps = {
  title: string;
  url: string;
};

export function ShareLinks({ title, url }: ShareLinksProps) {
  const links = [
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      icon: XIcon,
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      icon: LinkedinIcon,
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
      icon: WhatsappIcon,
    },
    {
      label: "Email",
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
      icon: Mail,
    },
  ];

  return (
    <div className="share-links">
      <CopyButton text={url} label="Copy link" />
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer noopener"
            className="share-link"
            title={link.label}
            aria-label={
              link.label === "Email" ? "Share by email" : `Share on ${link.label}`
            }
          >
            <Icon className="share-icon" aria-hidden="true" />
          </a>
        );
      })}
    </div>
  );
}
