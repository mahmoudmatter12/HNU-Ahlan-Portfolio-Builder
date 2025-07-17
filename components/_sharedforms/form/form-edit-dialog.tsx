"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FormService } from "@/services/form-service"
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
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Loader2, Plus, GripVertical, Trash2, Edit, Eye, Settings, Palette, FileText, Save } from "lucide-react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { FIELD_TYPE_CONFIGS, type FormFieldType, type CreateFormField, type FormSection } from "@/types/form"
import { FormFieldEditor } from "./form-field-editor"
import { FormPreview } from "./form-preview"

const formSchema = z.object({
    title: z.string().min(1, "Form title is required").max(100, "Title must be less than 100 characters"),
    description: z.string().optional(),
})

type FormFormData = z.infer<typeof formSchema>

interface FormEditDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    form: FormSection | null
    onSuccess: () => void
}

export function FormEditDialog({ open, onOpenChange, form, onSuccess }: FormEditDialogProps) {
    const [currentStep, setCurrentStep] = useState(1)
    const [fields, setFields] = useState<CreateFormField[]>([])
    const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(null)
    const [showPreview, setShowPreview] = useState(false)
    const [hasChanges, setHasChanges] = useState(false)
    const queryClient = useQueryClient()

    const formForm = useForm<FormFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
        },
    })

    // Initialize form data when form changes
    useEffect(() => {
        if (form) {
            formForm.reset({
                title: form.title,
                description: "",
            })

            // Convert existing fields to CreateFormField format
            const convertedFields: CreateFormField[] = (form.fields || []).map(field => ({
                label: field.label,
                type: field.type,
                isRequired: field.isRequired,
                options: field.options,
                order: field.order,
                formSectionId: form.id,
            }))

            setFields(convertedFields)
            setHasChanges(false)
        }
    }, [form, formForm])

    const updateFormMutation = useMutation({
        mutationFn: async (data: { formSection: any; fields: CreateFormField[] }) => {
            if (!form) throw new Error("No form to update")

            // Update form section
            await FormService.updateFormSection(form.id, {
                title: data.formSection.title,
            })

            // Delete existing fields and create new ones
            // Note: This is a simplified approach. In production, you might want to
            // compare fields and only update changed ones
            const existingFields = form.fields || []
            for (const field of existingFields) {
                await FormService.deleteFormField(field.id)
            }

            // Create new fields
            for (const field of data.fields) {
                await FormService.createFormField({
                    ...field,
                    formSectionId: form.id,
                })
            }
        },
        onSuccess: () => {
            toast.success("Form updated successfully!")
            onSuccess()
            setHasChanges(false)
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to update form")
        },
    })

    const addField = (type: FormFieldType) => {
        const newField: CreateFormField = {
            label: `New ${FIELD_TYPE_CONFIGS[type].label}`,
            type,
            isRequired: false,
            options: FIELD_TYPE_CONFIGS[type].options || [],
            order: fields.length,
            formSectionId: form?.id || "",
        }
        setFields([...fields, newField])
        setEditingFieldIndex(fields.length)
        setHasChanges(true)
    }

    const updateField = (index: number, updates: Partial<CreateFormField>) => {
        const updatedFields = [...fields]
        updatedFields[index] = { ...updatedFields[index], ...updates }
        setFields(updatedFields)
        setHasChanges(true)
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
        setHasChanges(true)
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
        setHasChanges(true)
    }

    const onSubmit = async (data: FormFormData) => {
        if (!form) return

        if (fields.length === 0) {
            toast.error("Please add at least one field to your form")
            return
        }

        updateFormMutation.mutate({
            formSection: {
                title: data.title,
            },
            fields,
        })
    }

    const canProceedToFields = formForm.watch("title").trim().length > 0
    const canSaveForm = fields.length > 0 && formForm.watch("title").trim().length > 0

    if (!form) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Edit className="h-5 w-5" />
                        Edit Form: {form.title}
                    </DialogTitle>
                    <DialogDescription>
                        Modify your form&apos;s title, fields, and configurations. All changes will be saved when you click &quot;Save Changes&quot;.
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
                            Edit Fields
                        </span>
                    </div>
                    <div className="flex-1 mx-4 h-px bg-border" />
                    <div className="flex items-center space-x-4">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                            }`}>
                            3
                        </div>
                        <span className={currentStep >= 3 ? "text-foreground" : "text-muted-foreground"}>
                            Preview & Save
                        </span>
                    </div>
                </div>

                <Tabs value={currentStep.toString()} onValueChange={(value) => setCurrentStep(parseInt(value))}>
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="1" disabled={!canProceedToFields}>Form Details</TabsTrigger>
                        <TabsTrigger value="2" disabled={!canProceedToFields}>Edit Fields</TabsTrigger>
                        <TabsTrigger value="3" disabled={!canSaveForm}>Preview & Save</TabsTrigger>
                    </TabsList>

                    <TabsContent value="1" className="space-y-6">
                        <Form {...formForm}>
                            <form className="space-y-6">
                                <FormField
                                    control={formForm.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Form Title</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g., Student Registration Form, Course Application"
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e)
                                                        setHasChanges(true)
                                                    }}
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
                                    control={formForm.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description (Optional)</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Brief description of what this form is for..."
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e)
                                                        setHasChanges(true)
                                                    }}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Provide additional context about the form&apos;s purpose.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-end">
                                    <Button
                                        type="button"
                                        onClick={() => setCurrentStep(2)}
                                        disabled={!canProceedToFields}
                                    >
                                        Next: Edit Fields
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
                                        Choose from various field types to add to your form.
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
                                </div>

                                {fields.length === 0 ? (
                                    <Card>
                                        <CardContent className="flex flex-col items-center justify-center py-8">
                                            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                                            <h3 className="text-lg font-semibold mb-2">No fields in this form</h3>
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
                                                                            {field.options?.length && field.options.length > 0 && (
                                                                                <p className="text-sm text-muted-foreground">
                                                                                    {field.options?.length} options
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
                                                title={formForm.watch("title")}
                                                description={formForm.watch("description")}
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
                                Next: Preview & Save
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
                                        <p className="text-muted-foreground">{formForm.watch("title")}</p>
                                    </div>
                                    {formForm.watch("description") && (
                                        <div>
                                            <h4 className="font-medium">Description</h4>
                                            <p className="text-muted-foreground">{formForm.watch("description")}</p>
                                        </div>
                                    )}
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
                                        title={formForm.watch("title")}
                                        description={formForm.watch("description")}
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
                                Back: Edit Fields
                            </Button>
                            <Button
                                onClick={formForm.handleSubmit(onSubmit)}
                                disabled={updateFormMutation.isPending || !hasChanges}
                                className="flex items-center gap-2"
                            >
                                {updateFormMutation.isPending ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Saving Changes...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        Save Changes
                                    </>
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