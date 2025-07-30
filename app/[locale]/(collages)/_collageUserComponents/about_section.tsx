import { College } from '@/types/Collage'
import { SectionSettings, SectionType } from '@/types/section'
import Image from 'next/image'
import React from 'react'
import { easeOut, motion } from 'framer-motion'
import { BookOpen, GraduationCap, Users, Award, Globe, Target } from 'lucide-react'
import { MarkdownPreview } from '@/components/markdown-preview'

interface AboutSectionProps {
    collage: College
}

interface AboutSectionSettings {
    images?: string[];
    title?: string;
    description?: string;
    showImages?: boolean;
    keyPoints?: string[];
}

interface Section {
    id: string;
    title: string;
    sectionType: SectionType;
    content?: string;
    order: number;
    settings?: SectionSettings;
    collegeId: string;
    college?: College;
    createdAt: Date;
    updatedAt: Date;
}

function AboutSection({ collage }: AboutSectionProps) {
    const aboutSection = collage.sections.find((section) => section.title === 'About') as Section
    const aboutSectionSettings = aboutSection?.settings as AboutSectionSettings
    const aboutImages = aboutSectionSettings?.images

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: easeOut }
        }
    }

    const imageVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.8, ease: easeOut }
        }
    }

    const contentVariants = {
        hidden: { opacity: 0, x: 30 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8, ease: easeOut }
        }
    }

    // Academic features that apply to all colleges
    const academicFeatures = [
        {
            icon: GraduationCap,
            title: "Academic Excellence",
            description: "Committed to providing world-class education and fostering intellectual growth"
        },
        {
            icon: Users,
            title: "Diverse Community",
            description: "Welcoming students from various backgrounds, creating a rich learning environment"
        },
        {
            icon: Award,
            title: "Accredited Programs",
            description: "All programs are accredited by leading educational bodies and industry standards"
        },
        {
            icon: Globe,
            title: "Global Perspective",
            description: "Preparing students for success in an interconnected world"
        },
        {
            icon: Target,
            title: "Career Focused",
            description: "Curriculum designed to meet industry demands and career advancement"
        },
        {
            icon: BookOpen,
            title: "Research Driven",
            description: "Emphasizing research and innovation in all academic disciplines"
        }
    ]

    // Function to render images based on count
    const renderImages = () => {
        if (!aboutImages || aboutImages.length === 0) {
            return (
                <motion.div
                    className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700"
                    variants={imageVariants}
                >
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <GraduationCap className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                            <p className="text-slate-400 text-lg">No images available</p>
                        </div>
                    </div>
                </motion.div>
            )
        }

        if (aboutImages.length === 1) {
            return (
                <motion.div
                    className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]"
                    variants={imageVariants}
                >
                    <Image
                        src={aboutImages[0]}
                        alt={`${collage.name} campus`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                </motion.div>
            )
        }

        if (aboutImages.length === 2) {
            return (
                <div className="space-y-4">
                    <motion.div
                        className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[16/9]"
                        variants={imageVariants}
                    >
                        <Image
                            src={aboutImages[0]}
                            alt={`${collage.name} campus`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    </motion.div>
                    <motion.div
                        className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[16/9]"
                        variants={imageVariants}
                    >
                        <Image
                            src={aboutImages[1]}
                            alt={`${collage.name} campus view`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    </motion.div>
                </div>
            )
        }

        if (aboutImages.length === 3) {
            return (
                <div className="space-y-4">
                    <motion.div
                        className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[16/9]"
                        variants={imageVariants}
                    >
                        <Image
                            src={aboutImages[0]}
                            alt={`${collage.name} campus`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    </motion.div>
                    <div className="grid grid-cols-2 gap-4">
                        <motion.div
                            className="relative rounded-xl overflow-hidden shadow-xl aspect-square"
                            variants={imageVariants}
                        >
                            <Image
                                src={aboutImages[1]}
                                alt={`${collage.name} campus view`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 50vw, 25vw"
                            />
                        </motion.div>
                        <motion.div
                            className="relative rounded-xl overflow-hidden shadow-xl aspect-square"
                            variants={imageVariants}
                        >
                            <Image
                                src={aboutImages[2]}
                                alt={`${collage.name} campus view`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 50vw, 25vw"
                            />
                        </motion.div>
                    </div>
                </div>
            )
        }

        // For 4 or more images
        return (
            <div className="space-y-4">
                <motion.div
                    className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[16/9]"
                    variants={imageVariants}
                >
                    <Image
                        src={aboutImages[0]}
                        alt={`${collage.name} campus`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                </motion.div>
                <div className="grid grid-cols-3 gap-4">
                    {aboutImages.slice(1, 4).map((image, index) => (
                        <motion.div
                            key={index}
                            className="relative rounded-xl overflow-hidden shadow-xl aspect-square"
                            variants={imageVariants}
                        >
                            <Image
                                src={image}
                                alt={`${collage.name} campus view ${index + 2}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 33vw, 16vw"
                            />
                        </motion.div>
                    ))}
                </div>
                {aboutImages.length > 4 && (
                    <motion.div
                        className="relative rounded-xl overflow-hidden shadow-xl aspect-[16/9]"
                        variants={imageVariants}
                    >
                        <Image
                            src={aboutImages[4]}
                            alt={`${collage.name} campus view`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    </motion.div>
                )}
            </div>
        )
    }

    return (
        <section id="about" className="relative py-20 lg:py-32 overflow-hidden">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <motion.div
                    className="text-center mb-16 lg:mb-20"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <motion.h1
                        className="text-4xl max-w-6xl mx-auto sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white"
                        variants={itemVariants}
                    >
                        About <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">{collage.name}</span>
                    </motion.h1>

                    <motion.p
                        className="text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed"
                        variants={itemVariants}
                    >
                        {aboutSectionSettings?.description || `${collage.name} is a premier institution dedicated to excellence in education, research, and innovation. Our commitment to fostering intellectual growth and professional development makes us a leader in higher education.`}
                    </motion.p>

                    <motion.div
                        className="w-32 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 mx-auto rounded-full mt-8"
                        variants={itemVariants}
                    ></motion.div>
                </motion.div>

                {/* Main Content - Split Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                    {/* Left Side - Images */}
                    <motion.div
                        className="order-2 lg:order-1"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {renderImages()}
                    </motion.div>

                    {/* Right Side - Content */}
                    <motion.div
                        className="order-1 lg:order-2 space-y-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {/* Markdown Content */}
                        <motion.div
                            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700"
                            variants={contentVariants}
                        >
                            <h2 className="text-2xl font-bold text-white mb-6">
                                {aboutSectionSettings?.title || `Welcome to ${collage.name}`}
                            </h2>

                            <div className="text-slate-300 leading-relaxed space-y-4">
                                {aboutSection?.content ? (
                                    <MarkdownPreview content={aboutSection.content} />
                                ) : (
                                    <p>
                                        {aboutSectionSettings?.description || `${collage.name} stands as a beacon of academic excellence, 
                                        offering cutting-edge programs designed to prepare students for the challenges of tomorrow. 
                                        Our institution combines traditional values with modern innovation to create an unparalleled 
                                        learning experience.`}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
                <div className="mt-16">

                    {/* Academic Features Grid */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        variants={contentVariants}
                    >
                        {academicFeatures.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors duration-300"
                                variants={contentVariants}
                            >
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        <feature.icon className="h-8 w-8 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-2">
                                            {feature.title}
                                        </h3>
                                        <p className="text-slate-300 text-sm leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default AboutSection