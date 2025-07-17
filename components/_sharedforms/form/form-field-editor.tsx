"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Plus, Trash2, GripVertical, Settings, Palette, Edit2, Save, X, Sparkles, FileType, CheckSquare } from "lucide-react"
import { FIELD_TYPE_CONFIGS, type FormFieldType, type CreateFormField, type CreateFormFieldData, type FormFieldValidation, VALIDATION_SUGGESTIONS, FILE_TYPE_CATEGORIES } from "@/types/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const fieldSchema = z.object({
    label: z.string().min(1, "Field label is required").max(100, "Label must be less than 100 characters"),
    isRequired: z.boolean(),
    options: z.array(z.string()).optional(),
    validation: z.object({
        min: z.number().optional(),
        max: z.number().optional(),
        minLength: z.number().optional(),
        maxLength: z.number().optional(),
        pattern: z.string().optional(),
        patternMessage: z.string().optional(),
        allowedFileTypes: z.array(z.string()).optional(),
        maxFileSize: z.number().optional(),
        customValidation: z.string().optional(),
        customMessage: z.string().optional(),
    }).optional().or(z.undefined()),
})

type FieldFormData = z.infer<typeof fieldSchema>

interface FormFieldEditorProps {
    field: CreateFormFieldData
    index: number
    onUpdate: (index: number, updates: Partial<CreateFormFieldData>) => void
    onClose: () => void
}

export function FormFieldEditor({ field, index, onUpdate, onClose }: FormFieldEditorProps) {
    const [newOption, setNewOption] = useState("")
    const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(null)
    const [editingOptionValue, setEditingOptionValue] = useState("")
    const [showAdvanced, setShowAdvanced] = useState(false)
    const [showValidationSuggestions, setShowValidationSuggestions] = useState(false)
    const [selectedFileCategories, setSelectedFileCategories] = useState<string[]>([])

    const form = useForm<FieldFormData>({
        resolver: zodResolver(fieldSchema),
        defaultValues: {
            label: field.label,
            isRequired: field.isRequired,
            options: field.options || [],
            validation: field.validation || {},
        },
    })

    const fieldConfig = FIELD_TYPE_CONFIGS[field.type]
    const needsOptions = ["SELECT", "CHECKBOX", "RADIO"].includes(field.type)
    const validationSuggestions = (VALIDATION_SUGGESTIONS as any)[field.type] || []

    const onSubmit = (data: FieldFormData) => {
        onUpdate(index, {
            label: data.label,
            isRequired: data.isRequired,
            options: data.options || [],
            validation: data.validation,
        })
        toast.success("Field updated successfully!")
        onClose()
    }

    const addOption = () => {
        if (newOption.trim()) {
            const currentOptions = form.watch("options") || []
            form.setValue("options", [...currentOptions, newOption.trim()])
            setNewOption("")
        }
    }

    const removeOption = (optionIndex: number) => {
        const currentOptions = form.watch("options") || []
        const updatedOptions = currentOptions.filter((_, i) => i !== optionIndex)
        form.setValue("options", updatedOptions)
    }

    const startEditOption = (optionIndex: number, currentValue: string) => {
        setEditingFieldIndex(optionIndex)
        setEditingOptionValue(currentValue)
    }

    const saveOptionEdit = () => {
        if (editingOptionValue.trim() && editingFieldIndex !== null) {
            const currentOptions = form.watch("options") || []
            const updatedOptions = [...currentOptions]
            updatedOptions[editingFieldIndex] = editingOptionValue.trim()
            form.setValue("options", updatedOptions)
            setEditingFieldIndex(null)
            setEditingOptionValue("")
        }
    }

    const cancelOptionEdit = () => {
        setEditingFieldIndex(null)
        setEditingOptionValue("")
    }

    const moveOption = (fromIndex: number, toIndex: number) => {
        const currentOptions = form.watch("options") || []
        const updatedOptions = [...currentOptions]
        const [movedOption] = updatedOptions.splice(fromIndex, 1)
        updatedOptions.splice(toIndex, 0, movedOption)
        form.setValue("options", updatedOptions)
    }

    const applyValidationSuggestion = (suggestion: any) => {
        form.setValue("validation", suggestion.validation)
        toast.success(`Applied ${suggestion.name} validation`)
    }

    const handleFileCategoryChange = (category: string, checked: boolean) => {
        if (checked) {
            setSelectedFileCategories(prev => [...prev, category])
            const currentTypes = (form.watch("validation.allowedFileTypes") as string[]) || []
            const categoryTypes = FILE_TYPE_CATEGORIES[category as keyof typeof FILE_TYPE_CATEGORIES]
            const newTypes = [...currentTypes, ...categoryTypes]
            form.setValue("validation.allowedFileTypes", [...new Set(newTypes)])
        } else {
            setSelectedFileCategories(prev => prev.filter(c => c !== category))
            const currentTypes = (form.watch("validation.allowedFileTypes") as string[]) || []
            const categoryTypes = FILE_TYPE_CATEGORIES[category as keyof typeof FILE_TYPE_CATEGORIES]
            const newTypes = currentTypes.filter(type => !categoryTypes.includes(type as never))
            form.setValue("validation.allowedFileTypes", newTypes)
        }
    }

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Configure Field
                    </DialogTitle>
                    <DialogDescription>
                        Customize the properties and behavior of this form field.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Field Configuration */}
                    <div className="lg:col-span-2">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                {/* Field Type Display */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Palette className="h-5 w-5" />
                                            Field Type
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-3">
                                            <Badge variant="secondary">{field.type}</Badge>
                                            <span className="text-sm text-muted-foreground">
                                                {fieldConfig.description}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Basic Configuration */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Basic Configuration</CardTitle>
                                        <CardDescription>
                                            Set the basic properties for this field.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="label"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Field Label</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="e.g., Full Name, Email Address"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        The label that users will see above this field.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="isRequired"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-base">Required Field</FormLabel>
                                                        <FormDescription>
                                                            Users must fill this field before submitting the form.
                                                        </FormDescription>
                                                    </div>
                                                    <FormControl>
                                                        <Switch
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>

                                {/* Options Configuration */}
                                {needsOptions && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Options</CardTitle>
                                            <CardDescription>
                                                Define the available choices for this field.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-3">
                                                {(form.watch("options") || []).map((option, optionIndex) => (
                                                    <div
                                                        key={optionIndex}
                                                        className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50"
                                                    >
                                                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                                                        {editingFieldIndex === optionIndex ? (
                                                            <div className="flex-1 flex gap-2">
                                                                <Input
                                                                    value={editingOptionValue}
                                                                    onChange={(e) => setEditingOptionValue(e.target.value)}
                                                                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), saveOptionEdit())}
                                                                    autoFocus
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    size="sm"
                                                                    onClick={saveOptionEdit}
                                                                >
                                                                    <Save className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={cancelOptionEdit}
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <span className="flex-1 text-sm">{option}</span>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => startEditOption(optionIndex, option)}
                                                                >
                                                                    <Edit2 className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => removeOption(optionIndex)}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="Add new option..."
                                                    value={newOption}
                                                    onChange={(e) => setNewOption(e.target.value)}
                                                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addOption())}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={addOption}
                                                    disabled={!newOption.trim()}
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <FormDescription>
                                                {field.type === "SELECT" && "Users will select one option from the dropdown."}
                                                {field.type === "CHECKBOX" && "Users can select multiple options."}
                                                {field.type === "RADIO" && "Users can select only one option."}
                                            </FormDescription>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Validation Configuration */}
                                {fieldConfig.hasValidation && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Sparkles className="h-5 w-5" />
                                                Validation Rules
                                            </CardTitle>
                                            <CardDescription>
                                                Configure validation rules for this field.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {/* Validation Suggestions */}
                                            {validationSuggestions.length > 0 && (
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2">
                                                        <Sparkles className="h-4 w-4 text-primary" />
                                                        <span className="text-sm font-medium">Quick Validation Presets</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                        {validationSuggestions.map((suggestion: any, idx: number) => (
                                                            <Button
                                                                key={idx}
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                className="justify-start text-left h-auto p-3"
                                                                onClick={() => applyValidationSuggestion(suggestion)}
                                                            >
                                                                <div>
                                                                    <div className="font-medium text-xs">{suggestion.name}</div>
                                                                    <div className="text-xs text-muted-foreground">
                                                                        {Object.entries(suggestion.validation).map(([key, value]: [string, any]) => {
                                                                            if (key === 'pattern') return 'Custom pattern'
                                                                            if (key === 'patternMessage') return ''
                                                                            if (key === 'allowedFileTypes') return `${Array.isArray(value) ? value.length : 0} file types`
                                                                            if (key === 'maxFileSize') return `${Math.round(Number(value) / (1024 * 1024))}MB max`
                                                                            return `${key}: ${value}`
                                                                        }).filter(Boolean).join(', ')}
                                                                    </div>
                                                                </div>
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* File Type Categories */}
                                            {field.type === "FILE" && (
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2">
                                                        <FileType className="h-4 w-4 text-primary" />
                                                        <span className="text-sm font-medium">File Type Categories</span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {Object.entries(FILE_TYPE_CATEGORIES).map(([category, types]) => (
                                                            <div key={category} className="flex items-center space-x-2">
                                                                <Checkbox
                                                                    id={`category-${category}`}
                                                                    checked={selectedFileCategories.includes(category)}
                                                                    onCheckedChange={(checked) =>
                                                                        handleFileCategoryChange(category, checked as boolean)
                                                                    }
                                                                />
                                                                <label
                                                                    htmlFor={`category-${category}`}
                                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                                >
                                                                    {category}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        Selected types: {(form.watch("validation.allowedFileTypes") as string[])?.join(', ') || 'None'}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Custom Validation Fields */}
                                            <Collapsible>
                                                <CollapsibleTrigger asChild>
                                                    <Button type="button" variant="outline" className="w-full justify-between">
                                                        <span>Custom Validation Rules</span>
                                                        <Settings className="h-4 w-4" />
                                                    </Button>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent className="space-y-4 mt-4">
                                                    {field.type === "NUMBER" && (
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <FormField
                                                                control={form.control}
                                                                name="validation.min"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Minimum Value</FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                type="number"
                                                                                placeholder="e.g., 0"
                                                                                {...field}
                                                                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                                                                value={field.value || ""}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={form.control}
                                                                name="validation.max"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Maximum Value</FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                type="number"
                                                                                placeholder="e.g., 100"
                                                                                {...field}
                                                                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                                                                value={field.value || ""}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    )}

                                                    {(field.type === "TEXT" || field.type === "TEXTAREA") && (
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <FormField
                                                                control={form.control}
                                                                name="validation.minLength"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Minimum Length</FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                type="number"
                                                                                placeholder="e.g., 3"
                                                                                {...field}
                                                                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                                                                value={field.value || ""}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={form.control}
                                                                name="validation.maxLength"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Maximum Length</FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                type="number"
                                                                                placeholder="e.g., 255"
                                                                                {...field}
                                                                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                                                                value={field.value || ""}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    )}

                                                    {field.type === "FILE" && (
                                                        <div className="space-y-4">
                                                            <FormField
                                                                control={form.control}
                                                                name="validation.maxFileSize"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Maximum File Size (MB)</FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                type="number"
                                                                                placeholder="e.g., 5"
                                                                                {...field}
                                                                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) * 1024 * 1024 : undefined)}
                                                                                value={field.value ? Math.round(field.value / (1024 * 1024)) : ""}
                                                                            />
                                                                        </FormControl>
                                                                        <FormDescription>
                                                                            Maximum file size in megabytes
                                                                        </FormDescription>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    )}

                                                    <FormField
                                                        control={form.control}
                                                        name="validation.pattern"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Custom Pattern (Regex)</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="e.g., ^[A-Za-z]+$ for letters only"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormDescription>
                                                                    Regular expression for custom validation
                                                                </FormDescription>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <FormField
                                                        control={form.control}
                                                        name="validation.patternMessage"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Custom Error Message</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="e.g., Please enter only letters"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormDescription>
                                                                    Error message to show when validation fails
                                                                </FormDescription>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </CollapsibleContent>
                                            </Collapsible>
                                        </CardContent>
                                    </Card>
                                )}

                                <div className="flex justify-end gap-2">
                                    <Button type="button" variant="outline" onClick={onClose}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>

                    {/* Field Preview */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Field Preview</CardTitle>
                                <CardDescription>
                                    How this field will appear to users.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium">
                                            {form.watch("label") || "Field Label"}
                                            {form.watch("isRequired") && <span className="text-destructive ml-1">*</span>}
                                        </label>

                                        {/* Preview based on field type */}
                                        {field.type === "TEXT" && (
                                            <Input placeholder="Enter text..." disabled />
                                        )}

                                        {field.type === "TEXTAREA" && (
                                            <Textarea placeholder="Enter text..." disabled />
                                        )}

                                        {field.type === "EMAIL" && (
                                            <Input type="email" placeholder="Enter email..." disabled />
                                        )}

                                        {field.type === "NUMBER" && (
                                            <Input type="number" placeholder="Enter number..." disabled />
                                        )}

                                        {field.type === "SELECT" && (
                                            <select className="w-full p-2 border rounded-md bg-muted" disabled>
                                                <option>Select an option...</option>
                                                {(form.watch("options") || []).map((option, i) => (
                                                    <option key={i}>{option}</option>
                                                ))}
                                            </select>
                                        )}

                                        {field.type === "CHECKBOX" && (
                                            <div className="space-y-2">
                                                {(form.watch("options") || []).map((option, i) => (
                                                    <div key={i} className="flex items-center space-x-2">
                                                        <input type="checkbox" disabled />
                                                        <label className="text-sm">{option}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {field.type === "RADIO" && (
                                            <div className="space-y-2">
                                                {(form.watch("options") || []).map((option, i) => (
                                                    <div key={i} className="flex items-center space-x-2">
                                                        <input type="radio" name="preview" disabled />
                                                        <label className="text-sm">{option}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {field.type === "DATE" && (
                                            <Input type="date" disabled />
                                        )}

                                        {field.type === "FILE" && (
                                            <Input type="file" disabled />
                                        )}
                                    </div>

                                    {/* Validation Preview */}
                                    {form.watch("validation") && Object.keys(form.watch("validation") || {}).length > 0 && (
                                        <div className="pt-4 border-t">
                                            <h4 className="text-sm font-medium mb-2">Validation Rules</h4>
                                            <div className="space-y-1 text-xs text-muted-foreground">
                                                {Object.entries(form.watch("validation") || {}).map(([key, value]) => {
                                                    if (!value) return null
                                                    if (key === 'allowedFileTypes') return `Allowed: ${(value as string[]).join(', ')}`
                                                    if (key === 'maxFileSize') return `Max size: ${Math.round(Number(value) / (1024 * 1024))}MB`
                                                    if (key === 'pattern') return `Pattern: ${value}`
                                                    if (key === 'patternMessage') return null
                                                    return `${key}: ${value}`
                                                }).filter(Boolean).map((text, i) => (
                                                    <div key={i} className="flex items-center gap-1">
                                                        <CheckSquare className="h-3 w-3" />
                                                        {text}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
} 