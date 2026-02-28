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
    <div className="flex flex-wrap gap-4">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-3 rounded-none border border-border/40 px-4 py-2.5 text-[10px] tracking-[0.2em] font-medium uppercase text-muted-foreground transition-all duration-300 hover:border-primary/50 hover:text-primary hover:bg-primary/5"
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </a>
        );
      })}
    </div>
  );
}
