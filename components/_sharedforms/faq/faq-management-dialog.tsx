"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { FAQService } from "@/services/faq-service"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    FileText,
    Upload,
    Plus,
    Wand2,
    Users,
    Edit,
    Trash2,
} from "lucide-react"
import { toast } from "sonner"
import { FAQItemDialog } from "./faq-item-dialog"
import { FAQImportDialog } from "./faq-import-dialog"
import { FAQGenerationDialog } from "./faq-generation-dialog"
import { FAQSubmissionsDialog } from "./faq-submissions-dialog"
import type { FAQItem } from "@/types/faq"
import { MarkdownPreview } from "@/components/markdown-preview"
import React from "react"

interface FAQManagementDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    collegeId: string
    collegeName: string
}

export interface FAQData {
    items: FAQItem[];
    title?: string;
    description?: string;
    lastUpdated: Date;
}

export function FAQManagementDialog({
    open,
    onOpenChange,
    collegeId,
    collegeName
}: FAQManagementDialogProps) {
    const [activeTab, setActiveTab] = useState("view")
    const [editingItem, setEditingItem] = useState<FAQItem | null>(null)
    const [showImportDialog, setShowImportDialog] = useState(false)
    const [showGenerationDialog, setShowGenerationDialog] = useState(false)
    const [showSubmissionsDialog, setShowSubmissionsDialog] = useState(false)
    const [deletingItem, setDeletingItem] = useState<FAQItem | null>(null)

    // State for unsaved changes
    const [unsavedTitle, setUnsavedTitle] = useState("")
    const [unsavedDescription, setUnsavedDescription] = useState("")
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

    const queryClient = useQueryClient()

    // Fetch FAQ data
    const { data: faqData, isLoading } = useQuery({
        queryKey: ["faq", collegeId],
        queryFn: () => FAQService.getFAQ(collegeId),
        enabled: open
    })

    console.log("faqData", faqData)

    // Fetch FAQ submission count
    const { data: submissionCount } = useQuery({
        queryKey: ["faq-submission-count", collegeId],
        queryFn: () => FAQService.getFAQSubmissionCount(collegeId),
        enabled: open,
        refetchInterval: 30000 // Refetch every 30 seconds to check for new submissions
    })

    // Mutations
    const deleteMutation = useMutation({
        mutationFn: (itemId: string) => FAQService.deleteFAQItem(collegeId, itemId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["faq", collegeId] })
            toast.success("FAQ item deleted successfully")
            setDeletingItem(null)
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to delete FAQ item")
        }
    })



    const handleDelete = (item: FAQItem) => {
        setDeletingItem(item)
    }

    const confirmDelete = () => {
        if (deletingItem) {
            deleteMutation.mutate(deletingItem.id)
        }
    }

    const faqItems = faqData?.items || []

    // Function to update FAQ data
    const updateFAQData = async (updates: Partial<FAQData>) => {
        try {
            const updatedFAQ = {
                ...faqData,
                ...updates,
                items: faqData?.items || [],
                lastUpdated: new Date()
            }
            await FAQService.updateFAQ(collegeId, updatedFAQ)
            queryClient.invalidateQueries({ queryKey: ["faq", collegeId] })
            toast.success("FAQ updated successfully")
            setHasUnsavedChanges(false)
        } catch (error) {
            toast.error("Failed to update FAQ")
        }
    }

    // Function to save unsaved changes
    const saveChanges = async () => {
        try {
            const updatedFAQ = {
                ...faqData,
                title: unsavedTitle,
                description: unsavedDescription,
                items: faqData?.items || [],
                lastUpdated: new Date()
            }
            await FAQService.updateFAQ(collegeId, updatedFAQ)
            queryClient.invalidateQueries({ queryKey: ["faq", collegeId] })
            toast.success("FAQ saved successfully")
            setHasUnsavedChanges(false)
        } catch (error) {
            toast.error("Failed to save FAQ")
        }
    }

    // Function to handle title/description updates
    const handleTitleUpdate = (newTitle: string) => {
        setUnsavedTitle(newTitle)
        setHasUnsavedChanges(true)
    }

    const handleDescriptionUpdate = (newDescription: string) => {
        setUnsavedDescription(newDescription)
        setHasUnsavedChanges(true)
    }

    // Initialize unsaved values when FAQ data loads
    React.useEffect(() => {
        if (faqData) {
            setUnsavedTitle(faqData.title || "")
            setUnsavedDescription(faqData.description || "")
            setHasUnsavedChanges(false)
        }
    }, [faqData])

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            FAQ Management: {collegeName}
                        </DialogTitle>
                        <DialogDescription>
                            Manage frequently asked questions for your college. You can add questions manually, import from CSV/Excel, or generate a form to collect questions.
                        </DialogDescription>
                    </DialogHeader>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="view">View FAQ</TabsTrigger>
                            <TabsTrigger value="manage">Manage FAQ</TabsTrigger>
                            <TabsTrigger value="import">Import FAQ</TabsTrigger>
                            <TabsTrigger value="generate">Generate Form</TabsTrigger>
                        </TabsList>

                        <TabsContent value="view" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        FAQ Overview
                                    </CardTitle>
                                    <CardDescription>
                                        View and edit the general information for your FAQ section
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {/* First Time Setup - No Data Available */}
                                        {(!faqData?.title && !faqData?.description) ? (
                                            <div className="space-y-4">
                                                <div className="text-center py-8">
                                                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                                    <h3 className="text-lg font-medium mb-2">Set up your FAQ section</h3>
                                                    <p className="text-sm text-gray-500 mb-6">
                                                        Add a title and description to get started with your FAQ section
                                                    </p>
                                                </div>

                                                {/* Title Input */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">FAQ Title</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter FAQ title..."
                                                        value={unsavedTitle}
                                                        onChange={(e) => handleTitleUpdate(e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                </div>

                                                {/* Description Input */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">FAQ Description</label>
                                                    <textarea
                                                        placeholder="Enter FAQ description..."
                                                        value={unsavedDescription}
                                                        onChange={(e) => handleDescriptionUpdate(e.target.value)}
                                                        rows={4}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                                                    />
                                                </div>

                                                {/* Save Button for First Time */}
                                                {(unsavedTitle || unsavedDescription) && (
                                                    <div className="flex justify-end pt-4">
                                                        <Button
                                                            onClick={saveChanges}
                                                            className="bg-blue-600 hover:bg-blue-700"
                                                        >
                                                            Create FAQ Section
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            /* Existing Data - Preview with Double-click Edit */
                                            <div className="space-y-4">
                                                {/* Title Section */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">FAQ Title</label>
                                                    {!hasUnsavedChanges ? (
                                                        <div
                                                            className="w-full px-3 py-2 border border-transparent rounded-md text-sm cursor-pointer hover:bg-gray-500/50 transition-colors"
                                                            onDoubleClick={() => setHasUnsavedChanges(true)}
                                                        >
                                                            {faqData?.title || "No title set"}
                                                        </div>
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            value={unsavedTitle}
                                                            onChange={(e) => handleTitleUpdate(e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            autoFocus
                                                        />
                                                    )}
                                                </div>

                                                {/* Description Section */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">FAQ Description</label>
                                                    {!hasUnsavedChanges ? (
                                                        <div
                                                            className="w-full px-3 py-2 border border-transparent rounded-md text-sm cursor-pointer hover:bg-gray-500/50 transition-colors min-h-[80px]"
                                                            onDoubleClick={() => setHasUnsavedChanges(true)}
                                                        >
                                                            {faqData?.description || "No description set"}
                                                        </div>
                                                    ) : (
                                                        <textarea
                                                            value={unsavedDescription}
                                                            onChange={(e) => handleDescriptionUpdate(e.target.value)}
                                                            rows={4}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                                                            autoFocus
                                                        />
                                                    )}
                                                </div>

                                                {/* Save/Cancel Buttons */}
                                                {hasUnsavedChanges && (
                                                    <div className="flex justify-end gap-2 pt-4 border-t">
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => {
                                                                setUnsavedTitle(faqData?.title || "")
                                                                setUnsavedDescription(faqData?.description || "")
                                                                setHasUnsavedChanges(false)
                                                            }}
                                                        >
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            onClick={saveChanges}
                                                            className="bg-blue-600 hover:bg-blue-700"
                                                        >
                                                            Save Changes
                                                        </Button>
                                                    </div>
                                                )}

                                                {/* Preview Section */}
                                                {(faqData?.title || faqData?.description) && !hasUnsavedChanges && (
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Preview</label>
                                                        <div className="border rounded-lg p-4">
                                                            {faqData?.title && (
                                                                <h2 className="text-xl font-bold mb-2">{faqData.title}</h2>
                                                            )}
                                                            {faqData?.description && (
                                                                <p className="text-gray-700">{faqData.description}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Statistics */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold">{faqItems.length}</div>
                                                <div className="text-sm text-muted-foreground">Total Questions</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold">
                                                    {faqData?.lastUpdated ? new Date(faqData.lastUpdated).toLocaleDateString() : "Never"}
                                                </div>
                                                <div className="text-sm text-muted-foreground">Last Updated</div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="manage" className="space-y-6">
                            {/* FAQ Statistics */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        FAQ Statistics
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold">{faqItems.length}</div>
                                            <div className="text-sm text-muted-foreground">Total Questions</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold">
                                                {faqData?.lastUpdated ? new Date(faqData.lastUpdated).toLocaleDateString() : "Never"}
                                            </div>
                                            <div className="text-sm text-muted-foreground">Last Updated</div>
                                        </div>
                                        <div className="text-center">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setShowSubmissionsDialog(true)}
                                                className="relative"
                                            >
                                                View Submissions
                                                {submissionCount && submissionCount > 0 && (
                                                    <Badge
                                                        variant="destructive"
                                                        className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                                                    >
                                                        {submissionCount > 99 ? '99+' : submissionCount}
                                                    </Badge>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* FAQ Items */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>FAQ Items</CardTitle>
                                        <CardDescription>
                                            Manage your frequently asked questions and answers
                                        </CardDescription>
                                    </div>
                                    <Button onClick={() => setEditingItem({} as FAQItem)}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Question
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    {isLoading ? (
                                        <div className="text-center py-8">Loading FAQ items...</div>
                                    ) : (
                                        <div className="space-y-4">
                                            {faqItems.length === 0 ? (
                                                <div className="text-center py-8 text-gray-500">
                                                    <p className="text-lg font-medium">No FAQ items yet</p>
                                                    <p className="text-sm">FAQ items will appear here once they are created</p>
                                                </div>
                                            ) : (
                                                faqItems.sort((a, b) => a.order - b.order).map((item, index) => (
                                                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                                                        <CardHeader className="pb-3 flex flex-row items-center justify-between">
                                                            <div className="flex items-start gap-3 flex-1">
                                                                <Badge variant="outline" className="shrink-0 mt-1">#{index + 1}</Badge>
                                                                <div className="flex-1">
                                                                    <CardTitle className="text-lg cursor-pointer" onClick={() => setEditingItem(item)}>
                                                                        {item.question}
                                                                    </CardTitle>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-1 ml-4">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => setEditingItem(item)}
                                                                    className="h-8 w-8 p-0"
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleDelete(item)}
                                                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </CardHeader>
                                                        <Separator />
                                                        <CardContent className="pt-4">
                                                            <div className="prose prose-sm max-w-none">
                                                                <MarkdownPreview content={item.answer} />
                                                            </div>
                                                            <div className="text-xs text-muted-foreground mt-3">
                                                                Last updated: {new Date(item.updatedAt).toLocaleDateString()}
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="import" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Upload className="h-4 w-4" />
                                        Import FAQ from File
                                    </CardTitle>
                                    <CardDescription>
                                        Upload a CSV or Excel file with your FAQ data
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-8">
                                        <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                        <p className="text-lg font-medium mb-2">Import FAQ Data</p>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Upload a CSV or Excel file with columns: question, answer
                                        </p>
                                        <Button onClick={() => setShowImportDialog(true)}>
                                            <Upload className="h-4 w-4 mr-2" />
                                            Import FAQ
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="generate" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Wand2 className="h-4 w-4" />
                                        Generate FAQ Form
                                        {submissionCount && submissionCount > 0 && (
                                            <Badge
                                                variant="destructive"
                                                className="ml-2"
                                            >
                                                {submissionCount} pending
                                            </Badge>
                                        )}
                                    </CardTitle>
                                    <CardDescription>
                                        Automatically generate a form to collect FAQ questions and answers
                                        {submissionCount && submissionCount > 0 && (
                                            <span className="block mt-1 text-orange-600">
                                                You have {submissionCount} submission{submissionCount > 1 ? 's' : ''} waiting for review
                                            </span>
                                        )}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-8">
                                        <Wand2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                        <p className="text-lg font-medium mb-2">Generate FAQ Form</p>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Create a form with your questions and collect answers from users
                                        </p>
                                        <div className="flex gap-2">
                                            <Button onClick={() => setShowGenerationDialog(true)}>
                                                <Wand2 className="h-4 w-4 mr-2" />
                                                Generate Form
                                            </Button>
                                            {submissionCount && submissionCount > 0 && (
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setShowSubmissionsDialog(true)}
                                                    className="relative"
                                                >
                                                    View Submissions
                                                    <Badge
                                                        variant="destructive"
                                                        className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                                                    >
                                                        {submissionCount > 99 ? '99+' : submissionCount}
                                                    </Badge>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>

            {/* FAQ Item Dialog */}
            <FAQItemDialog
                open={!!editingItem}
                onOpenChange={(open) => !open && setEditingItem(null)}
                item={editingItem}
                collegeId={collegeId}
                onSuccess={() => {
                    queryClient.invalidateQueries({ queryKey: ["faq", collegeId] })
                    setEditingItem(null)
                }}
            />

            {/* FAQ Import Dialog */}
            <FAQImportDialog
                open={showImportDialog}
                onOpenChange={setShowImportDialog}
                collegeId={collegeId}
                onSuccess={() => {
                    queryClient.invalidateQueries({ queryKey: ["faq", collegeId] })
                    setShowImportDialog(false)
                }}
            />

            {/* FAQ Generation Dialog */}
            <FAQGenerationDialog
                open={showGenerationDialog}
                onOpenChange={setShowGenerationDialog}
                collegeId={collegeId}
                collegeName={collegeName}
                onSuccess={() => {
                    setShowGenerationDialog(false)
                    toast.success("FAQ form generated successfully!")
                }}
            />

            {/* FAQ Submissions Dialog */}
            <FAQSubmissionsDialog
                open={showSubmissionsDialog}
                onOpenChange={setShowSubmissionsDialog}
                collegeId={collegeId}
                onSuccess={() => {
                    queryClient.invalidateQueries({ queryKey: ["faq", collegeId] })
                }}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deletingItem} onOpenChange={(open) => !open && setDeletingItem(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete FAQ Item</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this FAQ item? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setDeletingItem(null)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
} 