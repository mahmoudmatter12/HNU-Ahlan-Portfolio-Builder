"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react"
import { MarkdownPreview } from "@/components/markdown-preview"
import type { FAQData } from "@/types/faq"

interface FAQDisplayProps {
    faqData: FAQData | null
    title?: string
    description?: string
    className?: string
}

export function FAQDisplay({
    faqData,
    title = "Frequently Asked Questions",
    description = "Find answers to common questions about our college",
    className = ""
}: FAQDisplayProps) {
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

    if (!faqData || !faqData.items || faqData.items.length === 0) {
        return null
    }

    const toggleItem = (itemId: string) => {
        setExpandedItems(prev => {
            const newSet = new Set(prev)
            if (newSet.has(itemId)) {
                newSet.delete(itemId)
            } else {
                newSet.add(itemId)
            }
            return newSet
        })
    }

    const sortedItems = [...faqData.items].sort((a, b) => a.order - b.order)

    return (
        <div className={`space-y-6 ${className}`}>
            <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">{title}</h2>
                {description && (
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        {description}
                    </p>
                )}
            </div>

            <div className="space-y-4">
                {sortedItems.map((item, index) => (
                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3 flex-1">
                                    <Badge variant="outline" className="shrink-0 mt-1">
                                        #{index + 1}
                                    </Badge>
                                    <div className="flex-1">
                                        <CardTitle className="text-lg cursor-pointer" onClick={() => toggleItem(item.id)}>
                                            {item.question}
                                        </CardTitle>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleItem(item.id)}
                                    className="shrink-0"
                                >
                                    {expandedItems.has(item.id) ? (
                                        <ChevronUp className="h-4 w-4" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </CardHeader>

                        {expandedItems.has(item.id) && (
                            <>
                                <Separator />
                                <CardContent className="pt-4">
                                    <div className="prose prose-sm max-w-none">
                                        <MarkdownPreview content={item.answer} />
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-3">
                                        Last updated: {new Date(item.updatedAt).toLocaleDateString()}
                                    </div>
                                </CardContent>
                            </>
                        )}
                    </Card>
                ))}
            </div>

            {faqData.lastUpdated && (
                <div className="text-center text-sm text-muted-foreground">
                    <p>Last updated: {new Date(faqData.lastUpdated).toLocaleDateString()}</p>
                </div>
            )}
        </div>
    )
} 