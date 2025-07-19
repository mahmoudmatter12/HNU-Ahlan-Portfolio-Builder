"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
    Calendar,
    User,
    Clock,
    FileText,
    Image as ImageIcon,
    Video,
    Link as LinkIcon,
    ExternalLink,
    Copy,
    Check,
    X,
    BookOpen,
    Tag
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import type { ProgramDescription } from "@/types/program"
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface ProgramDescriptionDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    description: ProgramDescription | null
}

export function ProgramDescriptionDialog({
    open,
    onOpenChange,
    description
}: ProgramDescriptionDialogProps) {
    const [copiedUrl, setCopiedUrl] = useState(false)
    const [copiedCodeBlocks, setCopiedCodeBlocks] = useState<Set<string>>(new Set())

    if (!description) return null

    const copyUrl = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href)
            setCopiedUrl(true)
            toast.success("URL copied to clipboard")
            setTimeout(() => setCopiedUrl(false), 2000)
        } catch (err) {
            toast.error("Failed to copy URL")
        }
    }

    const copyCodeBlock = async (code: string, blockId: string) => {
        try {
            await navigator.clipboard.writeText(code)
            setCopiedCodeBlocks(prev => new Set(prev).add(blockId))
            setTimeout(() => {
                setCopiedCodeBlocks(prev => {
                    const newSet = new Set(prev)
                    newSet.delete(blockId)
                    return newSet
                })
            }, 2000)
        } catch (err) {
            console.error('Failed to copy code:', err)
        }
    }

    const wordCount = description.description.split(' ').length
    const readingTime = Math.ceil(wordCount / 200)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[95vh] min-w-[50vw] w-[95vw] max-w-[1400px] overflow-hidden p-0">
                {/* Header Section */}
                <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                    <DialogHeader className="p-6 pb-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                        <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">
                                            {description.title}
                                        </DialogTitle>
                                        <DialogDescription className="text-gray-600 dark:text-gray-400 mt-1">
                                            Comprehensive program overview and details
                                        </DialogDescription>
                                    </div>
                                </div>

                                {/* Enhanced Metadata Bar */}
                                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                                        <Clock className="h-4 w-4" />
                                        <span className="font-medium">{readingTime} min read</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                                        <FileText className="h-4 w-4" />
                                        <span className="font-medium">{wordCount} words</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                                        <Calendar className="h-4 w-4" />
                                        <span className="font-medium">{new Date().toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-full">
                                        <Tag className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        <span className="font-medium text-blue-700 dark:text-blue-300">Program</span>
                                    </div>
                                </div>

                                {/* Media Indicators */}
                                {(description.image?.length || description.link?.length || description.video?.length) && (
                                    <div className="flex items-center gap-4 mt-3">
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            Includes:
                                        </span>
                                        <div className="flex items-center gap-3">
                                            {description.image?.length && (
                                                <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900 rounded-full">
                                                    <ImageIcon className="h-3 w-3 text-green-600 dark:text-green-400" />
                                                    <span className="text-xs font-medium text-green-700 dark:text-green-300">{description.image.length} image{description.image.length !== 1 ? 's' : ''}</span>
                                                </div>
                                            )}
                                            {description.video?.length && (
                                                <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900 rounded-full">
                                                    <Video className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                                                    <span className="text-xs font-medium text-purple-700 dark:text-purple-300">{description.video.length} video{description.video.length !== 1 ? 's' : ''}</span>
                                                </div>
                                            )}
                                            {description.link?.length && (
                                                <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900 rounded-full">
                                                    <LinkIcon className="h-3 w-3 text-orange-600 dark:text-orange-400" />
                                                    <span className="text-xs font-medium text-orange-700 dark:text-orange-300">{description.link.length} link{description.link.length !== 1 ? 's' : ''}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={copyUrl}
                                    className="hidden sm:flex"
                                >
                                    {copiedUrl ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                                    {copiedUrl ? "Copied!" : "Share"}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onOpenChange(false)}
                                    className="p-2"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                {/* Main Content Area */}
                <div className="flex flex-col" style={{ height: 'calc(95vh - 200px)' }}>
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-6">
                            <div className={cn(
                                "prose prose-lg max-w-none",
                                "prose-headings:scroll-mt-20 prose-headings:font-semibold prose-headings:text-gray-900 dark:prose-headings:text-gray-100",
                                "prose-h1:text-3xl prose-h1:border-b prose-h1:border-gray-200 dark:prose-h1:border-gray-700 prose-h1:pb-2 prose-h1:mb-6",
                                "prose-h2:text-2xl prose-h2:border-b prose-h2:border-gray-100 dark:prose-h2:border-gray-800 prose-h2:pb-1 prose-h2:mb-4",
                                "prose-h3:text-xl prose-h3:mb-3",
                                "prose-h4:text-lg prose-h4:mb-2",
                                "prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4",
                                "prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-strong:font-semibold",
                                "prose-em:text-gray-800 dark:prose-em:text-gray-200",
                                "prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20 prose-blockquote:pl-4 prose-blockquote:py-2 prose-blockquote:rounded-r prose-blockquote:my-4",
                                "prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:text-gray-800 dark:prose-code:text-gray-200",
                                "prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-700 prose-pre:rounded-lg prose-pre:overflow-hidden prose-pre:my-4",
                                "prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4",
                                "prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4",
                                "prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:mb-1",
                                "prose-table:border-collapse prose-table:w-full prose-table:my-4",
                                "prose-th:border prose-th:border-gray-300 dark:prose-th:border-gray-600 prose-th:bg-gray-50 dark:prose-th:bg-gray-800 prose-th:p-2 prose-th:text-left",
                                "prose-td:border prose-td:border-gray-300 dark:prose-td:border-gray-600 prose-td:p-2",
                                "prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline",
                                "prose-img:rounded-lg prose-img:shadow-md prose-img:my-4",
                                "prose-hr:border-gray-300 dark:prose-hr:border-gray-600 prose-hr:my-6"
                            )}>
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkMath]}
                                    rehypePlugins={[rehypeKatex, rehypeRaw, rehypeSanitize]}
                                    components={{
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
                                                <div className="relative group my-4">
                                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 bg-gray-800/50 hover:bg-gray-700/50 text-white"
                                                            onClick={() => copyCodeBlock(codeString, blockId)}
                                                        >
                                                            {copiedCodeBlocks.has(blockId) ? (
                                                                <Check className="h-4 w-4" />
                                                            ) : (
                                                                <Copy className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                    <SyntaxHighlighter
                                                        style={oneDark}
                                                        language={language}
                                                        PreTag="div"
                                                        showLineNumbers={true}
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
                                            <div className="relative group w-full h-64 my-4">
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
                                            <div className="overflow-x-auto my-4">
                                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" {...props}>
                                                    {children}
                                                </table>
                                            </div>
                                        ),
                                        // Custom blockquote component
                                        blockquote: ({ children, ...props }) => (
                                            <blockquote
                                                className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 pl-4 py-2 rounded-r-lg italic my-4"
                                                {...props}
                                            >
                                                {children}
                                            </blockquote>
                                        )
                                    }}
                                >
                                    {description.description}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Footer with additional resources */}
                {(description.image?.length || description.link?.length || description.video?.length) && (
                    <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
                        <div className="p-6">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                <div className="p-1 bg-blue-100 dark:bg-blue-900 rounded">
                                    <ExternalLink className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                Additional Resources
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Images */}
                                {description.image?.length && (
                                    <div className="space-y-3">
                                        <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide flex items-center gap-2">
                                            <ImageIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                                            Images ({description.image.length})
                                        </h5>
                                        <div className="flex flex-wrap gap-2">
                                            {description.image.map((img, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                                                    {img.title}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Videos */}
                                {description.video?.length && (
                                    <div className="space-y-3">
                                        <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide flex items-center gap-2">
                                            <Video className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                            Videos ({description.video.length})
                                        </h5>
                                        <div className="flex flex-wrap gap-2">
                                            {description.video.map((video, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                                                    {video.title}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Links */}
                                {description.link?.length && (
                                    <div className="space-y-3">
                                        <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide flex items-center gap-2">
                                            <LinkIcon className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                            Links ({description.link.length})
                                        </h5>
                                        <div className="flex flex-wrap gap-2">
                                            {description.link.map((link, index) => (
                                                <Button
                                                    key={index}
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-xs h-7 px-3 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/40"
                                                    asChild
                                                >
                                                    <a href={link.content} target="_blank" rel="noopener noreferrer">
                                                        {link.title}
                                                        <ExternalLink className="h-3 w-3 ml-1" />
                                                    </a>
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
} 