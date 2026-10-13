import Link from "next/link";
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
        </div>
        <div className="footer-legal">
          <Link href="/privacy">Privacy</Link>
          <Link href="/editorial-policy">Editorial policy</Link>
        </div>
      </nav>
    </footer>
  );
}
