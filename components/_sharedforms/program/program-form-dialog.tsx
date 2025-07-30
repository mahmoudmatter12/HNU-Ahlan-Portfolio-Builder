"use client"
import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation } from "@tanstack/react-query"
import { CollegeService } from "@/services/collage-service"
import { UploadService } from "@/services/upload-service"
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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2, Plus, Trash2, Upload, X, Link as LinkIcon, Video, Image as ImageIcon } from "lucide-react"
import type { Program, ProgramData, ProgramDescription, ProgramDescriptionRecords } from "@/types/program"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

const programDescriptionRecordSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
})

const programDescriptionSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    image: z.array(programDescriptionRecordSchema).nullable(),
    link: z.array(programDescriptionRecordSchema).nullable(),
    video: z.array(programDescriptionRecordSchema).nullable(),
})

const programSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
    slug: z
        .string()
        .min(1, "Slug is required")
        .max(50, "Slug must be less than 50 characters")
        .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
    description: z.array(programDescriptionSchema).optional(),
})

type ProgramFormData = z.infer<typeof programSchema>

interface ProgramFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    program?: Program | null
    collegeId: string
    onSuccess: () => void
}

export function ProgramFormDialog({ open, onOpenChange, program, collegeId, onSuccess }: ProgramFormDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [uploadingImages, setUploadingImages] = useState<{ [key: string]: boolean }>({})
    const isEditing = !!program
    const uploadService = new UploadService()

    const form = useForm<ProgramFormData>({
        resolver: zodResolver(programSchema),
        defaultValues: {
            name: "",
            slug: "",
            description: [],
        },
    })

    const { fields: descriptionFields, append: appendDescription, remove: removeDescription } = useFieldArray({
        control: form.control,
        name: "description",
    })

    // Reset form when dialog opens/closes or program changes
    useEffect(() => {
        if (open) {
            if (program) {
                const description = program.description ? (program.description as ProgramDescription[]) : []
                form.reset({
                    name: program.name,
                    slug: program.slug,
                    description,
                })
            } else {
                form.reset({
                    name: "",
                    slug: "",
                    description: [],
                })
            }
        }
    }, [open, program, form])

    const createMutation = useMutation({
        mutationFn: (data: ProgramData) => CollegeService.createProgram(collegeId, data),
        onSuccess: () => {
            toast.success("Program created successfully")
            onSuccess()
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to create program")
        },
    })

    const updateMutation = useMutation({
        mutationFn: ({ programId, data }: { programId: string; data: ProgramData }) =>
            CollegeService.updateProgram(collegeId, programId, data),
        onSuccess: () => {
            toast.success("Program updated successfully")
            onSuccess()
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to update program")
        },
    })

    const handleImageUpload = async (file: File, descriptionIndex: number, recordIndex: number) => {
        const key = `${descriptionIndex}-${recordIndex}`
        setUploadingImages(prev => ({ ...prev, [key]: true }))

        try {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error("Please select a valid image file")
                return
            }

            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size must be less than 5MB")
                return
            }

            const uploadResult = await uploadService.uploadFile(file, {
                context: "program",
                subContext: "description",
                fieldName: `image_${descriptionIndex}_${recordIndex}`,
            })

            // Update the form with the uploaded image URL
            const currentDescription = form.getValues(`description.${descriptionIndex}`)
            const currentImages = currentDescription?.image || []
            currentImages[recordIndex] = {
                ...currentImages[recordIndex],
                content: uploadResult.url,
            }

            form.setValue(`description.${descriptionIndex}.image`, currentImages)
            toast.success("Image uploaded successfully")
        } catch (error) {
            toast.error("Failed to upload image. Please try again.")
            console.error("Upload error:", error)
        } finally {
            setUploadingImages(prev => ({ ...prev, [key]: false }))
        }
    }

    const onSubmit = async (data: ProgramFormData) => {
        setIsSubmitting(true)
        setError(null)

        try {
            const submitData: ProgramData = {
                name: data.name,
                slug: data.slug,
                description: data.description || [],
            } as ProgramData

            if (isEditing && program) {
                await updateMutation.mutateAsync({ programId: program.id, data: submitData })
            } else {
                await createMutation.mutateAsync(submitData)
            }
        } catch (error) {
            setError("Failed to save program")
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

    const addDescription = () => {
        appendDescription({
            title: "",
            description: "",
            image: [],
            link: [],
            video: [],
        })
    }

    const addImageRecord = (descriptionIndex: number) => {
        const currentDescription = form.getValues(`description.${descriptionIndex}`)
        const currentImages = currentDescription?.image || []
        form.setValue(`description.${descriptionIndex}.image`, [
            ...currentImages,
            { title: "", content: "" }
        ])
    }

    const addLinkRecord = (descriptionIndex: number) => {
        const currentDescription = form.getValues(`description.${descriptionIndex}`)
        const currentLinks = currentDescription?.link || []
        form.setValue(`description.${descriptionIndex}.link`, [
            ...currentLinks,
            { title: "", content: "" }
        ])
    }

    const addVideoRecord = (descriptionIndex: number) => {
        const currentDescription = form.getValues(`description.${descriptionIndex}`)
        const currentVideos = currentDescription?.video || []
        form.setValue(`description.${descriptionIndex}.video`, [
            ...currentVideos,
            { title: "", content: "" }
        ])
    }

    const removeImageRecord = (descriptionIndex: number, recordIndex: number) => {
        const currentDescription = form.getValues(`description.${descriptionIndex}`)
        const currentImages = currentDescription?.image || []
        currentImages.splice(recordIndex, 1)
        form.setValue(`description.${descriptionIndex}.image`, currentImages)
    }

    const removeLinkRecord = (descriptionIndex: number, recordIndex: number) => {
        const currentDescription = form.getValues(`description.${descriptionIndex}`)
        const currentLinks = currentDescription?.link || []
        currentLinks.splice(recordIndex, 1)
        form.setValue(`description.${descriptionIndex}.link`, currentLinks)
    }

    const removeVideoRecord = (descriptionIndex: number, recordIndex: number) => {
        const currentDescription = form.getValues(`description.${descriptionIndex}`)
        const currentVideos = currentDescription?.video || []
        currentVideos.splice(recordIndex, 1)
        form.setValue(`description.${descriptionIndex}.video`, currentVideos)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Program" : "Add New Program"}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? "Update the program information and descriptions." : "Create a new program with detailed descriptions."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Program Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter program name"
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
                                            <FormLabel>Slug</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="program-slug"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                URL-friendly identifier for the program
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Descriptions */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Program Descriptions</CardTitle>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addDescription}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Description
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {descriptionFields.map((field, descriptionIndex) => (
                                    <Card key={field.id} className="border-dashed">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-lg">Description {descriptionIndex + 1}</CardTitle>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => removeDescription(descriptionIndex)}
                                                    className="text-red-600 hover:text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <FormField
                                                control={form.control}
                                                name={`description.${descriptionIndex}.title`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Title</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Description title" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name={`description.${descriptionIndex}.description`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Description</FormLabel>
                                                        <FormControl>
                                                            <div data-color-mode="dark">
                                                                <MDEditor
                                                                    value={field.value || ""}
                                                                    onChange={(value) => field.onChange(value || "")}
                                                                    height={200}
                                                                    preview="edit"
                                                                />
                                                            </div>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Use Markdown to format your content. Supports headings, lists, links, images, and more.
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <Separator />

                                            {/* Images Section */}
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <ImageIcon className="h-4 w-4" />
                                                        <h4 className="font-medium">Images</h4>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => addImageRecord(descriptionIndex)}
                                                    >
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        Add Image
                                                    </Button>
                                                </div>

                                                {form.watch(`description.${descriptionIndex}.image`)?.map((_, recordIndex) => (
                                                    <Card key={recordIndex} className="p-3">
                                                        <div className="space-y-3">
                                                            <div className="flex items-center justify-between">
                                                                <h5 className="text-sm font-medium">Image {recordIndex + 1}</h5>
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => removeImageRecord(descriptionIndex, recordIndex)}
                                                                    className="text-red-600 hover:text-red-600"
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            </div>

                                                            <FormField
                                                                control={form.control}
                                                                name={`description.${descriptionIndex}.image.${recordIndex}.title`}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel className="text-xs">Image Title</FormLabel>
                                                                        <FormControl>
                                                                            <Input placeholder="Image title" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />

                                                            <div className="space-y-2">
                                                                <FormLabel className="text-xs">Image File</FormLabel>
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <Input
                                                                            type="file"
                                                                            accept="image/*"
                                                                            onChange={(e) => {
                                                                                const file = e.target.files?.[0]
                                                                                if (file) {
                                                                                    handleImageUpload(file, descriptionIndex, recordIndex)
                                                                                }
                                                                            }}
                                                                            disabled={uploadingImages[`${descriptionIndex}-${recordIndex}`]}
                                                                            className="flex-1"
                                                                        />
                                                                        {uploadingImages[`${descriptionIndex}-${recordIndex}`] && (
                                                                            <div className="flex items-center gap-2 text-blue-600">
                                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                                                <span className="text-xs">Uploading...</span>
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    <div className="text-xs text-gray-500">
                                                                        Supported formats: JPG, PNG, GIF, WebP (max 5MB)
                                                                    </div>
                                                                </div>

                                                                {form.watch(`description.${descriptionIndex}.image.${recordIndex}.content`) && (
                                                                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="relative w-16 h-16 border rounded overflow-hidden bg-white">
                                                                                <Image
                                                                                    src={form.watch(`description.${descriptionIndex}.image.${recordIndex}.content`)}
                                                                                    alt="Preview"
                                                                                    fill
                                                                                    className="object-cover"
                                                                                    sizes="64px"
                                                                                />
                                                                            </div>
                                                                            <div className="flex-1">
                                                                                <p className="text-sm font-medium text-green-800">
                                                                                    Image uploaded successfully
                                                                                </p>
                                                                                <p className="text-xs text-green-600">
                                                                                    Ready to use in your content
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </Card>
                                                ))}
                                            </div>

                                            <Separator />

                                            {/* Links Section */}
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <LinkIcon className="h-4 w-4" />
                                                        <h4 className="font-medium">External Links</h4>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => addLinkRecord(descriptionIndex)}
                                                    >
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        Add Link
                                                    </Button>
                                                </div>

                                                {form.watch(`description.${descriptionIndex}.link`)?.map((_, recordIndex) => (
                                                    <Card key={recordIndex} className="p-3">
                                                        <div className="space-y-3">
                                                            <div className="flex items-center justify-between">
                                                                <h5 className="text-sm font-medium">Link {recordIndex + 1}</h5>
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => removeLinkRecord(descriptionIndex, recordIndex)}
                                                                    className="text-red-600 hover:text-red-600"
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            </div>

                                                            <FormField
                                                                control={form.control}
                                                                name={`description.${descriptionIndex}.link.${recordIndex}.title`}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel className="text-xs">Link Title</FormLabel>
                                                                        <FormControl>
                                                                            <Input placeholder="Link title" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />

                                                            <FormField
                                                                control={form.control}
                                                                name={`description.${descriptionIndex}.link.${recordIndex}.content`}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel className="text-xs">URL</FormLabel>
                                                                        <FormControl>
                                                                            <Input placeholder="https://example.com" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    </Card>
                                                ))}
                                            </div>

                                            <Separator />

                                            {/* Videos Section */}
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Video className="h-4 w-4" />
                                                        <h4 className="font-medium">Video Links</h4>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => addVideoRecord(descriptionIndex)}
                                                    >
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        Add Video
                                                    </Button>
                                                </div>

                                                {form.watch(`description.${descriptionIndex}.video`)?.map((_, recordIndex) => (
                                                    <Card key={recordIndex} className="p-3">
                                                        <div className="space-y-3">
                                                            <div className="flex items-center justify-between">
                                                                <h5 className="text-sm font-medium">Video {recordIndex + 1}</h5>
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => removeVideoRecord(descriptionIndex, recordIndex)}
                                                                    className="text-red-600 hover:text-red-600"
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            </div>

                                                            <FormField
                                                                control={form.control}
                                                                name={`description.${descriptionIndex}.video.${recordIndex}.title`}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel className="text-xs">Video Title</FormLabel>
                                                                        <FormControl>
                                                                            <Input placeholder="Video title" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />

                                                            <FormField
                                                                control={form.control}
                                                                name={`description.${descriptionIndex}.video.${recordIndex}.content`}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel className="text-xs">Video URL</FormLabel>
                                                                        <FormControl>
                                                                            <Input placeholder="https://youtube.com/watch?v=..." {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    </Card>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}

                                {descriptionFields.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        <p className="text-sm">No descriptions added yet</p>
                                        <p className="text-xs">Click &quot;Add Description&quot; to get started</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {error && (
                            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                                {error}
                            </div>
                        )}

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                {isEditing ? "Update Program" : "Create Program"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
} 