"use client"
import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation } from "@tanstack/react-query"
import { CollegeService } from "@/services/collage.service"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Plus, Trash2, ExternalLink, Globe, Facebook, Linkedin, MessageCircle, Phone, Mail } from "lucide-react"
import type { College, SocialMediaLinks } from "@/types/Collage"

const socialMediaSchema = z.object({
    // Preset social media platforms
    facebook: z.string().optional(),
    linkedin: z.string().optional(),
    tiktok: z.string().optional(),
    telegram: z.string().optional(),
    whatsapp: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    website: z.string().optional(),

    // Custom links
    customLinks: z.array(z.object({
        id: z.string(),
        name: z.string().min(1, "Name is required"),
        url: z.string().min(1, "URL is required"),
        icon: z.string().min(1, "Icon is required"),
    })).optional(),
})

type SocialMediaFormData = z.infer<typeof socialMediaSchema>

interface SocialMediaDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    college: College
    onSuccess: () => void
}

// Preset icons for custom links
const presetIcons = [
    { value: "globe", label: "Website", icon: Globe },
    { value: "facebook", label: "Facebook", icon: Facebook },
    { value: "linkedin", label: "LinkedIn", icon: Linkedin },
    { value: "message-circle", label: "WhatsApp", icon: MessageCircle },
    { value: "mail", label: "Email", icon: Mail },
    { value: "external-link", label: "External Link", icon: ExternalLink },
]

export function SocialMediaDialog({ open, onOpenChange, college, onSuccess }: SocialMediaDialogProps) {
    const [activeTab, setActiveTab] = useState<"preset" | "custom">("preset")

    const form = useForm<SocialMediaFormData>({
        resolver: zodResolver(socialMediaSchema),
        defaultValues: {
            facebook: "",
            linkedin: "",
            tiktok: "",
            telegram: "",
            whatsapp: "",
            email: "",
            phone: "",
            website: "",
            customLinks: [],
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "customLinks",
    })

    const updateMutation = useMutation({
        mutationFn: (data: SocialMediaLinks) =>
            CollegeService.updateCollege(college.id, { socialMedia: data }),
        onSuccess: () => {
            toast.success("Social media links updated successfully")
            onSuccess()
            onOpenChange(false)
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to update social media links")
        },
    })

    useEffect(() => {
        if (open && college.socialMedia) {
            const socialMedia = college.socialMedia as SocialMediaLinks
            form.reset({
                facebook: socialMedia.facebook || "",
                linkedin: socialMedia.linkedin || "",
                tiktok: socialMedia.tiktok || "",
                telegram: socialMedia.telegram || "",
                whatsapp: socialMedia.whatsapp || "",
                email: socialMedia.email || "",
                phone: socialMedia.phone || "",
                website: socialMedia.website || "",
                customLinks: socialMedia.customLinks || [],
            })
        } else if (open) {
            form.reset({
                facebook: "",
                linkedin: "",
                tiktok: "",
                telegram: "",
                whatsapp: "",
                email: "",
                phone: "",
                website: "",
                customLinks: [],
            })
        }
    }, [open, college.socialMedia, form])

    const handleSave = () => {
        const formData = form.getValues()

        // Filter out empty values
        const socialMediaData: SocialMediaLinks = {}

        Object.entries(formData).forEach(([key, value]) => {
            if (key === "customLinks") {
                if (value && Array.isArray(value) && value.length > 0) {
                    socialMediaData.customLinks = value
                }
            } else if (value && typeof value === "string" && value.trim() !== "") {
                socialMediaData[key as keyof SocialMediaLinks] = value.trim()
            }
        })

        updateMutation.mutate(socialMediaData)
    }

    const addCustomLink = () => {
        append({
            id: Date.now().toString(),
            name: "",
            url: "",
            icon: "globe",
        })
    }

    const removeCustomLink = (index: number) => {
        remove(index)
    }

    const getIconComponent = (iconName: string) => {
        const iconData = presetIcons.find(icon => icon.value === iconName)
        return iconData ? iconData.icon : Globe
    }

    const renderPresetTab = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="facebook"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2">
                                <Facebook className="h-4 w-4" />
                                Facebook
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="https://facebook.com/yourpage" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <FormField
                    control={form.control}
                    name="linkedin"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2">
                                <Linkedin className="h-4 w-4" />
                                LinkedIn
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="https://linkedin.com/company/yourcompany" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="whatsapp"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2">
                                <MessageCircle className="h-4 w-4" />
                                WhatsApp
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="+1234567890" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="telegram"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2">
                                <MessageCircle className="h-4 w-4" />
                                Telegram
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="https://t.me/yourchannel" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="tiktok"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                TikTok
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="https://tiktok.com/@yourprofile" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Email
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="contact@yourcollege.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                Phone
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="+1234567890" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                Website
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="https://yourcollege.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    )

    const renderCustomTab = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Custom Links</h3>
                <Button type="button" onClick={addCustomLink} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Custom Link
                </Button>
            </div>

            {fields.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">No custom links added yet</p>
                    <p className="text-xs">Click &quot;Add Custom Link&quot; to create custom social media links</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {fields.map((field, index) => (
                        <Card key={field.id}>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base">Custom Link {index + 1}</CardTitle>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => removeCustomLink(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-col-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name={`customLinks.${index}.name`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="WhatsApp Group 1" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name={`customLinks.${index}.url`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>URL</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://wa.me/group123" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name={`customLinks.${index}.icon`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Icon</FormLabel>
                                                <FormControl>
                                                    <div className="grid grid-cols-5 gap-2">
                                                        {presetIcons.map((iconData) => {
                                                            const IconComponent = iconData.icon
                                                            return (
                                                                <Button
                                                                    key={iconData.value}
                                                                    type="button"
                                                                    variant={field.value === iconData.value ? "default" : "outline"}
                                                                    size="sm"
                                                                    className="h-10 w-10 p-0"
                                                                    onClick={(e) => {
                                                                        e.preventDefault()
                                                                        field.onChange(iconData.value)
                                                                    }}
                                                                    title={iconData.label}
                                                                >
                                                                    <IconComponent className="h-4 w-4" />
                                                                </Button>
                                                            )
                                                        })}
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Manage Social Media Links</DialogTitle>
                    <DialogDescription>
                        Add social media links for your college. You can use preset platforms or create custom links.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {/* Tabs */}
                    <div className="flex space-x-1 mb-6">
                        <Button
                            type="button"
                            variant={activeTab === "preset" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setActiveTab("preset")}
                        >
                            Preset Platforms
                        </Button>
                        <Button
                            type="button"
                            variant={activeTab === "custom" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setActiveTab("custom")}
                        >
                            Custom Links
                        </Button>
                    </div>

                    <Form {...form}>
                        <form className="space-y-6">
                            {activeTab === "preset" ? renderPresetTab() : renderCustomTab()}
                        </form>
                    </Form>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSave}
                        disabled={updateMutation.isPending}
                    >
                        {updateMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 