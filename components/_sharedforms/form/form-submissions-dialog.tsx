"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { FormService } from "@/services/form-service"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Download, Search, Calendar, Users, Filter, Eye, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
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
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Submission Statistics
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold">{submissions?.length || 0}</div>
                                    <div className="text-sm text-muted-foreground">Total Submissions</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold">{form._count?.fields || 0}</div>
                                    <div className="text-sm text-muted-foreground">Form Fields</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold">
                                        {submissions && submissions.length > 0
                                            ? new Date(submissions[0].submittedAt).toLocaleDateString()
                                            : "No submissions"
                                        }
                                    </div>
                                    <div className="text-sm text-muted-foreground">Latest Submission</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold">
                                        {submissions && submissions.length > 0
                                            ? new Date(submissions[submissions.length - 1].submittedAt).toLocaleDateString()
                                            : "No submissions"
                                        }
                                    </div>
                                    <div className="text-sm text-muted-foreground">First Submission</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Search and Actions */}
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex-1 max-w-md">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search submissions..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <Button onClick={exportSubmissions} disabled={!submissions || submissions.length === 0}>
                                    <Download className="h-4 w-4 mr-2" />
                                    Export CSV
                                </Button>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Submissions Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Submissions</CardTitle>
                            <CardDescription>
                                {filteredSubmissions.length} of {submissions?.length || 0} submissions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="space-y-4">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="flex items-center space-x-4">
                                            <Skeleton className="h-12 w-12 rounded-full" />
                                            <div className="space-y-2 flex-1">
                                                <Skeleton className="h-4 w-48" />
                                                <Skeleton className="h-3 w-32" />
                                            </div>
                                            <Skeleton className="h-8 w-20" />
                                        </div>
                                    ))}
                                </div>
                            ) : isError ? (
                                <div className="text-center py-8">
                                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">Failed to load submissions</h3>
                                    <p className="text-muted-foreground">There was an error loading the submissions.</p>
                                </div>
                            ) : filteredSubmissions.length === 0 ? (
                                <div className="text-center py-8">
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
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => viewSubmissionDetails(submission)}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Submission Details Dialog */}
                {selectedSubmission && (
                    <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
                        <DialogContent className="sm:max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Submission Details</DialogTitle>
                                <DialogDescription>
                                    Submitted on {new Date(selectedSubmission.submittedAt).toLocaleString()}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-4">
                                    {Object.entries(selectedSubmission.data).map(([field, value]: [string, any]) => (
                                        <div key={field} className="border rounded-lg p-4">
                                            <h4 className="font-medium text-sm text-muted-foreground mb-2">{field}</h4>
                                            <p className="text-sm">
                                                {Array.isArray(value) ? value.join(", ") : String(value || "Not provided")}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </DialogContent>
        </Dialog>
    )
} 