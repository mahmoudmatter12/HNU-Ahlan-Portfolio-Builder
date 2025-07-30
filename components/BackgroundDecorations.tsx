"use client"
import { motion } from "framer-motion"
import { BookOpen, GraduationCap, Library, NotebookPen, Globe, Users, Award, Lightbulb, Target, Zap } from "lucide-react"
import { ReactNode } from "react"

export default function BackgroundDecorations({ children }: { children: ReactNode }) {
    // Academic icons to use in decorations
    const academicIcons = [GraduationCap, BookOpen, Library, NotebookPen, Globe, Users, Award, Lightbulb, Target, Zap]

    return (
        <div className="relative w-full min-h-screen overflow-hidden bg-slate-900">
            {/* Enhanced base background elements */}
            <div className="fixed inset-0 overflow-hidden opacity-40 pointer-events-none">
                {/* Primary gradient orbs */}
                <div className="absolute -left-[10%] -top-[10%] h-[70%] w-[70%] rounded-full bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-cyan-500/30 blur-3xl animate-pulse" />
                <div className="absolute -right-[10%] -bottom-[10%] h-[70%] w-[70%] rounded-full bg-gradient-to-br from-slate-700/40 via-blue-600/30 to-indigo-500/30 blur-3xl animate-pulse" />

                {/* Secondary accent orbs */}
                <div className="absolute left-[20%] top-[60%] h-[40%] w-[40%] rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 blur-2xl animate-pulse" />
                <div className="absolute right-[30%] top-[20%] h-[30%] w-[30%] rounded-full bg-gradient-to-br from-orange-500/20 to-yellow-500/20 blur-2xl animate-pulse" />
            </div>

            {/* Enhanced grid pattern overlay */}
            <div className="fixed inset-0 -z-10 overflow-hidden opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-blue-500/20" />
                <div className="h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2 transform bg-[linear-gradient(to_right,rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:50px_50px]" />
            </div>

            {/* Enhanced light effects */}
            <div className="fixed top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none" />
            <div className="fixed bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white/10 via-white/5 to-transparent pointer-events-none" />

            {/* Enhanced animated floating academic icons */}
            {[...Array(15)].map((_, i) => {
                const Icon = academicIcons[i % academicIcons.length]
                const size = 8 + Math.random() * 12 // Random size between 8 and 20
                const delay = Math.random() * 5
                const duration = 20 + Math.random() * 40
                return (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            opacity: [0, 0.6, 0.3, 0.6, 0],
                            y: [0, -150, -300],
                            x: [0, (Math.random() - 0.5) * 200],
                            rotate: [0, Math.random() * 360],
                            scale: [0, 1, 1.2, 1, 0],
                        }}
                        transition={{
                            duration: duration,
                            delay: delay,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "linear",
                        }}
                        className="fixed text-blue-400/40 pointer-events-none"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            fontSize: `${size}px`,
                        }}
                    >
                        <Icon className="w-full h-full" />
                    </motion.div>
                )
            })}

            {/* Enhanced animated dots with different colors */}
            {[...Array(40)].map((_, i) => (
                <motion.div
                    key={`dot-${i}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: [0.2, 0.6, 0.2],
                        y: [0, (Math.random() - 0.5) * 30],
                        x: [0, (Math.random() - 0.5) * 20],
                        scale: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 4 + Math.random() * 8,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: Math.random() * 3,
                    }}
                    className="fixed rounded-full pointer-events-none"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        width: `${2 + Math.random() * 4}px`,
                        height: `${2 + Math.random() * 4}px`,
                        backgroundColor: i % 4 === 0 ? 'rgba(59, 130, 246, 0.6)' :
                            i % 4 === 1 ? 'rgba(147, 51, 234, 0.6)' :
                                i % 4 === 2 ? 'rgba(34, 197, 94, 0.6)' :
                                    'rgba(245, 158, 11, 0.6)',
                    }}
                />
            ))}

            {/* Floating geometric shapes */}
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={`shape-${i}`}
                    animate={{
                        opacity: [0.1, 0.3, 0.1],
                        y: [0, -100],
                        rotate: [0, 360],
                        scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                        duration: 15 + Math.random() * 20,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: Math.random() * 5,
                    }}
                    className="fixed pointer-events-none"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        width: `${20 + Math.random() * 40}px`,
                        height: `${20 + Math.random() * 40}px`,
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: i % 2 === 0 ? '50%' : '0%',
                        transform: i % 2 === 0 ? 'rotate(45deg)' : 'rotate(0deg)',
                    }}
                />
            ))}

            {/* Enhanced corner decorations */}
            <div className="fixed left-0 top-0 h-20 w-20 pointer-events-none">
                <motion.div
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute left-6 h-16 w-1 bg-gradient-to-b from-blue-400 to-transparent"
                />
                <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute left-0 top-0 h-6 w-12 bg-gradient-to-r from-blue-500/50 to-transparent"
                />
            </div>
            <div className="fixed right-0 top-0 h-20 w-20 pointer-events-none">
                <motion.div
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute right-6 h-16 w-1 bg-gradient-to-b from-purple-400 to-transparent"
                />
                <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute right-0 top-0 h-6 w-12 bg-gradient-to-l from-purple-500/50 to-transparent"
                />
            </div>

            {/* Animated connection lines */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={`line-${i}`}
                    animate={{
                        opacity: [0.1, 0.4, 0.1],
                        scaleX: [0, 1, 0],
                    }}
                    transition={{
                        duration: 8 + Math.random() * 12,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                    }}
                    className="fixed h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent pointer-events-none"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        width: `${100 + Math.random() * 200}px`,
                        transform: `rotate(${Math.random() * 360}deg)`,
                    }}
                />
            ))}

            {/* Main content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    )
}