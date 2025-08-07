"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Upload, X, Plus, Image as ImageIcon, Calendar, Trash2, Eye } from "lucide-react"
import { toast } from "sonner"

import type { GalleryEvent, GalleryImage, GalleryData, College } from "@/types/Collage"
import { CollegeService } from "@/services/collage.service"
import { useQueryClient } from "@tanstack/react-query"
import Image from "next/image"

interface GalleryFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    college: College | null
    onSuccess: () => void
}

interface EventDetailsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    event: GalleryEvent | null
    eventIndex: number | null
    college: College | null
    onSave: (event: GalleryEvent, index: number) => void
}

interface AllImagesDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    events: GalleryEvent[]
}

export function AllImagesDialog({ open, onOpenChange, events }: AllImagesDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-gray-900 dark:text-white">All Gallery Events & Images</DialogTitle>
                    <DialogDescription className="text-gray-600 dark:text-gray-400">
                        Complete overview of all events and their images
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-8">
                    {events.map((event, eventIndex) => (
                        <div key={eventIndex} className="space-y-4">
                            {/* Event Header */}
                            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{event.eventName}</h3>
                                    <Badge variant="secondary" className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                                        {event.images.length} images
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>{event.eventDate}</span>
                                    </div>
                                </div>
                                {event.description && (
                                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{event.description}</p>
                                )}
                            </div>

                            {/* Event Images */}
                            {event.images.length > 0 && (
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Images</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
                                        {event.images.map((image, imageIndex) => (
                                            <div key={imageIndex} className="space-y-2">
                                                <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                                    <Image
                                                        fill
                                                        src={image.url}
                                                        alt={image.description || `Image ${imageIndex + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-2">
                                                        {image.description && (
                                                            <p className="text-xs text-white truncate w-full">
                                                                {image.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {eventIndex < events.length - 1 && (
                                <Separator className="bg-gray-200 dark:bg-gray-700" />
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function EventDetailsDialog({ open, onOpenChange, event, eventIndex, college, onSave }: EventDetailsDialogProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [currentEvent, setCurrentEvent] = useState<GalleryEvent | null>(null)
    const [uploadingImages, setUploadingImages] = useState<string[]>([])
    const [previewImages, setPreviewImages] = useState<{ file: File; url: string; description: string }[]>([])


    useEffect(() => {
        if (event) {
            setCurrentEvent({ ...event })
        }
    }, [event])

    const handleFileSelect = (files: FileList | null) => {
        if (!files) return

        const newPreviewImages = Array.from(files).map(file => ({
            file,
            url: URL.createObjectURL(file),
            description: ""
        }))

        setPreviewImages(prev => [...prev, ...newPreviewImages])
    }

    const handleUploadImages = async () => {
        if (!college || !currentEvent || eventIndex === null) return

        setIsLoading(true)
        try {
            const uploadedImages: GalleryImage[] = []

            for (const previewImage of previewImages) {
                setUploadingImages(prev => [...prev, previewImage.file.name])

                try {
                    // Upload image via API
                    const formData = new FormData()
                    formData.append("file", previewImage.file)
                    formData.append("folder", `colleges/${college.slug}/gallery`)

                    const response = await fetch("/en/api/upload/gallery", {
                        method: "POST",
                        body: formData,
                    })

                    if (!response.ok) {
                        throw new Error("Upload failed")
                    }

                    const result = await response.json()

                    if (result.url) {
                        uploadedImages.push({
                            id: crypto.randomUUID(),
                            url: result.url,
                            description: previewImage.description
                        })
                    }
                } catch (error) {
                    console.error('Upload error for', previewImage.file.name, error)
                    toast.error(`Failed to upload ${previewImage.file.name}`)
                } finally {
                    setUploadingImages(prev => prev.filter(name => name !== previewImage.file.name))
                }
            }

            const updatedEvent = {
                ...currentEvent,
                images: [...currentEvent.images, ...uploadedImages]
            }

            onSave(updatedEvent, eventIndex)
            setPreviewImages([])
            toast.success(`${uploadedImages.length} images uploaded successfully`)
        } catch (error) {
            console.error('Upload error:', error)
            toast.error('Failed to upload images')
        } finally {
            setIsLoading(false)
        }
    }

    const handleRemovePreviewImage = (index: number) => {
        setPreviewImages(prev => prev.filter((_, i) => i !== index))
    }

    const handleDescriptionChange = (index: number, description: string) => {
        setPreviewImages(prev => {
            const updated = [...prev]
            updated[index].description = description
            return updated
        })
    }

    const handleClose = () => {
        setPreviewImages([])
        setCurrentEvent(null)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-gray-900 dark:text-white">
                        {currentEvent?.eventName ? `Add Images - ${currentEvent.eventName}` : 'Add Event Images'}
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 dark:text-gray-400">
                        Upload and manage images for this event
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Current Event Images */}
                    {currentEvent && currentEvent.images.length > 0 && (
                        <div>
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Current Images ({currentEvent.images.length})
                            </Label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                                {currentEvent.images.map((image, imageIndex) => (
                                    <div key={imageIndex} className="relative group">
                                        <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                            <Image
                                                fill
                                                src={image.url}
                                                alt={image.description || `Image ${imageIndex + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        {image.description && (
                                            <div className="mt-1">
                                                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                                    {image.description}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <Separator className="bg-gray-200 dark:bg-gray-700" />

                    {/* Upload New Images */}
                    <div>
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Upload New Images
                        </Label>

                        {/* File Upload */}
                        <div className="mt-2">
                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center bg-gray-50 dark:bg-gray-800/50">
                                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    Drag & drop images here or click to browse
                                </p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => handleFileSelect(e.target.files)}
                                    className="hidden"
                                    id="image-upload-details"
                                />
                                <Button
                                    variant="outline"
                                    onClick={() => document.getElementById('image-upload-details')?.click()}
                                    disabled={uploadingImages.length > 0}
                                    className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                >
                                    Choose Images
                                </Button>
                            </div>
                        </div>

                        {/* Preview Images */}
                        {previewImages.length > 0 && (
                            <div className="mt-4">
                                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Preview & Add Descriptions
                                </Label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                                    {previewImages.map((previewImage, index) => (
                                        <div key={index} className="space-y-2">
                                            <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group">
                                                <Image
                                                    fill
                                                    src={previewImage.url}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => handleRemovePreviewImage(index)}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                            <Input
                                                placeholder="Image description"
                                                value={previewImage.description}
                                                onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                                className="text-xs bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 flex gap-2">
                                    <Button
                                        onClick={handleUploadImages}
                                        disabled={uploadingImages.length > 0 || previewImages.length === 0}
                                    >
                                        {uploadingImages.length > 0 ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Uploading...
                                            </span>
                                        ) : (
                                            `Upload ${previewImages.length} Images`
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setPreviewImages([])}
                                        className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    >
                                        Clear All
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export function GalleryFormDialog({ open, onOpenChange, college, onSuccess }: GalleryFormDialogProps) {
    const queryClient = useQueryClient()
    const [isLoading, setIsLoading] = useState(false)
    const [events, setEvents] = useState<GalleryEvent[]>([])
    const [showEventDetails, setShowEventDetails] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState<GalleryEvent | null>(null)
    const [selectedEventIndex, setSelectedEventIndex] = useState<number | null>(null)
    const [showAllImages, setShowAllImages] = useState(false)

    useEffect(() => {
        if (college?.galleryImages && typeof college.galleryImages === 'object') {
            try {
                const galleryData = college.galleryImages as GalleryData
                setEvents(galleryData.events || [])
            } catch (error) {
                console.error('Error parsing gallery data:', error)
                setEvents([])
            }
        } else {
            setEvents([])
        }
    }, [college])

    const handleAddEvent = () => {
        const newEvent: GalleryEvent = {
            id: crypto.randomUUID(),
            eventName: "",
            eventDate: "",
            description: "",
            images: []
        }
        setEvents(prev => [...prev, newEvent])
    }

    const handleEditEvent = (index: number) => {
        setSelectedEvent(events[index])
        setSelectedEventIndex(index)
        setShowEventDetails(true)
    }

    const handleUpdateEvent = (eventIndex: number, field: keyof GalleryEvent, value: any) => {
        setEvents(prev => {
            const updated = [...prev]
            updated[eventIndex] = { ...updated[eventIndex], [field]: value }
            return updated
        })
    }

    const handleSaveEventDetails = (updatedEvent: GalleryEvent, eventIndex: number) => {
        setEvents(prev => {
            const updated = [...prev]
            updated[eventIndex] = updatedEvent
            return updated
        })
        setShowEventDetails(false)
        setSelectedEvent(null)
        setSelectedEventIndex(null)
    }

    const handleDeleteEvent = (index: number) => {
        setEvents(prev => prev.filter((_, i) => i !== index))
        toast.success('Event deleted successfully')
    }

    const handleSaveGallery = async () => {
        if (!college) return

        const invalidEvents = events.filter(event => !event.eventName.trim() || !event.eventDate)
        if (invalidEvents.length > 0) {
            toast.error('Please fill in all required fields for all events')
            return
        }

        setIsLoading(true)
        try {
            const galleryData: GalleryData = { events }

            await CollegeService.updateCollege(college.id, {
                ...college,
                galleryImages: galleryData
            })

            queryClient.invalidateQueries({ queryKey: ["college", college.slug] })
            toast.success('Gallery saved successfully')
            onSuccess()
            onOpenChange(false)
        } catch (error) {
            console.error('Save error:', error)
            toast.error('Failed to save gallery')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-950">
                    <DialogHeader>
                        <DialogTitle className="text-gray-900 dark:text-white">Manage Gallery</DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400">
                            Create and manage gallery events with multiple images for {college?.name}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Events List */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    Events ({events.length})
                                </h3>
                                <Button onClick={handleAddEvent}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Event
                                </Button>
                            </div>

                            {events.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No events yet</p>
                                    <p className="text-xs">Create your first gallery event</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {events.map((event, eventIndex) => (
                                        <Card key={eventIndex} className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                                            <CardHeader>
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="flex-1 space-y-3">
                                                        <Input
                                                            placeholder="Event Name *"
                                                            value={event.eventName}
                                                            onChange={(e) => handleUpdateEvent(eventIndex, 'eventName', e.target.value)}
                                                            className="font-medium bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                                                        />
                                                        <div className="flex gap-2">
                                                            <Input
                                                                type="date"
                                                                value={event.eventDate}
                                                                onChange={(e) => handleUpdateEvent(eventIndex, 'eventDate', e.target.value)}
                                                                className="flex-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                                                            />
                                                            <Badge
                                                                variant="secondary"
                                                                className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                                            >
                                                                {event.images.length} images
                                                            </Badge>
                                                        </div>
                                                        <Textarea
                                                            placeholder="Event description"
                                                            value={event.description}
                                                            onChange={(e) => handleUpdateEvent(eventIndex, 'description', e.target.value)}
                                                            rows={2}
                                                            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleEditEvent(eventIndex)}
                                                            disabled={!event.eventName.trim() || !event.eventDate}
                                                            className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                                        >
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            Add Images
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleDeleteEvent(eventIndex)}
                                                            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                {event.images.length > 0 && (
                                                    <div>
                                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            Preview Images
                                                        </Label>
                                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                                                            {event.images.slice(0, 5).map((image, imageIndex) => (
                                                                <div key={imageIndex} className="relative group">
                                                                    <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                                                        <Image
                                                                            fill
                                                                            src={image.url}
                                                                            alt={image.description || `Image ${imageIndex + 1}`}
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    </div>
                                                                    {image.description && (
                                                                        <div className="mt-1">
                                                                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                                                                {image.description}
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                        {event.images.length > 5 && (
                                                            <Button
                                                                variant="link"
                                                                className="mt-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                                                                onClick={() => setShowAllImages(true)}
                                                            >
                                                                View all {event.images.length} images
                                                            </Button>
                                                        )}
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Save Gallery Button */}
                        <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <Button
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSaveGallery}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </span>
                                ) : 'Save Gallery'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Event Details Dialog */}
            <EventDetailsDialog
                open={showEventDetails}
                onOpenChange={setShowEventDetails}
                event={selectedEvent}
                eventIndex={selectedEventIndex}
                college={college}
                onSave={handleSaveEventDetails}
            />

            {/* All Images Dialog */}
            <AllImagesDialog
                open={showAllImages}
                onOpenChange={setShowAllImages}
                events={events}
            />
        </>
    )
}