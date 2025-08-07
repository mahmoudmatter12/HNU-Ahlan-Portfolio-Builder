"use client"
// Enhanced Program Details Page
import { useQuery } from '@tanstack/react-query'
import { ProgramService } from '@/services/program.service'
import { useParams, useRouter } from "next/navigation"
import { Program } from '@/types/program'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { MarkdownPreview } from '@/components/markdown-preview'
import {
    ArrowLeft,
    BookOpen,
    GraduationCap,
    Image as ImageIcon,
    Video,
    Link as LinkIcon,
    ExternalLink,
} from 'lucide-react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface ProgramDescription {
    title: string;
    description: string;
    image: ProgramDescriptionRecords[] | null;
    link: ProgramDescriptionRecords[] | null;
    video: ProgramDescriptionRecords[] | null;
}

interface ProgramDescriptionRecords {
    title: string;
    content: string;
}

const normalizeProgram = (program: Program) => {
    return program as Program
}



export default function ProgramDetailsPage() {
    const { slug, programSlug } = useParams()
    const router = useRouter()

    const { data, isLoading, error } = useQuery({
        queryKey: ['programs', slug, programSlug],
        queryFn: () => ProgramService.getPrograms({ slug: slug as string, depSlug: programSlug as string, oneOnly: true, includeCollage: true }),
        enabled: !!slug && !!programSlug
    })

    if (isLoading) {
        return (
            <section className="relative py-12 lg:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Skeleton className="h-12 w-64 mb-4" />
                        <Skeleton className="h-6 w-48" />
                    </motion.div>
                    <div className="space-y-6">
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                            >
                                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                                    <Skeleton className="h-6 w-3/4 mb-4" />
                                    <Skeleton className="h-4 w-full mb-2" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    if (!data) {
        return (
            <section className="relative py-20 lg:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <BookOpen className="h-16 w-16 text-slate-400 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Program Not Found
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-6">
                        The requested program could not be found.
                    </p>
                    <Button
                        onClick={() => router.back()}
                        className="bg-blue-500 hover:bg-blue-600"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Go Back
                    </Button>
                </div>
            </section>
        )
    }

    if (error) {
        return (
            <section className="relative py-20 lg:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <GraduationCap className="h-16 w-16 text-red-400 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Error Loading Program
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-6">
                        {error.message}
                    </p>
                    <Button
                        onClick={() => router.back()}
                        className="bg-blue-500 hover:bg-blue-600"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Go Back
                    </Button>
                </div>
            </section>
        )
    }

    const program = normalizeProgram(data)
    const college = program.college

    return (
        <section className="relative py-6 sm:py-8 lg:py-12 xl:py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Navigation */}
                <motion.div
                    className="mb-4 sm:mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="mb-2 sm:mb-4 text-slate-300 hover:text-white text-sm sm:text-base"
                    >
                        <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        Back to Programs
                    </Button>
                </motion.div>

                {/* Program Header */}
                {/* <motion.div
                    className="mb-12 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="flex items-start gap-6 mb-6">
                        {college?.logoUrl && (
                            <div className="relative w-24 h-24 rounded-xl overflow-hidden">
                                <Image
                                    src={college.logoUrl}
                                    alt={college.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-4">
                                <h1 className="text-4xl font-bold text-white">{program.name}</h1>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <Badge className="bg-blue-500/20 text-blue-400">
                                    {college?.name}
                                </Badge>
                                <Badge className="bg-purple-500/20 text-purple-400">
                                    {college?.type}
                                </Badge>
                                {program.description && (
                                    <Badge className="bg-slate-700/50 text-slate-300">
                                        {program.description.length} section{program.description.length !== 1 ? 's' : ''}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div> */}

                {/* Program Content */}
                {program.description && program.description.length > 0 ? (
                    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                        {program.description.map((section, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-slate-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl overflow-hidden border border-slate-700"
                            >
                                {/* Hero Section with Image and Overlay */}
                                {section.image && section.image.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.6, delay: 0.2 }}
                                        className="relative"
                                    >
                                        {/* Background Image */}
                                        <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[700px]">
                                            <Image
                                                src={section.image[0].content}
                                                alt={section.image[0].title || `Featured image for ${section.title}`}
                                                fill
                                                className="object-cover"
                                                priority
                                            />
                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80" />

                                            {/* Content Overlay */}
                                            <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 lg:p-8">
                                                {/* Tags */}
                                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                                    <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30 text-xs sm:text-sm">
                                                        {college?.name}
                                                    </Badge>
                                                    <Badge className="bg-slate-700/50 text-slate-300 border-slate-600 text-xs sm:text-sm">
                                                        Section {index + 1}
                                                    </Badge>
                                                </div>

                                                {/* Main Title */}
                                                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-2 sm:mb-4 drop-shadow-lg leading-tight">
                                                    {section.title}
                                                </h2>

                                                {/* Image Title if available */}
                                                {section.image[0].title && (
                                                    <p className="text-sm sm:text-base lg:text-xl text-slate-200 font-medium drop-shadow-lg">
                                                        {section.image[0].title}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Content Section */}
                                <div className="p-4 sm:p-6 lg:p-8">
                                    {/* Section Header (if no image) */}
                                    {(!section.image || section.image.length === 0) && (
                                        <div className="mb-6 sm:mb-8">
                                            <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
                                                {section.title}
                                            </h2>
                                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-400">
                                                <span>Section {index + 1} of {program.description?.length}</span>
                                                <Badge variant="outline" className="border-slate-700 text-slate-300 text-xs sm:text-sm">
                                                    Program Details
                                                </Badge>
                                            </div>
                                        </div>
                                    )}

                                    {/* Description */}
                                    {section.description && (
                                        <div className="mb-6 sm:mb-8">
                                            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-teal-400 mb-4 sm:mb-6 flex items-center gap-2">
                                                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
                                                Description
                                            </h3>
                                            <div className="bg-slate-900/50 rounded-lg p-4 sm:p-6 border border-slate-700">
                                                <MarkdownPreview content={section.description} />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Additional Images (if more than 1) */}
                                {section.image && section.image.length > 1 && (
                                    <div className="mb-6 sm:mb-8 px-4 sm:px-6 lg:px-8">
                                        <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2">
                                            <ImageIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                                            Additional Images ({section.image.length - 1})
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                            {section.image.slice(1).map((img, imgIndex) => (
                                                <motion.div
                                                    key={imgIndex + 1}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 0.3, delay: imgIndex * 0.05 }}
                                                    className="space-y-3"
                                                >
                                                    <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-700">
                                                        <Image
                                                            src={img.content}
                                                            alt={img.title || `Image ${imgIndex + 2}`}
                                                            fill
                                                            className="object-cover hover:scale-105 transition-transform duration-300"
                                                        />
                                                    </div>
                                                    {img.title && (
                                                        <p className="text-sm font-medium text-slate-300 text-center">
                                                            {img.title}
                                                        </p>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Videos */}
                                {section.video && section.video.length > 0 && (
                                    <div className="mb-6 sm:mb-8 px-4 sm:px-6 lg:px-8">
                                        <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2">
                                            <Video className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                                            Videos ({section.video.length})
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                            {section.video.map((video, videoIndex) => (
                                                <motion.div
                                                    key={videoIndex}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 0.3, delay: videoIndex * 0.05 }}
                                                    className="space-y-3"
                                                >
                                                    <div className="aspect-video bg-slate-700/50 rounded-lg flex items-center justify-center border border-slate-700 hover:bg-slate-700/70 transition-colors">
                                                        <div className="text-center p-4">
                                                            <Video className="h-8 w-8 mx-auto text-blue-400 mb-2" />
                                                            <p className="text-sm text-slate-300">Video Content</p>
                                                            <p className="text-xs text-slate-500">{video.content}</p>
                                                        </div>
                                                    </div>
                                                    {video.title && (
                                                        <p className="text-sm font-medium text-slate-300 text-center">
                                                            {video.title}
                                                        </p>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Links */}
                                {section.link && section.link.length > 0 && (
                                    <div className="px-4 sm:px-6 lg:px-8">
                                        <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2">
                                            <LinkIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                                            Links ({section.link.length})
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                            {section.link.map((link, linkIndex) => (
                                                <motion.div
                                                    key={linkIndex}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 0.3, delay: linkIndex * 0.05 }}
                                                    className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-800/30 rounded-lg border border-slate-700 hover:border-blue-500/50 transition-colors"
                                                >
                                                    <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0 mt-1 sm:mt-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-white truncate text-sm sm:text-base">
                                                            {link.title || `Link ${linkIndex + 1}`}
                                                        </p>
                                                        <p className="text-xs sm:text-sm text-slate-400 truncate">
                                                            {link.content}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => window.open(link.content, '_blank')}
                                                        className="bg-blue-500/20 hover:bg-blue-500/30 border-blue-500/30 text-blue-400 text-xs sm:text-sm w-full sm:w-auto"
                                                    >
                                                        Visit
                                                    </Button>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-8 sm:p-12 border border-slate-700 text-center">
                            <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 text-slate-400 mx-auto mb-4 sm:mb-6" />
                            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No Program Details Available</h3>
                            <p className="text-slate-400 text-sm sm:text-base">
                                This program doesn&apos;t have any detailed information yet.
                            </p>
                        </div>
                    </motion.div>
                )}

            </div>
        </section>
    )
}