export function getNewsletterUrl(value: string | undefined): string {
  if (!value?.trim()) return "";

  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" && !url.username && !url.password
      ? url.href
      : "";
  } catch {
    return "";
  }
}
