"use client"

import { College } from '@/types/Collage'
import { SectionType } from '@/types/section'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Play, Pause, Maximize2, X } from 'lucide-react'
import { MarkdownPreview } from '@/components/markdown-preview'
import { cn } from '@/lib/utils'

interface CustomSectionProps {
    college: College
}

interface Section {
    id: string
    title: string
    sectionType: SectionType
    content?: string
    order: number
    settings?: CustomSectionSettings
    collegeId: string
    college?: College
    createdAt: Date
    updatedAt: Date
}

interface CustomSectionSettings {
    images?: string[]
    title?: string
    description?: string
    imageDisplayType?: "slider" | "grid" | "single" | "banner" | "carousel" | "gallery" | "list" | "background"
}

const CustomSection = ({ college }: CustomSectionProps) => {
    // Get all custom sections
    const customSections = college.sections.filter(section => section.sectionType === "CUSTOM") as Section[]

    if (!customSections || customSections.length === 0) {
        return null
    }

    return (
        <div className="space-y-20 py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
            {customSections.map((section, sectionIndex) => (
                <CustomSectionItem
                    key={section.id}
                    section={section}
                    isFirst={sectionIndex === 0}
                />
            ))}
        </div>
    )
}

const CustomSectionItem = ({ section, isFirst }: { section: Section, isFirst: boolean }) => {
    const { images, title, description, imageDisplayType } = section.settings as CustomSectionSettings || {}
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(true)
    const [isFullscreen, setIsFullscreen] = useState(false)

    // Auto-play functionality
    useEffect(() => {
        if (!isPlaying || !images || images.length <= 1) return

        const interval = setInterval(() => {
            setCurrentImageIndex(prev => (prev + 1) % images.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [isPlaying, images])

    // Navigation functions
    const nextImage = () => {
        if (images && images.length > 0) {
            setCurrentImageIndex(prev => (prev + 1) % images.length)
        }
    }

    const prevImage = () => {
        if (images && images.length > 0) {
            setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length)
        }
    }

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying)
    }

    const renderImages = () => {
        if (!images || images.length === 0) return null

        const displayType = imageDisplayType || "grid"

        switch (displayType) {
            case "single":
                return (
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-xl border border-slate-700/50">
                        <Image
                            src={images[0]}
                            alt={title || "Custom section image"}
                            fill
                            className="object-cover"
                            priority={isFirst}
                        />
                        <button
                            onClick={() => setIsFullscreen(true)}
                            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                        >
                            <Maximize2 className="w-4 h-4" />
                        </button>
                    </div>
                )

            case "grid":
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {images.map((image, index) => (
                            <div
                                key={index}
                                className="relative aspect-video rounded-xl overflow-hidden shadow-lg group"
                            >
                                <Image
                                    src={image}
                                    alt={`${title || 'Custom'} ${index + 1}`}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    priority={isFirst && index < 3}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <p className="font-medium">Image {index + 1}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )

            case "banner":
                return (
                    <div className="relative w-full aspect-[16/5] rounded-xl overflow-hidden shadow-xl">
                        <Image
                            src={images[0]}
                            alt={title || "Banner image"}
                            fill
                            className="object-cover"
                            priority={isFirst}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex items-center">
                            <div className="text-white p-6 md:p-8 lg:p-12 max-w-2xl">
                                {title && (
                                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">{title}</h3>
                                )}
                                {description && (
                                    <p className="text-lg md:text-xl opacity-90">{description}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )

            case "carousel":
                return (
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-xl">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentImageIndex}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0"
                            >
                                <Image
                                    src={images[currentImageIndex]}
                                    alt={`${title || 'Carousel'} ${currentImageIndex + 1}`}
                                    fill
                                    className="object-cover"
                                    priority={isFirst && currentImageIndex === 0}
                                />
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation arrows */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}

                        {/* Play/Pause button */}
                        {images.length > 1 && (
                            <button
                                onClick={togglePlayPause}
                                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                            >
                                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </button>
                        )}

                        {/* Dots indicator */}
                        {images.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                {images.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`w-3 h-3 rounded-full transition-all ${index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'}`}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Image counter */}
                        <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                            {currentImageIndex + 1} / {images.length}
                        </div>
                    </div>
                )

            case "gallery":
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {images.map((image, index) => (
                            <div
                                key={index}
                                className="relative aspect-square rounded-xl overflow-hidden shadow-lg group cursor-pointer"
                            >
                                <Image
                                    src={image}
                                    alt={`${title || 'Gallery'} ${index + 1}`}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                                    priority={isFirst && index < 3}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <p className="font-medium">Image {index + 1}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )

            case "list":
                return (
                    <div className="space-y-4">
                        {images.map((image, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl shadow-lg hover:shadow-xl transition-all"
                            >
                                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0">
                                    <Image
                                        src={image}
                                        alt={`${title || 'List'} ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        priority={isFirst && index === 0}
                                    />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-lg text-white">{title || `Image ${index + 1}`}</h4>
                                    <p className="text-slate-300 text-sm">
                                        {description || `Custom section image ${index + 1}`}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )

            case "background":
                return (
                    <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-xl">
                        {/* Background images with transitions */}
                        <AnimatePresence mode="wait">
                            {images.map((image, index) => (
                                currentImageIndex === index && (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 1.5, ease: "easeInOut" }}
                                        className="absolute inset-0"
                                    >
                                        <Image
                                            src={image}
                                            alt={`${title || 'Background'} ${index + 1}`}
                                            fill
                                            className="object-cover"
                                            priority={isFirst && index === 0}
                                        />
                                    </motion.div>
                                )
                            ))}
                        </AnimatePresence>

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        {/* Content */}
                        <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 text-white max-w-2xl">
                            {title && (
                                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">{title}</h3>
                            )}
                            {description && (
                                <p className="text-lg md:text-xl opacity-90">{description}</p>
                            )}
                        </div>

                        {/* Navigation controls (only shown if multiple images) */}
                        {images.length > 1 && (
                            <>
                                {/* Play/Pause button */}
                                <button
                                    onClick={togglePlayPause}
                                    className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors z-10"
                                >
                                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                </button>

                                {/* Navigation arrows */}
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors z-10"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors z-10"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>

                                {/* Dots indicator */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                    {images.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`w-3 h-3 rounded-full transition-all ${index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'}`}
                                        />
                                    ))}
                                </div>

                                {/* Image counter */}
                                <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-10">
                                    {currentImageIndex + 1} / {images.length}
                                </div>
                            </>
                        )}
                    </div>
                )

            case "slider":
            default:
                return (
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-xl">
                        <div className="flex h-full snap-x snap-mandatory overflow-x-auto scrollbar-hide">
                            {images.map((image, index) => (
                                <div
                                    key={index}
                                    className="flex-shrink-0 w-full h-full snap-start relative"
                                >
                                    <Image
                                        src={image}
                                        alt={`${title || 'Slider'} ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        priority={isFirst && index === 0}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Image counter */}
                        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                            {images.length} image{images.length !== 1 ? 's' : ''}
                        </div>
                    </div>
                )
        }
    }

    return (
        <motion.section
            className="max-w-7xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: isFirst ? 0 : 0.2 }}
        >
            {/* Section Header */}
            {(title || description) && (
                <div className="text-center mb-12 md:mb-16">
                    {title && (
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                            {title}
                        </h2>
                    )}
                    {description && (
                        <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                            {description}
                        </p>
                    )}
                </div>
            )}

            {/* Images Display */}
            {renderImages()}

            {/* Markdown Content */}
            {section.content && (
                <div className="mt-12 md:mt-16 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 lg:p-10 border border-slate-700">
                    <div className="prose prose-invert max-w-none">
                        <MarkdownPreview content={section.content} />
                    </div>
                </div>
            )}

            {/* Fullscreen Modal */}
            {isFullscreen && images && (
                <FullscreenImageModal
                    image={images[0]}
                    onClose={() => setIsFullscreen(false)}
                    title={title}
                />
            )}
        </motion.section>
    )
}

const FullscreenImageModal = ({ image, onClose, title }: { image: string, onClose: () => void, title?: string }) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }

        document.addEventListener('keydown', handleKeyDown)
        document.body.style.overflow = 'hidden'

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = 'unset'
        }
    }, [onClose])

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="relative w-full h-full max-w-6xl max-h-[90vh]">
                    <Image
                        src={image}
                        alt={title || "Fullscreen image"}
                        fill
                        className="object-contain"
                    />
                </div>

                {title && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg max-w-4xl text-center">
                        {title}
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    )
}

export default CustomSection