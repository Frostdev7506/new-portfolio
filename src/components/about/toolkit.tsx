import { AppWindow, Cloud, Database, Server } from "lucide-react";
import { toolkit } from "@/data/notebook";

const icons = [AppWindow, Server, Database, Cloud];

export function Toolkit({ compact = false }: { compact?: boolean }) {
  return (
    <section
      aria-label={compact ? "My toolkit" : undefined}
      id="tech-stack"
      className={compact ? "compact-toolkit" : "section-block toolkit"}
    >
      {!compact && (
        <>
          <p className="eyebrow">My toolkit.</p>
          <h2>What I work with</h2>
        </>
      )}
      <div className="toolkit-grid">
        {toolkit
          .filter((_, index) => !compact || index !== 2)
          .map((group) => {
            const Icon = icons[toolkit.indexOf(group)];
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
