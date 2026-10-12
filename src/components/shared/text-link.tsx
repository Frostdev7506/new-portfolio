import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export function TextLink({
  href,
  children,
  external = false,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
}) {
  const content = (
    <>
      {children}
      {external ? (
        <ArrowUpRight size={20} strokeWidth={1.75} aria-hidden="true" />
      ) : (
        <ArrowRight size={20} strokeWidth={1.75} aria-hidden="true" />
      )}
    </>
  );
  return external ? (
    <a
      className={"text-link min-h-11 " + className}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {content}
    </a>
  ) : (
    <Link className={"text-link min-h-11 " + className} href={href}>
      {content}
    </Link>
  );
}
