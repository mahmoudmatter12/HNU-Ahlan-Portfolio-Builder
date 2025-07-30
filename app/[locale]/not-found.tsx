"use client"
import { motion } from "framer-motion"
import { GraduationCap, Library } from "lucide-react"
import Link from "next/link"
import BackgroundDecorations from "@/components/BackgroundDecorations"

export default function NotFound() {
  return (
    <BackgroundDecorations>
      <div className="relative flex h-screen w-full flex-col items-center justify-center p-4">
        <div className="relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 flex items-center justify-center rounded-full bg-blue-500/10 px-6 py-2 text-sm font-medium text-blue-400 ring-1 ring-inset ring-blue-500/20"
          >
            <GraduationCap className="mr-2 h-4 w-4" />
            404 - Lecture Not Found
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl font-bold tracking-tight text-white sm:text-7xl md:text-8xl"
          >
            <span className="bg-gradient-to-r from-blue-400 to-slate-200 bg-clip-text text-transparent">
              Page Missing
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-2xl text-lg text-slate-300"
          >
            This page appears to be absent from our academic records. Perhaps it&apos;s been archived.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10"
          >
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-2 rounded-full bg-blue-500/10 px-6 py-3 text-blue-400 backdrop-blur-sm transition-all hover:bg-blue-500/20"
              >
                <Library className="h-5 w-5" />
                <span>Return to Library</span>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>
    </BackgroundDecorations>
  )
}