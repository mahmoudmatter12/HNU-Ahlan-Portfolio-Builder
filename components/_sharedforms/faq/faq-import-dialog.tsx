"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FAQService } from "@/services/faq-service"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Loader2, Upload, FileText, AlertCircle, CheckCircle } from "lucide-react"
import type { FAQImportData } from "@/types/faq"

interface FAQImportDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    collegeId: string
    onSuccess: () => void
}

export function FAQImportDialog({ open, onOpenChange, collegeId, onSuccess }: FAQImportDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [importedData, setImportedData] = useState<FAQImportData[]>([])
    const [error, setError] = useState<string | null>(null)
    const [fileName, setFileName] = useState<string>("")

    const queryClient = useQueryClient()

    const importMutation = useMutation({
        mutationFn: (data: FAQImportData[]) => FAQService.importFAQ(collegeId, data),
        onSuccess: () => {
            toast.success(`Successfully imported ${importedData.length} FAQ items`)
            onSuccess()
            handleClose()
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to import FAQ data")
        },
    })

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        setFileName(file.name)
        setError(null)

        // Check file type
        const allowedTypes = [
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ]

        if (!allowedTypes.includes(file.type)) {
            setError("Please upload a CSV or Excel file")
            return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string
                const data = parseFileData(text, file.type)
                setImportedData(data)
            } catch (err) {
                setError("Failed to parse file. Please check the format.")
            }
        }
        reader.readAsText(file)
    }

    const parseFileData = (text: string, fileType: string): FAQImportData[] => {
        const lines = text.split('\n').filter(line => line.trim())

        if (lines.length < 2) {
            throw new Error("File must have at least a header row and one data row")
        }

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
        const questionIndex = headers.findIndex(h => h === 'question')
        const answerIndex = headers.findIndex(h => h === 'answer')

        if (questionIndex === -1 || answerIndex === -1) {
            throw new Error("File must have 'question' and 'answer' columns")
        }

        const data: FAQImportData[] = []

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim())
            if (values.length >= Math.max(questionIndex, answerIndex) + 1) {
                const question = values[questionIndex]?.replace(/"/g, '') || ''
                const answer = values[answerIndex]?.replace(/"/g, '') || ''

                if (question && answer) {
                    data.push({ question, answer })
                }
            }
        }

        if (data.length === 0) {
            throw new Error("No valid data found in file")
        }

        return data
    }

    const handleImport = () => {
        if (importedData.length === 0) {
            setError("No data to import")
            return
        }

        setIsSubmitting(true)
        importMutation.mutate(importedData)
    }

    const handleClose = () => {
        setImportedData([])
        setError(null)
        setFileName("")
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        Import FAQ from File
                    </DialogTitle>
                    <DialogDescription>
                        Upload a CSV or Excel file with your FAQ data. The file should have columns: question, answer
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* File Upload */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Upload File</CardTitle>
                            <CardDescription>
                                Select a CSV or Excel file with your FAQ data
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                <p className="text-lg font-medium mb-2">Upload FAQ File</p>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Supported formats: CSV, Excel (.xlsx, .xls)
                                </p>
                                <input
                                    type="file"
                                    accept=".csv,.xlsx,.xls"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    id="faq-file-upload"
                                />
                                <label htmlFor="faq-file-upload">
                                    <Button asChild>
                                        <span>
                                            <Upload className="h-4 w-4 mr-2" />
                                            Choose File
                                        </span>
                                    </Button>
                                </label>
                            </div>

                            {fileName && (
                                <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
                                    <CheckCircle className="h-4 w-4" />
                                    {fileName} uploaded successfully
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Preview */}
                    {importedData.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Preview ({importedData.length} items)
                                </CardTitle>
                                <CardDescription>
                                    Review the data before importing
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4 max-h-60 overflow-y-auto">
                                    {importedData.slice(0, 5).map((item, index) => (
                                        <div key={index} className="border rounded-lg p-3">
                                            <div className="flex items-start gap-2">
                                                <Badge variant="secondary">#{index + 1}</Badge>
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm">{item.question}</p>
                                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                        {item.answer}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {importedData.length > 5 && (
                                        <div className="text-center text-sm text-muted-foreground">
                                            ... and {importedData.length - 5} more items
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Error Display */}
                    {error && (
                        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </div>
                    )}

                    {/* Instructions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>File Format Requirements</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span>File must have a header row with columns: <code className="bg-gray-100 px-1 rounded">question</code> and <code className="bg-gray-100 px-1 rounded">answer</code></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span>Each row should contain one question and its corresponding answer</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span>Empty rows will be ignored</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span>Answers can contain markdown formatting</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleImport}
                        disabled={isSubmitting || importedData.length === 0}
                    >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Import {importedData.length > 0 && `(${importedData.length} items)`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 