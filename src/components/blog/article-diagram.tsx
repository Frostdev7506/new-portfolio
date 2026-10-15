import { ArrowDown, ArrowRight, Copy, GitCompareArrows, ListChecks, Workflow } from "lucide-react";
import type { ArticleDiagramData } from "@/lib/article-content";

export function ArticleDiagram({ diagram }: { diagram: ArticleDiagramData }) {
  const isFlow = diagram.layout === "flow";
  const Steps = isFlow ? "ol" : "ul";
  const Icon = isFlow ? Workflow : GitCompareArrows;
  const vertical = diagram.steps.length > 3;

  return (
    <figure
      className={`article-diagram diagram-${diagram.layout}${vertical ? " diagram-vertical" : ""}${diagram.input ? " diagram-has-input" : ""}${diagram.output ? " diagram-has-output" : ""}`}
    >
      <figcaption>
        <Icon aria-hidden="true" />
        <strong>{diagram.title}</strong>
      </figcaption>
      {diagram.input && (
        <div className="diagram-endpoint diagram-input">
          <Copy aria-hidden="true" />
          <div>
            <strong>{diagram.input.label}</strong>
            <p>{diagram.input.detail}</p>
          </div>
        </div>
      )}
      <Steps className="diagram-steps">
        {diagram.steps.map((step, index) => (
          <li key={step.label}>
            <span className="diagram-step-marker" aria-hidden="true">
              {isFlow ? String(index + 1).padStart(2, "0") : String.fromCharCode(65 + index)}
            </span>
            <div className="diagram-step-content">
              <strong>{step.label}</strong>
              <p>{step.detail}</p>
            </div>
            {isFlow && index < diagram.steps.length - 1 && (
              <span className="diagram-connector" aria-hidden="true">
                <ArrowRight />
                <ArrowDown />
              </span>
            )}
          </li>
        ))}
      </Steps>
      {diagram.output && (
        <div className="diagram-endpoint diagram-output">
          <ListChecks aria-hidden="true" />
          <div>
            <strong>{diagram.output.label}</strong>
            <p>{diagram.output.detail}</p>
          </div>
        </div>
      )}
      <p className="diagram-caption">{diagram.caption}</p>
    </figure>
  );
}
