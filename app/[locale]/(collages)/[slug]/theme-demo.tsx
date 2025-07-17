"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ThemeFormDialog } from "../../../../components/_sharedforms/theme/theme-form-dialog"
import type { College } from "@/types/Collage"

interface ThemeDemoProps {
    college: College
}

export function ThemeDemo({ college }: ThemeDemoProps) {
    const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false)

    // Apply theme to the demo component
    if (!college) {
        return <div>College not found</div>
    }
    const theme = college.theme || {}
    const demoStyle = {
        '--heading-color': theme.colors?.heading || '#133d85',
        '--subheading-color': theme.colors?.subHeading || '#ce7940',
        '--text-color': theme.colors?.text || '#333333',
        '--primary-color': theme.colors?.primary || '#3b82f6',
        '--secondary-color': theme.colors?.secondary || '#64748b',
        '--accent-color': theme.colors?.accent || '#f59e0b',
        '--background-color': theme.colors?.background || '#ffffff',
        '--surface-color': theme.colors?.surface || '#f8fafc',
        '--border-color': theme.colors?.border || '#e2e8f0',
        '--heading-font': theme.fonts?.heading || 'Poppins, sans-serif',
        '--body-font': theme.fonts?.body || 'Roboto, sans-serif',
        '--border-radius': theme.effects?.borderRadius || '0.5rem',
        '--shadow': theme.effects?.shadow || '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        '--transition': theme.effects?.transition || 'all 0.2s ease-in-out',
    } as React.CSSProperties

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Theme Configuration Demo</CardTitle>
                    <CardDescription>
                        See how your theme settings will look on your college page
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">Current Theme</h3>
                                <p className="text-sm text-gray-600">
                                    {Object.keys(theme).length > 0 ? 'Custom theme applied' : 'Default theme'}
                                </p>
                            </div>
                            <Button onClick={() => setIsThemeDialogOpen(true)}>
                                Configure Theme
                            </Button>
                        </div>

                        <Separator />

                        {/* Live Preview */}
                        <div className="space-y-4">
                            <h4 className="font-medium">Live Preview</h4>
                            <div
                                className="p-6 rounded-lg border"
                                style={demoStyle}
                            >
                                <div className="space-y-6">
                                    {/* Header Section */}
                                    <div className="text-center space-y-2">
                                        <h1
                                            className="font-bold"
                                            style={{
                                                color: 'var(--heading-color)',
                                                fontFamily: 'var(--heading-font)',
                                                fontSize: '2rem'
                                            }}
                                        >
                                            {college.name}
                                        </h1>
                                        <h2
                                            className="font-semibold"
                                            style={{
                                                color: 'var(--subheading-color)',
                                                fontFamily: 'var(--heading-font)',
                                                fontSize: '1.25rem'
                                            }}
                                        >
                                            Welcome to Our College
                                        </h2>
                                        <p
                                            style={{
                                                color: 'var(--text-color)',
                                                fontFamily: 'var(--body-font)',
                                                fontSize: '1rem'
                                            }}
                                        >
                                            Experience excellence in education with our comprehensive programs and dedicated faculty.
                                        </p>
                                    </div>

                                    {/* Features Section */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {[
                                            { title: "Academic Excellence", description: "Top-tier education programs" },
                                            { title: "Modern Facilities", description: "State-of-the-art learning environments" },
                                            { title: "Expert Faculty", description: "Experienced and dedicated teachers" }
                                        ].map((feature, index) => (
                                            <div
                                                key={index}
                                                className="p-4 rounded"
                                                style={{
                                                    backgroundColor: 'var(--surface-color)',
                                                    border: `1px solid var(--border-color)`,
                                                    borderRadius: 'var(--border-radius)',
                                                    boxShadow: 'var(--shadow)',
                                                    transition: 'var(--transition)'
                                                }}
                                            >
                                                <h3
                                                    className="font-semibold mb-2"
                                                    style={{
                                                        color: 'var(--heading-color)',
                                                        fontFamily: 'var(--heading-font)'
                                                    }}
                                                >
                                                    {feature.title}
                                                </h3>
                                                <p
                                                    style={{
                                                        color: 'var(--text-color)',
                                                        fontFamily: 'var(--body-font)',
                                                        fontSize: '0.875rem'
                                                    }}
                                                >
                                                    {feature.description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Call to Action */}
                                    <div className="text-center space-y-4">
                                        <div className="space-y-2">
                                            <Button
                                                size="lg"
                                                style={{
                                                    backgroundColor: 'var(--primary-color)',
                                                    color: '#ffffff',
                                                    borderRadius: 'var(--border-radius)',
                                                    boxShadow: 'var(--shadow)',
                                                    transition: 'var(--transition)'
                                                }}
                                            >
                                                Apply Now
                                            </Button>
                                            <Button
                                                variant="outline"
                                                style={{
                                                    borderColor: 'var(--secondary-color)',
                                                    color: 'var(--secondary-color)',
                                                    borderRadius: 'var(--border-radius)',
                                                    transition: 'var(--transition)'
                                                }}
                                            >
                                                Learn More
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        {[
                                            { label: "Students", value: "2,500+" },
                                            { label: "Programs", value: "50+" },
                                            { label: "Years", value: "25+" }
                                        ].map((stat, index) => (
                                            <div key={index}>
                                                <div
                                                    className="text-2xl font-bold"
                                                    style={{
                                                        color: 'var(--accent-color)',
                                                        fontFamily: 'var(--heading-font)'
                                                    }}
                                                >
                                                    {stat.value}
                                                </div>
                                                <div
                                                    className="text-sm"
                                                    style={{
                                                        color: 'var(--text-color)',
                                                        fontFamily: 'var(--body-font)'
                                                    }}
                                                >
                                                    {stat.label}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Theme Info */}
                        {Object.keys(theme).length > 0 && (
                            <div className="space-y-4">
                                <h4 className="font-medium">Current Theme Settings</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {theme.colors && (
                                        <div>
                                            <h5 className="text-sm font-medium mb-2">Colors</h5>
                                            <div className="space-y-1">
                                                {Object.entries(theme.colors).slice(0, 4).map(([key, value]) => (
                                                    <div key={key} className="flex items-center gap-2 text-xs">
                                                        <div
                                                            className="w-3 h-3 rounded border"
                                                            style={{ backgroundColor: value as string }}
                                                        />
                                                        <span className="font-mono">{key}: {String(value)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {theme.fonts && (
                                        <div>
                                            <h5 className="text-sm font-medium mb-2">Fonts</h5>
                                            <div className="space-y-1 text-xs">
                                                {Object.entries(theme.fonts).map(([key, value]) => (
                                                    <div key={key}>
                                                        <span className="font-medium">{key}:</span> {String(value)}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {theme.mode && (
                                    <div>
                                        <Badge variant="outline">
                                            Mode: {theme.mode}
                                        </Badge>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <ThemeFormDialog
                open={isThemeDialogOpen}
                onOpenChange={setIsThemeDialogOpen}
                college={college}
                onSuccess={() => {
                    setIsThemeDialogOpen(false)
                    // Refresh the page to see changes
                    window.location.reload()
                }}
            />
        </div>
    )
} 