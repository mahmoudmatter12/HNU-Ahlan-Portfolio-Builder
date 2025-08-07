import { College } from '@/types/Collage'
import React from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, ExternalLink, Play, Image as ImageIcon, ArrowRight, BookOpen } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'

export interface Program {
    id: string;
    name: string;
    description: ProgramDescription[] | null;
    slug: string;
    college: College;
    collegeId: string;
}

export interface ProgramData {
    name: string;
    description: ProgramDescription[] | null;
    slug: string;
}

export interface ProgramDescription {
    title: string;
    description: string; // markdown
    image: ProgramDescriptionRecords[] | null;
    link: ProgramDescriptionRecords[] | null;
    video: ProgramDescriptionRecords[] | null;
}

export interface ProgramDescriptionRecords {
    title: string;
    content: string;
}

// Function to extract headlines from markdown content
const extractHeadlines = (markdown: string): string[] => {
    const headlines: string[] = []
    const lines = markdown.split('\n')

    lines.forEach(line => {
        const trimmed = line.trim()
        if (trimmed.startsWith('# ')) {
            headlines.push(trimmed.substring(2))
        } else if (trimmed.startsWith('## ')) {
            headlines.push(trimmed.substring(3))
        } else if (trimmed.startsWith('### ')) {
            headlines.push(trimmed.substring(4))
        }
    })

    return headlines.slice(0, 3) // Return only first 3 headlines
}

// Function to render department card
const DepartmentCard = ({ department, index, locale, slug }: { department: Program; index: number, locale: string, slug: string }) => {
    const firstDescription = department.description?.[0]
    const headlines = firstDescription?.description ? extractHeadlines(firstDescription.description) : []
    const firstImage = firstDescription?.image?.[0]

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
            className="group relative bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 hover:border-slate-600 transition-all duration-300 overflow-hidden"
        >
            <Link href={`/${locale}/${slug}/programs/${department.slug}`} className="block">
                {/* Image Preview Section */}
                <div className="relative h-90 w-full overflow-hidden">
                    {firstImage ? (
                        <div className="relative w-full h-full">
                            <Image
                                src={firstImage.content}
                                alt={firstImage.title}
                                fill
                                className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>

                            {/* Image title overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                                    <p className="text-white text-sm font-medium truncate">
                                        {firstImage.title}
                                    </p>
                                </div>
                            </div>

                            {/* Hover effect overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            {/* Corner accent */}
                            <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100"></div>
                        </div>
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center group-hover:from-slate-600 group-hover:to-slate-700 transition-all duration-300">
                            <div className="text-center">
                                <ImageIcon className="h-12 w-12 text-slate-400 mx-auto mb-2 group-hover:text-slate-300 transition-colors duration-300" />
                                <p className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors duration-300">
                                    No image available
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Floating badge */}
                    <div className="absolute top-4 left-4">
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
                            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg"
                        >
                            Program
                        </motion.div>
                    </div>
                </div>

                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <motion.div
                                    className="p-2 bg-blue-500/20 rounded-lg"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <GraduationCap className="h-6 w-6 text-blue-400" />
                                </motion.div>
                                <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                                    {department.name}
                                </h3>
                            </div>

                            {firstDescription?.title && (
                                <p className="text-slate-300 text-lg mb-4">
                                    {firstDescription.title}
                                </p>
                            )}
                        </div>

                        <div className="flex-shrink-0">
                            <motion.div
                                className="p-2 bg-slate-700/50 rounded-lg group-hover:bg-blue-500/20 transition-colors"
                                whileHover={{ scale: 1.1, x: 3 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                            </motion.div>
                        </div>
                    </div>

                    {/* Headlines from markdown */}
                    {headlines.length > 0 && (
                        <div className="mb-6">
                            <h4 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wide">
                                Key Highlights
                            </h4>
                            <div className="space-y-2">
                                {headlines.map((headline, idx) => (
                                    <motion.div
                                        key={idx}
                                        className="flex items-center gap-2"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 + 0.4 + idx * 0.1 }}
                                    >
                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></div>
                                        <p className="text-slate-300 text-sm">{headline}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Media Preview */}
                    <div className="space-y-4 mb-6">
                        {/* Images */}
                        {firstDescription?.image && firstDescription.image.length > 0 && (
                            <div className="flex items-center gap-2">
                                <ImageIcon className="h-4 w-4 text-slate-400" />
                                <span className="text-xs text-slate-400">
                                    {firstDescription.image.length} image{firstDescription.image.length !== 1 ? 's' : ''}
                                </span>
                                {firstDescription.image.slice(0, 2).map((img, idx) => (
                                    <motion.div
                                        key={idx}
                                        className="relative w-8 h-8 rounded overflow-hidden border border-slate-600"
                                        whileHover={{ scale: 1.2, zIndex: 10 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <Image
                                            src={img.content}
                                            alt={img.title}
                                            fill
                                            className="object-cover"
                                            sizes="32px"
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* Links */}
                        {firstDescription?.link && firstDescription.link.length > 0 && (
                            <div className="flex items-center gap-2">
                                <ExternalLink className="h-4 w-4 text-slate-400" />
                                <span className="text-xs text-slate-400">
                                    {firstDescription.link.length} link{firstDescription.link.length !== 1 ? 's' : ''}
                                </span>
                                <div className="flex gap-1">
                                    {firstDescription.link.slice(0, 2).map((link, idx) => (
                                        <motion.div
                                            key={idx}
                                            className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-300"
                                            whileHover={{ scale: 1.05, backgroundColor: "rgb(59 130 246 / 0.2)" }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            {link.title}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Videos */}
                        {firstDescription?.video && firstDescription.video.length > 0 && (
                            <div className="flex items-center gap-2">
                                <Play className="h-4 w-4 text-slate-400" />
                                <span className="text-xs text-slate-400">
                                    {firstDescription.video.length} video{firstDescription.video.length !== 1 ? 's' : ''}
                                </span>
                                <div className="flex gap-1">
                                    {firstDescription.video.slice(0, 2).map((video, idx) => (
                                        <motion.div
                                            key={idx}
                                            className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-300"
                                            whileHover={{ scale: 1.05, backgroundColor: "rgb(59 130 246 / 0.2)" }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            {video.title}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Call to Action */}
                    <div className="pt-4 border-t border-slate-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <motion.div
                                    whileHover={{ rotate: 15, scale: 1.1 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <BookOpen className="h-4 w-4 text-blue-400" />
                                </motion.div>
                                <span className="text-sm font-medium text-blue-400">
                                    Discover More
                                </span>
                            </div>
                            <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                                Learn about programs, courses, and opportunities →
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}

function Departments({ college }: { college: College }) {
    const departments = college.programs as Program[]
    const slug = college.slug
    const locale = useLocale()

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

    if (departments.length === 0) {
        return null
    }

    const renderDepartmentsLayout = () => {
        if (!departments || departments.length === 0) {
            return (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16"
                >
                    <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-12 border border-slate-700">
                        <GraduationCap className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No Departments Available</h3>
                        <p className="text-slate-400">Departments will be added here when available.</p>
                    </div>
                </motion.div>
            )
        }

        switch (departments.length) {
            case 1:
                return (
                    <div className="max-w-4xl mx-auto">
                        <DepartmentCard department={departments[0]} index={0} locale={locale} slug={slug} />
                    </div>
                )

            case 2:
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {departments.map((dept, index) => (
                            <DepartmentCard key={dept.id} department={dept} index={index} locale={locale} slug={slug} />
                        ))}
                    </div>
                )

            case 3:
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {departments.map((dept, index) => (
                            <DepartmentCard key={dept.id} department={dept} index={index} locale={locale} slug={slug} />
                        ))}
                    </div>
                )

            case 4:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {departments.map((dept, index) => (
                            <DepartmentCard key={dept.id} department={dept} index={index} locale={locale} slug={slug} />
                        ))}
                    </div>
                )

            case 5:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {departments.slice(0, 3).map((dept, index) => (
                            <DepartmentCard key={dept.id} department={dept} index={index} locale={locale} slug={slug} />
                        ))}
                        <div className="md:col-span-2 lg:col-span-1">
                            {departments.slice(3).map((dept, index) => (
                                <DepartmentCard key={dept.id} department={dept} index={index + 3} locale={locale} slug={slug} />
                            ))}
                        </div>
                    </div>
                )

            default:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {departments.map((dept, index) => (
                            <DepartmentCard key={dept.id} department={dept} index={index} locale={locale} slug={slug} />
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
                            Academic Departments
                        </span>
                    </h2>

                    <p className="text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
                        Explore our diverse range of academic departments and discover the programs that shape your future
                    </p>

                    <div className="w-32 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 mx-auto rounded-full mt-8"></div>
                </motion.div>

                {/* Departments Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {renderDepartmentsLayout()}
                </motion.div>

                {/* view all programs button */}
                <div className="flex justify-center mt-10">
                    <Button variant="outline" asChild>
                        <Link href={`/${locale}/${slug}/programs`}>
                            View All Programs Details
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default Departments