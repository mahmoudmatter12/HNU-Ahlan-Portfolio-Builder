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
import { GalleryFormDialog } from "@/components/_sharedforms/gallery/gallery-form-dialog"
import { GalleryPreview } from "@/components/_sharedforms/gallery/gallery-preview"
import {
    Image as ImageIcon,
    Calendar,
    FileText,
    Edit,
    Eye,
    Plus,
    ArrowLeft,
    ExternalLink
} from "lucide-react"
import Link from "next/link"
import { useLocale } from "next-intl"
import type { GalleryData } from "@/types/Collage"
import Image from 'next/image';

function GalleryDemoPage() {
    const { slug } = useParams()
    const locale = useLocale()
    const [isGalleryDialogOpen, setIsGalleryDialogOpen] = useState(false)
    const { data: college } = useQuery({
        queryKey: ['college', slug],
        queryFn: () => CollegeService.getCollegeBySlug(slug as string)
    })
    const user = useCurrentUser()

    if (!user || user.userType !== 'SUPERADMIN') {
        return <div>You are not authorized to access this page</div>
    }
    if (!college) {
        return <div>Loading...</div>
    }

    const galleryData = college.galleryImages as GalleryData
    const events = galleryData?.events || []

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/${locale}/admin/dashboard/collages/${slug}`}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to College
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Gallery Demo - {college.name}</h1>
                        <p className="text-muted-foreground">
                            Preview and manage your college gallery events
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" asChild>
                        <Link href={`/${locale}/${college.slug}`} target="_blank">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Public Page
                        </Link>
                    </Button>
                    <Button onClick={() => setIsGalleryDialogOpen(true)} size="lg">
                        <Edit className="h-4 w-4 mr-2" />
                        Manage Gallery
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="preview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="preview" className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Gallery Preview
                    </TabsTrigger>
                    <TabsTrigger value="events" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Events ({events.length})
                    </TabsTrigger>
                    <TabsTrigger value="manage" className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        Management
                    </TabsTrigger>
                </TabsList>

                {/* Gallery Preview Tab */}
                <TabsContent value="preview" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="h-5 w-5" />
                                Gallery Preview
                            </CardTitle>
                            <CardDescription>
                                See how your gallery will appear on the public page
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {events.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                    <h3 className="text-lg font-semibold mb-2">No Gallery Events</h3>
                                    <p className="text-sm mb-4">Create your first gallery event to showcase your college activities</p>
                                    <Button onClick={() => setIsGalleryDialogOpen(true)}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create First Event
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {events.map((event, eventIndex) => (
                                        <div key={eventIndex} className="space-y-4">
                                            <div className="text-center space-y-2">
                                                <h2 className="text-2xl font-bold text-gray-900">{event.eventName}</h2>
                                                <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        {event.eventDate}
                                                    </div>
                                                    <Badge variant="secondary">{event.images.length} images</Badge>
                                                </div>
                                                {event.description && (
                                                    <p className="text-gray-600 max-w-2xl mx-auto">{event.description}</p>
                                                )}
                                            </div>

                                            {event.images.length > 0 && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {event.images.map((image, imageIndex) => (
                                                        <div key={imageIndex} className="group relative">
                                                            <div className="aspect-square rounded-lg overflow-hidden border bg-gray-100 shadow-sm">
                                                                <Image
                                                                    fill
                                                                    src={image.url}
                                                                    alt={image.description || `${event.eventName} - Image ${imageIndex + 1}`}
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                                />
                                                            </div>
                                                            {image.description && (
                                                                <div className="mt-2">
                                                                    <p className="text-sm text-gray-600 text-center">{image.description}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {eventIndex < events.length - 1 && <Separator />}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Events Tab */}
                <TabsContent value="events" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Gallery Events
                            </CardTitle>
                            <CardDescription>
                                Overview of all gallery events and their details
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <GalleryPreview
                                galleryData={galleryData}
                                onEdit={() => setIsGalleryDialogOpen(true)}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Management Tab */}
                <TabsContent value="manage" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Edit className="h-5 w-5" />
                                Gallery Management
                            </CardTitle>
                            <CardDescription>
                                Manage your gallery events, upload images, and organize content
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Card>
                                        <CardContent className="p-6 text-center">
                                            <div className="text-3xl font-bold text-blue-600 mb-2">{events.length}</div>
                                            <div className="text-sm text-gray-600">Total Events</div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="p-6 text-center">
                                            <div className="text-3xl font-bold text-green-600 mb-2">
                                                {events.reduce((total, event) => total + event.images.length, 0)}
                                            </div>
                                            <div className="text-sm text-gray-600">Total Images</div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="p-6 text-center">
                                            <div className="text-3xl font-bold text-purple-600 mb-2">
                                                {events.length > 0 ? Math.round(events.reduce((total, event) => total + event.images.length, 0) / events.length) : 0}
                                            </div>
                                            <div className="text-sm text-gray-600">Avg Images/Event</div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="text-center space-y-4">
                                    <Button size="lg" onClick={() => setIsGalleryDialogOpen(true)}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Open Gallery Manager
                                    </Button>
                                    <p className="text-sm text-gray-600">
                                        Create events, upload images, and organize your gallery content
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Gallery Form Dialog */}
            <GalleryFormDialog
                open={isGalleryDialogOpen}
                onOpenChange={setIsGalleryDialogOpen}
                college={college}
                onSuccess={() => {
                    // The dialog will handle query invalidation
                }}
            />
        </div>
    )
}

export default GalleryDemoPage 