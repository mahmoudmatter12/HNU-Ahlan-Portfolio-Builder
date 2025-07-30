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
        <div className={`prose prose-invert prose-lg max-w-none ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex, rehypeRaw, rehypeSanitize]}
                components={{
                    // Custom component overrides for dark theme
                    h1: ({ children }) => <h1 className="text-3xl font-bold mb-6 text-white">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-2xl font-bold mb-4 text-white">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-xl font-bold mb-3 text-white">{children}</h3>,
                    h4: ({ children }) => <h4 className="text-lg font-bold mb-2 text-white">{children}</h4>,
                    h5: ({ children }) => <h5 className="text-base font-bold mb-2 text-white">{children}</h5>,
                    h6: ({ children }) => <h6 className="text-sm font-bold mb-1 text-white">{children}</h6>,
                    p: ({ children }) => <p className="mb-4 leading-relaxed text-slate-300">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2 text-slate-300">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2 text-slate-300">{children}</ol>,
                    li: ({ children }) => <li className="text-slate-300">{children}</li>,
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-blue-400 pl-6 italic text-slate-300 mb-4 bg-slate-800/30 py-4 rounded-r-lg">
                            {children}
                        </blockquote>
                    ),
                    code: ({ children, className }) => {
                        const isInline = !className
                        return isInline ? (
                            <code className="bg-slate-700 px-2 py-1 rounded text-sm font-mono text-blue-300 border border-slate-600">
                                {children}
                            </code>
                        ) : (
                            <code className="block bg-slate-800 p-4 rounded-lg text-sm font-mono overflow-x-auto text-slate-300 border border-slate-700 mb-4">
                                {children}
                            </code>
                        )
                    },
                    pre: ({ children }) => (
                        <pre className="bg-slate-800 p-4 rounded-lg text-sm font-mono overflow-x-auto mb-4 text-slate-300 border border-slate-700">
                            {children}
                        </pre>
                    ),
                    a: ({ children, href }) => (
                        <a
                            href={href}
                            className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {children}
                        </a>
                    ),
                    strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                    em: ({ children }) => <em className="italic text-slate-200">{children}</em>,
                    table: ({ children }) => (
                        <div className="overflow-x-auto mb-4">
                            <table className="min-w-full border border-slate-600 rounded-lg">
                                {children}
                            </table>
                        </div>
                    ),
                    th: ({ children }) => (
                        <th className="border border-slate-600 px-4 py-3 bg-slate-800 font-bold text-left text-white">
                            {children}
                        </th>
                    ),
                    td: ({ children }) => (
                        <td className="border border-slate-600 px-4 py-3 text-slate-300">
                            {children}
                        </td>
                    ),
                    hr: () => <hr className="border-slate-600 my-6" />,
                    // Additional styling for academic content
                    div: ({ children, className }) => (
                        <div className={`${className} text-slate-300`}>
                            {children}
                        </div>
                    ),
                    span: ({ children, className }) => (
                        <span className={`${className} text-slate-300`}>
                            {children}
                        </span>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
} 