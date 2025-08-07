"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { FormService } from "@/services/form.service"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Users, Calendar, Download, Search, Eye, FileText, File, Image } from "lucide-react"
import type { FormSection } from "@/types/form"

interface FormSubmissionsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    form: FormSection | null
}

export function FormSubmissionsDialog({ open, onOpenChange, form }: FormSubmissionsDialogProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedSubmission, setSelectedSubmission] = useState<any>(null)

    const {
        data: submissions,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["form-submissions", form?.id],
        queryFn: () => FormService.getFormSubmissions(form?.id || ""),
        enabled: !!form?.id,
    })

    const filteredSubmissions = submissions?.filter((submission: any) => {
        const searchLower = searchTerm.toLowerCase()
        const dataString = JSON.stringify(submission.data).toLowerCase()
        return dataString.includes(searchLower)
    }) || []

    const exportSubmissions = () => {
        if (!submissions || submissions.length === 0) {
            toast.error("No submissions to export")
            return
        }

        // Convert submissions to CSV format
        const headers = form?.fields?.map(field => field.label) || []
        const csvContent = [
            ["Submission ID", "Submitted At", ...headers].join(","),
            ...submissions.map((submission: any) => {
                const values = headers.map(header => {
                    const value = submission.data[header]
                    // Handle file URLs - just include the filename or URL
                    if (typeof value === 'string' && value.startsWith('http')) {
                        return `"${value}"` // File URL
                    }
                    return typeof value === 'string' ? `"${value}"` : value || ""
                })
                return [submission.id, submission.submittedAt, ...values].join(",")
            })
        ].join("\n")

        // Create and download CSV file
        const blob = new Blob([csvContent], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${form?.title}-submissions-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)

        toast.success("Submissions exported successfully!")
    }

    const viewSubmissionDetails = (submission: any) => {
        setSelectedSubmission(submission)
    }

    const renderFieldValue = (field: any, value: any) => {
        if (!value) return <span className="text-muted-foreground">Not provided</span>

        // Handle file uploads
        if (field.type === "FILE" && typeof value === 'string' && value.startsWith('http')) {
            const isImage = value.match(/\.(jpg|jpeg|png|gif|webp)$/i)
            return (
                <div className="flex items-center gap-2">
                    {isImage ? (
                        <Image className="h-4 w-4 text-blue-600" />
                    ) : (
                        <File className="h-4 w-4 text-gray-600" />
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(value, '_blank')}
                        className="h-auto p-1"
                    >
                        <Eye className="h-3 w-3 mr-1" />
                        {isImage ? 'View Image' : 'View File'}
                    </Button>
                </div>
            )
        }

        // Handle arrays (checkbox selections)
        if (Array.isArray(value)) {
            return (
                <div className="space-y-1">
                    {value.map((item, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                            {item}
                        </Badge>
                    ))}
                </div>
            )
        }

        // Handle long text
        if (typeof value === 'string' && value.length > 100) {
            return (
                <div className="max-w-xs">
                    <p className="text-sm truncate" title={value}>
                        {value.substring(0, 100)}...
                    </p>
                </div>
            )
        }

        return <span className="text-sm">{String(value)}</span>
    }

    if (!form) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Form Submissions: {form.title}
                    </DialogTitle>
                    <DialogDescription>
                        View and manage all submissions for this form. You can search, filter, and export the data.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{submissions?.length || 0}</div>
                                <p className="text-xs text-muted-foreground">
                                    Form responses collected
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Form Fields</CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{form.fields?.length || 0}</div>
                                <p className="text-xs text-muted-foreground">
                                    Fields in this form
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Latest Submission</CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {submissions && submissions.length > 0
                                        ? new Date(submissions[0].submittedAt).toLocaleDateString()
                                        : "None"
                                    }
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Most recent response
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Search and Export */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search submissions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Button onClick={exportSubmissions} disabled={!submissions || submissions.length === 0}>
                            <Download className="h-4 w-4 mr-2" />
                            Export CSV
                        </Button>
                    </div>

                    {/* Submissions List */}
                    {isLoading ? (
                        <Card>
                            <CardContent className="flex items-center justify-center py-8">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                                    <p className="text-muted-foreground">Loading submissions...</p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : isError ? (
                        <Card>
                            <CardContent className="flex items-center justify-center py-8">
                                <div className="text-center">
                                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">Failed to load submissions</h3>
                                    <p className="text-muted-foreground">There was an error loading the submissions.</p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : filteredSubmissions.length === 0 ? (
                        <Card>
                            <CardContent className="flex items-center justify-center py-8">
                                <div className="text-center">
                                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">
                                        {submissions?.length === 0 ? "No submissions yet" : "No submissions match your search"}
                                    </h3>
                                    <p className="text-muted-foreground">
                                        {submissions?.length === 0
                                            ? "When users submit this form, their responses will appear here."
                                            : "Try adjusting your search terms."
                                        }
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Submission ID</TableHead>
                                        <TableHead>Submitted At</TableHead>
                                        <TableHead>Fields Filled</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredSubmissions.map((submission: any) => (
                                        <TableRow key={submission.id}>
                                            <TableCell className="font-mono text-sm">
                                                {submission.id.slice(0, 8)}...
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    {new Date(submission.submittedAt).toLocaleString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {Object.keys(submission.data).length} fields
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => viewSubmissionDetails(submission)}
                                                >
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View Details
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>

                {/* Submission Details Dialog */}
                <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
                    <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Submission Details</DialogTitle>
                            <DialogDescription>
                                Detailed view of the form submission
                            </DialogDescription>
                        </DialogHeader>
                        {selectedSubmission && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <span>ID: {selectedSubmission.id}</span>
                                    <span>Submitted: {new Date(selectedSubmission.submittedAt).toLocaleString()}</span>
                                </div>
                                <Separator />
                                <div className="space-y-4">
                                    {form.fields?.map((field) => {
                                        const value = selectedSubmission.data[field.label]
                                        return (
                                            <div key={field.id} className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-medium text-sm">{field.label}</h4>
                                                    {field.isRequired && (
                                                        <Badge variant="destructive" className="text-xs">Required</Badge>
                                                    )}
                                                    <Badge variant="outline" className="text-xs">{field.type}</Badge>
                                                </div>
                                                <div className="pl-4">
                                                    {renderFieldValue(field, value)}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </DialogContent>
        </Dialog>
    )
} 