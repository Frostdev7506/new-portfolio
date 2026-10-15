import type { EditorDocument } from "./blog-editor-types.ts";

const requiredTextFields = new Set([
  "title", "description", "category", "takeaway", "cover", "coverAlt", "date",
]);

export function serializeEditorDocument(document: EditorDocument): string {
  const frontmatter = Object.entries(document.metadata).flatMap(([key, original]) => {
    const value = typeof original === "string" ? original.trim()
      : Array.isArray(original) ? original.map((item) => typeof item === "string" ? item.trim() : item)
      : original;
    if (value === undefined || (value === "" && !requiredTextFields.has(key))) return [];
    return [`${key}: ${JSON.stringify(value)}`];
  }).join("\n");
  return `---\n${frontmatter}\n---\n${document.content}`;
}
