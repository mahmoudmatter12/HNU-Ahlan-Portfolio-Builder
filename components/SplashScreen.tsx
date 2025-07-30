"use client"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, GraduationCap, LayoutDashboard, Library, NotebookPen, X } from "lucide-react"
import { useEffect, useState } from "react"

interface SplashScreenProps {
    onComplete?: () => void
    onSkip?: () => void
}

export default function SplashScreen({ onComplete, onSkip }: SplashScreenProps) {
    const [progress, setProgress] = useState(0)
    const [showContent, setShowContent] = useState(false)
    const [isCompleting, setIsCompleting] = useState(false)

    useEffect(() => {
        // Simulate loading progress
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    // Trigger completion after progress reaches 100%
                    setTimeout(() => {
                        setIsCompleting(true)
                        setTimeout(() => {
                            onComplete?.()
                        }, 500) // Wait for exit animation
                    }, 500)
                    return 100
                }
                return prev + Math.floor(Math.random() * 10) + 1
            })
        }, 300)

        // Show content after a brief delay
        const timeout = setTimeout(() => {
            setShowContent(true)
        }, 500)

        return () => {
            clearInterval(interval)
            clearTimeout(timeout)
        }
    }, [onComplete])

    const handleSkip = () => {
        setIsCompleting(true)
        setTimeout(() => {
            onSkip?.()
        }, 300)
    }

    return (
        <AnimatePresence>
            {!isCompleting && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-slate-900 p-4"
                >
                    {/* Skip button */}
                    <motion.button
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        onClick={handleSkip}
                        className="absolute top-4 right-4 z-20 rounded-full bg-slate-800/50 p-2 text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </motion.button>

                    {/* Background elements */}
                    <div className="absolute inset-0 overflow-hidden opacity-20">
                        <div className="absolute -left-[20%] -top-[20%] h-[60%] w-[60%] rounded-full bg-blue-500/20 blur-3xl" />
                        <div className="absolute -right-[20%] -bottom-[20%] h-[60%] w-[60%] rounded-full bg-slate-700/20 blur-3xl" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center text-center">
                        {showContent && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="mb-8 flex flex-col items-center"
                                >
                                    <motion.div
                                        animate={{
                                            rotate: [0, 15, -15, 0],
                                            y: [0, -10, 0]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            repeatType: "reverse",
                                            ease: "easeInOut"
                                        }}
                                    >
                                        <GraduationCap className="h-16 w-16 text-blue-400" />
                                    </motion.div>
                                    <motion.h1
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.2 }}
                                        className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl"
                                    >
                                        <span className="bg-gradient-to-r from-blue-400 to-slate-200 bg-clip-text text-transparent">
                                            AcademiaPort
                                        </span>
                                    </motion.h1>
                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.4 }}
                                        className="mt-4 max-w-2xl text-lg text-slate-300"
                                    >
                                        Building your academic legacy
                                    </motion.p>
                                </motion.div>

                                {/* Progress bar */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.6 }}
                                    className="mt-8 w-full max-w-md"
                                >
                                    <div className="mb-2 flex justify-between text-sm text-slate-300">
                                        <span>Loading your academic portfolio...</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 0.3 }}
                                            className="h-full bg-gradient-to-r from-blue-500 to-blue-300"
                                        />
                                    </div>
                                </motion.div>
                            </>
                        )}

                        {/* Floating academic icons */}
                        {[...Array(8)].map((_, i) => {
                            const icons = [BookOpen, Library, NotebookPen, LayoutDashboard]
                            const Icon = icons[i % icons.length]
                            return (
                                <motion.div
                                    key={i}
                                    animate={{
                                        opacity: [0, 0.5, 0],
                                        y: [0, -50],
                                        rotate: [0, 180],
                                    }}
                                    transition={{
                                        duration: 4 + Math.random() * 6,
                                        delay: Math.random() * 3,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                    }}
                                    className="absolute text-blue-400/30"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                    }}
                                >
                                    <Icon className="h-8 w-8" />
                                </motion.div>
                            )
                        })}

                        {/* Grid pattern */}
                        <div className="absolute inset-0 -z-10 overflow-hidden opacity-10">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-blue-500/10"></div>
                            <div className="h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2 transform bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                        </div>
                    </div>

                    {/* Light effects */}
                    <div className="absolute top-0 left-0 right-0 h-1/4 bg-gradient-to-b from-white/5 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-white/5 to-transparent"></div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}