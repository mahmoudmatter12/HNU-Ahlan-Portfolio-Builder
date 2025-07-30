"use client"
import { College } from '@/types/Collage'
import Image from 'next/image'
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Calendar,
    Image as ImageIcon,
    Maximize2,
    ChevronLeft,
    ChevronRight,
    X,
    Play,
    Pause,
} from 'lucide-react'

interface ColllageGalleryProps {
    college: College
}

export interface GalleryEvent {
    id: string;
    eventName: string;
    eventDate: string;
    description: string;
    images: GalleryImage[];
}

export interface GalleryImage {
    id: string;
    url: string;
    description: string;
}

interface GalleryData {
    events: GalleryEvent[];
}

const EventCard = ({
    event,
    isSelected,
    onClick
}: {
    event: GalleryEvent;
    isSelected: boolean;
    onClick: () => void;
}) => {
    const firstImage = event.images[0]

    return (
        <motion.div
            onClick={onClick}
            className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 ${isSelected
                ? 'border-blue-500 shadow-lg shadow-blue-500/25'
                : 'border-slate-700 hover:border-slate-500'
                }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <div className="relative h-48 w-full">
                {firstImage ? (
                    <Image
                        src={firstImage.url}
                        alt={firstImage.description}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 25vw"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-slate-400" />
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold text-lg mb-1 line-clamp-1">
                        {event.eventName}
                    </h3>
                    <div className="flex items-center gap-2 text-slate-300 text-sm mb-2">
                        <Calendar className="h-4 w-4" />
                        <span>{event.eventDate}</span>
                    </div>
                    <p className="text-slate-300 text-sm line-clamp-2">
                        {event.description}
                    </p>
                </div>

                <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <ImageIcon className="h-3 w-3" />
                    <span>{event.images.length}</span>
                </div>
            </div>
        </motion.div>
    )
}

const ImageSlider = ({
    images,
    eventName
}: {
    images: GalleryImage[];
    eventName: string;
}) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(true)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (isPlaying && images.length > 1) {
            intervalRef.current = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % images.length)
            }, 4000)
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [isPlaying, images.length])

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length)
    }

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying)
    }

    if (!images || images.length === 0) {
        return (
            <div className="relative rounded-xl overflow-hidden shadow-xl h-full bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <ImageIcon className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                        <p className="text-slate-400 text-sm">No images available</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="relative rounded-xl overflow-hidden shadow-xl h-full group">
            <Image
                src={images[currentIndex].url}
                alt={images[currentIndex].description}
                fill
                className="object-cover transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 75vw"
                priority
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

            <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white text-lg font-medium">
                    {images[currentIndex].description}
                </p>
            </div>

            {images.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        aria-label="Previous image"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        aria-label="Next image"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>
                </>
            )}

            <div className="absolute top-4 right-4 flex gap-2">
                {images.length > 1 && (
                    <button
                        onClick={togglePlayPause}
                        className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                        aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
                    >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </button>
                )}
            </div>

            {images.length > 1 && (
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                                ? 'bg-white scale-125'
                                : 'bg-white/50 hover:bg-white/75'
                                }`}
                            aria-label={`Go to image ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {images.length > 1 && (
                <div className="absolute top-4 left-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
                    {currentIndex + 1} / {images.length}
                </div>
            )}
        </div>
    )
}

const FullscreenGallery = ({
    event,
    isOpen,
    onClose
}: {
    event: GalleryEvent;
    isOpen: boolean;
    onClose: () => void;
}) => {
    const [currentIndex, setCurrentIndex] = useState(0)

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % event.images.length)
    }

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + event.images.length) % event.images.length)
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
            if (e.key === 'ArrowLeft') prevSlide()
            if (e.key === 'ArrowRight') nextSlide()
        }

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
            >
                <div className="absolute top-0 left-0 right-0 z-10 p-6 bg-gradient-to-b from-black/80 to-transparent">
                    <div className="flex items-center justify-between">
                        <div className="text-white">
                            <h2 className="text-2xl font-bold mb-1">{event.eventName}</h2>
                            <div className="flex items-center gap-4 text-slate-300">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>{event.eventDate}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ImageIcon className="h-4 w-4" />
                                    <span>{currentIndex + 1} / {event.images.length}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                            aria-label="Close gallery"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                        src={event.images[currentIndex].url}
                        alt={event.images[currentIndex].description}
                        fill
                        className="object-contain"
                        sizes="100vw"
                        priority
                    />

                    {event.images.length > 1 && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute left-8 top-1/2 -translate-y-1/2 p-4 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                                aria-label="Previous image"
                            >
                                <ChevronLeft className="h-8 w-8" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-8 top-1/2 -translate-y-1/2 p-4 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                                aria-label="Next image"
                            >
                                <ChevronRight className="h-8 w-8" />
                            </button>
                        </>
                    )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white text-lg text-center max-w-4xl mx-auto">
                        {event.images[currentIndex].description}
                    </p>
                </div>

                {event.images.length > 1 && (
                    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 max-w-4xl overflow-x-auto pb-2">
                        {event.images.map((image, index) => (
                            <button
                                key={image.id}
                                onClick={() => setCurrentIndex(index)}
                                className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${index === currentIndex
                                    ? 'border-white scale-110'
                                    : 'border-white/30 hover:border-white/60'
                                    }`}
                                aria-label={`View image ${index + 1}`}
                            >
                                <Image
                                    src={image.url}
                                    alt={image.description}
                                    fill
                                    className="object-cover"
                                    sizes="64px"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    )
}

function ColllageGallery({ college }: ColllageGalleryProps) {
    const gallery = college.galleryImages || {} as GalleryData
    const events = gallery.events || []
    const [selectedEvent, setSelectedEvent] = useState<GalleryEvent | null>(null)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (events.length > 0 && !selectedEvent) {
            setSelectedEvent(events[0])
        }
    }, [events, selectedEvent])

    // if (events.length === 0) {
    //     return (
    //         <section className="relative py-20 lg:py-32">
    //             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    //                 <ImageIcon className="h-16 w-16 text-slate-400 mx-auto mb-6" />
    //                 <h2 className="text-3xl font-bold text-white mb-4">
    //                     No Gallery Content Available
    //                 </h2>
    //                 <p className="text-slate-400 text-lg max-w-2xl mx-auto">
    //                     This college hasn&apos;t uploaded any gallery content yet. Please check back later.
    //                 </p>
    //             </div>
    //         </section>
    //     )
    // }
    if (events.length === 0) {
        return null
    }

    return (
        <section className="relative py-12 lg:py-20 w-full">
            {/* Full-width container with padding only on sides */}
            <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto">
                {/* Header */}
                <motion.div
                    className="text-center mb-12 lg:mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white">
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                            Campus Gallery
                        </span>
                    </h2>
                    <p className="text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
                        Experience our vibrant campus life through these memorable moments
                    </p>
                    <div className="w-32 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 mx-auto rounded-full mt-8"></div>
                </motion.div>

                {/* Full-width gallery layout with equal height columns */}
                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Main Content Area (Left side, 8 columns) */}
                    <div className="lg:col-span-8">
                        {selectedEvent ? (
                            <motion.div
                                key={selectedEvent.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                                className="h-full"
                            >
                                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-slate-700 h-full flex flex-col">
                                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-6">
                                        <div className="flex-1">
                                            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                                                {selectedEvent.eventName}
                                            </h2>
                                            <div className="flex flex-wrap items-center gap-4 text-slate-300 mb-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-5 w-5 text-blue-400" />
                                                    <span className="text-lg">{selectedEvent.eventDate}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <ImageIcon className="h-5 w-5 text-purple-400" />
                                                    <span className="text-lg">{selectedEvent.images.length} images</span>
                                                </div>
                                            </div>
                                            <p className="text-slate-300 text-lg leading-relaxed">
                                                {selectedEvent.description}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => setIsFullscreen(true)}
                                            className="p-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-xl text-blue-400 transition-colors flex items-center gap-2 self-start lg:self-center"
                                        >
                                            <Maximize2 className="h-5 w-5" />
                                            <span>Fullscreen</span>
                                        </button>
                                    </div>

                                    <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700 flex-1">
                                        <ImageSlider
                                            images={selectedEvent.images}
                                            eventName={selectedEvent.eventName}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-12 border border-slate-700 h-full flex items-center justify-center">
                                <div className="text-center">
                                    <ImageIcon className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-white mb-2">Select an Event</h3>
                                    <p className="text-slate-400">Choose an event from the right to view its gallery</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Event Cards Sidebar (Right side, 4 columns) */}
                    <div className="lg:col-span-4">
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 h-full flex flex-col">
                            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2 flex-shrink-0">
                                <Calendar className="h-5 w-5 text-blue-400" />
                                Campus Events
                            </h3>

                            <div
                                ref={scrollContainerRef}
                                className="space-y-4 flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800/50"
                                style={{ maxHeight: 'calc(100vh - 300px)' }}
                            >
                                {events.map((event:any) => (
                                    <EventCard
                                        key={event.id}
                                        event={event}
                                        isSelected={selectedEvent?.id === event.id}
                                        onClick={() => setSelectedEvent(event)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fullscreen Modal */}
            {selectedEvent && (
                <FullscreenGallery
                    event={selectedEvent}
                    isOpen={isFullscreen}
                    onClose={() => setIsFullscreen(false)}
                />
            )}
        </section>
    )
}

export default ColllageGallery