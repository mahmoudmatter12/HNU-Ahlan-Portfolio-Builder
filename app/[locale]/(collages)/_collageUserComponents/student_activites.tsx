import { MarkdownPreview } from '@/components/markdown-preview';
import { College } from '@/types/Collage'
import { SectionType } from '@/types/section';
import Image from 'next/image';
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Calendar, Image as ImageIcon, ChevronLeft, ChevronRight, Play, ExternalLink } from 'lucide-react'

interface StudentActivitesProps {
    college: College
}

interface Section {
    id: string;
    title: string;
    sectionType: SectionType;
    content?: string;
    order: number;
    settings?: StudentActivitiesSectionSettings;
    collegeId: string;
    college?: College;
    createdAt: Date;
    updatedAt: Date;
}

interface StudentActivitiesSectionSettings {
    images?: string[];
    title?: string;
    description?: string;
}

// Image Slider Component
const ImageSlider = ({ images, title }: { images: string[]; title: string }) => {
    const [currentIndex, setCurrentIndex] = useState(0)

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length)
    }

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    if (!images || images.length === 0) {
        return (
            <div className="relative rounded-xl overflow-hidden shadow-xl aspect-[16/9] bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700">
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
        <div className="relative rounded-xl overflow-hidden shadow-xl aspect-[16/9] group">
            <Image
                src={images[currentIndex]}
                alt={`${title} - Image ${currentIndex + 1}`}
                fill
                className="object-cover transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

            {/* Navigation arrows */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </>
            )}

            {/* Dots indicator */}
            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                ? 'bg-white scale-125'
                                : 'bg-white/50 hover:bg-white/75'
                                }`}
                        />
                    ))}
                </div>
            )}

            {/* Image counter */}
            {images.length > 1 && (
                <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    {currentIndex + 1} / {images.length}
                </div>
            )}
        </div>
    )
}

// Activity Card Component
const ActivityCard = ({ activity, index }: { activity: Section; index: number }) => {
    const settings = activity.settings as StudentActivitiesSectionSettings
    const images = settings?.images || []

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                delay: index * 0.1
            }
        }
    }

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden"
        >
            <div className="p-8">
                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-blue-500/20 rounded-xl flex-shrink-0">
                        <Users className="h-8 w-8 text-blue-400" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-2">
                            {activity.title}
                        </h3>
                        {settings?.title && (
                            <p className="text-slate-300 text-lg mb-2">
                                {settings.title}
                            </p>
                        )}
                        {settings?.description && (
                            <p className="text-slate-400 text-sm leading-relaxed">
                                {settings.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Image Slider */}
                <div className="mb-8">
                    <ImageSlider images={images} title={activity.title} />
                </div>

                {/* Content */}
                {activity.content && (
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white mb-4">
                            Activity Details
                        </h4>
                        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                            <MarkdownPreview content={activity.content} />
                        </div>
                    </div>
                )}

                {/* Activity Stats */}
                <div className="mt-6 pt-6 border-t border-slate-700">
                    <div className="flex items-center justify-between text-sm text-slate-400">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Student Activity</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ImageIcon className="h-4 w-4" />
                            <span>{images.length} image{images.length !== 1 ? 's' : ''}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

function StudentActivites({ college }: StudentActivitesProps) {
    // get all the sections that is of type student_activities
    const activities = college.sections.filter((section) => section.sectionType === "STUDENT_ACTIVITIES") as Section[]

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    }

    const renderActivitiesLayout = () => {
        if (!activities || activities.length === 0) {
            return (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16"
                >
                    <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-12 border border-slate-700">
                        <Users className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No Student Activities Available</h3>
                        <p className="text-slate-400">Student activities will be added here when available.</p>
                    </div>
                </motion.div>
            )
        }

        switch (activities.length) {
            case 1:
                return (
                    <div className="max-w-4xl mx-auto">
                        <ActivityCard activity={activities[0]} index={0} />
                    </div>
                )

            case 2:
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {activities.map((activity, index) => (
                            <ActivityCard key={activity.id} activity={activity} index={index} />
                        ))}
                    </div>
                )

            case 3:
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {activities.map((activity, index) => (
                            <ActivityCard key={activity.id} activity={activity} index={index} />
                        ))}
                    </div>
                )

            case 4:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {activities.map((activity, index) => (
                            <ActivityCard key={activity.id} activity={activity} index={index} />
                        ))}
                    </div>
                )

            default:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {activities.map((activity, index) => (
                            <ActivityCard key={activity.id} activity={activity} index={index} />
                        ))}
                    </div>
                )
        }
    }

    return (
        <section className="relative py-20 lg:py-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    className="text-center mb-16 lg:mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white">
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                            Student Activities
                        </span>
                    </h2>

                    <p className="text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
                        Discover the vibrant student life and exciting activities that make our campus community thrive
                    </p>

                    <div className="w-32 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 mx-auto rounded-full mt-8"></div>
                </motion.div>

                {/* Activities Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {renderActivitiesLayout()}
                </motion.div>
            </div>
        </section>
    )
}

export default StudentActivites