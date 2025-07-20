"use client"

import { useState, useEffect, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation } from "@tanstack/react-query"
import { FormService } from "@/services/form-service"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2, Plus, GripVertical, Trash2, Copy, Eye, Settings, Palette, FileText, Building2, Globe } from "lucide-react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { FIELD_TYPE_CONFIGS, type FormFieldType, type CreateFormField, type CreateFormFieldData } from "@/types/form"
import { FormFieldEditor } from "./form-field-editor"
import { FormPreview } from "./form-preview"
import type { College } from "@/types/Collage"

const formSchema = z.object({
    title: z.string().min(1, "Form title is required").max(100, "Title must be less than 100 characters"),
    description: z.string().optional(),
    collegeId: z.string().optional(),
    active: z.boolean(),
})

type FormFormData = z.infer<typeof formSchema>

interface FormCreateDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    collegeId: string
    onSuccess: () => void
    isGlobalForm?: boolean
    colleges?: College[]
}

export function FormCreateDialog({ open, onOpenChange, collegeId, onSuccess, isGlobalForm = false, colleges = [] }: FormCreateDialogProps) {
    const [currentStep, setCurrentStep] = useState(1)
    const [fields, setFields] = useState<CreateFormFieldData[]>([])
    const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(null)
    const [showPreview, setShowPreview] = useState(false)
    const [allFieldsRequired, setAllFieldsRequired] = useState(false)

    // Keep allFieldsRequired state in sync with actual field states
    useEffect(() => {
        if (fields.length > 0) {
            const allRequired = fields.every(field => field.isRequired)
            const allOptional = fields.every(field => !field.isRequired)

            if (allRequired) {
                setAllFieldsRequired(true)
            } else if (allOptional) {
                setAllFieldsRequired(false)
            }
            // If mixed states, don't change allFieldsRequired state
        }
    }, [fields])

    // Check if fields have mixed required states
    const hasMixedRequiredStates = fields.length > 0 &&
        !fields.every(field => field.isRequired) &&
        !fields.every(field => !field.isRequired)

    const form = useForm<FormFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            collegeId: collegeId || "",
            active: true,
        },
    })

    // Update form when collegeId prop changes
    useEffect(() => {
        if (collegeId && !isGlobalForm) {
            form.setValue("collegeId", collegeId)
        }
    }, [collegeId, isGlobalForm, form])

    const createFormMutation = useMutation({
        mutationFn: (data: { formSection: any; fields: CreateFormFieldData[] }) =>
            FormService.createCompleteForm(data),
        onSuccess: () => {
            toast.success("Form created successfully!")
            onSuccess()
            resetForm()
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to create form")
        },
    })

    const resetForm = useCallback(() => {
        form.reset({
            title: "",
            description: "",
            collegeId: collegeId || "",
            active: true,
        })
        setFields([])
        setCurrentStep(1)
        setEditingFieldIndex(null)
        setShowPreview(false)
    }, [form, collegeId])

    useEffect(() => {
        if (!open) {
            resetForm()
        }
    }, [open, resetForm])

    const addField = (type: FormFieldType) => {
        const newField: CreateFormFieldData = {
            label: `New ${FIELD_TYPE_CONFIGS[type].label}`,
            type,
            isRequired: false,
            options: FIELD_TYPE_CONFIGS[type].options || [],
            validation: FIELD_TYPE_CONFIGS[type].hasValidation ? {} : undefined,
            order: fields.length,
        }
        setFields([...fields, newField])
        setEditingFieldIndex(fields.length)
    }

    const updateField = (index: number, updates: Partial<CreateFormFieldData>) => {
        const updatedFields = [...fields]
        updatedFields[index] = { ...updatedFields[index], ...updates }
        setFields(updatedFields)
    }

    const removeField = (index: number) => {
        const updatedFields = fields.filter((_, i) => i !== index)
        // Reorder remaining fields
        const reorderedFields = updatedFields.map((field, i) => ({
            ...field,
            order: i,
        }))
        setFields(reorderedFields)
        setEditingFieldIndex(null)
    }

    const handleDragEnd = (result: any) => {
        if (!result.destination) return

        const items = Array.from(fields)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)

        // Update order for all items
        const reorderedFields = items.map((item, index) => ({
            ...item,
            order: index,
        }))

        setFields(reorderedFields)
    }

    const onSubmit = async (data: FormFormData) => {
        if (fields.length === 0) {
            toast.error("Please add at least one field to your form")
            return
        }

        // Handle custom form case
        const finalCollegeId = data.collegeId === "custom" ? null : data.collegeId

        createFormMutation.mutate({
            formSection: {
                title: data.title,
                description: data.description,
                active: data.active,
                collegeId: finalCollegeId,
            },
            fields,
        })
    }

    const canProceedToFields = form.watch("title").trim().length > 0 && (isGlobalForm ? true : (form.watch("collegeId") || "").trim().length > 0)
    const canCreateForm = fields.length > 0 && form.watch("title").trim().length > 0 && (isGlobalForm ? true : (form.watch("collegeId") || "").trim().length > 0)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {isGlobalForm ? "Create Global Form" : "Create New Form"}
                    </DialogTitle>
                    <DialogDescription>
                        {isGlobalForm
                            ? "Build a custom form that can be associated with any college or used as a standalone form."
                            : "Build a custom form with various field types. Add fields, configure them, and preview the final form."
                        }
                    </DialogDescription>
                </DialogHeader>

                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                            }`}>
                            1
                        </div>
                        <span className={currentStep >= 1 ? "text-foreground" : "text-muted-foreground"}>
                            Form Details
                        </span>
                    </div>
                    <div className="flex-1 mx-4 h-px bg-border" />
                    <div className="flex items-center space-x-4">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                            }`}>
                            2
                        </div>
                        <span className={currentStep >= 2 ? "text-foreground" : "text-muted-foreground"}>
                            Add Fields
                        </span>
                    </div>
                    <div className="flex-1 mx-4 h-px bg-border" />
                    <div className="flex items-center space-x-4">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                            }`}>
                            3
                        </div>
                        <span className={currentStep >= 3 ? "text-foreground" : "text-muted-foreground"}>
                            Preview & Create
                        </span>
                    </div>
                </div>

                <Tabs value={currentStep.toString()} onValueChange={(value) => setCurrentStep(parseInt(value))} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="1">Form Details</TabsTrigger>
                        <TabsTrigger value="2" disabled={!canProceedToFields}>Add Fields</TabsTrigger>
                        <TabsTrigger value="3" disabled={!canCreateForm}>Preview & Create</TabsTrigger>
                    </TabsList>

                    <TabsContent value="1" className="space-y-6">
                        <Form {...form}>
                            <form className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Form Title</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g., Student Registration Form, Course Application"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Give your form a clear, descriptive title that users will see.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description (Optional)</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Provide additional context about this form..."
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Help users understand what this form is for and what information they need to provide.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {isGlobalForm && (
                                    <FormField
                                        control={form.control}
                                        name="collegeId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Associated College</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a college or create a custom form" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="custom">
                                                                <div className="flex items-center gap-2">
                                                                    <Globe className="h-4 w-4" />
                                                                    Custom Form (No College)
                                                                </div>
                                                            </SelectItem>
                                                            <Separator />
                                                            {colleges.map((college) => (
                                                                <SelectItem key={college.id} value={college.id}>
                                                                    <div className="flex items-center gap-2">
                                                                        <Building2 className="h-4 w-4" />
                                                                        {college.name}
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormDescription>
                                                    Choose which college this form should be associated with, or create a custom form.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}

                                <FormField
                                    control={form.control}
                                    name="active"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">Active Status</FormLabel>
                                                <FormDescription>
                                                    Enable this form to accept submissions from users.
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

                                <div className="flex justify-end space-x-2">
                                    <Button
                                        type="button"
                                        onClick={() => setCurrentStep(2)}
                                        disabled={!canProceedToFields}
                                    >
                                        Next: Add Fields
                                        <Plus className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </TabsContent>

                    <TabsContent value="2" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Field Types Panel */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Plus className="h-4 w-4" />
                                        Add Fields
                                    </CardTitle>
                                    <CardDescription>
                                        Choose from various field types to build your form.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {Object.entries(FIELD_TYPE_CONFIGS).map(([type, config]) => (
                                        <Button
                                            key={type}
                                            variant="outline"
                                            className="w-full justify-start h-auto p-3"
                                            onClick={() => addField(type as FormFieldType)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                                                    <Palette className="h-4 w-4 text-primary" />
                                                </div>
                                                <div className="text-left">
                                                    <div className="font-medium">{config.label}</div>
                                                    <div className="text-xs text-muted-foreground">{config.description}</div>
                                                </div>
                                            </div>
                                        </Button>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Fields List */}
                            <div className="lg:col-span-2 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">Form Fields ({fields.length})</h3>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowPreview(!showPreview)}
                                    >
                                        <Eye className="h-4 w-4 mr-2" />
                                        {showPreview ? "Hide" : "Show"} Preview
                                    </Button>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant={hasMixedRequiredStates ? "secondary" : (allFieldsRequired ? "default" : "outline")}
                                            size="sm"
                                            onClick={() => {
                                                const newRequiredState = !allFieldsRequired
                                                setAllFieldsRequired(newRequiredState)
                                                // Update all fields to have the same required state
                                                const updatedFields = fields.map(field => ({
                                                    ...field,
                                                    isRequired: newRequiredState
                                                }))
                                                setFields(updatedFields)

                                                // Show feedback toast
                                                toast.success(
                                                    newRequiredState
                                                        ? `All ${fields.length} fields are now required`
                                                        : `All ${fields.length} fields are now optional`
                                                )
                                            }}
                                            disabled={fields.length === 0}
                                        >
                                            <Settings className="h-4 w-4 mr-2" />
                                            {fields.length === 0
                                                ? "No Fields"
                                                : hasMixedRequiredStates
                                                    ? "Standardize Required"
                                                    : allFieldsRequired
                                                        ? "Make All Optional"
                                                        : "Make All Required"
                                            }
                                        </Button>
                                        {fields.length > 0 && (
                                            <Badge variant={
                                                hasMixedRequiredStates
                                                    ? "outline"
                                                    : (allFieldsRequired ? "destructive" : "secondary")
                                            }>
                                                {hasMixedRequiredStates
                                                    ? "Mixed States"
                                                    : (allFieldsRequired ? "All Required" : "All Optional")
                                                }
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {fields.length === 0 ? (
                                    <Card>
                                        <CardContent className="flex flex-col items-center justify-center py-8">
                                            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                                            <h3 className="text-lg font-semibold mb-2">No fields added yet</h3>
                                            <p className="text-muted-foreground text-center mb-4">
                                                Start building your form by adding fields from the panel on the left.
                                            </p>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <DragDropContext onDragEnd={handleDragEnd}>
                                        <Droppable droppableId="fields">
                                            {(provided) => (
                                                <div
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                    className="space-y-3"
                                                >
                                                    {fields.map((field, index) => (
                                                        <Draggable key={index} draggableId={index.toString()} index={index}>
                                                            {(provided) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    className="border rounded-lg p-4 bg-card"
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <div {...provided.dragHandleProps}>
                                                                            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <div className="flex items-center gap-2 mb-2">
                                                                                <Badge variant="secondary">{field.type}</Badge>
                                                                                {field.isRequired && (
                                                                                    <Badge variant="destructive">Required</Badge>
                                                                                )}
                                                                            </div>
                                                                            <h4 className="font-medium">{field.label}</h4>
                                                                            {field.options && field.options.length > 0 && (
                                                                                <p className="text-sm text-muted-foreground">
                                                                                    {field.options.length} options
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() => setEditingFieldIndex(index)}
                                                                            >
                                                                                <Settings className="h-4 w-4" />
                                                                            </Button>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() => removeField(index)}
                                                                            >
                                                                                <Trash2 className="h-4 w-4" />
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    </DragDropContext>
                                )}

                                {showPreview && fields.length > 0 && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Live Preview</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <FormPreview
                                                title={form.watch("title")}
                                                description={form.watch("description")}
                                                fields={fields}
                                            />
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentStep(1)}
                            >
                                Back: Form Details
                            </Button>
                            <Button
                                onClick={() => setCurrentStep(3)}
                                disabled={fields.length === 0}
                            >
                                Next: Preview & Create
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="3" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Form Summary */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Form Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h4 className="font-medium">Title</h4>
                                        <p className="text-muted-foreground">{form.watch("title")}</p>
                                    </div>
                                    {form.watch("description") && (
                                        <div>
                                            <h4 className="font-medium">Description</h4>
                                            <p className="text-muted-foreground">{form.watch("description")}</p>
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="font-medium">Status</h4>
                                        <div className="flex items-center gap-2">
                                            <Badge variant={form.watch("active") ? "default" : "secondary"}>
                                                {form.watch("active") ? "Active" : "Inactive"}
                                            </Badge>
                                            <span className="text-sm text-muted-foreground">
                                                {form.watch("active") ? "Users can submit responses" : "Form is hidden from users"}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-medium">Fields</h4>
                                        <div className="space-y-2">
                                            {fields.map((field, index) => (
                                                <div key={index} className="flex items-center justify-between text-sm">
                                                    <span>{field.label}</span>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="text-xs">
                                                            {field.type}
                                                        </Badge>
                                                        {field.isRequired && (
                                                            <Badge variant="destructive" className="text-xs">
                                                                Required
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Final Preview */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Final Preview</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <FormPreview
                                        title={form.watch("title")}
                                        description={form.watch("description")}
                                        fields={fields}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        <div className="flex justify-between">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentStep(2)}
                            >
                                Back: Add Fields
                            </Button>
                            <Button
                                onClick={form.handleSubmit(onSubmit)}
                                disabled={createFormMutation.isPending}
                            >
                                {createFormMutation.isPending ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Creating Form...
                                    </>
                                ) : (
                                    "Create Form"
                                )}
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Field Editor Dialog */}
                {editingFieldIndex !== null && (
                    <FormFieldEditor
                        field={fields[editingFieldIndex]}
                        index={editingFieldIndex}
                        onUpdate={updateField}
                        onClose={() => setEditingFieldIndex(null)}
                    />
                )}
            </DialogContent>
        </Dialog>
    )
} 