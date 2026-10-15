import GithubSlugger from "github-slugger";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { toString } from "mdast-util-to-string";
import type { Root, RootContent } from "mdast";

export type ArticleHeading = { id: string; text: string; depth: number };
type DiagramNode = { label: string; detail: string };
export type ArticleDiagramData = {
  title: string;
  caption: string;
  layout: "flow" | "comparison";
  steps: DiagramNode[];
  input?: DiagramNode;
  output?: DiagramNode;
};

export function parseDiagram(source: string): ArticleDiagramData {
  const data = JSON.parse(source);
  if (
    !data ||
    typeof data.title !== "string" ||
    !data.title.trim() ||
    typeof data.caption !== "string" ||
    !data.caption.trim() ||
    !["flow", "comparison"].includes(data.layout) ||
    !Array.isArray(data.steps) ||
    data.steps.length < 2 ||
    data.steps.length > 5 ||
    data.steps.some(
      (step: { label?: unknown; detail?: unknown } | null) =>
        !step ||
        typeof step.label !== "string" ||
        !step.label.trim() ||
        typeof step.detail !== "string" ||
        !step.detail.trim(),
    )
  ) {
    throw new Error(
      "A diagram needs a title, caption, flow/comparison layout, and 2–5 labeled steps.",
    );
  }
  for (const key of ["input", "output"]) {
    const node = data[key];
    if (
      node !== undefined &&
      (!node ||
        typeof node !== "object" ||
        Array.isArray(node) ||
        typeof node.label !== "string" ||
        !node.label.trim() ||
        typeof node.detail !== "string" ||
        !node.detail.trim())
    ) {
      throw new Error(`A diagram ${key} needs a nonempty label and detail.`);
    }
  }
  return data;
}

export function getArticleStructure(content: string) {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(content) as Root;
  const slugger = new GithubSlugger();
  const headings: ArticleHeading[] = [];
  let diagramCount = 0;
  const text: string[] = [];
  for (const node of tree.children) {
    if (node.type === "heading") {
      const label = toString(node);
      const id = slugger.slug(label);
      if (node.depth === 1)
        throw new Error("Article bodies start at h2; the page provides h1.");
      if (node.depth <= 3)
        headings.push({ id, text: label, depth: node.depth });
    }
    if (node.type === "code" && node.lang === "diagram") {
      const diagram = parseDiagram(node.value);
      text.push(
        diagram.title,
        diagram.caption,
        ...(diagram.input ? [diagram.input.label, diagram.input.detail] : []),
        ...diagram.steps.flatMap((step) => [step.label, step.detail]),
        ...(diagram.output ? [diagram.output.label, diagram.output.detail] : []),
      );
      diagramCount++;
    } else {
      text.push(
        node.type === "code" ? node.value : toString(node as RootContent),
      );
    }
  }
  const wordCount = text.join(" ").trim().split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 200));
  return {
    headings,
    diagramCount,
    wordCount,
    readingMinutes,
    readtime: `${readingMinutes} min read`,
  };
}
