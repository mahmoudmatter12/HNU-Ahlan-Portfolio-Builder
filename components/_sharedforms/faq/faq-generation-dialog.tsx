"use client"

import { useEffect, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { FAQService } from "@/services/faq.service"
import { useRouter } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Loader2, Wand2, Plus, Trash2, ExternalLink, Check, X, Copy, Link, FileText, Users, Calendar } from "lucide-react"
import type { FAQGenerationRequest } from "@/types/faq"
import { FormSection } from "@/types/form"

// No form data needed since we're generating a form with a fixed question
type FAQGenerationFormData = Record<string, never>

interface FAQGenerationDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    collegeId: string
    collegeName: string
    onSuccess: () => void
}

export function FAQGenerationDialog({
    open,
    onOpenChange,
    collegeId,
    collegeName,
    onSuccess
}: FAQGenerationDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [generatedForm, setGeneratedForm] = useState<any>(null)
    const router = useRouter()

    // Fetch existing FAQ forms
    const {
        data: existingForms,
        isLoading: isLoadingForms,
        refetch: refetchForms
    } = useQuery({
        queryKey: ["faq-forms", collegeId],
        queryFn: () => FAQService.getFormsForCOllageByIdForFAQ(collegeId),
        enabled: open
    })

    const generatedLink = `${window.location.origin}/form/${generatedForm?.id}`

    const generationMutation = useMutation({
        mutationFn: (data: FAQGenerationRequest) => FAQService.generateFAQForm(data),
        onSuccess: (data) => {
            setGeneratedForm(data.form)
            toast.success(data.message)
            refetchForms()
            onSuccess()
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to generate FAQ form")
        },
    })

    const handleGenerateForm = async () => {
        setIsSubmitting(true)
        setError(null)

        try {
            const requestData = {
                collegeId,
                collegeName,
                questions: ["What questions do you need to know when you're here on orientation day?"]
            }


            await generationMutation.mutateAsync(requestData)
        } catch (error) {
            console.error("Generation error:", error)
            setError("Failed to generate FAQ form")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleNavigateToForm = () => {
        if (generatedForm) {
            const formUrl = `/admin/dashboard/collages/${collegeName.toLowerCase().replace(/\s+/g, '-')}/forms`
            router.push(formUrl)
            onOpenChange(false)
        }
    }

    const handleCopyFormLink = (formId: string) => {
        const formLink = `${window.location.origin}/form/${formId}`
        navigator.clipboard.writeText(formLink)
        toast.success("Form link copied to clipboard!")
    }

    const handleOpenFormInNewTab = (formId: string) => {
        const formLink = `${window.location.origin}/form/${formId}`
        window.open(formLink, '_blank')
    }

    const handleClose = () => {
        setGeneratedForm(null)
        setError(null)
        onOpenChange(false)
    }

    const hasExistingForms = existingForms && existingForms.length > 0

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Wand2 className="h-5 w-5" />
                        FAQ Questions Collection Forms
                    </DialogTitle>
                    <DialogDescription>
                        Manage forms to collect questions from users about what they need to know during orientation day.
                    </DialogDescription>
                </DialogHeader>

                {isLoadingForms ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <span className="ml-2">Loading forms...</span>
                    </div>
                ) : hasExistingForms ? (
                    // Existing Forms Display
                    <div className="space-y-6">
                        {/* Header with Create New Button */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-medium">Existing FAQ Collection Forms</h3>
                                <p className="text-sm text-muted-foreground">
                                    {existingForms.length} form{existingForms.length !== 1 ? 's' : ''} found
                                </p>
                            </div>
                            <Button onClick={handleGenerateForm} disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                <Wand2 className="h-4 w-4 mr-2" />
                                Generate New Form
                            </Button>
                        </div>

                        {/* Forms List */}
                        <div className="space-y-4">
                            {existingForms.map((form: any) => (
                                <Card key={form.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="flex items-center gap-2">
                                                    <FileText className="h-5 w-5 text-blue-600" />
                                                    {form.title}
                                                </CardTitle>
                                                <CardDescription className="mt-1">
                                                    {form.description || "No description provided"}
                                                </CardDescription>
                                            </div>
                                            <Badge variant="default" className="shrink-0">
                                                {form.fields?.length || 0} questions
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    Created {new Date(form.createdAt).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Users className="h-4 w-4" />
                                                    {form.fields?.length || 0} fields
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleCopyFormLink(form.id)}
                                                >
                                                    <Copy className="h-4 w-4 mr-2" />
                                                    Copy Link
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleOpenFormInNewTab(form.id)}
                                                >
                                                    <ExternalLink className="h-4 w-4 mr-2" />
                                                    Open Form
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        const formUrl = `/admin/dashboard/collages/${collegeName.toLowerCase().replace(/\s+/g, '-')}/forms`
                                                        router.push(formUrl)
                                                        onOpenChange(false)
                                                    }}
                                                >
                                                    <FileText className="h-4 w-4 mr-2" />
                                                    Manage
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={handleClose}>
                                Close
                            </Button>
                        </DialogFooter>
                    </div>
                ) : (
                    // No Forms - Show Generation Interface
                    <div className="space-y-6">
                        {/* Empty State */}
                        <Card className="border-dashed border-2 border-gray-300">
                            <CardContent className="pt-6">
                                <div className="text-center space-y-3">
                                    <FileText className="h-12 w-12 mx-auto text-gray-400" />
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">No FAQ Collection Forms</h3>
                                        <p className="text-sm text-gray-500">
                                            Create your first form to start collecting questions from users.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Form Description */}
                        <Card>
                            <CardHeader>
                                <CardTitle>How it works</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-start gap-2">
                                        <Badge variant="secondary" className="shrink-0 mt-0.5">1</Badge>
                                        <span>A form will be created with the question: &quot;What questions do you need to know when you&apos;re here on orientation day?&quot;</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Badge variant="secondary" className="shrink-0 mt-0.5">2</Badge>
                                        <span>Users can submit their questions through this form</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Badge variant="secondary" className="shrink-0 mt-0.5">3</Badge>
                                        <span>You can review submissions and add answers to create FAQ items</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Badge variant="secondary" className="shrink-0 mt-0.5">4</Badge>
                                        <span>Approved questions with answers will be added to your FAQ section</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Sample Question */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Sample Form Question</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="font-medium mb-2">What questions do you need to know when you&apos;re here on orientation day?</p>
                                    <p className="text-sm text-gray-600">Users will answer this question with their specific concerns and questions about orientation.</p>
                                </div>
                            </CardContent>
                        </Card>

                        {error && (
                            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                                {error}
                            </div>
                        )}

                        <DialogFooter>
                            <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button onClick={handleGenerateForm} disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                <Wand2 className="h-4 w-4 mr-2" />
                                Generate Questions Collection Form
                            </Button>
                        </DialogFooter>
                    </div>
                )}

                {/* Success State - Show when form is generated */}
                {generatedForm && (
                    <div className="space-y-6">
                        {/* Success Message */}
                        <Card className="border-green-200 bg-green-50">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                        <Check className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-green-900">Form Generated Successfully!</h3>
                                        <p className="text-sm text-green-700">
                                            Your FAQ questions collection form has been created successfully.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Form Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Form Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div>
                                        <span className="font-medium">Title:</span> {generatedForm.title}
                                    </div>
                                    <div>
                                        <span className="font-medium">Description:</span> {generatedForm.description}
                                    </div>
                                    <div>
                                        <span className="font-medium">Fields:</span> {generatedForm.fields?.length || 0} questions
                                    </div>
                                    <div>
                                        <span className="font-medium">Status:</span>
                                        <Badge variant="default" className="ml-2">Active</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Form Link */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Link className="h-5 w-5" />
                                    Form Link
                                </CardTitle>
                                <CardDescription>
                                    Share this link with users to collect their questions
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                        <input
                                            type="text"
                                            value={generatedLink}
                                            readOnly
                                            className="flex-1 bg-transparent border-none outline-none text-sm"
                                        />
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleCopyFormLink(generatedForm.id)}
                                        >
                                            <Copy className="h-4 w-4 mr-2" />
                                            Copy
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleOpenFormInNewTab(generatedForm.id)}
                                        >
                                            <ExternalLink className="h-4 w-4 mr-2" />
                                            Open
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Next Steps */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Next Steps</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <p className="text-sm text-muted-foreground">
                                        Now you can:
                                    </p>
                                    <div className="space-y-2">
                                        <Button onClick={handleNavigateToForm} className="w-full justify-start">
                                            <ExternalLink className="h-4 w-4 mr-2" />
                                            Go to Forms Dashboard
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setGeneratedForm(null)
                                                refetchForms()
                                            }}
                                            className="w-full justify-start"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Generate Another Form
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <DialogFooter>
                            <Button onClick={handleClose}>
                                Done
                            </Button>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
} 