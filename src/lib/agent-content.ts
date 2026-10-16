import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import type { Root, RootContent } from "mdast";
import { siteConfig } from "../data/site.ts";
import { certifications, education, experience, notebook } from "../data/notebook.ts";
import { projects } from "../data/projects.ts";
import { toolkit } from "../data/toolkit.ts";
import { isBlogPostInSitemap, resolveBlogSeo } from "./blog-seo.ts";
import type { BlogPost, PostSummary } from "./post-content.ts";

const markdownParser = unified().use(remarkParse).use(remarkGfm);

function text(value: string) {
  return value.replace(/\s*\n\s*/g, " ").replace(/[\\`*_[\]<>#~]/g, "\\$&");
}

function siteUrl(path: string) {
  return new URL(path, `${siteConfig.url.replace(/\/+$/, "")}/`).href;
}

function link(label: string, url: string) {
  return `[${text(label)}](<${url}>)`;
}

function discoverable<T extends PostSummary>(posts: T[]) {
  return posts
    .filter((post) =>
      isBlogPostInSitemap(post, siteConfig) &&
      !post.nosnippet && !post.nofollow &&
      (post.maxSnippet === undefined || post.maxSnippet === -1) &&
      (post.maxVideoPreview === undefined || post.maxVideoPreview === -1) &&
      (post.maxImagePreview === undefined || post.maxImagePreview === "large"),
    )
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

// Find a Markdown label's closing bracket without treating escaped brackets or
// inline code as label delimiters. Only called inside parsed link/image nodes.
function labelEnd(source: string, start: number) {
  let depth = 0;
  for (let index = start; index < source.length; index++) {
    const character = source[index];
    if (character === "\\") {
      index++;
    } else if (character === "`") {
      const run = source.slice(index).match(/^`+/)![0];
      const closing = source.indexOf(run, index + run.length);
      if (closing !== -1) index = closing + run.length - 1;
    } else if (character === "[") {
      depth++;
    } else if (character === "]" && --depth === 0) {
      return index;
    }
  }
  return -1;
}

function absoluteArticleLinks(content: string, permalink: string) {
  const tree = markdownParser.parse(content) as Root;
  const replacements: { start: number; end: number; value: string }[] = [];
  const visit = (node: Root | RootContent) => {
    if (
      (node.type === "link" || node.type === "image" || node.type === "definition") &&
      !/^[a-z][a-z\d+.-]*:/i.test(node.url) &&
      node.position?.start.offset !== undefined &&
      node.position.end.offset !== undefined
    ) {
      const start = node.position.start.offset;
      const source = content.slice(start, node.position.end.offset);
      const endOfLabel = labelEnd(source, node.type === "image" ? 1 : 0);
      const separator = node.type === "definition" ? ":" : "(";
      if (endOfLabel !== -1 && source[endOfLabel + 1] === separator) {
        let destinationStart = endOfLabel + 2;
        while (/\s/.test(source[destinationStart] ?? "")) destinationStart++;
        let destinationEnd = destinationStart;
        if (source[destinationStart] === "<") {
          destinationEnd++;
          while (destinationEnd < source.length) {
            if (source[destinationEnd] === "\\") destinationEnd++;
            else if (source[destinationEnd] === ">") {
              destinationEnd++;
              break;
            }
            destinationEnd++;
          }
        } else {
          let depth = 0;
          while (destinationEnd < source.length) {
            const character = source[destinationEnd];
            if (character === "\\") destinationEnd++;
            else if (character === "(") depth++;
            else if (character === ")") {
              if (!depth) break;
              depth--;
            } else if (/\s/.test(character)) break;
            destinationEnd++;
          }
        }
        if (destinationEnd >= destinationStart) {
          replacements.push({
            start: start + destinationStart,
            end: start + destinationEnd,
            value: `<${new URL(node.url, permalink).href}>`,
          });
        }
      }
    }
    if ("children" in node) node.children.forEach(visit);
  };
  visit(tree);
  // Replace destinations from the end so every AST source offset stays valid.
  for (const replacement of replacements.sort((a, b) => b.start - a.start)) {
    content = content.slice(0, replacement.start) + replacement.value + content.slice(replacement.end);
  }
  return content;
}

export function buildAgentIndex(posts: PostSummary[]): string {
  return [
    `# ${text(siteConfig.name)}`,
    `> ${text(siteConfig.description)}`,
    "This is a personal portfolio and technical notebook about web applications, cloud systems, and AI engineering. Use the Markdown article links below to read complete posts without the website navigation. The HTML article URLs are canonical for citation.",
    "## Read the site",
    [
      `- ${link("Complete content in Markdown", siteUrl("/llms-full.md"))}: Public profile, experience, skills, projects, contact details, and the articles listed below.`,
      `- ${link("Complete content as text", siteUrl("/llms-full.txt"))}: The same Markdown-formatted content served as plain text.`,
      `- ${link("This index in Markdown", siteUrl("/llms.md"))}: The same index as /llms.txt.`,
    ].join("\n"),
    "## Profile and projects",
    [
      `- ${link("Home", siteUrl("/"))}: ${text(siteConfig.longDescription)}`,
      `- ${link("About", siteUrl("/about"))}: Background, experience, education, certifications, and toolkit.`,
      `- ${link("Projects", siteUrl("/projects"))}: ${text(notebook.projectsDescription)}`,
      `- ${link("Contact", siteUrl("/contact"))}: Public email and social profiles.`,
      `- ${link("Blog", siteUrl("/blog"))}: ${text(notebook.blogDescription)}`,
    ].join("\n"),
    "## Articles",
    discoverable(posts).map((post) =>
      `- ${link(post.title, siteUrl(`/blog/${post.slug}/index.md`))}: ${text(post.description)}`,
    ).join("\n"),
    "## Optional",
    [
      `- ${link("RSS feed", siteUrl("/feed.xml"))}: Published article summaries and canonical links.`,
      `- ${link("Sitemap", siteUrl("/sitemap.xml"))}: Canonical website pages.`,
      `- ${link("Resume", siteUrl("/resume"))}: Resume page and downloadable document.`,
      `- ${link("Editorial policy", siteUrl("/editorial-policy"))}: How articles are researched and maintained.`,
      `- ${link("Privacy policy", siteUrl("/privacy"))}: Website privacy information.`,
    ].join("\n"),
    "",
  ].join("\n\n");
}

export function buildArticleMarkdown(post: BlogPost): string {
  const { canonicalUrl, permalink } = resolveBlogSeo(post, siteConfig);
  return [
    `# ${text(post.title)}`,
    `> ${text(post.description)}`,
    [
      `- Author: ${text(siteConfig.name)}`,
      `- Published: ${post.date}`,
      `- Updated: ${post.updated}`,
      `- Category: ${text(post.category)}`,
      `- Tags: ${post.tags.map(text).join(", ")}`,
      `- Canonical URL: ${link(post.title, canonicalUrl)}`,
      ...(post.source ? [`- Original source: ${link("LinkedIn post", post.source)}`] : []),
      ...(post.youtubeId ? [`- Video: ${link("Watch on YouTube", `https://www.youtube.com/watch?v=${post.youtubeId}`)}`] : []),
    ].join("\n"),
    absoluteArticleLinks(post.content, permalink).trim(),
    "",
  ].join("\n\n");
}

export function buildFullAgentContent(posts: BlogPost[]): string {
  return [
    `# ${text(siteConfig.name)} — site content`,
    `> ${text(siteConfig.description)}`,
    `This document includes the public profile, projects, contact information, and complete articles listed in ${link("the content index", siteUrl("/llms.txt"))}. It does not reproduce every website page, legal policy, or resume document. Articles with indexing or preview restrictions, or another canonical URL, are omitted.`,
    "## Profile",
    [
      `- Name: ${text(siteConfig.name)}`,
      `- Role: ${text(siteConfig.role)}`,
      `- Location: ${text(siteConfig.location)}`,
      `- Website: ${link(siteConfig.name, siteUrl("/"))}`,
      `- About: ${link("About page", siteUrl("/about"))}`,
    ].join("\n"),
    ...notebook.about.map(text),
    "## Experience",
    ...experience.map((job) => [
      `### ${text(job.role)} — ${text(job.company)}`,
      text(job.period),
      text(job.details),
      ...(job.description ? [text(job.description)] : []),
    ].join("\n\n")),
    "## Education and certifications",
    `${text(education.degree)} — ${text(education.institution)}`,
    certifications.map((certification) => `- ${text(certification)}`).join("\n"),
    "## Skills",
    toolkit.map((group) => `- ${text(group.title)}: ${text(group.skills)}`).join("\n"),
    "## Projects",
    `${text(notebook.projectsDescription)} ${link("Projects page", siteUrl("/projects"))}.`,
    ...projects.map((project) => [
      `### ${text(project.title)}`,
      text(project.summary),
      text(project.description),
      `Technologies: ${project.technologies.map(text).join(", ")}.`,
      link(project.linkLabel, project.link),
    ].join("\n\n")),
    "## Contact",
    text(notebook.contactDescription),
    [
      `- ${link("Contact page", siteUrl("/contact"))}`,
      `- ${link(siteConfig.email, `mailto:${siteConfig.email}`)}`,
      `- ${link("GitHub", siteConfig.social.github)}`,
      `- ${link("LinkedIn", siteConfig.social.linkedin)}`,
      ...(siteConfig.social.youtube ? [`- ${link("YouTube", siteConfig.social.youtube)}`] : []),
    ].join("\n"),
    "## Published articles",
    "Articles follow in full, newest first. Fenced diagram blocks preserve the structured descriptions used by the website's illustrated diagrams.",
    ...discoverable(posts).map((post) => `---\n\n${buildArticleMarkdown(post).trim()}`),
    "",
  ].join("\n\n");
}
