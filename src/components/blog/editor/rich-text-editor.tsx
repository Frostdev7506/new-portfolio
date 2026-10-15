"use client";

import { useRef, useState } from "react";
import { useTheme } from "next-themes";
import {
  MDXEditor,
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  ButtonWithTooltip,
  CodeMirrorEditor,
  CodeToggle,
  CreateLink,
  DiffSourceToggleWrapper,
  InsertCodeBlock,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  Separator,
  StrikeThroughSupSubToggles,
  UndoRedo,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  headingsPlugin,
  imagePlugin,
  insertCodeBlock$,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  usePublisher,
} from "@mdxeditor/editor";
import { Workflow } from "lucide-react";
import { diagramEditorDescriptor, newDiagram } from "./diagram-editor";
import { BlogImageDialog } from "./image-dialog";

function InsertDiagram() {
  const insertCodeBlock = usePublisher(insertCodeBlock$);
  return (
    <ButtonWithTooltip
      title="Insert diagram"
      onClick={() => insertCodeBlock({ language: "diagram", code: JSON.stringify(newDiagram, null, 2) })}
    >
      <Workflow size={18} aria-hidden="true" />
    </ButtonWithTooltip>
  );
}

function EditorToolbar() {
  return (
    <DiffSourceToggleWrapper>
      <UndoRedo />
      <Separator />
      <BlockTypeSelect />
      <BoldItalicUnderlineToggles options={["Bold", "Italic"]} />
      <StrikeThroughSupSubToggles options={["Strikethrough"]} />
      <CodeToggle />
      <Separator />
      <ListsToggle />
      <CreateLink />
      <InsertImage />
      <InsertTable />
      <InsertCodeBlock />
      <InsertDiagram />
      <InsertThematicBreak />
    </DiffSourceToggleWrapper>
  );
}

export default function RichTextEditor({ content, onChange, onError }: {
  content: string;
  onChange: (content: string) => void;
  onError: (message: string) => void;
}) {
  const { resolvedTheme } = useTheme();
  const [initialContent] = useState(content);
  const normalizedInitialContent = useRef(initialContent);
  const lastMarkdown = useRef(initialContent);

  async function uploadImage(file: File) {
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/dev/blog/assets", { method: "POST", body });
      const result = await response.json();
      if (!response.ok || typeof result.url !== "string") {
        throw new Error(result.error || "The image could not be uploaded.");
      }
      return result.url as string;
    } catch (error) {
      const message = error instanceof Error ? error.message : "The image could not be uploaded.";
      onError(message);
      throw new Error(message);
    }
  }

  return (
    <div
      onKeyDownCapture={(event) => {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "u") {
          event.preventDefault();
          event.stopPropagation();
        }
      }}
    >
      <MDXEditor
        className={`blog-rich-editor${resolvedTheme === "dark" ? " dark-theme" : ""}`}
        contentEditableClassName="blog-editor-content"
        markdown={initialContent}
        trim={false}
        suppressHtmlProcessing
        onChange={(markdown, initialMarkdownNormalize) => {
          if (initialMarkdownNormalize) {
            normalizedInitialContent.current = markdown;
            lastMarkdown.current = markdown;
            return;
          }
          if (markdown === lastMarkdown.current) return;
          lastMarkdown.current = markdown;
          onChange(markdown === normalizedInitialContent.current ? initialContent : markdown);
        }}
        onError={({ error }) => onError(`The visual editor could not read this content. Open Source to repair it. ${error}`)}
        placeholder="Start writing your article…"
        toMarkdownOptions={{ bullet: "-", emphasis: "*", strong: "*", fences: true }}
        plugins={[
          headingsPlugin({ allowedHeadingLevels: [2, 3, 4, 5, 6] }),
          listsPlugin(),
          quotePlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          thematicBreakPlugin(),
          tablePlugin(),
          imagePlugin({
            ImageDialog: BlogImageDialog,
            imageUploadHandler: uploadImage,
            disableImageResize: true,
            allowSetImageDimensions: false,
          }),
          codeBlockPlugin({
            defaultCodeBlockLanguage: "text",
            codeBlockEditorDescriptors: [
              diagramEditorDescriptor,
              { priority: -10, match: () => true, Editor: CodeMirrorEditor },
            ],
          }),
          codeMirrorPlugin({
            codeBlockLanguages: {
              "": "Unspecified",
              text: "Plain text",
              javascript: "JavaScript",
              js: "JavaScript (js)",
              typescript: "TypeScript",
              ts: "TypeScript (ts)",
              tsx: "TypeScript / React",
              jsx: "JavaScript / React",
              json: "JSON",
              html: "HTML",
              css: "CSS",
              python: "Python",
              bash: "Shell",
              sql: "SQL",
              yaml: "YAML",
            },
          }),
          diffSourcePlugin({ diffMarkdown: initialContent, readOnlyDiff: true }),
          markdownShortcutPlugin(),
          toolbarPlugin({ toolbarClassName: "blog-editor-toolbar", toolbarContents: EditorToolbar }),
        ]}
      />
    </div>
  );
}
