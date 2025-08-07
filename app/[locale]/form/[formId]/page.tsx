"use client"
import { useState } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, Send, CheckCircle, AlertCircle, Building2, Globe, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useParams } from "next/navigation"
import { FormPreview } from "@/components/_sharedforms/form/form-preview"
import { FormService } from "@/services/form.service"
import { motion, AnimatePresence } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

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
                collegeId: form?.collegeId || undefined,
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
                    <Card className="border-0 shadow-lg">
                        <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent"
                            />
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-semibold">Loading Form</h3>
                                <p className="text-muted-foreground">Please wait while we prepare your form</p>
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
                    <Card className="border-destructive/30 bg-destructive/5">
                        <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
                            <AlertCircle className="h-12 w-12 text-destructive" />
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-semibold">Form Not Found</h3>
                                <p className="text-muted-foreground">
                                    The form you&apos;re looking for doesn&apos;t exist or has been removed.
                                </p>
                            </div>
                            <Button 
                                variant="outline" 
                                onClick={() => window.location.reload()}
                                className="mt-4"
                            >
                                Try Again
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    if (!form.active) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <Card className="border-yellow-500/30 bg-yellow-500/5">
                        <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
                            <AlertCircle className="h-12 w-12 text-yellow-500" />
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-semibold">Form Not Active</h3>
                                <p className="text-muted-foreground">
                                    This form is currently inactive. Please check back later or contact support.
                                </p>
                            </div>
                            <Button 
                                variant="outline" 
                                onClick={() => window.close()}
                                className="mt-4"
                            >
                                Close
                            </Button>
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
                    <Card className="border-green-500/30 bg-green-500/5">
                        <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <CheckCircle className="h-12 w-12 text-green-500" />
                            </motion.div>
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-semibold">Submission Successful!</h3>
                                <p className="text-muted-foreground">
                                    Thank you for your submission. We&apos;ve received your form.
                                </p>
                                <p className="text-muted-foreground">
                                    You can close this window now.
                                </p>
                            </div>
                            <div className="flex gap-4 mt-6">
                                <Button 
                                    variant="outline" 
                                    onClick={() => window.location.reload()}
                                >
                                    Submit Another Response
                                </Button>
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
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Form Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                        <CardHeader>
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl">{form.title}</CardTitle>
                                    {form.description && (
                                        <CardDescription className="mt-2">
                                            {form.description}
                                        </CardDescription>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap items-center gap-3">
                                {form.college ? (
                                    <Badge variant="secondary" className="gap-2">
                                        <Building2 className="h-4 w-4" />
                                        {form.college.name}
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary" className="gap-2">
                                        <Globe className="h-4 w-4" />
                                        General Form
                                    </Badge>
                                )}
                                <Badge variant="outline">
                                    {form.fields?.length || 0} fields
                                </Badge>
                                <Badge variant="outline">
                                    Created {new Date(form.createdAt).toLocaleDateString()}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Form Content */}
                <FormPreview
                    title=""
                    fields={form.fields || []}
                    onSubmit={handleSubmit}
                    isPreview={false}
                />

                {/* Submission Status */}
                <AnimatePresence>
                    {submitMutation.isPending && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="border-blue-500/20 bg-blue-500/5">
                                <CardContent className="flex items-center justify-center py-6 gap-3">
                                    <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                                    <p className="text-sm text-muted-foreground">
                                        Submitting your form...
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}