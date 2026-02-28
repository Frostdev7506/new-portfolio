import { Linkedin, Mail, MessageCircle, Twitter } from "lucide-react";
import { siteConfig } from "@/data/site";

type ShareLinksProps = {
  title: string;
  url: string;
};

function encode(value: string) {
  return encodeURIComponent(value);
}

export function ShareLinks({ title, url }: ShareLinksProps) {
  const links = [
    {
      label: "Twitter/X",
      href: `https://twitter.com/intent/tweet?text=${encode(title)}&url=${encode(url)}`,
      icon: Twitter,
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encode(url)}`,
      icon: Linkedin,
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encode(`${title} ${url}`)}`,
      icon: MessageCircle,
    },
    {
      label: "Email",
      href: `mailto:${siteConfig.email}?subject=${encode(title)}&body=${encode(url)}`,
      icon: Mail,
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm text-slate-700 transition hover:-translate-y-0.5 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </a>
        );
      })}
    </div>
  );
}
