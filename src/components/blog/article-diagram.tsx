import { ArrowDown, ArrowRight } from "lucide-react";
import type { ArticleDiagramData } from "@/lib/article-content";

export function ArticleDiagram({ diagram }: { diagram: ArticleDiagramData }) {
  return (
    <figure className={`article-diagram diagram-${diagram.layout}`}>
      <figcaption>
        <strong>{diagram.title}</strong>
      </figcaption>
      <ol>
        {diagram.steps.map((step, index) => (
          <li key={step.label}>
            <strong>{step.label}</strong>
            <p>{step.detail}</p>
            {diagram.layout === "flow" && index < diagram.steps.length - 1 && (
              <span className="diagram-connector" aria-hidden="true">
                <ArrowRight />
                <ArrowDown />
              </span>
            )}
          </li>
        ))}
      </ol>
      <p className="diagram-caption">{diagram.caption}</p>
    </figure>
  );
}
