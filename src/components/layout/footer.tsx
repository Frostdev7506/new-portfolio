import Link from "next/link";
import { siteConfig } from "@/data/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <p>
        © {new Date().getFullYear()} {siteConfig.name}
      </p>
      <nav aria-label="Footer">
        <a
          href={siteConfig.social.github}
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        <a
          href={siteConfig.social.linkedin}
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
        <Link href="/privacy">Privacy</Link>
        <Link href="/editorial-policy">Editorial policy</Link>
      </nav>
    </footer>
  );
}
