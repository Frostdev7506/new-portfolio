"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { Dialog } from "radix-ui";
import {
  closeImageDialog$,
  imageDialogState$,
  imageUploadHandler$,
  saveImage$,
  useCellValue,
  usePublisher,
  type SaveImageParameters,
} from "@mdxeditor/editor";
import { Button } from "@/components/ui/button";
import { getArticleImageSource } from "@/lib/article-content";

function ImageForm({ initialValues, editing }: {
  initialValues: Omit<SaveImageParameters, "file">;
  editing: boolean;
}) {
  const id = useId();
  const uploadImage = useCellValue(imageUploadHandler$);
  const saveImage = usePublisher(saveImage$);
  const close = usePublisher(closeImageDialog$);
  const [src, setSrc] = useState(initialValues.src ?? "");
  const [altText, setAltText] = useState(initialValues.altText ?? "");
  const [title, setTitle] = useState(initialValues.title ?? "");
  const [file, setFile] = useState<File | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (busy) return;
    setError("");
    setBusy(true);
    try {
      if (file && file.size > 5 * 1024 * 1024) throw new Error("Images must be 5 MB or smaller.");
      if (file && !uploadImage) throw new Error("Image uploads are unavailable.");
      const source = getArticleImageSource(file && uploadImage ? await uploadImage(file) : src.trim());
      if (!source) throw new Error("Choose an image file, a local path beginning with /, or an HTTPS image URL.");
      saveImage({ src: source, altText, title });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not add this image. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog.Root open onOpenChange={(open) => { if (!open && !busy) close(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="studio-dialog-overlay" />
        <Dialog.Content
          className="studio-dialog max-h-[90dvh] overflow-y-auto"
          onEscapeKeyDown={(event) => { if (busy) event.preventDefault(); }}
          onInteractOutside={(event) => { if (busy) event.preventDefault(); }}
        >
          <Dialog.Title>{editing ? "Edit image" : "Insert image"}</Dialog.Title>
          <Dialog.Description>Upload an image or use a local path or HTTPS image URL.</Dialog.Description>
          <form onSubmit={submit} aria-busy={busy}>
            <fieldset disabled={busy}>
              {uploadImage && (
                <div className="studio-field">
                  <label htmlFor={`${id}-file`}>Image file</label>
                  <input
                    id={`${id}-file`}
                    ref={fileInput}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    aria-describedby={`${id}-file-hint`}
                    onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                  />
                  <small id={`${id}-file-hint`}>PNG, JPEG, WebP or GIF, up to 5 MB.</small>
                  {file && <Button type="button" variant="ghost" size="sm" onClick={() => { setFile(null); if (fileInput.current) fileInput.current.value = ""; }}>Remove selected file</Button>}
                </div>
              )}
              <label className="studio-field" htmlFor={`${id}-src`}>
                <span>Image URL or local path</span>
                <input id={`${id}-src`} value={src} disabled={!!file} onChange={(event) => setSrc(event.target.value)} placeholder="/illustrations/example.png or https://…" />
              </label>
              <label className="studio-field" htmlFor={`${id}-alt`}>
                <span>Alternative text</span>
                <input id={`${id}-alt`} value={altText} onChange={(event) => setAltText(event.target.value)} aria-describedby={`${id}-alt-hint`} />
                <small id={`${id}-alt-hint`}>Describe meaningful images. Leave blank only for decoration.</small>
              </label>
              <label className="studio-field" htmlFor={`${id}-title`}>
                <span>Caption / title <small>Optional</small></span>
                <input id={`${id}-title`} value={title} onChange={(event) => setTitle(event.target.value)} />
              </label>
              {error && <p className="studio-error" role="alert">{error}</p>}
              <div className="studio-actions">
                <Dialog.Close asChild><Button type="button" variant="outline">Cancel</Button></Dialog.Close>
                <Button type="submit">{busy ? "Adding image…" : editing ? "Update image" : "Insert image"}</Button>
              </div>
            </fieldset>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function BlogImageDialog() {
  const state = useCellValue(imageDialogState$);
  if (state.type === "inactive") return null;
  return <ImageForm key={state.type === "editing" ? state.nodeKey : "new"} editing={state.type === "editing"} initialValues={state.type === "editing" ? state.initialValues : {}} />;
}
