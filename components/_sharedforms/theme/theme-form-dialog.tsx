"use client"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CollegeService } from "@/services/collage.service"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Loader2, Palette, Type, Eye, Settings, Sun, Moon, Sparkles, Check } from "lucide-react"
import type { College } from "@/types/Collage"
import { BORDER_RADIUS_PRESETS, FONT_SIZES, SHADOW_PRESETS, STORED_THEMES, SUPPORTED_FONTS, TRANSITION_PRESETS } from "@/constant"



// Theme schema
const themeSchema = z.object({
    colors: z.object({
        heading: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
        subHeading: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
        text: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
        primary: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
        secondary: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
        accent: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
        background: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
        surface: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
        border: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
    }),
    fonts: z.object({
        heading: z.string(),
        body: z.string(),
    }),
    typography: z.object({
        headingSize: z.string(),
        subHeadingSize: z.string(),
        bodySize: z.string(),
        smallSize: z.string(),
    }),
    spacing: z.object({
        sectionPadding: z.string(),
        elementSpacing: z.string(),
        containerMaxWidth: z.string(),
    }),
    effects: z.object({
        borderRadius: z.string(),
        shadow: z.string(),
        transition: z.string(),
    }),
    mode: z.enum(["light", "dark", "auto"]),
    enableAnimations: z.boolean(),
    enableGradients: z.boolean(),
    // Add support for dual themes
    lightTheme: z.object({
        colors: z.object({
            heading: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
            subHeading: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
            text: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
            primary: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
            secondary: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
            accent: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
            background: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
            surface: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
            border: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
        }),
    }).optional(),
    darkTheme: z.object({
        colors: z.object({
            heading: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
            subHeading: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
            text: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
            primary: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
            secondary: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
            accent: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
            background: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
            surface: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
            border: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
        }),
    }).optional(),
})

type ThemeFormData = z.infer<typeof themeSchema>

interface ThemeFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    college: College | null
    onSuccess?: () => void
}

// Color picker component
function ColorPicker({ value, onChange, label }: { value: string; onChange: (color: string) => void; label: string }) {
    return (
        <div className="space-y-2">
            <Label className="text-sm font-medium">{label}</Label>
            <div className="flex items-center gap-2">
                <div
                    className="w-8 h-8 rounded border-2 border-gray-300 cursor-pointer"
                    style={{ backgroundColor: value }}
                    onClick={() => {
                        const input = document.createElement('input')
                        input.type = 'color'
                        input.value = value
                        input.onchange = (e) => {
                            const target = e.target as HTMLInputElement
                            onChange(target.value)
                        }
                        input.click()
                    }}
                />
                <Input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="font-mono text-sm"
                    placeholder="#000000"
                />
            </div>
        </div>
    )
}

// Live preview component
function ThemePreview({ theme, isOldTheme = false }: { theme: ThemeFormData | Record<string, any>, isOldTheme?: boolean }) {
    // Provide fallback values for empty/null theme
    const safeTheme = {
        colors: {
            heading: theme?.colors?.heading || "#133d85",
            subHeading: theme?.colors?.subHeading || "#ce7940",
            text: theme?.colors?.text || "#333333",
            primary: theme?.colors?.primary || "#3b82f6",
            secondary: theme?.colors?.secondary || "#64748b",
            accent: theme?.colors?.accent || "#f59e0b",
            background: theme?.colors?.background || "#ffffff",
            surface: theme?.colors?.surface || "#f8fafc",
            border: theme?.colors?.border || "#e2e8f0",
        },
        fonts: {
            heading: theme?.fonts?.heading || "Poppins, sans-serif",
            body: theme?.fonts?.body || "Roboto, sans-serif",
        },
        typography: {
            headingSize: theme?.typography?.headingSize || "2xl",
            subHeadingSize: theme?.typography?.subHeadingSize || "xl",
            bodySize: theme?.typography?.bodySize || "base",
            smallSize: theme?.typography?.smallSize || "sm",
        },
        effects: {
            borderRadius: theme?.effects?.borderRadius || "0.5rem",
            shadow: theme?.effects?.shadow || "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
            transition: theme?.effects?.transition || "all 0.2s ease-in-out",
        },
    }

    const previewStyle = {
        '--heading-color': safeTheme.colors.heading,
        '--subheading-color': safeTheme.colors.subHeading,
        '--text-color': safeTheme.colors.text,
        '--primary-color': safeTheme.colors.primary,
        '--secondary-color': safeTheme.colors.secondary,
        '--accent-color': safeTheme.colors.accent,
        '--background-color': safeTheme.colors.background,
        '--surface-color': safeTheme.colors.surface,
        '--border-color': safeTheme.colors.border,
        '--heading-font': safeTheme.fonts.heading,
        '--body-font': safeTheme.fonts.body,
        '--border-radius': safeTheme.effects.borderRadius,
        '--shadow': safeTheme.effects.shadow,
        '--transition': safeTheme.effects.transition,
    } as React.CSSProperties

    return (
        <div className="space-y-4">
            <h3 className="text-4xl font-semibold">{isOldTheme ? "Old Theme Preview" : "New Theme Preview"}</h3>
            <div
                className="p-6 rounded-lg border"
                style={previewStyle}
            >
                <div className="space-y-4">
                    <div>
                        <h1
                            className="font-bold mb-2"
                            style={{
                                color: safeTheme.colors.heading,
                                fontFamily: safeTheme.fonts.heading,
                                fontSize: safeTheme.typography.headingSize === 'xs' ? '12px' :
                                    safeTheme.typography.headingSize === 'sm' ? '14px' :
                                        safeTheme.typography.headingSize === 'base' ? '16px' :
                                            safeTheme.typography.headingSize === 'lg' ? '18px' :
                                                safeTheme.typography.headingSize === 'xl' ? '20px' :
                                                    safeTheme.typography.headingSize === '2xl' ? '24px' :
                                                        safeTheme.typography.headingSize === '3xl' ? '30px' :
                                                            safeTheme.typography.headingSize === '4xl' ? '36px' :
                                                                safeTheme.typography.headingSize === '5xl' ? '48px' : '24px'
                            }}
                        >
                            Sample Heading
                        </h1>
                        <h2
                            className="font-semibold mb-2"
                            style={{
                                color: safeTheme.colors.subHeading,
                                fontFamily: safeTheme.fonts.heading,
                                fontSize: safeTheme.typography.subHeadingSize === 'xs' ? '12px' :
                                    safeTheme.typography.subHeadingSize === 'sm' ? '14px' :
                                        safeTheme.typography.subHeadingSize === 'base' ? '16px' :
                                            safeTheme.typography.subHeadingSize === 'lg' ? '18px' :
                                                safeTheme.typography.subHeadingSize === 'xl' ? '20px' :
                                                    safeTheme.typography.subHeadingSize === '2xl' ? '24px' :
                                                        safeTheme.typography.subHeadingSize === '3xl' ? '30px' :
                                                            safeTheme.typography.subHeadingSize === '4xl' ? '36px' :
                                                                safeTheme.typography.subHeadingSize === '5xl' ? '48px' : '18px'
                            }}
                        >
                            Sample Subheading
                        </h2>
                        <p
                            style={{
                                color: safeTheme.colors.text,
                                fontFamily: safeTheme.fonts.body,
                                fontSize: safeTheme.typography.bodySize === 'xs' ? '12px' :
                                    safeTheme.typography.bodySize === 'sm' ? '14px' :
                                        safeTheme.typography.bodySize === 'base' ? '16px' :
                                            safeTheme.typography.bodySize === 'lg' ? '18px' :
                                                safeTheme.typography.bodySize === 'xl' ? '20px' :
                                                    safeTheme.typography.bodySize === '2xl' ? '24px' :
                                                        safeTheme.typography.bodySize === '3xl' ? '30px' :
                                                            safeTheme.typography.bodySize === '4xl' ? '36px' :
                                                                safeTheme.typography.bodySize === '5xl' ? '48px' : '16px'
                            }}
                        >
                            This is a sample paragraph to demonstrate how your text will look with the selected theme settings.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <button
                            className="px-4 py-2 rounded font-medium"
                            style={{
                                backgroundColor: safeTheme.colors.primary,
                                color: '#ffffff',
                                borderRadius: safeTheme.effects.borderRadius,
                                boxShadow: safeTheme.effects.shadow,
                                transition: safeTheme.effects.transition
                            }}
                        >
                            Primary Button
                        </button>
                        <button
                            className="px-4 py-2 rounded font-medium"
                            style={{
                                backgroundColor: safeTheme.colors.secondary,
                                color: '#ffffff',
                                borderRadius: safeTheme.effects.borderRadius,
                                boxShadow: safeTheme.effects.shadow,
                                transition: safeTheme.effects.transition
                            }}
                        >
                            Secondary Button
                        </button>
                    </div>

                    <div
                        className="p-4 rounded"
                        style={{
                            backgroundColor: safeTheme.colors.surface,
                            border: `1px solid ${safeTheme.colors.border}`,
                            borderRadius: safeTheme.effects.borderRadius
                        }}
                    >
                        <p style={{ color: safeTheme.colors.text, fontFamily: safeTheme.fonts.body }}>
                            This is a sample card with surface background and border.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Theme card component for stored themes
function ThemeCard({
    theme,
    isSelected,
    onSelect
}: {
    theme: typeof STORED_THEMES[0];
    isSelected: boolean;
    onSelect: () => void;
}) {
    return (
        <Card
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${isSelected ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/50'
                }`}
            onClick={onSelect}
        >
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg">{theme.name}</CardTitle>
                        <CardDescription className="text-sm">{theme.description}</CardDescription>
                    </div>
                    {isSelected && (
                        <div className="w-6 h-6  rounded-full bg-black flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <div
                            className="w-8 h-8 rounded border-2 border-gray-300"
                            style={{ backgroundColor: theme.preview.primary }}
                        />
                        <div
                            className="w-8 h-8 rounded border-2 border-gray-300"
                            style={{ backgroundColor: theme.preview.secondary }}
                        />
                        <div
                            className="w-8 h-8 rounded border-2 border-gray-300"
                            style={{ backgroundColor: theme.preview.accent }}
                        />
                        <div
                            className="w-8 h-8 rounded border-2 border-gray-300"
                            style={{ backgroundColor: theme.preview.background }}
                        />
                        <div
                            className="w-8 h-8 rounded border-2 border-gray-300"
                            style={{ backgroundColor: theme.preview.surface }}
                        />
                    </div>
                    <div className="text-xs text-muted-foreground">
                        <div>Font: {theme.theme.fonts.heading.split(',')[0]}</div>
                        <div>Mode: {theme.theme.mode}</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export function ThemeFormDialog({ open, onOpenChange, college, onSuccess }: ThemeFormDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null)
    const queryClient = useQueryClient()

    const form = useForm<ThemeFormData>({
        resolver: zodResolver(themeSchema),
        defaultValues: {
            colors: {
                heading: "#133d85",
                subHeading: "#ce7940",
                text: "#333333",
                primary: "#3b82f6",
                secondary: "#64748b",
                accent: "#f59e0b",
                background: "#ffffff",
                surface: "#f8fafc",
                border: "#e2e8f0",
            },
            fonts: {
                heading: "Poppins, sans-serif",
                body: "Roboto, sans-serif",
            },
            typography: {
                headingSize: "2xl",
                subHeadingSize: "xl",
                bodySize: "base",
                smallSize: "sm",
            },
            spacing: {
                sectionPadding: "2rem",
                elementSpacing: "1rem",
                containerMaxWidth: "1200px",
            },
            effects: {
                borderRadius: "0.5rem",
                shadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                transition: "all 0.2s ease-in-out",
            },
            mode: "light",
            enableAnimations: true,
            enableGradients: false,
            lightTheme: {
                colors: {
                    heading: "#133d85",
                    subHeading: "#ce7940",
                    text: "#333333",
                    primary: "#3b82f6",
                    secondary: "#64748b",
                    accent: "#f59e0b",
                    background: "#ffffff",
                    surface: "#f8fafc",
                    border: "#e2e8f0",
                },
            },
            darkTheme: {
                colors: {
                    heading: "#f8fafc",
                    subHeading: "#cbd5e1",
                    text: "#94a3b8",
                    primary: "#3b82f6",
                    secondary: "#64748b",
                    accent: "#f59e0b",
                    background: "#0f172a",
                    surface: "#1e293b",
                    border: "#334155",
                },
            },
        },
    })

    // Reset form when dialog opens/closes or college changes
    useEffect(() => {
        if (open) {
            // Handle both cases: when college exists and when it's null (new collage)
            const currentTheme = college?.theme || {}
            form.reset({
                colors: {
                    heading: currentTheme.colors?.heading || "#133d85",
                    subHeading: currentTheme.colors?.subHeading || "#ce7940",
                    text: currentTheme.colors?.text || "#333333",
                    primary: currentTheme.colors?.primary || "#3b82f6",
                    secondary: currentTheme.colors?.secondary || "#64748b",
                    accent: currentTheme.colors?.accent || "#f59e0b",
                    background: currentTheme.colors?.background || "#ffffff",
                    surface: currentTheme.colors?.surface || "#f8fafc",
                    border: currentTheme.colors?.border || "#e2e8f0",
                },
                fonts: {
                    heading: currentTheme.fonts?.heading || "Poppins, sans-serif",
                    body: currentTheme.fonts?.body || "Roboto, sans-serif",
                },
                typography: {
                    headingSize: currentTheme.typography?.headingSize || "2xl",
                    subHeadingSize: currentTheme.typography?.subHeadingSize || "xl",
                    bodySize: currentTheme.typography?.bodySize || "base",
                    smallSize: currentTheme.typography?.smallSize || "sm",
                },
                spacing: {
                    sectionPadding: currentTheme.spacing?.sectionPadding || "2rem",
                    elementSpacing: currentTheme.spacing?.elementSpacing || "1rem",
                    containerMaxWidth: currentTheme.spacing?.containerMaxWidth || "1200px",
                },
                effects: {
                    borderRadius: currentTheme.effects?.borderRadius || "0.5rem",
                    shadow: currentTheme.effects?.shadow || "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                    transition: currentTheme.effects?.transition || "all 0.2s ease-in-out",
                },
                mode: currentTheme.mode || "light",
                enableAnimations: currentTheme.enableAnimations ?? true,
                enableGradients: currentTheme.enableGradients ?? false,
                lightTheme: currentTheme.lightTheme || {
                    colors: {
                        heading: "#133d85",
                        subHeading: "#ce7940",
                        text: "#333333",
                        primary: "#3b82f6",
                        secondary: "#64748b",
                        accent: "#f59e0b",
                        background: "#ffffff",
                        surface: "#f8fafc",
                        border: "#e2e8f0",
                    },
                },
                darkTheme: currentTheme.darkTheme || {
                    colors: {
                        heading: "#f8fafc",
                        subHeading: "#cbd5e1",
                        text: "#94a3b8",
                        primary: "#3b82f6",
                        secondary: "#64748b",
                        accent: "#f59e0b",
                        background: "#0f172a",
                        surface: "#1e293b",
                        border: "#334155",
                    },
                },
            })
        }
    }, [open, college, form])

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => CollegeService.updateCollege(id, data),
        onSuccess: () => {
            toast.success("Theme updated successfully")
            queryClient.invalidateQueries({ queryKey: ["college", college?.slug] })
            onSuccess?.()
            onOpenChange(false)
        },
        onError: (error) => {
            toast.error("Failed to update theme")
            console.error("Update error:", error)
        },
    })

    const onSubmit = async (data: ThemeFormData) => {
        if (!college) {
            setError("No college data available")
            return
        }

        setIsSubmitting(true)
        setError(null)

        try {
            const updateData = {
                ...college,
                theme: data,
            }

            await updateMutation.mutateAsync({ id: college.id, data: updateData })
        } catch (error) {
            setError("Failed to update theme")
        } finally {
            setIsSubmitting(false)
        }
    }

    const currentTheme = form.watch()
    const oldTheme = college?.theme || {}

    // Function to apply a stored theme
    const applyStoredTheme = (themeId: string) => {
        const storedTheme = STORED_THEMES.find(t => t.id === themeId)
        if (storedTheme) {
            form.reset({
                ...storedTheme.theme,
                mode: storedTheme.theme.mode as "light" | "dark" | "auto"
            })
            setSelectedThemeId(themeId)
            toast.success(`Applied ${storedTheme.name} theme`)
        }
    }

    // Function to check if current theme matches a stored theme
    const getCurrentThemeMatch = () => {
        const currentValues = form.getValues()
        return STORED_THEMES.find(theme =>
            JSON.stringify(theme.theme) === JSON.stringify(currentValues)
        )?.id || null
    }

    // Update selected theme when form changes
    useEffect(() => {
        const match = getCurrentThemeMatch()
        setSelectedThemeId(match)
    }, [form.watch()])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[1200px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-4xl font-semibold">
                        {college ? "Theme Configuration" : "New Collage Theme"}
                    </DialogTitle>
                    <DialogDescription>
                        {college
                            ? "Customize the appearance of your college page with colors, fonts, and styling options."
                            : "Set up the initial theme for your new collage with colors, fonts, and styling options."
                        }
                    </DialogDescription>
                </DialogHeader>

                {error && <p className="text-red-500">{error}</p>}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <Tabs defaultValue="themes" className="w-full">
                            <TabsList className="grid w-full grid-cols-6">
                                <TabsTrigger value="themes" className="flex items-center gap-2">
                                    <Sparkles className="h-4 w-4" />
                                    Themes
                                </TabsTrigger>
                                <TabsTrigger value="colors" className="flex items-center gap-2">
                                    <Palette className="h-4 w-4" />
                                    Colors
                                </TabsTrigger>
                                <TabsTrigger value="dual-themes" className="flex items-center gap-2">
                                    <Sun className="h-4 w-4" />
                                    Dual Themes
                                </TabsTrigger>
                                <TabsTrigger value="typography" className="flex items-center gap-2">
                                    <Type className="h-4 w-4" />
                                    Typography
                                </TabsTrigger>
                                <TabsTrigger value="layout" className="flex items-center gap-2">
                                    <Settings className="h-4 w-4" />
                                    Layout
                                </TabsTrigger>
                                <TabsTrigger value="effects" className="flex items-center gap-2">
                                    <Settings className="h-4 w-4" />
                                    Effects
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="themes" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Choose a Theme</CardTitle>
                                        <CardDescription>
                                            Select from our curated collection of professional themes or customize your own
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {STORED_THEMES.map((theme) => (
                                                <ThemeCard
                                                    key={theme.id}
                                                    theme={theme}
                                                    isSelected={selectedThemeId === theme.id}
                                                    onSelect={() => applyStoredTheme(theme.id)}
                                                />
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="colors" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Color Palette</CardTitle>
                                        <CardDescription>
                                            Choose colors for different elements of your college page
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <h4 className="font-semibold">Text Colors</h4>
                                                <ColorPicker
                                                    value={currentTheme.colors.heading}
                                                    onChange={(color) => form.setValue("colors.heading", color)}
                                                    label="Heading Color"
                                                />
                                                <ColorPicker
                                                    value={currentTheme.colors.subHeading}
                                                    onChange={(color) => form.setValue("colors.subHeading", color)}
                                                    label="Sub-Heading Color"
                                                />
                                                <ColorPicker
                                                    value={currentTheme.colors.text}
                                                    onChange={(color) => form.setValue("colors.text", color)}
                                                    label="Body Text Color"
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                <h4 className="font-semibold">UI Colors</h4>
                                                <ColorPicker
                                                    value={currentTheme.colors.primary}
                                                    onChange={(color) => form.setValue("colors.primary", color)}
                                                    label="Primary Color"
                                                />
                                                <ColorPicker
                                                    value={currentTheme.colors.secondary}
                                                    onChange={(color) => form.setValue("colors.secondary", color)}
                                                    label="Secondary Color"
                                                />
                                                <ColorPicker
                                                    value={currentTheme.colors.accent}
                                                    onChange={(color) => form.setValue("colors.accent", color)}
                                                    label="Accent Color"
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                <h4 className="font-semibold">Background Colors</h4>
                                                <ColorPicker
                                                    value={currentTheme.colors.background}
                                                    onChange={(color) => form.setValue("colors.background", color)}
                                                    label="Background Color"
                                                />
                                                <ColorPicker
                                                    value={currentTheme.colors.surface}
                                                    onChange={(color) => form.setValue("colors.surface", color)}
                                                    label="Surface Color"
                                                />
                                                <ColorPicker
                                                    value={currentTheme.colors.border}
                                                    onChange={(color) => form.setValue("colors.border", color)}
                                                    label="Border Color"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="dual-themes" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Dual Theme Configuration</CardTitle>
                                        <CardDescription>
                                            Configure separate color schemes for light and dark modes
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {/* Light Theme */}
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2">
                                                    <Sun className="h-5 w-5 text-yellow-500" />
                                                    <h4 className="font-semibold text-lg">Light Theme Colors</h4>
                                                </div>
                                                <div className="space-y-4">
                                                    <ColorPicker
                                                        value={currentTheme.lightTheme?.colors.heading || currentTheme.colors.heading}
                                                        onChange={(color) => form.setValue("lightTheme.colors.heading", color)}
                                                        label="Heading Color"
                                                    />
                                                    <ColorPicker
                                                        value={currentTheme.lightTheme?.colors.subHeading || currentTheme.colors.subHeading}
                                                        onChange={(color) => form.setValue("lightTheme.colors.subHeading", color)}
                                                        label="Sub-Heading Color"
                                                    />
                                                    <ColorPicker
                                                        value={currentTheme.lightTheme?.colors.text || currentTheme.colors.text}
                                                        onChange={(color) => form.setValue("lightTheme.colors.text", color)}
                                                        label="Body Text Color"
                                                    />
                                                    <ColorPicker
                                                        value={currentTheme.lightTheme?.colors.primary || currentTheme.colors.primary}
                                                        onChange={(color) => form.setValue("lightTheme.colors.primary", color)}
                                                        label="Primary Color"
                                                    />
                                                    <ColorPicker
                                                        value={currentTheme.lightTheme?.colors.secondary || currentTheme.colors.secondary}
                                                        onChange={(color) => form.setValue("lightTheme.colors.secondary", color)}
                                                        label="Secondary Color"
                                                    />
                                                    <ColorPicker
                                                        value={currentTheme.lightTheme?.colors.accent || currentTheme.colors.accent}
                                                        onChange={(color) => form.setValue("lightTheme.colors.accent", color)}
                                                        label="Accent Color"
                                                    />
                                                    <ColorPicker
                                                        value={currentTheme.lightTheme?.colors.background || currentTheme.colors.background}
                                                        onChange={(color) => form.setValue("lightTheme.colors.background", color)}
                                                        label="Background Color"
                                                    />
                                                    <ColorPicker
                                                        value={currentTheme.lightTheme?.colors.surface || currentTheme.colors.surface}
                                                        onChange={(color) => form.setValue("lightTheme.colors.surface", color)}
                                                        label="Surface Color"
                                                    />
                                                    <ColorPicker
                                                        value={currentTheme.lightTheme?.colors.border || currentTheme.colors.border}
                                                        onChange={(color) => form.setValue("lightTheme.colors.border", color)}
                                                        label="Border Color"
                                                    />
                                                </div>
                                            </div>

                                            {/* Dark Theme */}
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2">
                                                    <Moon className="h-5 w-5 text-blue-500" />
                                                    <h4 className="font-semibold text-lg">Dark Theme Colors</h4>
                                                </div>
                                                <div className="space-y-4">
                                                    <ColorPicker
                                                        value={currentTheme.darkTheme?.colors.heading || "#f8fafc"}
                                                        onChange={(color) => form.setValue("darkTheme.colors.heading", color)}
                                                        label="Heading Color"
                                                    />
                                                    <ColorPicker
                                                        value={currentTheme.darkTheme?.colors.subHeading || "#cbd5e1"}
                                                        onChange={(color) => form.setValue("darkTheme.colors.subHeading", color)}
                                                        label="Sub-Heading Color"
                                                    />
                                                    <ColorPicker
                                                        value={currentTheme.darkTheme?.colors.text || "#94a3b8"}
                                                        onChange={(color) => form.setValue("darkTheme.colors.text", color)}
                                                        label="Body Text Color"
                                                    />
                                                    <ColorPicker
                                                        value={currentTheme.darkTheme?.colors.primary || "#3b82f6"}
                                                        onChange={(color) => form.setValue("darkTheme.colors.primary", color)}
                                                        label="Primary Color"
                                                    />
                                                    <ColorPicker
                                                        value={currentTheme.darkTheme?.colors.secondary || "#64748b"}
                                                        onChange={(color) => form.setValue("darkTheme.colors.secondary", color)}
                                                        label="Secondary Color"
                                                    />
                                                    <ColorPicker
                                                        value={currentTheme.darkTheme?.colors.accent || "#f59e0b"}
                                                        onChange={(color) => form.setValue("darkTheme.colors.accent", color)}
                                                        label="Accent Color"
                                                    />
                                                    <ColorPicker
                                                        value={currentTheme.darkTheme?.colors.background || "#0f172a"}
                                                        onChange={(color) => form.setValue("darkTheme.colors.background", color)}
                                                        label="Background Color"
                                                    />
                                                    <ColorPicker
                                                        value={currentTheme.darkTheme?.colors.surface || "#1e293b"}
                                                        onChange={(color) => form.setValue("darkTheme.colors.surface", color)}
                                                        label="Surface Color"
                                                    />
                                                    <ColorPicker
                                                        value={currentTheme.darkTheme?.colors.border || "#334155"}
                                                        onChange={(color) => form.setValue("darkTheme.colors.border", color)}
                                                        label="Border Color"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-semibold">Theme Mode</h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        Choose how the dual themes should be applied
                                                    </p>
                                                </div>
                                                <FormField
                                                    control={form.control}
                                                    name="mode"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Select onValueChange={field.onChange} value={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className="w-48">
                                                                        <SelectValue placeholder="Select theme mode" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="light">
                                                                        <div className="flex items-center gap-2">
                                                                            <Sun className="h-4 w-4" />
                                                                            Light Mode Only
                                                                        </div>
                                                                    </SelectItem>
                                                                    <SelectItem value="dark">
                                                                        <div className="flex items-center gap-2">
                                                                            <Moon className="h-4 w-4" />
                                                                            Dark Mode Only
                                                                        </div>
                                                                    </SelectItem>
                                                                    <SelectItem value="auto">
                                                                        <div className="flex items-center gap-2">
                                                                            <Settings className="h-4 w-4" />
                                                                            Auto (System)
                                                                        </div>
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="typography" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Typography Settings</CardTitle>
                                        <CardDescription>
                                            Configure fonts and text sizes for your college page
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <h4 className="font-semibold">Font Selection</h4>
                                                <FormField
                                                    control={form.control}
                                                    name="fonts.heading"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Heading Font</FormLabel>
                                                            <Select onValueChange={field.onChange} value={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select heading font" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {SUPPORTED_FONTS.map((font) => (
                                                                        <SelectItem key={font.value} value={font.value}>
                                                                            {font.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="fonts.body"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Body Font</FormLabel>
                                                            <Select onValueChange={field.onChange} value={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select body font" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {SUPPORTED_FONTS.map((font) => (
                                                                        <SelectItem key={font.value} value={font.value}>
                                                                            {font.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                <h4 className="font-semibold">Font Sizes</h4>
                                                <FormField
                                                    control={form.control}
                                                    name="typography.headingSize"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Heading Size</FormLabel>
                                                            <Select onValueChange={field.onChange} value={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select heading size" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {FONT_SIZES.map((size) => (
                                                                        <SelectItem key={size.value} value={size.value}>
                                                                            {size.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="typography.subHeadingSize"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Sub-Heading Size</FormLabel>
                                                            <Select onValueChange={field.onChange} value={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select sub-heading size" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {FONT_SIZES.map((size) => (
                                                                        <SelectItem key={size.value} value={size.value}>
                                                                            {size.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="typography.bodySize"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Body Text Size</FormLabel>
                                                            <Select onValueChange={field.onChange} value={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select body text size" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {FONT_SIZES.map((size) => (
                                                                        <SelectItem key={size.value} value={size.value}>
                                                                            {size.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="layout" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Layout & Spacing</CardTitle>
                                        <CardDescription>
                                            Configure spacing and layout settings
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <h4 className="font-semibold">Spacing</h4>
                                                <FormField
                                                    control={form.control}
                                                    name="spacing.sectionPadding"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Section Padding</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="2rem" {...field} />
                                                            </FormControl>
                                                            <FormDescription>
                                                                Padding for sections (e.g., 2rem, 32px)
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="spacing.elementSpacing"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Element Spacing</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="1rem" {...field} />
                                                            </FormControl>
                                                            <FormDescription>
                                                                Spacing between elements (e.g., 1rem, 16px)
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="spacing.containerMaxWidth"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Container Max Width</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="1200px" {...field} />
                                                            </FormControl>
                                                            <FormDescription>
                                                                Maximum width of the main container
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                <h4 className="font-semibold">Theme Mode</h4>
                                                <FormField
                                                    control={form.control}
                                                    name="mode"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Theme Mode</FormLabel>
                                                            <Select onValueChange={field.onChange} value={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select theme mode" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="light">
                                                                        <div className="flex items-center gap-2">
                                                                            <Sun className="h-4 w-4" />
                                                                            Light Mode
                                                                        </div>
                                                                    </SelectItem>
                                                                    <SelectItem value="dark">
                                                                        <div className="flex items-center gap-2">
                                                                            <Moon className="h-4 w-4" />
                                                                            Dark Mode
                                                                        </div>
                                                                    </SelectItem>
                                                                    <SelectItem value="auto">
                                                                        <div className="flex items-center gap-2">
                                                                            <Settings className="h-4 w-4" />
                                                                            Auto (System)
                                                                        </div>
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <div className="space-y-4">
                                                    <FormField
                                                        control={form.control}
                                                        name="enableAnimations"
                                                        render={({ field }) => (
                                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                                <div className="space-y-0.5">
                                                                    <FormLabel className="text-base">
                                                                        Enable Animations
                                                                    </FormLabel>
                                                                    <FormDescription>
                                                                        Enable smooth animations and transitions
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
                                                    <FormField
                                                        control={form.control}
                                                        name="enableGradients"
                                                        render={({ field }) => (
                                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                                <div className="space-y-0.5">
                                                                    <FormLabel className="text-base">
                                                                        Enable Gradients
                                                                    </FormLabel>
                                                                    <FormDescription>
                                                                        Use gradient backgrounds for enhanced visual appeal
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
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="effects" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Visual Effects</CardTitle>
                                        <CardDescription>
                                            Configure border radius, shadows, and transitions
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <h4 className="font-semibold">Border & Shadows</h4>
                                                <FormField
                                                    control={form.control}
                                                    name="effects.borderRadius"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Border Radius</FormLabel>
                                                            <FormControl>
                                                                <Select onValueChange={field.onChange} value={field.value}>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select border radius" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {BORDER_RADIUS_PRESETS.map((preset) => (
                                                                            <SelectItem key={preset.value} value={preset.value}>
                                                                                {preset.label}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </FormControl>
                                                            <FormDescription>
                                                                Border radius for cards and buttons (e.g., 0.5rem, 8px)
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="effects.shadow"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Shadow</FormLabel>
                                                            <FormControl>
                                                                <Select onValueChange={field.onChange} value={field.value}>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select shadow" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {SHADOW_PRESETS.map((preset) => (
                                                                            <SelectItem key={preset.value} value={preset.value}>
                                                                                {preset.label}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </FormControl>
                                                            <FormDescription>
                                                                CSS box-shadow value
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                <h4 className="font-semibold">Transitions</h4>
                                                <FormField
                                                    control={form.control}
                                                    name="effects.transition"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Transition</FormLabel>
                                                            <FormControl>
                                                                <Select onValueChange={field.onChange} value={field.value}>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select transition" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {TRANSITION_PRESETS.map((preset) => (
                                                                            <SelectItem key={preset.value} value={preset.value}>
                                                                                {preset.label}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </FormControl>
                                                            <FormDescription>
                                                                CSS transition value for smooth animations
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>

                        <Separator />
                        {/* Preview */}
                        <div className="flex gap-4">
                            <div className="w-1/2">
                                {/* new selected theme preview */}
                                <ThemePreview theme={currentTheme} />
                            </div>
                            <div className="w-1/2">
                                {/* old selected theme preview */}
                                {college ? (
                                    <ThemePreview theme={oldTheme} isOldTheme={true} />
                                ) : (
                                    <div className="space-y-4">
                                        <h3 className="text-4xl font-semibold">New Collage</h3>
                                        <div className="p-6 rounded-lg border bg-muted/50">
                                            <p className="text-muted-foreground">
                                                This is a new collage. The theme will be applied when you save.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

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
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Theme
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
} 