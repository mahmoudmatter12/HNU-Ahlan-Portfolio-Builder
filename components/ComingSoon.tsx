"use client"
import { motion } from "framer-motion"
import { Clock, NotebookPen, PenTool } from "lucide-react"
import BackgroundDecorations from "@/components/BackgroundDecorations"

export default function ComingSoon() {
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
            <Clock className="mr-2 h-4 w-4" />
            Coming Soon
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl font-bold tracking-tight text-white sm:text-7xl md:text-8xl"
          >
            <span className="bg-gradient-to-r from-blue-400 to-slate-200 bg-clip-text text-transparent">
              Under Construction
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-2xl text-lg text-slate-300"
          >
            Our academic team is currently preparing this section. Check back soon for updates!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12"
          >
            <div className="flex items-center justify-center gap-3 rounded-xl bg-slate-800/50 p-6 backdrop-blur-sm">
              <NotebookPen className="h-8 w-8 text-blue-400" />
              <PenTool className="h-8 w-8 text-blue-400" />
              <NotebookPen className="h-8 w-8 text-blue-400" />
            </div>
          </motion.div>
        </div>
      </div>
    </BackgroundDecorations>
  )
}