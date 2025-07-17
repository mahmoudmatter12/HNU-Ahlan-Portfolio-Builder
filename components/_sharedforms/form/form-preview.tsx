"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { FileText, Send } from "lucide-react"
import type { CreateFormField, CreateFormFieldData } from "@/types/form"

interface FormPreviewProps {
    title: string
    description?: string
    fields: (CreateFormField | CreateFormFieldData)[]
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

    const handleInputChange = (fieldId: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [fieldId]: value
        }))

        // Clear error when user starts typing
        if (errors[fieldId]) {
            setErrors(prev => ({
                ...prev,
                [fieldId]: ""
            }))
        }
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        fields.forEach(field => {
            if (field.isRequired) {
                const value = formData[field.label]
                if (!value || (Array.isArray(value) && value.length === 0)) {
                    newErrors[field.label] = "This field is required"
                }
            }
        })

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (validateForm()) {
            if (onSubmit) {
                onSubmit(formData)
            } else {
                console.log("Form data:", formData)
            }
        }
    }

    const renderField = (field: CreateFormField | CreateFormFieldData) => {
        const fieldId = field.label
        const value = formData[fieldId]
        const error = errors[fieldId]

        const commonProps = {
            id: fieldId,
            value: value || "",
            onChange: (e: any) => handleInputChange(fieldId, e.target.value),
            className: error ? "border-destructive" : "",
        }

        switch (field.type) {
            case "TEXT":
                return (
                    <div key={fieldId} className="space-y-2">
                        <Label htmlFor={fieldId} className="flex items-center gap-2">
                            {field.label}
                            {field.isRequired && <span className="text-destructive">*</span>}
                        </Label>
                        <Input
                            {...commonProps}
                            placeholder="Enter text..."
                            disabled={isPreview}
                        />
                        {error && <p className="text-sm text-destructive">{error}</p>}
                    </div>
                )

            case "TEXTAREA":
                return (
                    <div key={fieldId} className="space-y-2">
                        <Label htmlFor={fieldId} className="flex items-center gap-2">
                            {field.label}
                            {field.isRequired && <span className="text-destructive">*</span>}
                        </Label>
                        <Textarea
                            {...commonProps}
                            placeholder="Enter text..."
                            disabled={isPreview}
                        />
                        {error && <p className="text-sm text-destructive">{error}</p>}
                    </div>
                )

            case "EMAIL":
                return (
                    <div key={fieldId} className="space-y-2">
                        <Label htmlFor={fieldId} className="flex items-center gap-2">
                            {field.label}
                            {field.isRequired && <span className="text-destructive">*</span>}
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
                        </Label>
                        <Input
                            {...commonProps}
                            type="number"
                            placeholder="Enter number..."
                            disabled={isPreview}
                        />
                        {error && <p className="text-sm text-destructive">{error}</p>}
                    </div>
                )

            case "SELECT":
                return (
                    <div key={fieldId} className="space-y-2">
                        <Label htmlFor={fieldId} className="flex items-center gap-2">
                            {field.label}
                            {field.isRequired && <span className="text-destructive">*</span>}
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
                        </Label>
                        <Input
                            {...commonProps}
                            type="date"
                            disabled={isPreview}
                        />
                        {error && <p className="text-sm text-destructive">{error}</p>}
                    </div>
                )

            case "FILE":
                return (
                    <div key={fieldId} className="space-y-2">
                        <Label htmlFor={fieldId} className="flex items-center gap-2">
                            {field.label}
                            {field.isRequired && <span className="text-destructive">*</span>}
                        </Label>
                        <Input
                            {...commonProps}
                            type="file"
                            disabled={isPreview}
                        />
                        {error && <p className="text-sm text-destructive">{error}</p>}
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {title || "Form Preview"}
                </CardTitle>
                {description && (
                    <CardDescription>{description}</CardDescription>
                )}
                {isPreview && (
                    <Badge variant="secondary" className="w-fit">
                        Preview Mode
                    </Badge>
                )}
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {fields.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No fields added to this form yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {fields.map((field, index) => (
                                <div key={index}>
                                    {renderField(field)}
                                    {index < fields.length - 1 && <Separator className="my-6" />}
                                </div>
                            ))}
                        </div>
                    )}

                    {!isPreview && fields.length > 0 && (
                        <div className="flex justify-end pt-6">
                            <Button type="submit" className="flex items-center gap-2">
                                <Send className="h-4 w-4" />
                                Submit Form
                            </Button>
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    )
} 