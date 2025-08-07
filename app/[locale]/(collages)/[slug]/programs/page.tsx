"use client"
// Enhanced Programs List Page
import { useQuery } from '@tanstack/react-query'
import { ProgramService } from '@/services/program.service'
import { useParams, useRouter } from "next/navigation"
import { Program } from '@/types/program'
import { useState, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Search, BookOpen, GraduationCap, ArrowRight, Image as ImageIcon, Video, ArrowLeft } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Link from 'next/link'

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

const normalizeProgram = (program: Program[]) => {
    return program as Program[]
}

const ProgramsDetailsPage = () => {
    const { slug } = useParams()
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState('')

    const { data, isLoading, error } = useQuery({
        queryKey: ['programs', slug],
        queryFn: () => ProgramService.getPrograms({ slug: slug as string, includeCollage: true }),
        enabled: !!slug
    })

    const filteredPrograms = useMemo(() => {
        if (!data) return []

        const programs = normalizeProgram(data)

        return programs.filter((program: Program) => {
            const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                program.slug.toLowerCase().includes(searchTerm.toLowerCase())


            return matchesSearch
        })
    }, [data, searchTerm])

    const handleProgramClick = (programSlug: string) => {
        router.push(`/${slug}/programs/${programSlug}`)
    }

    if (isLoading) {
        return (
            <section className="relative py-12 lg:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Skeleton className="h-12 w-64 mx-auto mb-4" />
                        <Skeleton className="h-6 w-48 mx-auto" />
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                            >
                                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 h-full">
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
                        No Programs Found
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        This college hasn&apos;t uploaded any programs yet.
                    </p>
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
                        Error Loading Programs
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        {error.message}
                    </p>
                </div>
            </section>
        )
    }

    const programs = normalizeProgram(data)
    const college = programs[0]?.college

    return (
        <section className="relative py-12 lg:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    className="text-center mb-12 lg:mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white">
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                            {college?.name || 'College'} Programs
                        </span>
                    </h2>
                    <div className="w-32 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 mx-auto rounded-full mt-8"></div>
                </motion.div>


                {/* Programs Grid */}
                {filteredPrograms.length === 0 ? (
                    <motion.div
                        className="text-center py-12 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Search className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2">No programs found</h3>
                        <p className="text-slate-400">
                            {searchTerm ? `No programs match "${searchTerm}"` : 'No programs available with the current filter'}
                        </p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPrograms.map((program: Program, index: number) => (
                            <motion.div
                                key={program.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                whileHover={{ y: -5 }}
                                className="group"
                            >
                                <div
                                    className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-blue-500 transition-all cursor-pointer h-full flex flex-col"
                                    onClick={() => handleProgramClick(program.slug)}
                                >
                                    <div className="flex items-center justify-center  overflow-hidden">
                                        <div className="relative w-full h-48 mb-4  rounded-lg group-hover:scale-115 transition-all duration-300">
                                            <Image src={program.description?.[0]?.image?.[0]?.content || ''} alt={program.name} fill className="object-cover" />
                                        </div>
                                    </div>

                                    <div className="flex items-start justify-between mb-4">
                                        <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                                            {program.name}
                                        </h3>
                                        <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-blue-400 transition-colors mt-1" />
                                    </div>

                                    <div className="flex-1">
                                        {program.description && program.description.length > 0 ? (
                                            <div>
                                                <p className="text-slate-400 text-sm line-clamp-3 mb-4">
                                                    {program.description[0]?.description?.replace(/[#*`]/g, '').substring(0, 150)}...
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    <Badge variant="secondary" className="text-xs bg-slate-700/50">
                                                        {program.description.length} section{program.description.length !== 1 ? 's' : ''}
                                                    </Badge>
                                                    {program.description.some(d => d.image && d.image.length > 0) && (
                                                        <Badge variant="outline" className="text-xs">
                                                            <ImageIcon className="h-3 w-3 mr-1" /> Images
                                                        </Badge>
                                                    )}
                                                    {program.description.some(d => d.video && d.video.length > 0) && (
                                                        <Badge variant="outline" className="text-xs">
                                                            <Video className="h-3 w-3 mr-1" /> Videos
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-sm text-slate-500 italic">
                                                No description available
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Results Summary */}
                {filteredPrograms.length > 0 && (
                    <motion.div
                        className="mt-8 text-center text-sm text-slate-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Showing {filteredPrograms.length} of {programs.length} programs
                        {searchTerm && ` matching "${searchTerm}"`}
                    </motion.div>
                )}

                {/* back to collage */}
                <div className="mt-8 text-center text-sm text-slate-400">
                    <Link href={`/${slug}`} className="text-blue-400 hover:text-blue-300 flex items-center justify-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to {college?.name} Programs
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default ProgramsDetailsPage