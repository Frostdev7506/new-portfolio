import type { ReactNode } from "react";

export function ResumeSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="resume-section">
      <h3>{title}</h3>
      <div className="resume-section-content">{children}</div>
    </section>
  );
}
