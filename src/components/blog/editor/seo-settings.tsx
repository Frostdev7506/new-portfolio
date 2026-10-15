"use client";

import Image from "next/image";
import { useDeferredValue, useMemo, useState } from "react";
import { Accordion, Checkbox, Tabs } from "radix-ui";
import { Check, ChevronDown, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/blog/copy-button";
import { siteConfig } from "@/data/site";
import { getArticleImageSource, getArticleStructure } from "@/lib/article-content";
import { isBlogPostInSitemap, resolveBlogAppearance, resolveBlogSeo } from "@/lib/blog-seo";
import { validateAdvancedSeo, validateArticleDates, validateCanonicalUrl, validateCoverDimensions, validateSocialImage } from "@/lib/blog-seo-validation";
import { getBlogSeoChecks } from "@/lib/blog-seo-checks";
import type { BlogEditorMetadata, EditorDocument, EditorIndex } from "@/lib/blog-editor-types";
import { SeoAdvancedSettings } from "./seo-advanced-settings";
import { StudioSelect } from "./studio-select";

type Props = {
  document: EditorDocument;
  covers: string[];
  posts: EditorIndex["posts"];
  onChange: (metadata: Partial<BlogEditorMetadata>) => void;
  onError: (message: string) => void;
};
type SeoTextField = "seoTitle" | "seoDescription" | "canonicalUrl" | "ogTitle" | "ogDescription" | "ogImageAlt" | "twitterTitle" | "twitterDescription" | "twitterImageAlt";
type SocialImageField = "ogImage" | "twitterImage";
const rasterImage = /\.(png|jpe?g|webp|gif)$/i;

function SocialPreview({ title, description, src, alt, compact = false }: { title: string; description: string; src: string; alt: string; compact?: boolean }) {
  const [image, setImage] = useState<{ width: number; height: number; failed?: boolean } | null>(null);
  const source = getArticleImageSource(src);
  return <>
    <div className={`studio-social-preview ${compact ? "studio-social-compact" : ""}`}>
      {source && <Image src={source} alt={alt} width={1200} height={630} unoptimized className="studio-social-image" onLoad={(event) => setImage({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight })} onError={() => setImage({ width: 0, height: 0, failed: true })} />}
      <div><small>{new URL(siteConfig.url).hostname}</small><p className="studio-social-title">{title}</p><p>{description}</p></div>
    </div>
    {image?.failed ? <p className="studio-help" role="status">Image could not be loaded. Check its path before saving.</p> : image && <p className="studio-help">Image: {image.width} × {image.height}px{image.width < (compact ? 144 : 300) ? " · too small for this card format" : ""}. Services may crop it differently.</p>}
  </>;
}

export function SeoSettings({ document, covers, posts, onChange, onError }: Props) {
  const deferred = useDeferredValue(document);
  const { metadata } = document;
  const [uploading, setUploading] = useState<SocialImageField | null>(null);
  const structure = useMemo(() => {
    try { return { wordCount: getArticleStructure(deferred.content).wordCount, error: "" }; }
    catch (cause) { return { wordCount: 0, error: cause instanceof Error ? cause.message : "Check the article content." }; }
  }, [deferred.content]);
  const audit = useMemo(() => getBlogSeoChecks(deferred, siteConfig, posts), [deferred, posts]);
  const issues = audit.checks.filter((check) => check.status !== "pass");
  const appearance = useMemo(() => {
    try { return resolveBlogAppearance(metadata, siteConfig); }
    catch { return null; }
  }, [metadata]);
  const preview = useMemo(() => {
    try {
      if (structure.error) throw new Error(structure.error);
      const post = {
        ...metadata, slug: document.slug, title: metadata.title.trim(), description: metadata.description.trim(),
        cover: metadata.cover.trim(), coverAlt: metadata.coverAlt.trim(), category: metadata.category.trim(),
        tags: metadata.tags.map((tag) => tag.trim()).filter(Boolean), date: metadata.date.trim(),
        updated: metadata.updated?.trim() || metadata.date.trim(), wordCount: structure.wordCount,
      };
      if (!post.title || !post.description || !post.cover || !post.coverAlt) throw new Error("Complete the article title, description, cover, and image description in Article details.");
      validateArticleDates(post.date, post.updated);
      validateAdvancedSeo(metadata);
      validateCoverDimensions(metadata.coverWidth, metadata.coverHeight);
      if (metadata.canonicalUrl?.trim()) validateCanonicalUrl(metadata.canonicalUrl.trim());
      if (metadata.ogImage?.trim()) validateSocialImage(metadata.ogImage.trim(), metadata.ogImageAlt?.trim() || "");
      if (metadata.twitterImage?.trim()) validateSocialImage(metadata.twitterImage.trim(), metadata.twitterImageAlt?.trim() || "", "twitterImage");
      return { seo: resolveBlogSeo(post, siteConfig), inSitemap: isBlogPostInSitemap(post, siteConfig), error: "" };
    } catch (cause) {
      return { seo: null, inSitemap: false, error: cause instanceof Error ? cause.message : "Complete valid article details to preview SEO output." };
    }
  }, [metadata, document.slug, structure]);
  const { seo } = preview;
  const permalink = `${siteConfig.url.replace(/\/+$/, "")}/blog/${document.slug}`;
  const searchTitle = metadata.seoTitle?.trim() || `${metadata.title.trim()} | ${siteConfig.name}`;
  const searchDescription = metadata.seoDescription?.trim() || metadata.description.trim();
  const field = (key: SeoTextField, label: string, placeholder: string, options: { multiline?: boolean; hint?: string; count?: number; type?: string } = {}) => (
    <div className="studio-field" key={key}>
      <label htmlFor={`seo-${key}`}>{label}<small>{options.count === undefined ? "Optional" : `${options.count} characters`}</small></label>
      {options.multiline ? (
        <textarea id={`seo-${key}`} aria-describedby={options.hint ? `seo-${key}-hint` : undefined} value={metadata[key] ?? ""} placeholder={placeholder} rows={3} onChange={(event) => onChange({ [key]: event.target.value })} />
      ) : (
        <input id={`seo-${key}`} aria-describedby={options.hint ? `seo-${key}-hint` : undefined} type={options.type ?? "text"} value={metadata[key] ?? ""} placeholder={placeholder} onChange={(event) => onChange({ [key]: event.target.value })} />
      )}
      {options.hint && <small id={`seo-${key}-hint`}>{options.hint}</small>}
    </div>
  );

  async function upload(file: File, key: SocialImageField) {
    setUploading(key);
    try {
      const body = new FormData(); body.append("file", file);
      const response = await fetch("/api/dev/blog/assets", { method: "POST", body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Upload failed.");
      onChange({ [key]: result.url });
    } catch (cause) { onError(cause instanceof Error ? cause.message : "Upload failed."); }
    finally { setUploading(null); }
  }
  const imageField = (key: SocialImageField, label: string, placeholder: string) => <div key={key}>
    <div className="studio-field">
      <label htmlFor={`seo-${key}`}>{label}<small>Optional</small></label>
      <input id={`seo-${key}`} list="studio-social-images" placeholder={placeholder} value={metadata[key] ?? ""} onChange={(event) => onChange({ [key]: event.target.value })} aria-describedby={`seo-${key}-hint`} />
      <small id={`seo-${key}-hint`}>Choose an existing PNG, JPEG, WebP or GIF. SVG artwork can remain in the article; use a raster image for sharing.</small>
    </div>
    <Button asChild variant="outline" className="studio-upload"><label><Upload size={16} />{uploading === key ? "Uploading…" : `Upload ${key === "ogImage" ? "social" : "X"} image`}<input type="file" aria-label={`Upload ${key === "ogImage" ? "social" : "X"} image`} accept="image/png,image/jpeg,image/webp,image/gif" disabled={uploading !== null} onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file, key); event.target.value = ""; }} /></label></Button>
    <small className="studio-upload-help">Up to 5 MB. Use a landscape image around 1200 × 630 for large cards.</small>
  </div>;

  return (
    <div className="studio-seo-layout">
      <datalist id="studio-social-images">{covers.filter((cover) => rasterImage.test(cover)).map((cover) => <option key={cover} value={cover} />)}</datalist>
      <div className="studio-settings">
        <section className="studio-seo-section" aria-labelledby="studio-search-heading">
          <h2 id="studio-search-heading">Search appearance</h2>
          <p>Blank fields use the article title and description. Keep the wording specific to this article.</p>
          {field("seoTitle", "SEO title", `${metadata.title} | ${siteConfig.name}`, { count: searchTitle.length, hint: "An override is used exactly as written, without the site name appended." })}
          {field("seoDescription", "Meta description", metadata.description, { multiline: true, count: searchDescription.length, hint: "Summarize the page clearly. Search engines may choose a different snippet." })}
        </section>
        <section className="studio-seo-section" aria-labelledby="studio-social-heading">
          <h2 id="studio-social-heading">Social sharing</h2>
          <p>Open Graph cards reuse search text and the article cover unless you set an override. X/Twitter inherits these settings by default.</p>
          {field("ogTitle", "Social title", searchTitle)}
          {field("ogDescription", "Social description", searchDescription, { multiline: true })}
          {imageField("ogImage", "Social image path", metadata.cover)}
          {field("ogImageAlt", "Social image description", metadata.coverAlt, { multiline: true, hint: "Describe the image. Required when you choose a custom social image." })}
          <Accordion.Root type="single" collapsible className="studio-accordion">
            <Accordion.Item value="twitter"><Accordion.Header><Accordion.Trigger>X / Twitter overrides <ChevronDown size={16} /></Accordion.Trigger></Accordion.Header><Accordion.Content>
              <StudioSelect id="seo-twitter-card" label="X card layout" value={metadata.twitterCard ?? "default"} onChange={(value) => onChange({ twitterCard: value === "default" ? undefined : value as BlogEditorMetadata["twitterCard"] })} options={[{ value: "default", label: "Site default · Large image" }, { value: "summary_large_image", label: "Large image" }, { value: "summary", label: "Summary · Square thumbnail" }]} />
              {field("twitterTitle", "X title", appearance?.social.title || searchTitle)}
              {field("twitterDescription", "X description", appearance?.social.description || searchDescription, { multiline: true })}
              {imageField("twitterImage", "X image path", metadata.ogImage || metadata.cover)}
              {field("twitterImageAlt", "X image description", appearance?.social.imageAlt || metadata.coverAlt, { multiline: true, hint: "Required for a custom X image. Otherwise inherits the social image description." })}
              <Button variant="ghost" onClick={() => onChange({ twitterCard: undefined, twitterTitle: undefined, twitterDescription: undefined, twitterImage: undefined, twitterImageAlt: undefined })}>Use shared social settings</Button>
            </Accordion.Content></Accordion.Item>
          </Accordion.Root>
        </section>
        <section className="studio-seo-section" aria-labelledby="studio-indexing-heading">
          <h2 id="studio-indexing-heading">Canonical & indexing</h2>
          <p>The canonical URL identifies the preferred version when the same article appears at multiple URLs.</p>
          {field("canonicalUrl", "Canonical URL", permalink, { type: "url", hint: "Leave blank for this article’s URL. Use a full HTTPS URL without a fragment. An alternate canonical removes this URL from the sitemap." })}
          <label className="studio-check"><Checkbox.Root checked={metadata.noindex ?? false} onCheckedChange={(value) => onChange({ noindex: value === true })}><Checkbox.Indicator><Check size={14} /></Checkbox.Indicator></Checkbox.Root><span>Exclude from search engines<small>Adds noindex and removes the article from the sitemap. The page stays publicly accessible; use Draft to hide it from the public blog.</small></span></label>
          <Accordion.Root type="single" collapsible className="studio-accordion">
            <Accordion.Item value="robots"><Accordion.Header><Accordion.Trigger>Advanced search controls <ChevronDown size={16} /></Accordion.Trigger></Accordion.Header><Accordion.Content><SeoAdvancedSettings metadata={metadata} onChange={onChange} /></Accordion.Content></Accordion.Item>
          </Accordion.Root>
        </section>
      </div>
      <aside className="studio-seo-previews" aria-label="SEO previews">
        <div className="studio-seo-intro"><span className="studio-preview-label">Live SEO preview</span><p>Reflects your current edits. Save to update the file, then deploy to publish. Search and social services may choose different text and crops.</p></div>
        <section className="studio-seo-card studio-seo-checks" aria-label="Content checks">
          <h3>Content checks · {audit.wordCount} words</h3>
          <p className="studio-help">{issues.length ? `${issues.length} item${issues.length === 1 ? "" : "s"} to review` : "No issues found in these checks"}. Editorial guidance, not a ranking score.</p>
          <Accordion.Root type="multiple" className="studio-accordion">
            <Accordion.Item value="checks"><Accordion.Header><Accordion.Trigger>Review checks <ChevronDown size={16} /></Accordion.Trigger></Accordion.Header><Accordion.Content>
              <ul>{audit.checks.map((check) => <li key={check.id} data-status={check.status}><strong><span>{check.status === "pass" ? "Pass" : check.status === "error" ? "Fix" : "Review"}</span> {check.label}</strong><p>{check.detail}</p></li>)}</ul>
              <p className="studio-help">External URLs are not fetched. Check linked sources and live search results separately.</p>
            </Accordion.Content></Accordion.Item>
            <Accordion.Item value="outline"><Accordion.Header><Accordion.Trigger>Heading outline <ChevronDown size={16} /></Accordion.Trigger></Accordion.Header><Accordion.Content><ol className="studio-heading-outline">{audit.headings.map((heading) => <li key={heading.id}><span>H{heading.depth}</span> {heading.text}</li>)}</ol>{!audit.headings.length && <p className="studio-help">No section headings yet.</p>}</Accordion.Content></Accordion.Item>
          </Accordion.Root>
        </section>
        <section className="studio-seo-card" aria-labelledby="studio-search-preview-heading">
          <h3 id="studio-search-preview-heading">Search result</h3>
          {(metadata.noindex || metadata.draft) && <p className="studio-help">Search indexing is disabled for this article.</p>}
          <p className="studio-search-url">{permalink}</p><p className="studio-search-title">{searchTitle}</p>
          <p className="studio-search-description">{metadata.nosnippet || metadata.maxSnippet === 0 ? "Text snippets are disabled by your search controls." : searchDescription}</p>
        </section>
        {appearance && <section className="studio-seo-card studio-social-card" aria-label="Social card preview">
          <Tabs.Root defaultValue="og"><Tabs.List className="studio-preview-tabs" aria-label="Social preview platform"><Tabs.Trigger value="og">Open Graph</Tabs.Trigger><Tabs.Trigger value="twitter">X / Twitter</Tabs.Trigger></Tabs.List>
            <Tabs.Content value="og"><SocialPreview key={`og:${metadata.ogImage || metadata.cover}`} title={appearance.social.title} description={appearance.social.description} src={metadata.ogImage?.trim() || metadata.cover} alt={appearance.social.imageAlt} /></Tabs.Content>
            <Tabs.Content value="twitter"><SocialPreview key={`twitter:${metadata.twitterImage || metadata.ogImage || metadata.cover}`} title={appearance.twitter.title} description={appearance.twitter.description} src={metadata.twitterImage?.trim() || metadata.ogImage?.trim() || metadata.cover} alt={appearance.twitter.imageAlt} compact={appearance.twitter.card === "summary"} /></Tabs.Content>
          </Tabs.Root>
        </section>}
        {preview.error && <p className="studio-notice" role="status">Page output is paused: {preview.error}</p>}
        {seo && <>
          <section className="studio-seo-card" aria-labelledby="studio-output-heading">
            <h3 id="studio-output-heading">Page output</h3>
            <dl className="studio-seo-output">
              <dt>Canonical</dt><dd>{seo.canonicalUrl}</dd><dt>Robots</dt><dd>{seo.robotsContent}</dd>
              <dt>Sitemap</dt><dd>{preview.inSitemap ? "Included" : "Excluded"}{metadata.draft ? " · article is a draft" : ""}</dd>
              <dt>Open Graph image</dt><dd>{seo.social.image}</dd><dt>X card</dt><dd>{seo.twitter.card}</dd><dt>X image</dt><dd>{seo.twitter.image}</dd>{seo.twitter.creator && <><dt>X creator</dt><dd>{seo.twitter.creator}</dd></>}
              <dt>Author · language</dt><dd>{siteConfig.name} · {siteConfig.language}</dd><dt>Published · modified</dt><dd>{seo.publishedTime.slice(0, 10)} · {seo.modifiedTime.slice(0, 10)}</dd>
              <dt>Category · tags</dt><dd>{metadata.category} · {metadata.tags.filter((tag) => tag.trim()).join(", ")}</dd>
            </dl>
          </section>
          <Accordion.Root type="single" collapsible className="studio-accordion studio-schema"><Accordion.Item value="schema">
            <Accordion.Header><Accordion.Trigger>Structured data · JSON-LD <ChevronDown size={16} /></Accordion.Trigger></Accordion.Header><Accordion.Content>
              <p>BlogPosting and BreadcrumbList use visible article content and the site author. Update the source fields in Article details and Content. Structured data does not guarantee a rich result.</p>
              <CopyButton text={JSON.stringify(seo.jsonLd, null, 2)} label="Copy JSON-LD" /><pre aria-label="Generated JSON-LD">{JSON.stringify(seo.jsonLd, null, 2)}</pre>
            </Accordion.Content>
          </Accordion.Item></Accordion.Root>
        </>}
      </aside>
    </div>
  );
}
