"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import rehypeRaw from "rehype-raw"
import rehypeSanitize from "rehype-sanitize"

interface MarkdownPreviewProps {
    content: string
    className?: string
}

export function MarkdownPreview({ content, className = "" }: MarkdownPreviewProps) {
    return (
        <div className={`prose prose-sm max-w-none ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex, rehypeRaw, rehypeSanitize]}
                components={{
                    // Custom component overrides
                    h1: ({ children }) => <h1 className="text-2xl font-bold mb-4">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-xl font-bold mb-3">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-lg font-bold mb-2">{children}</h3>,
                    h4: ({ children }) => <h4 className="text-base font-bold mb-2">{children}</h4>,
                    h5: ({ children }) => <h5 className="text-sm font-bold mb-1">{children}</h5>,
                    h6: ({ children }) => <h6 className="text-xs font-bold mb-1">{children}</h6>,
                    p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="text-sm">{children}</li>,
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-3">
                            {children}
                        </blockquote>
                    ),
                    code: ({ children, className }) => {
                        const isInline = !className
                        return isInline ? (
                            <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">
                                {children}
                            </code>
                        ) : (
                            <code className="block bg-gray-100 p-3 rounded text-sm font-mono overflow-x-auto">
                                {children}
                            </code>
                        )
                    },
                    pre: ({ children }) => (
                        <pre className="bg-gray-100 p-3 rounded text-sm font-mono overflow-x-auto mb-3">
                            {children}
                        </pre>
                    ),
                    a: ({ children, href }) => (
                        <a
                            href={href}
                            className="text-blue-600 hover:text-blue-800 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {children}
                        </a>
                    ),
                    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                    em: ({ children }) => <em className="italic">{children}</em>,
                    table: ({ children }) => (
                        <div className="overflow-x-auto mb-3">
                            <table className="min-w-full border border-gray-300">
                                {children}
                            </table>
                        </div>
                    ),
                    th: ({ children }) => (
                        <th className="border border-gray-300 px-3 py-2 bg-gray-50 font-bold text-left">
                            {children}
                        </th>
                    ),
                    td: ({ children }) => (
                        <td className="border border-gray-300 px-3 py-2">
                            {children}
                        </td>
                    ),
                    hr: () => <hr className="border-gray-300 my-4" />,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
} 