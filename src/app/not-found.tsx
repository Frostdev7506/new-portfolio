import { TextLink } from "@/components/shared/text-link";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";

export default function NotFound() {
  return (
    <section className="document-page not-found-page">
      <Breadcrumbs
        items={[{ name: "Home", href: "/" }, { name: "Page not found" }]}
        includeJsonLd={false}
      />
      <h1>Nothing here just yet.</h1>
      <p>
        This page may have moved, or the link may have taken a wrong turn.
      </p>
      <TextLink href="/">Back home</TextLink>
    </section>
  );
}
