"use client"
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import { useState, useEffect, useMemo } from 'react'
import {
    ChevronUp,
    ChevronDown,
    Copy,
    Check,
    ExternalLink,
    FileText,
    Eye,
    EyeOff,
    BookOpen,
    Code,
    Image as ImageIcon,
    Video,
    Link as LinkIcon,
    Calendar,
    Clock,
    User,
    Tag
} from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { ScrollArea } from './ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface MarkdownPreviewProps {
    content: string
    className?: string
    maxLength?: number
    showViewMore?: boolean
    onViewMore?: () => void
    showTableOfContents?: boolean
    showLineNumbers?: boolean
    theme?: 'light' | 'dark' | 'auto'
    allowCopy?: boolean
    allowExpand?: boolean
    metadata?: {
        author?: string
        date?: string
        tags?: string[]
        readingTime?: number
        wordCount?: number
    }
    compact?: boolean // New prop for compact view
}

interface HeadingItem {
    id: string
    text: string
    level: number
}

export function MarkdownPreview({
    content,
    className = "",
    maxLength,
    showViewMore = false,
    onViewMore,
    showTableOfContents = true,
    showLineNumbers = true,
    theme = 'auto',
    allowCopy = true,
    allowExpand = true,
    metadata,
    compact = false
}: MarkdownPreviewProps) {
    const [copiedBlocks, setCopiedBlocks] = useState<Set<string>>(new Set())
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
    const [activeHeading, setActiveHeading] = useState<string>('')
    const [isTableOfContentsOpen, setIsTableOfContentsOpen] = useState(true)
    const [isFullScreen, setIsFullScreen] = useState(false)

    const displayContent = maxLength && content.length > maxLength
        ? `${content.substring(0, maxLength)}...`
        : content

    // Extract headings for table of contents
    const headings = useMemo(() => {
        const headingRegex = /^(#{1,6})\s+(.+)$/gm
        const matches = Array.from(displayContent.matchAll(headingRegex))
        return matches.map((match, index) => ({
            id: `heading-${index}`,
            text: match[2].trim(),
            level: match[1].length
        }))
    }, [displayContent])

    // Copy code block
    const copyCodeBlock = async (code: string, blockId: string) => {
        try {
            await navigator.clipboard.writeText(code)
            setCopiedBlocks(prev => new Set(prev).add(blockId))
            setTimeout(() => {
                setCopiedBlocks(prev => {
                    const newSet = new Set(prev)
                    newSet.delete(blockId)
                    return newSet
                })
            }, 2000)
        } catch (err) {
            console.error('Failed to copy code:', err)
        }
    }

    // Toggle section expansion
    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev => {
            const newSet = new Set(prev)
            if (newSet.has(sectionId)) {
                newSet.delete(sectionId)
            } else {
                newSet.add(sectionId)
            }
            return newSet
        })
    }

    // Intersection observer for active heading
    useEffect(() => {
        if (!showTableOfContents) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveHeading(entry.target.id)
                    }
                })
            },
            { rootMargin: '-20% 0px -35% 0px' }
        )

        headings.forEach(heading => {
            const element = document.getElementById(heading.id)
            if (element) observer.observe(element)
        })

        return () => observer.disconnect()
    }, [headings, showTableOfContents])

    const readingTime = metadata?.readingTime || Math.ceil(displayContent.split(' ').length / 200)
    const wordCount = metadata?.wordCount || displayContent.split(' ').length

    // If compact mode, only show first H1 and metadata
    if (compact) {
        const firstH1Match = content.match(/^#\s+(.+)$/m)
        const firstH1 = firstH1Match ? firstH1Match[1] : 'Program Description'

        return (
            <div className={cn("space-y-4", className)}>
                {/* Compact Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {firstH1}
                    </h2>

                    {/* Compact Metadata */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{readingTime} min read</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            <span>{wordCount} words</span>
                        </div>
                        {metadata?.tags && (
                            <div className="flex items-center gap-1">
                                <Tag className="h-4 w-4" />
                                <span>{metadata.tags[0]}</span>
                            </div>
                        )}
                    </div>

                    {/* View Full Content Button */}
                    {onViewMore && (
                        <Button
                            onClick={onViewMore}
                            variant="outline"
                            size="sm"
                            className="mt-3 gap-2"
                        >
                            <Eye className="h-4 w-4" />
                            View Full Description
                        </Button>
                    )}
                </div>
            </div>
        )
    }

    return (
        <TooltipProvider>
            <div className={cn(
                "relative",
                isFullScreen && "fixed inset-0 z-50 bg-white dark:bg-gray-900",
                className
            )}>
                {/* Header with metadata and controls */}
                {(metadata || allowExpand) && (
                    <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 p-4 -mx-4 -mt-4 mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                {metadata?.author && (
                                    <div className="flex items-center gap-1">
                                        <User className="h-4 w-4" />
                                        <span>{metadata.author}</span>
                                    </div>
                                )}
                                {metadata?.date && (
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>{new Date(metadata.date).toLocaleDateString()}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{readingTime} min read</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <FileText className="h-4 w-4" />
                                    <span>{wordCount} words</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {allowExpand && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setIsFullScreen(!isFullScreen)}
                                            >
                                                {isFullScreen ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            {isFullScreen ? 'Exit fullscreen' : 'Fullscreen'}
                                        </TooltipContent>
                                    </Tooltip>
                                )}
                            </div>
                        </div>
                        {metadata?.tags && metadata.tags.length > 0 && (
                            <div className="flex items-center gap-2 mt-2">
                                <Tag className="h-4 w-4 text-gray-500" />
                                {metadata.tags.map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className="flex gap-6">
                    {/* Table of Contents */}
                    {showTableOfContents && headings.length > 0 && (
                        <div className="hidden lg:block w-64 flex-shrink-0">
                            <div className="sticky top-20">
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                            <BookOpen className="h-4 w-4" />
                                            Table of Contents
                                        </h3>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setIsTableOfContentsOpen(!isTableOfContentsOpen)}
                                        >
                                            {isTableOfContentsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                    {isTableOfContentsOpen && (
                                        <ScrollArea className="h-[calc(100vh-200px)]">
                                            <nav className="space-y-1">
                                                {headings.map((heading) => (
                                                    <a
                                                        key={heading.id}
                                                        href={`#${heading.id}`}
                                                        className={cn(
                                                            "block text-sm py-1 px-2 rounded transition-colors",
                                                            "hover:bg-gray-100 dark:hover:bg-gray-700",
                                                            activeHeading === heading.id && "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
                                                            heading.level === 1 && "font-semibold",
                                                            heading.level === 2 && "ml-2",
                                                            heading.level === 3 && "ml-4",
                                                            heading.level === 4 && "ml-6",
                                                            heading.level === 5 && "ml-8",
                                                            heading.level === 6 && "ml-10"
                                                        )}
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            document.getElementById(heading.id)?.scrollIntoView({
                                                                behavior: 'smooth',
                                                                block: 'start'
                                                            })
                                                        }}
                                                    >
                                                        {heading.text}
                                                    </a>
                                                ))}
                                            </nav>
                                        </ScrollArea>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        <div className={cn(
                            "prose prose-lg max-w-none",
                            "prose-headings:scroll-mt-20 prose-headings:font-semibold prose-headings:text-gray-900 dark:prose-headings:text-gray-100",
                            "prose-h1:text-3xl prose-h1:border-b prose-h1:border-gray-200 dark:prose-h1:border-gray-700 prose-h1:pb-2",
                            "prose-h2:text-2xl prose-h2:border-b prose-h2:border-gray-100 dark:prose-h2:border-gray-800 prose-h2:pb-1",
                            "prose-h3:text-xl",
                            "prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed",
                            "prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-strong:font-semibold",
                            "prose-em:text-gray-800 dark:prose-em:text-gray-200",
                            "prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20 prose-blockquote:pl-4 prose-blockquote:py-2 prose-blockquote:rounded-r",
                            "prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:text-gray-800 dark:prose-code:text-gray-200",
                            "prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-700 prose-pre:rounded-lg prose-pre:overflow-hidden",
                            "prose-ul:list-disc prose-ul:pl-6",
                            "prose-ol:list-decimal prose-ol:pl-6",
                            "prose-li:text-gray-700 dark:prose-li:text-gray-300",
                            "prose-table:border-collapse prose-table:w-full",
                            "prose-th:border prose-th:border-gray-300 dark:prose-th:border-gray-600 prose-th:bg-gray-50 dark:prose-th:bg-gray-800 prose-th:p-2 prose-th:text-left",
                            "prose-td:border prose-td:border-gray-300 dark:prose-td:border-gray-600 prose-td:p-2",
                            "prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline",
                            "prose-img:rounded-lg prose-img:shadow-md",
                            "prose-hr:border-gray-300 dark:prose-hr:border-gray-600",
                            className
                        )}>
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm, remarkMath]}
                                rehypePlugins={[rehypeKatex, rehypeRaw, rehypeSanitize]}
                                components={{
                                    // Custom heading components with IDs
                                    h1: ({ children, ...props }) => {
                                        const headingText = String(children)
                                        const headingIndex = headings.findIndex(h => h.text === headingText)
                                        return (
                                            <h1 id={`heading-${headingIndex}`} {...props}>
                                                {children}
                                            </h1>
                                        )
                                    },
                                    h2: ({ children, ...props }) => {
                                        const headingText = String(children)
                                        const headingIndex = headings.findIndex(h => h.text === headingText)
                                        return (
                                            <h2 id={`heading-${headingIndex}`} {...props}>
                                                {children}
                                            </h2>
                                        )
                                    },
                                    h3: ({ children, ...props }) => {
                                        const headingText = String(children)
                                        const headingIndex = headings.findIndex(h => h.text === headingText)
                                        return (
                                            <h3 id={`heading-${headingIndex}`} {...props}>
                                                {children}
                                            </h3>
                                        )
                                    },
                                    h4: ({ children, ...props }) => {
                                        const headingText = String(children)
                                        const headingIndex = headings.findIndex(h => h.text === headingText)
                                        return (
                                            <h4 id={`heading-${headingIndex}`} {...props}>
                                                {children}
                                            </h4>
                                        )
                                    },
                                    h5: ({ children, ...props }) => {
                                        const headingText = String(children)
                                        const headingIndex = headings.findIndex(h => h.text === headingText)
                                        return (
                                            <h5 id={`heading-${headingIndex}`} {...props}>
                                                {children}
                                            </h5>
                                        )
                                    },
                                    h6: ({ children, ...props }) => {
                                        const headingText = String(children)
                                        const headingIndex = headings.findIndex(h => h.text === headingText)
                                        return (
                                            <h6 id={`heading-${headingIndex}`} {...props}>
                                                {children}
                                            </h6>
                                        )
                                    },
                                    // Custom code block with syntax highlighting and copy button
                                    code: ({ node, inline, className, children, ...props }: any) => {
                                        const match = /language-(\w+)/.exec(className || '')
                                        const language = match ? match[1] : ''
                                        const codeString = String(children).replace(/\n$/, '')
                                        const blockId = `code-${Math.random().toString(36).substr(2, 9)}`

                                        if (inline) {
                                            return (
                                                <code className={className} {...props}>
                                                    {children}
                                                </code>
                                            )
                                        }

                                        return (
                                            <div className="relative group">
                                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {allowCopy && (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 w-8 p-0 bg-gray-800/50 hover:bg-gray-700/50 text-white"
                                                                    onClick={() => copyCodeBlock(codeString, blockId)}
                                                                >
                                                                    {copiedBlocks.has(blockId) ? (
                                                                        <Check className="h-4 w-4" />
                                                                    ) : (
                                                                        <Copy className="h-4 w-4" />
                                                                    )}
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                {copiedBlocks.has(blockId) ? 'Copied!' : 'Copy code'}
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    )}
                                                </div>
                                                <SyntaxHighlighter
                                                    style={oneDark}
                                                    language={language}
                                                    PreTag="div"
                                                    showLineNumbers={showLineNumbers}
                                                    customStyle={{
                                                        margin: 0,
                                                        borderRadius: '0.5rem',
                                                        fontSize: '0.875rem',
                                                        lineHeight: '1.5'
                                                    }}
                                                    lineNumberStyle={{
                                                        color: '#6b7280',
                                                        minWidth: '2.5em',
                                                        paddingRight: '1em',
                                                        textAlign: 'right',
                                                        userSelect: 'none'
                                                    }}
                                                >
                                                    {codeString}
                                                </SyntaxHighlighter>
                                            </div>
                                        )
                                    },
                                    // Custom link component with external link indicator
                                    a: ({ href, children, ...props }) => {
                                        const isExternal = href?.startsWith('http')
                                        return (
                                            <a
                                                href={href}
                                                target={isExternal ? '_blank' : undefined}
                                                rel={isExternal ? 'noopener noreferrer' : undefined}
                                                className="inline-flex items-center gap-1 hover:gap-2 transition-all"
                                                {...props}
                                            >
                                                {children}
                                                {isExternal && <ExternalLink className="h-3 w-3" />}
                                            </a>
                                        )
                                    },
                                    // Custom image component with loading and error handling
                                    img: ({ src, alt, ...props }) => (
                                        <div className="relative group w-full h-64">
                                            <Image
                                                fill
                                                src={String(src) || '/images/placeholder.png'}
                                                alt={String(alt) || ''}
                                                className="rounded-lg shadow-md hover:shadow-lg transition-shadow object-cover"
                                                loading="lazy"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement
                                                    target.style.display = 'none'
                                                }}
                                            />
                                            {alt && (
                                                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {String(alt)}
                                                </div>
                                            )}
                                        </div>
                                    ),
                                    // Custom table component with better styling
                                    table: ({ children, ...props }) => (
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" {...props}>
                                                {children}
                                            </table>
                                        </div>
                                    ),
                                    // Custom blockquote component
                                    blockquote: ({ children, ...props }) => (
                                        <blockquote
                                            className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 pl-4 py-2 rounded-r-lg italic"
                                            {...props}
                                        >
                                            {children}
                                        </blockquote>
                                    )
                                }}
                            >
                                {displayContent}
                            </ReactMarkdown>
                        </div>

                        {/* View More Button */}
                        {showViewMore && maxLength && content.length > maxLength && (
                            <div className="mt-6 text-center">
                                <Button onClick={onViewMore} variant="outline" className="gap-2">
                                    <FileText className="h-4 w-4" />
                                    View full content
                                </Button>
                            </div>
                        )}

                        {/* Footer with additional info */}
                        {metadata && (
                            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center gap-4">
                                        <span>Last updated: {new Date().toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span>{wordCount} words</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Code className="h-4 w-4" />
                                        <span>Markdown</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </TooltipProvider>
    )
} 