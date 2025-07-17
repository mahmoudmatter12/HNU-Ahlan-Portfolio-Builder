"use client"

import { useState } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { FormService } from "@/services/form-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, Send, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { useParams } from "next/navigation"
import { FormPreview } from "@/components/_sharedforms/form/form-preview"

export default function FormPage() {
    const params = useParams()
    const formId = params.formId as string
    const [isSubmitted, setIsSubmitted] = useState(false)

    const {
        data: form,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["form", formId],
        queryFn: () => FormService.getFormSectionWithFields(formId),
    })

    const submitMutation = useMutation({
        mutationFn: (data: Record<string, any>) =>
            FormService.submitForm(formId, {
                data,
                collegeId: form?.collegeId || "",
            }),
        onSuccess: () => {
            toast.success("Form submitted successfully!")
            setIsSubmitted(true)
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to submit form")
        },
    })

    const handleSubmit = (data: Record<string, any>) => {
        submitMutation.mutate(data)
    }

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <Card>
                        <CardContent className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                                <p className="text-muted-foreground">Loading form...</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    if (isError || !form) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <Card>
                        <CardContent className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                                <h2 className="text-xl font-semibold mb-2">Form Not Found</h2>
                                <p className="text-muted-foreground">
                                    The form you&apos;re looking for doesn&apos;t exist or has been removed.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    if (isSubmitted) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <Card>
                        <CardContent className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                                <h2 className="text-xl font-semibold mb-2">Form Submitted Successfully!</h2>
                                <p className="text-muted-foreground mb-4">
                                    Thank you for your submission. Your response has been recorded.
                                </p>
                                <Button onClick={() => window.close()}>
                                    Close
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                {/* Form Header */}
                <Card className="mb-6">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <FileText className="h-6 w-6 text-primary" />
                            <div>
                                <CardTitle className="text-2xl">{form.title}</CardTitle>
                                {form.college && (
                                    <CardDescription>
                                        {form.college.name}
                                    </CardDescription>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                                {form.fields?.length || 0} fields
                            </Badge>
                            <Badge variant="outline">
                                Created {new Date(form.createdAt).toLocaleDateString()}
                            </Badge>
                        </div>
                    </CardHeader>
                </Card>

                {/* Form Content */}
                <FormPreview
                    title=""
                    fields={form.fields || []}
                    onSubmit={handleSubmit}
                    isPreview={false}
                />

                {/* Submission Status */}
                {submitMutation.isPending && (
                    <Card className="mt-6">
                        <CardContent className="flex items-center justify-center py-6">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                                <p className="text-sm text-muted-foreground">Submitting your form...</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
} 