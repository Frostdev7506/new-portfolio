import Link from "next/link";
import { fullUrl, serializeJsonLd } from "@/lib/seo";

type BreadcrumbItem = { name: string; href?: string };

export function Breadcrumbs({
  items,
  includeJsonLd = true,
}: {
  items: readonly BreadcrumbItem[];
  includeJsonLd?: boolean;
}) {
  const pagePath = items.at(-1)?.href;
  const structuredData = includeJsonLd && pagePath && items.every((item) => item.href)
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": fullUrl(`${pagePath}#breadcrumb`),
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: fullUrl(item.href ?? "/"),
        })),
      }
    : null;

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
        />
      )}
      <ol>
        {items.map((item, index) => (
          <li key={`${item.name}-${index}`}>
            {index > 0 && <span className="breadcrumb-separator" aria-hidden="true">/</span>}
            {index === items.length - 1 || !item.href ? (
              <span aria-current={index === items.length - 1 ? "page" : undefined} title={item.name}>
                {item.name}
              </span>
            ) : (
              <Link href={item.href}>{item.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
