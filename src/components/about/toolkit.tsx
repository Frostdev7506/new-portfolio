import { AppWindow, Cloud, Database, Server } from "lucide-react";
import { toolkit } from "@/data/toolkit";

const icons = {
  window: AppWindow,
  server: Server,
  database: Database,
  cloud: Cloud,
};

export function Toolkit() {
  return (
    <section
      aria-labelledby="toolkit-title"
      id="tech-stack"
      className="section-block toolkit"
    >
      <h2 id="toolkit-title">What I work with</h2>
      <div className="toolkit-grid">
        {toolkit.map((group) => {
          const Icon = icons[group.icon];
          return (
            <div key={group.title} className="toolkit-item">
              <Icon
                size={42}
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
