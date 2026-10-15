export function validateCanonicalUrl(value: string): void {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("canonicalUrl must be an absolute HTTPS URL");
  }
  if (
    url.protocol !== "https:" || !/^https:\/\/[^/?#@\\\s]+(?:[/?#]|$)/i.test(value) ||
    url.username || url.password || /[\s\\#]/.test(value)
  ) {
    throw new Error("canonicalUrl must be HTTPS without credentials, whitespace, or a fragment");
  }
}

export function validateSocialImage(image: string, alt: string, field: "ogImage" | "twitterImage" = "ogImage"): void {
  if (!image.startsWith("/illustrations/") || image.includes("..")) {
    throw new Error(`${field} must be a local illustration`);
  }
  if (
    /[\s\\?#\u0000-\u001f\u007f]/.test(image) ||
    image.slice(1).split("/").some((part) => !part || part === ".")
  ) {
    throw new Error(`The ${field} path is invalid.`);
  }
  if (!/\.(png|jpe?g|webp|gif)$/i.test(image)) {
    throw new Error(`${field} must use a PNG, JPEG, WebP, or GIF image`);
  }
  if (!alt.trim()) {
    throw new Error(`${field}Alt is required for a custom social image`);
  }
}

export function validateAdvancedSeo(fields: {
  noindex?: unknown;
  nofollow?: unknown;
  nosnippet?: unknown;
  maxSnippet?: unknown;
  maxImagePreview?: unknown;
  maxVideoPreview?: unknown;
  twitterCard?: unknown;
}): void {
  for (const key of ["noindex", "nofollow", "nosnippet"] as const) {
    if (fields[key] !== undefined && typeof fields[key] !== "boolean") {
      throw new Error(`${key} must be true or false`);
    }
  }
  for (const key of ["maxSnippet", "maxVideoPreview"] as const) {
    const value = fields[key];
    if (value !== undefined && (typeof value !== "number" || !Number.isSafeInteger(value) || value < -1)) {
      throw new Error(`${key} must be -1 or a nonnegative whole number`);
    }
  }
  if (fields.maxImagePreview !== undefined && !["none", "standard", "large"].includes(fields.maxImagePreview as string)) {
    throw new Error("maxImagePreview must be none, standard, or large");
  }
  if (fields.twitterCard !== undefined && !["summary", "summary_large_image"].includes(fields.twitterCard as string)) {
    throw new Error("twitterCard must be summary or summary_large_image");
  }
}

export function validateArticleDates(date: string, updated?: string): void {
  for (const [key, value] of [["date", date], ["updated", updated]] as const) {
    if (value === undefined) continue;
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
      !Number.isFinite(Date.parse(value)) ||
      new Date(value).toISOString().slice(0, 10) !== value
    ) {
      throw new Error(`invalid ${key}: use a valid YYYY-MM-DD date`);
    }
  }
  if (updated && updated < date) {
    throw new Error("updated precedes publication");
  }
}

export function validateCoverDimensions(width: unknown, height: unknown): void {
  if (
    (width !== undefined || height !== undefined) &&
    (typeof width !== "number" || !Number.isSafeInteger(width) || width <= 0 ||
      typeof height !== "number" || !Number.isSafeInteger(height) || height <= 0)
  ) {
    throw new Error("coverWidth and coverHeight must be positive integers supplied together");
  }
}
