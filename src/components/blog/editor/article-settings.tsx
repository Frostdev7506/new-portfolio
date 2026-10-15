"use client";

import { useState } from "react";
import { Accordion, Checkbox } from "radix-ui";
import { Check, ChevronDown, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { validateCoverDimensions } from "@/lib/blog-seo-validation";
import type { BlogEditorMetadata } from "@/lib/blog-editor-types";

type Props = {
  metadata: BlogEditorMetadata;
  covers: string[];
  onChange: (metadata: Partial<BlogEditorMetadata>) => void;
  onError: (message: string) => void;
};

export function ArticleSettings({ metadata, covers, onChange, onError }: Props) {
  const [uploading, setUploading] = useState(false);
  let dimensionError = "";
  try { validateCoverDimensions(metadata.coverWidth, metadata.coverHeight); }
  catch { dimensionError = "Enter both dimensions as positive whole numbers, or clear both."; }
  const changeCover = (cover: string) => {
    if (cover !== metadata.cover) onChange({ cover, coverWidth: undefined, coverHeight: undefined });
  };
  const update = <K extends keyof BlogEditorMetadata>(key: K, value: BlogEditorMetadata[K]) =>
    onChange({ [key]: value });
  const field = (key: "title" | "description" | "category" | "date" | "updated" | "takeaway" | "coverAlt" | "youtubeId" | "source", label: string, options: { multiline?: boolean; type?: string; optional?: boolean; hint?: string } = {}) => (
    <label className="studio-field" key={key}>
      <span>{label}{options.optional && <small>Optional</small>}</span>
      {options.multiline ? (
        <textarea value={metadata[key] ?? ""} rows={3} onChange={(event) => update(key, event.target.value)} />
      ) : (
        <input type={options.type ?? "text"} value={metadata[key] ?? ""} onChange={(event) => update(key, event.target.value)} />
      )}
      {options.hint && <small>{options.hint}</small>}
    </label>
  );

  async function upload(file: File) {
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/dev/blog/assets", { method: "POST", body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Upload failed.");
      changeCover(result.url);
    } catch (error) {
      onError(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="studio-settings">
      {field("title", "Article title")}
      {field("description", "Description", { multiline: true })}
      <div className="studio-field-grid">
        {field("category", "Category")}
        <label className="studio-field">
          <span>Tags</span>
          <input value={metadata.tags.join(",")} onChange={(event) => update("tags", event.target.value.split(","))} />
          <small>Separate tags with commas.</small>
        </label>
        {field("date", "Publication date", { type: "date" })}
        {field("updated", "Updated date", { type: "date", optional: true })}
      </div>
      {field("takeaway", "Key takeaway", { multiline: true })}
      <label className="studio-check">
        <Checkbox.Root checked={metadata.draft} onCheckedChange={(value) => update("draft", value === true)}>
          <Checkbox.Indicator><Check size={14} /></Checkbox.Indicator>
        </Checkbox.Root>
        <span>Keep as draft<small>Drafts stay out of the public blog, feed, and sitemap.</small></span>
      </label>
      <Accordion.Root type="multiple" defaultValue={["artwork"]} className="studio-accordion">
        <Accordion.Item value="artwork">
          <Accordion.Header><Accordion.Trigger>Cover image <ChevronDown size={16} /></Accordion.Trigger></Accordion.Header>
          <Accordion.Content>
            <label className="studio-field">
              <span>Cover image path</span>
              <input list="studio-covers" value={metadata.cover} onChange={(event) => changeCover(event.target.value)} />
              <datalist id="studio-covers">{covers.map((cover) => <option key={cover} value={cover} />)}</datalist>
              <small>Choose a local illustration, or upload a new image.</small>
            </label>
            <Button asChild variant="outline" className="studio-upload">
              <label><Upload size={16} />{uploading ? "Uploading…" : "Upload cover"}
                <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={uploading} onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void upload(file);
                  event.target.value = "";
                }} />
              </label>
            </Button>
            <small>PNG, JPEG, WebP or GIF · up to 5 MB</small>
            {field("coverAlt", "Image description", { multiline: true, hint: "Describe the image for readers using a screen reader." })}
            <div className="studio-field-grid">
              {(["coverWidth", "coverHeight"] as const).map((key) => (
                <label className="studio-field" key={key}>
                  <span>{key === "coverWidth" ? "Cover width (px)" : "Cover height (px)"}<small>Optional</small></span>
                  <input type="number" min={1} step={1} value={metadata[key] ?? ""} aria-invalid={!!dimensionError} aria-describedby="studio-cover-dimensions-help" onChange={(event) => update(key, event.target.value === "" ? undefined : Number(event.target.value))} />
                </label>
              ))}
            </div>
            <small id="studio-cover-dimensions-help">Use the image’s original pixel dimensions. Set both or leave both blank. Changing the cover clears them.</small>
            {dimensionError && <p className="studio-error" role="status">{dimensionError}</p>}
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="advanced">
          <Accordion.Header><Accordion.Trigger>Video & source <ChevronDown size={16} /></Accordion.Trigger></Accordion.Header>
          <Accordion.Content>
            {field("youtubeId", "YouTube video ID", { optional: true, hint: "The 11-character video ID. When set, the video replaces the cover in the article header." })}
            {field("source", "Original LinkedIn post", { type: "url", optional: true })}
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  );
}
