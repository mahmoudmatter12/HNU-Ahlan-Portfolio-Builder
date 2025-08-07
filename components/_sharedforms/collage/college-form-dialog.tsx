"use client"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation } from "@tanstack/react-query"
import { CollegeService } from "@/services/collage.service"
import { UploadService } from "@/services/upload.service"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2, Upload, X, Image as ImageIcon } from "lucide-react"
import type { College, CreateCollageRequest } from "@/types/Collage"
import { useUser } from "@/context/userContext"
import { useUniversity } from "@/context/universityContext"
import Image from "next/image"

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
    universityId: z.string().optional(),
    logoUrl: z.string().optional(),
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
    const [isUploadingLogo, setIsUploadingLogo] = useState(false)
    const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null)
    const [logoPreview, setLogoPreview] = useState<string | null>(null)
    const [logoUrl, setLogoUrl] = useState<string>("")
    const isEditing = !!college
    const { user } = useUser()
    const { university } = useUniversity()

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
            universityId: university?.id || "",
            logoUrl: logoUrl || "",
        },
    })



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
                    universityId: college.university?.id || "",
                    logoUrl: college.logoUrl || "",
                })
                if (college.logoUrl) {
                    setLogoPreview(college.logoUrl)
                }
            } else {
                form.reset({
                    name: "",
                    slug: "",
                    type: "TECHNICAL",
                    theme: "{}",
                    galleryImages: "[]",
                    createdById: user?.id || "",
                    faq: "[]",
                    universityId: university?.id || "",
                    logoUrl: "",
                })
                setLogoPreview(null)
            }
            setSelectedLogoFile(null)
        }
    }, [open, college, form, user?.id, university?.id])

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

    const uploadLogoMutation = useMutation({
        mutationFn: (file: File) => new UploadService().uploadFile(file, {
            context: "college",
            subContext: "logo",
            fieldName: "logo"
        }),
        onSuccess: (data: any) => {
            form.setValue("logoUrl", data.url)
            setLogoUrl(data.url)
            toast.success("Logo uploaded successfully")
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to upload logo")
        },
    })

    const handleLogoFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            toast.error("Please select an image file")
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Logo file size must be less than 5MB")
            return
        }

        setSelectedLogoFile(file)
        const reader = new FileReader()
        reader.onload = (e) => setLogoPreview(e.target?.result as string)
        reader.readAsDataURL(file)
    }

    const handleLogoUpload = async () => {
        if (!selectedLogoFile) {
            toast.error("No file selected")
            return
        }

        setIsUploadingLogo(true)
        try {
            await uploadLogoMutation.mutateAsync(selectedLogoFile)
            setSelectedLogoFile(null)
        } catch (error) {
            console.error("Logo upload failed:", error)
        } finally {
            setIsUploadingLogo(false)
        }
    }

    const clearLogo = () => {
        setSelectedLogoFile(null)
        setLogoPreview(null)
        form.setValue("logoUrl", "")
    }

    const onSubmit = async (data: CollegeFormData) => {
        setIsSubmitting(true)
        try {
            const submitData = {
                name: data.name,
                slug: data.slug,
                type: data.type,
                theme: data.theme ? JSON.parse(data.theme) : {},
                galleryImages: data.galleryImages ? JSON.parse(data.galleryImages) : [],
                createdById: data.createdById || user?.id,
                faq: data.faq ? JSON.parse(data.faq) : [],
                universityId: data.universityId || university?.id,
                logoUrl: data.logoUrl ,
            }

            if (isEditing && college) {
                await updateMutation.mutateAsync({ id: college.id, data: submitData })
            } else {
                await createMutation.mutateAsync(submitData)
            }
        } finally {
            setIsSubmitting(false)
        }
    }

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
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        {isEditing ? "Edit College" : "Create New College"}
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        {isEditing ? "Update college details" : "Fill in the details to create a new college"}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Logo Upload Section */}
                        <div className="flex flex-col items-center space-y-4">
                            <FormField
                                control={form.control}
                                name="logoUrl"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col items-center">
                                        <FormLabel className="sr-only">College Logo</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <label htmlFor="logo-upload" className="cursor-pointer">
                                                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                                                        {logoPreview || field.value ? (
                                                            <Image
                                                                src={logoPreview || field.value || ""}
                                                                alt="College logo"
                                                                fill
                                                                className="rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex flex-col items-center">
                                                                <Upload className="h-6 w-6 text-gray-400 mb-1" />
                                                                <span className="text-xs text-gray-500">Upload Logo</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </label>
                                                <input
                                                    id="logo-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleLogoFileSelect}
                                                    className="hidden"
                                                />

                                                {(logoPreview || field.value) && (
                                                    <button
                                                        type="button"
                                                        onClick={clearLogo}
                                                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                )}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {selectedLogoFile && (
                                <div className="flex flex-col items-center space-y-2">
                                    <Button
                                        type="button"
                                        onClick={handleLogoUpload}
                                        disabled={isUploadingLogo}
                                        size="sm"
                                        className="w-full"
                                    >
                                        {isUploadingLogo && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {isUploadingLogo ? "Uploading..." : "Save Logo"}
                                    </Button>
                                    <p className="text-xs text-gray-500 text-center">
                                        {selectedLogoFile.name} ({(selectedLogoFile.size / 1024).toFixed(1)} KB)
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Name and Slug Fields */}
                        <div className="space-y-4">
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
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* College Type */}
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

                        <div className="flex justify-end space-x-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEditing ? "Save Changes" : "Create College"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}