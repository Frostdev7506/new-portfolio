import { AppWindow, Cloud, Database, Server } from "lucide-react";
import { toolkit } from "@/data/toolkit";

const icons = {
  window: AppWindow,
  server: Server,
  database: Database,
  cloud: Cloud,
};

export function Toolkit({ compact = false }: { compact?: boolean }) {
  const groups = compact ? toolkit.filter((group) => group.showOnHome) : toolkit;

  return (
    <section
      aria-label={compact ? "My toolkit" : undefined}
      aria-labelledby={compact ? undefined : "toolkit-title"}
      id="tech-stack"
      className={compact ? "compact-toolkit" : "section-block toolkit"}
    >
      {!compact && <h2 id="toolkit-title">What I work with</h2>}
      <div className="toolkit-grid">
        {groups.map((group) => {
          const Icon = icons[group.icon];
          return (
            <div key={group.title} className="toolkit-item">
              <Icon
                size={compact ? 32 : 42}
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <div>
                <h3>{group.title}</h3>
                <p>{group.skills}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
