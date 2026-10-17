import { TextLink } from "@/components/shared/text-link";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";

export default function BlogPostNotFound() {
  return (
    <section className="document-page not-found-page">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
          { name: "Post not found" },
        ]}
        includeJsonLd={false}
      />
      <h1>Post not found</h1>
      <p>
        The article you requested is not available.
      </p>
      <TextLink href="/blog">Back to blog</TextLink>
    </section>
  );
}
