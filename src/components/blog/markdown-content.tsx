import Image from "next/image";
import { Link as LinkIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import { toString } from "hast-util-to-string";
import type { ComponentPropsWithoutRef } from "react";
import { parseDiagram } from "@/lib/article-content";
import { ArticleDiagram } from "./article-diagram";
import { CopyButton } from "./copy-button";

function Heading({
  level,
  id,
  children,
}: ComponentPropsWithoutRef<"h2"> & { level: 2 | 3 }) {
  const Tag = level === 2 ? "h2" : "h3";
  return (
    <Tag id={id}>
      {children}
      <a
        className="heading-anchor"
        href={`#${id}`}
        aria-label={`Link to section: ${id?.replace(/-/g, " ")}`}
      >
        <LinkIcon aria-hidden="true" />
      </a>
    </Tag>
  );
}

export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose-custom">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeSlug,
          [rehypeHighlight, { ignoreMissing: true, detect: false }],
        ]}
        components={{
          h2: ({ id, children }) => (
            <Heading level={2} id={id}>
              {children}
            </Heading>
          ),
          h3: ({ id, children }) => (
            <Heading level={3} id={id}>
              {children}
            </Heading>
          ),
          pre: ({ node, children }) => {
            const code = node?.children.find(
              (child) => child.type === "element" && child.tagName === "code",
            );
            const classes =
              code?.type === "element" ? code.properties.className : [];
            const language = Array.isArray(classes)
              ? String(
                  classes.find((name) =>
                    String(name).startsWith("language-"),
                  ) || "",
                ).replace("language-", "")
              : "";
            const text = code ? toString(code).replace(/\n$/, "") : "";
            if (language === "diagram")
              return <ArticleDiagram diagram={parseDiagram(text)} />;
            return (
              <div className="code-block">
                <div className="code-toolbar">
                  <span>{language || "Code"}</span>
                  <CopyButton text={text} />
                </div>
                <pre tabIndex={0} aria-label={`${language || "Example"} code`}>
                  {children}
                </pre>
              </div>
            );
          },
          table: ({ children }) => (
            <div
              className="article-table"
              role="region"
              aria-label="Comparison table"
              tabIndex={0}
            >
              <table>{children}</table>
            </div>
          ),
          img: ({ src, alt, title }) =>
            typeof src === "string" ? (
              <span className="article-inline-image">
                <Image
                  src={src}
                  alt={alt || ""}
                  width={1200}
                  height={800}
                  sizes="(max-width: 900px) 100vw, 760px"
                />
                {title && <span>{title}</span>}
              </span>
            ) : null,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
