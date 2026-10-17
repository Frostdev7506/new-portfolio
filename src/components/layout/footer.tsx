import Link from "next/link";
import { Github, Linkedin, Rss, Youtube } from "lucide-react";
import { siteConfig } from "@/data/site";

export function Footer() {
  return (
    <footer className="site-footer site-container">
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
            <Github size={18} aria-hidden="true" />
            GitHub
          </a>
          <a
            href={siteConfig.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin size={18} aria-hidden="true" />
            LinkedIn
          </a>
          <a
            href={siteConfig.social.youtube}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Youtube size={18} aria-hidden="true" />
            YouTube
          </a>
          <a href="/feed.xml" type="application/rss+xml" aria-label="RSS feed">
            <Rss size={18} aria-hidden="true" />
            RSS
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
