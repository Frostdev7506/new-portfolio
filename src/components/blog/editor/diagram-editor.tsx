"use client";

import { useEffect, useRef } from "react";
import {
  Select,
  useCodeBlockEditorContext,
  type CodeBlockEditorDescriptor,
  type CodeBlockEditorProps,
} from "@mdxeditor/editor";
import { Button } from "@/components/ui/button";
import { parseDiagram, type ArticleDiagramData } from "@/lib/article-content";

export const newDiagram: ArticleDiagramData = {
  title: "Diagram title",
  caption: "Explain what this diagram shows.",
  layout: "flow",
  steps: [
    { label: "First step", detail: "Describe the starting point." },
    { label: "Next step", detail: "Describe what happens next." },
  ],
};

function readDraft(code: string): ArticleDiagramData | null {
  try {
    const data = JSON.parse(code);
    // Empty text is allowed while typing; the article validator checks completed fields.
    if (
      !data ||
      typeof data.title !== "string" ||
      typeof data.caption !== "string" ||
      !["flow", "comparison"].includes(data.layout) ||
      !Array.isArray(data.steps) ||
      data.steps.length < 2 ||
      data.steps.length > 5 ||
      data.steps.some(
        (step: { label?: unknown; detail?: unknown } | null) =>
          !step || typeof step.label !== "string" || typeof step.detail !== "string",
      ) ||
      [data.input, data.output].some(
        (endpoint: unknown) => endpoint !== undefined && (
          !endpoint ||
          typeof endpoint !== "object" ||
          Array.isArray(endpoint) ||
          !("label" in endpoint) || typeof endpoint.label !== "string" ||
          !("detail" in endpoint) || typeof endpoint.detail !== "string"
        ),
      )
    ) return null;
    return data;
  } catch {
    return null;
  }
}

function DiagramEditor({ code, focusEmitter }: CodeBlockEditorProps) {
  const { setCode, parentEditor, lexicalNode } = useCodeBlockEditorContext();
  const container = useRef<HTMLDivElement>(null);
  const diagram = readDraft(code);
  let error = "";
  try {
    parseDiagram(code);
  } catch (cause) {
    error = cause instanceof Error ? cause.message : "Complete all diagram fields, including any input or output label and detail.";
  }

  useEffect(() => {
    focusEmitter.subscribe(() => container.current?.querySelector<HTMLInputElement | HTMLTextAreaElement>("input, textarea")?.focus());
  }, [focusEmitter]);

  function update(next: ArticleDiagramData) {
    setCode(JSON.stringify(next, null, 2));
  }

  function endpointControl(kind: "input" | "output") {
    if (!diagram) return null;
    const endpoint = diagram[kind];
    const label = kind === "input" ? "Input" : "Output";
    if (!endpoint) {
      return (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="justify-self-start"
          onClick={() => update({ ...diagram, [kind]: { label, detail: kind === "input" ? "Describe what enters this flow." : "Describe what this flow produces." } })}
        >
          Add {kind}
        </Button>
      );
    }
    return (
      <fieldset className="blog-diagram-step grid gap-3 rounded-md border p-3">
        <legend className="px-1 text-sm font-medium">{label} (optional)</legend>
        <label className="grid gap-1 text-sm">
          {label} label
          <input
            value={endpoint.label}
            onChange={(event) => update({ ...diagram, [kind]: { ...endpoint, label: event.target.value } })}
          />
        </label>
        <label className="grid gap-1 text-sm">
          {label} detail
          <textarea
            rows={2}
            value={endpoint.detail}
            onChange={(event) => update({ ...diagram, [kind]: { ...endpoint, detail: event.target.value } })}
          />
        </label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="justify-self-start"
          onClick={() => update({ ...diagram, [kind]: undefined })}
        >
          Remove {kind}
        </Button>
      </fieldset>
    );
  }

  return (
    <div
      className="blog-diagram-editor my-6 rounded-lg border p-4"
      ref={container}
      onKeyDown={(event) => event.stopPropagation()}
      onKeyUp={(event) => event.stopPropagation()}
    >
      <div className="blog-diagram-actions mb-4 flex flex-wrap items-center justify-between gap-2">
        <strong>Article diagram</strong>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => parentEditor.update(() => lexicalNode.remove())}
        >
          Remove diagram
        </Button>
      </div>
      {diagram ? (
        <div className="blog-diagram-grid grid gap-4">
          <label className="grid gap-1 text-sm">
            Title
            <input
              value={diagram.title}
              onChange={(event) => update({ ...diagram, title: event.target.value })}
            />
          </label>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span>Layout</span>
            <Select
              value={diagram.layout}
              onChange={(layout) => update({ ...diagram, layout })}
              triggerTitle="Diagram layout"
              placeholder="Diagram layout"
              items={[
                { value: "flow", label: "Flow" },
                { value: "comparison", label: "Comparison" },
              ]}
            />
          </div>
          {endpointControl("input")}
          {diagram.steps.map((step, index) => (
            <fieldset key={index} className="blog-diagram-step grid gap-3 rounded-md border p-3">
              <legend className="px-1 text-sm font-medium">Step {index + 1}</legend>
              <label className="grid gap-1 text-sm">
                Label
                <input
                  value={step.label}
                  onChange={(event) => update({
                    ...diagram,
                    steps: diagram.steps.map((item, position) => position === index
                      ? { ...item, label: event.target.value }
                      : item),
                  })}
                />
              </label>
              <label className="grid gap-1 text-sm">
                Detail
                <textarea
                  rows={2}
                  value={step.detail}
                  onChange={(event) => update({
                    ...diagram,
                    steps: diagram.steps.map((item, position) => position === index
                      ? { ...item, detail: event.target.value }
                      : item),
                  })}
                />
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="justify-self-start"
                disabled={diagram.steps.length <= 2}
                onClick={() => update({ ...diagram, steps: diagram.steps.filter((_, position) => position !== index) })}
              >
                Remove step {index + 1}
              </Button>
            </fieldset>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="justify-self-start"
            disabled={diagram.steps.length >= 5}
            onClick={() => update({ ...diagram, steps: [...diagram.steps, { label: "New step", detail: "Describe this step." }] })}
          >
            Add step
          </Button>
          {endpointControl("output")}
          <label className="grid gap-1 text-sm">
            Caption
            <textarea
              rows={2}
              value={diagram.caption}
              onChange={(event) => update({ ...diagram, caption: event.target.value })}
            />
          </label>
        </div>
      ) : (
        <label className="grid gap-2 text-sm">
          Repair diagram JSON
          <textarea className="font-mono" rows={10} value={code} onChange={(event) => setCode(event.target.value)} />
        </label>
      )}
      {error && <p className="blog-diagram-error mt-3 text-sm" role="alert">{error}</p>}
    </div>
  );
}

export const diagramEditorDescriptor: CodeBlockEditorDescriptor = {
  priority: 10,
  match: (language) => language === "diagram",
  Editor: DiagramEditor,
};
