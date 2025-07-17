'use client'
import { College } from '@/types/Collage';
import { CollegeService } from '@/services/collage-service';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { useCurrentUser } from '@/context/userContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeFormDialog } from "@/components/_sharedforms/theme/theme-form-dialog"
import {
    Palette,
    Type,
    Settings,
    Sun,
    Moon,
    Sparkles,
    Eye,
    Edit,
    CheckCircle,
    AlertCircle,
    Info,
    Zap,
    Layout,
    Layers
} from "lucide-react"

function CollegeDemoPage() {
    const { slug } = useParams()
    const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false)
    const { data: college } = useQuery({
        queryKey: ['college', slug],
        queryFn: () => CollegeService.getCollegeBySlug(slug as string)
    })
    const user = useCurrentUser()

    if (!user || user.userType !== 'ADMIN') {
        return <div>You are not authorized to access this page</div>
    }
    if (!college) {
        return <div>Loading...</div>
    }

    const theme = college.theme || {}
    const hasTheme = Object.keys(theme).length > 0

    // Apply theme to the demo component
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

    // Helper function to get font size in pixels
    const getFontSize = (size: string) => {
        const sizes: Record<string, string> = {
            'xs': '12px', 'sm': '14px', 'base': '16px', 'lg': '18px', 'xl': '20px',
            '2xl': '24px', '3xl': '30px', '4xl': '36px', '5xl': '48px'
        }
        return sizes[size] || '16px'
    }

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Theme Demo - {college.name}</h1>
                    <p className="text-muted-foreground">
                        Preview and configure your college theme settings
                    </p>
                </div>
                <Button onClick={() => setIsThemeDialogOpen(true)} size="lg">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Theme
                </Button>
            </div>

            <Tabs defaultValue="preview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="preview" className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Preview
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Settings
                    </TabsTrigger>
                    <TabsTrigger value="indicators" className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Indicators
                    </TabsTrigger>
                    <TabsTrigger value="comparison" className="flex items-center gap-2">
                        <Layers className="h-4 w-4" />
                        Comparison
                    </TabsTrigger>
                </TabsList>

                {/* Preview Tab */}
                <TabsContent value="preview" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="h-5 w-5" />
                                Live Theme Preview
                            </CardTitle>
                            <CardDescription>
                                See how your theme settings will look on your college page
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div
                                className="p-8 rounded-lg border min-h-[600px]"
                                style={demoStyle}
                            >
                                <div className="space-y-8">
                                    {/* Header Section */}
                                    <div className="text-center space-y-4">
                                        <h1
                                            className="font-bold"
                                            style={{
                                                color: 'var(--heading-color)',
                                                fontFamily: 'var(--heading-font)',
                                                fontSize: getFontSize(theme.typography?.headingSize || '2xl')
                                            }}
                                        >
                                            {college.name}
                                        </h1>
                                        <h2
                                            className="font-semibold"
                                            style={{
                                                color: 'var(--subheading-color)',
                                                fontFamily: 'var(--heading-font)',
                                                fontSize: getFontSize(theme.typography?.subHeadingSize || 'xl')
                                            }}
                                        >
                                            Welcome to Our College
                                        </h2>
                                        <p
                                            style={{
                                                color: 'var(--text-color)',
                                                fontFamily: 'var(--body-font)',
                                                fontSize: getFontSize(theme.typography?.bodySize || 'base')
                                            }}
                                        >
                                            Experience excellence in education with our comprehensive programs and dedicated faculty.
                                        </p>
                                    </div>

                                    {/* Features Section */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[
                                            { title: "Academic Excellence", description: "Top-tier education programs" },
                                            { title: "Modern Facilities", description: "State-of-the-art learning environments" },
                                            { title: "Expert Faculty", description: "Experienced and dedicated teachers" }
                                        ].map((feature, index) => (
                                            <div
                                                key={index}
                                                className="p-6 rounded"
                                                style={{
                                                    backgroundColor: 'var(--surface-color)',
                                                    border: `1px solid var(--border-color)`,
                                                    borderRadius: 'var(--border-radius)',
                                                    boxShadow: 'var(--shadow)',
                                                    transition: 'var(--transition)'
                                                }}
                                            >
                                                <h3
                                                    className="font-semibold mb-3"
                                                    style={{
                                                        color: 'var(--heading-color)',
                                                        fontFamily: 'var(--heading-font)',
                                                        fontSize: getFontSize(theme.typography?.subHeadingSize || 'lg')
                                                    }}
                                                >
                                                    {feature.title}
                                                </h3>
                                                <p
                                                    style={{
                                                        color: 'var(--text-color)',
                                                        fontFamily: 'var(--body-font)',
                                                        fontSize: getFontSize(theme.typography?.bodySize || 'base')
                                                    }}
                                                >
                                                    {feature.description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Call to Action */}
                                    <div className="text-center space-y-6">
                                        <div className="space-y-4">
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
                                    <div className="grid grid-cols-3 gap-6 text-center">
                                        {[
                                            { label: "Students", value: "2,500+" },
                                            { label: "Programs", value: "50+" },
                                            { label: "Years", value: "25+" }
                                        ].map((stat, index) => (
                                            <div key={index}>
                                                <div
                                                    className="text-3xl font-bold"
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
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="h-5 w-5" />
                                Current Theme Settings
                            </CardTitle>
                            <CardDescription>
                                Detailed view of all configured theme properties
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {hasTheme ? (
                                <div className="space-y-6">
                                    {/* Colors */}
                                    {theme.colors && (
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                                <Palette className="h-4 w-4" />
                                                Colors
                                            </h3>
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                {Object.entries(theme.colors).map(([key, value]) => (
                                                    <div key={key} className="flex items-center gap-3 p-3 border rounded-lg">
                                                        <div
                                                            className="w-6 h-6 rounded border-2 border-gray-300"
                                                            style={{ backgroundColor: value as string }}
                                                        />
                                                        <div>
                                                            <div className="text-sm font-medium">{key}</div>
                                                            <div className="text-xs font-mono text-muted-foreground">
                                                                {String(value)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Fonts */}
                                    {theme.fonts && (
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                                <Type className="h-4 w-4" />
                                                Typography
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-3">
                                                    <h4 className="font-medium">Fonts</h4>
                                                    {Object.entries(theme.fonts).map(([key, value]) => (
                                                        <div key={key} className="flex justify-between items-center p-3 border rounded-lg">
                                                            <span className="text-sm font-medium">{key}</span>
                                                            <span className="text-sm font-mono">{String(value)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                {theme.typography && (
                                                    <div className="space-y-3">
                                                        <h4 className="font-medium">Font Sizes</h4>
                                                        {Object.entries(theme.typography).map(([key, value]) => (
                                                            <div key={key} className="flex justify-between items-center p-3 border rounded-lg">
                                                                <span className="text-sm font-medium">{key}</span>
                                                                <span className="text-sm font-mono">{String(value)} ({getFontSize(String(value))})</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Layout & Effects */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            <Layout className="h-4 w-4" />
                                            Layout & Effects
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {theme.spacing && (
                                                <div className="space-y-3">
                                                    <h4 className="font-medium">Spacing</h4>
                                                    {Object.entries(theme.spacing).map(([key, value]) => (
                                                        <div key={key} className="flex justify-between items-center p-3 border rounded-lg">
                                                            <span className="text-sm font-medium">{key}</span>
                                                            <span className="text-sm font-mono">{String(value)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {theme.effects && (
                                                <div className="space-y-3">
                                                    <h4 className="font-medium">Effects</h4>
                                                    {Object.entries(theme.effects).map(([key, value]) => (
                                                        <div key={key} className="flex justify-between items-center p-3 border rounded-lg">
                                                            <span className="text-sm font-medium">{key}</span>
                                                            <span className="text-sm font-mono max-w-[200px] truncate" title={String(value)}>
                                                                {String(value)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Theme Mode & Options */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            <Zap className="h-4 w-4" />
                                            Theme Options
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {theme.mode && (
                                                <div className="flex items-center gap-3 p-3 border rounded-lg">
                                                    {theme.mode === 'light' ? <Sun className="h-4 w-4" /> :
                                                        theme.mode === 'dark' ? <Moon className="h-4 w-4" /> :
                                                            <Settings className="h-4 w-4" />}
                                                    <div>
                                                        <div className="text-sm font-medium">Mode</div>
                                                        <div className="text-sm text-muted-foreground">{theme.mode}</div>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-3 p-3 border rounded-lg">
                                                <div>
                                                    <div className="text-sm font-medium">Animations</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {theme.enableAnimations ? 'Enabled' : 'Disabled'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 border rounded-lg">
                                                <div>
                                                    <div className="text-sm font-medium">Gradients</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {theme.enableGradients ? 'Enabled' : 'Disabled'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dual Themes */}
                                    {(theme.lightTheme || theme.darkTheme) && (
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                                <Sparkles className="h-4 w-4" />
                                                Dual Themes
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {theme.lightTheme && (
                                                    <div className="space-y-3">
                                                        <h4 className="font-medium flex items-center gap-2">
                                                            <Sun className="h-4 w-4" />
                                                            Light Theme Colors
                                                        </h4>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {Object.entries(theme.lightTheme.colors).map(([key, value]) => (
                                                                <div key={key} className="flex items-center gap-2 p-2 border rounded">
                                                                    <div
                                                                        className="w-4 h-4 rounded border"
                                                                        style={{ backgroundColor: value as string }}
                                                                    />
                                                                    <span className="text-xs font-mono">{key}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {theme.darkTheme && (
                                                    <div className="space-y-3">
                                                        <h4 className="font-medium flex items-center gap-2">
                                                            <Moon className="h-4 w-4" />
                                                            Dark Theme Colors
                                                        </h4>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {Object.entries(theme.darkTheme.colors).map(([key, value]) => (
                                                                <div key={key} className="flex items-center gap-2 p-2 border rounded">
                                                                    <div
                                                                        className="w-4 h-4 rounded border"
                                                                        style={{ backgroundColor: value as string }}
                                                                    />
                                                                    <span className="text-xs font-mono">{key}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-medium mb-2">No Theme Configured</h3>
                                    <p className="text-muted-foreground mb-4">
                                        This college is using the default theme. Click &quot;Edit Theme&quot; to customize the appearance.
                                    </p>
                                    <Button onClick={() => setIsThemeDialogOpen(true)}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Configure Theme
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Indicators Tab */}
                <TabsContent value="indicators" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5" />
                                Theme Configuration Indicators
                            </CardTitle>
                            <CardDescription>
                                Visual indicators showing what theme properties are configured
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {/* Configuration Status */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className={`p-4 rounded-lg border ${hasTheme ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                                        <div className="flex items-center gap-3">
                                            {hasTheme ? <CheckCircle className="h-5 w-5 text-green-600" /> : <AlertCircle className="h-5 w-5 text-gray-400" />}
                                            <div>
                                                <div className="font-medium">Theme Status</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {hasTheme ? 'Configured' : 'Default'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`p-4 rounded-lg border ${theme.colors ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                                        <div className="flex items-center gap-3">
                                            {theme.colors ? <CheckCircle className="h-5 w-5 text-green-600" /> : <AlertCircle className="h-5 w-5 text-gray-400" />}
                                            <div>
                                                <div className="font-medium">Colors</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {theme.colors ? `${Object.keys(theme.colors).length} colors` : 'Not set'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`p-4 rounded-lg border ${theme.fonts ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                                        <div className="flex items-center gap-3">
                                            {theme.fonts ? <CheckCircle className="h-5 w-5 text-green-600" /> : <AlertCircle className="h-5 w-5 text-gray-400" />}
                                            <div>
                                                <div className="font-medium">Typography</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {theme.fonts ? 'Configured' : 'Default fonts'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`p-4 rounded-lg border ${theme.effects ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                                        <div className="flex items-center gap-3">
                                            {theme.effects ? <CheckCircle className="h-5 w-5 text-green-600" /> : <AlertCircle className="h-5 w-5 text-gray-400" />}
                                            <div>
                                                <div className="font-medium">Effects</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {theme.effects ? 'Shadows & transitions' : 'Default effects'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`p-4 rounded-lg border ${theme.lightTheme && theme.darkTheme ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                                        <div className="flex items-center gap-3">
                                            {theme.lightTheme && theme.darkTheme ? <CheckCircle className="h-5 w-5 text-green-600" /> : <AlertCircle className="h-5 w-5 text-gray-400" />}
                                            <div>
                                                <div className="font-medium">Dual Themes</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {theme.lightTheme && theme.darkTheme ? 'Light & Dark' : 'Single theme'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`p-4 rounded-lg border ${theme.mode ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                                        <div className="flex items-center gap-3">
                                            {theme.mode ? <CheckCircle className="h-5 w-5 text-green-600" /> : <AlertCircle className="h-5 w-5 text-gray-400" />}
                                            <div>
                                                <div className="font-medium">Theme Mode</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {theme.mode || 'Default'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Configuration Summary */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Configuration Summary</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm">Total Properties:</span>
                                                <Badge variant="outline">{Object.keys(theme).length}</Badge>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm">Colors Configured:</span>
                                                <Badge variant="outline">{theme.colors ? Object.keys(theme.colors).length : 0}</Badge>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm">Fonts Configured:</span>
                                                <Badge variant="outline">{theme.fonts ? Object.keys(theme.fonts).length : 0}</Badge>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm">Effects Configured:</span>
                                                <Badge variant="outline">{theme.effects ? Object.keys(theme.effects).length : 0}</Badge>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm">Dual Themes:</span>
                                                <Badge variant="outline">{theme.lightTheme && theme.darkTheme ? 'Yes' : 'No'}</Badge>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm">Animations:</span>
                                                <Badge variant={theme.enableAnimations ? 'default' : 'secondary'}>
                                                    {theme.enableAnimations ? 'Enabled' : 'Disabled'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Comparison Tab */}
                <TabsContent value="comparison" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Layers className="h-5 w-5" />
                                Theme Comparison
                            </CardTitle>
                            <CardDescription>
                                Compare your current theme with default settings
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Current Theme */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        Current Theme
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="p-4 border rounded-lg">
                                            <h4 className="font-medium mb-2">Colors</h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                {Object.entries(theme.colors || {}).slice(0, 6).map(([key, value]) => (
                                                    <div key={key} className="flex items-center gap-2">
                                                        <div
                                                            className="w-3 h-3 rounded border"
                                                            style={{ backgroundColor: value as string }}
                                                        />
                                                        <span className="text-xs">{key}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="p-4 border rounded-lg">
                                            <h4 className="font-medium mb-2">Fonts</h4>
                                            <div className="space-y-1">
                                                {Object.entries(theme.fonts || {}).map(([key, value]) => (
                                                    <div key={key} className="flex justify-between text-sm">
                                                        <span>{key}:</span>
                                                        <span className="font-mono">{String(value)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Default Theme */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <Info className="h-4 w-4 text-blue-600" />
                                        Default Theme
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="p-4 border rounded-lg bg-gray-50">
                                            <h4 className="font-medium mb-2">Colors</h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                {[
                                                    { key: 'heading', value: '#133d85' },
                                                    { key: 'subHeading', value: '#ce7940' },
                                                    { key: 'text', value: '#333333' },
                                                    { key: 'primary', value: '#3b82f6' },
                                                    { key: 'secondary', value: '#64748b' },
                                                    { key: 'accent', value: '#f59e0b' }
                                                ].map(({ key, value }) => (
                                                    <div key={key} className="flex items-center gap-2">
                                                        <div
                                                            className="w-3 h-3 rounded border"
                                                            style={{ backgroundColor: value }}
                                                        />
                                                        <span className="text-xs">{key}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="p-4 border rounded-lg bg-gray-50">
                                            <h4 className="font-medium mb-2">Fonts</h4>
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-sm">
                                                    <span>heading:</span>
                                                    <span className="font-mono">Poppins, sans-serif</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>body:</span>
                                                    <span className="font-mono">Roboto, sans-serif</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Theme Form Dialog */}
            <ThemeFormDialog
                open={isThemeDialogOpen}
                onOpenChange={setIsThemeDialogOpen}
                college={college as College}
                onSuccess={() => {
                    setIsThemeDialogOpen(false)
                    // Refresh the page to see changes
                    window.location.reload()
                }}
            />
        </div>
    )
}

export default CollegeDemoPage