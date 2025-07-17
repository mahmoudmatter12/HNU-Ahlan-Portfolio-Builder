"use client"
import { useState, useEffect, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation } from "@tanstack/react-query"
import { SectionService } from "@/services/section-service"
import MDEditor from '@uiw/react-md-editor'
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
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import type { CreateSection, UpdateSection } from "@/types/section"
import type { College, CollegeSection } from "@/types/Collage"

const sectionSchema = z.object({
    title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
    order: z.number().min(0, "Order must be 0 or greater"),
    content: z.string().optional(),
    collegeId: z.string().min(1, "College ID is required"),
})

type SectionFormData = z.infer<typeof sectionSchema>

interface SectionFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    section?: CollegeSection | null
    collegeId: string
    onSuccess: () => void
    college: College
}

export function SectionFormDialog({ open, onOpenChange, section, collegeId, onSuccess, college }: SectionFormDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const isEditing = !!section

    const highestOrder = useCallback(() => {
        let maxOrder = 0;
        for (const section of college.sections) {
            if (section.order > maxOrder) {
                maxOrder = section.order;
            }
        }
        return maxOrder + 1;
    }, [college.sections])

    const form = useForm<SectionFormData>({
        resolver: zodResolver(sectionSchema),
        defaultValues: {
            title: "",
            order: highestOrder(),
            content: "",
            collegeId: collegeId,
        },
    })

    // Reset form when dialog opens/closes or section changes
    useEffect(() => {
        if (open) {
            if (section) {
                form.reset({
                    title: section.title,
                    order: section.order,
                    content: section.content,
                    collegeId: collegeId,
                })
            } else {
                form.reset({
                    title: "",
                    order: highestOrder(),
                    content: "",
                    collegeId: collegeId,
                })
            }
        }
    }, [open, section, form, collegeId, college, highestOrder])

    const sectionService = new SectionService()

    const createMutation = useMutation({
        mutationFn: (data: CreateSection) => sectionService.createSection(data),
        onSuccess: () => {
            toast.success("Section created successfully")
            onSuccess()
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to create section")
        },
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateSection }) => sectionService.updateSection(id, data),
        onSuccess: () => {
            toast.success("Section updated successfully")
            onSuccess()
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to update section")
        },
    })

    const onSubmit = async (data: SectionFormData) => {
        setIsSubmitting(true)
        setError(null)

        try {
            const submitData = {
                title: data.title,
                order: data.order,
                content: data.content || "",
                collegeId: data.collegeId,
            }

            if (isEditing && section) {
                const { collegeId, ...updateData } = submitData
                await updateMutation.mutateAsync({ id: section.id, data: updateData })
            } else {
                await createMutation.mutateAsync(submitData)
            }
        } catch (error) {
            setError("Failed to save section")
            // Error handling is done in mutation callbacks
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Section" : "Add New Section"}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? "Update the section information below." : "Fill in the details to create a new section."}
                    </DialogDescription>
                </DialogHeader>
                {error && <p className="text-red-500">{error}</p>}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Section Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., About Us, Programs, Contact"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="order"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Display Order</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="0"
                                                placeholder="0"
                                                {...field}
                                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                            />
                                        </FormControl>
                                        <FormDescription>Lower numbers appear first</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel>Content</FormLabel>
                                    <FormControl>
                                        <div data-color-mode="dark">
                                            <MDEditor
                                                value={field.value || ""}
                                                onChange={(value) => field.onChange(value || "")}
                                                height={300}
                                                preview="edit"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormDescription>Use Markdown to format your content. Supports headings, lists, links, images, and more.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Hidden field for collegeId */}
                        <FormField
                            control={form.control}
                            name="collegeId"
                            render={({ field }) => (
                                <FormItem className="hidden">
                                    <FormControl>
                                        <Input type="hidden" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEditing ? "Update Section" : "Create Section"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
} 