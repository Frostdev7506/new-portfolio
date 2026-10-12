"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { siteConfig } from "@/data/site";

export function Navbar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="site-navigation">
      <Link
        href="/"
        className="nav-identity"
        aria-label={`${siteConfig.name} — home`}
      >
        <span className="nav-monogram" aria-hidden="true">nb.</span>
        <span>{siteConfig.name}</span>
      </Link>
      <nav className="nav-links" aria-label="Primary">
        {siteConfig.nav.map(({ label, href }) => (
          <Link
            href={href}
            key={href}
            aria-current={isActive(href) ? "page" : undefined}
          >
            {label}
          </Link>
        ))}
      </nav>
      <div className="nav-actions">
        <ThemeToggle />
        <Button asChild variant="ghost" className="nav-resume">
          <Link href="/resume">
            Résumé <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </Button>
        <DropdownMenu.Root modal={false}>
          <DropdownMenu.Trigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="mobile-nav-trigger"
              aria-label="Open navigation menu"
            >
              <Menu className="size-5" aria-hidden="true" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="mobile-nav-menu"
              align="end"
              sideOffset={12}
              collisionPadding={20}
              aria-label="Primary navigation"
            >
              {siteConfig.nav.map(({ label, href }) => (
                <DropdownMenu.Item asChild key={href}>
                  <Link
                    href={href}
                    aria-current={isActive(href) ? "page" : undefined}
                  >
                    {label}
                  </Link>
                </DropdownMenu.Item>
              ))}
              <DropdownMenu.Separator className="mobile-nav-separator" />
              <DropdownMenu.Item asChild>
                <Link href="/resume">
                  Résumé <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
