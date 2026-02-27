import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

type MarkdownContentProps = {
  content: string;
};

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="prose-custom">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={{
          h1: ({ children }) => (
            <h2 className="text-2xl font-semibold tracking-tight">
              {children}
            </h2>
          ),
          input: ({ type, checked }) => {
            if (type === "checkbox") {
              return (
                <input
                  type="checkbox"
                  checked={Boolean(checked)}
                  readOnly
                  aria-label={checked ? "Completed task item" : "Task item"}
                  className="mr-2 align-middle"
                />
              );
            }

            return <input type={type} readOnly />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
