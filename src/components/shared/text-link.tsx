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
        <ArrowUpRight size={19} aria-hidden="true" />
      ) : (
        <ArrowRight size={21} aria-hidden="true" />
      )}
    </>
  );
  return external ? (
    <a
      className={"text-link " + className}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {content}
    </a>
  ) : (
    <Link className={"text-link " + className} href={href}>
      {content}
    </Link>
  );
}
