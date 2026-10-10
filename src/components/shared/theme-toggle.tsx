"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle color theme"
      className="theme-toggle"
    >
      <Sun className="theme-sun size-6" strokeWidth={1.5} aria-hidden="true" />
      <Moon
        className="theme-moon size-6"
        strokeWidth={1.5}
        aria-hidden="true"
      />
    </Button>
  );
}
