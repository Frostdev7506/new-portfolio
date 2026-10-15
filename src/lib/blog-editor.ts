import { createHash, randomUUID } from "node:crypto";
import { constants } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { parsePost } from "./post-content.ts";
import { validateAdvancedSeo } from "./blog-seo-validation.ts";
import type {
  BlogEditorMetadata,
  EditorDocument,
  EditorIndex,
} from "./blog-editor-types.ts";

const MAX_DOCUMENT_BYTES = 1024 * 1024;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const requiredStrings = [
  "title", "description", "category", "takeaway", "cover", "coverAlt", "date",
] as const;
const optionalStrings = [
  "seoTitle", "seoDescription", "canonicalUrl", "ogTitle", "ogDescription",
  "ogImage", "ogImageAlt", "twitterTitle", "twitterDescription", "twitterImage",
  "twitterImageAlt", "updated", "source", "youtubeId",
] as const;
const optionalBooleans = ["noindex", "nofollow", "nosnippet"] as const;
const optionalNumbers = ["maxSnippet", "maxVideoPreview", "coverWidth", "coverHeight"] as const;
const optionalEnums = ["maxImagePreview", "twitterCard"] as const;
const metadataKeys = [...requiredStrings, ...optionalStrings, ...optionalBooleans, ...optionalNumbers, ...optionalEnums, "tags", "draft"];

export class BlogEditorError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function developmentOnly() {
  if (process.env.NODE_ENV !== "development") {
    throw new BlogEditorError(404, "Not found.");
  }
}

export function assertEditorRequest(request: Request, mutation = false) {
  developmentOnly();
  const url = new URL(request.url);
  // Next may build request.url with its internal hostname instead of the browser's Host.
  const host = request.headers.get("host") ?? url.host;
  const match = /^(localhost|127\.0\.0\.1|\[::1\])(?::([0-9]{1,5}))?$/i.exec(host);
  if (
    !match || !["http:", "https:"].includes(url.protocol) ||
    (match[2] !== undefined && (Number(match[2]) < 1 || Number(match[2]) > 65535))
  ) {
    throw new BlogEditorError(403, "The blog editor is available on localhost only.");
  }
  const localOrigin = new URL(`${url.protocol}//${host}`).origin;
  const origin = request.headers.get("origin");
  if (
    (mutation && origin !== localOrigin) ||
    (origin !== null && origin !== localOrigin) ||
    request.headers.get("sec-fetch-site") === "cross-site"
  ) {
    throw new BlogEditorError(403, "Open the editor on this site's local development server.");
  }
}

export function editorErrorResponse(error: unknown) {
  if (error instanceof BlogEditorError) {
    return Response.json({ error: error.message }, {
      status: error.status,
      headers: { "Cache-Control": "no-store" },
    });
  }
  console.error("Blog editor request failed", error);
  return Response.json({ error: "The local file operation failed. Your changes were not saved." }, {
    status: 500,
    headers: { "Cache-Control": "no-store" },
  });
}

function checkSlug(slug: string) {
  if (slug.length > 160 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new BlogEditorError(400, "Invalid article slug.");
  }
}

async function safePath(root: string, segments: string[], createDirectories = false) {
  let current = path.resolve(root);
  for (const segment of segments) {
    current = path.join(current, segment);
    if (createDirectories) {
      await fs.mkdir(current).catch((error: NodeJS.ErrnoException) => {
        if (error.code !== "EEXIST") throw error;
      });
    }
    const entry = await fs.lstat(current).catch((error: NodeJS.ErrnoException) => {
      if (error.code === "ENOENT") throw new BlogEditorError(404, "Article or asset not found.");
      throw error;
    });
    if (entry.isSymbolicLink()) {
      throw new BlogEditorError(400, "Symbolic links cannot be edited or uploaded through the blog editor.");
    }
  }
  return current;
}

function documentFromSource(slug: string, source: string): EditorDocument {
  const post = parsePost(source, `${slug}.md`);
  const { data } = matter(source);
  const metadata: BlogEditorMetadata = {
    title: post.title,
    description: post.description,
    category: post.category,
    takeaway: post.takeaway,
    cover: post.cover,
    coverAlt: post.coverAlt,
    date: post.date,
    tags: post.tags,
    draft: post.draft,
  };
  for (const key of optionalStrings) {
    if (data[key] !== undefined && data[key] !== null && data[key] !== "") {
      metadata[key] = post[key];
    }
  }
  for (const key of optionalBooleans) {
    if (data[key] !== undefined) metadata[key] = post[key];
  }
  for (const key of optionalNumbers) {
    if (data[key] !== undefined) metadata[key] = post[key];
  }
  if (data.maxImagePreview !== undefined) metadata.maxImagePreview = post.maxImagePreview;
  if (data.twitterCard !== undefined) metadata.twitterCard = post.twitterCard;
  return {
    slug,
    content: post.content,
    metadata,
    revision: createHash("sha256").update(source).digest("hex"),
  };
}

async function readSource(slug: string, root: string) {
  checkSlug(slug);
  const file = await safePath(root, ["content", "posts", `${slug}.md`]);
  const handle = await fs.open(file, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const stat = await handle.stat();
    if (!stat.isFile()) throw new BlogEditorError(400, "The article must be a regular file.");
    if (stat.size > MAX_DOCUMENT_BYTES) throw new BlogEditorError(413, "The article exceeds the 1 MB editor limit.");
    return { file, source: await handle.readFile("utf8"), mode: stat.mode };
  } finally {
    await handle.close();
  }
}

export async function getEditorDocument(slug: string, root = process.cwd()) {
  developmentOnly();
  const { source } = await readSource(slug, root);
  return documentFromSource(slug, source);
}

export async function getEditorIndex(root = process.cwd()): Promise<EditorIndex> {
  developmentOnly();
  const directory = await safePath(root, ["content", "posts"]);
  const files = (await fs.readdir(directory, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"));
  const results = await Promise.allSettled(files.map(async (entry) => {
    const { slug, metadata } = await getEditorDocument(entry.name.slice(0, -3), root);
    return {
      slug, title: metadata.title, description: metadata.description,
      seoTitle: metadata.seoTitle, seoDescription: metadata.seoDescription, draft: metadata.draft,
    };
  }));
  const posts: EditorIndex["posts"] = [];
  const errors: EditorIndex["errors"] = [];
  results.forEach((result, index) => {
    if (result.status === "fulfilled") posts.push(result.value);
    else {
      const fileName = files[index].name;
      const message = result.reason instanceof Error ? result.reason.message : "Unable to read this article.";
      errors.push({ fileName, message: message.startsWith(`${fileName}: `) ? message.slice(fileName.length + 2) : message });
    }
  });
  const illustrationRoot = await safePath(root, ["public", "illustrations"]);
  const covers: string[] = [];
  async function collect(directory: string, prefix: string) {
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
      if (entry.isDirectory()) await collect(path.join(directory, entry.name), `${prefix}/${entry.name}`);
      if (entry.isFile() && /\.(png|jpe?g|webp|gif|svg)$/i.test(entry.name)) covers.push(`${prefix}/${entry.name}`);
    }
  }
  await collect(illustrationRoot, "/illustrations");
  return { posts: posts.sort((a, b) => a.title.localeCompare(b.title)), covers: covers.sort(), errors };
}

function validatePayload(input: unknown): Pick<EditorDocument, "content" | "metadata" | "revision"> {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new BlogEditorError(400, "Invalid save request.");
  }
  const { content, metadata, revision } = input as Record<string, unknown>;
  if (typeof content !== "string" || !content.trim()) {
    throw new BlogEditorError(400, "The article body cannot be empty.");
  }
  if (typeof revision !== "string" || !/^[a-f0-9]{64}$/.test(revision)) {
    throw new BlogEditorError(400, "Missing or invalid article revision. Reload the article.");
  }
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    throw new BlogEditorError(400, "Article settings are required.");
  }
  const fields = metadata as Record<string, unknown>;
  if (Object.keys(fields).some((key) => !metadataKeys.includes(key))) {
    throw new BlogEditorError(400, "Unrecognized article setting.");
  }
  for (const key of requiredStrings) {
    if (typeof fields[key] !== "string" || !fields[key].trim()) {
      throw new BlogEditorError(400, `The ${key} setting is required.`);
    }
  }
  for (const key of optionalStrings) {
    if (fields[key] !== undefined && typeof fields[key] !== "string") {
      throw new BlogEditorError(400, `The ${key} setting must be text.`);
    }
  }
  try {
    validateAdvancedSeo(fields);
  } catch (error) {
    throw new BlogEditorError(400, error instanceof Error ? error.message : "Invalid advanced SEO setting.");
  }
  if (
    typeof fields.draft !== "boolean" || !Array.isArray(fields.tags) || !fields.tags.length ||
    fields.tags.some((tag) => typeof tag !== "string" || !tag.trim())
  ) {
    throw new BlogEditorError(400, "Draft must be true or false and tags must be a nonempty list of text labels.");
  }
  return { content, metadata: metadata as BlogEditorMetadata, revision };
}

export async function saveEditorDocument(slug: string, input: unknown, root = process.cwd()): Promise<EditorDocument> {
  developmentOnly();
  checkSlug(slug);
  const payload = validatePayload(input);
  if (Buffer.byteLength(JSON.stringify(payload)) > MAX_DOCUMENT_BYTES) {
    throw new BlogEditorError(413, "The article exceeds the 1 MB editor limit.");
  }
  const directory = await safePath(root, ["content", "posts"]);
  const lockPath = path.join(directory, `.${slug}.editor-lock`);
  const lock = await fs.open(lockPath, "wx").catch((error: NodeJS.ErrnoException) => {
    if (error.code === "EEXIST") {
      throw new BlogEditorError(409, "Another save is in progress. Retry shortly. If the server stopped during a save, remove the article's .editor-lock file.");
    }
    throw error;
  });
  let temporary: string | undefined;
  try {
    const { file, source, mode } = await readSource(slug, root);
    const current = documentFromSource(slug, source);
    const originalData = matter(source).data;
    const data = { ...originalData };
    for (const key of metadataKeys) {
      const value = payload.metadata[key as keyof BlogEditorMetadata];
      if (value === undefined || (typeof value === "string" && !value.trim())) delete data[key];
      else data[key] = value;
    }
    let candidate: string;
    let next: EditorDocument;
    try {
      candidate = matter.stringify({ content: payload.content }, data);
      next = documentFromSource(slug, candidate);
    } catch (error) {
      throw new BlogEditorError(400, error instanceof Error ? error.message : "The article is invalid.");
    }
    const unchanged = (current.content === payload.content || current.content === next.content) &&
      JSON.stringify(current.metadata) === JSON.stringify(next.metadata);
    // A retried save after a lost response is safe when the requested document already exists.
    if (unchanged) return current;
    if (payload.revision !== current.revision) {
      throw new BlogEditorError(409, "This article changed on disk. Reload it before saving to avoid overwriting another edit.");
    }
    if (Buffer.byteLength(candidate) > MAX_DOCUMENT_BYTES) {
      throw new BlogEditorError(413, "The article exceeds the 1 MB editor limit.");
    }
    for (const key of ["cover", "ogImage", "twitterImage"] as const) {
      const image = next.metadata[key];
      if (!image) continue;
      const imageParts = image.slice(1).split("/");
      if (imageParts.some((part) => !part || part === "." || part === ".." || part.includes("\\"))) {
        throw new BlogEditorError(400, `The ${key} path is invalid.`);
      }
      const imagePath = await safePath(root, ["public", ...imageParts]);
      if (!(await fs.stat(imagePath)).isFile()) throw new BlogEditorError(400, `Choose an existing ${key} image.`);
    }
    temporary = path.join(directory, `.${slug}.${randomUUID()}.tmp`);
    const handle = await fs.open(temporary, "wx", mode);
    try {
      await handle.writeFile(candidate, "utf8");
      await handle.sync();
    } finally {
      await handle.close();
    }
    // Detect external edits made during validation before replacing the file atomically.
    if (documentFromSource(slug, (await readSource(slug, root)).source).revision !== current.revision) {
      throw new BlogEditorError(409, "This article changed on disk during the save. Reload it before saving.");
    }
    await fs.rename(temporary, file);
    temporary = undefined;
    return next;
  } finally {
    if (temporary) await fs.unlink(temporary).catch(() => {});
    await lock.close();
    await fs.unlink(lockPath);
  }
}

export async function readEditorBody(request: Request, limit = MAX_DOCUMENT_BYTES) {
  const length = Number(request.headers.get("content-length"));
  if (length > limit) throw new BlogEditorError(413, "The upload or article is too large.");
  const reader = request.body?.getReader();
  if (!reader) throw new BlogEditorError(400, "A request body is required.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) {
        await reader.cancel();
        throw new BlogEditorError(413, "The upload or article is too large.");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(chunks);
}

export async function readEditorJson(request: Request) {
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") {
    throw new BlogEditorError(415, "Save requests must use application/json.");
  }
  const bytes = await readEditorBody(request);
  try {
    return JSON.parse(bytes.toString("utf8")) as unknown;
  } catch {
    throw new BlogEditorError(400, "The save request contains invalid JSON.");
  }
}

export async function uploadEditorImage(request: Request, root = process.cwd()) {
  assertEditorRequest(request, true);
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.startsWith("multipart/form-data;")) {
    throw new BlogEditorError(415, "Use an image file upload.");
  }
  const bytes = await readEditorBody(request, MAX_IMAGE_BYTES + 64 * 1024);
  let form: FormData;
  try {
    form = await new Response(bytes, { headers: { "Content-Type": contentType } }).formData();
  } catch {
    throw new BlogEditorError(400, "Invalid image upload.");
  }
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) throw new BlogEditorError(400, "Choose an image to upload.");
  if (file.size > MAX_IMAGE_BYTES) throw new BlogEditorError(413, "Images must be 5 MB or smaller.");
  const image = Buffer.from(await file.arrayBuffer());
  let extension: string | undefined;
  if (image.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) extension = "png";
  else if (image[0] === 255 && image[1] === 216 && image[2] === 255) extension = "jpg";
  else if (["GIF87a", "GIF89a"].includes(image.subarray(0, 6).toString("ascii"))) extension = "gif";
  else if (image.subarray(0, 4).toString("ascii") === "RIFF" && image.subarray(8, 12).toString("ascii") === "WEBP") extension = "webp";
  if (!extension) throw new BlogEditorError(400, "Upload a PNG, JPEG, GIF, or WebP image. SVG and other file formats are not accepted.");
  const directory = await safePath(root, ["public", "illustrations", "blog"], true);
  const name = `${randomUUID()}.${extension}`;
  await fs.writeFile(path.join(directory, name), image, { flag: "wx", mode: 0o644 });
  return { url: `/illustrations/blog/${name}` };
}
