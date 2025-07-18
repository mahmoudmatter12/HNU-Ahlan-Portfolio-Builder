"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileText, AlertCircle, CheckCircle, Upload, X, Eye, Download } from "lucide-react"
import { toast } from "sonner"
import type { CreateFormFieldData } from "@/types/form"
import Image from "next/image"

interface FormPreviewProps {
    title: string
    description?: string
    fields: CreateFormFieldData[]
    onSubmit?: (data: Record<string, any>) => void
    isPreview?: boolean
}

export function FormPreview({
    title,
    description,
    fields,
    onSubmit,
    isPreview = true
}: FormPreviewProps) {
    const [formData, setFormData] = useState<Record<string, any>>({})
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [uploadedFiles, setUploadedFiles] = useState<Record<string, { url: string; publicId: string; fileName: string }>>({})
    const [fileConfirmDialog, setFileConfirmDialog] = useState<{ fieldId: string; file: File; url: string } | null>(null)
    const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({})

    const handleInputChange = (fieldId: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [fieldId]: value
        }))

        // Real-time validation
        const field = fields.find(f => f.label === fieldId)
        if (field) {
            const error = validateField(field, value)
            setErrors(prev => {
                const newErrors = { ...prev }
                if (error) {
                    newErrors[fieldId] = error
                } else {
                    delete newErrors[fieldId]
                }
                return newErrors
            })
        }
    }

    const handleFileUpload = async (fieldId: string, file: File) => {
        const field = fields.find(f => f.label === fieldId)
        if (!field) return

        // Validate file
        const validation = field.validation
        if (validation) {
            // Check file type
            if (validation.allowedFileTypes && validation.allowedFileTypes.length > 0) {
                const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`
                if (!validation.allowedFileTypes.includes(fileExtension)) {
                    toast.error(`File type not allowed. Allowed types: ${validation.allowedFileTypes.join(", ")}`)
                    return
                }
            }

            // Check file size
            if (validation.maxFileSize && file.size > validation.maxFileSize) {
                const maxSizeMB = Math.round(validation.maxFileSize / (1024 * 1024))
                toast.error(`File size must be less than ${maxSizeMB}MB`)
                return
            }
        }

        // Create preview URL
        const previewUrl = URL.createObjectURL(file)
        setFileConfirmDialog({ fieldId, file, url: previewUrl })
    }

    const confirmFileUpload = async () => {
        if (!fileConfirmDialog) return

        const { fieldId, file } = fileConfirmDialog
        setUploadingFiles(prev => ({ ...prev, [fieldId]: true }))

        try {
            // Upload file via API
            const formData = new FormData()
            formData.append("file", file)
            formData.append("formName", title.replace(/\s+/g, '_').toLowerCase())
            formData.append("fieldName", fieldId.replace(/\s+/g, '_').toLowerCase())
            formData.append("fileName", file.name)

            const response = await fetch("/en/api/upload", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                throw new Error("Upload failed")
            }

            const result = await response.json()

            // Store uploaded file info
            setUploadedFiles(prev => ({
                ...prev,
                [fieldId]: {
                    url: result.url,
                    publicId: result.publicId,
                    fileName: file.name
                }
            }))

            // Update form data
            handleInputChange(fieldId, result.url)

            toast.success("File uploaded successfully!")
            setFileConfirmDialog(null)
        } catch (error) {
            toast.error("Failed to upload file. Please try again.")
        } finally {
            setUploadingFiles(prev => ({ ...prev, [fieldId]: false }))
        }
    }

    const cancelFileUpload = () => {
        if (fileConfirmDialog) {
            URL.revokeObjectURL(fileConfirmDialog.url)
            setFileConfirmDialog(null)
        }
    }

    const removeUploadedFile = (fieldId: string) => {
        const fileInfo = uploadedFiles[fieldId]
        if (fileInfo) {
            // Note: File deletion from Cloudinary would require a separate API endpoint
            // For now, we'll just remove from local state
            // TODO: Implement file deletion API if needed

            // Remove from state
            setUploadedFiles(prev => {
                const newState = { ...prev }
                delete newState[fieldId]
                return newState
            })

            // Clear form data
            handleInputChange(fieldId, "")
        }
    }

    const validateField = (field: CreateFormFieldData, value: any): string | null => {
        // Required field validation
        if (field.isRequired) {
            if (!value || (Array.isArray(value) && value.length === 0) || value === "") {
                return `${field.label} is required`
            }
        }

        if (!value) return null

        // Type-specific validation
        switch (field.type) {
            case "EMAIL":
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                if (!emailRegex.test(value)) {
                    return "Please enter a valid email address"
                }
                break

            case "NUMBER":
                const numValue = Number(value)
                if (isNaN(numValue)) {
                    return "Please enter a valid number"
                }
                if (field.validation?.min !== undefined && numValue < field.validation.min) {
                    return `${field.label} must be at least ${field.validation.min}`
                }
                if (field.validation?.max !== undefined && numValue > field.validation.max) {
                    return `${field.label} must be at most ${field.validation.max}`
                }
                break

            case "TEXT":
            case "TEXTAREA":
                if (field.validation?.minLength && value.length < field.validation.minLength) {
                    return `${field.label} must be at least ${field.validation.minLength} characters`
                }
                if (field.validation?.maxLength && value.length > field.validation.maxLength) {
                    return `${field.label} must be at most ${field.validation.maxLength} characters`
                }
                if (field.validation?.pattern) {
                    const regex = new RegExp(field.validation.pattern)
                    if (!regex.test(value)) {
                        return field.validation.patternMessage || `${field.label} format is invalid`
                    }
                }
                break

            case "DATE":
                const dateValue = new Date(value)
                if (isNaN(dateValue.getTime())) {
                    return "Please enter a valid date"
                }
                // Add date range validation if needed
                if (field.validation?.min) {
                    const minDate = new Date(field.validation.min)
                    if (dateValue < minDate) {
                        return `${field.label} must be after ${minDate.toLocaleDateString()}`
                    }
                }
                if (field.validation?.max) {
                    const maxDate = new Date(field.validation.max)
                    if (dateValue > maxDate) {
                        return `${field.label} must be before ${maxDate.toLocaleDateString()}`
                    }
                }
                break

            case "FILE":
                // File validation is handled during upload
                break
        }

        // Custom validation (applies to all field types)
        if (field.validation?.customValidation) {
            try {
                const regex = new RegExp(field.validation.customValidation)
                if (!regex.test(value)) {
                    return field.validation.customMessage || `${field.label} format is invalid`
                }
            } catch (error) {
                console.warn("Invalid custom validation regex:", field.validation.customValidation)
            }
        }

        return null
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Validate all fields
        const newErrors: Record<string, string> = {}
        fields.forEach(field => {
            const fieldId = field.label
            const value = formData[fieldId]
            const error = validateField(field, value)
            if (error) {
                newErrors[fieldId] = error
            }
        })

        setErrors(newErrors)

        if (Object.keys(newErrors).length === 0) {
            if (onSubmit) {
                onSubmit(formData)
            } else {
                toast.success("Form submitted successfully!")
                console.log("Form data:", formData)
            }
        } else {
            toast.error("Please fix the errors before submitting")
        }
    }

    const renderField = (field: CreateFormFieldData) => {
        const fieldId = field.label
        const value = formData[fieldId]
        const error = errors[fieldId]
        const uploadedFile = uploadedFiles[fieldId]
        const isUploading = uploadingFiles[fieldId]

        const commonProps = {
            id: fieldId,
            value: value || "",
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                handleInputChange(fieldId, e.target.value),
            className: error ? "border-destructive" : value && !error ? "border-green-500" : "",
        }

        switch (field.type) {
            case "TEXT":
                return (
                    <div key={fieldId} className="space-y-2">
                        <Label htmlFor={fieldId} className="flex items-center gap-2">
                            {field.label}
                            {field.isRequired && <span className="text-destructive">*</span>}
                            {value && !error && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                        </Label>
                        <Input
                            {...commonProps}
                            placeholder={field.validation?.pattern ? "Enter valid format..." : "Enter text..."}
                            disabled={isPreview}
                        />
                        {error && <p className="text-sm text-destructive">{error}</p>}
                        {field.validation && (
                            <div className="text-xs text-muted-foreground">
                                {field.validation.minLength && `Min: ${field.validation.minLength} chars`}
                                {field.validation.maxLength && ` Max: ${field.validation.maxLength} chars`}
                                {field.validation.pattern && ` Pattern: ${field.validation.pattern}`}
                                {field.validation.customValidation && ` Custom: ${field.validation.customValidation}`}
                            </div>
                        )}
                    </div>
                )

            case "TEXTAREA":
                return (
                    <div key={fieldId} className="space-y-2">
                        <Label htmlFor={fieldId} className="flex items-center gap-2">
                            {field.label}
                            {field.isRequired && <span className="text-destructive">*</span>}
                            {value && !error && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                        </Label>
                        <Textarea
                            {...commonProps}
                            placeholder="Enter text..."
                            disabled={isPreview}
                        />
                        {error && <p className="text-sm text-destructive">{error}</p>}
                        {field.validation && (
                            <div className="text-xs text-muted-foreground">
                                {field.validation.minLength && `Min: ${field.validation.minLength} chars`}
                                {field.validation.maxLength && ` Max: ${field.validation.maxLength} chars`}
                                {field.validation.customValidation && ` Custom: ${field.validation.customValidation}`}
                            </div>
                        )}
                    </div>
                )

            case "EMAIL":
                return (
                    <div key={fieldId} className="space-y-2">
                        <Label htmlFor={fieldId} className="flex items-center gap-2">
                            {field.label}
                            {field.isRequired && <span className="text-destructive">*</span>}
                            {value && !error && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                        </Label>
                        <Input
                            {...commonProps}
                            type="email"
                            placeholder="Enter email address..."
                            disabled={isPreview}
                        />
                        {error && <p className="text-sm text-destructive">{error}</p>}
                    </div>
                )

            case "NUMBER":
                return (
                    <div key={fieldId} className="space-y-2">
                        <Label htmlFor={fieldId} className="flex items-center gap-2">
                            {field.label}
                            {field.isRequired && <span className="text-destructive">*</span>}
                            {value && !error && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                        </Label>
                        <Input
                            {...commonProps}
                            type="number"
                            min={field.validation?.min}
                            max={field.validation?.max}
                            placeholder="Enter number..."
                            disabled={isPreview}
                        />
                        {error && <p className="text-sm text-destructive">{error}</p>}
                        {field.validation && (
                            <div className="text-xs text-muted-foreground">
                                {field.validation.min && `Min: ${field.validation.min}`}
                                {field.validation.max && ` Max: ${field.validation.max}`}
                                {field.validation.customValidation && ` Custom: ${field.validation.customValidation}`}
                            </div>
                        )}
                    </div>
                )

            case "SELECT":
                return (
                    <div key={fieldId} className="space-y-2">
                        <Label htmlFor={fieldId} className="flex items-center gap-2">
                            {field.label}
                            {field.isRequired && <span className="text-destructive">*</span>}
                            {value && !error && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                        </Label>
                        <Select
                            value={value || ""}
                            onValueChange={(val) => handleInputChange(fieldId, val)}
                            disabled={isPreview}
                        >
                            <SelectTrigger className={error ? "border-destructive" : ""}>
                                <SelectValue placeholder="Select an option..." />
                            </SelectTrigger>
                            <SelectContent>
                                {(field.options || []).map((option, index) => (
                                    <SelectItem key={index} value={option}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {error && <p className="text-sm text-destructive">{error}</p>}
                    </div>
                )

            case "CHECKBOX":
                return (
                    <div key={fieldId} className="space-y-3">
                        <Label className="flex items-center gap-2">
                            {field.label}
                            {field.isRequired && <span className="text-destructive">*</span>}
                            {value && !error && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                        </Label>
                        <div className="space-y-2">
                            {(field.options || []).map((option, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`${fieldId}-${index}`}
                                        checked={Array.isArray(value) ? value.includes(option) : false}
                                        onCheckedChange={(checked) => {
                                            const currentValues = Array.isArray(value) ? value : []
                                            const newValues = checked
                                                ? [...currentValues, option]
                                                : currentValues.filter(v => v !== option)
                                            handleInputChange(fieldId, newValues)
                                        }}
                                        disabled={isPreview}
                                    />
                                    <Label htmlFor={`${fieldId}-${index}`} className="text-sm font-normal">
                                        {option}
                                    </Label>
                                </div>
                            ))}
                        </div>
                        {error && <p className="text-sm text-destructive">{error}</p>}
                    </div>
                )

            case "RADIO":
                return (
                    <div key={fieldId} className="space-y-3">
                        <Label className="flex items-center gap-2">
                            {field.label}
                            {field.isRequired && <span className="text-destructive">*</span>}
                            {value && !error && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                        </Label>
                        <RadioGroup
                            value={value || ""}
                            onValueChange={(val) => handleInputChange(fieldId, val)}
                            disabled={isPreview}
                        >
                            {(field.options || []).map((option, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <RadioGroupItem value={option} id={`${fieldId}-${index}`} />
                                    <Label htmlFor={`${fieldId}-${index}`} className="text-sm font-normal">
                                        {option}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                        {error && <p className="text-sm text-destructive">{error}</p>}
                    </div>
                )

            case "DATE":
                return (
                    <div key={fieldId} className="space-y-2">
                        <Label htmlFor={fieldId} className="flex items-center gap-2">
                            {field.label}
                            {field.isRequired && <span className="text-destructive">*</span>}
                            {value && !error && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                        </Label>
                        <Input
                            {...commonProps}
                            type="date"
                            min={field.validation?.min}
                            max={field.validation?.max}
                            disabled={isPreview}
                        />
                        {error && <p className="text-sm text-destructive">{error}</p>}
                        {field.validation && (
                            <div className="text-xs text-muted-foreground">
                                {field.validation.min && `Min: ${new Date(field.validation.min).toLocaleDateString()}`}
                                {field.validation.max && ` Max: ${new Date(field.validation.max).toLocaleDateString()}`}
                            </div>
                        )}
                    </div>
                )

            case "FILE":
                return (
                    <div key={fieldId} className="space-y-2">
                        <Label htmlFor={fieldId} className="flex items-center gap-2">
                            {field.label}
                            {field.isRequired && <span className="text-destructive">*</span>}
                            {value && !error && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                        </Label>

                        {uploadedFile ? (
                            <div className="border rounded-lg p-4 bg-muted/50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Upload className="h-5 w-5 text-green-600" />
                                        <div>
                                            <p className="font-medium text-sm">{uploadedFile.fileName}</p>
                                            <p className="text-xs text-muted-foreground">Uploaded successfully</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => window.open(uploadedFile.url, '_blank')}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeUploadedFile(fieldId)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Image preview */}
                                {uploadedFile.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
                                    <div className="mt-3">
                                        <Image
                                            fill
                                            src={uploadedFile.url}
                                            alt={uploadedFile.fileName}
                                            className="max-w-full h-32 object-cover rounded border"
                                        />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Input
                                    type="file"
                                    accept={field.validation?.allowedFileTypes?.join(',')}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) {
                                            handleFileUpload(fieldId, file)
                                        }
                                    }}
                                    disabled={isPreview || isUploading}
                                    className={error ? "border-destructive" : ""}
                                />
                                {isUploading && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                        Uploading...
                                    </div>
                                )}
                            </div>
                        )}

                        {error && <p className="text-sm text-destructive">{error}</p>}
                        {field.validation && (
                            <div className="text-xs text-muted-foreground">
                                {field.validation.allowedFileTypes && `Allowed: ${field.validation.allowedFileTypes.join(', ')}`}
                                {field.validation.maxFileSize && ` Max: ${Math.round(field.validation.maxFileSize / (1024 * 1024))}MB`}
                                {field.validation.customValidation && ` Custom: ${field.validation.customValidation}`}
                            </div>
                        )}
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <>
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {title}
                    </CardTitle>
                    {description && (
                        <CardDescription>{description}</CardDescription>
                    )}
                    {isPreview && (
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                This is a preview. Form validation and submission are simulated.
                            </AlertDescription>
                        </Alert>
                    )}
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {fields.map((field) => renderField(field))}

                        {!isPreview && (
                            <Button type="submit" className="w-full">
                                Submit Form
                            </Button>
                        )}
                    </form>
                </CardContent>
            </Card>

            {/* File Upload Confirmation Dialog */}
            <Dialog open={!!fileConfirmDialog} onOpenChange={() => cancelFileUpload()}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirm File Upload</DialogTitle>
                        <DialogDescription>
                            Please confirm that this is the file you want to upload.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        {fileConfirmDialog && (
                            <>
                                <div className="flex items-center gap-3 p-3 border rounded-lg">
                                    <Upload className="h-5 w-5 text-blue-600" />
                                    <div>
                                        <p className="font-medium">{fileConfirmDialog.file.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {(fileConfirmDialog.file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>

                                {/* Image preview */}
                                {fileConfirmDialog.file.type.startsWith('image/') && (
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium">Preview:</p>
                                        <Image
                                            fill
                                            src={fileConfirmDialog.url}
                                            alt="Preview"
                                            className="max-w-full h-32 object-cover rounded border"
                                        />
                                    </div>
                                )}

                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={cancelFileUpload}>
                                        Cancel
                                    </Button>
                                    <Button onClick={confirmFileUpload}>
                                        Confirm Upload
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
} 