"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { Tabs, ToggleGroup, AlertDialog } from "radix-ui";
import { ArrowUpRight, Download, RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EditorDocument, EditorIndex } from "@/lib/blog-editor-types";
import { serializeEditorDocument } from "@/lib/blog-editor-export";
import { removeMatchingRecovery } from "@/lib/blog-editor-recovery";
import { ArticleSettings } from "./article-settings";
import { SeoSettings } from "./seo-settings";
import { ArticlePreview } from "./article-preview";

const RichTextEditor = dynamic(() => import("./rich-text-editor"), {
  ssr: false,
  loading: () => <p className="studio-loading">Loading writing tools…</p>,
});

const recoveryKey = (slug: string) => `blog-studio:${slug}`;
const sameContent = (a: EditorDocument, b: EditorDocument) =>
  a.content === b.content && JSON.stringify(a.metadata) === JSON.stringify(b.metadata);

function isRecoveryDocument(value: unknown): value is EditorDocument {
  if (!value || typeof value !== "object") return false;
  const item = value as EditorDocument;
  if (typeof item.slug !== "string" || typeof item.content !== "string" || typeof item.revision !== "string" || !/^[a-f0-9]{64}$/.test(item.revision)) return false;
  const fields = item.metadata;
  return !!fields && typeof fields.draft === "boolean" && Array.isArray(fields.tags) && fields.tags.every((tag) => typeof tag === "string") &&
    ["title", "description", "category", "takeaway", "cover", "coverAlt", "date"].every((key) => typeof fields[key as keyof typeof fields] === "string") &&
    ["noindex", "nofollow", "nosnippet"].every((key) => fields[key as keyof typeof fields] === undefined || typeof fields[key as keyof typeof fields] === "boolean") &&
    ["maxSnippet", "maxVideoPreview", "coverWidth", "coverHeight"].every((key) => fields[key as keyof typeof fields] === undefined || typeof fields[key as keyof typeof fields] === "number") &&
    ["seoTitle", "seoDescription", "canonicalUrl", "ogTitle", "ogDescription", "ogImage", "ogImageAlt", "twitterTitle", "twitterDescription", "twitterImage", "twitterImageAlt", "twitterCard", "maxImagePreview", "updated", "source", "youtubeId"].every((key) => fields[key as keyof typeof fields] === undefined || typeof fields[key as keyof typeof fields] === "string");
}

export function ArticleEditor({ initial, covers, posts, onDirtyChange, onSaved }: {
  initial: EditorDocument;
  covers: string[];
  posts: EditorIndex["posts"];
  onDirtyChange: (dirty: boolean) => void;
  onSaved: (document: EditorDocument) => void;
}) {
  const [saved, setSaved] = useState(initial);
  const [draft, setDraft] = useState(initial);
  const [generation, setGeneration] = useState(0);
  const [mode, setMode] = useState("write");
  const [error, setError] = useState("");
  const [editorError, setEditorError] = useState("");
  const [status, setStatus] = useState("All changes saved to file");
  const [busy, setBusy] = useState(false);
  const saving = useRef(false);
  const [recovery, setRecovery] = useState<EditorDocument | null>(null);
  const ownedRecovery = useRef<string | null>(null);
  const [recoveryChecked, setRecoveryChecked] = useState(false);
  const [storageError, setStorageError] = useState("");
  const [reloadOpen, setReloadOpen] = useState(false);
  const dirty = !sameContent(saved, draft);

  useEffect(() => { onDirtyChange(dirty); }, [dirty, onDirtyChange]);
  useEffect(() => {
    try {
      const source = localStorage.getItem(recoveryKey(initial.slug));
      if (source) {
        const value: unknown = JSON.parse(source);
        if (isRecoveryDocument(value) && value.slug === initial.slug && !sameContent(value, initial)) {
          ownedRecovery.current = source;
          // Defer until mounted; recovery is never restored over the file automatically.
          queueMicrotask(() => setRecovery(value));
        }
      }
    } catch { queueMicrotask(() => setStorageError("Browser recovery is unavailable. Save or export your edits before leaving.")); }
    queueMicrotask(() => setRecoveryChecked(true));
  }, [initial]);

  useEffect(() => {
    if (!recoveryChecked || recovery) return;
    try {
      if (dirty) {
        const source = JSON.stringify(draft);
        localStorage.setItem(recoveryKey(draft.slug), source);
        ownedRecovery.current = source;
      } else {
        removeMatchingRecovery(localStorage, recoveryKey(draft.slug), ownedRecovery.current);
        ownedRecovery.current = null;
      }
    } catch { queueMicrotask(() => setStorageError("Browser recovery is unavailable. Save or export your edits before leaving.")); }
  }, [draft, dirty, recovery, recoveryChecked]);

  const save = useCallback(async () => {
    if (saving.current || !dirty || recovery) return;
    saving.current = true;
    setBusy(true);
    setError("");
    const snapshot = draft;
    try {
      const response = await fetch(`/api/dev/blog/${snapshot.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: snapshot.content, metadata: snapshot.metadata, revision: snapshot.revision }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not save the article.");
      const next = result as EditorDocument;
      setSaved(next);
      setDraft((current) => sameContent(current, snapshot) ? next : { ...current, revision: next.revision });
      setStatus(`Saved to file at ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`);
      onSaved(next);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save. Your edits are still here.");
    } finally {
      saving.current = false;
      setBusy(false);
    }
  }, [dirty, draft, onSaved, recovery]);

  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void save();
      }
    };
    window.addEventListener("keydown", keydown, true);
    return () => window.removeEventListener("keydown", keydown, true);
  }, [save]);

  async function reload() {
    if (saving.current) return;
    saving.current = true;
    setBusy(true);
    try {
      const response = await fetch(`/api/dev/blog/${draft.slug}`, { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not reload.");
      setSaved(result);
      setDraft(result);
      onSaved(result);
      setGeneration((value) => value + 1);
      setRecovery(null);
      setError("");
      setEditorError("");
      setStatus("Loaded latest file");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not reload.");
    } finally { saving.current = false; setBusy(false); }
  }

  function download(document: EditorDocument) {
    const url = URL.createObjectURL(new Blob([serializeEditorDocument(document)], { type: "text/markdown" }));
    const link = window.document.createElement("a");
    link.href = url;
    link.download = `${document.slug}.md`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className="studio-document">
      <header className="studio-document-header">
        <div><p className="studio-file">{draft.slug}.md</p><p role="status" className="studio-save-status">{busy ? "Working…" : dirty ? "Unsaved changes" : status}</p></div>
        <div className="studio-actions">
          <Button variant="ghost" title="Download your current edits as Markdown" aria-label="Export article as Markdown" onClick={() => download(draft)}><Download size={16} aria-hidden="true" /><span className="studio-action-label">Export</span></Button>
          <Button variant="outline" disabled={busy || !!recovery} onClick={() => dirty ? setReloadOpen(true) : void reload()}><RotateCcw size={16} aria-hidden="true" />Reload file</Button>
          <Button disabled={!dirty || busy || !!recovery} onClick={() => void save()}><Save size={16} aria-hidden="true" />{busy ? "Saving…" : "Save changes"}</Button>
        </div>
      </header>
      {recovery && <div className="studio-notice">
        <p><strong>Unsaved edits found in this browser.</strong> Restore them to continue writing. {recovery.revision !== saved.revision && "The file has changed since these edits; export them before reloading if a save conflicts."}</p>
        <div className="studio-actions">
          <Button variant="outline" onClick={() => { setDraft(recovery); setRecovery(null); setGeneration((value) => value + 1); }}>Restore edits</Button>
          <Button variant="ghost" onClick={() => download(recovery)}>Export recovered edits</Button>
          <Button variant="ghost" onClick={() => setRecovery(null)}>Discard recovery</Button>
        </div>
      </div>}
      {error && <div className="studio-error" role="alert">{error}<p>Your edits are still here. For a file conflict, export your edits, then reload the latest file and merge your changes.</p></div>}
      {editorError && <p className="studio-error" role="alert">{editorError}</p>}
      {storageError && <p className="studio-notice" role="status">{storageError}</p>}
      <div inert={busy || !!recovery || !recoveryChecked} aria-busy={busy}>
      <Tabs.Root defaultValue="content">
        <div className="studio-modebar">
          <Tabs.List aria-label="Article editing sections"><Tabs.Trigger value="content">Content</Tabs.Trigger><Tabs.Trigger value="settings">Article details</Tabs.Trigger><Tabs.Trigger value="seo">SEO</Tabs.Trigger></Tabs.List>
          <a href={`/blog/${draft.slug}`} target="_blank" rel="noreferrer">Open saved article <ArrowUpRight size={14} aria-hidden="true" /></a>
        </div>
        <Tabs.Content value="content" forceMount className="studio-tab-content">
          <div className="studio-writing-controls">
            <p>Write naturally. Select text to format it.</p>
            <ToggleGroup.Root type="single" value={mode} onValueChange={(value) => value && setMode(value)} aria-label="Writing view">
              <ToggleGroup.Item value="write">Write</ToggleGroup.Item>
              <ToggleGroup.Item value="split">Split</ToggleGroup.Item>
              <ToggleGroup.Item value="preview">Preview</ToggleGroup.Item>
            </ToggleGroup.Root>
          </div>
          <div className={`studio-canvas studio-canvas-${mode}`}>
            <div className="studio-writing-pane" hidden={mode === "preview"}>
              <RichTextEditor key={`${draft.slug}:${generation}`} content={draft.content} onChange={(content) => { setDraft((current) => ({ ...current, content })); setEditorError(""); }} onError={setEditorError} />
            </div>
            {mode !== "write" && <ArticlePreview document={draft} />}
          </div>
        </Tabs.Content>
        <Tabs.Content value="settings" forceMount className="studio-tab-content">
          <div className="studio-details-layout">
            <ArticleSettings metadata={draft.metadata} covers={covers} onChange={(metadata) => setDraft((current) => ({ ...current, metadata: { ...current.metadata, ...metadata } }))} onError={setError} />
            <ArticlePreview document={draft} />
          </div>
        </Tabs.Content>
        <Tabs.Content value="seo" forceMount className="studio-tab-content">
          <SeoSettings document={draft} covers={covers} posts={posts} onChange={(metadata) => setDraft((current) => ({ ...current, metadata: { ...current.metadata, ...metadata } }))} onError={setError} />
        </Tabs.Content>
      </Tabs.Root>
      </div>
      <AlertDialog.Root open={reloadOpen} onOpenChange={setReloadOpen}>
        <AlertDialog.Portal><AlertDialog.Overlay className="studio-dialog-overlay" /><AlertDialog.Content className="studio-dialog">
          <AlertDialog.Title>Reload the saved article?</AlertDialog.Title>
          <AlertDialog.Description>This replaces your unsaved edits with the latest file. Export first if you want to keep a copy.</AlertDialog.Description>
          <div className="studio-actions"><AlertDialog.Cancel asChild><Button variant="outline">Keep editing</Button></AlertDialog.Cancel><AlertDialog.Action asChild><Button onClick={() => void reload()}>Reload file</Button></AlertDialog.Action></div>
        </AlertDialog.Content></AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  );
}
