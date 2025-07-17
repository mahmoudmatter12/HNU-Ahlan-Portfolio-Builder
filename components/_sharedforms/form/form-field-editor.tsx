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
import { Plus, Trash2, GripVertical, Settings, Palette } from "lucide-react"
import { FIELD_TYPE_CONFIGS, type FormFieldType, type CreateFormField, type CreateFormFieldData } from "@/types/form"

const fieldSchema = z.object({
    label: z.string().min(1, "Field label is required").max(100, "Label must be less than 100 characters"),
    isRequired: z.boolean(),
    options: z.array(z.string()).optional(),
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
    const [showAdvanced, setShowAdvanced] = useState(false)

    const form = useForm<FieldFormData>({
        resolver: zodResolver(fieldSchema),
        defaultValues: {
            label: field.label,
            isRequired: field.isRequired,
            options: field.options || [],
        },
    })

    const fieldConfig = FIELD_TYPE_CONFIGS[field.type]
    const needsOptions = ["SELECT", "CHECKBOX", "RADIO"].includes(field.type)

    const onSubmit = (data: FieldFormData) => {
        onUpdate(index, {
            label: data.label,
            isRequired: data.isRequired,
            options: data.options || [],
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

    const moveOption = (fromIndex: number, toIndex: number) => {
        const currentOptions = form.watch("options") || []
        const updatedOptions = [...currentOptions]
        const [movedOption] = updatedOptions.splice(fromIndex, 1)
        updatedOptions.splice(toIndex, 0, movedOption)
        form.setValue("options", updatedOptions)
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
                                            <Palette className="h-4 w-4" />
                                            Field Type
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-3">
                                            <Badge variant="secondary" className="text-sm">
                                                {field.type}
                                            </Badge>
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
                                                            placeholder="e.g., Full Name, Email Address, Program Selection"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        This is the text that users will see above the field.
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
                                                        <span className="flex-1 text-sm">{option}</span>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeOption(optionIndex)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
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

                                {/* Advanced Configuration */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Advanced Settings</CardTitle>
                                        <CardDescription>
                                            Additional configuration options for this field type.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {field.type === "TEXT" && (
                                            <div className="space-y-2">
                                                <FormLabel>Text Input Type</FormLabel>
                                                <div className="text-sm text-muted-foreground">
                                                    Single line text input for short responses.
                                                </div>
                                            </div>
                                        )}

                                        {field.type === "TEXTAREA" && (
                                            <div className="space-y-2">
                                                <FormLabel>Text Area</FormLabel>
                                                <div className="text-sm text-muted-foreground">
                                                    Multi-line text input for longer responses.
                                                </div>
                                            </div>
                                        )}

                                        {field.type === "EMAIL" && (
                                            <div className="space-y-2">
                                                <FormLabel>Email Validation</FormLabel>
                                                <div className="text-sm text-muted-foreground">
                                                    Automatically validates email format.
                                                </div>
                                            </div>
                                        )}

                                        {field.type === "NUMBER" && (
                                            <div className="space-y-2">
                                                <FormLabel>Number Input</FormLabel>
                                                <div className="text-sm text-muted-foreground">
                                                    Numeric input with validation.
                                                </div>
                                            </div>
                                        )}

                                        {field.type === "DATE" && (
                                            <div className="space-y-2">
                                                <FormLabel>Date Picker</FormLabel>
                                                <div className="text-sm text-muted-foreground">
                                                    Calendar date selection.
                                                </div>
                                            </div>
                                        )}

                                        {field.type === "FILE" && (
                                            <div className="space-y-2">
                                                <FormLabel>File Upload</FormLabel>
                                                <div className="text-sm text-muted-foreground">
                                                    File upload with size and type restrictions.
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-3">
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

                    {/* Live Preview */}
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
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
} 