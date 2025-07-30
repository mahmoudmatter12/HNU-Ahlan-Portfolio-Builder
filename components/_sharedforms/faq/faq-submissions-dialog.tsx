"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
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
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
    Loader2,
    FileText,
    CheckCircle,
    XCircle,
    Eye,
    MessageSquare,
} from "lucide-react"
import { MarkdownPreview } from "@/components/markdown-preview"
import MDEditor from "@uiw/react-md-editor"

interface FAQSubmissionsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    collegeId: string
    onSuccess: () => void
}

export function FAQSubmissionsDialog({
    open,
    onOpenChange,
    collegeId,
    onSuccess
}: FAQSubmissionsDialogProps) {
    const [selectedSubmission, setSelectedSubmission] = useState<any>(null)
    const [processingSubmission, setProcessingSubmission] = useState<string | null>(null)
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [showAnswerForm, setShowAnswerForm] = useState(false)

    const queryClient = useQueryClient()

    // Fetch FAQ submissions
    const { data: submissions, isLoading } = useQuery({
        queryKey: ["faq-submissions", collegeId],
        queryFn: () => FAQService.getFAQSubmissions(collegeId),
        enabled: open
    })

    console.log("submissions?.data", submissions)

    // Extract questions from submission data
    const getSubmissionQuestions = (submission: any) => {
        if (!submission?.data) return []

        // The data object has questions as keys
        const questions = Object.keys(submission.data)
        return questions.map(question => ({
            question,
            answer: submission.data[question] || ""
        }))
    }

    const processMutation = useMutation({
        mutationFn: ({ submissionId, action, answers }: { submissionId: string; action: 'approve' | 'reject'; answers?: Record<string, string> | { questions: Array<{ question: string; answer: string }> } }) =>
            FAQService.processFAQSubmission(collegeId, submissionId, action, answers),
        onSuccess: (data, variables) => {
            const action = variables.action === 'approve' ? 'approved' : 'rejected'
            toast.success(`Submission ${action} successfully`)
            queryClient.invalidateQueries({ queryKey: ["faq-submissions", collegeId] })
            queryClient.invalidateQueries({ queryKey: ["faq", collegeId] })
            queryClient.invalidateQueries({ queryKey: ["faq-submission-count", collegeId] })
            onSuccess()
            setProcessingSubmission(null)
            setSelectedSubmission(null)
            setAnswers({})
            setShowAnswerForm(false)
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to process submission")
            setProcessingSubmission(null)
        },
    })

    const handleProcessSubmission = (submissionId: string, action: 'approve' | 'reject') => {
        if (action === 'approve') {
            setShowAnswerForm(true)
        } else {
            setProcessingSubmission(submissionId)
            processMutation.mutate({ submissionId, action })
        }
    }

    const handleSubmitWithAnswers = () => {
        if (!selectedSubmission) return

        // Get questions from submission data
        const submissionQuestions = Object.keys(selectedSubmission.data || {})

        // Validate that all questions have answers
        const missingAnswers = submissionQuestions.filter((_, index) => !answers[`answer_${index}`]?.trim())

        if (missingAnswers.length > 0) {
            toast.error(`Please provide answers for all questions`)
            return
        }

        setProcessingSubmission(selectedSubmission.id)
        processMutation.mutate({
            submissionId: selectedSubmission.id,
            action: 'approve',
            answers: {
                questions: submissionQuestions.map((question, index) => ({
                    question: question,
                    answer: answers[`answer_${index}`] || ""
                }))
            }
        })
    }

    const handleAnswerChange = (fieldId: string, value: string) => {
        setAnswers(prev => ({
            ...prev,
            [fieldId]: value
        }))
    }

    const handleViewSubmission = (submission: any) => {
        setSelectedSubmission(submission)
    }

    const handleClose = () => {
        setSelectedSubmission(null)
        setProcessingSubmission(null)
        onOpenChange(false)
    }

    const submissionsList = submissions || []

    return (
        <>
            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            FAQ Form Submissions
                        </DialogTitle>
                        <DialogDescription>
                            Review and process submissions from your FAQ forms. Approve submissions to add them to your FAQ section.
                        </DialogDescription>
                    </DialogHeader>

                    {isLoading ? (
                        <div className="text-center py-8">
                            <Loader2 className="h-8 w-8 mx-auto animate-spin mb-4" />
                            <p>Loading submissions...</p>
                        </div>
                    ) : submissionsList.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium">No submissions yet</p>
                            <p className="text-sm">Submissions from your FAQ forms will appear here</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {submissionsList.map((submission) => (
                                <Card key={submission.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h4 className="font-medium">
                                                        {submission.formSection?.title || "FAQ Form Submission"}
                                                    </h4>
                                                    <Badge variant="secondary">
                                                        {new Date(submission.submittedAt).toLocaleDateString()}
                                                    </Badge>
                                                </div>

                                                <div className="text-sm text-muted-foreground mb-3">
                                                    Submitted on {new Date(submission.submittedAt).toLocaleString()}
                                                </div>

                                                {/* Preview of first few answers */}
                                                <div className="space-y-2">
                                                    {submission.formSection?.fields?.slice(0, 2).map((field: any) => {
                                                        const answer = submission.data[field.id] || ""
                                                        return (
                                                            <div key={field.id} className="text-sm">
                                                                <span className="font-medium">{field.label}:</span>
                                                                <span className="ml-2 text-muted-foreground line-clamp-1">
                                                                    {answer}
                                                                </span>
                                                            </div>
                                                        )
                                                    })}
                                                    {submission.formSection?.fields?.length > 2 && (
                                                        <div className="text-sm text-muted-foreground">
                                                            ... and {submission.formSection.fields.length - 2} more answers
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 ml-4">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleViewSubmission(submission)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleProcessSubmission(submission.id, 'approve')}
                                                    disabled={processingSubmission === submission.id}
                                                >
                                                    {processingSubmission === submission.id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleProcessSubmission(submission.id, 'reject')}
                                                    disabled={processingSubmission === submission.id}
                                                >
                                                    {processingSubmission === submission.id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <XCircle className="h-4 w-4 text-red-600" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Submission Detail Dialog */}
            <Dialog open={!!selectedSubmission} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Submission Details
                        </DialogTitle>
                        <DialogDescription>
                            Review the complete submission before processing
                        </DialogDescription>
                    </DialogHeader>

                    {selectedSubmission && (
                        <div className="space-y-6">
                            {/* Submission Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Submission Information</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div>
                                            <span className="font-medium">Form:</span> {selectedSubmission.formSection?.title}
                                        </div>
                                        <div>
                                            <span className="font-medium">Submitted:</span> {new Date(selectedSubmission.submittedAt).toLocaleString()}
                                        </div>
                                        <div>
                                            <span className="font-medium">Questions:</span> {Object.keys(selectedSubmission.data || {}).length}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Answers */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Submitted Questions & Answers</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {Object.entries(selectedSubmission.data || {}).map(([question, userAnswer], index) => (
                                            <div key={index} className="border rounded-lg p-4">
                                                <h4 className="font-medium mb-2 text-blue-600">Question {index + 1}:</h4>
                                                <p className="text-gray-700 mb-3">{question}</p>
                                                <h5 className="font-medium mb-2 text-green-600">User&apos;s Answer:</h5>
                                                <div className="prose prose-sm max-w-none  p-3 rounded">
                                                    <MarkdownPreview content={userAnswer as string} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Answer Form */}
                            {showAnswerForm && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MessageSquare className="h-5 w-5" />
                                            Provide FAQ Answers
                                        </CardTitle>
                                        <CardDescription>
                                            Write professional answers to the submitted questions. These will be added to your FAQ section.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {Object.entries(selectedSubmission.data || {}).map(([question, userAnswer], index) => (
                                                <div key={index} className="space-y-2">
                                                    <div className="p-3 bg-gray-50 rounded-lg">
                                                        <h4 className="font-medium text-sm text-gray-700">Question {index + 1}:</h4>
                                                        <p className="text-sm text-gray-900">{question}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium">Your Professional Answer:</label>
                                                        <div data-color-mode="dark" className="mt-1">
                                                            <MDEditor
                                                                value={answers[`answer_${index}`] || ""}
                                                                onChange={(value) => handleAnswerChange(`answer_${index}`, value || "")}
                                                                height={200}
                                                                preview="edit"
                                                                hideToolbar={false}
                                                                textareaProps={{
                                                                    placeholder: "Provide a detailed, professional answer in markdown format...",
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Actions */}
                            <div className="flex justify-end gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSelectedSubmission(null)
                                        setShowAnswerForm(false)
                                        setAnswers({})
                                    }}
                                >
                                    Close
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => handleProcessSubmission(selectedSubmission.id, 'reject')}
                                    disabled={processingSubmission === selectedSubmission.id}
                                >
                                    {processingSubmission === selectedSubmission.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                        <XCircle className="h-4 w-4 mr-2" />
                                    )}
                                    Reject
                                </Button>
                                {!showAnswerForm ? (
                                    <Button
                                        onClick={() => handleProcessSubmission(selectedSubmission.id, 'approve')}
                                        disabled={processingSubmission === selectedSubmission.id}
                                    >
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        Add Answers & Approve
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleSubmitWithAnswers}
                                        disabled={processingSubmission === selectedSubmission.id}
                                    >
                                        {processingSubmission === selectedSubmission.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        ) : (
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                        )}
                                        Approve & Add to FAQ
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
} 