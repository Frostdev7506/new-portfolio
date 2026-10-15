import Link from "next/link";
import { Youtube } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/shared/brand-icons";
import { siteConfig } from "@/data/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <p>
        © {new Date().getFullYear()} {siteConfig.name}
      </p>
      <nav className="footer-links" aria-label="Footer">
        <div className="footer-social">
          <a
            href={siteConfig.social.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon size={16} />
            GitHub
          </a>
          <a
            href={siteConfig.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedinIcon size={16} />
            LinkedIn
          </a>
          <a
            href={siteConfig.social.youtube}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Youtube size={16} aria-hidden="true" />
            YouTube
          </a>
        </div>
        <div className="footer-legal">
          <Link href="/privacy">Privacy</Link>
          <Link href="/editorial-policy">Editorial policy</Link>
        </div>
      </nav>
    </footer>
  );
}
