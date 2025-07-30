"use client"

import React from 'react'
import { College } from '@/types/Collage'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Facebook, MessageSquare, Phone, Mail, Star, Award, Users, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface CollageLeader {
    id: string
    name: string
    image: string
    collage: string
    year: string
    program: string
    whatsapp: string
    facebook: string
}

interface CollageLeadersData {
    leaders: CollageLeader[]
}

function CollageLeadersSection({ college }: { college: College }) {
    const collageLeaders = college.collageLeaders as unknown as CollageLeadersData

    if (!collageLeaders?.leaders?.length) {
        return null
    }

    const leadersCount = collageLeaders.leaders.length

    // Determine grid layout based on number of leaders
    const getGridLayout = () => {
        if (leadersCount === 1) return "grid-cols-1 max-w-md mx-auto"
        if (leadersCount === 2) return "grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto"
        if (leadersCount === 3) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto"
        if (leadersCount === 4) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
    }

    // Get section subtitle based on count
    const getSectionSubtitle = () => {
        if (leadersCount === 1) return "Meet our dedicated college representative"
        if (leadersCount === 2) return "Our trusted college representatives"
        if (leadersCount <= 4) return "Meet our trusted college leaders"
        return `Connect with our ${leadersCount} trusted college leaders`
    }

    return (
        <section className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-12 md:mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Sparkles className="h-6 w-6 text-blue-400" />
                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                            {leadersCount} Leader{leadersCount !== 1 ? 's' : ''}
                        </Badge>
                        <Sparkles className="h-6 w-6 text-blue-400" />
                    </div>

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                            College Leaders
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
                        {getSectionSubtitle()}
                    </p>
                </motion.div>

                {/* Leaders Grid */}
                <div className={`grid ${getGridLayout()} gap-8`}>
                    {collageLeaders.leaders.map((leader, index) => (
                        <motion.div
                            key={leader.id}
                            initial={{ opacity: 0, y: 30, scale: 0.9 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{
                                duration: 0.6,
                                delay: index * 0.1,
                                type: "spring",
                                stiffness: 100
                            }}
                            viewport={{ once: true, margin: "-50px" }}
                            whileHover={{
                                y: -8,
                                transition: { duration: 0.2 }
                            }}
                        >
                            <LeaderCard leader={leader} index={index} />
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA */}
                {leadersCount > 3 && (
                    <motion.div
                        className="text-center mt-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-slate-400 text-sm">
                            Can&apos;t find what you&apos;re looking for? Contact any leader above for assistance.
                        </p>
                    </motion.div>
                )}
            </div>
        </section>
    )
}

const LeaderCard = ({ leader, index }: { leader: CollageLeader; index: number }) => {
    const [isHovered, setIsHovered] = React.useState(false)

    return (
        <motion.div
            className="relative group"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative flex flex-col items-center text-center bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-blue-400/50 transition-all duration-300 group-hover:bg-slate-800/70 group-hover:shadow-2xl group-hover:shadow-blue-500/20">
                {/* Floating Badge */}
                <div className="absolute -top-3 -right-3">
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                        <Award className="h-3 w-3 mr-1" />
                        Leader
                    </Badge>
                </div>

                {/* Circular Profile Image with Animation */}
                <motion.div
                    className="relative w-32 h-32 rounded-full border-4 border-blue-500/50 mb-6 overflow-hidden group-hover:border-blue-400 transition-all duration-300"
                    whileHover={{ rotate: 5, scale: 1.05 }}
                >
                    <Image
                        src={leader.image}
                        alt={leader.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    {/* Image Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>

                {/* Leader Info */}
                <div className="w-full">
                    <motion.h3
                        className="text-xl font-bold text-white mb-1"
                        animate={{ color: isHovered ? "#60a5fa" : "#ffffff" }}
                        transition={{ duration: 0.2 }}
                    >
                        {leader.name}
                    </motion.h3>
                    <p className="text-blue-400 mb-2 font-medium">{leader.program}</p>
                    <p className="text-slate-300 text-sm mb-3 flex items-center justify-center gap-1">
                        <Users className="h-3 w-3" />
                        {leader.collage} • Batch {leader.year}
                    </p>

                    {/* Contact Buttons */}
                    <div className="flex justify-center gap-3 mt-4">
                        {leader.whatsapp && (
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    asChild
                                    size="sm"
                                    variant="ghost"
                                    className="rounded-full p-2 bg-green-600/10 hover:bg-green-600/20 text-green-400 border border-green-500/20 hover:border-green-500/40 transition-all duration-200"
                                >
                                    <a href={`https://wa.me/${leader.whatsapp}`} target="_blank" rel="noopener noreferrer">
                                        <Phone className="h-4 w-4" />
                                    </a>
                                </Button>
                            </motion.div>
                        )}
                        {leader.facebook && (
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    asChild
                                    size="sm"
                                    variant="ghost"
                                    className="rounded-full p-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-200"
                                >
                                    <a href={leader.facebook} target="_blank" rel="noopener noreferrer">
                                        <Facebook className="h-4 w-4" />
                                    </a>
                                </Button>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Trusted Badge */}
                <div className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500/90 to-purple-500/90 text-white rounded-full text-xs font-medium flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    Trusted Leader
                </div>

                {/* Hover Effect Lines */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-400/30 transition-all duration-300 pointer-events-none" />
            </div>
        </motion.div>
    )
}

export default CollageLeadersSection