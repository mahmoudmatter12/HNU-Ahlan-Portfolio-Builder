"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Palette, Eye } from "lucide-react"

interface ThemePreviewProps {
    theme: Record<string, any> | null
}

export function ThemePreview({ theme }: ThemePreviewProps) {
    if (!theme || Object.keys(theme).length === 0) {
        return (
            <Card className="border-dashed">
                <CardContent className="p-6">
                    <div className="text-center text-gray-500">
                        <Palette className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No theme configuration</p>
                        <p className="text-xs">Configure a theme to see preview</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const primaryColor = theme.colors?.primary || "#3b82f6"
    const secondaryColor = theme.colors?.secondary || "#64748b"
    const accentColor = theme.colors?.accent || "#8b5cf6"
    const backgroundColor = theme.colors?.background || "#ffffff"
    const textColor = theme.colors?.text || "#1f2937"

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Theme Preview
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Color Palette */}
                <div>
                    <h4 className="text-sm font-medium mb-2">Color Palette</h4>
                    <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-6 h-6 rounded border"
                                style={{ backgroundColor: primaryColor }}
                            />
                            <span className="text-xs">Primary</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div
                                className="w-6 h-6 rounded border"
                                style={{ backgroundColor: secondaryColor }}
                            />
                            <span className="text-xs">Secondary</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div
                                className="w-6 h-6 rounded border"
                                style={{ backgroundColor: accentColor }}
                            />
                            <span className="text-xs">Accent</span>
                        </div>
                    </div>
                </div>

                {/* Sample Components */}
                <div>
                    <h4 className="text-sm font-medium mb-2">Sample Components</h4>
                    <div
                        className="p-4 rounded-lg border"
                        style={{
                            backgroundColor: backgroundColor,
                            color: textColor
                        }}
                    >
                        <div className="space-y-3">
                            <h3
                                className="text-lg font-bold"
                                style={{ color: primaryColor }}
                            >
                                Sample Heading
                            </h3>
                            <p className="text-sm">
                                This is how your content will look with the current theme configuration.
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    style={{
                                        backgroundColor: primaryColor,
                                        borderColor: primaryColor
                                    }}
                                >
                                    Primary Button
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    style={{
                                        borderColor: secondaryColor,
                                        color: secondaryColor
                                    }}
                                >
                                    Secondary Button
                                </Button>
                            </div>
                            <div className="flex gap-2">
                                <Badge
                                    style={{
                                        backgroundColor: accentColor,
                                        color: "white"
                                    }}
                                >
                                    Accent Badge
                                </Badge>
                                <Badge variant="outline">Default Badge</Badge>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Theme Info */}
                <div>
                    <h4 className="text-sm font-medium mb-2">Theme Configuration</h4>
                    <div className="space-y-1 text-xs">
                        {theme.mode && (
                            <div className="flex justify-between">
                                <span>Mode:</span>
                                <Badge variant="outline" className="text-xs">
                                    {theme.mode}
                                </Badge>
                            </div>
                        )}
                        {theme.fonts && (
                            <div className="flex justify-between">
                                <span>Font Family:</span>
                                <span className="font-mono">{theme.fonts.family || "Default"}</span>
                            </div>
                        )}
                        {theme.colors && (
                            <div className="flex justify-between">
                                <span>Colors:</span>
                                <span>{Object.keys(theme.colors).length} configured</span>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
} 