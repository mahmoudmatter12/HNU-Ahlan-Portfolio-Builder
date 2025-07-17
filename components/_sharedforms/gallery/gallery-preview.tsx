"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Image as ImageIcon, FileText, Plus, Eye, Edit3 } from "lucide-react"
import type { GalleryEvent, GalleryData } from "@/types/Collage"
import Image from "next/image"
import { AllImagesDialog } from "./gallery-form-dialog"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import DisplayEventWithImagesView from "./display-event-with-images-view"

interface GalleryPreviewProps {
    galleryData: GalleryData | null
    onEdit?: () => void
}

function handleShowAllImages(event: GalleryEvent) {
    AllImagesDialog({
        open: true,
        onOpenChange: () => { },
        events: [event]
    })
}

export function GalleryPreview({ galleryData, onEdit }: GalleryPreviewProps) {
    const events = galleryData?.events || []

    if (events.length === 0) {
        return (
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-slate-50/50 dark:from-gray-900/50 dark:to-slate-900/50 rounded-xl" />
                <div className="relative text-center py-12 px-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-gray-100 to-slate-100 dark:from-gray-800 dark:to-slate-800 rounded-full mb-4">
                        <ImageIcon className="h-7 w-7 text-gray-500 dark:text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No Gallery Events Yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-sm mx-auto text-sm">
                        Start building your gallery by creating your first event. Showcase your memories with beautiful images and descriptions.
                    </p>
                    {onEdit && (
                        <Button
                            size="default"
                            onClick={onEdit}
                            className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900 text-white shadow-sm hover:shadow-md transition-all duration-200"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Create Your First Event
                        </Button>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-gray-50/50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Gallery Events
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full" />
                                <span>{events.length} event{events.length !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full" />
                                <span>{events.reduce((total, event) => total + event.images.length, 0)} total images</span>
                            </div>
                        </div>
                    </div>
                    {onEdit && (
                        <Button
                            size="sm"
                            onClick={onEdit}
                            variant="outline"
                            className="border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 group"
                        >
                            <Edit3 className="h-4 w-4 mr-2" />
                            Edit Gallery
                        </Button>
                    )}
                </div>
            </div>

            {/* Events List - Horizontal Layout */}
            <div className="space-y-4">
                {events.map((event, eventIndex) => (
                    <Card
                        key={eventIndex}
                        className="group hover:shadow-md transition-all duration-300 border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 bg-white dark:bg-gray-950"
                    >
                        <CardContent className="p-4">
                            <div className="flex flex-col lg:flex-row gap-4">
                                {/* Event Info - Left Side */}
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-200">
                                                {event.eventName}
                                            </CardTitle>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <Calendar className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                                                <span>{event.eventDate}</span>
                                            </div>
                                        </div>
                                        <Badge
                                            variant="secondary"
                                            className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-0 text-xs"
                                        >
                                            {event.images.length} images
                                        </Badge>
                                    </div>

                                    {/* Description */}
                                    {event.description && (
                                        <div className="bg-gray-50/50 dark:bg-gray-900/50 rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <FileText className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</span>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{event.description}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Images Grid - Right Side */}
                                {event.images.length > 0 && (
                                    <div className="lg:w-80 space-y-2">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                            <ImageIcon className="h-3.5 w-3.5" />
                                            Images
                                        </Label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {event.images.slice(0, 7).map((image, imageIndex) => (
                                                <div
                                                    key={imageIndex}
                                                    className="relative group/image aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200"
                                                >
                                                    <Image
                                                        fill
                                                        src={image.url}
                                                        alt={image.description || `Image ${imageIndex + 1}`}
                                                        className="object-cover group-hover/image:scale-105 transition-transform duration-300"
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/10 dark:group-hover/image:bg-black/20 transition-all duration-200" />
                                                    {image.description && (
                                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1 opacity-0 group-hover/image:opacity-100 transition-opacity duration-200">
                                                            <p className="text-xs text-white truncate">{image.description}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            {event.images.length > 7 && (
                                                <DisplayEventWithImagesView
                                                    event={event}
                                                    trigger={
                                                        <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 flex items-center justify-center group cursor-pointer">
                                                            <div className="text-center">
                                                                <div className="w-6 h-6 bg-gray-600 dark:bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-1 group-hover:scale-110 transition-transform duration-200">
                                                                    <Eye className="h-3 w-3 text-white dark:text-gray-900" />
                                                                </div>
                                                                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                                                                    +{event.images.length - 7} more
                                                                </p>
                                                            </div>
                                                        </div>
                                                    }
                                                />
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

        </div>
    )
} 