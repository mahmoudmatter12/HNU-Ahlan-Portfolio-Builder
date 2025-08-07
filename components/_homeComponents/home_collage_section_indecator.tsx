"use client"
import { College } from '@/types/Collage'
import { UniversityContent } from '@/types/uni'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, ArrowRight, Building2, BookOpen, Users, Layers } from 'lucide-react'

export interface University {
    id: string
    name: string
    slug: string
    logoUrl: string | null
    socialMedia: Record<string, any> | null
    newsItems: Record<string, any> | null
    description: string | null
    content: UniversityContent | null
    colleges: College[]
    createdAt: Date
    updatedAt: Date
}

const CollageCard = ({ collage, index }: { collage: College; index: number }) => {
    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1]
            }
        },
        hover: {
            y: -10,
            transition: { duration: 0.3 }
        }
    }

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-3xl border border-slate-600/50 hover:border-blue-500/50 transition-all duration-500 overflow-hidden shadow-2xl hover:shadow-blue-500/20"
        >
            <Link href={`/${collage.slug}`} className="block h-full">
                {/* Animated background elements */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
                </div>

                <div className="relative p-8 h-full flex flex-col">
                    {/* Logo Section */}
                    <div className="flex justify-center mb-8">
                        <motion.div
                            className="relative w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800 border-4 border-slate-600/50 group-hover:border-blue-500/50 transition-all duration-500 shadow-xl"
                            whileHover={{
                                scale: 1.05,
                                rotateY: 5,
                                boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.3)"
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        >
                            {collage.logoUrl ? (
                                <Image
                                    src={collage.logoUrl}
                                    alt={collage.name}
                                    fill
                                    className="object-cover transition-all duration-700 group-hover:scale-105"
                                    sizes="128px"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-600 to-slate-700">
                                    <Building2 className="h-12 w-12 text-slate-400 group-hover:text-blue-400 transition-colors duration-500" />
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Content Section */}
                    <div className="text-center flex-1 flex flex-col">
                        {/* College Type Badge */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
                            className="inline-block mb-4"
                        >
                            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-blue-400 text-xs px-4 py-2 rounded-full font-medium border border-blue-400/30">
                                {collage.type?.toLowerCase().replace('_', ' ')}
                            </span>
                        </motion.div>

                        {/* College Name */}
                        <motion.h3
                            className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-500 flex-1"
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            {collage.name}
                        </motion.h3>


                        {/* Call to Action Button */}
                        <motion.div
                            className="mt-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500/80 to-purple-600/80 text-white px-6 py-3 rounded-full font-medium border border-blue-400/30 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-500"
                            whileHover={{
                                scale: 1.03,
                                background: "linear-gradient(to right, rgba(59, 130, 246, 0.9), rgba(139, 92, 246, 0.9))"
                            }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <span>Explore College</span>
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </motion.div>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}

export default function HomeCollageSection({ university }: { university: University | null }) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
                when: "beforeChildren"
            }
        }
    }

    const renderCollagesLayout = () => {
        if (!university?.colleges || university.colleges.length === 0) {
            return (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center py-16"
                >
                    <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-12 border border-slate-700 max-w-2xl mx-auto">
                        <Building2 className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No Colleges Available</h3>
                        <p className="text-slate-400">Colleges will be added here when available.</p>
                    </div>
                </motion.div>
            )
        }

        const collages = university.colleges

        // Responsive grid layout based on number of colleges
        if (collages.length <= 2) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {collages.map((collage, index) => (
                        <CollageCard key={collage.id} collage={collage} index={index} />
                    ))}
                </div>
            )
        }

        if (collages.length === 3) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {collages.map((collage, index) => (
                        <CollageCard key={collage.id} collage={collage} index={index} />
                    ))}
                </div>
            )
        }

        // Default grid for 4+ colleges
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {collages.map((collage, index) => (
                    <CollageCard key={collage.id} collage={collage} index={index} />
                ))}
            </div>
        )
    }

    return (
        <section id="colleges" className="relative py-20 lg:py-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    className="text-center mb-16 lg:mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="inline-flex items-center justify-center gap-2 bg-blue-500/20 text-blue-400 px-6 py-2 rounded-full mb-6 border border-blue-500/30"
                    >
                        <GraduationCap className="h-5 w-5" />
                        <span className="text-sm font-medium">Academic Excellence</span>
                    </motion.div>

                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white">
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                            Our Colleges
                        </span>
                    </h2>

                    <p className="text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
                        Discover our diverse range of colleges and find the perfect academic path for your future
                    </p>

                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="w-32 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 mx-auto rounded-full mt-8"
                    />
                </motion.div>

                {/* Collages Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative"
                >
                    {/* Decorative elements */}
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl opacity-50"></div>
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl opacity-50"></div>

                    {renderCollagesLayout()}
                </motion.div>
            </div>
        </section>
    )
}