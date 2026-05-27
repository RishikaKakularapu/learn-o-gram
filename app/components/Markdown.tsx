"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        h1: (p) => (
          <h1 className="text-lg font-bold gradient-text mt-3 mb-1" {...p} />
        ),
        h2: (p) => (
          <h2 className="text-base font-bold text-text mt-3 mb-1" {...p} />
        ),
        h3: (p) => (
          <h3 className="text-sm font-semibold text-accent mt-2 mb-1" {...p} />
        ),
        p: (p) => <p className="leading-relaxed" {...p} />,
        ul: (p) => <ul className="list-disc pl-5 space-y-1 my-1" {...p} />,
        ol: (p) => <ol className="list-decimal pl-5 space-y-1 my-1" {...p} />,
        li: (p) => <li className="leading-relaxed" {...p} />,
        strong: (p) => <strong className="font-semibold text-text" {...p} />,
        em: (p) => <em className="italic" {...p} />,
        del: (p) => <del className="text-muted" {...p} />,
        a: (p) => (
          <a
            className="text-accent underline underline-offset-2"
            target="_blank"
            rel="noreferrer"
            {...p}
          />
        ),
        code: ({ className, children, ...rest }) => {
          const isBlock = className?.includes("language-");
          if (isBlock) {
            return (
              <pre className="bg-surface2 border border-border rounded-lg p-3 overflow-x-auto text-[12.5px] my-2">
                <code className={`font-mono ${className ?? ""}`} {...rest}>
                  {children}
                </code>
              </pre>
            );
          }
          return (
            <code
              className="px-1.5 py-0.5 rounded bg-surface2 text-accent text-[0.9em] font-mono"
              {...rest}
            >
              {children}
            </code>
          );
        },
        blockquote: (p) => (
          <blockquote
            className="border-l-2 border-accent pl-3 italic text-muted my-2"
            {...p}
          />
        ),
        hr: () => <hr className="border-border my-3" />,
        table: (p) => (
          <div className="overflow-x-auto my-2">
            <table
              className="text-sm border border-border rounded-lg"
              {...p}
            />
          </div>
        ),
        th: (p) => (
          <th
            className="text-left px-2 py-1 bg-surface2 border-b border-border"
            {...p}
          />
        ),
        td: (p) => <td className="px-2 py-1 border-t border-border" {...p} />,
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
