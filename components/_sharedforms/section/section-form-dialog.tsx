"use client"
import { useState, useEffect, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation } from "@tanstack/react-query"
import { SectionService } from "@/services/section.service"
import { UploadService } from "@/services/upload.service"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Upload, X, Plus, Image as ImageIcon, Palette, Settings } from "lucide-react"
import type {
    CreateSection,
    UpdateSection,
    SectionType,
    SectionSettings,
    HeroSectionSettings,
    AboutSectionSettings,
    StudentActivitiesSectionSettings,
    WhyUsSectionSettings,
    CustomSectionSettings,
} from "@/types/section"
import { SECTION_TYPE_CONFIGS } from "@/types/section"
import type { College, CollegeSection } from "@/types/Collage"
import Image from "next/image"
import { Switch } from "@/components/ui/switch"

// Base schema for all sections
const baseSectionSchema = z.object({
    title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
    order: z.number().min(0, "Order must be 0 or greater"),
    sectionType: z.enum(["HERO", "ABOUT", "STUDENT_ACTIVITIES", "WHY_US", "CUSTOM"]),
    content: z.string().optional(),
    collegeId: z.string().min(1, "College ID is required"),
})

type BaseSectionFormData = z.infer<typeof baseSectionSchema>

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
    const [selectedSectionType, setSelectedSectionType] = useState<SectionType | null>(null)
    const [uploadingFiles, setUploadingFiles] = useState(false)
    const [sectionSettings, setSectionSettings] = useState<SectionSettings | null>(null)
    const isEditing = !!section


    const uploadService = new UploadService()

    const highestOrder = useCallback(() => {
        let maxOrder = 0;
        for (const section of college.sections) {
            if (section.order > maxOrder) {
                maxOrder = section.order;
            }
        }
        return maxOrder + 1;
    }, [college.sections])

    const form = useForm<BaseSectionFormData>({
        resolver: zodResolver(baseSectionSchema),
        defaultValues: {
            title: "",
            order: highestOrder(),
            sectionType: "CUSTOM",
            content: "",
            collegeId: collegeId,
        },
    })

    // Reset form when dialog opens/closes or section changes
    useEffect(() => {
        if (open) {
            if (section) {
                setSelectedSectionType(section.sectionType as SectionType)
                setSectionSettings(section.settings || null)
                form.reset({
                    title: section.title,
                    order: section.order,
                    sectionType: section.sectionType as SectionType,
                    content: section.content || "",
                    collegeId: collegeId,
                })
            } else {
                setSelectedSectionType("CUSTOM")
                // Initialize with default settings for CUSTOM type
                setSectionSettings(SECTION_TYPE_CONFIGS["CUSTOM"].defaultSettings)
                form.reset({
                    title: "",
                    order: highestOrder(),
                    sectionType: "CUSTOM",
                    content: "",
                    collegeId: collegeId,
                })
            }
        }
    }, [open, section, form, collegeId, college, highestOrder])

    // Update section type and initialize settings
    const handleSectionTypeChange = (type: SectionType) => {
        setSelectedSectionType(type)
        form.setValue("sectionType", type)

        // Initialize default settings for the selected type
        const defaultSettings = SECTION_TYPE_CONFIGS[type].defaultSettings
        setSectionSettings(defaultSettings)
    }

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

    // File upload handlers
    const handleFileUpload = async (files: FileList, settingKey: string) => {
        if (!files.length) return

        setUploadingFiles(true)
        try {
            const fileArray = Array.from(files)
            const uploadResults = await uploadService.uploadMultipleFiles(fileArray, {
                context: "section",
                subContext: selectedSectionType?.toLowerCase() || "custom",
                fieldName: settingKey,
            })

            const urls = uploadResults.map(result => result.url)

            // Update settings based on the setting key
            setSectionSettings(prev => {
                if (!prev) {
                    // Initialize settings if they don't exist
                    const defaultSettings = SECTION_TYPE_CONFIGS[selectedSectionType || "CUSTOM"].defaultSettings
                    if (settingKey === "backgroundImage") {
                        const newSettings = { ...defaultSettings, backgroundImage: urls[0] } as HeroSectionSettings
                        return newSettings
                    } else {
                        const newSettings = { ...defaultSettings, [settingKey]: urls }
                        return newSettings
                    }
                }

                if (settingKey === "images" || settingKey === "backgroundImage") {
                    if (settingKey === "backgroundImage") {
                        const newSettings = { ...prev, backgroundImage: urls[0] }
                        return newSettings
                    } else {
                        const currentImages = (prev as any)[settingKey] || []
                        const newSettings = { ...prev, [settingKey]: [...currentImages, ...urls] }
                        return newSettings
                    }
                }

                return prev
            })

            toast.success(`${fileArray.length} file(s) uploaded successfully`)
        } catch (error) {
            toast.error("Failed to upload files")
            console.error("Upload error:", error)
        } finally {
            setUploadingFiles(false)
        }
    }

    const removeImage = (settingKey: string, index: number) => {
        setSectionSettings(prev => {
            if (!prev) {
                // Initialize settings if they don't exist
                const defaultSettings = SECTION_TYPE_CONFIGS[selectedSectionType || "CUSTOM"].defaultSettings
                return defaultSettings
            }

            if (settingKey === "backgroundImage") {
                return { ...prev, backgroundImage: "" }
            } else {
                const currentImages = (prev as any)[settingKey] || []
                const newImages = currentImages.filter((_: any, i: number) => i !== index)
                return { ...prev, [settingKey]: newImages }
            }
        })
    }

    const onSubmit = async (data: BaseSectionFormData) => {
        setIsSubmitting(true)
        setError(null)

        try {
            const submitData = {
                title: data.title,
                order: data.order,
                sectionType: data.sectionType,
                content: data.content || "",
                settings: sectionSettings || undefined,
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
        } finally {
            setIsSubmitting(false)
        }
    }

    // Render settings based on section type
    const renderSectionSettings = () => {
        if (!selectedSectionType) return null

        const config = SECTION_TYPE_CONFIGS[selectedSectionType]

        switch (selectedSectionType) {
            case "HERO":
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Palette className="h-4 w-4" />
                                Hero Section Settings
                            </CardTitle>
                            <CardDescription>{config.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Background Image */}
                            <div>
                                <label className="text-sm font-medium">Background Image</label>
                                <div className="mt-2">
                                    {(sectionSettings as HeroSectionSettings)?.backgroundImage ? (
                                        <div className="relative w-full h-32 rounded-lg overflow-hidden">
                                            <Image
                                                fill
                                                src={(sectionSettings as HeroSectionSettings).backgroundImage || ""}
                                                alt="Background"
                                                className="object-cover"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                className="absolute top-2 right-2"
                                                onClick={() => removeImage("backgroundImage", 0)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : uploadingFiles ? (
                                        <div className="w-full h-32 rounded-lg bg-gray-100 flex items-center justify-center">
                                            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                                            <span className="ml-2 text-sm text-gray-600">Uploading...</span>
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => e.target.files && handleFileUpload(e.target.files, "backgroundImage")}
                                                className="hidden"
                                                id="hero-bg-upload"
                                            />
                                            <label htmlFor="hero-bg-upload" className="cursor-pointer">
                                                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                                                <p className="text-sm text-gray-600">Upload background image</p>
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Catchphrase */}
                            <div>
                                <label className="text-sm font-medium">Catchphrase</label>
                                <Textarea
                                    placeholder="Enter a catchy phrase for your hero section..."
                                    value={(sectionSettings as HeroSectionSettings)?.catchphrase || ""}
                                    onChange={(e) => setSectionSettings(prev => ({
                                        ...prev,
                                        catchphrase: e.target.value
                                    } as HeroSectionSettings))}
                                    className="mt-1"
                                />
                            </div>
                        </CardContent>
                    </Card>
                )

            case "ABOUT":
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ImageIcon className="h-4 w-4" />
                                About Section Settings
                            </CardTitle>
                            <CardDescription>{config.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Images */}
                            <div>
                                <label className="text-sm font-medium">Images</label>
                                <div className="mt-2 space-y-2">
                                    {(sectionSettings as AboutSectionSettings)?.images?.map((image, index) => (
                                        <div key={index} className="relative w-full h-24 rounded-lg overflow-hidden">
                                            <Image
                                                fill
                                                src={image}
                                                alt={`About ${index + 1}`}
                                                className="object-cover"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                className="absolute top-2 right-2"
                                                onClick={() => removeImage("images", index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    {uploadingFiles && (
                                        <div className="w-full h-24 rounded-lg bg-gray-100 flex items-center justify-center">
                                            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                                            <span className="ml-2 text-sm text-gray-600">Uploading...</span>
                                        </div>
                                    )}
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={(e) => e.target.files && handleFileUpload(e.target.files, "images")}
                                            className="hidden"
                                            id="about-images-upload"
                                        />
                                        <label htmlFor="about-images-upload" className="cursor-pointer">
                                            <Upload className="h-6 w-6 mx-auto mb-1 text-gray-400" />
                                            <p className="text-xs text-gray-600">Add images</p>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="text-sm font-medium">Section Title</label>
                                <Input
                                    placeholder="About Our College"
                                    value={(sectionSettings as AboutSectionSettings)?.title || ""}
                                    onChange={(e) => setSectionSettings(prev => ({
                                        ...prev,
                                        title: e.target.value
                                    } as AboutSectionSettings))}
                                    className="mt-1"
                                />
                            </div>

                            {/* Show Images */}
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium">Show Images</label>
                                <Switch
                                    id="show-images"
                                    checked={(sectionSettings as AboutSectionSettings)?.showImages || false}
                                    onCheckedChange={(checked) => setSectionSettings(prev => ({
                                        ...prev,
                                        showImages: checked
                                    } as AboutSectionSettings))}
                                    className="mt-1"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="text-sm font-medium">Description</label>
                                <Textarea
                                    placeholder="Describe your college..."
                                    value={(sectionSettings as AboutSectionSettings)?.description || ""}
                                    onChange={(e) => setSectionSettings(prev => ({
                                        ...prev,
                                        description: e.target.value
                                    } as AboutSectionSettings))}
                                    className="mt-1"
                                />
                            </div>
                        </CardContent>
                    </Card>
                )

            case "STUDENT_ACTIVITIES":
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ImageIcon className="h-4 w-4" />
                                Student Activities Settings
                            </CardTitle>
                            <CardDescription>{config.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Images */}
                            <div>
                                <label className="text-sm font-medium">Activity Images</label>
                                <div className="mt-2 space-y-2">
                                    {(sectionSettings as StudentActivitiesSectionSettings)?.images?.map((image, index) => (
                                        <div key={index} className="relative w-full h-24 rounded-lg overflow-hidden">
                                            <Image
                                                fill
                                                src={image}
                                                alt={`Activity ${index + 1}`}
                                                className="object-cover"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                className="absolute top-2 right-2"
                                                onClick={() => removeImage("images", index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    {uploadingFiles && (
                                        <div className="w-full h-24 rounded-lg bg-gray-100 flex items-center justify-center">
                                            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                                            <span className="ml-2 text-sm text-gray-600">Uploading...</span>
                                        </div>
                                    )}
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={(e) => e.target.files && handleFileUpload(e.target.files, "images")}
                                            className="hidden"
                                            id="activities-images-upload"
                                        />
                                        <label htmlFor="activities-images-upload" className="cursor-pointer">
                                            <Upload className="h-6 w-6 mx-auto mb-1 text-gray-400" />
                                            <p className="text-xs text-gray-600">Add activity images</p>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="text-sm font-medium">Section Title</label>
                                <Input
                                    placeholder="Student Activities"
                                    value={(sectionSettings as StudentActivitiesSectionSettings)?.title || ""}
                                    onChange={(e) => setSectionSettings(prev => ({
                                        ...prev,
                                        title: e.target.value
                                    } as StudentActivitiesSectionSettings))}
                                    className="mt-1"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="text-sm font-medium">Description</label>
                                <Textarea
                                    placeholder="Describe student activities..."
                                    value={(sectionSettings as StudentActivitiesSectionSettings)?.description || ""}
                                    onChange={(e) => setSectionSettings(prev => ({
                                        ...prev,
                                        description: e.target.value
                                    } as StudentActivitiesSectionSettings))}
                                    className="mt-1"
                                />
                            </div>
                        </CardContent>
                    </Card>
                )

            case "WHY_US":
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="h-4 w-4" />
                                Why Choose Us Settings
                            </CardTitle>
                            <CardDescription>{config.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Images */}
                            <div>
                                <label className="text-sm font-medium">Images</label>
                                <div className="mt-2 space-y-2">
                                    {(sectionSettings as WhyUsSectionSettings)?.images?.map((image, index) => (
                                        <div key={index} className="relative w-full h-24 rounded-lg overflow-hidden">
                                            <Image
                                                fill
                                                src={image}
                                                alt={`Why Us ${index + 1}`}
                                                className="object-cover"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                className="absolute top-2 right-2"
                                                onClick={() => removeImage("images", index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    {uploadingFiles && (
                                        <div className="w-full h-24 rounded-lg bg-gray-100 flex items-center justify-center">
                                            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                                            <span className="ml-2 text-sm text-gray-600">Uploading...</span>
                                        </div>
                                    )}
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={(e) => e.target.files && handleFileUpload(e.target.files, "images")}
                                            className="hidden"
                                            id="why-us-images-upload"
                                        />
                                        <label htmlFor="why-us-images-upload" className="cursor-pointer">
                                            <Upload className="h-6 w-6 mx-auto mb-1 text-gray-400" />
                                            <p className="text-xs text-gray-600">Add images</p>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="text-sm font-medium">Section Title</label>
                                <Input
                                    placeholder="Why Choose Us"
                                    value={(sectionSettings as WhyUsSectionSettings)?.title || ""}
                                    onChange={(e) => setSectionSettings(prev => ({
                                        ...prev,
                                        title: e.target.value
                                    } as WhyUsSectionSettings))}
                                    className="mt-1"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="text-sm font-medium">Description</label>
                                <Textarea
                                    placeholder="Explain why students should choose your college..."
                                    value={(sectionSettings as WhyUsSectionSettings)?.description || ""}
                                    onChange={(e) => setSectionSettings(prev => ({
                                        ...prev,
                                        description: e.target.value
                                    } as WhyUsSectionSettings))}
                                    className="mt-1"
                                />
                            </div>

                            {/* Features */}
                            <div>
                                <label className="text-sm font-medium">Features</label>
                                <div className="mt-2 space-y-2">
                                    {(sectionSettings as WhyUsSectionSettings)?.features?.map((feature, index) => (
                                        <div key={index} className="border rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Input
                                                    placeholder="Feature title"
                                                    value={feature.title}
                                                    onChange={(e) => {
                                                        const newFeatures = [...(sectionSettings as WhyUsSectionSettings)?.features || []]
                                                        newFeatures[index] = { ...feature, title: e.target.value }
                                                        setSectionSettings(prev => ({
                                                            ...prev,
                                                            features: newFeatures
                                                        } as WhyUsSectionSettings))
                                                    }}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => {
                                                        const newFeatures = (sectionSettings as WhyUsSectionSettings)?.features?.filter((_, i) => i !== index) || []
                                                        setSectionSettings(prev => ({
                                                            ...prev,
                                                            features: newFeatures
                                                        } as WhyUsSectionSettings))
                                                    }}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <Textarea
                                                placeholder="Feature description"
                                                value={feature.description}
                                                onChange={(e) => {
                                                    const newFeatures = [...(sectionSettings as WhyUsSectionSettings)?.features || []]
                                                    newFeatures[index] = { ...feature, description: e.target.value }
                                                    setSectionSettings(prev => ({
                                                        ...prev,
                                                        features: newFeatures
                                                    } as WhyUsSectionSettings))
                                                }}
                                            />
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const newFeatures = [...(sectionSettings as WhyUsSectionSettings)?.features || [], {
                                                title: "",
                                                description: "",
                                                icon: ""
                                            }]
                                            setSectionSettings(prev => ({
                                                ...prev,
                                                features: newFeatures
                                            } as WhyUsSectionSettings))
                                        }}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Feature
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )

            case "CUSTOM":
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="h-4 w-4" />
                                Custom Section Settings
                            </CardTitle>
                            <CardDescription>{config.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Images */}
                            <div>
                                <label className="text-sm font-medium">Images</label>
                                <div className="mt-2 space-y-2">
                                    {(sectionSettings as CustomSectionSettings)?.images?.map((image, index) => (
                                        <div key={index} className="relative w-full h-24 rounded-lg overflow-hidden">
                                            <Image
                                                fill
                                                src={image}
                                                alt={`Custom ${index + 1}`}
                                                className="object-cover"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                className="absolute top-2 right-2"
                                                onClick={() => removeImage("images", index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    {uploadingFiles && (
                                        <div className="w-full h-24 rounded-lg bg-gray-100 flex items-center justify-center">
                                            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                                            <span className="ml-2 text-sm text-gray-600">Uploading...</span>
                                        </div>
                                    )}
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={(e) => e.target.files && handleFileUpload(e.target.files, "images")}
                                            className="hidden"
                                            id="custom-images-upload"
                                        />
                                        <label htmlFor="custom-images-upload" className="cursor-pointer">
                                            <Upload className="h-6 w-6 mx-auto mb-1 text-gray-400" />
                                            <p className="text-xs text-gray-600">Add images</p>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="text-sm font-medium">Section Title</label>
                                <Input
                                    placeholder="Custom Section Title"
                                    value={(sectionSettings as CustomSectionSettings)?.title || ""}
                                    onChange={(e) => setSectionSettings(prev => ({
                                        ...prev,
                                        title: e.target.value
                                    } as CustomSectionSettings))}
                                    className="mt-1"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="text-sm font-medium">Description</label>
                                <Textarea
                                    placeholder="Brief description of this custom section..."
                                    value={(sectionSettings as CustomSectionSettings)?.description || ""}
                                    onChange={(e) => setSectionSettings(prev => ({
                                        ...prev,
                                        description: e.target.value
                                    } as CustomSectionSettings))}
                                    className="mt-1"
                                />
                            </div>

                            {/* Image Display Type */}
                            <div>
                                <label className="text-sm font-medium">Image Display Type</label>
                                <Select
                                    value={(sectionSettings as CustomSectionSettings)?.imageDisplayType || "slider"}
                                    onValueChange={(value) => setSectionSettings(prev => ({
                                        ...prev,
                                        imageDisplayType: value as "slider" | "grid" | "single" | "banner" | "carousel" | "gallery" | "list" | "background"
                                    } as CustomSectionSettings))}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Select display type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="slider">Slider</SelectItem>
                                        <SelectItem value="grid">Grid</SelectItem>
                                        <SelectItem value="single">Single Image</SelectItem>
                                        <SelectItem value="banner">Banner</SelectItem>
                                        <SelectItem value="carousel">Carousel</SelectItem>
                                        <SelectItem value="gallery">Gallery</SelectItem>
                                        <SelectItem value="list">List</SelectItem>
                                        <SelectItem value="background">Background</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-gray-500 mt-1">
                                    Choose how images should be displayed in this section
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )

            default:
                return null
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Section" : "Add New Section"}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? "Update the section information below." : "Choose a section type and configure its settings."}
                    </DialogDescription>
                </DialogHeader>
                {error && <p className="text-red-500">{error}</p>}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
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
                                    name="sectionType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Section Type</FormLabel>
                                            <Select
                                                value={field.value}
                                                onValueChange={(value) => {
                                                    field.onChange(value)
                                                    handleSectionTypeChange(value as SectionType)
                                                }}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a section type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {Object.entries(SECTION_TYPE_CONFIGS).map(([key, config]) => (
                                                        <SelectItem key={key} value={key}>
                                                            <div className="flex items-center gap-2">
                                                                <span>{config.icon}</span>
                                                                <div>
                                                                    <div className="font-medium">{config.label}</div>
                                                                    <div className="text-xs text-gray-500">{config.description}</div>
                                                                </div>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Section Type Settings */}
                        {selectedSectionType && renderSectionSettings()}

                        {/* Content Editor (for CUSTOM type or additional content) */}
                        {(selectedSectionType === "CUSTOM" || selectedSectionType === "ABOUT" || selectedSectionType === "STUDENT_ACTIVITIES" || selectedSectionType === "WHY_US") && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Content</CardTitle>
                                    <CardDescription>
                                        {selectedSectionType === "CUSTOM"
                                            ? "Write your custom content using Markdown"
                                            : "Additional content to complement the section settings"
                                        }
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <FormField
                                        control={form.control}
                                        name="content"
                                        render={({ field }) => (
                                            <FormItem>
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
                                                <FormDescription>
                                                    Use Markdown to format your content. Supports headings, lists, links, images, and more.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        )}

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
                            <Button type="submit" disabled={isSubmitting || uploadingFiles}>
                                {(isSubmitting || uploadingFiles) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEditing ? "Update Section" : "Create Section"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
} 