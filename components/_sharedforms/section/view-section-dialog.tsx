"use client"
import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, Hash, FileText } from "lucide-react"
import type { CollegeSection } from "@/types/Collage"
import ReactMarkdown from 'react-markdown'

interface ViewSectionDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    section: CollegeSection | null
    onEdit?: () => void
    onDelete?: () => void
}

export function ViewSectionDialog({
    open,
    onOpenChange,
    section,
    onEdit,
    onDelete
}: ViewSectionDialogProps) {
    if (!section) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {section.title}
                    </DialogTitle>
                    <DialogDescription>
                        Section details and content
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Section Metadata */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Hash className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <div className="text-sm font-medium">Order</div>
                                <div className="text-xs text-muted-foreground">Display position</div>
                            </div>
                            <Badge variant="secondary" className="ml-auto">
                                {section.order}
                            </Badge>
                        </div>

                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <div className="text-sm font-medium">Created</div>
                                <div className="text-xs text-muted-foreground">
                                    {new Date(section.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <div className="text-sm font-medium">Updated</div>
                                <div className="text-xs text-muted-foreground">
                                    {new Date(section.updatedAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Section Content */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Content</h3>
                            <div className="flex items-center gap-2">
                                {onEdit && (
                                    <Button variant="outline" size="sm" onClick={onEdit}>
                                        Edit Section
                                    </Button>
                                )}
                                {onDelete && (
                                    <Button variant="destructive" size="sm" onClick={onDelete}>
                                        Delete Section
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="prose prose-sm max-w-none dark:prose-invert">
                            {section.content ? (
                                <ReactMarkdown
                                    components={{
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
                                            <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-3">
                                                {children}
                                            </blockquote>
                                        ),
                                        code: ({ children, className }) => {
                                            const isInline = !className
                                            return isInline ? (
                                                <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">
                                                    {children}
                                                </code>
                                            ) : (
                                                <pre className="bg-muted p-3 rounded-lg overflow-x-auto mb-3">
                                                    <code className="text-sm font-mono">{children}</code>
                                                </pre>
                                            )
                                        },
                                        a: ({ children, href }) => (
                                            <a
                                                href={href}
                                                className="text-primary hover:underline"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {children}
                                            </a>
                                        ),
                                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                        em: ({ children }) => <em className="italic">{children}</em>,
                                        table: ({ children }) => (
                                            <div className="overflow-x-auto mb-3">
                                                <table className="min-w-full border border-border">
                                                    {children}
                                                </table>
                                            </div>
                                        ),
                                        th: ({ children }) => (
                                            <th className="border border-border px-3 py-2 text-left font-semibold bg-muted">
                                                {children}
                                            </th>
                                        ),
                                        td: ({ children }) => (
                                            <td className="border border-border px-3 py-2">
                                                {children}
                                            </td>
                                        ),
                                    }}
                                >
                                    {section.content}
                                </ReactMarkdown>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No content available for this section.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
} 