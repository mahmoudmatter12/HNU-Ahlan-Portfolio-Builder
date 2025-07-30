import React from 'react'
import { College } from '@/types/Collage'
import { University } from '@/types/uni'
import { motion } from 'framer-motion'
import type { HeroSectionSettings } from '@/types/section'
import Image from 'next/image'
import { BackgroundLines } from '@/components/aceternity-ui/background-lines'

interface HeroSectionProps {
    collage: College
    uni: University | null
}

function HeroSection({ collage, uni }: HeroSectionProps) {

    // Find the HERO section and extract settings
    const heroSection = collage.sections.find(
        (section) => section.sectionType === 'HERO'
    )
    const settings = heroSection?.settings as HeroSectionSettings | undefined
    const catchphrase = settings?.catchphrase || 'Where Innovation Meets Technology'
    const backgroundImage = settings?.backgroundImage || '/home.jpg'

    // Tech-focused phrases that rotate or could be customized
    const techPhrases = [
        "Shaping the Future of Technology",
        "Empowering Digital Transformation",
        "Bridging Theory and Practice",
        "Cultivating Tech Leaders",
        "Driving Innovation in Computing"
    ]

    return (
        <div
            className="relative min-h-screen flex items-center justify-center hero-section overflow-hidden"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Overlay for better text contrast */}
            <div className="absolute inset-0 bg-[#051d40]/70 z-0" />

            {/* College logo - responsive positioning and sizing */}
            {collage.logoUrl && (
                <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-20 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 p-1 sm:p-2 rounded-lg shadow-lg bg-white/10 backdrop-blur-sm">
                    <Image
                        src={collage.logoUrl}
                        alt={`${collage.name} Logo`}
                        width={128}
                        height={128}
                        className="object-contain w-full h-full"
                    />
                </div>
            )}

            <BackgroundLines className="absolute inset-0 w-full h-full opacity-40">{null}</BackgroundLines>

            {/* Main content container - responsive padding and max-width */}
            <div className="relative z-10 text-center w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-24">
                <motion.h1
                    className="leading-tight"
                    style={{ color: 'white' }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 font-light">Welcome to</span>
                    <div className="flex flex-col items-center justify-center gap-1 sm:gap-2">
                        <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-[#006bb6] font-bold leading-tight">{uni?.name}</span>
                        <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium leading-tight">{collage.name}</span>
                    </div>
                </motion.h1>

                <motion.p
                    className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-6 sm:mb-8 font-medium"
                    style={{ color: 'white' }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {catchphrase}
                </motion.p>

                <motion.div
                    className="text-sm sm:text-base md:text-lg lg:text-xl italic text-white/90 mb-8 sm:mb-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    &quot;{techPhrases[Math.floor(Math.random() * techPhrases.length)]}&quot;
                </motion.div>

                {/* CTA Buttons - responsive layout and sizing */}
                <motion.div
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full max-w-md sm:max-w-lg mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    <button className="w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 text-sm sm:text-base lg:text-lg bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors shadow-lg">
                        Explore Programs
                    </button>
                    <button className="w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 text-sm sm:text-base lg:text-lg bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-lg font-medium transition-colors backdrop-blur-sm">
                        Meet Our Faculty
                    </button>
                </motion.div>
            </div>
        </div>
    )
}

export default HeroSection