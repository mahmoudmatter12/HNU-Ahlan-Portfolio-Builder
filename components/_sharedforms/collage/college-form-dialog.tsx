"use client"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation } from "@tanstack/react-query"
import { CollegeService } from "@/services/collage-service"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import type { College, CreateCollageRequest } from "@/types/Collage"
import { useUser } from "@/context/userContext"

const collegeSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
    slug: z
        .string()
        .min(1, "Slug is required")
        .max(50, "Slug must be less than 50 characters")
        .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
    type: z.enum(["TECHNICAL", "MEDICAL", "ARTS", "OTHER"], {
        required_error: "Please select a college type",
    }),
    theme: z.string().optional(),
    galleryImages: z.string().optional(),
    createdById: z.string().min(1, "Created by ID is required"),
    faq: z.string().optional(),
})

type CollegeFormData = z.infer<typeof collegeSchema>

interface CollegeFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    college?: College | null
    onSuccess: () => void
}

export function CollegeFormDialog({ open, onOpenChange, college, onSuccess }: CollegeFormDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const isEditing = !!college
    const { user } = useUser()

    const form = useForm<CollegeFormData>({
        resolver: zodResolver(collegeSchema),
        defaultValues: {
            name: "",
            slug: "",
            type: "TECHNICAL",
            theme: "{}",
            galleryImages: "[]",
            createdById: user?.id || "",
            faq: "[]",
        },
    })


    // Reset form when dialog opens/closes or college changes
    useEffect(() => {
        if (open) {
            if (college) {
                form.reset({
                    name: college.name,
                    slug: college.slug,
                    type: college.type,
                    theme: JSON.stringify(college.theme, null, 2),
                    galleryImages: JSON.stringify(college.galleryImages, null, 2),
                    createdById: college.createdById,
                    faq: JSON.stringify(college.faq, null, 2),
                })
            } else {
                form.reset({
                    name: "",
                    slug: "",
                    type: "TECHNICAL",
                    theme: "{}",
                    galleryImages: "[]",
                    createdById: user?.id || "",
                    faq: "[]",
                })
            }
        }
    }, [open, college, form, user?.id])

    const createMutation = useMutation({
        mutationFn: (data: CreateCollageRequest) => CollegeService.createCollege(data),
        onSuccess: () => {
            toast.success("College created successfully")
            onSuccess()
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to create college")
        },
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => CollegeService.updateCollege(id, data),
        onSuccess: () => {
            toast.success("College updated successfully")
            onSuccess()
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to update college")
        },
    })

    const onSubmit = async (data: CollegeFormData) => {
        setIsSubmitting(true)

        try {
            // Parse JSON fields
            let theme = {}
            let galleryImages = []

            try {
                theme = data.theme ? JSON.parse(data.theme) : {}
            } catch (e) {
                setError("Invalid JSON in theme field")
                setIsSubmitting(false)
                return
            }

            try {
                galleryImages = data.galleryImages ? JSON.parse(data.galleryImages) : []
            } catch (e) {
                setError("Invalid JSON in gallery images field")
                setIsSubmitting(false)
                return
            }



            const submitData = {
                name: data.name,
                slug: data.slug,
                type: data.type,
                theme,
                galleryImages,
                createdById: data.createdById || user?.id,
                faq: data.faq ? JSON.parse(data.faq) : [],
            }

            if (isEditing && college) {
                await updateMutation.mutateAsync({ id: college.id, data: submitData })
            } else {
                await createMutation.mutateAsync(submitData)
            }
        } catch (error) {
            setError("Failed to create college")
            // Error handling is done in mutation callbacks
        } finally {
            setIsSubmitting(false)
        }
    }

    // Auto-generate slug from name
    const handleNameChange = (value: string) => {
        form.setValue("name", value)
        if (!isEditing) {
            const slug = value
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, "")
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-")
                .trim()
            form.setValue("slug", slug)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit College" : "Add New College"}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? "Update the college information below." : "Fill in the details to create a new college."}
                    </DialogDescription>
                </DialogHeader>
                {error && <p className="text-red-500">{error}</p>}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>College Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., Faculty of Engineering"
                                                {...field}
                                                onChange={(e) => handleNameChange(e.target.value)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>URL Slug</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., faculty-of-engineering" {...field} />
                                        </FormControl>
                                        <FormDescription>This will be used in the URL: /{field.value}</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>College Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a college type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="TECHNICAL">Technical</SelectItem>
                                            <SelectItem value="MEDICAL">Medical</SelectItem>
                                            <SelectItem value="ARTS">Arts</SelectItem>
                                            <SelectItem value="OTHER">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                       
                        {/* Hidden field for createdById */}
                        <FormField
                            control={form.control}
                            name="createdById"
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
                                {isEditing ? "Update College" : "Create College"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
