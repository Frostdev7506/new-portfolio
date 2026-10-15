"use client";

import { Checkbox } from "radix-ui";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BlogEditorMetadata } from "@/lib/blog-editor-types";
import { StudioSelect } from "./studio-select";

export function SeoAdvancedSettings({ metadata, onChange }: {
  metadata: BlogEditorMetadata;
  onChange: (metadata: Partial<BlogEditorMetadata>) => void;
}) {
  const limit = (key: "maxSnippet" | "maxVideoPreview", label: string, hint: string) => (
    <label className="studio-field">
      <span>{label}<small>Optional</small></span>
      <input type="number" min={-1} step={1} value={metadata[key] ?? ""} placeholder="Default" disabled={metadata.nosnippet} onChange={(event) => onChange({ [key]: event.target.value === "" ? undefined : event.target.valueAsNumber })} />
      <small>{hint}</small>
    </label>
  );
  return (
    <div>
      <p className="studio-help">Defaults allow search previews and link discovery. These settings request limits from search engines that support them.</p>
      <label className="studio-check">
        <Checkbox.Root checked={metadata.nofollow ?? false} onCheckedChange={(value) => onChange({ nofollow: value === true })}><Checkbox.Indicator><Check size={14} /></Checkbox.Indicator></Checkbox.Root>
        <span>Do not follow links on this page<small>Adds nofollow to the page’s robots directive. This does not change how readers open links.</small></span>
      </label>
      <label className="studio-check">
        <Checkbox.Root checked={metadata.nosnippet ?? false} onCheckedChange={(value) => onChange({ nosnippet: value === true })}><Checkbox.Indicator><Check size={14} /></Checkbox.Indicator></Checkbox.Root>
        <span>Hide text and video snippets<small>Adds nosnippet. It takes priority over the text and video limits below; your saved limits are retained.</small></span>
      </label>
      {limit("maxSnippet", "Maximum text snippet characters", "Blank uses the search engine default; -1 allows any length; 0 requests no text snippet.")}
      {limit("maxVideoPreview", "Maximum video preview seconds", "Blank uses the search engine default; -1 allows any length; 0 requests a static image only.")}
      <StudioSelect id="seo-image-preview" label="Search image preview size" value={metadata.maxImagePreview ?? "default"} onChange={(value) => onChange({ maxImagePreview: value === "default" ? undefined : value as BlogEditorMetadata["maxImagePreview"] })} options={[
        { value: "default", label: "Site default · Large" }, { value: "large", label: "Large" }, { value: "standard", label: "Standard" }, { value: "none", label: "No image preview" },
      ]} hint="Controls search previews; it does not change the article’s image or social cards." />
      <Button variant="ghost" onClick={() => onChange({ nofollow: undefined, nosnippet: undefined, maxSnippet: undefined, maxVideoPreview: undefined, maxImagePreview: undefined })}>Reset advanced controls</Button>
    </div>
  );
}
